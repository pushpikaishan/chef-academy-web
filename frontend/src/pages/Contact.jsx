import { useState, useEffect } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import { sendQuestion } from '../services/userQuestionService'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowWidth < 768
  const isTablet = windowWidth < 1024 && windowWidth >= 768

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const userId = localStorage.getItem('id') || undefined
      await sendQuestion({ userId, name: formData.name, email: formData.email, message: formData.message })
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 5000)
      setFormData({ name: '', email: '', message: '' })
    } catch (err) {
      // optionally show error toast
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div style={{
      minHeight: '100vh',
      //background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #f0f2f5 100%)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '16px' : '40px 20px'
    }}>
      {/* Background elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-10%',
        width: isMobile ? '250px' : '500px',
        height: isMobile ? '250px' : '500px',
        background: 'radial-gradient(circle, rgba(255,165,0,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite',
        filter: 'blur(40px)',
        zIndex: 1
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '-5%',
        width: isMobile ? '200px' : '600px',
        height: isMobile ? '200px' : '600px',
        background: 'radial-gradient(circle, rgba(255,215,0,0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 10s ease-in-out infinite',
        animationDelay: '2s',
        filter: 'blur(40px)',
        zIndex: 1
      }} />

      {/* Main container */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '1200px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '24px' : '60px',
        alignItems: 'start',
        padding: isMobile ? '0' : '0'
      }}>
        {/* Left side */}
        <div>
          <div style={{ marginBottom: isMobile ? '24px' : '50px' }}>
            <h1 style={{
              fontSize: isMobile ? '28px' : isTablet ? '40px' : '52px',
              fontWeight: '900',
              color: '#1a1a1a',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: '1.2'
            }}>
              Get In Touch
            </h1>
            <p style={{
              fontSize: isMobile ? '14px' : isTablet ? '16px' : '18px',
              color: '#666',
              lineHeight: '1.6'
            }}>
              Have questions? We'd love to hear from you. Reach out today!
            </p>
          </div>

          {/* Contact cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: Mail, title: 'Email', content: 'contact@chef.academy' },
              { icon: Phone, title: 'Phone', content: '+1 (555) 123-4567' },
              { icon: MapPin, title: 'Location', content: 'Culinary District, Chef City' }
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e0e0e0',
                    padding: isMobile ? '12px' : '20px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.borderColor = 'rgba(255,215,0,0.5)'
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,215,0,0.15)'
                      e.currentTarget.style.transform = 'translateX(8px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.borderColor = '#e0e0e0'
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <Icon size={isMobile ? 20 : 28} color="#FFD700" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <h3 style={{ color: '#FFA500', fontSize: isMobile ? '13px' : '15px', fontWeight: '700', margin: '0 0 4px 0' }}>
                        {item.title}
                      </h3>
                      <p style={{ color: '#666', margin: 0, fontSize: isMobile ? '12px' : '14px' }}>
                        {item.content}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right side - Form */}
        <div>
          <div style={{
            background: '#ffffff',
            border: '1px solid #e0e0e0',
            padding: isMobile ? '16px' : isTablet ? '32px' : '48px',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            position: 'relative'
          }}>
            {submitted && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(5px)',
                zIndex: 20
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  padding: isMobile ? '20px' : '40px',
                  borderRadius: '16px',
                  textAlign: 'center'
                }}>
                  <CheckCircle size={isMobile ? 40 : 60} color="#fff" style={{ margin: '0 auto 12px' }} />
                  <h2 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: isMobile ? '16px' : '24px', fontWeight: '700' }}>
                    Message Sent!
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: isMobile ? '12px' : '15px' }}>
                    We'll get back to you soon
                  </p>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', color: '#FFA500', fontSize: isMobile ? '11px' : '13px', fontWeight: '600', marginBottom: '6px' }}>
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    padding: isMobile ? '10px 12px' : '12px 16px',
                    background: '#f8f9fa',
                    border: '1px solid #e0e0e0',
                    borderRadius: '10px',
                    color: '#333',
                    fontSize: isMobile ? '13px' : '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.background = '#ffffff'
                    e.target.style.borderColor = 'rgba(255,215,0,0.6)'
                    e.target.style.boxShadow = '0 0 12px rgba(255,215,0,0.2)'
                  }}
                  onBlur={(e) => {
                    e.target.style.background = '#f8f9fa'
                    e.target.style.borderColor = '#e0e0e0'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#FFA500', fontSize: isMobile ? '11px' : '13px', fontWeight: '600', marginBottom: '6px' }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  style={{
                    width: '100%',
                    padding: isMobile ? '10px 12px' : '12px 16px',
                    background: '#f8f9fa',
                    border: '1px solid #e0e0e0',
                    borderRadius: '10px',
                    color: '#333',
                    fontSize: isMobile ? '13px' : '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.background = '#ffffff'
                    e.target.style.borderColor = 'rgba(255,215,0,0.6)'
                    e.target.style.boxShadow = '0 0 12px rgba(255,215,0,0.2)'
                  }}
                  onBlur={(e) => {
                    e.target.style.background = '#f8f9fa'
                    e.target.style.borderColor = '#e0e0e0'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#FFA500', fontSize: isMobile ? '11px' : '13px', fontWeight: '600', marginBottom: '6px' }}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={isMobile ? 3 : 5}
                  placeholder="Tell us about your inquiry..."
                  style={{
                    width: '100%',
                    padding: isMobile ? '10px 12px' : '12px 16px',
                    background: '#f8f9fa',
                    border: '1px solid #e0e0e0',
                    borderRadius: '10px',
                    color: '#333',
                    fontSize: isMobile ? '13px' : '14px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.background = '#ffffff'
                    e.target.style.borderColor = 'rgba(255,215,0,0.6)'
                    e.target.style.boxShadow = '0 0 12px rgba(255,215,0,0.2)'
                  }}
                  onBlur={(e) => {
                    e.target.style.background = '#f8f9fa'
                    e.target.style.borderColor = '#e0e0e0'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              <button
                onClick={handleSubmit}
                style={{
                  width: '100%',
                  padding: isMobile ? '10px 12px' : '14px 24px',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: isMobile ? '13px' : '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(255,215,0,0.3)',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
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
                <Send size={isMobile ? 16 : 18} />
                Send Message
              </button>
            </div>
          </div>
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

        input::placeholder,
        textarea::placeholder {
          color: #999;
        }
      `}</style>
    </div>
  )
}