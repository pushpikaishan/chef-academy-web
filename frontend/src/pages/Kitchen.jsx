import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import kitchenImg from '../assets/images/kitchen.jpg'

export default function Kitchen() {
  const [activeTab, setActiveTab] = useState(0)
  const [hoveredBtn, setHoveredBtn] = useState(null)
  const navigate = useNavigate()

  const tabs = [
    { 
      title: 'Video Lessons', 
      desc: 'Learn techniques with step-by-step videos',
      icon: '🎥',
      content: 'Explore our comprehensive video library with professional chefs guiding you through every step.'
    },
    { 
      title: 'Recipes', 
      desc: 'Curated recipes for all levels',
      icon: '📖',
      content: 'Discover thousands of delicious recipes curated by experts for beginners to advanced cooks.'
    },
    { 
      title: 'Equipments', 
      desc: 'Tools and gear for the kitchen',
      icon: '🔪',
      content: 'Learn about essential kitchen tools and equipment to enhance your cooking experience.'
    },
    { 
      title: 'Basic Theory', 
      desc: 'Foundations and cooking science',
      icon: '🧪',
      content: 'Master the fundamentals of cooking science and culinary principles.'
    }
  ]

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
      padding: '60px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          animation: 'slideDown 1s ease-out'
        }}>
          <h1 style={{
            color: '#1a1a1a',
            fontSize: 'clamp(32px, 6vw, 56px)',
            fontWeight: '900',
            marginBottom: '16px',
            letterSpacing: '-1px'
          }}>
            Kitchen Learning Hub
          </h1>
          <p style={{
            color: '#666',
            fontSize: '16px',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Explore learning tracks and resources to master culinary arts
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '48px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          animation: 'slideDown 1s ease-out 0.2s backwards'
        }}>
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              onMouseEnter={() => setHoveredBtn(idx)}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                padding: '14px 28px',
                borderRadius: '12px',
                border: activeTab === idx ? 'none' : '2px solid #ddd',
                background: activeTab === idx 
                  ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                  : hoveredBtn === idx
                  ? '#f0f0f0'
                  : '#fff',
                color: activeTab === idx ? '#000' : '#333',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: activeTab === idx 
                  ? '0 8px 24px rgba(255,215,0,0.3)'
                  : 'none',
                transform: activeTab === idx 
                  ? 'translateY(-2px)'
                  : hoveredBtn === idx
                  ? 'translateY(-2px)'
                  : 'translateY(0)'
              }}
            >
              <span style={{ marginRight: '8px' }}>{tabs[idx].icon}</span>
              {tab.title}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div style={{
          animation: 'slideDown 1s ease-out 0.3s backwards'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0',
            minHeight: '500px',
            alignItems: 'center'
          }}>
            {/* Image Side */}
            <div style={{
              position: 'relative',
              height: '100%',
              minHeight: '500px',
              overflow: 'hidden'
            }}>
              <img
                src={kitchenImg}
                alt={tabs[activeTab].title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.6s ease',
                  transform: 'scale(1.05)'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(255,215,0,0.2) 0%, rgba(0,0,0,0.3) 100%)',
                transition: 'all 0.6s ease'
              }} />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '80px',
                opacity: 0.1,
                pointerEvents: 'none'
              }}>
                {tabs[activeTab].icon}
              </div>
            </div>

            {/* Content Side */}
            <div style={{
              padding: '60px 48px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <span style={{
                  fontSize: '40px'
                }}>
                  {tabs[activeTab].icon}
                </span>
                <h2 style={{
                  margin: 0,
                  color: '#1a1a1a',
                  fontSize: '32px',
                  fontWeight: '800',
                  letterSpacing: '-0.5px'
                }}>
                  {tabs[activeTab].title}
                </h2>
              </div>

              <p style={{
                color: '#666',
                fontSize: '16px',
                marginBottom: '12px',
                fontWeight: '500'
              }}>
                {tabs[activeTab].desc}
              </p>

              <p style={{
                color: '#888',
                fontSize: '15px',
                lineHeight: '1.8',
                marginBottom: '40px'
              }}>
                {tabs[activeTab].content}
              </p>

              <div style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap'
              }}>
                <button style={{
                  padding: '14px 32px',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: '0 8px 24px rgba(255,215,0,0.3)',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = '0 12px 36px rgba(255,215,0,0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,215,0,0.3)'
                }}
                onClick={() => {
                  // When on the Recipes tab, go to Kitchen Recipes listing
                  if (activeTab === 1) {
                    navigate('/kitchen/recipes')
                  }
                }}>
                  Explore Now
                </button>

                <button style={{
                  padding: '14px 32px',
                  background: 'transparent',
                  color: '#333',
                  border: '2px solid #ddd',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FFD700'
                  e.currentTarget.style.background = 'rgba(255,215,0,0.1)'
                  e.currentTarget.style.transform = 'translateY(-3px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#ddd'
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}>
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginTop: '48px'
          }}>
            {[
              { number: '500+', label: 'Video Lessons' },
              { number: '1000+', label: 'Recipes' },
              { number: '200+', label: 'Experts' }
            ].map((stat, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: 'center',
                  padding: '32px 24px',
                  background: '#fff',
                  borderRadius: '16px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)'
                }}
              >
                <div style={{
                  fontSize: '36px',
                  fontWeight: '900',
                  color: '#FFD700',
                  marginBottom: '8px',
                  letterSpacing: '-1px'
                }}>
                  {stat.number}
                </div>
                <div style={{
                  color: '#666',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          div {
            grid-template-columns: 1fr !important;
          }

          div[style*="gridTemplateColumns: '1fr 1fr'"] {
            grid-template-columns: 1fr !important;
          }

          img {
            min-height: 300px !important;
          }

          div[style*="padding: '60px 48px'"] {
            padding: 32px 20px !important;
          }

          h2 {
            font-size: 24px !important;
          }
        }
      `}</style>
    </div>
  )
}