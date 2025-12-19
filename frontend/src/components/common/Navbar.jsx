import { Link } from 'react-router-dom'

export default function Navbar(){
  return (
    <nav className="nav">
      <div className="container" style={{display:'flex',gap:'1rem'}}>
        <Link to="/">Chef Academy</Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/booking">Booking</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <span style={{marginLeft:'auto'}}>
          <Link to="/register">Register</Link>
          <span style={{marginLeft:'1rem'}}>
            <Link to="/admin/register">Admin Register</Link>
          </span>
        </span>
      </div>
    </nav>
  )
}
