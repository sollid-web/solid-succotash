import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const supportedLocales = ['en', 'de']
const localeCookieName = 'next-locale'

function normalizeLocale(locale?: string | null) {
  if (!locale) return ''
  return locale.trim().toLowerCase().split(';')[0].split('-')[0]
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const { pathname, searchParams } = url
  const res = NextResponse.next()

  const isStatic = pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname.startsWith('/images') || pathname.endsWith('.ico') || pathname.endsWith('.txt') || pathname.endsWith('.xml')
  if (isStatic) return res

  const explicitLang = normalizeLocale(searchParams.get('lang'))
  if (explicitLang && supportedLocales.includes(explicitLang)) {
    res.cookies.set(localeCookieName, explicitLang, { path: '/', maxAge: 60 * 60 * 24 * 365 })
    return res
  }

  const localeCookie = request.cookies.get(localeCookieName)?.value
  if (!localeCookie) {
    const acceptLanguage = request.headers.get('accept-language') || ''
    const preferredLanguages = acceptLanguage
      .split(',')
      .map((item) => normalizeLocale(item))
      .filter((lang) => lang)

    const locale = preferredLanguages.find((lang) => supportedLocales.includes(lang)) || 'en'
    res.cookies.set(localeCookieName, locale, { path: '/', maxAge: 60 * 60 * 24 * 365 })
  }

  return res
}

export const config = {
  matcher: ['/:path*'],
}
