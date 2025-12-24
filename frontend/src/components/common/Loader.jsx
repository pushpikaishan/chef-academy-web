import appIcon from '../../assets/images/appicon.png';
export default function Loader(){
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      height: '100vh',
      background: '#f5f5f5'
    }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .spinner {
          animation: spin 2s linear infinite;
        }
        @keyframes labelPulse {
          0%, 100% { opacity: 0.75; }
          50% { opacity: 1; }
        }
        @keyframes blink {
          0%, 80%, 100% { opacity: 0; }
          40% { opacity: 1; }
        }
        .dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          margin-left: 6px;
          border-radius: 50%;
          background: currentColor;
          animation: blink 1.2s infinite;
        }
      `}</style>
      
      <div style={{
        position: 'relative',
        width: '120px',
        height: '120px'
      }}>
        {/* Orange-yellow spinner circle */}
        <div style={{
          position: 'absolute',
          width: '120px',
          height: '120px',
          border: '6px solid #f0f0f0',
          borderTop: '6px solid #FFD700',
          borderRight: '6px solid #FFA500',
          borderRadius: '50%',
          className: 'spinner'
        }} className="spinner"></div>
        
        {/* App icon in center */}
        <img
          src={appIcon}
          alt="App Icon"
          style={{
            position: 'absolute',
            width: '80px',
            height: '80px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '16px'
          }}
        />
      </div>

      {/* Loading label below spinner */}
      <p style={{
        marginTop: '14px',
        color: '#b45309',
        fontSize: '14px',
        fontWeight: 700,
        letterSpacing: '0.5px',
        animation: 'labelPulse 1.6s ease-in-out infinite'
      }}>
        Loading
        <span className="dot" style={{ animationDelay: '0s' }} />
        <span className="dot" style={{ animationDelay: '0.2s' }} />
        <span className="dot" style={{ animationDelay: '0.4s' }} />
      </p>
    </div>
  )
}