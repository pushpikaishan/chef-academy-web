import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminById } from '../../services/adminService'

export default function AdminDashboard(){
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(null)
  const [error, setError] = useState('')

  const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
  const resolveSrc = (src) => {
    if (!src) return ''
    if (/^https?:\/\//i.test(src)) return src
    return `${apiBase}${src.startsWith('/') ? '' : '/'}${src}`
  }

  useEffect(() => {
    const id = localStorage.getItem('id')
    if (!id) return
    ;(async () => {
      try {
        const data = await getAdminById(id)
        setAdmin(data)
      } catch (e) {
        setError(e?.response?.data?.error || e?.message || 'Failed to load admin')
      }
    })()
  }, [])

  const goToProfile = () => navigate('/admin/profile')
  const goUsers = () => navigate('/admin/users')
  const goRecipes = () => navigate('/admin/recipes')
  const goTools = () => navigate('/admin/tools')
  const goLessons = () => navigate('/admin/lessons')
  const goAdmins = () => navigate('/admin/admins')
  const goAllusers = () => navigate('/allusers')
  const goTheories = () => navigate('/admin/theories')
  const goQuestions = () => navigate('/admin/questions')

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {error && <p style={{color:'crimson'}}>{error}</p>}
      {admin && (
        <div
          role="button"
          onClick={goToProfile}
          style={{
            display:'flex',
            alignItems:'center',
            gap:'12px',
            padding:'12px',
            border:'1px solid #ddd',
            borderRadius:'8px',
            cursor:'pointer',
            maxWidth:'360px',
            marginBottom:'16px'
          }}
        >
          <img
            src={resolveSrc(admin.profilePhoto || '')}
            alt={admin.name || 'Admin'}
            style={{width:'56px',height:'56px',objectFit:'cover',borderRadius:'50%',background:'#f2f2f2'}}
            onError={(e)=>{ e.currentTarget.style.display='none' }}
          />
          <div>
            <div style={{fontWeight:600}}>{admin.name || 'Admin'}</div>
            <div style={{fontSize:'0.9rem',color:'#555'}}>View profile</div>
          </div>
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:'12px'}}>
    
        <div role="button" onClick={goAllusers} style={{border:'1px solid #ddd',borderRadius:'8px',padding:'16px',cursor:'pointer'}}>
          <div style={{fontWeight:600, marginBottom:6}}>Manage Users</div>
          <div style={{color:'#555'}}>View and edit users</div>
        </div>
        <div role="button" onClick={goRecipes} style={{border:'1px solid #ddd',borderRadius:'8px',padding:'16px',cursor:'pointer'}}>
          <div style={{fontWeight:600, marginBottom:6}}>Manage Recipes</div>
          <div style={{color:'#555'}}>Create and update recipes</div>
        </div>
        <div role="button" onClick={goTools} style={{border:'1px solid #ddd',borderRadius:'8px',padding:'16px',cursor:'pointer'}}>
          <div style={{fontWeight:600, marginBottom:6}}>Manage Tools</div>
          <div style={{color:'#555'}}>Maintain tools catalog</div>
        </div>
        <div role="button" onClick={goLessons} style={{border:'1px solid #ddd',borderRadius:'8px',padding:'16px',cursor:'pointer'}}>
          <div style={{fontWeight:600, marginBottom:6}}>Manage Lessons</div>
          <div style={{color:'#555'}}>Organize lessons</div>
        </div>
        <div role="button" onClick={goTheories} style={{border:'1px solid #ddd',borderRadius:'8px',padding:'16px',cursor:'pointer'}}>
          <div style={{fontWeight:600, marginBottom:6}}>Manage Theory</div>
          <div style={{color:'#555'}}>Create and update theory content</div>
        </div>
        <div role="button" onClick={goQuestions} style={{border:'1px solid #ddd',borderRadius:'8px',padding:'16px',cursor:'pointer'}}>
          <div style={{fontWeight:600, marginBottom:6}}>User Questions</div>
          <div style={{color:'#555'}}>Review and delete submissions</div>
        </div>
      </div>
    </div>
  )
}
