/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
}

module.exports = nextConfig
