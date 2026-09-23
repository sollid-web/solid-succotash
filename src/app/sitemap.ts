import { MetadataRoute } from 'next'
import { getAllPostsMeta } from '@/lib/blog'
import { getSiteUrl } from '@/lib/site-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl()
  const now = new Date().toISOString()
  const redirectedBlogSlugs = new Set([
    'wolvcapital-platform-review-2026',
    'passive-income-crypto-staking-realistic-2026',
    'regulated-crypto-investment-platforms-2026',
  ])
  const blogPosts = getAllPostsMeta().filter((post) => !redirectedBlogSlugs.has(post.slug))

  return [
    // ── Core ──────────────────────────────────────────────────────
    { url: `${baseUrl}/`,                    lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${baseUrl}/wolv-token`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/presale`,             lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${baseUrl}/how-it-works`,        lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/tokenomics`,          lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/roadmap`,             lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/whitepaper`,          lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/smart-contracts`,     lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/about`,               lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`,             lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/security`,            lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/verification-pack`,   lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/how-to-verify-wolvcapital`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/partners`,         lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/editorial-policy`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.55 },
    { url: `${baseUrl}/metrics-methodology`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/leadership`,          lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/referral`,            lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/faq`,                 lastModified: now, changeFrequency: 'weekly',  priority: 0.75 },
    { url: `${baseUrl}/campaigns`,           lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },

    // ── Blog ──────────────────────────────────────────────────────
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt && !isNaN(new Date(post.updatedAt).getTime()) ? new Date(post.updatedAt).toISOString() : now,
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
