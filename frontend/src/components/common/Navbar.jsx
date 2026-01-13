import { Link, useLocation } from 'react-router-dom'
import appIcon from '../../assets/images/appicon.png'
import { useState, useEffect, useRef } from 'react'
import useAuth from '../../hooks/useAuth'

export default function Navbar(){
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const navRef = useRef(null)
  const [navHeight, setNavHeight] = useState(64)
  const { user } = useAuth() || {}
  const role = user?.role || localStorage.getItem('role')
  const isLoggedIn = !!(user || localStorage.getItem('token'))
  const isAdmin = role === 'admin'
  const [highlightRegisterCTA, setHighlightRegisterCTA] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (navRef.current) setNavHeight(navRef.current.clientHeight)
    }
    if (navRef.current) setNavHeight(navRef.current.clientHeight)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Fix scrollbar shift - use class instead of inline styles
  useEffect(() => {
    if (isMobile && mobileMenuOpen) {
      document.body.classList.add('menu-open')
    } else {
      document.body.classList.remove('menu-open')
    }
    return () => { document.body.classList.remove('menu-open') }
  }, [isMobile, mobileMenuOpen])

  // Nudge Get Started button if pages request it
  useEffect(() => {
    const checkNudge = () => {
      const nudge = localStorage.getItem('nudgeRegister')
      if (nudge) {
        setHighlightRegisterCTA(true)
        setTimeout(() => {
          setHighlightRegisterCTA(false)
          localStorage.removeItem('nudgeRegister')
        }, 1800)
      }
    }
    checkNudge()
    window.addEventListener('storage', checkNudge)
    return () => window.removeEventListener('storage', checkNudge)
  }, [])

  const isActive = (path) => pathname === path

  return (
    <>
      <nav ref={navRef} style={{
        background:  'linear-gradient(to bottom, #0f172a, rgba(0, 0, 0, 0.8))',
        borderBottom:'1px solid #1e293b',
        padding: '12px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '40px'
        }}>
          {/* Logo & Brand */}
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            fontSize: '20px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }} 
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}>
            <img src={appIcon} alt="Chef Academy" style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              objectFit: 'cover'
            }} />
            {!isMobile && (
              <span style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Chef Academy
              </span>
            )}
          </Link>

          {/* Navigation Links - Desktop */}
          {!isMobile && (
            <div style={{
              display: 'flex',
              gap: '30px',
              flex: 1
            }}>
              <Link 
                to="/about" 
                style={{
                  color: isActive('/about') ? '#FFD700' : '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#FFD700'
                  e.target.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = isActive('/about') ? '#FFD700' : '#cbd5e1'
                  e.target.style.textShadow = 'none'
                }}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                style={{
                  color: isActive('/contact') ? '#FFD700' : '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#FFD700'
                  e.target.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = isActive('/contact') ? '#FFD700' : '#cbd5e1'
                  e.target.style.textShadow = 'none'
                }}
              >
                Contact
              </Link>
            </div>
          )}

          {/* Right-side Action - Desktop */}
          {!isMobile && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {isLoggedIn ? (
                <>
                  {isAdmin ? (
                    <Link 
                      to="/admin" 
                      style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(to right, #34d399, #10b981)',
                        color: '#ffffff',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 0 15px rgba(16, 185, 129, 0.25)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)'
                        e.target.style.boxShadow = '0 0 25px rgba(16, 185, 129, 0.4)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)'
                        e.target.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.25)'
                      }}
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link 
                      to="/profile" 
                      style={{
                        padding: '8px 20px',
                        background: 'linear-gradient(to right, #FFD700, #FFA500)',
                        color: '#ffffff',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)'
                        e.target.style.boxShadow = '0 0 25px rgba(255, 215, 0, 0.4)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)'
                        e.target.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.2)'
                      }}
                    >
                      Profile
                    </Link>
                  )}
                </>
              ) : (
                <Link 
                  to="/register" 
                  style={{
                    padding: '10px 18px',
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    color: '#0b0b0b',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: '900',
                    border: '1px solid rgba(255, 215, 0, 0.45)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 10px 28px rgba(255, 215, 0, 0.35)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    letterSpacing: '0.6px',
                    textTransform: 'uppercase'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)'
                    e.currentTarget.style.boxShadow = '0 16px 36px rgba(255, 215, 0, 0.5)'
                    e.currentTarget.style.filter = 'brightness(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                    e.currentTarget.style.boxShadow = '0 10px 28px rgba(255, 215, 0, 0.35)'
                    e.currentTarget.style.filter = 'none'
                  }}
                >
                  
                  Get Started
                  <i className="fa-solid fa-arrow-right" style={{ fontSize: '15px' }}></i>
                </Link>
              )}
            </div>
          )}

          {/* Hamburger Menu */}
          {isMobile && (
            <button 
              style={{
                background: 'none',
                border: 'none',
                color: '#FFD700',
                fontSize: '24px',
                cursor: 'pointer'
              }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 999,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }}
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu */}
            <div style={{
              position: 'fixed',
              left: 0,
              right: 0,
              top: navHeight,
              maxHeight: `calc(100vh - ${navHeight}px)`,
              overflowY: 'auto',
              zIndex: 1100,
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              padding: '20px',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderTop: '1px solid rgba(255, 215, 0, 0.1)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 20px 40px rgba(0, 0, 0, 0.3)'
            }}>
              <Link 
                to="/about" 
                style={{
                  color: isActive('/about') ? '#FFD700' : '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '500',
                  padding: '12px 0'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                style={{
                  color: isActive('/contact') ? '#FFD700' : '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '500',
                  padding: '12px 0'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              {isLoggedIn ? (
                !isAdmin && (
                  <Link 
                    to="/profile" 
                    style={{
                      padding: '12px 20px',
                      background: 'linear-gradient(to right, #FFD700, #FFA500)',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      borderRadius: '6px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      marginTop: '10px'
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                )
              ) : (
                <Link 
                  to="/register" 
                  style={{
                    padding: '14px 22px',
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    color: '#0b0b0b',
                    textDecoration: 'none',
                    fontSize: '15px',
                    fontWeight: '900',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 215, 0, 0.45)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    marginTop: '10px',
                    boxShadow: '0 14px 34px rgba(255, 215, 0, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    letterSpacing: '0.7px',
                    textTransform: 'uppercase',
                    ...(highlightRegisterCTA ? { transform: 'translateY(-2px) scale(1.03)', boxShadow: '0 20px 40px rgba(255, 215, 0, 0.6)' } : {})
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                  <i className="fa-solid fa-arrow-right" style={{ fontSize: '16px' }}></i>
                </Link>
              )}
              {isAdmin && (
                <Link 
                  to="/admin" 
                  style={{
                    padding: '12px 20px',
                    background: 'linear-gradient(to right, #34d399, #10b981)',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    borderRadius: '6px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </>
        )}
      </nav>
    </>
  )
}