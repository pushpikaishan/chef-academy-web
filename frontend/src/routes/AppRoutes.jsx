import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import Recipes from '../pages/Recipes'
import Tools from '../pages/Tools'
import Booking from '../pages/Booking'
import Contact from '../pages/Contact'
import AdminDashboard from '../pages/admin/AdminDashboard'
import UsersManage from '../pages/admin/UsersManage'
import RecipesManage from '../pages/admin/RecipesManage'
import ToolsManage from '../pages/admin/ToolsManage'
import LessonsManage from '../pages/admin/LessonsManage'
import AdminsManage from '../pages/admin/AdminsManage'
import Register from '../pages/Register'
import AdminRegister from '../pages/admin/AdminRegister'
import UserProfile from '../pages/UserProfile'
import AdminProfile from '../pages/admin/AdminProfile'
import Login from '../pages/Login'
import Allusers from '../pages/admin/allusers'
import Bakery from '../pages/Bakery'
import Kitchen from '../pages/Kitchen'
import Butchry from '../pages/Butchry'
import KitchenRecipesPage from '../pages/KitchenRecipesPage'
import KitchenRecipes from '../pages/KitchenRecipes'


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/recipes" element={<Recipes />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/admins" element={<AdminsManage />} />
      <Route path="/admin/users" element={<UsersManage />} />
      <Route path="/admin/recipes" element={<RecipesManage />} />
      <Route path="/admin/tools" element={<ToolsManage />} />
      <Route path="/admin/lessons" element={<LessonsManage />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/admin/profile" element={<AdminProfile />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/allusers" element={<Allusers />} />
      <Route path="/bakery" element={<Bakery />} />
      <Route path="/kitchen" element={<Kitchen />} />
      <Route path="/kitchen/recipes" element={<KitchenRecipesPage />} />
      <Route path="/kitchen/recipes/:id" element={<KitchenRecipes />} />
      <Route path="/butchry" element={<Butchry />} />
     
   
    </Routes>
  )
}
