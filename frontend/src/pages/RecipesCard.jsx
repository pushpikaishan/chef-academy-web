import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BackFloatButton from '../components/common/BackFloatButton'
import Loader from '../components/common/Loader.jsx'
import { getRecipeById, likeRecipe, unlikeRecipe } from '../services/recipeService'

export default function KitchenRecipes(){
	const { id } = useParams()
	const navigate = useNavigate()
	const [isLiked, setIsLiked] = useState(false)
	const [likes, setLikes] = useState(0)

	const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
	const resolveSrc = (src) => {
		if (!src) return ''
		if (/^https?:\/\//i.test(src)) return src
		return `${apiBase}${src.startsWith('/') ? '' : '/'}${src}`
	}

	const [item, setItem] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	const asArray = (val) => {
		if (Array.isArray(val)) return val
		const s = (val || '').toString()
		return s.split(/\r?\n/).map(x => x.trim()).filter(Boolean)
	}

	const handleLike = async () => {
		if (!item) return
		try {
			const likedIds = JSON.parse(localStorage.getItem('likedRecipes') || '[]')
			const hasLiked = Array.isArray(likedIds) ? likedIds.includes(item._id) : false
			if (!hasLiked) {
				const res = await likeRecipe(item._id)
				setLikes(res.likes ?? (likes + 1))
				localStorage.setItem('likedRecipes', JSON.stringify([...(likedIds || []), item._id]))
				setIsLiked(true)
			} else {
				const res = await unlikeRecipe(item._id)
				setLikes(res.likes ?? Math.max(0, likes - 1))
				localStorage.setItem('likedRecipes', JSON.stringify((likedIds || []).filter(x => x !== item._id)))
				setIsLiked(false)
			}
		} catch (e) {
			setError(e?.response?.data?.error || e?.message || 'Failed to update like')
		}
	}

	useEffect(() => {
		const load = async () => {
			setLoading(true)
			setError('')
			try {
				const data = await getRecipeById(id)
				setItem(data)
				setLikes(data.likes || 0)
				const likedIds = JSON.parse(localStorage.getItem('likedRecipes') || '[]')
				setIsLiked(Array.isArray(likedIds) ? likedIds.includes(data._id) : false)
			} catch (e) {
				setError(e?.response?.data?.error || e?.message || 'Failed to load recipe')
			} finally {
				setLoading(false)
			}
		}
		if (id) load()
	}, [id])

	return (
		<div style={{
			width: '100%',
			minHeight: '100vh',
			background: '#fafaf9',
			padding: '40px 20px'
		}}>
			<div style={{ maxWidth: '900px', margin: '0 auto' }}>
				

				{error && (
					<div style={{
						padding: '16px',
						background: '#ffebee',
						color: '#c62828',
						borderRadius: '8px',
						marginBottom: '24px'
					}}>
						{error}
					</div>
				)}

				{loading ? (
					<Loader />
				) : !item ? (
					<div style={{
						textAlign: 'center',
						padding: '60px 20px',
						fontSize: '16px',
						color: '#999'
					}}>
						Recipe not found.
					</div>
				) : (
					<div>
						{/* Top Section - Title & Meta Info */}
						<div style={{
							marginBottom: '24px'
						}}>
							<div style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'flex-start',
								marginBottom: '12px'
							}}>
								<h1 style={{
									margin: 0,
									fontSize: '44px',
									fontWeight: '900',
									color: '#1a1a1a',
									letterSpacing: '-0.5px',
									fontFamily: 'Georgia, serif'
								}}>
									{item.name}
								</h1>

								{/* Right Side Meta */}
								<div style={{
									textAlign: 'right',
									display: 'flex',
									flexDirection: 'column',
									gap: '12px'
								}}>
									{item.serving && (
										<div style={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'flex-end',
											gap: '6px',
											fontSize: '13px',
											color: '#666'
										}}>
											<span style={{ fontSize: '16px' }}>🍽️</span>
											<span>{item.serving} servings</span>
										</div>
									)}
									{item.time && (
										<div style={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'flex-end',
											gap: '6px',
											fontSize: '13px',
											color: '#666'
										}}>
											<span style={{ fontSize: '16px' }}>⏱️</span>
											<span>{item.time} minutes</span>
										</div>
									)}
								</div>
							</div>

							{/* Description */}
							{item.description && (
								<p style={{
									margin: '0',
									fontSize: '14px',
									color: '#666',
									lineHeight: '1.6'
								}}>
									{item.description}
								</p>
							)}
						</div>

						{/* Image Section */}
						<div style={{
							marginBottom: '40px',
							borderRadius: '16px',
							overflow: 'hidden',
							height: '280px',
							boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
						}}>
							{item.photo ? (
								<img
									src={resolveSrc(item.photo)}
									alt={item.name || 'Recipe'}
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover'
									}}
									onError={(e) => {
										e.currentTarget.style.display = 'none'
									}}
								/>
							) : (
								<div style={{
									width: '100%',
									height: '100%',
									background: '#f0f0f0',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: '80px'
								}}>
									🍳
								</div>
							)}
						</div>

						{/* Content Section - Two Columns */}
						<div style={{
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gap: '40px',
							marginBottom: '32px'
						}}>
							{/* Ingredients */}
							{asArray(item.ingredients).length > 0 && (
								<div>
									<h2 style={{
										margin: '0 0 16px 0',
										fontSize: '14px',
										fontWeight: '800',
										color: '#1a1a1a',
										letterSpacing: '2px',
										textTransform: 'uppercase',
										fontFamily: 'Georgia, serif',
										paddingBottom: '12px',
										borderBottom: '2px solid #333'
									}}>
										INGREDIENTS
									</h2>
									<ul style={{
										margin: '0',
										padding: '0',
										listStyle: 'none'
									}}>
										{asArray(item.ingredients).map((ing, idx) => (
											<li
												key={idx}
												style={{
													padding: '8px 0',
													color: '#555',
													fontSize: '13px',
													lineHeight: '1.5'
												}}
											>
												{ing}
											</li>
										))}
									</ul>
								</div>
							)}

							{/* Directions */}
							{asArray(item.directions).length > 0 && (
								<div>
									<h2 style={{
										margin: '0 0 16px 0',
										fontSize: '14px',
										fontWeight: '800',
										color: '#1a1a1a',
										letterSpacing: '2px',
										textTransform: 'uppercase',
										fontFamily: 'Georgia, serif',
										paddingBottom: '12px',
										borderBottom: '2px solid #333'
									}}>
										DIRECTIONS
									</h2>
									<ol style={{
										margin: '0',
										padding: '0',
										paddingLeft: '0',
										listStyle: 'none'
									}}>
										{asArray(item.directions).map((step, idx) => (
											<li
												key={idx}
												style={{
													padding: '8px 0',
													paddingLeft: '20px',
													color: '#555',
													fontSize: '13px',
													lineHeight: '1.5',
													position: 'relative'
												}}
											>
												<span style={{
													position: 'absolute',
													left: '0',
													fontWeight: '700',
													color: '#1a1a1a'
												}}>
													{idx + 1}.
												</span>
												{step}
											</li>
										))}
									</ol>
								</div>
							)}
						</div>

						{/* Action Buttons */}
						<div style={{
							display: 'flex',
							gap: '12px',
							paddingTop: '24px',
							borderTop: '1px solid #ddd'
						}}>
							{/* Like Button */}
							<button
								onClick={handleLike}
								style={{
									padding: '12px 20px',
									background: isLiked
										? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
										: '#fff',
									color: isLiked ? '#000' : '#333',
									border: isLiked ? 'none' : '2px solid #ddd',
									borderRadius: '6px',
									fontSize: '12px',
									fontWeight: '700',
									cursor: 'pointer',
									transition: 'all 0.3s ease',
									display: 'inline-flex',
									alignItems: 'center',
									gap: '6px',
									textTransform: 'uppercase',
									letterSpacing: '0.5px',
									boxShadow: isLiked ? '0 6px 20px rgba(255,215,0,0.3)' : 'none'
								}}
								onMouseEnter={(e) => {
									if (!isLiked) {
										e.currentTarget.style.borderColor = '#FFD700'
										e.currentTarget.style.background = '#fff8f0'
									}
									e.currentTarget.style.transform = 'translateY(-1px)'
								}}
								onMouseLeave={(e) => {
									if (!isLiked) {
										e.currentTarget.style.borderColor = '#ddd'
										e.currentTarget.style.background = '#fff'
									}
									e.currentTarget.style.transform = 'translateY(0)'
								}}
							>
								<span style={{ fontSize: '16px' }}>
									{isLiked ? '❤️' : '🤍'}
								</span>
								{isLiked ? 'Liked' : 'Like Recipe'}
								<span style={{ fontSize: '11px', opacity: 0.8, marginLeft: 6 }}>❤️ {likes}</span>
							</button>

							{/* Video Button */}
							{item.videolink && (
								<a
									href={item.videolink}
									target="_blank"
									rel="noreferrer"
									style={{
										padding: '12px 20px',
										background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
										color: '#000',
										border: 'none',
										borderRadius: '6px',
										fontSize: '12px',
										fontWeight: '700',
										cursor: 'pointer',
										transition: 'all 0.3s ease',
										textDecoration: 'none',
										display: 'inline-flex',
										alignItems: 'center',
										gap: '6px',
										textTransform: 'uppercase',
										letterSpacing: '0.5px',
										boxShadow: '0 6px 20px rgba(255,215,0,0.3)'
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.transform = 'translateY(-1px)'
										e.currentTarget.style.boxShadow = '0 8px 28px rgba(255,215,0,0.4)'
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.transform = 'translateY(0)'
										e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,215,0,0.3)'
									}}
								>
									<span>▶️</span>
									Watch Video
								</a>
							)}
						</div>
					</div>
				)}
				<BackFloatButton label="Back" />
			</div>

			<style>{`
				@media (max-width: 768px) {
					div[style*="gridTemplateColumns: '1fr 1fr'"] {
						grid-template-columns: 1fr !important;
						gap: 24px !important;
					}

					h1 {
						font-size: 32px !important;
					}

					div[style*="padding: '40px 20px'"] {
						padding: 20px 16px !important;
					}

					div[style*="height: '280px'"] {
						height: 220px !important;
					}

					div[style*="justifyContent: 'space-between'"] {
						flex-direction: column !important;
					}
				}
			`}</style>
		</div>
	)
}