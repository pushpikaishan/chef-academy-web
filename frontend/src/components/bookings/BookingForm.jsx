import { useState } from 'react'
import { createBooking } from '../../services/bookingService'

export default function BookingForm(){
  const [form, setForm] = useState({ name:'', email:'', date:'', notes:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    try {
      await createBooking(form)
      setSuccess('Booking submitted!')
      setForm({ name:'', email:'', date:'', notes:'' })
    } catch (e) {
      setError(e?.message || 'Failed to submit booking')
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div className="field">
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
      </div>
      <div className="field">
        <label>Date</label>
        <input name="date" type="date" value={form.date} onChange={handleChange} />
      </div>
      <div className="field">
        <label>Notes</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} />
      </div>
      <button className="btn" disabled={loading}>{loading ? 'Submitting...' : 'Submit Booking'}</button>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </form>
  )
}
