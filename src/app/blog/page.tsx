import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPostsMeta, BLOG_CATEGORIES } from '@/lib/blog'
import { getSiteUrl } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Blog & Market Insights — WolvCapital',
  description: 'Practical guides to crypto investing, DeFi, security, compliance, and risk management from WolvCapital.',
  alternates: { canonical: 'https://www.wolvcapital.com/blog' },
  openGraph: {
    title: 'Blog & Market Insights — WolvCapital',
    description: 'Practical guides to crypto investing, DeFi, security, compliance, and risk management from WolvCapital.',
    url: 'https://www.wolvcapital.com/blog',
    siteName: 'WolvCapital',
    images: [{ url: 'https://www.wolvcapital.com/og-blog.png', width: 1200, height: 630, alt: 'WolvCapital Blog and Insights' }],
    locale: 'en_US',
    type: 'website',
  },
}

export default function BlogIndexPage() {
  const posts = getAllPostsMeta()
  const baseUrl = getSiteUrl()
  const canonicalUrl = `${baseUrl}/blog`
  const categories = ['All topics', ...BLOG_CATEGORIES]

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'WolvCapital Blog', url: canonicalUrl,
        description: 'Practical guides to crypto investing, DeFi, security, compliance, and risk management.',
        isPartOf: { '@type': 'WebSite', name: 'WolvCapital', url: baseUrl },
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: canonicalUrl },
        ],
      }) }} />
      <section className="pt-28 pb-10 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2563eb]">WolvCapital Research</p>
          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0b2f6b]">Crypto investing, explained clearly</h1>
          <p className="mt-4 text-base sm:text-lg text-gray-700 max-w-3xl">Objective education for beginners and intermediate investors. Learn how protocols work, what to verify independently, and how to make risk-aware decisions.</p>
          <nav aria-label="Blog topics" className="mt-8 flex flex-wrap gap-2">
            {categories.map((category) => <a key={category} href={category === 'All topics' ? '#articles' : `#${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[#0b2f6b] hover:border-[#2563eb] hover:text-[#2563eb]">{category}</a>)}
          </nav>
        </div>
      </section>
      <section id="articles" className="py-10 sm:py-14">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl space-y-12">
          {BLOG_CATEGORIES.map((category) => {
            const categoryPosts = posts.filter((post) => post.category === category)
            if (!categoryPosts.length) return null
            return <section key={category} id={category.toLowerCase().replace(/[^a-z0-9]+/g, '-')} aria-labelledby={`${category}-heading`}>
              <div className="flex items-end justify-between gap-4 border-b border-gray-200 pb-3"><h2 id={`${category}-heading`} className="text-2xl font-bold text-[#0b2f6b]">{category}</h2><span className="text-sm text-gray-500">{categoryPosts.length} articles</span></div>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {categoryPosts.map((post) => <article key={post.slug} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-[#2563eb]"><span>{post.category}</span><span className="text-gray-400">•</span><time dateTime={post.publishedAt}>{post.publishedAt}</time></div>
                  <h3 className="mt-3 text-xl font-bold text-[#0b2f6b]"><Link href={`/blog/${post.slug}`} className="hover:text-[#2563eb]">{post.title}</Link></h3>
                  <p className="mt-3 text-gray-700 leading-relaxed">{post.description}</p>
                  <Link href={`/blog/${post.slug}`} className="mt-5 inline-flex font-semibold text-[#0b2f6b] hover:text-[#2563eb]">Read article <span aria-hidden className="ml-2">→</span></Link>
                </article>)}
              </div>
            </section>
          })}
        </div>
      </section>
    </div>
  )
}
