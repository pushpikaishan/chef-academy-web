import { useEffect } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/common/Navbar'
import AdminHeader from './components/common/AdminHeader'
import Footer from './components/common/Footer'
import './styles/main.css'


function AppShell() {
  const location = useLocation()
  const chromeHiddenPaths = ['/login', '/register']
  const adminPrefixes = ['/admin', '/allusers']
  const isAdminRoute = adminPrefixes.some(prefix => location.pathname.startsWith(prefix))
  const hideChrome = chromeHiddenPaths.includes(location.pathname)

  useEffect(() => {
    const body = document.body
    if (isAdminRoute) {
      body.classList.add('admin-mode')
    } else {
      body.classList.remove('admin-mode')
    }
    return () => body.classList.remove('admin-mode')
  }, [isAdminRoute])

  return (
    <AuthProvider>
      {!hideChrome && !isAdminRoute && <Navbar />}
      {!hideChrome && isAdminRoute && <AdminHeader />}
      <div className="container">
        <AppRoutes />
      </div>
      {!hideChrome && !isAdminRoute && <Footer />}
    </AuthProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
