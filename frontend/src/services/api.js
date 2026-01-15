
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL;

// const baseURL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://chef-academy-web.onrender.com' : 'http://localhost:5000');

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
})

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch {}
  return config
})

export default api
