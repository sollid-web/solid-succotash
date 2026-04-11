'use client'

import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 text-center">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-[#0F172A] mb-6">Start Your Application</h2>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed">
          Account opening is subject to KYC verification, eligibility review, and applicable regulatory requirements.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/plans"
            className="px-10 py-4 bg-white text-[#0b2f6b] font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all border border-gray-200"
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
