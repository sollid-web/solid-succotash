import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPostsMeta } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog — WolvCapital',
  description:
    'Educational articles on digital asset fundamentals, security practices, and risk awareness. Written in a professional, compliance-aware tone for informational purposes only.',
  alternates: {
    canonical: '/blog',
  },
}

export const dynamic = 'force-static'

export default function BlogIndexPage() {
  const posts = getAllPostsMeta()

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-28 pb-10 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0b2f6b]">
            WolvCapital Blog
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-700 max-w-3xl">
            Clear, practical articles for beginners to intermediate investors.
            Content is provided for informational purposes only and does not constitute financial advice.
            Digital assets are volatile and you may lose capital.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          {posts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <p className="text-gray-700">No posts yet. Please check back soon.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <article key={post.slug} className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0b2f6b]">
                    <Link href={`/blog/${post.slug}`} className="hover:text-[#2563eb] transition">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    <time dateTime={post.date}>{post.date}</time>
                  </p>
                  <p className="mt-3 text-gray-700 leading-relaxed">{post.description}</p>
                  <div className="mt-4">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center font-semibold text-[#0b2f6b] hover:text-[#2563eb] transition"
                    >
                      Read article
                      <span aria-hidden className="ml-2">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
