import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import appIcon from './assets/images/appicon.png'

function FaviconSetter({ href }) {
  useEffect(() => {
    let link = document.querySelector('link[rel="icon"]')
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'icon')
      link.setAttribute('type', 'image/png')
      document.head.appendChild(link)
    }
    link.setAttribute('href', href)
  }, [href])
  return null
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FaviconSetter href={appIcon} />
    <App />
  </React.StrictMode>
)
