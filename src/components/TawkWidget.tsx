'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    Tawk_API?: any
    Tawk_LoadStart?: Date
  }
}

export default function TawkWidget() {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Tawk_API) return

    ;(window as any).Tawk_API = (window as any).Tawk_API || {}
    ;(window as any).Tawk_LoadStart = new Date()

    // 🌟 POSITION OVERRIDE: Moves the bubble to the bottom-left corner
    ;(window as any).Tawk_API.customStyle = {
      visibility: {
        desktop: {
          position: 'bl', // Bottom Left
          xOffset: '20px',
          yOffset: '20px'
        },
        mobile: {
          position: 'bl', // Bottom Left
          xOffset: '15px',
          yOffset: '15px'
        }
      }
    }

    const s = document.createElement('script')
    s.id = 'tawk-override-embed'
    s.async = true
    s.src = 'https://embed.tawk.to/6a2706aa2d41c91c2b850b27/default'
    s.charset = 'UTF-8'
    s.setAttribute('crossorigin', '*')
    
    const target = document.head || document.getElementsByTagName('script')[0]
    target?.appendChild(s)

    const originalOpen = window.open.bind(window)
    ;(window as any).open = ((url?: string | URL, targetEnv?: string, features?: string) => {
      const asString = typeof url === 'string' ? url : (url as URL)?.toString?.() || ''
      if (asString.includes('tawk.to/chat/') && asString.includes('pop=1')) {
        try {
          const api = (window as any).Tawk_API
          api?.showWidget?.()
          api?.maximize?.()
        } catch {
          // ignore
        }
        return null as any
      }
      return originalOpen(url as any, targetEnv as any, features as any)
    }) as any

    return () => {}
  }, [])

  return null
}
