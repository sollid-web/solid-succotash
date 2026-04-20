import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const supportedLocales = ['en', 'de']
const localeCookieName = 'next-locale'

function normalizeLocale(locale?: string | null) {
  if (!locale) return ''
  return locale.trim().toLowerCase().split(';')[0].split('-')[0]
}

function parseAcceptLanguage(header: string) {
  return header
    .split(',')
    .map((item) => {
      const [tag, q] = item.trim().split(';q=')
      return {
        locale: normalizeLocale(tag),
        weight: q ? Number(q) : 1,
      }
    })
    .filter((item) => item.locale)
    .sort((a, b) => b.weight - a.weight)
    .map((item) => item.locale)
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const { pathname, searchParams } = url
  const res = NextResponse.next()

  const isStatic =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/api') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.txt') ||
    pathname.endsWith('.xml')

  if (isStatic) return res

  const explicitLang = normalizeLocale(searchParams.get('lang'))
  if (explicitLang && supportedLocales.includes(explicitLang)) {
    res.cookies.set(localeCookieName, explicitLang, { path: '/', maxAge: 60 * 60 * 24 * 365 })
    return res
  }

  const localeCookie = normalizeLocale(request.cookies.get(localeCookieName)?.value)
  const preferredLanguages = parseAcceptLanguage(request.headers.get('accept-language') || '')
  const resolvedLocale =
    (localeCookie && supportedLocales.includes(localeCookie) ? localeCookie : preferredLanguages.find((lang) => supportedLocales.includes(lang))) ||
    'en'

  if (!localeCookie || !supportedLocales.includes(localeCookie)) {
    res.cookies.set(localeCookieName, resolvedLocale, { path: '/', maxAge: 60 * 60 * 24 * 365 })
  }

  return res
}

export const config = {
  matcher: ['/:path*'],
}
