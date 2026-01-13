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
