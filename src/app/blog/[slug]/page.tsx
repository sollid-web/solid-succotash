import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import BlogCta from '@/components/BlogCta'
import RiskDisclaimer from '@/components/RiskDisclaimer'
import { getAllPostSlugs, getPostBySlug } from '@/lib/blog'
import { getSiteUrl } from '@/lib/site-config'

interface PageProps { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  const url = `${getSiteUrl()}/blog/${post.slug}`
  const pageTitle = `${post.title} | WolvCapital Blog`
  const images = post.coverImage ? [{ url: post.coverImage, alt: post.coverImageAlt || post.title }] : undefined
  return { title: pageTitle, description: post.description, alternates: { canonical: url }, openGraph: { title: pageTitle, description: post.description, url, siteName: 'WolvCapital', type: 'article', images }, twitter: { card: 'summary_large_image', title: pageTitle, description: post.description, images } }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()
  const baseUrl = getSiteUrl()
  const canonicalUrl = `${baseUrl}/blog/${post.slug}`
  const publishedTime = new Date(post.publishedAt).toISOString()
  const modifiedTime = new Date(post.updatedAt || post.publishedAt).toISOString()
  const schemas = [
    { '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.description, datePublished: publishedTime, dateModified: modifiedTime, image: post.coverImage ? [post.coverImage] : undefined, author: { '@type': 'Organization', name: post.author || 'WolvCapital Editorial Team', url: baseUrl }, publisher: { '@type': 'Organization', name: 'WolvCapital', url: baseUrl }, articleSection: post.category, keywords: post.tags.join(', '), mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl } },
    ...(post.faqs.length ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: post.faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) }] : []),
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl }, { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` }, { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl }] },
  ]

  return <div className="min-h-screen bg-white">
    {schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
    <section className="pt-28 pb-10 bg-gray-50"><div className="container mx-auto px-4 lg:px-8 max-w-3xl">
      <div className="text-sm text-gray-500"><Link href="/blog" className="hover:text-[#0b2f6b]">Blog</Link><span aria-hidden className="mx-2">/</span><span>{post.category}</span></div>
      <p className="mt-4 text-sm text-gray-500"><time dateTime={post.publishedAt}>{post.publishedAt}</time> · {post.author}</p>
      <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0b2f6b]">{post.title}</h1>
      <p className="mt-4 text-base sm:text-lg text-gray-700">{post.description}</p>
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4"><p className="text-sm text-gray-600">Informational content only. This is not financial advice. Digital assets are volatile and you may lose capital.</p></div>
    </div></section>
    <section className="py-10 sm:py-14"><div className="container mx-auto px-4 lg:px-8 max-w-3xl">
      {post.coverImage && <div className="mt-2 mb-10 aspect-[16/9] overflow-hidden rounded-2xl border border-gray-200 bg-gray-100"><img src={post.coverImage} alt={post.coverImageAlt || post.title} className="h-full w-full object-cover" loading="eager" decoding="async" /></div>}
      <article className="blog-content prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      <aside className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-5" aria-label="Independent verification reminder">
        <h2 className="text-lg font-bold text-[#0b2f6b]">Verify the details independently</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">Before relying on a token, contract, balance, or transaction claim, check the address and on-chain activity yourself on <a href="https://bscscan.com" target="_blank" rel="noreferrer" className="font-semibold text-[#2563eb] underline">BscScan</a>. Never treat a blog post, screenshot, or marketing statement as proof of funds or performance.</p>
      </aside>
      {post.faqs.length > 0 && <section aria-labelledby="article-faq" className="mt-12 border-t border-gray-200 pt-8"><h2 id="article-faq" className="text-2xl font-bold text-[#0b2f6b]">Frequently asked questions</h2><div className="mt-5 space-y-5">{post.faqs.map((faq) => <div key={faq.question}><h3 className="text-lg font-semibold text-[#0b2f6b]">{faq.question}</h3><p className="mt-2 text-gray-700">{faq.answer}</p></div>)}</div></section>}
      <div className="mt-12 border-t border-gray-200 pt-8"><BlogCta /><RiskDisclaimer className="mt-4" /><div className="mt-10"><Link href="/blog" className="font-semibold text-[#0b2f6b] hover:text-[#2563eb]">← Back to all articles</Link></div></div>
    </div></section>
  </div>
}
