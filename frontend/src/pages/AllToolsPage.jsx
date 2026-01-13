import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import BackFloatButton from '../components/common/BackFloatButton'
import { getAllTools } from '../services/toolService'

export default function KitchenToolsPage() {
  const location = useLocation()
  const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
  const resolveSrc = (src) => {
    if (!src) return ''
    if (/^https?:\/\//i.test(src)) return src
    return `${apiBase}${src.startsWith('/') ? '' : '/'}${src}`
  }

  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  const getDeptFromPath = () => {
    const p = location.pathname.toLowerCase()
    if (p.startsWith('/bakery')) return 'Bakery'
    if (p.startsWith('/butchry')) return 'Butchry'
    return 'Kitchen'
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getAllTools()
        const dept = getDeptFromPath().toLowerCase()
        const mapped = Array.isArray(data)
          ? data.filter(t => {
              const d = (t.department || '').trim().toLowerCase()
              if (dept === 'kitchen') return d === 'kitchen' || d === 'hot & cold kitchen'
              if (dept === 'butchry') return d === 'butchry' || d === 'butchery'
              return d === dept
            })
          : []
        setTools(mapped)
      } catch (e) {
        setError(e?.response?.data?.error || e?.message || 'Failed to load tools')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [location.pathname])

  return (
    <div style={{ width: '100%', minHeight: '100vh',  padding: '60px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ color: '#1a1a1a', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 900, letterSpacing: '-0.5px', margin: 0 }}>
            {getDeptFromPath()} Tools
          </h1>
          <p style={{ color: '#666', marginTop: 8 }}>Showing all tools in the {getDeptFromPath()} department</p>
        </div>

        {error && <div style={{ color: 'crimson', marginBottom: 16 }}>{error}</div>}

        {loading ? (
          <div>Loading…</div>
        ) : tools.length === 0 ? (
          <div>No {getDeptFromPath()} tools found.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {tools.map((item) => (
              <div
                key={item._id}
                style={{ background: '#fff', borderRadius: 16, boxShadow: '0 12px 30px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                onClick={() => setSelected(item)}
                role="button"
                aria-label={`Open details for ${item.name || 'tool'}`}
              >
                {item.photo && (
                  <img
                    src={resolveSrc(item.photo)}
                    alt={item.name || 'Tool'}
                    style={{ width: '100%', height: 160, objectFit: 'cover', background: '#f2f2f2' }}
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                )}
                <div style={{ padding: 14, display: 'grid', gap: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a' }}>{item.name}</div>
                  {item.category && <div style={{ fontSize: '0.85rem', color: '#555' }}>Category: {item.category}</div>}
                  {item.department && <div style={{ fontSize: '0.85rem', color: '#555' }}>Department: {item.department}</div>}
                  {item.description && <div style={{ fontSize: '0.85rem', color: '#666' }}>{item.description}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`Details for ${selected.name || 'tool'}`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '90%', maxWidth: 720, background: '#fff', borderRadius: 16,
              boxShadow: '0 16px 40px rgba(0,0,0,0.2)', overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #eee' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1a1a1a' }}>{selected.name}</div>
              <button
                onClick={() => setSelected(null)}
                style={{ border: 'none', background: 'transparent', fontSize: '1.2rem', cursor: 'pointer', color: '#555' }}
                aria-label="Close details"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16, padding: 16 }}>
              <div>
                {selected.photo ? (
                  <img
                    src={resolveSrc(selected.photo)}
                    alt={selected.name || 'Tool'}
                    style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8, background: '#f2f2f2' }}
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: 200, borderRadius: 8, background: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
                    No image
                  </div>
                )}
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {selected.category && <div><span style={{ color: '#777' }}>Category:</span> <span style={{ fontWeight: 600 }}>{selected.category}</span></div>}
                {selected.department && <div><span style={{ color: '#777' }}>Department:</span> <span style={{ fontWeight: 600 }}>{selected.department}</span></div>}
                {selected.description && (
                  <div>
                    <div style={{ color: '#777', marginBottom: 4 }}>Description</div>
                    <div style={{ color: '#333' }}>{selected.description}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: 16, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                onClick={() => setSelected(null)}
                style={{ padding: '10px 16px', border: '2px solid #ddd', background: 'transparent', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <BackFloatButton label="Back" />
    </div>
  )
}
