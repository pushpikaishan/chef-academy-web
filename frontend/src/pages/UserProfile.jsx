import { useEffect, useState } from 'react'
import { updateUserPhoto, getUserById } from '../services/authService'
import { getAllLessonVideos } from '../services/lessonVideoService'

export default function UserProfile(){
  const [userId, setUserId] = useState(() => localStorage.getItem('id') || '')
  const [profileImage, setProfileImage] = useState('')
  const [message, setMessage] = useState('')
  const [details, setDetails] = useState(null)
  const [lessons, setLessons] = useState([])
  const [lessonsError, setLessonsError] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [fileInputKey, setFileInputKey] = useState(0)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
  const resolveSrc = (src) => {
    if (!src) return ''
    if (/^https?:\/\//i.test(src)) return src
    return `${apiBase}${src.startsWith('/') ? '' : '/'}${src}`
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return
    try {
      const res = await updateUserPhoto(userId, file)
      setProfileImage(res.profileImage)
      setMessage('Profile photo updated successfully!')
      setFileInputKey(prev => prev + 1)
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage(err?.response?.data?.error || err?.message || 'Upload failed')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('id')
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  const handleEditOpen = () => {
    if (details) {
      setEditName(details.name || '')
      setEditEmail(details.email || '')
      setShowEditModal(true)
    }
  }

  const handleEditSave = async () => {
    if (!editName.trim()) {
      setMessage('Name cannot be empty')
      return
    }
    setIsUpdating(true)
    try {
      const response = await fetch(`${apiBase}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: editName, email: editEmail })
      })
      if (!response.ok) throw new Error('Failed to update profile')
      setDetails({ ...details, name: editName, email: editEmail })
      setMessage('Profile updated successfully!')
      setShowEditModal(false)
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage(err?.message || 'Failed to update profile')
    } finally {
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    (async () => {
      if (!userId) return
      try {
        const data = await getUserById(userId)
        setDetails(data)
        setProfileImage(data.profileImage || '')
      } catch (err) {
        setMessage(err?.response?.data?.error || err?.message || 'Failed to load user')
      }
    })()
  }, [userId])

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllLessonVideos()
        setLessons(data || [])
        setLessonsError('')
      } catch (e) {
        setLessonsError(e?.response?.data?.error || e?.message || 'Failed to load lessons')
      }
    })()
  }, [])

  const totalsByDept = (() => {
    const t = { kitchen: 0, bakery: 0, butchery: 0 }
    for (const it of lessons) {
      const d = (it?.department || '').toLowerCase()
      if (!d) continue
      if (d.includes('kitchen')) t.kitchen++
      else if (d.includes('bakery')) t.bakery++
      else if (d.includes('butch')) t.butchery++
    }
    return t
  })()

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      //background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #f0f2f5 100%)',
      padding: '60px 20px',
      position: 'relative'
    }}>
      {/* Background floating elements */}
      <div style={{
        position: 'fixed',
        top: '-30%',
        right: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(255,165,0,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite',
        filter: 'blur(60px)',
        zIndex: 1
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-20%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 10s ease-in-out infinite',
        animationDelay: '2s',
        filter: 'blur(60px)',
        zIndex: 1
      }} />

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Settings Button */}
        <div style={{ position: 'absolute', top: '30px', right: '30px', zIndex: 100 }}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              border: 'none',
              background: showSettings ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' : '#fff',
              boxShadow: showSettings ? '0 12px 32px rgba(255,215,0,0.3)' : '0 8px 24px rgba(0,0,0,0.12)',
              cursor: 'pointer',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.12)'
              e.currentTarget.style.boxShadow = '0 14px 36px rgba(0,0,0,0.18)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = showSettings ? '0 12px 32px rgba(255,215,0,0.3)' : '0 8px 24px rgba(0,0,0,0.12)'
            }}
          >
            ⚙️
          </button>

          {/* Settings Menu */}
          {showSettings && (
            <div style={{
              position: 'absolute',
              top: '70px',
              right: '0',
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
              overflow: 'hidden',
              minWidth: '220px',
              border: '1px solid rgba(0,0,0,0.05)',
              animation: 'slideDown 0.3s ease-out'
            }}>
              {[
                { icon: '📸', label: 'Update Profile', onClick: () => { setShowSettings(false); document.getElementById('fileInput').click() }, color: '#FFD700' },
                { icon: '✏️', label: 'Edit Profile', onClick: () => { setShowSettings(false); handleEditOpen() }, color: '#4a90e2' },
                { icon: '🚪', label: 'Logout', onClick: () => { setShowSettings(false); handleLogout() }, color: '#d32f2f' }
              ].map((item, idx) => (
                <div key={idx}>
                  <button
                    onClick={item.onClick}
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = item.color === '#d32f2f' ? '#ffebee' : item.color === '#FFD700' ? '#fff3e0' : '#e3f2fd'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <span>{item.icon}</span>{item.label}
                  </button>
                  {idx < 2 && <div style={{ height: '1px', background: '#f0f0f0' }} />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Alert */}
        {message && (
          <div style={{
            marginBottom: '24px',
            padding: '16px 20px',
            background: message.includes('success') ? 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)' : 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
            color: message.includes('success') ? '#2e7d32' : '#c62828',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            animation: 'slideDown 0.4s ease-out',
            border: message.includes('success') ? '1px solid rgba(46,125,50,0.2)' : '1px solid rgba(198,40,40,0.2)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            {message}
          </div>
        )}

        {/* Main Profile Card */}
        <div style={{
          background: '#fff',
          borderRadius: '28px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.12)',
          marginBottom: '32px',
          border: '1px solid rgba(0,0,0,0.05)',
          position: 'relative',
          zIndex: 10,
          overflow: 'hidden'
        }}>
          {/* Profile Header */}
          <div style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', height: '180px', position: 'relative' }} />

          {/* Profile Content */}
          <div style={{ padding: '0 40px 40px 40px', background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, #ffffff 50%)' }}>
            {/* Profile Image & Name */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '32px',
              marginTop: '-90px',
              marginBottom: '40px',
              position: 'relative',
              zIndex: 20
            }}>
              {/* Profile Picture */}
              <div style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                boxShadow: '0 16px 40px rgba(255,215,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                border: '4px solid #fff',
                flexShrink: 0,
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {profileImage ? (
                    <img src={resolveSrc(profileImage)} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ fontSize: '64px' }}>👤</div>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div style={{ flex: 1, paddingTop: '20px' }}>
                {details ? (
                  <div>
                    <h1 style={{
                      margin: '0 0 16px 0',
                      fontSize: 'clamp(28px, 5vw, 48px)',
                      fontWeight: '900',
                      color: '#1a1a1a'
                    }}>
                      {(details.name || 'User').substring(0, 30)}
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', color: '#666' }}>
                      <span>📧</span>
                      <span>{(details.email || 'No email').substring(0, 35)}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#999', fontSize: '14px' }}>
                    <p>Loading profile...</p>
                    <p style={{ fontSize: '12px' }}>User ID: {userId}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Learning Progress */}
            {details && details.watchStats && (
              <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '2px solid rgba(255,215,0,0.2)' }}>
                <h2 style={{ margin: '0 0 32px 0', fontSize: '20px', fontWeight: '800', color: '#1a1a1a' }}>📚 Learning Progress</h2>

                {lessonsError && (
                  <div style={{
                    color: '#d32f2f',
                    marginBottom: '16px',
                    fontSize: '13px',
                    background: '#ffebee',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(211,47,47,0.2)'
                  }}>
                    {lessonsError}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '28px' }}>
                  {[
                    { label: '🍳 Hot & Cold Kitchen', key: 'kitchen', gradientStart: '#4a90e2', gradientEnd: '#357abd' },
                    { label: '🥐 Bakery & Pastry', key: 'bakery', gradientStart: '#f5a623', gradientEnd: '#d47d1f' },
                    { label: '🔪 Butchery & Fish', key: 'butchery', gradientStart: '#7ed321', gradientEnd: '#5fa516' },
                  ].map(({ label, key, gradientStart, gradientEnd }) => {
                    const count = details.watchStats[key] || 0
                    const available = totalsByDept[key] || 0
                    const pct = available ? Math.min(100, Math.round((count / available) * 100)) : 0
                    const radius = 45
                    const circumference = 2 * Math.PI * radius
                    const offset = circumference - (pct / 100) * circumference

                    return (
                      <div key={key} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '20px',
                        background: 'linear-gradient(135deg, rgba(255,215,0,0.05) 0%, rgba(255,165,0,0.02) 100%)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,215,0,0.1)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,165,0,0.05) 100%)'
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,215,0,0.15)'
                        e.currentTarget.style.transform = 'translateY(-4px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,215,0,0.05) 0%, rgba(255,165,0,0.02) 100%)'
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                      >
                        <div style={{ position: 'relative', width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="140" height="140" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
                            <circle cx="70" cy="70" r={radius} fill="none" stroke="#f0f0f0" strokeWidth="6" />
                            <defs>
                              <linearGradient id={`grad-${key}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={gradientStart} />
                                <stop offset="100%" stopColor={gradientEnd} />
                              </linearGradient>
                            </defs>
                            <circle
                              cx="70"
                              cy="70"
                              r={radius}
                              fill="none"
                              stroke={`url(#grad-${key})`}
                              strokeWidth="6"
                              strokeDasharray={circumference}
                              strokeDashoffset={offset}
                              strokeLinecap="round"
                              style={{ transition: 'stroke-dashoffset 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
                            />
                          </svg>
                          <div style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
                            <div style={{
                              fontSize: '28px',
                              fontWeight: '900',
                              background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text'
                            }}>
                              {pct}%
                            </div>
                            <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginTop: '4px' }}>Complete</div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'center', width: '100%' }}>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#333', marginBottom: '6px' }}>{label}</div>
                          <div style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>{count} of {available} lessons</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}>
              <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: '800', color: '#1a1a1a' }}>Edit Profile</h2>

              {[
                { label: 'Full Name', value: editName, onChange: (e) => setEditName(e.target.value) },
                { label: 'Email', value: editEmail, onChange: (e) => setEditEmail(e.target.value), type: 'email' }
              ].map((field, idx) => (
                <div key={idx} style={{ marginBottom: idx === 0 ? '20px' : '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#666', marginBottom: '8px', textTransform: 'uppercase' }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type || 'text'}
                    value={field.value}
                    onChange={field.onChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #ddd',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      background: '#f8f9fa',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#FFD700'
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,215,0,0.15)'
                      e.currentTarget.style.background = '#fff'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#ddd'
                      e.currentTarget.style.boxShadow = 'none'
                      e.currentTarget.style.background = '#f8f9fa'
                    }}
                  />
                </div>
              ))}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowEditModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    border: '2px solid #ddd',
                    background: '#fff',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    color: '#666',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#999'; e.currentTarget.style.background = '#f5f5f5' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.background = '#fff' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  disabled={isUpdating}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: isUpdating ? 'not-allowed' : 'pointer',
                    color: '#fff',
                    opacity: isUpdating ? 0.7 : 1,
                    boxShadow: '0 6px 16px rgba(255,215,0,0.2)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { if (!isUpdating) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(255,215,0,0.4)' } }}
                  onMouseLeave={(e) => { if (!isUpdating) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(255,215,0,0.2)' } }}
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* File Input */}
        <input key={fileInputKey} id="fileInput" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
      </div>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(30px); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        @media (max-width: 768px) {
          * { padding: var(--mobile-p, auto); }
        }
      `}</style>
    </div>
  )
}