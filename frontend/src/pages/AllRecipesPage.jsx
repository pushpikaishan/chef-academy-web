import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getAllRecipes } from '../services/recipeService'

export default function KitchenRecipesPage() {
  const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
  const resolveSrc = (src) => {
    if (!src) return ''
    if (/^https?:\/\//i.test(src)) return src
    return `${apiBase}${src.startsWith('/') ? '' : '/'}${src}`
  }

  const [recipes, setRecipes] = useState([])
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
    if (p.includes('/kitchen/')) return '/kitchen/recipes'
    if (p.includes('/bakery/')) return '/bakery/recipes'
    if (p.includes('/butchry/')) return '/butchry/recipes'
    return '/kitchen/recipes'
  }

  const asArray = (val) => {
    if (Array.isArray(val)) return val
    const s = (val || '').toString()
    return s.split(/\r?\n/).map(x => x.trim()).filter(Boolean)
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getAllRecipes()
        const deptWanted = pathDept()
        const matcher = (dept) => {
          const d = (dept || '').trim()
          if (deptWanted === 'Kitchen') return d === 'Kitchen' || d === 'Hot & Cold Kitchen'
          if (deptWanted === 'Bakery') return d === 'Bakery'
          if (deptWanted === 'Butchry') return d === 'Butchry' || d === 'Butchery'
          return false
        }
        setRecipes(Array.isArray(data) ? data.filter(r => matcher(r.department)) : [])
      } catch (e) {
        setError(e?.response?.data?.error || e?.message || 'Failed to load recipes')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [location.pathname])

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)', padding: '0 10px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ color: '#1a1a1a', fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 900, letterSpacing: '-0.5px', margin: 0 }}>
            {pathDept()} Recipes
          </h1>
          <p style={{ color: '#666', marginTop: 8 }}>Showing all recipes in the {pathDept()} department</p>
        </div>

        {error && <div style={{ color: 'crimson', marginBottom: 16 }}>{error}</div>}

        {loading ? (
          <div>Loading…</div>
        ) : recipes.length === 0 ? (
          <div>No Kitchen recipes found.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {recipes.map((item) => (
              <div
                key={item._id}
                style={{ background: '#fff', borderRadius: 16, boxShadow: '0 12px 30px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                onClick={() => navigate(`${detailBase()}/${item._id}`)}
                role="button"
                aria-label={`Open details for ${item.name || 'recipe'}`}
              >
                {item.photo && (
                  <img
                    src={resolveSrc(item.photo)}
                    alt={item.name || 'Recipe'}
                    style={{ width: '100%', height: 160, objectFit: 'cover', background: '#f2f2f2' }}
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                )}
                <div style={{ padding: 14, display: 'grid', gap: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a' }}>{item.name}</div>
                  {item.category && <div style={{ fontSize: '0.85rem', color: '#555' }}>Category: {item.category}</div>}
                  {item.time && <div style={{ fontSize: '0.85rem', color: '#555' }}>Time: {item.time}</div>}
                  {/* Likes with heart emoji */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }} aria-label={`${item.likes ?? 0} likes`}>
                    <span style={{ fontSize: '1rem' }}>❤️</span>
                    <span style={{ fontSize: '0.95rem', color: '#e0245e', fontWeight: 700 }}>{item.likes ?? 0}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    {item.videolink && (
                      <a
                        href={item.videolink}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ padding: '8px 12px', background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', color: '#000', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}
                      >
                        Watch Video
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Removed modal; navigation goes to detail page */}
    </div>
  )
}