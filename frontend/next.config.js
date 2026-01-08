/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Django admin URLs require trailing slashes. When Next.js auto-normalizes
  // URLs (default behavior), it can strip trailing slashes and create a
  // redirect loop with Django's APPEND_SLASH behavior.
  //
  // Example loop:
  //   /admin/users/profile/  (Next strips ->) /admin/users/profile
  //   /admin/users/profile   (Django appends ->) /admin/users/profile/
  //
  // Disabling the built-in redirect prevents this loop while keeping our
  // rewrite proxy for /admin/* intact.
  skipTrailingSlashRedirect: true,
  // Ensure middleware doesn't normalize URLs in a way that strips trailing
  // slashes before our admin rewrites run.
  skipMiddlewareUrlNormalize: true,
  // i18n removed - not supported in App Router, handled via middleware instead
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/static/**',
      },
      {
        protocol: 'https',
        hostname: 'wolvcapital.com',
        pathname: '/**',
      },
    ],
  },
  // Avoid conflicts with Django static files
  distDir: '.next',
  // IMPORTANT: Do not use assetPrefix on Vercel for root-domain deployments.
  // Setting an assetPrefix like "/frontend" forces Next.js to look for
  // assets at /frontend/_next/... which causes 404s for CSS/JS on Vercel
  // unless you also serve the site under that subpath with proper rewrites.
  // This was causing broken styles and odd rendering in production.
  assetPrefix: '',

  async rewrites() {
    // Proxy API calls from the frontend domain to the Django backend.
    // This ensures links like https://wolvcapital.com/api/auth/verify-email/?token=...
    // reach Django instead of returning a Next.js 404.
    const backendBase = process.env.NEXT_PUBLIC_API_URL || 'https://solid-succotash-production.up.railway.app'
    return [
      // Proxy Django static assets (needed for admin CSS/JS).
      {
        source: '/static/:path*',
        destination: `${backendBase.replace(/\/$/, '')}/static/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${backendBase.replace(/\/$/, '')}/api/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
