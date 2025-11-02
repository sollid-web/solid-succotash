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
  assetPrefix: process.env.NODE_ENV === 'production' ? '/frontend' : '',
}

module.exports = nextConfig
