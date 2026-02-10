import { Button, Box, CircularProgress } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { useState } from 'react';

type RecordButtonProps = {
	startRecording: () => void;
	stopRecording: () => void;
};

export default function RecordButton({ startRecording, stopRecording }: RecordButtonProps) {
	const [isRecording, setIsRecording] = useState(false);

	const handleToggle = () => {
		if (isRecording) {
			stopRecording();
			setIsRecording(false);
		} else {
			startRecording();
			setIsRecording(true);
		}
	};

	return (
		<Box
			sx={{
				position: 'relative',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			{/* Animated rings when recording */}
			{isRecording && (
				<>
					<Box
						sx={{
							position: 'absolute',
							width: '140px',
							height: '140px',
							borderRadius: '50%',
							border: '3px solid rgba(239, 68, 68, 0.4)',
							animation: 'ripple 2s ease-out infinite',
						}}
					/>
					<Box
						sx={{
							position: 'absolute',
							width: '140px',
							height: '140px',
							borderRadius: '50%',
							border: '3px solid rgba(239, 68, 68, 0.3)',
							animation: 'ripple 2s ease-out 0.5s infinite',
						}}
					/>
					<Box
						sx={{
							position: 'absolute',
							width: '140px',
							height: '140px',
							borderRadius: '50%',
							border: '3px solid rgba(239, 68, 68, 0.2)',
							animation: 'ripple 2s ease-out 1s infinite',
						}}
					/>
				</>
			)}

			{/* Glow effect */}
			<Box
				sx={{
					position: 'absolute',
					width: isRecording ? '180px' : '160px',
					height: isRecording ? '180px' : '160px',
					borderRadius: '50%',
					background: isRecording
						? 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)'
						: 'radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%)',
					filter: 'blur(20px)',
					transition: 'all 0.3s ease',
					animation: isRecording ? 'pulse 2s ease-in-out infinite' : 'none',
				}}
			/>

			{/* Main button */}
			<Button
				onClick={handleToggle}
				sx={{
					position: 'relative',
					width: '120px',
					height: '120px',
					borderRadius: '50%',
					background: isRecording
						? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
						: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					color: 'white',
					border: '4px solid rgba(255, 255, 255, 0.2)',
					boxShadow: isRecording
						? '0 8px 32px rgba(239, 68, 68, 0.5), inset 0 2px 8px rgba(255, 255, 255, 0.2)'
						: '0 8px 32px rgba(102, 126, 234, 0.5), inset 0 2px 8px rgba(255, 255, 255, 0.2)',
					transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '0.25rem',
					'&:hover': {
						transform: 'scale(1.05)',
						boxShadow: isRecording
							? '0 12px 40px rgba(239, 68, 68, 0.6), inset 0 2px 8px rgba(255, 255, 255, 0.3)'
							: '0 12px 40px rgba(102, 126, 234, 0.6), inset 0 2px 8px rgba(255, 255, 255, 0.3)',
						border: '4px solid rgba(255, 255, 255, 0.3)',
					},
					'&:active': {
						transform: 'scale(0.98)',
					},
					'&::before': {
						content: '""',
						position: 'absolute',
						top: '-4px',
						left: '-4px',
						right: '-4px',
						bottom: '-4px',
						borderRadius: '50%',
						background: isRecording
							? 'linear-gradient(135deg, #ef4444, #dc2626)'
							: 'linear-gradient(135deg, #667eea, #764ba2)',
						opacity: 0,
						transition: 'opacity 0.3s ease',
						zIndex: -1,
					},
					'&:hover::before': {
						opacity: 0.3,
						animation: 'rotate 3s linear infinite',
					},
				}}
			>
				{/* Icon */}
				<Box
					sx={{
						fontSize: '3rem',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						animation: isRecording ? 'bounce 1s ease-in-out infinite' : 'none',
					}}
				>
					{isRecording ? (
						<StopIcon sx={{ fontSize: '3rem' }} />
					) : (
						<MicIcon sx={{ fontSize: '3rem' }} />
					)}
				</Box>

				{/* Text */}
				<Box
					sx={{
						fontSize: '0.85rem',
						fontWeight: 700,
						textTransform: 'uppercase',
						letterSpacing: '0.1em',
						marginTop: '0.25rem',
					}}
				>
					{isRecording ? 'Stop' : 'Record'}
				</Box>

				{/* Recording progress indicator */}
				{isRecording && (
					<CircularProgress
						size={140}
						thickness={2}
						sx={{
							position: 'absolute',
							top: '-14px',
							left: '-14px',
							color: 'rgba(255, 255, 255, 0.3)',
							'& .MuiCircularProgress-circle': {
								strokeLinecap: 'round',
							},
						}}
					/>
				)}
			</Button>

			{/* Helper text */}
			<Box
				sx={{
					position: 'absolute',
					bottom: '-3rem',
					left: '50%',
					transform: 'translateX(-50%)',
					whiteSpace: 'nowrap',
					opacity: isRecording ? 1 : 0,
					transition: 'opacity 0.3s ease',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: '0.5rem',
						padding: '0.5rem 1rem',
						background: 'rgba(239, 68, 68, 0.1)',
						border: '1px solid rgba(239, 68, 68, 0.3)',
						borderRadius: '20px',
						backdropFilter: 'blur(10px)',
					}}
				>
					<Box
						sx={{
							width: '8px',
							height: '8px',
							borderRadius: '50%',
							background: '#ef4444',
							animation: 'blink 1s ease-in-out infinite',
						}}
					/>
					<Box
						sx={{
							color: 'rgba(255, 255, 255, 0.9)',
							fontSize: '0.8rem',
							fontWeight: 600,
							letterSpacing: '0.05em',
						}}
					>
						Recording in progress...
					</Box>
				</Box>
			</Box>

			<style>{`
				@keyframes ripple {
					0% {
						transform: scale(1);
						opacity: 1;
					}
					100% {
						transform: scale(1.8);
						opacity: 0;
					}
				}

				@keyframes pulse {
					0%, 100% {
						opacity: 1;
						transform: scale(1);
					}
					50% {
						opacity: 0.8;
						transform: scale(1.05);
					}
				}

				@keyframes bounce {
					0%, 100% {
						transform: translateY(0);
					}
					50% {
						transform: translateY(-5px);
					}
				}

				@keyframes blink {
					0%, 100% {
						opacity: 1;
					}
					50% {
						opacity: 0.3;
					}
				}

				@keyframes rotate {
					from {
						transform: rotate(0deg);
					}
					to {
						transform: rotate(360deg);
					}
				}
			`}</style>
		</Box>
	);
}
