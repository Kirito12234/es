import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollManager() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.slice(1)

      window.setTimeout(() => {
        const element = document.getElementById(elementId)

        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }, 0)

      return
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [location.hash, location.pathname])

  return null
}

export default ScrollManager
