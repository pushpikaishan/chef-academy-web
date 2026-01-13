import React from 'react'

export default function AccessModal({ open, onClose, onPrimary, title, message }) {
  if (!open) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose?.()
  }

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn 200ms ease-out'
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          width: 'min(520px, 92%)',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.28)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
          background: 'linear-gradient(135deg, rgba(74, 73, 73, 0.15) 0%, rgba(64, 64, 64, 0.33) 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      >
        <div style={{
          height: '6px',
          background: 'linear-gradient(90deg, #FFD700, #FFA500)',
        }} />

        <div style={{
          padding: '28px 28px 24px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '10px'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(255,215,0,0.35) 0%, rgba(255,165,0,0.35) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.35)'
            }}>
              <span style={{ fontSize: '22px' }}>🔒</span>
            </div>
            <h3 style={{
              margin: 0,
              color: '#f4f2f2',
              fontSize: '20px',
              fontWeight: 900,
              letterSpacing: '-0.3px'
            }}>
              {title || 'Access Restricted'}
            </h3>
          </div>

          <p style={{
            margin: '0 0 18px',
            color: '#faf6f6',
            fontSize: '14px',
            lineHeight: 1.7
          }}>
            {message || 'Please register or log in to access Video Lessons.'}
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={onPrimary}
              style={{
                padding: '12px 18px',
                border: '2px solid #FFA500',
                //border: '2px solid linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                borderRadius: '10px',
                background: 'none',
                color: '#FFA500',
                fontWeight: 800,
                letterSpacing: '0.4px',
                cursor: 'pointer',
                boxShadow: '0 10px 24px rgba(255,215,0,0.38)',
                transition: 'transform 160ms ease, box-shadow 160ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 14px 32px rgba(255,215,0,0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(255,215,0,0.38)'
              }}
            >
              Register Now
            </button>

            <button
              onClick={onClose}
              style={{
                padding: '12px 18px',
                borderRadius: '10px',
                border: '2px solid rgba(235, 232, 232, 0.12)',
                background: 'transparent',
                color: '#FFA500',
                fontWeight: 700,
                letterSpacing: '0.4px',
                cursor: 'pointer',
                transition: 'transform 160ms ease, border-color 160ms ease, background 160ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FFA500'
                e.currentTarget.style.background = 'rgba(235, 232, 232, 0.12)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(235, 232, 232, 0.12)'
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Maybe Later
            </button>
          </div>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  )
}
