import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/accounts/',
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
