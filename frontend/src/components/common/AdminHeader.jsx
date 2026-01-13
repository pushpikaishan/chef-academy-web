import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function AdminHeader(){
  const { pathname } = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
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

  const isActive = (path) => pathname === path

  return (
    <nav style={{
      background: 'linear-gradient(to bottom, #1f2937, rgba(0, 0, 0, 0.85))',
      borderBottom: '1px solid #374151',
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
        gap: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/admin" style={{
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#fbbf24'
          }}>
            Admin Panel
          </Link>
          <Link 
            to="/" 
            style={{
              padding: '6px 12px',
              background: 'linear-gradient(to right, #93c5fd, #60a5fa)',
              color: '#0b1020',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 'bold',
              borderRadius: '6px',
              border: '1px solid #3b82f6',
              boxShadow: '0 0 12px rgba(59, 130, 246, 0.25)'
            }}
          >
            View Site
          </Link>
        </div>

        {!isMobile && (
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/admin" style={{
              color: isActive('/admin') ? '#fbbf24' : '#e5e7eb',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>Dashboard</Link>
            <Link to="/admin/users" style={{
              color: isActive('/admin/users') ? '#fbbf24' : '#e5e7eb',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>Users</Link>
            <Link to="/admin/recipes" style={{
              color: isActive('/admin/recipes') ? '#fbbf24' : '#e5e7eb',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>Recipes</Link>
            <Link to="/admin/tools" style={{
              color: isActive('/admin/tools') ? '#fbbf24' : '#e5e7eb',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>Tools</Link>
            <Link to="/admin/theories" style={{
              color: isActive('/admin/theories') ? '#fbbf24' : '#e5e7eb',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>Theories</Link>
            <Link to="/admin/questions" style={{
              color: isActive('/admin/questions') ? '#fbbf24' : '#e5e7eb',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>Questions</Link>
            <Link to="/admin/profile" style={{
              padding: '8px 16px',
              background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
              color: '#111827',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 'bold',
              borderRadius: '6px'
            }}>Admin Profile</Link>
          </div>
        )}

        {isMobile && (
          <button 
            style={{
              background: 'none',
              border: 'none',
              color: '#fbbf24',
              fontSize: '24px',
              cursor: 'pointer'
            }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        )}
      </div>

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
          
          {/* Mobile Menu */}
          <div style={{
            position: 'fixed',
            left: 0,
            right: 0,
            top: '56px',
            maxHeight: 'calc(100vh - 56px)',
            overflowY: 'auto',
            zIndex: 1100,
            background: 'linear-gradient(to bottom, #1f2937, rgba(0, 0, 0, 0.9))',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            borderTop: '1px solid rgba(251, 191, 36, 0.1)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 20px 40px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}>
            <Link 
              to="/" 
              style={{ 
                color: '#111827', 
                background: 'linear-gradient(to right, #93c5fd, #60a5fa)', 
                padding: '8px 12px', 
                borderRadius: '6px', 
                textDecoration: 'none',
                fontWeight: '500'
              }} 
              onClick={() => setMobileMenuOpen(false)}
            >
              View Site
            </Link>
            <Link 
              to="/admin" 
              style={{ 
                color: isActive('/admin') ? '#fbbf24' : '#e5e7eb', 
                textDecoration: 'none',
                padding: '8px 0',
                fontSize: '14px',
                fontWeight: '500'
              }} 
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/admin/users" 
              style={{ 
                color: isActive('/admin/users') ? '#fbbf24' : '#e5e7eb', 
                textDecoration: 'none',
                padding: '8px 0',
                fontSize: '14px',
                fontWeight: '500'
              }} 
              onClick={() => setMobileMenuOpen(false)}
            >
              Users
            </Link>
            <Link 
              to="/admin/recipes" 
              style={{ 
                color: isActive('/admin/recipes') ? '#fbbf24' : '#e5e7eb', 
                textDecoration: 'none',
                padding: '8px 0',
                fontSize: '14px',
                fontWeight: '500'
              }} 
              onClick={() => setMobileMenuOpen(false)}
            >
              Recipes
            </Link>
            <Link 
              to="/admin/tools" 
              style={{ 
                color: isActive('/admin/tools') ? '#fbbf24' : '#e5e7eb', 
                textDecoration: 'none',
                padding: '8px 0',
                fontSize: '14px',
                fontWeight: '500'
              }} 
              onClick={() => setMobileMenuOpen(false)}
            >
              Tools
            </Link>
            <Link 
              to="/admin/theories" 
              style={{ 
                color: isActive('/admin/theories') ? '#fbbf24' : '#e5e7eb', 
                textDecoration: 'none',
                padding: '8px 0',
                fontSize: '14px',
                fontWeight: '500'
              }} 
              onClick={() => setMobileMenuOpen(false)}
            >
              Theories
            </Link>
            <Link 
              to="/admin/questions" 
              style={{ 
                color: isActive('/admin/questions') ? '#fbbf24' : '#e5e7eb', 
                textDecoration: 'none',
                padding: '8px 0',
                fontSize: '14px',
                fontWeight: '500'
              }} 
              onClick={() => setMobileMenuOpen(false)}
            >
              Questions
            </Link>
            <Link 
              to="/admin/profile" 
              style={{ 
                color: '#111827', 
                background: 'linear-gradient(to right, #fbbf24, #f59e0b)', 
                padding: '8px 12px', 
                borderRadius: '6px', 
                textDecoration: 'none',
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: '8px'
              }} 
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin Profile
            </Link>
          </div>
        </>
      )}
    </nav>
  )
}