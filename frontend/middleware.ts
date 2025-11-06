import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protect dashboard routes: require presence of authToken cookie
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

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

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
