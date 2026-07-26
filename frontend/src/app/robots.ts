import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/accounts/signup' // 🚀 ADD THIS LINE TO UNBLOCK THE SIGNUP ROUTE
        ],
        disallow: [
          '/dashboard/',
          '/accounts/',      // This will continue protecting your users' deep dashboards
          '/admin/',
          '/wolv-admin/',
          '/checkout/',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://wolvcapital.com/sitemap.xml',
    host: 'https://wolvcapital.com',
  }
}