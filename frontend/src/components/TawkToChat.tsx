"use client"
import { useEffect, useState } from 'react'

// Hard override per user request; ignore previous env-driven config entirely.
// Provided production embed values:
// Property ID: 6910c11e3239d4195bd86428
// Widget ID:   1j9kn4okn
const OVERRIDE_PROPERTY_ID = '6910c11e3239d4195bd86428'
const OVERRIDE_WIDGET_ID = '1j9kn4okn'

// Optional enable/disable via env; default ON
const ENABLED = typeof process !== 'undefined'
  ? (((process as any).env?.NEXT_PUBLIC_TAWK_ENABLED ?? 'true') !== 'false')
  : true
const DEBUG = typeof process !== 'undefined' && ((process as any).env?.NEXT_PUBLIC_TAWK_DEBUG === '1')

export default function TawkToChat() {
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (!ENABLED) {
      if (DEBUG) console.info('[TawkToChat] Disabled.')
      return
    }

    setIsMounted(true)
    const mobile = window.matchMedia?.('(max-width: 767px)')?.matches ?? true
    setIsMobile(mobile)

    // Prevent double injection
    if (typeof window !== 'undefined' && (window as any).Tawk_API) {
      if (DEBUG) console.info('[TawkToChat] Already loaded.')
      return
    }

    // Standard Tawk snippet fields (helps avoid odd widget behavior on mobile)
    ;(window as any).Tawk_API = (window as any).Tawk_API || {}
    ;(window as any).Tawk_LoadStart = new Date()

    const originalOpen = window.open.bind(window)
    window.open = ((url?: string | URL, target?: string, features?: string) => {
      const asString = typeof url === 'string' ? url : url?.toString?.() || ''
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

    const scriptId = 'tawk-override-embed'
    if (document.getElementById(scriptId)) {
      if (DEBUG) console.info('[TawkToChat] Script tag already present.')
      return
    }
    const s1 = document.createElement('script')
    const s0 = document.getElementsByTagName('script')[0]
    s1.id = scriptId
    s1.async = true
    s1.src = `https://embed.tawk.to/${OVERRIDE_PROPERTY_ID}/${OVERRIDE_WIDGET_ID}`
    s1.charset = 'UTF-8'
    s1.setAttribute('crossorigin', '*')
    s0?.parentNode?.insertBefore(s1, s0)
    if (DEBUG) console.info('[TawkToChat] Injected override script.')

    // Prevent the widget from navigating users away (some mobile configurations use an anchor fallback).
    const onCaptureClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const a = target?.closest?.('a') as HTMLAnchorElement | null
      if (!a) return
      const href = a.getAttribute('href') || ''
      if (!href) return

      const isAboutScheme = href.startsWith('about:') // e.g. about:blank
      const isTawkLink = href.includes('tawk.to')
      if (!isAboutScheme && !isTawkLink) return

      e.preventDefault()
      e.stopPropagation()
      try {
        const api = (window as any).Tawk_API
        api?.showWidget?.()
        api?.maximize?.()
      } catch {
        // ignore
      }
    }

    document.addEventListener('click', onCaptureClick, true)

    // On mobile, hide the default launcher and use our in-site button to maximize chat.
    const api = (window as any).Tawk_API
    api.onLoad = () => {
      try {
        // Always hide the default launcher so users can't accidentally trigger a popout.
        api?.hideWidget?.()
      } catch {
        // ignore
      }
      if (DEBUG) console.info('[TawkToChat] Widget loaded')
    }

    if (DEBUG) {
      api.onChatMaximized = () => console.info('[TawkToChat] Chat maximized')
      api.onChatMinimized = () => console.info('[TawkToChat] Chat minimized')
      api.onChatStarted = () => console.info('[TawkToChat] Chat started')
      api.onChatEnded = () => console.info('[TawkToChat] Chat ended')
    }

    return () => {
      document.removeEventListener('click', onCaptureClick, true)
      window.open = originalOpen as any
    }
  }, [])

  if (!ENABLED || !isMounted) return null

  return (
    <button
      type="button"
      className="btn-cta-sky fixed right-4 z-[99999] inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-extrabold shadow-sm"
      style={{ bottom: isMobile ? 'calc(env(safe-area-inset-bottom) + 5.25rem)' : '1.25rem' }}
      onClick={() => {
        try {
          const api = (window as any).Tawk_API
          api?.showWidget?.()
          api?.maximize?.()
        } catch {
          // ignore
        }
      }}
      aria-label="Open live support chat"
    >
      Live Support
    </button>
  )
}
