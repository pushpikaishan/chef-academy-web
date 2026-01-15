import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import Tools from '../pages/Tools'
import Contact from '../pages/Contact'
import AdminDashboard from '../pages/admin/AdminDashboard'
import UsersManage from '../pages/admin/UsersManage'
import RecipesManage from '../pages/admin/RecipesManage'
import ToolsManage from '../pages/admin/ToolsManage'
import LessonsManage from '../pages/admin/LessonsManage'
import AdminsManage from '../pages/admin/AdminsManage'
import TheoriesManage from '../pages/admin/TheoriesManage'
import QuestionsManage from '../pages/admin/QuestionsManage'
import Register from '../pages/Register'
import AdminRegister from '../pages/admin/AdminRegister'
import UserProfile from '../pages/UserProfile'
import AdminProfile from '../pages/admin/AdminProfile'
import Login from '../pages/Login'
import Allusers from '../pages/admin/Allusers'
import Bakery from '../pages/Bakery'
import Kitchen from '../pages/Kitchen'
import Butchry from '../pages/Butchry'
import KitchenRecipesPage from '../pages/AllRecipesPage'
import KitchenRecipes from '../pages/RecipesCard'
import KitchenToolsPage from '../pages/AllToolsPage'
import KitchenTheoriesPage from '../pages/AllTheoriesPage'
import KitchenTheory from '../pages/TheoryCard'
import AllLessonsPage from '../pages/AllLessonsPage'
import Loader from '../components/common/Loader'


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/admins" element={<AdminsManage />} />
      <Route path="/admin/users" element={<UsersManage />} />
      <Route path="/admin/recipes" element={<RecipesManage />} />
      <Route path="/admin/tools" element={<ToolsManage />} />
      <Route path="/admin/lessons" element={<LessonsManage />} />
      <Route path="/admin/theories" element={<TheoriesManage />} />
      <Route path="/admin/questions" element={<QuestionsManage />} />
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
      <Route path="/bakery/recipes" element={<KitchenRecipesPage />} />
      <Route path="/bakery/recipes/:id" element={<KitchenRecipes />} />
      <Route path="/butchry/recipes" element={<KitchenRecipesPage />} />
      <Route path="/butchry/recipes/:id" element={<KitchenRecipes />} />
      <Route path="/kitchen/tools" element={<KitchenToolsPage />} />
      <Route path="/bakery/tools" element={<KitchenToolsPage />} />
      <Route path="/butchry/tools" element={<KitchenToolsPage />} />
      <Route path="/kitchen/theories" element={<KitchenTheoriesPage />} />
      <Route path="/kitchen/theories/:id" element={<KitchenTheory />} />
      <Route path="/bakery/theories" element={<KitchenTheoriesPage />} />
      <Route path="/bakery/theories/:id" element={<KitchenTheory />} />
      <Route path="/butchry/theories" element={<KitchenTheoriesPage />} />
      <Route path="/butchry/theories/:id" element={<KitchenTheory />} />
      <Route path="/butchry" element={<Butchry />} />
      <Route path="/lessons" element={<AllLessonsPage />} />
      <Route path="/loader" element={<Loader message="Preparing your experience..." fullscreen={false} />} /> 
     
   
    </Routes>
  )
}
