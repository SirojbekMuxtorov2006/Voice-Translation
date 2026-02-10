import { useRef } from 'react';

type UseMediaRecorderProps = {
	onAudioChunk: (audio: Blob) => void;
};

export function useMediaRecorder({ onAudioChunk }: UseMediaRecorderProps) {
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);

			mediaRecorder.ondataavailable = (e: BlobEvent) => {
				onAudioChunk(e.data);
			};
			mediaRecorder.start();
			mediaRecorderRef.current = mediaRecorder;
		} catch (error) {
			console.error('Error starting recording:', error);
		}
	};

	const stopRecording = () => {
		mediaRecorderRef.current?.stop();
	};

	return { startRecording, stopRecording };
}
