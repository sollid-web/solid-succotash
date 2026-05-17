import { MetadataRoute } from 'next'
import { getAllPostsMeta } from '@/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ?? 'https://wolvcapital.com'
  const now = new Date().toISOString()
  const blogPosts = getAllPostsMeta()

  return [
    // ── Core ──────────────────────────────────────────────────────
    { url: `${baseUrl}/`,                    lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${baseUrl}/plans`,               lastModified: now, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${baseUrl}/wolv-token`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/how-it-works`,        lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/tokenomics`,          lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/roadmap`,             lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/whitepaper`,          lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/smart-contracts`,     lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/about`,              lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`,            lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/security`,           lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/leadership`,         lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/referral`,           lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/faq`,               lastModified: now, changeFrequency: 'weekly',  priority: 0.75 },

    // ── Plan detail pages ─────────────────────────────────────────
    { url: `${baseUrl}/plans/pioneer`,  lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/plans/vanguard`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/plans/horizon`,  lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/plans/summit`,   lastModified: now, changeFrequency: 'weekly', priority: 0.85 },

    // ── Blog ──────────────────────────────────────────────────────
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt).toISOString(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),

    // ── Legal ─────────────────────────────────────────────────────
    { url: `${baseUrl}/terms-of-service`,   lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/privacy`,            lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/risk-disclosure`,    lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/legal`,              lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/legal-disclaimer`,   lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/withdrawal-policy`,  lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ]
}
