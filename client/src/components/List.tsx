import {
	List as MuiList,
	ListItem,
	Typography,
	Paper,
	Box,
	Fade,
	Chip,
	IconButton,
	Tooltip,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useState } from 'react';
import type { Transcript } from '../types/transcript';

type ListProps = {
	transcripts: Transcript[];
};

export default function List({ transcripts }: ListProps) {
	const [copiedId, setCopiedId] = useState<string | null>(null);

	const handleCopy = async (text: string, id: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedId(id);
			setTimeout(() => setCopiedId(null), 2000);
		} catch (err) {
			console.error('Failed to copy text:', err);
		}
	};

	const handleSpeak = (text: string) => {
		if ('speechSynthesis' in window) {
			window.speechSynthesis.cancel();
			const utterance = new SpeechSynthesisUtterance(text);
			utterance.rate = 0.9;
			utterance.pitch = 1;
			window.speechSynthesis.speak(utterance);
		}
	};

	if (transcripts.length === 0) {
		return null; // Empty state is now handled in App.tsx
	}

	return (
		<Box sx={{ position: 'relative' }}>
			{/* Header */}
			<Box
				sx={{
					marginBottom: '2rem',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Typography
					variant='h5'
					sx={{
						color: 'white',
						fontWeight: 600,
						fontSize: { xs: '1.3rem', sm: '1.5rem' },
					}}
				>
					Translations
				</Typography>
				<Chip
					label={`${transcripts.length} ${transcripts.length === 1 ? 'item' : 'items'}`}
					sx={{
						background: 'rgba(102, 126, 234, 0.2)',
						color: 'rgba(255, 255, 255, 0.9)',
						border: '1px solid rgba(102, 126, 234, 0.3)',
						fontWeight: 600,
						fontSize: '0.85rem',
					}}
				/>
			</Box>

			{/* List */}
			<MuiList
				sx={{
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					gap: '1.25rem',
					padding: 0,
				}}
			>
				{transcripts
					.slice()
					.reverse()
					.map((transcript, index) => {
						const isTranslating = transcript.translated === 'Translating...';
						const isListening = transcript.original === 'Listening...';

						return (
							<Fade
								in
								key={transcript.id}
								timeout={500}
								style={{ transitionDelay: `${index * 50}ms` }}
							>
								<ListItem
									sx={{
										padding: 0,
										animation: `slideInUp 0.5s ease-out ${index * 0.05}s both`,
									}}
								>
									<Paper
										elevation={0}
										sx={{
											width: '100%',
											padding: { xs: '1.25rem', sm: '1.5rem' },
											background:
												isListening || isTranslating
													? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(102, 126, 234, 0.1) 100%)'
													: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
											backdropFilter: 'blur(20px)',
											borderRadius: '20px',
											border:
												isListening || isTranslating
													? '1px solid rgba(139, 92, 246, 0.4)'
													: '1px solid rgba(255, 255, 255, 0.15)',
											position: 'relative',
											overflow: 'hidden',
											transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
											'&:hover': {
												transform: 'translateY(-4px)',
												boxShadow: '0 20px 40px rgba(102, 126, 234, 0.25)',
												border: '1px solid rgba(255, 255, 255, 0.25)',
												background:
													'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)',
											},
											'&::before': isTranslating
												? {
														content: '""',
														position: 'absolute',
														top: 0,
														left: '-100%',
														width: '100%',
														height: '100%',
														background:
															'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent)',
														animation: 'shimmer 2s infinite',
													}
												: {},
										}}
									>
										<Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
											{/* Original Text */}
											<Box>
												<Box
													sx={{
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'space-between',
														marginBottom: '0.75rem',
													}}
												>
													<Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
														<Box
															sx={{
																width: '6px',
																height: '6px',
																borderRadius: '50%',
																background: isListening
																	? 'linear-gradient(135deg, #8b5cf6, #667eea)'
																	: 'linear-gradient(135deg, #667eea, #764ba2)',
																animation: isListening ? 'pulse 2s ease-in-out infinite' : 'none',
															}}
														/>
														<Typography
															variant='caption'
															sx={{
																color: 'rgba(255, 255, 255, 0.7)',
																fontSize: '0.75rem',
																fontWeight: 700,
																textTransform: 'uppercase',
																letterSpacing: '0.1em',
															}}
														>
															Original
														</Typography>
													</Box>
													{!isListening && (
														<Box sx={{ display: 'flex', gap: '0.25rem' }}>
															<Tooltip title='Copy original text' arrow>
																<IconButton
																	size='small'
																	onClick={() =>
																		handleCopy(transcript.original, `${transcript.id}-original`)
																	}
																	sx={{
																		color:
																			copiedId === `${transcript.id}-original`
																				? '#10b981'
																				: 'rgba(255, 255, 255, 0.5)',
																		padding: '0.25rem',
																		'&:hover': {
																			background: 'rgba(255, 255, 255, 0.1)',
																			color: 'rgba(255, 255, 255, 0.9)',
																		},
																	}}
																>
																	{copiedId === `${transcript.id}-original` ? (
																		<CheckIcon sx={{ fontSize: '1rem' }} />
																	) : (
																		<ContentCopyIcon sx={{ fontSize: '1rem' }} />
																	)}
																</IconButton>
															</Tooltip>
															<Tooltip title='Listen to original' arrow>
																<IconButton
																	size='small'
																	onClick={() => handleSpeak(transcript.original)}
																	sx={{
																		color: 'rgba(255, 255, 255, 0.5)',
																		padding: '0.25rem',
																		'&:hover': {
																			background: 'rgba(255, 255, 255, 0.1)',
																			color: 'rgba(255, 255, 255, 0.9)',
																		},
																	}}
																>
																	<VolumeUpIcon sx={{ fontSize: '1rem' }} />
																</IconButton>
															</Tooltip>
														</Box>
													)}
												</Box>
												<Typography
													variant='h6'
													sx={{
														color: isListening
															? 'rgba(139, 92, 246, 0.9)'
															: 'rgba(255, 255, 255, 0.95)',
														fontSize: { xs: '1rem', sm: '1.1rem' },
														fontWeight: 500,
														lineHeight: 1.6,
														fontStyle: isListening ? 'italic' : 'normal',
														wordBreak: 'break-word',
														position: 'relative',
													}}
												>
													{transcript.original}
													{isListening && (
														<Box
															component='span'
															sx={{
																display: 'inline-block',
																width: '4px',
																height: '1.2em',
																background: 'rgba(139, 92, 246, 0.9)',
																marginLeft: '0.25rem',
																animation: 'blink 1s step-end infinite',
																verticalAlign: 'text-bottom',
															}}
														/>
													)}
												</Typography>
											</Box>

											{/* Divider */}
											<Box
												sx={{
													height: '1px',
													background:
														'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
												}}
											/>

											{/* Translated Text */}
											<Box>
												<Box
													sx={{
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'space-between',
														marginBottom: '0.75rem',
													}}
												>
													<Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
														<Box
															sx={{
																width: '6px',
																height: '6px',
																borderRadius: '50%',
																background: isTranslating
																	? 'linear-gradient(135deg, #8b5cf6, #667eea)'
																	: 'linear-gradient(135deg, #10b981, #059669)',
																animation: isTranslating ? 'pulse 2s ease-in-out infinite' : 'none',
															}}
														/>
														<Typography
															variant='caption'
															sx={{
																color: 'rgba(255, 255, 255, 0.7)',
																fontSize: '0.75rem',
																fontWeight: 700,
																textTransform: 'uppercase',
																letterSpacing: '0.1em',
															}}
														>
															Translation
														</Typography>
														{isTranslating && (
															<Chip
																label='Processing'
																size='small'
																sx={{
																	height: '18px',
																	fontSize: '0.65rem',
																	background: 'rgba(139, 92, 246, 0.2)',
																	color: 'rgba(139, 92, 246, 0.9)',
																	border: '1px solid rgba(139, 92, 246, 0.3)',
																	fontWeight: 600,
																}}
															/>
														)}
													</Box>
													{!isTranslating && (
														<Box sx={{ display: 'flex', gap: '0.25rem' }}>
															<Tooltip title='Copy translation' arrow>
																<IconButton
																	size='small'
																	onClick={() =>
																		handleCopy(transcript.translated, `${transcript.id}-translated`)
																	}
																	sx={{
																		color:
																			copiedId === `${transcript.id}-translated`
																				? '#10b981'
																				: 'rgba(255, 255, 255, 0.5)',
																		padding: '0.25rem',
																		'&:hover': {
																			background: 'rgba(255, 255, 255, 0.1)',
																			color: 'rgba(255, 255, 255, 0.9)',
																		},
																	}}
																>
																	{copiedId === `${transcript.id}-translated` ? (
																		<CheckIcon sx={{ fontSize: '1rem' }} />
																	) : (
																		<ContentCopyIcon sx={{ fontSize: '1rem' }} />
																	)}
																</IconButton>
															</Tooltip>
															<Tooltip title='Listen to translation' arrow>
																<IconButton
																	size='small'
																	onClick={() => handleSpeak(transcript.translated)}
																	sx={{
																		color: 'rgba(255, 255, 255, 0.5)',
																		padding: '0.25rem',
																		'&:hover': {
																			background: 'rgba(255, 255, 255, 0.1)',
																			color: 'rgba(255, 255, 255, 0.9)',
																		},
																	}}
																>
																	<VolumeUpIcon sx={{ fontSize: '1rem' }} />
																</IconButton>
															</Tooltip>
														</Box>
													)}
												</Box>
												<Typography
													variant='body1'
													sx={{
														color: isTranslating
															? 'rgba(139, 92, 246, 0.9)'
															: 'rgba(255, 255, 255, 0.95)',
														fontSize: { xs: '0.95rem', sm: '1rem' },
														fontWeight: isTranslating ? 400 : 500,
														lineHeight: 1.6,
														fontStyle: isTranslating ? 'italic' : 'normal',
														wordBreak: 'break-word',
													}}
												>
													{transcript.translated}
													{isTranslating && (
														<Box
															component='span'
															sx={{
																display: 'inline-block',
																width: '4px',
																height: '1em',
																background: 'rgba(139, 92, 246, 0.9)',
																marginLeft: '0.25rem',
																animation: 'blink 1s step-end infinite',
																verticalAlign: 'text-bottom',
															}}
														/>
													)}
												</Typography>
											</Box>
										</Box>
									</Paper>
								</ListItem>
							</Fade>
						);
					})}
			</MuiList>

			<style>{`
				@keyframes slideInUp {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes pulse {
					0%, 100% {
						opacity: 1;
						transform: scale(1);
					}
					50% {
						opacity: 0.5;
						transform: scale(1.2);
					}
				}

				@keyframes blink {
					0%, 50% {
						opacity: 1;
					}
					51%, 100% {
						opacity: 0;
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
