/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
      {
        source: '/api/:path*',
        destination: `${backendBase.replace(/\/$/, '')}/api/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
