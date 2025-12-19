import { useState } from 'react'
import { register } from '../services/authService'

export default function Register(){
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    try {
      const res = await register(form)
      setSuccess(`Registered: ${res.name} (${res.email})`)
      setForm({ name: '', email: '', password: '' })
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <h1>UserRegister</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
        </div>
        <div className="field">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
        </div>
        <div className="field">
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
        </div>
        <button className="btn" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>
    </div>
  )
}
