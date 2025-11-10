'use client'

import { useEffect } from 'react'

export default function TawkToChat() {
  useEffect(() => {
    // Load Tawk.to script
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://embed.tawk.to/6910c11e3239d4195bd86428/1j9kn4okn'
    script.charset = 'UTF-8'
    script.setAttribute('crossorigin', '*')
    
    const firstScript = document.getElementsByTagName('script')[0]
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript)
    }

    // Cleanup function
    return () => {
      // Remove Tawk.to widget on unmount
      const tawkWidget = document.getElementById('tawk-bubble')
      if (tawkWidget) {
        tawkWidget.remove()
      }
    }
  }, [])

  return null
}
