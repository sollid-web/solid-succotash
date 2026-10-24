// Keep production deploys functional even when the optional project variable is
// missing. The public API has a stable production origin; an explicit variable
// still wins for staging, previews, and self-hosted deployments.
const configuredApiOrigin =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.VERCEL ? 'https://api.wolvcapital.com' : 'http://localhost:8000')

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
  // Ensure proxy doesn't normalize URLs in a way that strips trailing
  // slashes before our admin rewrites run.
  skipProxyUrlNormalize: true,
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

  async redirects() {
    return [
      // Consolidated blog topics: keep the stronger pillar URL.
      { source: '/blog/wolvcapital-platform-review-2026', destination: '/blog/wolvcapital-review-2026', permanent: true },
      { source: '/blog/passive-income-crypto-staking-realistic-2026', destination: '/blog/passive-income-crypto-staking-2026', permanent: true },
      { source: '/blog/regulated-crypto-investment-platforms-2026', destination: '/blog/crypto-investment-platform-comparison-2026', permanent: true },
      // Plans pages are now gated — redirect any direct links to login
      { source: '/plans',          destination: '/accounts/login', permanent: false },
      { source: '/plans/:path*',   destination: '/accounts/login', permanent: false },
    ]
  },

  async rewrites() {
    // Proxy API calls from the frontend domain to the Django backend.
    // This ensures links like https://www.wolvcapital.com/api/auth/verify-email/?token=...
    // reach Django instead of returning a Next.js 404.
    const backendBase = configuredApiOrigin
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

// Fix: suppress lockfile root inference warning when the monorepo root
// contains package-lock.json files at multiple levels.
if (!nextConfig.turbopack) nextConfig.turbopack = {}
nextConfig.turbopack.root = __dirname

module.exports = nextConfig
