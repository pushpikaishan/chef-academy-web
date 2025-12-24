import { useLocation } from 'react-router-dom'

export default function Footer(){
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const currentYear = new Date().getFullYear()

  const footerStyle = {
    footer: {
      background: isHome ? 'transparent' : 'linear-gradient(to bottom, #0f172a, #000000)',
      color: '#ffffff',
      padding: '40px 20px',
      borderTop: '1px solid #1e293b',
      marginTop: '40px'
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto'
    },
    topSection: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      background: 'linear-gradient(to right, #FFD700, #FFA500)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '15px'
    },
    description: {
      color: '#94a3b8',
      fontSize: '13px',
      maxWidth: '600px',
      margin: '0 auto 15px',
      lineHeight: '1.5'
    },
    button: {
      padding: '12px 24px',
      background: 'linear-gradient(to right, #FFD700, #FFA500)',
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: '14px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
    },
    linksWrapper: {
      display: 'flex',
      justifyContent: 'center',
      gap: '60px',
      flexWrap: 'wrap',
      marginBottom: '40px'
    },
    linkSection: {
      textAlign: 'center'
    },
    sectionTitle: {
      fontSize: '12px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      color: '#cbd5e1',
      marginBottom: '15px',
      letterSpacing: '0.05em'
    },
    linksContainer: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'center'
    },
    link: {
      color: '#64748b',
      textDecoration: 'none',
      fontSize: '14px',
      transition: 'color 0.3s ease',
      cursor: 'pointer'
    },
    socialLinks: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center'
    },
    socialIcon: {
      width: '36px',
      height: '36px',
      borderRadius: '8px',
      background: '#1e293b',
      border: 'none',
      color: '#ffffff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      fontSize: '16px'
    },
    divider: {
      height: '1px',
      background: '#334155',
      margin: '30px 0'
    },
    bottomSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px',
      color: '#64748b',
      fontSize: '14px'
    },
    bottomLinks: {
      display: 'flex',
      gap: '24px'
    }
  }

  const handleButtonHover = (e) => {
    e.target.style.transform = 'scale(1.05)'
    e.target.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.5)'
  }

  const handleButtonLeave = (e) => {
    e.target.style.transform = 'scale(1)'
    e.target.style.boxShadow = '0 0 20px rgba(251, 146, 60, 0.3)'
  }

  const handleLinkHover = (e) => {
    e.target.style.color = '#FFD700'
  }

  const handleLinkLeave = (e) => {
    e.target.style.color = '#64748b'
  }

  const handleSocialHover = (e) => {
    e.target.style.background = 'linear-gradient(to right, #FFD700, #FFA500)'
    e.target.style.transform = 'scale(1.15)'
    e.target.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)'
  }

  const handleSocialLeave = (e) => {
    e.target.style.background = '#1e293b'
    e.target.style.transform = 'scale(1)'
    e.target.style.boxShadow = 'none'
  }

  return (
    <footer style={footerStyle.footer}>
      <div style={footerStyle.container}>
        {/* Top Section */}
        <div style={footerStyle.topSection}>
          <h3 style={footerStyle.title}>Chef Academy</h3>
          <p style={footerStyle.description}>
            Master the art of culinary excellence with world-class instructors and innovative techniques.
          </p>
          <button 
            style={footerStyle.button}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
          >
            Get Started →
          </button>
        </div>

        {/* Links Section */}
        <div style={footerStyle.linksWrapper}>
          {/* Quick Links */}
          <div style={footerStyle.linkSection}>
            <h4 style={footerStyle.sectionTitle}>Quick Links</h4>
            <div style={footerStyle.linksContainer}>
              {['Courses', 'Instructors', 'About', 'Blog'].map(link => (
                <a 
                  key={link}
                  href="#" 
                  style={footerStyle.link}
                  onMouseEnter={handleLinkHover}
                  onMouseLeave={handleLinkLeave}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div style={footerStyle.linkSection}>
            <h4 style={footerStyle.sectionTitle}>Resources</h4>
            <div style={footerStyle.linksContainer}>
              {['Documentation', 'Community', 'Support', 'FAQ'].map(link => (
                <a 
                  key={link}
                  href="#" 
                  style={footerStyle.link}
                  onMouseEnter={handleLinkHover}
                  onMouseLeave={handleLinkLeave}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Us */}
          <div style={footerStyle.linkSection}>
            <h4 style={footerStyle.sectionTitle}>Contact Us</h4>
            <div style={footerStyle.linksContainer}>
              {['Email', 'Phone', 'Address', 'Chat'].map(link => (
                <a 
                  key={link}
                  href="#" 
                  style={footerStyle.link}
                  onMouseEnter={handleLinkHover}
                  onMouseLeave={handleLinkLeave}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Social Section */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h4 style={footerStyle.sectionTitle}>Follow Us</h4>
          <div style={footerStyle.socialLinks}>
            {[
              { icon: '𝕏', href: '#' },
              { icon: '⚙', href: '#' },
              { icon: 'in', href: '#' },
              { icon: '✉', href: '#' }
            ].map((item, idx) => (
              <button
                key={idx}
                style={footerStyle.socialIcon}
                onMouseEnter={handleSocialHover}
                onMouseLeave={handleSocialLeave}
                onClick={() => window.open(item.href)}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={footerStyle.divider}></div>

        {/* Bottom Section */}
        <div style={footerStyle.bottomSection}>
          <p>© {currentYear} Chef Academy. All rights reserved.</p>
          <div style={footerStyle.bottomLinks}>
            <a 
              href="#" 
              style={footerStyle.link}
              onMouseEnter={handleLinkHover}
              onMouseLeave={handleLinkLeave}
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              style={footerStyle.link}
              onMouseEnter={handleLinkHover}
              onMouseLeave={handleLinkLeave}
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}