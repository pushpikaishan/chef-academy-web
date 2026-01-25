import { useState, useEffect } from 'react'
import { register } from '../services/authService'
import bcImage from '../assets/images/bc.png'
import appIcon from '../assets/images/appicon.png'

export default function Register(){
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isExiting, setIsExiting] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const validateField = (name, value) => {
    const errors = { ...validationErrors }
    
    switch(name) {
      case 'name':
        if (!value.trim()) errors.name = 'Full name is required'
        else if (value.length < 2) errors.name = 'Name must be at least 2 characters'
        else if (!/^[a-zA-Z\s]+$/.test(value)) errors.name = 'Name should only contain letters'
        else delete errors.name
        break
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value.trim()) errors.email = 'Email is required'
        else if (!emailRegex.test(value)) errors.email = 'Invalid email address'
        else delete errors.email
        break
      
      case 'password':
        if (!value) errors.password = 'Password is required'
        else if (value.length < 6) errors.password = 'At least 6 characters'
        else if (!/[A-Z]/.test(value)) errors.password = 'Need uppercase letter'
        else if (!/[a-z]/.test(value)) errors.password = 'Need lowercase letter'
        else if (!/\d/.test(value)) errors.password = 'Need a number'
        else delete errors.password
        break
      
      case 'confirmPassword':
        if (!value) errors.confirmPassword = 'Confirm password'
        else if (value !== form.password) errors.confirmPassword = 'Passwords do not match'
        else delete errors.confirmPassword
        break
      
      default: break
    }
    
    setValidationErrors(errors)
    return errors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    validateField(name, value)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    
    const errors = {}
    Object.keys(form).forEach(key => {
      if (!form[key]) errors[key] = 'This field is required'
    })
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      setError('Please fix all errors')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const res = await register(form)
      setSuccess(`🎉 Account created! Redirecting...`)
      setForm({ name: '', email: '', password: '', confirmPassword: '' })
      setValidationErrors({})
      setIsExiting(true)
      setTimeout(() => window.location.href = '/login', 1200)
    } catch (e) {
      setError(e?.response?.data?.error || 'Registration failed')
    } finally { 
      setLoading(false) 
    }
  }

  const getPasswordStrength = (pwd) => {
    let strength = 0
    if (pwd.length >= 6) strength++
    if (pwd.length >= 10) strength++
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) strength++
    if (/\d/.test(pwd)) strength++
    if (/[!@#$%^&*]/.test(pwd)) strength++
    return strength
  }

  const pwdStrength = getPasswordStrength(form.password)
  const strengthColor = pwdStrength < 2 ? '#ef4444' : pwdStrength < 4 ? '#f97316' : '#22c55e'
  const strengthLabel = pwdStrength < 2 ? 'Weak' : pwdStrength < 4 ? 'Fair' : 'Strong'

  const inputStyle = (hasError) => ({
    width: '100%', 
    paddingLeft: '50px', 
    paddingRight: '16px', 
    paddingTop: isMobile ? '12px' : '14px', 
    paddingBottom: isMobile ? '12px' : '14px', 
    border: hasError ? '2px solid rgba(239, 68, 68, 0.6)' : '2px solid rgba(255, 255, 255, 0.3)', 
    borderRadius: '10px', 
    outline: 'none', 
    transition: 'all 0.3s ease', 
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    fontSize: isMobile ? '14px' : '15px', 
    boxSizing: 'border-box',
    fontWeight: '500',
    color: '#ffffff'
  })

  return (
    <div style={{
      height: '100vh', 
      width: '100vw',
      backgroundImage: `url(${bcImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: isMobile ? 'center' : 'flex-start', 
      padding: isMobile ? '20px' : '0',
      margin: '0',
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0, 0, 0, 0.35)',
        zIndex: 1
      }}></div>

      <div style={{
        position: 'relative', zIndex: 2, 
        display: 'flex', alignItems: 'center', 
        justifyContent: isMobile ? 'center' : 'space-between',
        width: '100%', height: '100%',
        paddingRight: isMobile ? '20px' : '60px',
        paddingLeft: isMobile ? '20px' : '60px',
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        
        {/* Left Side - Form */}
        <div style={{
          width: '100%',
          maxWidth: isMobile ? '100%' : '480px',
          flex: isMobile ? '1' : '0 1 480px'
        }}>
          {/* Mobile Branding (like Login) - OUTSIDE form card */}
          {isMobile && (
            <div style={{
              textAlign: 'center',
              marginBottom: '30px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                background: 'rgba(87, 86, 86, 0.22)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                marginBottom: '20px'
              }}>
                <img
                  src={appIcon}
                  alt="App Icon"
                  style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'contain', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.25))' }}
                />
              </div>
              <h1 style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                letterSpacing: '1px',
                margin: '0 0 10px 0'
              }}>
                Chef Academy
              </h1>
            </div>
          )}
          <div style={{
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(30px)',
            borderRadius: isMobile ? '20px' : '28px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            padding: isMobile ? '30px 20px' : '45px 40px',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            animation: isExiting ? 'slideOutRight 0.35s ease-in forwards' : 'slideInLeft 0.6s ease-out'
          }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{
                fontSize: isMobile ? '26px' : '32px',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '6px',
                letterSpacing: '0.5px',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
              }}>Join Us</h2>
              <p style={{
                color: '#e5e7eb',
                fontSize: isMobile ? '13px' : '15px',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
              }}>Create your chef account</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '20px' }}>
              {/* Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: isMobile ? '13px' : '15px', fontWeight: '700', color: '#f3f4f6', textTransform: 'uppercase', letterSpacing: '0.5px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: isMobile ? '13px' : '15px', fontSize: '18px' }}>👤</span>
                  <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="Your full name" style={inputStyle(validationErrors.name)} onFocus={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)'; e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'; }} onBlur={(e) => { e.target.style.borderColor = validationErrors.name ? 'rgba(239, 68, 68, 0.6)' : 'rgba(255, 255, 255, 0.3)'; e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; }} />
                </div>
                {validationErrors.name && <span style={{ color: '#fecaca', fontSize: '12px', fontWeight: '500' }}>❌ {validationErrors.name}</span>}
              </div>

              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: isMobile ? '13px' : '15px', fontWeight: '700', color: '#f3f4f6', textTransform: 'uppercase', letterSpacing: '0.5px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: isMobile ? '13px' : '15px', fontSize: '18px' }}>✉️</span>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" style={inputStyle(validationErrors.email)} onFocus={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)'; e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'; }} onBlur={(e) => { e.target.style.borderColor = validationErrors.email ? 'rgba(239, 68, 68, 0.6)' : 'rgba(255, 255, 255, 0.3)'; e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; }} />
                </div>
                {validationErrors.email && <span style={{ color: '#fecaca', fontSize: '12px', fontWeight: '500' }}>❌ {validationErrors.email}</span>}
              </div>

              {/* Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: isMobile ? '13px' : '15px', fontWeight: '700', color: '#f3f4f6', textTransform: 'uppercase', letterSpacing: '0.5px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: isMobile ? '13px' : '15px', fontSize: '18px' }}>🔒</span>
                  <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="••••••••" style={inputStyle(validationErrors.password)} onFocus={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)'; e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'; }} onBlur={(e) => { e.target.style.borderColor = validationErrors.password ? 'rgba(239, 68, 68, 0.6)' : 'rgba(255, 255, 255, 0.3)'; e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: isMobile ? '11px' : '12px', background: 'none', border: 'none', fontSize: isMobile ? '18px' : '22px', cursor: 'pointer', padding: 0 }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} >{showPassword ? '👁️' : '👁️‍🗨️'}</button>
                </div>
                {form.password && <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}><div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${(pwdStrength/5)*100}%`, background: strengthColor, transition: 'all 0.3s ease' }}></div></div><span style={{ fontSize: '12px', color: strengthColor, fontWeight: '600' }}>{strengthLabel}</span></div>}
                {validationErrors.password && <span style={{ color: '#fecaca', fontSize: '12px', fontWeight: '500' }}>❌ {validationErrors.password}</span>}
              </div>

              {/* Confirm Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: isMobile ? '13px' : '15px', fontWeight: '700', color: '#f3f4f6', textTransform: 'uppercase', letterSpacing: '0.5px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: isMobile ? '13px' : '15px', fontSize: '18px' }}>🔒</span>
                  <input name="confirmPassword" type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" style={inputStyle(validationErrors.confirmPassword)} onFocus={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)'; e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'; }} onBlur={(e) => { e.target.style.borderColor = validationErrors.confirmPassword ? 'rgba(239, 68, 68, 0.6)' : 'rgba(255, 255, 255, 0.3)'; e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; }} />
                </div>
                {validationErrors.confirmPassword && <span style={{ color: '#fecaca', fontSize: '12px', fontWeight: '500' }}>❌ {validationErrors.confirmPassword}</span>}
              </div>

              {/* Button */}
              <button onClick={handleSubmit} disabled={loading} style={{ padding: isMobile ? '11px 18px' : '13px 24px', background: loading ? 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)' : 'linear-gradient(135deg, #facc15 0%, #f59e0b 100%)', color: 'white', fontWeight: 'bold', fontSize: isMobile ? '13px' : '15px', borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', boxShadow: '0 10px 25px rgba(245, 158, 11, 0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '6px' }} onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 15px 35px rgba(245, 158, 11, 0.5)')} onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = '0 10px 25px rgba(245, 158, 11, 0.4)')} >
                {loading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}><span style={{ display: 'inline-block', width: '16px', height: '16px', border: '3px solid white', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></span>Creating...</span> : 'Register Now'}
              </button>

              {/* Messages */}
              {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '2px solid rgba(239, 68, 68, 0.5)', color: '#fecaca', padding: '12px', borderRadius: '10px', fontSize: isMobile ? '13px' : '14px', fontWeight: '500', animation: 'slideDown 0.3s ease-out' }}>⚠️ {error}</div>}
              {success && <div style={{ background: 'rgba(74, 222, 128, 0.2)', border: '2px solid rgba(74, 222, 128, 0.5)', color: '#86efac', padding: '12px', borderRadius: '10px', fontSize: isMobile ? '13px' : '14px', fontWeight: '500', animation: 'slideDown 0.3s ease-out' }}>{success}</div>}

              {/* Login Link */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.2)', textAlign: 'center', fontSize: isMobile ? '13px' : '15px', color: '#e5e7eb' }}>
                Already have an account? <span style={{ color: '#fbbf24', fontWeight: '700', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#f59e0b'} onMouseLeave={(e) => e.target.style.color = '#fbbf24'} onClick={() => { setIsExiting(true); setTimeout(() => window.location.href = '/login', 350); }}>Login here</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Branding */}
        <div style={{ flex: 1, display: isMobile ? 'none' : 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginLeft: '80px', animation: 'brandEnter 0.6s ease-out' }}>
          <div style={{ marginBottom: '40px', animation: 'brandEmojiEnter 0.6s ease-out, float 6s ease-in-out 0.6s infinite' }}>
            <div style={{ width: '180px', height: '180px', background: 'rgba(87, 86, 86, 0.22)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)' }}>
              <img 
                src={appIcon} 
                alt="App Icon" 
                style={{ width: '120px', height: '120px', borderRadius: '18px', objectFit: 'contain', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.45))' }}
              />
            </div>
          </div>
          <h1 style={{ fontSize: '64px', fontWeight: 'bold', color: '#ffffff', marginBottom: '24px', textShadow: '3px 3px 8px rgba(0, 0, 0, 0.6)', letterSpacing: '2px', animation: 'fadeInUp 0.6s ease-out 0.2s both, glowPulse 3s ease-in-out 1s infinite' }}>Master Chef</h1>
          <p style={{ fontSize: '20px', color: '#f0f0f0', marginBottom: '40px', maxWidth: '450px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', lineHeight: '1.6', animation: 'fadeInUp 0.6s ease-out 0.35s both' }}>Join our culinary community. Learn, share recipes, and manage your kitchen like a pro!</p>
          {/* Info card removed as requested */}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideOutRight { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(40px); } }
        @keyframes brandEnter { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes brandEmojiEnter { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glowPulse { 0%, 100% { text-shadow: 3px 3px 8px rgba(0,0,0,0.6); } 50% { text-shadow: 0 0 18px rgba(255, 200, 80, 0.6); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        input::placeholder { color: rgba(255, 255, 255, 0.6); }
      `}</style>
    </div>
  )
}