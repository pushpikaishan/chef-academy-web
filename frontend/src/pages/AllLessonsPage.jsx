import { useEffect, useMemo, useState } from 'react'
import dhatImg from '../assets/images/dhat.png'
import { useLocation } from 'react-router-dom'
import { getAllLessonVideos } from '../services/lessonVideoService'
import VideoPlayer from '../components/common/VideoPlayer'
import BackFloatButton from '../components/common/BackFloatButton'
import { updateUserWatch } from '../services/authService'

export default function AllLessonsPage(){
  const location = useLocation()
  const qs = new URLSearchParams(location.search)
  const requestedDept = (qs.get('department') || '').trim()

  const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
  const resolveSrc = (src) => {
    if (!src) return ''
    if (/^https?:\/\//i.test(src)) return src
    return `${apiBase}${src.startsWith('/') ? '' : '/'}${src}`
  }

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [playerItem, setPlayerItem] = useState(null)
  const [userId] = useState(() => localStorage.getItem('id') || '')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError('')
    getAllLessonVideos()
      .then(data => { if (mounted) setItems(data) })
      .catch(e => { if (mounted) setError(e?.response?.data?.error || e?.message || 'Failed to load lessons') })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [location.search])

  const filterKey = (requestedDept || '').toLowerCase()
  const filtered = useMemo(() => {
    if (!filterKey) return items
    return items.filter(it => {
      const d = (it?.department || '').toLowerCase()
      if (!d) return false
      // normalize departments, support variants like "Hot & Cold Kitchen", "Bakery & Pastry", "Butchery & Fish"
      if (filterKey.includes('kitchen')) return d.includes('kitchen')
      if (filterKey.includes('bakery')) return d.includes('bakery')
      // handle "butchry" typo and proper "butchery"
      if (filterKey.includes('butchry') || filterKey.includes('butchery')) return d.includes('butch')
      return d.includes(filterKey)
    })
  }, [items, filterKey])

  const title = requestedDept ? `Lessons — ${requestedDept}` : 'All Lessons'
  const guessSubtitleSrc = (videoSrc) => {
    if (!videoSrc) return ''
    const url = resolveSrc(videoSrc)
    const dot = url.lastIndexOf('.')
    if (dot > -1) return url.slice(0, dot) + '.srt'
    return ''
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '60px 20px', position: 'relative' }}>
      {/* Background image with reduced opacity */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${dhatImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.12,
          pointerEvents: 'none',
          zIndex: -1
        }}
      />
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ color: '#1a1a1a', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 900, letterSpacing: '-0.5px', margin: 0 }}>
            {title}
          </h1>
          {requestedDept && (
            <p style={{ color: '#666', marginTop: 8 }}>Showing all lessons in the {requestedDept} department</p>
          )}
        </div>

        {error && <div style={{ color: 'crimson', marginBottom: 16 }}>{error}</div>}

        {loading ? (
          <div>Loading…</div>
        ) : filtered.length === 0 ? (
          <div>No lessons found{requestedDept ? ` for ${requestedDept}` : ''}.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {filtered.map((item) => (
              <div
                key={item._id}
                style={{ background: '#fff', borderRadius: 16, boxShadow: '0 12px 30px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: item.video ? 'pointer' : 'default' }}
                onClick={() => item.video && setPlayerItem(item)}
                role="button"
                aria-label={`Open player for ${item.title || 'lesson'}`}
              >
                {item.video ? (
                  <video
                    src={resolveSrc(item.video)}
                    controls
                    style={{ width: '100%', height: 180, objectFit: 'cover', background: '#000' }}
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: 160, background: '#f5f5f5', display: 'grid', placeItems: 'center', color: '#888' }}>
                    No video
                  </div>
                )}

                <div style={{ padding: 14, display: 'grid', gap: 8 }}>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1a1a1a' }}>{item.title}</div>
                  {item.department && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.85rem', color: '#555' }}>Department:</span>
                      <span style={{ fontSize: '0.8rem', color: '#1a1a1a', padding: '4px 10px', border: '1px solid #eee', borderRadius: 9999, background: '#fafafa' }}>{item.department}</span>
                    </div>
                  )}
                  {item.description && <div style={{ fontSize: '0.95rem', color: '#444' }}>{item.description}</div>}

                  {item.video && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setPlayerItem(item) }}
                        style={{ padding: '8px 12px', background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', color: '#000', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                      >
                        <i className="fa-solid fa-play" style={{ marginRight: 8 }} />
                        Play
                      </button>
                      <a
                        href={resolveSrc(item.video)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ padding: '8px 12px', border: '1px solid #ddd', color: '#1a1a1a', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', background: '#fff' }}
                      >
                        Open Video
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {playerItem && (
        <VideoPlayer
          src={resolveSrc(playerItem.video)}
          subtitleSrc={guessSubtitleSrc(playerItem.video)}
          title={playerItem.title}
          onClose={() => setPlayerItem(null)}
          onPlayed={async () => {
            if (!userId) return
            try {
              await updateUserWatch(userId, playerItem.department || '' )
            } catch (_) {
              // ignore update errors in UI
            }
          }}
        />
      )}

      <BackFloatButton label="Back" />
    </div>
  )
}
