'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'

interface LocaleContextType {
  locale: string
  setLocale: (newLocale: string) => Promise<void>
}

// 1. Initialize Context with a default value
const LocaleContext = createContext<LocaleContextType>({
  locale: 'en',
  setLocale: async () => {},
})

export function LocaleProvider({
  locale: initialLocale,
  children,
}: {
  locale: string
  children: ReactNode
}) {
  // 2. All hooks MUST be inside the function component
  const [locale, setLocaleState] = useState(initialLocale)

  useEffect(() => {
    // Sync state if a cookie already exists on the HP workstation/client browser
    const savedLocale = Cookies.get('django_language')
    if (savedLocale && savedLocale !== locale) {
      setLocaleState(savedLocale)
    }
  }, [locale])

  const setLocale = async (newLocale: string) => {
    setLocaleState(newLocale)

    // Save to cookie (Django-compatible name)
    Cookies.set('django_language', newLocale, { expires: 365, path: '/' })

    try {
      // Sync with your Django DRF endpoint
      const response = await fetch('/api/update-language/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: newLocale }),
      })
      
      if (!response.ok) throw new Error('Backend sync failed')
    } catch (error) {
      console.error("Failed to sync language preference:", error)
    }

    // Refresh to trigger Django's WolvLanguageMiddleware
    window.location.reload()
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}