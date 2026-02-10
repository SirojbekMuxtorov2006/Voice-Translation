require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { OpenAI } = require('openai');
const fs = require('fs');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:5173',
		methods: ['GET', 'POST'],
		credentials: true,
		allowedHeaders: ['Content-Type'],
	},
	transports: ['websocket', 'polling'],
	allowEIO3: true,
});

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

io.on('connection', socket => {
	console.log('a user connected');

	// Handle connection errors
	socket.on('error', error => {
		console.error('Socket error:', error);
	});

	socket.on('audio', async audioData => {
		console.log('audio received');
		let filePath = null;

		try {
			// Handle both ArrayBuffer and Buffer formats
			let buffer;
			if (Buffer.isBuffer(audioData)) {
				buffer = audioData;
			} else if (audioData instanceof ArrayBuffer) {
				buffer = Buffer.from(audioData);
			} else if (audioData.data) {
				// Handle if it's wrapped in an object
				buffer = Buffer.isBuffer(audioData.data) ? audioData.data : Buffer.from(audioData.data);
			} else {
				buffer = Buffer.from(audioData);
			}

			if (!buffer || buffer.length === 0) {
				throw new Error('Invalid audio data received');
			}

			filePath = `audio-${Date.now()}-${Math.random().toString(36).substring(7)}.webm`;
			fs.writeFileSync(filePath, buffer);
			console.log('Audio file saved:', filePath);

			const transcription = await openai.audio.transcriptions.create({
				file: fs.createReadStream(filePath),
				model: 'whisper-1',
			});

			const transcribedText = transcription.text;
			console.log('Transcribed text:', transcribedText);

			if (!transcribedText || transcribedText.trim().length === 0) {
				throw new Error('No transcription text received');
			}

			// Translate using OpenAI chat completion
			const translationResponse = await openai.chat.completions.create({
				model: 'gpt-4o-mini',
				messages: [
					{ role: 'system', content: 'Translate to English' },
					{ role: 'user', content: transcribedText },
				],
				temperature: 0.3,
				max_tokens: 500,
			});

			const translatedText =
				translationResponse.choices[0]?.message?.content?.trim() || 'Translation unavailable';

			socket.emit('conversion', {
				original: transcribedText,
				translated: translatedText,
			});

			// Clean up the temporary audio file
			if (filePath && fs.existsSync(filePath)) {
				fs.unlinkSync(filePath);
				console.log('Temporary file deleted:', filePath);
			}
		} catch (err) {
			console.error('Error processing audio:', err);

			// Clean up the temporary file even if there's an error
			if (filePath && fs.existsSync(filePath)) {
				try {
					fs.unlinkSync(filePath);
					console.log('Cleaned up file after error:', filePath);
				} catch (cleanupErr) {
					console.error('Error cleaning up file:', cleanupErr);
				}
			}

			// Send error message to client without disconnecting
			socket.emit('conversion', {
				original: 'Error',
				translated: 'Failed to process audio. Please try again.',
			});
		}
	});

	socket.on('disconnect', reason => {
		console.log('a user disconnected. Reason:', reason);
	});
});

server.listen(3000, () => {
	console.log('server is running on port 3000');
});
