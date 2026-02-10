import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import type { Transcript } from '../types/transcript';

type UseSocketProps = {
	onConversion: (transcript: Transcript) => void;
};

export function useSocket({ onConversion }: UseSocketProps) {
	const socketRef = useRef<any>(null);
	const onConversionRef = useRef(onConversion);

	useEffect(() => {
		onConversionRef.current = onConversion;
	}, [onConversion]);

	useEffect(() => {
		socketRef.current = io('http://localhost:3000', {
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionAttempts: 5,
			timeout: 20000,
		});

		socketRef.current.on('connect', () => {
			console.log('Socket connected');
		});

		socketRef.current.on('disconnect', (reason: string) => {
			console.log('Socket disconnected:', reason);
		});

		socketRef.current.on('connect_error', (error: Error) => {
			console.error('Socket connection error:', error);
		});

		socketRef.current.on('conversion', (transcript: Transcript) => {
			onConversionRef.current(transcript);
		});

		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
			}
		};
	}, []); // Empty dependency array - only connect once

	const sendAudio = useCallback((audio: Blob) => {
		if (socketRef.current && socketRef.current.connected) {
			// Convert Blob to ArrayBuffer for better Socket.io compatibility
			audio
				.arrayBuffer()
				.then(arrayBuffer => {
					socketRef.current.emit('audio', arrayBuffer);
				})
				.catch(error => {
					console.error('Error converting audio blob:', error);
				});
		} else {
			console.warn('Socket not connected, cannot send audio');
		}
	}, []);

	return { sendAudio };
}
