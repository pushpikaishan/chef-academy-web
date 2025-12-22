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
      const response = await fetch(
        `${apiBase}/users/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            name: editName,
            email: editEmail
          })
        }
      )
      
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
      background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
      padding: '60px 20px',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Settings Button */}
        <div style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          zIndex: 100
        }}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: 'none',
              background: showSettings
                ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                : '#fff',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              cursor: 'pointer',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
            }}
          >
            ⚙️
          </button>

          {/* Settings Dropdown */}
          {showSettings && (
            <div style={{
              position: 'absolute',
              top: '60px',
              right: '0',
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              minWidth: '200px',
              animation: 'slideDown 0.3s ease-out'
            }}>
              <button
                onClick={() => {
                  setShowSettings(false)
                  document.getElementById('fileInput').click()
                }}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f5f5f5'
                  e.currentTarget.style.color = '#FFD700'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#333'
                }}
              >
                <span>📸</span>
                Update Profile
              </button>
              <div style={{
                height: '1px',
                background: '#f0f0f0'
              }} />
              <button
                onClick={() => {
                  setShowSettings(false)
                  handleEditOpen()
                }}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f5f5f5'
                  e.currentTarget.style.color = '#4a90e2'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#333'
                }}
              >
                <span>✏️</span>
                Edit Profile
              </button>
              <div style={{
                height: '1px',
                background: '#f0f0f0'
              }} />
              <button
                onClick={() => {
                  setShowSettings(false)
                  handleLogout()
                }}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#d32f2f',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ffebee'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <span>🚪</span>
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Message Alert */}
        {message && (
          <div style={{
            marginBottom: '24px',
            padding: '16px 20px',
            background: message.includes('success') ? '#e8f5e9' : '#ffebee',
            color: message.includes('success') ? '#2e7d32' : '#c62828',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            animation: 'slideDown 0.4s ease-out'
          }}>
            {message}
          </div>
        )}

        {/* Main Profile Card */}
        <div style={{
          background: '#fff',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          overflow: 'visible',
          marginBottom: '32px'
        }}>
          {/* Profile Header */}
          <div style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            height: '160px',
            position: 'relative'
          }} />

          {/* Profile Content */}
          <div style={{
            padding: '0 40px 40px 40px'
          }}>
            {/* Profile Image & Name Section */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '32px',
              marginTop: '-80px',
              marginBottom: '40px',
              position: 'relative',
              zIndex: 20
            }}>
              {/* Profile Image */}
              <div style={{
                position: 'relative',
                flexShrink: 0
              }}>
                <div style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #F4B1A6 0%, #E44B34 50%, #D9D9D9 100%)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '5px'
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {profileImage ? (
                      <img
                        src={resolveSrc(profileImage)}
                        alt="profile"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div style={{ fontSize: '64px' }}>👤</div>
                    )}
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div style={{
                flex: 1,
                paddingTop: '20px'
              }}>
                {details ? (
                  <div>
                    <h1 style={{
                      margin: '0 0 16px 0',
                      fontSize: 'clamp(28px, 5vw, 48px)',
                      fontWeight: '900',
                      color: '#1a1a1a',
                      letterSpacing: '-1px',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {(details.name || 'User').substring(0, 30)}
                    </h1>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '16px',
                      color: '#666',
                      fontWeight: '500',
                      overflow: 'hidden'
                    }}>
                      <span style={{ fontSize: '18px', flexShrink: 0 }}>📧</span>
                      <span style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {(details.email || 'No email').substring(0, 35)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#999', fontSize: '14px' }}>
                    <p>Loading profile...</p>
                    <p style={{ fontSize: '12px', color: '#ccc' }}>User ID: {userId}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Lesson Overview Section */}
            {details && details.watchStats && (
              <div style={{
                marginTop: '40px',
                paddingTop: '40px',
                borderTop: '2px solid #f0f0f0'
              }}>
                <h2 style={{
                  margin: '0 0 32px 0',
                  fontSize: '20px',
                  fontWeight: '800',
                  color: '#1a1a1a',
                  letterSpacing: '0.5px'
                }}>
                  📚 Learning Progress
                </h2>

                {lessonsError && (
                  <div style={{
                    color: '#d32f2f',
                    marginBottom: '16px',
                    fontSize: '13px'
                  }}>
                    {lessonsError}
                  </div>
                )}

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '28px'
                }}>
                  {[
                    { label: '🍳 Hot & Cold Kitchen', key: 'kitchen', color: '#4a90e2', gradientStart: '#4a90e2', gradientEnd: '#357abd' },
                    { label: '🥐 Bakery & Pastry', key: 'bakery', color: '#f5a623', gradientStart: '#f5a623', gradientEnd: '#d47d1f' },
                    { label: '🔪 Butchery & Fish', key: 'butchery', color: '#7ed321', gradientStart: '#7ed321', gradientEnd: '#5fa516' },
                  ].map(({ label, key, color, gradientStart, gradientEnd }) => {
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
                        gap: '16px'
                      }}>
                        {/* Circle Progress */}
                        <div style={{
                          position: 'relative',
                          width: '140px',
                          height: '140px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <svg
                            width="140"
                            height="140"
                            style={{
                              transform: 'rotate(-90deg)',
                              position: 'absolute'
                            }}
                          >
                            {/* Background circle */}
                            <circle
                              cx="70"
                              cy="70"
                              r={radius}
                              fill="none"
                              stroke="#f0f0f0"
                              strokeWidth="6"
                            />
                            {/* Progress circle with gradient */}
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
                              style={{
                                transition: 'stroke-dashoffset 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                              }}
                            />
                          </svg>

                          {/* Center text */}
                          <div style={{
                            textAlign: 'center',
                            position: 'relative',
                            zIndex: 10
                          }}>
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
                            <div style={{
                              fontSize: '12px',
                              color: '#999',
                              fontWeight: '600',
                              marginTop: '4px'
                            }}>
                              Complete
                            </div>
                          </div>
                        </div>

                        {/* Label and stats */}
                        <div style={{
                          textAlign: 'center',
                          width: '100%'
                        }}>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            color: '#333',
                            marginBottom: '6px'
                          }}>
                            {label}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#666',
                            fontWeight: '500'
                          }}>
                            {count} of {available} lessons
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              animation: 'slideDown 0.3s ease-out'
            }}>
              <h2 style={{
                margin: '0 0 24px 0',
                fontSize: '24px',
                fontWeight: '800',
                color: '#1a1a1a'
              }}>
                Edit Profile
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#666',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#4a90e2'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(74,144,226,0.1)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#ddd'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#666',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#4a90e2'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(74,144,226,0.1)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#ddd'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '12px'
              }}>
                <button
                  onClick={() => setShowEditModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    border: '2px solid #ddd',
                    background: '#fff',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: '#666'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#999'
                    e.currentTarget.style.background = '#f5f5f5'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#ddd'
                    e.currentTarget.style.background = '#fff'
                  }}
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
                    background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: isUpdating ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    color: '#fff',
                    opacity: isUpdating ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isUpdating) {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(74,144,226,0.3)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isUpdating) {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }
                  }}
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          key={fileInputKey}
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          div[style*="padding: '0 40px 40px 40px'"] {
            padding: 24px 20px 32px 20px !important;
          }

          div[style*="gap: '32px'"] {
            gap: 20px !important;
            flex-direction: column !important;
            align-items: center !important;
          }

          div[style*="width: '160px'"] {
            width: 120px !important;
            height: 120px !important;
          }

          h1 {
            font-size: 24px !important;
          }

          h2 {
            font-size: 18px !important;
          }

          div[style*="display: 'grid'"][style*="gap: '20px'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}