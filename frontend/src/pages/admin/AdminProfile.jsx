import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { User, Mail, Shield, PencilLine, Save } from 'lucide-react'
import { updateAdminPhoto, getAdminById, updateAdmin } from '../../services/adminService'

export default function AdminProfile(){
  const [adminId, setAdminId] = useState(() => localStorage.getItem('id') || '')
  const [profilePhoto, setProfilePhoto] = useState('')
  const [message, setMessage] = useState('')
  const [details, setDetails] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const navigate = useNavigate()
  const { setUser } = useAuth() || {}

  const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
  const resolveSrc = (src) => {
    if (!src) return ''
    if (/^https?:\/\//i.test(src)) return src
    return `${apiBase}${src.startsWith('/') ? '' : '/'}${src}`
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !adminId) return
    try {
      const res = await updateAdminPhoto(adminId, file)
      setProfilePhoto(res.profilePhoto)
      setMessage('Profile photo updated')
    } catch (err) {
      setMessage(err?.response?.data?.error || err?.message || 'Upload failed')
    }
  }

  useEffect(() => {
    (async () => {
      if (!adminId) return
      try {
        const data = await getAdminById(adminId)
        setDetails(data)
        setProfilePhoto(data.profilePhoto || '')
        setForm(prev => ({ ...prev, name: data.name || '', email: data.email || '' }))
      } catch (err) {
        setMessage(err?.response?.data?.error || err?.message || 'Failed to load admin')
      }
    })()
  }, [adminId])

  const handleSignOut = () => {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('id')
      setUser && setUser(null)
      navigate('/login')
    } catch {}
  }

  const handleEditToggle = () => {
    setEditMode(!editMode)
    setMessage('')
    setForm(prev => ({ ...prev, name: details?.name || '', email: details?.email || '' }))
  }

  const handleInput = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setMessage('')
    const payload = {}
    if (!form.name || !form.email) {
      setMessage('Name and Email are required')
      return
    }
    payload.name = form.name
    payload.email = form.email
    if (form.password) {
      if (form.password.length < 6) {
        setMessage('Password must be at least 6 characters')
        return
      }
      if (form.password !== form.confirm) {
        setMessage('Passwords do not match')
        return
      }
      payload.password = form.password
    }
    try {
      const updated = await updateAdmin(adminId, payload)
      setDetails(updated)
      setEditMode(false)
      setForm(prev => ({ ...prev, password: '', confirm: '' }))
      setMessage('Profile updated successfully')
    } catch (err) {
      setMessage(err?.response?.data?.error || err?.message || 'Update failed')
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      padding: '32px 20px'
    }}>
      <div style={{
        maxWidth: '960px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '14px'
        }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '0.5px'
            }}>Admin Profile</h1>
            <p style={{
              margin: '6px 0 0 0',
              color: '#475569',
              fontSize: '14px'
            }}>Manage your account and avatar</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleEditToggle} style={{
              padding: '10px 16px',
              background: 'none',
              color: '#0f172a',
              border: '1px solid rgba(148, 163, 184, 0.35)',
              borderRadius: '10px',
              fontWeight: 700,
              cursor: 'pointer'
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <PencilLine size={18} /> {editMode ? 'Cancel' : 'Edit'}
              </span>
            </button>
            <button onClick={handleSignOut} style={{
            padding: '10px 16px',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 10px 24px rgba(220, 38, 38, 0.35)'
            }}>Sign Out</button>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: '24px'
        }}>
          <div style={{
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '14px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                margin: '0 auto',
                overflow: 'hidden',
                border: '3px solid rgba(251, 191, 36, 0.6)',
                boxShadow: '0 12px 28px rgba(251, 191, 36, 0.25)'
              }}>
                {profilePhoto ? (
                  <img src={resolveSrc(profilePhoto)} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '60px',
                    color: '#fbbf24'
                  }}>👨‍🍳</div>
                )}
              </div>
            </div>
            <label style={{
              display: 'inline-block',
              padding: '10px 14px',
              background: 'none',
              color: '#111827',
              fontWeight: 800,
              borderRadius: '10px',
              cursor: 'pointer',
              border: '1px solid rgba(148, 163, 184, 0.3)'
            }}>
              Change Photo
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
          </div>

          <div style={{
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '14px',
            padding: '24px'
          }}>
            {details && !editMode && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <User size={18} color="#64748b" />
                  <div style={{ color: '#64748b', fontSize: '12px', minWidth: '60px' }}>Name</div>
                  <div style={{ color: '#0f172a', fontWeight: 700 }}>{details.name}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={18} color="#64748b" />
                  <div style={{ color: '#64748b', fontSize: '12px', minWidth: '60px' }}>Email</div>
                  <div style={{ color: '#0f172a', fontWeight: 700 }}>{details.email}</div>
                </div>
                {details.role && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Shield size={18} color="#64748b" />
                    <div style={{ color: '#64748b', fontSize: '12px', minWidth: '60px' }}>Role</div>
                    <div style={{ color: '#0f172a', fontWeight: 700 }}>{details.role}</div>
                  </div>
                )}
              </div>
            )}
            {editMode && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ color: '#64748b', fontSize: 12 }}>Name</label>
                  <input name="name" value={form.name} onChange={handleInput} style={{
                    padding: '10px 12px', border: '1px solid rgba(148,163,184,0.35)', borderRadius: 8
                  }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ color: '#64748b', fontSize: 12 }}>Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleInput} style={{
                    padding: '10px 12px', border: '1px solid rgba(148,163,184,0.35)', borderRadius: 8
                  }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ color: '#64748b', fontSize: 12 }}>New Password</label>
                  <input name="password" type="password" value={form.password} onChange={handleInput} placeholder="Leave blank to keep" style={{
                    padding: '10px 12px', border: '1px solid rgba(148,163,184,0.35)', borderRadius: 8
                  }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ color: '#64748b', fontSize: 12 }}>Confirm Password</label>
                  <input name="confirm" type="password" value={form.confirm} onChange={handleInput} style={{
                    padding: '10px 12px', border: '1px solid rgba(148,163,184,0.35)', borderRadius: 8
                  }} />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={handleSave} style={{
                    padding: '10px 16px', background: 'none', color: '#0f172a', border: '1px solid rgba(148, 163, 184, 0.35)', borderRadius: 10, fontWeight: 700, cursor: 'pointer'
                  }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <Save size={18} /> Save Changes
                    </span>
                  </button>
                </div>
              </div>
            )}
            {!details && (
              <div style={{ color: '#334155' }}>Loading admin details...</div>
            )}
          </div>
        </div>

        {message && (
          <div style={{
            border: '1px solid rgba(148, 163, 184, 0.35)',
            color: '#334155',
            padding: '12px 16px',
            borderRadius: '10px'
          }}>{message}</div>
        )}
      </div>
    </div>
  )
}
