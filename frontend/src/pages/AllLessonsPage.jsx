import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getAllLessonVideos } from '../services/lessonVideoService'
import VideoPlayer from '../components/common/VideoPlayer'
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
    <div style={{padding:'16px 20px'}}>
      <h1 style={{margin:'8px 0 16px'}}>{title}</h1>
      {error && <div style={{color:'crimson',marginBottom:12}}>{error}</div>}
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div style={{display:'grid',gap:12}}>
          {filtered.map(item => (
            <div key={item._id} style={{border:'1px solid #ddd',borderRadius:8,padding:12,display:'flex',gap:16}}>
              <div style={{flex:'0 0 240px'}}>
                {item.video ? (
                  <div onClick={()=>setPlayerItem(item)} style={{cursor:'pointer'}}>
                    <video
                      src={resolveSrc(item.video)}
                      controls
                      style={{width:'100%',borderRadius:6,background:'#000'}}
                      onError={(e)=>{ e.currentTarget.style.display='none' }}
                    />
                  </div>
                ) : (
                  <div style={{width:'100%',height:135,background:'#f5f5f5',borderRadius:6,display:'grid',placeItems:'center',color:'#888'}}>
                    No video
                  </div>
                )}
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:'1.1rem'}}>{item.title}</div>
                {item.department && <div style={{fontSize:'0.9rem',color:'#555',marginTop:4}}>Department: {item.department}</div>}
                {item.description && <p style={{marginTop:8,color:'#444'}}>{item.description}</p>}
                {item.video && (
                  <div style={{marginTop:6,fontSize:'0.9rem',display:'flex',gap:12,alignItems:'center'}}>
                    <button onClick={()=>setPlayerItem(item)} style={{padding:'6px 10px',borderRadius:6,border:'1px solid #ddd',background:'#fff',cursor:'pointer'}}>Play</button>
                    <a href={resolveSrc(item.video)} target="_blank" rel="noopener noreferrer">Open video</a>
                  </div>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div>No lessons found{requestedDept ? ` for ${requestedDept}` : ''}.</div>
          )}
        </div>
      )}
      {playerItem && (
        <VideoPlayer
          src={resolveSrc(playerItem.video)}
          subtitleSrc={guessSubtitleSrc(playerItem.video)}
          title={playerItem.title}
          onClose={()=>setPlayerItem(null)}
          onPlayed={async () => {
            if (!userId) return
            try {
              await updateUserWatch(userId, playerItem.department || '')
            } catch (_) {
              // ignore update errors in UI
            }
          }}
        />
      )}
    </div>
  )
}
