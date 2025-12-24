import { BrowserRouter, useLocation } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import './styles/main.css'

function AppShell() {
  const location = useLocation()
  const chromeHiddenPaths = ['/login', '/register']
  const hideChrome = chromeHiddenPaths.includes(location.pathname)

  return (
    <AuthProvider>
      {!hideChrome && <Navbar />}
      <div className="container">
        <AppRoutes />
      </div>
      {!hideChrome && <Footer />}
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
