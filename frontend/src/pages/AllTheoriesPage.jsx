import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getAllTheories } from '../services/theoryService'

export default function KitchenTheoriesPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const pathDept = () => {
    const p = (location.pathname || '').toLowerCase()
    if (p.includes('/kitchen/')) return 'Kitchen'
    if (p.includes('/bakery/')) return 'Bakery'
    if (p.includes('/butchry/')) return 'Butchry'
    return 'Kitchen'
  }

  const detailBase = () => {
    const p = (location.pathname || '').toLowerCase()
    if (p.includes('/kitchen/')) return '/kitchen/theories'
    if (p.includes('/bakery/')) return '/bakery/theories'
    if (p.includes('/butchry/')) return '/butchry/theories'
    return '/kitchen/theories'
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
        const data = await getAllTheories()
        const deptWanted = pathDept()
        const matcher = (dept) => {
          const d = (dept || '').trim()
          if (deptWanted === 'Kitchen') return d === 'Kitchen' || d === 'Hot & Cold Kitchen'
          if (deptWanted === 'Bakery') return d === 'Bakery'
          if (deptWanted === 'Butchry') return d === 'Butchry' || d === 'Butchery'
          return false
        }
        setItems(Array.isArray(data) ? data.filter(t => matcher(t.department)) : [])
      } catch (e) {
        setError(e?.response?.data?.error || e?.message || 'Failed to load theories')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [location.pathname])

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)', padding: '60px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ color: '#1a1a1a', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 900, letterSpacing: '-0.5px', margin: 0 }}>
            {pathDept()} Theory
          </h1>
          <p style={{ color: '#666', marginTop: 8 }}>Showing all theory items in the {pathDept()} department</p>
        </div>

        {error && <div style={{ color: 'crimson', marginBottom: 16 }}>{error}</div>}

        {loading ? (
          <div>Loading…</div>
        ) : items.length === 0 ? (
          <div>No Kitchen theory found.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {items.map((item) => (
              <div
                key={item._id}
                style={{ background: '#fff', borderRadius: 16, boxShadow: '0 12px 30px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 14, cursor: 'pointer' }}
                onClick={() => navigate(`${detailBase()}/${item._id}`)}
                role="button"
                aria-label={`Open details for ${item.title || 'theory'}`}
              >
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a' }}>{item.title}</div>
                {item.submitDate && <div style={{ fontSize: '0.9rem', color: '#555' }}>Date: {toDateLabel(item.submitDate)}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
