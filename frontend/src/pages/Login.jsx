import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/authService'
import useAuth from '../hooks/useAuth'
import bcImage from '../assets/images/bc.png'
import appIcon from '../assets/images/appicon.png'

export default function Login(){
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isExiting, setIsExiting] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useAuth()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!form.email || !form.password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const account = await login(form)
      if (account?.token) localStorage.setItem('token', account.token)
      if (account?.role) localStorage.setItem('role', account.role)
      if (account?.id || account?._id) localStorage.setItem('id', (account.id || account._id))
      setUser?.(account)
      if (account.role === 'admin') navigate('/admin')
      else navigate('/')
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Login failed')
    } finally { 
      setLoading(false) 
    }
  }

  const handleLinkToRegister = () => {
    if (loading) return
    setIsExiting(true)
    setTimeout(() => navigate('/register'), 350)
  }

  const containerStyle = {
    height: '100vh', 
    width: '100vw',
    backgroundImage: `url(${bcImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: isMobile ? 'center' : 'flex-end', 
    padding: isMobile ? '20px' : '0',
    margin: '0',
    position: 'fixed',
    top: 0,
    left: 0,
    overflow: 'hidden',
    fontFamily: 'Arial, sans-serif'
  }

  const mainContainerStyle = {
    position: 'relative', 
    zIndex: 2, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: isMobile ? 'center' : 'space-between',
    width: '100%',
    height: '100%',
    paddingRight: isMobile ? '20px' : '60px',
    paddingLeft: isMobile ? '20px' : '60px',
    maxWidth: 'none',
    flexDirection: isMobile ? 'column' : 'row'
  }

  const leftSideStyle = {
    flex: 1, 
    display: isMobile ? 'none' : 'flex',
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    textAlign: 'center',
    marginRight: isMobile ? '0' : '80px',
    animation: 'brandEnter 0.6s ease-out'
  }

  const formContainerStyle = {
    width: '100%', 
    maxWidth: isMobile ? '100%' : '450px',
    flex: isMobile ? '1' : '0 1 450px'
  }

  const formCardStyle = {
    background: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(30px)',
    borderRadius: isMobile ? '20px' : '28px', 
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', 
    padding: isMobile ? '40px 25px' : '60px 50px',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    animation: isExiting ? 'slideOutLeft 0.35s ease-in forwards' : 'slideInRight 0.6s ease-out'
  }

  return (
    <div style={containerStyle}>
      {/* Dark Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.35)',
        zIndex: 1
      }}></div>

      {/* Main Container */}
      <div style={mainContainerStyle}>
        
        {/* Left Side - Branding (Hidden on mobile) */}
        <div style={leftSideStyle}>
          <div style={{ marginBottom: '40px', animation: 'brandEmojiEnter 0.6s ease-out, float 6s ease-in-out 0.6s infinite' }}>
            <div style={{ 
              width: '180px', 
              height: '180px', 
              background: 'rgba(87, 86, 86, 0.22)',
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)', 
              fontSize: '100px'
            }}>
              <img 
                src={appIcon} 
                alt="App Icon" 
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '18px', 
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.45))'
                }} 
              />
            </div>
          </div>
          
          <h1 style={{ 
            fontSize: '64px', 
            fontWeight: 'bold', 
            color: '#ffffff', 
            marginBottom: '24px', 
            textShadow: '3px 3px 8px rgba(0, 0, 0, 0.6)',
            letterSpacing: '2px',
            animation: 'fadeInUp 0.6s ease-out 0.2s both, glowPulse 3s ease-in-out 1s infinite'
          }}>
            Master Chef
          </h1>
          
          <p style={{ 
            fontSize: '20px', 
            color: '#f0f0f0', 
            marginBottom: '40px', 
            maxWidth: '450px', 
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            lineHeight: '1.6',
            animation: 'fadeInUp 0.6s ease-out 0.35s both'
          }}>
            Welcome to our culinary platform. Manage your recipes, reservations, and more with style.
          </p>
        </div>

        {/* Mobile Header (Visible on mobile) */}
        {isMobile && (
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '30px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ 
              width: '120px', 
              height: '120px', 
              background: 'rgba(87, 86, 86, 0.22)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)', 
              marginBottom: '20px'
            }}>
              <img 
                src={appIcon} 
                alt="App Icon" 
                style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'contain', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.25))' }}
              />
            </div>
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              color: '#ffffff', 
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
              letterSpacing: '1px',
              margin: '0 0 10px 0'
            }}>
              Chef Academy
            </h1>
          </div>
        )}

        {/* Right Side - Login Form */}
        <div style={formContainerStyle}>
          <div style={formCardStyle}>
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ 
                fontSize: isMobile ? '28px' : '36px', 
                fontWeight: 'bold', 
                color: '#ffffff', 
                marginBottom: '8px',
                letterSpacing: '0.5px',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
              }}>Welcome Back</h2>
              <p style={{ 
                color: '#e5e7eb',
                fontSize: isMobile ? '14px' : '16px',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
              }}>Sign in to your chef account</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '28px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ 
                  fontSize: isMobile ? '13px' : '15px', 
                  fontWeight: '700', 
                  color: '#f3f4f6',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
                }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: isMobile ? '13px' : '15px', fontSize: '18px' }}>✉️</span>
                  <input 
                    name="email" 
                    type="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    placeholder="your@email.com"
                    style={{ 
                      width: '100%', 
                      paddingLeft: '50px', 
                      paddingRight: '16px', 
                      paddingTop: isMobile ? '12px' : '14px', 
                      paddingBottom: isMobile ? '12px' : '14px', 
                      border: '2px solid #fef3c7', 
                      borderRadius: '10px', 
                      outline: 'none', 
                      transition: 'all 0.3s ease', 
                      backgroundColor: '#fffbeb', 
                      fontSize: isMobile ? '14px' : '15px', 
                      boxSizing: 'border-box',
                      fontWeight: '500'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#fbbf24'
                      e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#fef3c7'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ 
                  fontSize: isMobile ? '13px' : '15px', 
                  fontWeight: '700', 
                  color: '#f3f4f6',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: isMobile ? '13px' : '15px', fontSize: '18px' }}>🔒</span>
                  <input 
                    name="password" 
                    type={showPassword ? 'text' : 'password'} 
                    value={form.password} 
                    onChange={handleChange} 
                    placeholder="••••••••"
                    style={{ 
                      width: '100%', 
                      paddingLeft: '50px', 
                      paddingRight: '50px', 
                      paddingTop: isMobile ? '12px' : '14px', 
                      paddingBottom: isMobile ? '12px' : '14px', 
                      border: '2px solid #fef3c7', 
                      borderRadius: '10px', 
                      outline: 'none', 
                      transition: 'all 0.3s ease', 
                      backgroundColor: '#fffbeb', 
                      fontSize: isMobile ? '14px' : '15px', 
                      boxSizing: 'border-box',
                      fontWeight: '500',
                      letterSpacing: '2px'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#fbbf24'
                      e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#fef3c7'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ 
                      position: 'absolute', 
                      right: '14px', 
                      top: isMobile ? '11px' : '12px', 
                      background: 'none', 
                      border: 'none', 
                      fontSize: isMobile ? '18px' : '22px', 
                      cursor: 'pointer', 
                      padding: 0,
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    {showPassword ? '👁️' : '👁️'}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading} 
                style={{ 
                  padding: isMobile ? '12px 20px' : '14px 28px', 
                  background: loading ? 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)' : 'linear-gradient(135deg, #facc15 0%, #f59e0b 100%)', 
                  color: 'white', 
                  fontWeight: 'bold', 
                  fontSize: isMobile ? '14px' : '16px',
                  borderRadius: '10px', 
                  border: 'none', 
                  cursor: loading ? 'not-allowed' : 'pointer', 
                  transition: 'all 0.3s ease', 
                  boxShadow: '0 10px 25px rgba(245, 158, 11, 0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
                onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 15px 35px rgba(245, 158, 11, 0.5)')}
                onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = '0 10px 25px rgba(245, 158, 11, 0.4)')}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '3px solid white', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></span>
                    Logging in...
                  </span>
                ) : 'Login Now'}
              </button>

              {error && (
                <div style={{ 
                  background: '#fef2f2', 
                  border: '2px solid #fecaca', 
                  color: '#991b1b', 
                  padding: '12px', 
                  borderRadius: '10px', 
                  fontSize: isMobile ? '13px' : '14px', 
                  fontWeight: '500',
                  animation: 'slideDown 0.3s ease-out'
                }}>
                  ⚠️ {error}
                </div>
              )}

              <div style={{ 
                paddingTop: '16px', 
                borderTop: '1px solid #e5e7eb', 
                textAlign: 'center', 
                fontSize: isMobile ? '13px' : '15px', 
                color: '#6b7280' 
              }}>
                Don't have an account? <span style={{ 
                  color: '#fbbf24', 
                  fontWeight: '700', 
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }} 
                onMouseEnter={(e) => e.target.style.color = '#f59e0b'} 
                onMouseLeave={(e) => e.target.style.color = '#fbbf24'}
                onClick={handleLinkToRegister}
                >Sign up here</span>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideOutLeft {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-40px);
          }
        }
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
        @keyframes brandEnter {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes brandEmojiEnter {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes glowPulse {
          0%, 100% { text-shadow: 3px 3px 8px rgba(0,0,0,0.6); }
          50% { text-shadow: 0 0 18px rgba(255, 200, 80, 0.6); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  )
}