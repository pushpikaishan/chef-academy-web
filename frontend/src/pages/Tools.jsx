import { useEffect, useState } from 'react'
import { getAllTools } from '../services/toolService'
import Loader from '../components/common/Loader.jsx'

export default function Tools(){
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
  const resolveSrc = (src) => {
    if (!src) return ''
    if (/^https?:\/\//i.test(src)) return src
    return `${apiBase}${src.startsWith('/') ? '' : '/'}${src}`
  }

  useEffect(() => {
    (async () => {
      try {
        const list = await getAllTools()
        setTools(list)
      } catch (e) {
        setError(e?.response?.data?.error || e?.message || 'Failed to load tools')
      } finally { setLoading(false) }
    })()
  }, [])

  if (loading) return <Loader />
  if (error) return <div style={{color:'crimson'}}>{error}</div>

  return (
    <div>
      <h1>Tools</h1>
      {!tools?.length ? (
        <p>No tools yet.</p>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'12px'}}>
          {tools.map(t => (
            <div key={t._id || t.name} style={{border:'1px solid #ddd',borderRadius:'8px',padding:'12px'}}>
              <div style={{fontWeight:600, marginBottom:6}}>{t.name}</div>
              {t.photo && (
                <img
                  src={resolveSrc(t.photo)}
                  alt={t.name || 'Tool'}
                  style={{width:'100%',height:'160px',objectFit:'cover',borderRadius:'6px',background:'#f2f2f2'}}
                  onError={(e)=>{ e.currentTarget.style.display='none' }}
                />
              )}
              {t.category && <div style={{fontSize:'0.9rem',color:'#555',marginTop:6}}>Category: {t.category}</div>}
              {t.department && <div style={{fontSize:'0.9rem',color:'#555'}}>Department: {t.department}</div>}
              {t.description && <p style={{marginTop:8}}>{t.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}