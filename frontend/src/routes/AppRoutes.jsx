import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import Recipes from '../pages/Recipes'
import Booking from '../pages/Booking'
import Contact from '../pages/Contact'
import AdminDashboard from '../pages/AdminDashboard'
import Register from '../pages/Register'
import AdminRegister from '../pages/AdminRegister'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/recipes" element={<Recipes />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}
