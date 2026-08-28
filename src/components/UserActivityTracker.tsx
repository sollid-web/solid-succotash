'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { apiFetch } from '@/lib/api'

function getSessionId() {
  if (typeof window === 'undefined') return ''
  const key = 'wolv-activity-session'
  const existing = window.sessionStorage.getItem(key)
  if (existing) return existing
  const value = crypto.randomUUID()
  window.sessionStorage.setItem(key, value)
  return value
}

export default function UserActivityTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname || typeof window === 'undefined' || !window.localStorage.getItem('authToken')) return
    const controller = new AbortController()
    const ping = () => {
      if (document.visibilityState === 'hidden' || !window.localStorage.getItem('authToken')) return
      void apiFetch('/api/activity/ping/', {
        method: 'POST',
        signal: controller.signal,
        body: JSON.stringify({
          path: pathname,
          title: document.title,
          session_id: getSessionId(),
        }),
      }).catch(() => undefined)
    }
    ping()
    const interval = window.setInterval(ping, 60_000)
    document.addEventListener('visibilitychange', ping)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', ping)
      controller.abort()
    }
  }, [pathname])

  return null
}
