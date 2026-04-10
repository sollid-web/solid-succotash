'use client'

import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-[#0b2f6b] via-[#1d4ed8] to-[#2563eb] text-center">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Begin Your Secure Investment Experience</h2>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
          Join a growing community of investors who trust WolvCapital for transparent, secure digital asset portfolio management.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/plans"
            className="px-10 py-4 bg-white text-[#0b2f6b] font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all"
          >
            View Plans
          </Link>
          <Link
            href="/accounts/signup"
            className="px-10 py-4 bg-gradient-to-r from-sky-400 to-cyan-500 text-[#0b2f6b] font-bold rounded-full hover:opacity-90 transition"
          >
            Open Account
          </Link>
        </div>
      </div>
    </section>
  )
}
