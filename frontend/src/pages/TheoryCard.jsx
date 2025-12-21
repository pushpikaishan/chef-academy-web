import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTheoryById } from '../services/theoryService'

export default function KitchenTheory() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
  const resolveSrc = (src) => {
    if (!src) return ''
    if (/^https?:\/\//i.test(src)) return src
    return `${apiBase}${src.startsWith('/') ? '' : '/'}${src}`
  }
  const toDateLabel = (d) => {
    if (!d) return ''
    try { return new Date(d).toISOString().slice(0,10) } catch { return '' }
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getTheoryById(id)
        setItem(data)
      } catch (e) {
        setError(e?.response?.data?.error || e?.message || 'Failed to load theory')
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)', padding: '60px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '10px 16px',
              background: 'transparent',
              color: '#333',
              border: '2px solid #ddd',
              borderRadius: 8,
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            aria-label="Go back"
          >
            ← Back
          </button>
        </div>
        {error && <div style={{ color: 'crimson', marginBottom: 16 }}>{error}</div>}
        {loading ? (
          <div>Loading…</div>
        ) : !item ? (
          <div>Not found.</div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 12px 30px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <div style={{ padding: 20, borderBottom: '1px solid #eee' }}>
              <h1 style={{ margin: 0, color: '#1a1a1a' }}>{item.title}</h1>
              <div style={{ display: 'flex', gap: 12, color: '#555', marginTop: 8 }}>
                {item.department && <span>Department: {item.department}</span>}
                {item.submitDate && <span>Date: {toDateLabel(item.submitDate)}</span>}
              </div>
            </div>
            <div style={{ padding: 20, display: 'grid', gap: 16 }}>
              {item.description && (
                <div>
                  <div style={{ color: '#777', marginBottom: 6 }}>Description</div>
                  <div style={{ color: '#333', lineHeight: 1.7 }}>{item.description}</div>
                </div>
              )}
              {Array.isArray(item.photos) && item.photos.length > 0 && (
                <div>
                  <div style={{ color: '#777', marginBottom: 6 }}>Photos</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                    {item.photos.map((p, idx) => (
                      <img key={idx} src={resolveSrc(p)} alt={`Photo ${idx+1}`} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, background: '#f2f2f2' }} onError={(e)=>{ e.currentTarget.style.display='none' }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
