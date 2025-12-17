'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

type GaPageViewProps = {
  measurementId: string
}

export default function GaPageView({ measurementId }: GaPageViewProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!measurementId) return
    if (typeof window === 'undefined') return
    if (typeof window.gtag !== 'function') return

    const search = searchParams?.toString()
    const pagePath = search ? `${pathname}?${search}` : pathname

    window.gtag('config', measurementId, {
      page_path: pagePath,
    })
  }, [measurementId, pathname, searchParams])

  return null
}
