import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/authService'
import useAuth from '../hooks/useAuth'

export default function Login(){
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const account = await login(form)
      // Persist token, role and id in localStorage
      if (account?.token) localStorage.setItem('token', account.token)
      if (account?.role) localStorage.setItem('role', account.role)
      if (account?.id || account?._id) localStorage.setItem('id', (account.id || account._id))
      setUser?.(account)
      if (account.role === 'admin') navigate('/admin')
      else navigate('/')
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>
        <button className="btn" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  )
}
