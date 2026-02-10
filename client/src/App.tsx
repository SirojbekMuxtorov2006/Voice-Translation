import { useState, useMemo } from 'react';
import { Box, Typography, Container, Grow, IconButton, Tooltip } from '@mui/material';
import RecordButton from './components/RecordButton';
import List from './components/List';
import { useMediaRecorder } from './hooks/useMediaRecorder';
import { useSocket } from './hooks/useSocket';
import type { Transcript } from './types/transcript';

function App() {
	const [transcripts, setTranscripts] = useState<Transcript[]>([]);
	const [isRecording, setIsRecording] = useState(false);

	const particles = useMemo(() => {
		return [...Array(20)].map((_, i) => ({
			id: i,
			width: Math.random() * 4 + 2,
			height: Math.random() * 4 + 2,
			r: Math.random() * 100 + 155,
			g: Math.random() * 100 + 100,
			top: Math.random() * 100,
			left: Math.random() * 100,
			duration: Math.random() * 10 + 10,
			delay: Math.random() * 5,
			opacity: Math.random() * 0.3 + 0.1,
		}));
	}, []);

	const { sendAudio } = useSocket({
		onConversion: (transcript: Transcript) => {
			setTranscripts(prev => {
				let matchingIndex = -1;
				for (let i = prev.length - 1; i >= 0; i--) {
					const item = prev[i];
					if (item.original === transcript.original && item.translated === 'Translating...') {
						matchingIndex = i;
						break;
					}
				}
				if (matchingIndex === -1) return prev;
				return prev.map((item, index) =>
					index === matchingIndex ? { ...transcript, id: item.id } : item,
				);
			});
		},
	});

	const { startRecording, stopRecording } = useMediaRecorder({
		onAudioChunk: (audio: Blob) => {
			const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
			setTranscripts(prev => [
				...prev,
				{ id, original: 'Listening...', translated: 'Translating...' },
			]);
			sendAudio(audio);
		},
	});

	const handleStartRecording = () => {
		setIsRecording(true);
		startRecording();
	};

	const handleStopRecording = () => {
		setIsRecording(false);
		stopRecording();
	};

	const handleClearAll = () => {
		setTranscripts([]);
	};

	return (
		<Box
			sx={{
				minHeight: '100vh',
				width: '100%',
				position: 'relative',
				overflow: 'auto',
				background: 'linear-gradient(135deg, #0a0118 0%, #1a0b2e 50%, #16001e 100%)',
				'&::before': {
					content: '""',
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `
						radial-gradient(circle at 15% 20%, rgba(138, 43, 226, 0.15) 0%, transparent 50%),
						radial-gradient(circle at 85% 80%, rgba(75, 0, 130, 0.15) 0%, transparent 50%),
						radial-gradient(circle at 50% 50%, rgba(148, 0, 211, 0.1) 0%, transparent 60%),
						radial-gradient(circle at 30% 70%, rgba(102, 126, 234, 0.1) 0%, transparent 50%)
					`,
					animation: 'backgroundPulse 15s ease-in-out infinite',
					zIndex: 0,
					pointerEvents: 'none',
				},
				'&::after': {
					content: '""',
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundImage: `
						repeating-linear-gradient(
							0deg,
							rgba(138, 43, 226, 0.03) 0px,
							transparent 2px,
							transparent 60px,
							rgba(138, 43, 226, 0.03) 61px
						),
						repeating-linear-gradient(
							90deg,
							rgba(138, 43, 226, 0.03) 0px,
							transparent 2px,
							transparent 60px,
							rgba(138, 43, 226, 0.03) 61px
						)
					`,
					zIndex: 0,
					pointerEvents: 'none',
					opacity: 0.5,
				},
			}}
		>
			{/* Floating particles */}
			<Box
				sx={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 0,
					pointerEvents: 'none',
					overflow: 'hidden',
				}}
			>
				{particles.map(particle => (
					<Box
						key={particle.id}
						sx={{
							position: 'absolute',
							width: `${particle.width}px`,
							height: `${particle.height}px`,
							borderRadius: '50%',
							background: `rgba(${particle.r}, ${particle.g}, 255, ${particle.opacity})`,
							top: `${particle.top}%`,
							left: `${particle.left}%`,
							animation: `float ${particle.duration}s ease-in-out infinite`,
							animationDelay: `${particle.delay}s`,
							boxShadow: '0 0 10px rgba(138, 43, 226, 0.5)',
						}}
					/>
				))}
			</Box>

			<Container
				maxWidth='lg'
				sx={{
					position: 'relative',
					zIndex: 1,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					minHeight: '100vh',
					padding: { xs: '2rem 1rem', sm: '3rem 2rem', md: '4rem 3rem' },
				}}
			>
				{/* Header Section */}
				<Box
					sx={{
						textAlign: 'center',
						marginBottom: { xs: '3rem', sm: '4rem' },
						marginTop: { xs: '1rem', sm: '2rem' },
						position: 'relative',
						animation: 'fadeInDown 0.8s ease-out',
					}}
				>
					{/* Decorative elements */}
					<Box
						sx={{
							position: 'absolute',
							top: '-50px',
							left: '50%',
							transform: 'translateX(-50%)',
							width: '300px',
							height: '300px',
							background: 'radial-gradient(circle, rgba(138, 43, 226, 0.2) 0%, transparent 70%)',
							filter: 'blur(60px)',
							animation: 'glow 4s ease-in-out infinite',
							zIndex: -1,
						}}
					/>

					<Typography
						variant='h1'
						sx={{
							background:
								'linear-gradient(135deg, #667eea 0%, #8a2be2 35%, #da70d6 65%, #f093fb 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							fontSize: { xs: '2.8rem', sm: '4rem', md: '5rem' },
							fontWeight: 900,
							letterSpacing: '-0.04em',
							marginBottom: '1.2rem',
							filter: 'drop-shadow(0 0 30px rgba(138, 43, 226, 0.5))',
							animation: 'titleGlow 3s ease-in-out infinite',
							textShadow: '0 0 80px rgba(138, 43, 226, 0.3)',
							position: 'relative',
							'&::before': {
								content: '"✨"',
								position: 'absolute',
								left: { xs: '-30px', sm: '-50px' },
								top: '50%',
								transform: 'translateY(-50%)',
								fontSize: { xs: '1.5rem', sm: '2rem' },
								animation: 'sparkle 2s ease-in-out infinite',
							},
							'&::after': {
								content: '"✨"',
								position: 'absolute',
								right: { xs: '-30px', sm: '-50px' },
								top: '50%',
								transform: 'translateY(-50%)',
								fontSize: { xs: '1.5rem', sm: '2rem' },
								animation: 'sparkle 2s ease-in-out infinite 1s',
							},
						}}
					>
						Voice Translator
					</Typography>

					<Typography
						variant='subtitle1'
						sx={{
							color: 'rgba(255, 255, 255, 0.8)',
							fontSize: { xs: '1.1rem', sm: '1.3rem' },
							fontWeight: 400,
							letterSpacing: '0.03em',
							maxWidth: '650px',
							margin: '0 auto',
							textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
							lineHeight: 1.6,
						}}
					>
						🌍 Speak naturally, translate instantly with AI magic
					</Typography>

					{/* Feature badges */}
					<Box
						sx={{
							display: 'flex',
							gap: '1rem',
							justifyContent: 'center',
							flexWrap: 'wrap',
							marginTop: '2rem',
						}}
					>
						{['🚀 Fast', '🎯 Accurate', '🔒 Secure'].map((feature, index) => (
							<Box
								key={index}
								sx={{
									padding: '0.5rem 1.2rem',
									background: 'rgba(138, 43, 226, 0.15)',
									border: '1px solid rgba(138, 43, 226, 0.4)',
									borderRadius: '30px',
									backdropFilter: 'blur(10px)',
									fontSize: '0.85rem',
									fontWeight: 600,
									color: 'rgba(255, 255, 255, 0.9)',
									animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
									boxShadow: '0 4px 15px rgba(138, 43, 226, 0.2)',
									transition: 'all 0.3s ease',
									'&:hover': {
										transform: 'translateY(-3px)',
										boxShadow: '0 6px 20px rgba(138, 43, 226, 0.4)',
										background: 'rgba(138, 43, 226, 0.25)',
									},
								}}
							>
								{feature}
							</Box>
						))}
					</Box>

					{/* Status Indicator */}
					{isRecording && (
						<Grow in timeout={300}>
							<Box
								sx={{
									marginTop: '2.5rem',
									display: 'inline-flex',
									alignItems: 'center',
									gap: '1rem',
									padding: '1rem 2rem',
									background:
										'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)',
									border: '2px solid rgba(239, 68, 68, 0.5)',
									borderRadius: '50px',
									backdropFilter: 'blur(20px)',
									boxShadow:
										'0 8px 32px rgba(239, 68, 68, 0.3), inset 0 2px 8px rgba(255, 255, 255, 0.1)',
								}}
							>
								<Box
									sx={{
										width: '14px',
										height: '14px',
										borderRadius: '50%',
										background: '#ef4444',
										animation: 'recordPulse 1.2s ease-in-out infinite',
										boxShadow: '0 0 20px #ef4444',
									}}
								/>
								<Typography
									sx={{
										color: '#fff',
										fontSize: '1rem',
										fontWeight: 700,
										letterSpacing: '0.1em',
										textTransform: 'uppercase',
									}}
								>
									● Recording
								</Typography>
								<Box
									sx={{
										width: '14px',
										height: '14px',
										borderRadius: '50%',
										background: '#ef4444',
										animation: 'recordPulse 1.2s ease-in-out infinite 0.6s',
										boxShadow: '0 0 20px #ef4444',
									}}
								/>
							</Box>
						</Grow>
					)}
				</Box>

				{/* Record Button Section */}
				<Box
					sx={{
						marginBottom: { xs: '4rem', sm: '5rem' },
						position: 'relative',
						animation: 'scaleIn 1s ease-out 0.3s both',
					}}
				>
					<RecordButton startRecording={handleStartRecording} stopRecording={handleStopRecording} />
				</Box>

				{/* Transcripts Section */}
				<Box
					sx={{
						width: '100%',
						maxWidth: '950px',
						flex: 1,
						animation: 'fadeIn 1.2s ease-out 0.6s both',
					}}
				>
					{transcripts.length === 0 ? (
						<Box
							sx={{
								textAlign: 'center',
								padding: { xs: '3rem 1.5rem', sm: '5rem 3rem' },
								background:
									'linear-gradient(135deg, rgba(138, 43, 226, 0.08) 0%, rgba(75, 0, 130, 0.05) 100%)',
								borderRadius: '30px',
								border: '2px solid rgba(138, 43, 226, 0.2)',
								backdropFilter: 'blur(20px)',
								boxShadow:
									'0 8px 32px rgba(0, 0, 0, 0.3), inset 0 2px 16px rgba(255, 255, 255, 0.05)',
								position: 'relative',
								overflow: 'hidden',
								'&::before': {
									content: '""',
									position: 'absolute',
									top: 0,
									left: '-100%',
									width: '100%',
									height: '100%',
									background:
										'linear-gradient(90deg, transparent, rgba(138, 43, 226, 0.1), transparent)',
									animation: 'shimmer 3s infinite',
								},
							}}
						>
							<Box
								sx={{
									width: '100px',
									height: '100px',
									margin: '0 auto 2rem',
									borderRadius: '50%',
									background:
										'linear-gradient(135deg, rgba(138, 43, 226, 0.3), rgba(75, 0, 130, 0.2))',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									border: '3px solid rgba(138, 43, 226, 0.5)',
									boxShadow:
										'0 0 40px rgba(138, 43, 226, 0.4), inset 0 2px 10px rgba(255, 255, 255, 0.1)',
									animation: 'bounce 3s ease-in-out infinite',
								}}
							>
								<Typography sx={{ fontSize: '3.5rem' }}>🎤</Typography>
							</Box>
							<Typography
								sx={{
									color: 'rgba(255, 255, 255, 0.9)',
									fontSize: { xs: '1.1rem', sm: '1.3rem' },
									fontWeight: 400,
									marginBottom: '1rem',
									lineHeight: 1.6,
								}}
							>
								Ready to start translating?
							</Typography>
							<Typography
								sx={{
									color: 'rgba(255, 255, 255, 0.6)',
									fontSize: { xs: '0.95rem', sm: '1.05rem' },
									fontWeight: 300,
									maxWidth: '500px',
									margin: '0 auto',
								}}
							>
								Press the record button above and speak clearly. Your voice will be translated
								instantly!
							</Typography>
						</Box>
					) : (
						<Box>
							{/* Clear All Button */}
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'flex-end',
									marginBottom: '1.5rem',
								}}
							>
								<Tooltip title='Clear all translations' arrow>
									<IconButton
										onClick={handleClearAll}
										sx={{
											background: 'rgba(239, 68, 68, 0.1)',
											border: '1px solid rgba(239, 68, 68, 0.3)',
											color: 'rgba(239, 68, 68, 0.9)',
											padding: '0.75rem 1.5rem',
											borderRadius: '30px',
											fontSize: '0.85rem',
											fontWeight: 600,
											gap: '0.5rem',
											transition: 'all 0.3s ease',
											'&:hover': {
												background: 'rgba(239, 68, 68, 0.2)',
												transform: 'translateY(-2px)',
												boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
											},
										}}
									>
										<span>🗑️</span>
										<span>Clear All</span>
									</IconButton>
								</Tooltip>
							</Box>
							<List transcripts={transcripts} />
						</Box>
					)}
				</Box>
			</Container>

			<style>{`
				@keyframes fadeInDown {
					from {
						opacity: 0;
						transform: translateY(-40px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes fadeIn {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}

				@keyframes scaleIn {
					from {
						opacity: 0;
						transform: scale(0.9);
					}
					to {
						opacity: 1;
						transform: scale(1);
					}
				}

				@keyframes titleGlow {
					0%, 100% {
						filter: drop-shadow(0 0 30px rgba(138, 43, 226, 0.5));
					}
					50% {
						filter: drop-shadow(0 0 50px rgba(218, 112, 214, 0.7));
					}
				}

				@keyframes glow {
					0%, 100% {
						opacity: 0.8;
						transform: translateX(-50%) scale(1);
					}
					50% {
						opacity: 1;
						transform: translateX(-50%) scale(1.1);
					}
				}

				@keyframes backgroundPulse {
					0%, 100% {
						opacity: 1;
					}
					50% {
						opacity: 0.7;
					}
				}

				@keyframes recordPulse {
					0%, 100% {
						transform: scale(1);
						opacity: 1;
					}
					50% {
						transform: scale(1.3);
						opacity: 0.6;
					}
				}

				@keyframes sparkle {
					0%, 100% {
						opacity: 1;
						transform: translateY(-50%) scale(1);
					}
					50% {
						opacity: 0.5;
						transform: translateY(-50%) scale(1.2);
					}
				}

				@keyframes slideUp {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes float {
					0%, 100% {
						transform: translateY(0px);
					}
					50% {
						transform: translateY(-20px);
					}
				}

				@keyframes bounce {
					0%, 100% {
						transform: translateY(0);
					}
					50% {
						transform: translateY(-10px);
					}
				}

				@keyframes shimmer {
					0% {
						left: -100%;
					}
					100% {
						left: 100%;
					}
				}
			`}</style>
		</Box>
	);
}

export default App;
