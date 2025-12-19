import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import './styles/main.css'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <div className="container">
          <AppRoutes />
        </div>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  )
}
