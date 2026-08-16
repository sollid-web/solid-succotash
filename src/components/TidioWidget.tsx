'use client'
import { useEffect } from 'react'

export default function TidioWidget() {
  useEffect(() => {
    const loadTidio = () => {
      const s = document.createElement('script')
      s.src = '//code.tidio.co/x2gf9dyrsem5iaaxewp9sv3luqsbfygq.js'
      s.async = true
      s.onload = () => console.log('Tidio loaded ✅')
      s.onerror = (e) => console.error('Tidio failed ❌', e)
      document.head.appendChild(s)
    }

    if (document.readyState === 'complete') {
      loadTidio()
    } else {
      window.addEventListener('load', loadTidio)
      return () => window.removeEventListener('load', loadTidio)
    }
  }, [])
  return null
}
