import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-config'

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
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
