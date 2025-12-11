import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protect dashboard routes: require presence of authToken cookie
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const res = NextResponse.next()

  // Locale detection: if no locale cookie, try geo/country then Accept-Language
  const hasLocaleCookie = request.cookies.has('wolvcapital_locale')
  const isAsset = pathname.startsWith('/_next') || pathname.startsWith('/images') || pathname.includes('.')
  if (!hasLocaleCookie && !isAsset) {
    // Country -> locale mapping
    // @ts-ignore - geo property is available in production/edge runtime
    const country = (request.geo?.country || '').toUpperCase()
    const countryMap: Record<string,string> = {
      // Spanish-speaking
      'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'PE': 'es', 'CL': 'es', 'VE': 'es', 'EC': 'es', 'UY': 'es', 'PY': 'es', 'BO': 'es', 'GT': 'es', 'CU': 'es', 'DO': 'es', 'HN': 'es', 'NI': 'es', 'SV': 'es', 'CR': 'es', 'PA': 'es', 'PR': 'es',
      // French-speaking
      'FR': 'fr', 'BE': 'fr', 'CA': 'fr', 'CH': 'fr', 'LU': 'fr', 'CM': 'fr', 'SN': 'fr', 'CI': 'fr', 'NE': 'fr', 'TG': 'fr', 'ML': 'fr', 'BF': 'fr', 'GA': 'fr', 'CD': 'fr', 'CG': 'fr', 'BJ': 'fr',
    }
    let locale = countryMap[country]
    if (!locale) {
      // Fallback to Accept-Language (first supported)
      const accept = request.headers.get('accept-language') || ''
      const supported = ['en','es','fr']
      const preferred = accept.split(',').map(s => s.trim().split(';')[0].split('-')[0])
      locale = preferred.find(l => supported.includes(l)) || 'en'
    }
    res.cookies.set('wolvcapital_locale', locale, { path: '/', maxAge: 60*60*24*365 })
  }

  // Only guard /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('authToken')?.value
    if (!token) {
      const loginUrl = new URL('/accounts/login', request.url)
      // Add return path so we can navigate back after login
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return res
}

export const config = {
  matcher: [
    // Apply to all, we will skip assets in code
    '/:path*'
  ],
}
