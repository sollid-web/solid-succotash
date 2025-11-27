"use client"
import { useEffect } from 'react'

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
  useEffect(() => {
    if (!ENABLED) {
      if (DEBUG) console.info('[TawkToChat] Disabled.')
      return
    }
    // Prevent double injection
    if (typeof window !== 'undefined' && (window as any).Tawk_API) {
      if (DEBUG) console.info('[TawkToChat] Already loaded.')
      return
    }
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
    ;(window as any).Tawk_API = (window as any).Tawk_API || {}
    if (DEBUG) {
      const api = (window as any).Tawk_API
      api.onLoad = () => console.info('[TawkToChat] Widget loaded')
      api.onChatMaximized = () => console.info('[TawkToChat] Chat maximized')
      api.onChatMinimized = () => console.info('[TawkToChat] Chat minimized')
      api.onChatStarted = () => console.info('[TawkToChat] Chat started')
      api.onChatEnded = () => console.info('[TawkToChat] Chat ended')
    }
  }, [])

  // Component renders nothing; script injected via side effect
  return null
}
