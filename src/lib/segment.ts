export function trackEvent(name: string, props?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const w = window as any
  if (typeof w.gtag === 'function') w.gtag('event', name, props || {})
  if (typeof w.analytics?.track === 'function') w.analytics.track(name, props || {})
}
