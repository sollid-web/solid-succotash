import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const locale = request.cookies.get('django_language')?.value || 'en'
  const response = NextResponse.next()
  
  // Ensure the header is set so Server Components can read it
  response.headers.set('x-wolv-locale', locale)
  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}