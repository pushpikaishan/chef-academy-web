import { useNavigate } from 'react-router-dom'

export default function BackFloatButton({ to, label = 'Back' }) {
  const navigate = useNavigate()
  const handleClick = () => {
    if (to) navigate(to)
    else navigate(-1)
  }

  return (
    <button
      onClick={handleClick}
      title={label}
      aria-label={label}
      style={{
        position: 'fixed',
        left: 56,
        bottom: 56,
        width: 52,
        height: 52,
        borderRadius: '9999px',
        border: '1px solid rgba(255,255,255,0.28)',
        background: 'rgba(17,17,17,0.45)',
        color: '#fff',
        boxShadow: '0 10px 28px rgba(0,0,0,0.35)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        cursor: 'pointer',
        zIndex: 1000,
        display: 'grid',
        placeItems: 'center'
      }}
    >
      <i className="fa-solid fa-arrow-left" style={{ fontSize: '18px' }} />
    </button>
  )
}
