'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    Tawk_API?: any
    Tawk_LoadStart?: Date
  }
}

const OVERRIDE_PROPERTY_ID = '6910c11e3239d4195bd86428'
const OVERRIDE_WIDGET_ID = '1j9kn4okn'

const ENABLED = typeof process !== 'undefined'
  ? (((process as any).env?.NEXT_PUBLIC_TAWK_ENABLED ?? 'true') !== 'false')
  : true

export default function TawkWidget() {
  useEffect(() => {
    if (!ENABLED) return

    // Prevent double injection
    if (typeof window !== 'undefined' && (window as any).Tawk_API) return

    ;(window as any).Tawk_API = (window as any).Tawk_API || {}
    ;(window as any).Tawk_LoadStart = new Date()

    const s = document.createElement('script')
    s.id = 'tawk-override-embed'
    s.async = true
    s.src = `https://embed.tawk.to/${OVERRIDE_PROPERTY_ID}/${OVERRIDE_WIDGET_ID}`
    s.charset = 'UTF-8'
    s.setAttribute('crossorigin', '*')
    const first = document.getElementsByTagName('script')[0]
    first?.parentNode?.insertBefore(s, first)

    // Small safeguard: when widget tries to open a new window, show widget instead.
    const originalOpen = window.open.bind(window)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).open = ((url?: string | URL, target?: string, features?: string) => {
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
      return originalOpen(url as any, target as any, features as any)
    }) as any

    return () => {
      // no cleanup for injected script (leave Tawk to manage itself)
    }
  }, [])

  return null
}
