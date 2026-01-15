import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import classbanner from '../assets/images/bc.png'
import bakeryImg from '../assets/images/bakery.png'
import butcheryImg from '../assets/images/butchery.png'
import kitchenImg from '../assets/images/kitchen.png'

export default function Home(){
  const scrollerRef = useRef(null)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [activeCard, setActiveCard] = useState(0)
  const scrollTimeoutRef = useRef(null)
  const autoScrollRef = useRef(null)
  const autoResumeTimeoutRef = useRef(null)
  const activeIndexRef = useRef(0)
  const autoDirectionRef = useRef(1) // 1: right, -1: left
  const isScrollerHoveredRef = useRef(false)
  const navigate = useNavigate()
  const APP_DOWNLOAD_URL = 'https://example.com/chef-academy-app'
  const FULL_TAGLINE = ' Build professional skills in bakery, butchery, and kitchen operations through hands-on training, modern tools, and expert recipes.'
  const [typedTagline, setTypedTagline] = useState('')
  const [typingDone, setTypingDone] = useState(false)

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
    activeIndexRef.current = index
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
    // Pause auto-scroll during user interaction and resume after a short delay
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
      autoScrollRef.current = null
    }
    if (autoResumeTimeoutRef.current) clearTimeout(autoResumeTimeoutRef.current)
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    scrollTimeoutRef.current = setTimeout(() => {
      centerNearestCard()
    }, 120)
    // Only resume auto-scroll if not hovered
    autoResumeTimeoutRef.current = setTimeout(() => {
      if (!isScrollerHoveredRef.current) startAutoScroll()
    }, 800)
  }
  // Helpers to pause/resume auto-scroll explicitly
  const pauseAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
      autoScrollRef.current = null
    }
    if (autoResumeTimeoutRef.current) {
      clearTimeout(autoResumeTimeoutRef.current)
      autoResumeTimeoutRef.current = null
    }
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = null
    }
  }

  const resumeAutoScroll = () => {
    startAutoScroll()
  }

  useEffect(() => {
    // Center the Kitchen card (index 1) on initial load
    const id = setTimeout(() => scrollToIndex(1), 0)
    return () => clearTimeout(id)
  }, [])

  // Typewriter effect for the header description line
  useEffect(() => {
    let i = 0
    const speedMs = 35
    const intervalId = setInterval(() => {
      setTypedTagline(prev => prev + FULL_TAGLINE.charAt(i))
      i += 1
      if (i >= FULL_TAGLINE.length) {
        clearInterval(intervalId)
        setTypingDone(true)
      }
    }, speedMs)
    return () => clearInterval(intervalId)
  }, [])

  // Auto-scroll controls
  const startAutoScroll = (intervalMs = 1000) => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
      autoScrollRef.current = null
    }
    autoScrollRef.current = setInterval(() => {
      const el = scrollerRef.current
      if (!el) return
      const count = el.children ? el.children.length : departments.length
      if (!count) return
      let nextIdx = activeIndexRef.current + autoDirectionRef.current
      // Bounce at edges to alternate direction (scroll from both sides)
      if (nextIdx > count - 1) {
        autoDirectionRef.current = -1
        nextIdx = Math.max(count - 2, 0)
      } else if (nextIdx < 0) {
        autoDirectionRef.current = 1
        nextIdx = Math.min(1, count - 1)
      }
      scrollToIndex(nextIdx)
    }, intervalMs)
  }

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
      autoScrollRef.current = null
    }
  }

  // Start auto-scroll on mount and clean up on unmount
  useEffect(() => {
    startAutoScroll()
    return () => {
      stopAutoScroll()
      if (autoResumeTimeoutRef.current) clearTimeout(autoResumeTimeoutRef.current)
    }
  }, [])

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh'
    }}>
      {/* Main content */}
      <div className="home-content" style={{
        position: 'relative',
       marginTop: '0px',
        width: '100%',
        paddingLeft: '0px',
        paddingRight: '20px',
        paddingTop: '0px',
        paddingBottom: '20px',
        gap: '24px',
        alignItems: 'start'
      }}>
        
        {/* Header section */}
        <div className="header-section" style={{
          textAlign: 'center',
          marginBottom: '24px',
          animation: 'slideDown 1s ease-out',
        
        }}>
          <h1 style={{
            fontSize: 'clamp(32px, 8vw, 64px)',
            fontWeight: '900',
            marginTop: '-10px',
            color: '#fff',
            marginBottom: '10px',
            textShadow: '0 10px 30px rgba(162, 160, 160, 0.5)',
            // Ensure visible text: remove transparent fill/clip without gradient
          }}>
            Welcome to Chef Academy
          </h1>

          <p style={{
            fontSize: 'clamp(14px, 3vw, 20px)',
            color: 'rgba(255,215,0,0.9)',
            marginBottom: '8px',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            letterSpacing: '0.8px'
          }}>
            Master Culinary Arts From World-Class Instructors
          </p>
          
          <p style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '600px',
            margin: '0 auto',
            display: 'inline-block',
            animation: 'slideUp 0.8s ease-out, textPulse 3.6s ease-in-out infinite'
          }}>
            {typedTagline}
            {!typingDone && (
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  width: '2px',
                  height: '1em',
                  marginLeft: '3px',
                  background: 'rgba(255,215,0,0.9)',
                  animation: 'blink 1s step-end infinite'
                }}
              />
            )}
          </p>

         
        </div>

        {/* Department cards section */}
        
        <div className="dept-section" style={{
          padding: '0 16px',
          
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '8px',
            paddingBottom: '8px',
            borderBottom: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h2 style={{
              margin: '24px',
              color: ' #FFD700',
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
                border: '2px solid rgba(255,215,0,0.7)',
                background: 'rgba(255,255,255,0.1)',
                color: '#FFA500',
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
                e.currentTarget.style.border = '2px solid  rgba(255,215,0,0.7)'
                e.currentTarget.style.transform = 'scale(1.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.border = '2px solid  rgba(255,215,0,0.7)'
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
              onMouseEnter={() => { isScrollerHoveredRef.current = true; pauseAutoScroll() }}
              onMouseLeave={() => { isScrollerHoveredRef.current = false; resumeAutoScroll() }}
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
                    marginLeft: '15px',
                    marginRight: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                    scrollSnapAlign: 'center',
                    minWidth: '360px',
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
                      height: '100%',
                      borderRadius: '16px 16px 0 0',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      // boxShadow: hoveredCard === idx 
                      //   ? '0 20px 40px rgba(0,0,0,0.3)' 
                      //   : '0 10px 20px rgba(0,0,0,0.2)'
                    }}
                  >
                    {/* Background image */}
                    <img
                      src={dept.img}
                      alt={dept.title}
                      style={{
                        width: '100%',
                        height: '90%',
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
                      ///background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)',
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
                    borderRadius: '16px 16px 16px 16px',
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
                border: '2px solid rgba(255,215,0,0.7)',
                background: 'rgba(255,255,255,0.1)',
                color: '#FFA500',
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
                e.currentTarget.style.border = '2px solid  rgba(255,215,0,0.7)'
                e.currentTarget.style.transform = 'scale(1.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.border = '2px solid  rgba(255,215,0,0.7)'
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
          alignItems: 'center',
          gap: '8px',
          marginTop: '10px',
          gridColumn: '1 / -1',
          width: '100%'
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

        {/* Download App CTA centered below dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '85px',
          gridColumn: '1 / -1'
        }}>
          <button
            aria-label="Download Chef Academy App"
            onClick={() => window.open(APP_DOWNLOAD_URL, '_blank', 'noopener,noreferrer')}
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: '#000',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '12px 20px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 8px 24px rgba(255,215,0,0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'
              e.currentTarget.style.boxShadow = '0 10px 28px rgba(255, 157, 0, 0.35)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,215,0,0.25)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3v10m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Download App</span>
          </button>
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
          overflow-x: hidden;
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

        /* Blinking caret for typewriter effect */
        @keyframes blink {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }

        /* Subtle glow pulse for header description */
        @keyframes textPulse {
          0% {
            text-shadow: 0 0 0 rgba(255,215,0,0);
          }
          50% {
            text-shadow: 0 0 10px rgba(255,215,0,0.28);
          }
          100% {
            text-shadow: 0 0 0 rgba(255,215,0,0);
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