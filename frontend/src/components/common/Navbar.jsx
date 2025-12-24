import { Link, useLocation } from 'react-router-dom'
import appIcon from '../../assets/images/appicon.png'
import { useState, useEffect } from 'react'

export default function Navbar(){
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isActive = (path) => pathname === path

  return (
    <>
      <nav style={{
        background: isHome ? 'transparent' : 'linear-gradient(to bottom, #0f172a, rgba(0, 0, 0, 0.8))',
        borderBottom: isHome ? 'none' : '1px solid #1e293b',
        padding: '12px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(10px)'
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

          {/* Profile Button - Desktop */}
          {!isMobile && (
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
          <div style={{
            background: 'linear-gradient(to bottom, #0f172a, rgba(0, 0, 0, 0.9))',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            marginTop: '15px'
          }}>
            <Link 
              to="/about" 
              style={{
                color: isActive('/about') ? '#FFD700' : '#cbd5e1',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500'
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
                fontWeight: '500'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              to="/profile" 
              style={{
                padding: '8px 20px',
                background: 'linear-gradient(to right, #FFD700, #FFA500)',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 'bold',
                borderRadius: '6px',
                textAlign: 'center',
                cursor: 'pointer'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
          </div>
        )}
      </nav>
    </>
  )
}