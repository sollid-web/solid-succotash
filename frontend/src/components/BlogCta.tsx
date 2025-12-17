"use client"

import Link from 'next/link'

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

type BlogCtaProps = {
  title?: string
  description?: string
  href?: string
}

export default function BlogCta({
  title = 'Have questions before you commit funds?',
  description = 'Contact WolvCapital for clarification on platform policies, security controls, and withdrawal processes. We provide information to help you make informed decisions.',
  href = '/contact',
}: BlogCtaProps) {
  const handleClick = () => {
    if (typeof window === 'undefined') return
    if (typeof window.gtag !== 'function') return
    window.gtag('event', 'blog_cta_click')
  }

  return (
    <section className="blog-cta mt-10">
      <div className="blog-cta__card rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
        <h2 className="text-lg sm:text-xl font-bold text-[#0b2f6b]">{title}</h2>
        <p className="mt-2 text-sm sm:text-base text-gray-700 leading-relaxed max-w-2xl">{description}</p>
        <div className="mt-5">
          <Link
            href={href}
            onClick={handleClick}
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-[#0b2f6b] hover:text-[#2563eb] hover:border-gray-300 transition"
          >
            Contact WolvCapital
            <span aria-hidden className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
