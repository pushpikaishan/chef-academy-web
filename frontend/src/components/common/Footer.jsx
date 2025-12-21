import { useLocation } from 'react-router-dom'

export default function Footer(){
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  return (
    <footer className={`footer ${isHome ? 'footer--transparent' : ''}`}>
      <div className="container">© {new Date().getFullYear()} Chef Academy</div>
    </footer>
  )
}
