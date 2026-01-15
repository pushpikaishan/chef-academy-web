import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChefHat, Users, Award, Lightbulb, ArrowRight } from 'lucide-react'
import { getGlobalCounts } from '../services/statsService'

export default function About() {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)
  const [counts, setCounts] = useState({ users: 0, recipes: 0, lessons: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await getGlobalCounts()
        if (mounted && data) setCounts({
          users: Number(data.users || 0),
          recipes: Number(data.recipes || 0),
          lessons: Number(data.lessons || 0)
        })
      } catch (_) {
        // ignore errors for a graceful UI
      }
    })()
    return () => { mounted = false }
  }, [])

  const isMobile = windowWidth < 768
  const isTablet = windowWidth < 1024 && windowWidth >= 768

  const features = [
    { icon: ChefHat, title: 'Expert Instructors', desc: 'Learn from world-class culinary professionals with decades of experience' },
    { icon: Users, title: 'Community', desc: 'Join thousands of passionate food enthusiasts from around the globe' },
    { icon: Award, title: 'Certification', desc: 'Earn recognized certifications upon completing our courses' },
    { icon: Lightbulb, title: 'Innovation', desc: 'Master both traditional techniques and modern culinary trends' }
  ]

  return (
    <div style={{
      minHeight: '100vh',
     // background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #f0f2f5 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background elements */}
      <div style={{
        position: 'fixed',
        top: '-30%',
        right: '-10%',
        width: isMobile ? '250px' : '600px',
        height: isMobile ? '250px' : '600px',
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
        width: isMobile ? '200px' : '500px',
        height: isMobile ? '200px' : '500px',
        background: 'radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 10s ease-in-out infinite',
        animationDelay: '2s',
        filter: 'blur(60px)',
        zIndex: 1
      }} />

      {/* Main container */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: isMobile ? '24px 16px' : isTablet ? '40px 24px' : '60px 40px'
      }}>
        {/* Header Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: isMobile ? '40px' : isTablet ? '60px' : '80px',
          maxWidth: '900px',
          margin: '0 auto ' + (isMobile ? '40px' : isTablet ? '60px' : '80px')
        }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,215,0,0.1)',
            border: '1px solid rgba(255,215,0,0.3)',
            borderRadius: '30px',
            padding: isMobile ? '6px 16px' : '8px 20px',
            marginBottom: isMobile ? '12px' : '20px'
          }}>
            <span style={{
              color: '#FFA500',
              fontSize: isMobile ? '11px' : '12px',
              fontWeight: '700',
              letterSpacing: '1.5px',
              textTransform: 'uppercase'
            }}>
              🎓 About Us
            </span>
          </div>

          <h1 style={{
            fontSize: isMobile ? '32px' : isTablet ? '48px' : '64px',
            fontWeight: '900',
            color: '#1a1a1a',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: '1.2'
          }}>
            Chef Academy: Your Culinary Journey Starts Here
          </h1>

          <p style={{
            fontSize: isMobile ? '14px' : isTablet ? '16px' : '18px',
            color: '#959595',
            lineHeight: '1.7',
            marginBottom: '24px'
          }}>
            We're dedicated to sharing culinary knowledge, authentic recipes, and professional techniques with food enthusiasts worldwide. Our mission is to empower you to cook with confidence and creativity.
          </p>

          
        </div>

        {/* Stats Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: isMobile ? '12px' : isTablet ? '16px' : '24px',
          marginBottom: isMobile ? '40px' : isTablet ? '60px' : '80px',
          maxWidth: '1200px',
          margin: '0 auto ' + (isMobile ? '40px' : isTablet ? '60px' : '80px')
        }}>
          {[
            { number: String(counts.users)+'+', label: 'Students' },
            { number: String(counts.recipes)+'+', label: 'Recipes' },
            { number: String(counts.lessons)+'+', label: 'Courses' },
            { number: '100%', label: 'Quality' }
          ].map((stat, idx) => (
            <div key={idx} style={{
              background: '#ffffff',
              border: '1px solid #e0e0e0',
              padding: isMobile ? '16px' : isTablet ? '24px' : '32px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.borderColor = 'rgba(255,215,0,0.5)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,215,0,0.15)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.borderColor = '#e0e0e0'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'
                e.currentTarget.style.transform = 'translateY(0)'
              }
            }}
            >
              <h3 style={{
                fontSize: isMobile ? '20px' : isTablet ? '24px' : '32px',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: '0 0 8px 0'
              }}>
                {stat.number}
              </h3>
              <p style={{
                fontSize: isMobile ? '12px' : '14px',
                color: '#666',
                margin: 0,
                fontWeight: '600'
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: isMobile ? '28px' : isTablet ? '40px' : '48px',
            fontWeight: '900',
            background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: isMobile ? '24px' : '48px',
            textAlign: 'center'
          }}>
            Why Choose Chef Academy?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: isMobile ? '16px' : isTablet ? '20px' : '24px'
          }}>
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} style={{
                  background: '#ffffff',
                  border: '1px solid #e0e0e0',
                  padding: isMobile ? '20px' : isTablet ? '28px' : '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.borderColor = 'rgba(255,215,0,0.5)'
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(255,215,0,0.15)'
                    e.currentTarget.style.transform = 'translateY(-8px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.borderColor = '#e0e0e0'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }
                }}
                >
                  <div style={{
                    width: isMobile ? '40px' : '52px',
                    height: isMobile ? '40px' : '52px',
                    background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,165,0,0.1))',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: isMobile ? '12px' : '16px'
                  }}>
                    <Icon size={isMobile ? 20 : 24} color="#FFA500" />
                  </div>

                  <h3 style={{
                    fontSize: isMobile ? '16px' : '18px',
                    fontWeight: '700',
                    color: '#1a1a1a',
                    margin: '0 0 8px 0'
                  }}>
                    {feature.title}
                  </h3>

                  <p style={{
                    fontSize: isMobile ? '13px' : '14px',
                    color: '#666',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    {feature.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          marginTop: isMobile ? '40px' : isTablet ? '60px' : '80px',
          maxWidth: '900px',
          margin: (isMobile ? '40px' : isTablet ? '60px' : '80px') + ' auto 0',
          background: 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,165,0,0.05) 100%)',
          border: '2px solid rgba(255,215,0,0.2)',
          padding: isMobile ? '24px' : isTablet ? '40px' : '60px',
          borderRadius: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: isMobile ? '20px' : isTablet ? '28px' : '36px',
            fontWeight: '900',
            background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            Ready to Master Your Culinary Skills?
          </h3>

          <p style={{
            fontSize: isMobile ? '13px' : isTablet ? '15px' : '16px',
            color: '#a1a0a0',
            marginBottom: '24px',
            lineHeight: '1.6'
          }}>
            Join thousands of students and start your journey with Chef Academy today. Learn from industry experts and elevate your cooking skills to the next level.
          </p>

          <button
            style={{
              padding: isMobile ? '10px 20px' : '12px 32px',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: isMobile ? '13px' : '15px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(255,215,0,0.3)',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
            onClick={() => navigate('/')}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(255,215,0,0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,215,0,0.3)'
              }
            }}
          >
            Get Started Today
            <ArrowRight size={isMobile ? 14 : 16} />
          </button>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }
      `}</style>
    </div>
  )
}