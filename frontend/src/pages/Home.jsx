import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import classbanner from '../assets/images/bc.png'
import bakeryImg from '../assets/images/bakery.png'
import butcheryImg from '../assets/images/butchery.png'
import kitchenImg from '../assets/images/kitchen.jpg'

export default function Home(){
  const scrollerRef = useRef(null)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [activeCard, setActiveCard] = useState(0)
  const scrollTimeoutRef = useRef(null)
  const navigate = useNavigate()

  const scrollBy = (dir) => {
    const el = scrollerRef.current
    if (!el) return
    const firstCard = el.firstElementChild
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 340
    const gapStr = window.getComputedStyle(el).gap || '20px'
    const gap = parseInt(gapStr) || 20
    const step = cardWidth + gap
    const amount = step * (dir === 'left' ? -1 : 1)
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  const departments = [
    { img: bakeryImg, title: 'Bakery', desc: 'Master the art of baking' },
    { img: kitchenImg, title: 'Kitchen', desc: 'Modern cooking techniques' },
    { img: butcheryImg, title: 'Butchery', desc: 'Premium meat cutting skills' }
  ]

  const handleExplore = (title) => {
    switch (title.toLowerCase()) {
      case 'bakery':
        navigate('/bakery')
        break
      case 'kitchen':
        navigate('/kitchen')
        break
      case 'butchery':
        navigate('/butchry')
        break
      default:
        navigate('/')
    }
  }

  const scrollToIndex = (index) => {
    const el = scrollerRef.current
    if (!el) return
    const cards = el.children
    const target = cards[index]
    if (!target) return
    const elRect = el.getBoundingClientRect()
    const cardRect = target.getBoundingClientRect()
    const currentLeft = el.scrollLeft
    const delta = (cardRect.left - elRect.left) - (elRect.width / 2 - cardRect.width / 2)
    el.scrollTo({ left: currentLeft + delta, behavior: 'smooth' })
    setActiveCard(index)
  }

  const centerNearestCard = () => {
    const el = scrollerRef.current
    if (!el) return
    const elRect = el.getBoundingClientRect()
    const centerX = elRect.left + elRect.width / 2
    let nearestIdx = 0
    let nearestDist = Infinity
    Array.from(el.children).forEach((child, idx) => {
      const rect = child.getBoundingClientRect()
      const cardCenter = rect.left + rect.width / 2
      const dist = Math.abs(cardCenter - centerX)
      if (dist < nearestDist) {
        nearestDist = dist
        nearestIdx = idx
      }
    })
    scrollToIndex(nearestIdx)
  }

  const handleScroll = () => {
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    scrollTimeoutRef.current = setTimeout(() => {
      centerNearestCard()
    }, 120)
  }

  useEffect(() => {
    // Center the Kitchen card (index 1) on initial load
    const id = setTimeout(() => scrollToIndex(1), 0)
    return () => clearTimeout(id)
  }, [])

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh'
    }}>
      

      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(255,107,107,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '5%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(107,255,155,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite',
        animationDelay: '2s'
      }} />

      {/* Main content */}
      <div className="home-content" style={{
        position: 'relative',
        zIndex: 10,
        width: '100vw',
        marginLeft: 'calc(50% - 50vw)',
        marginRight: 'calc(50% - 50vw)',
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingTop: '80px',
        padding: '40px 30px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        
        {/* Header section */}
        <div className="header-section" style={{
          textAlign: 'left',
          marginBottom: '24px',
          animation: 'slideDown 1s ease-out'
        }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '30px',
            padding: '8px 20px',
            marginBottom: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            <span style={{
              color: '#FFD700',
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '1.5px',
              textTransform: 'uppercase'
            }}>
              🎓 Premium Culinary Education
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 8vw, 64px)',
            fontWeight: '900',
            color: '#fff',
            marginBottom: '16px',
            textShadow: '0 10px 30px rgba(0,0,0,0.5)',
            background: 'linear-gradient(135deg, #fff 0%, #FFD700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Welcome to Chef Academy
          </h1>

          <p style={{
            fontSize: 'clamp(14px, 3vw, 20px)',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '8px',
            letterSpacing: '0.5px'
          }}>
            Master culinary arts from world-class instructors
          </p>
          
          <p style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Explore recipes, tools, and courses to elevate your cooking skills
          </p>
        </div>

        {/* Department cards section */}
        
        <div className="dept-section" style={{
          padding: '0 16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h2 style={{
              margin: 0,
              color: '#fff',
              fontSize: '28px',
              fontWeight: '700',
              letterSpacing: '0.5px'
            }}>
              Explore Departments
            </h2>
          </div>
          {/* Flanked scroller row */}
          <div className="dept-scroll-row" style={{
            display: 'grid',
            gridTemplateColumns: '48px 1fr 48px',
            alignItems: 'center',
            gap: '12px'
          }}>
            <button 
              className="arrow-btn"
              aria-label="Scroll left" 
              onClick={() => scrollBy('left')}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.5)',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
                e.currentTarget.style.border = '2px solid rgba(255,255,255,0.8)'
                e.currentTarget.style.transform = 'scale(1.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.border = '2px solid rgba(255,255,255,0.5)'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              ‹
            </button>

            <div
              ref={scrollerRef}
              style={{
                display: 'flex',
                gap: '20px',
                overflowX: 'auto',
                padding: '16px 0',
                scrollSnapType: 'x mandatory',
                scrollSnapStop: 'always',
                scrollBehavior: 'smooth',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                scrollPaddingLeft: '24px',
                scrollPaddingRight: '24px',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)',
                maskImage: 'linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)'
              }}
              onScroll={handleScroll}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') scrollBy('left')
                if (e.key === 'ArrowRight') scrollBy('right')
              }}
              tabIndex={0}
            >
              {departments.map((dept, idx) => (
                <div
                  key={idx}
                  className="dept-card"
                  style={{
                    marginLeft: '24px',
                    marginRight: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    scrollSnapAlign: 'center',
                    minWidth: '340px',
                    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    transform: hoveredCard === idx ? 'translateY(-12px)' : 'translateY(0)'
                  }}
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Image Container */}
                  <div
                    className="dept-card-img"
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '300px',
                      borderRadius: '16px 16px 0 0',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      boxShadow: hoveredCard === idx 
                        ? '0 20px 40px rgba(0,0,0,0.3)' 
                        : '0 10px 20px rgba(0,0,0,0.2)'
                    }}
                  >
                    {/* Background image */}
                    <img
                      src={dept.img}
                      alt={dept.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s ease',
                        transform: hoveredCard === idx ? 'scale(1.15)' : 'scale(1)'
                      }}
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />

                    {/* Overlay */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)',
                      transition: 'all 0.4s ease'
                    }} />
                  </div>

                  {/* Content Card Below Image */}
                  <div style={{
                    background: hoveredCard === idx
                      ? 'linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(255,165,0,0.1) 100%)'
                      : 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(10px)',
                    border: hoveredCard === idx 
                      ? '1px solid rgba(255,215,0,0.4)' 
                      : '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '0 0 16px 16px',
                    padding: '24px',
                    transition: 'all 0.4s ease',
                    boxShadow: hoveredCard === idx 
                      ? '0 10px 30px rgba(255,215,0,0.2)' 
                      : '0 5px 15px rgba(0,0,0,0.2)'
                  }}>
                    

                    {/* Title */}
                    <h3 style={{
                      color: '#fff',
                      fontSize: '22px',
                      fontWeight: '700',
                      margin: '0 0 8px 0',
                      transition: 'transform 0.4s ease',
                      transform: hoveredCard === idx ? 'translateX(8px)' : 'translateX(0)'
                    }}>
                      {dept.title}
                    </h3>

                    {/* Description */}
                    <p style={{
                      color: 'rgba(255,255,255,0.85)',
                      fontSize: '13px',
                      margin: '0 0 16px 0',
                      transition: 'all 0.4s ease',
                      opacity: hoveredCard === idx ? 1 : 0.8,
                      transform: hoveredCard === idx ? 'translateX(8px)' : 'translateX(0)',
                      lineHeight: '1.4'
                    }}>
                      {dept.desc}
                    </p>

                    {/* CTA button */}
                    <button style={{
                      background: hoveredCard === idx
                        ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                        : 'linear-gradient(135deg, rgba(255,215,0,0.7) 0%, rgba(255,165,0,0.7) 100%)',
                      color: hoveredCard === idx ? '#000' : 'rgba(0,0,0,0.7)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      width: '100%',
                      opacity: hoveredCard === idx ? 1 : 0.8,
                      transform: hoveredCard === idx ? 'translateY(0) scale(1)' : 'translateY(4px) scale(0.95)'
                    }}
                    onClick={() => handleExplore(dept.title)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,215,0,0.4)'
                    }}
                    onMouseLeave={(e) => {
                      if (hoveredCard === idx) {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)'
                      } else {
                        e.currentTarget.style.transform = 'translateY(4px) scale(0.95)'
                      }
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                    >
                      Explore
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="arrow-btn"
              aria-label="Scroll right" 
              onClick={() => scrollBy('right')}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.5)',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
                e.currentTarget.style.border = '2px solid rgba(255,255,255,0.8)'
                e.currentTarget.style.transform = 'scale(1.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.border = '2px solid rgba(255,255,255,0.5)'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              ›
            </button>
          </div>
        </div>

        {/* Scroll indicator dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '32px',
          gridColumn: '1 / -1'
        }}>
          {departments.map((_, idx) => (
            <div
              key={idx}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: activeCard === idx 
                  ? 'rgba(255,215,0,0.9)' 
                  : 'rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onClick={() => scrollToIndex(idx)}
            />
          ))}
        </div>
      </div>

      {/* Global styles */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          background-image: url(${classbanner});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }

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

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        div::-webkit-scrollbar {
          height: 8px;
        }

        div::-webkit-scrollbar-track {
          background: transparent;
        }

        div::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3);
          border-radius: 4px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.5);
        }

        /* Mobile layout: stack header above department cards */
        @media (max-width: 768px) {
          .home-content {
            grid-template-columns: 1fr !important;
            gap: 16px;
            padding-left: 12px;
            padding-right: 12px;
          }
          .header-section { order: 1; }
          .dept-section { order: 2; }
          /* Card sizing for mobile */
          .dept-card {
            min-width: 200px !important;
            width: 200px !important;
          }
          .dept-card-img {
            height: 200px !important;
          }
        }
      `}</style>
    </div>
  )
}