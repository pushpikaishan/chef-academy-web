import { useEffect, useState } from 'react'
import { updateUserPhoto, getUserById } from '../services/authService'

export default function UserProfile(){
  const [userId, setUserId] = useState(() => localStorage.getItem('id') || '')
  const [profileImage, setProfileImage] = useState('')
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
    if (!file || !userId) return
    try {
      const res = await updateUserPhoto(userId, file)
      setProfileImage(res.profileImage)
      setMessage('Profile photo updated')
    } catch (err) {
      setMessage(err?.response?.data?.error || err?.message || 'Upload failed')
    }
  }

  useEffect(() => {
    (async () => {
      if (!userId) return
      try {
        const data = await getUserById(userId)
        setDetails(data)
        setProfileImage(data.profileImage || '')
      } catch (err) {
        setMessage(err?.response?.data?.error || err?.message || 'Failed to load user')
      }
    })()
  }, [userId])

  return (
    <div>
      <h1>User Profile</h1>
      <div>
        {details && (
          <div className="card" style={{marginBottom:'1rem'}}>
            <p><strong>Name:</strong> {details.name}</p>
            <p><strong>Email:</strong> {details.email}</p>
            {details.status && <p><strong>Status:</strong> {details.status}</p>}
            {details.role && <p><strong>Role:</strong> {details.role}</p>}
          </div>
        )}
        {profileImage && <img src={resolveSrc(profileImage)} alt="profile" style={{maxWidth:'200px',cursor:'pointer'}} />}
        <div className="field">
          <label>Click to select a new photo</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
      </div>
      {message && <div>{message}</div>}
    </div>
  )
}
