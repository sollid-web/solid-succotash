import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import BlogCta from '@/components/BlogCta'
import RiskDisclaimer from '@/components/RiskDisclaimer'
import { getAllPostSlugs, getPostBySlug } from '@/lib/blog'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ?? 'https://wolvcapital.com'
  const url = `${baseUrl}/blog/${post.slug}`

  const pageTitle = `${post.title} | WolvCapital Blog`

  const openGraphImages = post.coverImage
    ? [
        {
          url: post.coverImage,
          alt: post.coverImageAlt || post.title,
        },
      ]
    : undefined

  return {
    title: pageTitle,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
      description: post.description,
      url,
      siteName: 'WolvCapital',
      type: 'article',
      images: openGraphImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: post.description,
      images: openGraphImages,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const publishedTime = new Date(post.publishedAt).toISOString()
  const modifiedTime = new Date(post.updatedAt).toISOString()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ?? 'https://wolvcapital.com'
  const canonicalUrl = `${baseUrl}/blog/${post.slug}`

  return (
    <div className="min-h-screen bg-white">
      <Script
        id="blog-article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.description,
            datePublished: publishedTime,
            dateModified: modifiedTime,
            image: post.coverImage ?? undefined,
            author: [{ '@type': 'Organization', name: 'WolvCapital' }],
            publisher: {
              '@type': 'Organization',
              name: 'WolvCapital',
              url: baseUrl,
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': canonicalUrl,
            },
          }),
        }}
      />

      <Script
        id="blog-article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.description,
            datePublished: publishedTime,
            dateModified: modifiedTime,
            image: post.coverImage ?? undefined,
            author: [{ '@type': 'Organization', name: 'WolvCapital' }],
            publisher: {
              '@type': 'Organization',
              name: 'WolvCapital',
              url: baseUrl,
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': canonicalUrl,
            },
          }),
        }}
      />

      <section className="pt-28 pb-10 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="text-sm text-gray-500">
            <Link href="/blog" className="hover:text-[#0b2f6b] transition">
              Blog
            </Link>
            <span aria-hidden className="mx-2">/</span>
            <span className="text-gray-600">Article</span>
          </div>
          <p className="text-sm text-gray-500">{post.publishedAt}</p>
          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0b2f6b]">
            {post.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-700">{post.description}</p>
          <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-4">
            <p className="text-sm text-gray-600">
              Informational content only. This is not financial advice. Digital assets are volatile and you may lose
              capital.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          {post.coverImage ? (
            <div className="mt-2 mb-10 aspect-[16/9] overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
              <img
                src={post.coverImage}
                alt={post.coverImageAlt || post.title}
                className="h-full w-full object-cover"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          ) : null}

          <article
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          <div className="mt-12 border-t border-gray-200 pt-8">
            <BlogCta />
            <RiskDisclaimer className="mt-4" />

            <div className="mt-10">
              <Link href="/blog" className="font-semibold text-[#0b2f6b] hover:text-[#2563eb] transition">
                ← Back to all articles
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
