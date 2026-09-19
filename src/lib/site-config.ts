const PRODUCTION_SITE_URL = 'https://www.wolvcapital.com'

/**
 * Return the public site origin used by canonical URLs, Open Graph URLs,
 * JSON-LD, robots.txt, and the sitemap.
 *
 * The production site redirects the apex domain to www, so an environment
 * value for the apex domain is normalized before it can reach SEO metadata.
 */
export function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, '')

  if (!configuredUrl) return PRODUCTION_SITE_URL

  try {
    const url = new URL(configuredUrl)
    if (url.hostname === 'wolvcapital.com') url.hostname = 'www.wolvcapital.com'
    return url.toString().replace(/\/+$/, '')
  } catch {
    return PRODUCTION_SITE_URL
  }
}

export const SITE_URL = PRODUCTION_SITE_URL
