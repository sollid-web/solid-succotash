"use client"
import Head from 'next/head'
import FaqAccordion from '@/components/FaqAccordion'

export default function FaqPage() {
  return (
    <>
      <Head>
        <title>FAQ · WolvCapital</title>
        <meta name="description" content="Frequently asked questions about deposits, withdrawals, ROI, and security controls at WolvCapital." />
        <meta name="robots" content="index, follow" />
      </Head>
      <section className="pt-28 pb-12 bg-gradient-to-br from-[#0b2f6b] to-[#1d4ed8] text-white text-center">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-5xl font-extrabold mb-3">Frequently Asked Questions</h1>
          <p className="text-lg text-blue-100">Clear answers about manual approvals, timelines, and returns.</p>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <FaqAccordion />
          </div>
        </div>
      </section>
    </>
  )
}
