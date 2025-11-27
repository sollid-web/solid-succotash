"use client"
import Head from 'next/head'
import FaqAccordion from '@/components/FaqAccordion'

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-hero-faq bg-cover bg-center bg-no-repeat">
      <Head>
        <title>FAQ · WolvCapital</title>
        <meta name="description" content="Frequently asked questions about deposits, withdrawals, ROI, and security controls at WolvCapital." />
        <meta name="robots" content="index, follow" />
      </Head>
      <section className="pt-28 pb-12 bg-black/60 text-white text-center">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-5xl font-extrabold mb-3">Frequently Asked Questions</h1>
          <p className="text-lg text-blue-100">Clear answers about manual approvals, timelines, and returns.</p>
        </div>
      </section>
      <section className="py-16 bg-white/90 backdrop-blur-[1px]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <FaqAccordion />
          </div>
        </div>
      </section>
    </div>
  )
}
