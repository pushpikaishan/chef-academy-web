import { useEffect, useState } from 'react'
import { updateAdminPhoto, getAdminById } from '../../services/adminService'

export default function AdminProfile(){
  const [adminId, setAdminId] = useState(() => localStorage.getItem('id') || '')
  const [profilePhoto, setProfilePhoto] = useState('')
  const [message, setMessage] = useState('')
  const [details, setDetails] = useState(null)

  const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
  const resolveSrc = (src) => {
    if (!src) return ''
    if (/^https?:\/\//i.test(src)) return src
    return `${apiBase}${src.startsWith('/') ? '' : '/'}${src}`
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !adminId) return
    try {
      const res = await updateAdminPhoto(adminId, file)
      setProfilePhoto(res.profilePhoto)
      setMessage('Profile photo updated')
    } catch (err) {
      setMessage(err?.response?.data?.error || err?.message || 'Upload failed')
    }
  }

  useEffect(() => {
    (async () => {
      if (!adminId) return
      try {
        const data = await getAdminById(adminId)
        setDetails(data)
        setProfilePhoto(data.profilePhoto || '')
      } catch (err) {
        setMessage(err?.response?.data?.error || err?.message || 'Failed to load admin')
      }
    })()
  }, [adminId])

  return (
    <div>
      <h1>Admin Profile</h1>
      <div>
        {details && (
          <div className="card" style={{marginBottom:'1rem'}}>
            <p><strong>Name:</strong> {details.name}</p>
            <p><strong>Email:</strong> {details.email}</p>
            {details.role && <p><strong>Role:</strong> {details.role}</p>}
          </div>
        )}
        {profilePhoto && <img src={resolveSrc(profilePhoto)} alt="profile" style={{maxWidth:'200px',cursor:'pointer'}} />}
        <div className="field">
          <label>Click to select a new photo</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
      </div>
      {message && <div>{message}</div>}
    </div>
  )
}
