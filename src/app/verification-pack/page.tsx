import type { Metadata } from 'next'
import Link from 'next/link'
import VerificationPackRequest from '@/components/VerificationPackRequest'
import { getSiteUrl } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'WolvCapital Verification Pack | Contracts, Terms, and Risks',
  description: 'Review the public sources, platform terms, token information, and risk disclosures needed to evaluate WolvCapital independently.',
  alternates: { canonical: 'https://www.wolvcapital.com/verification-pack' },
  openGraph: {
    title: 'WolvCapital Verification Pack',
    description: 'A practical starting point for reviewing public contract references, terms, token information, and risks.',
    url: 'https://www.wolvcapital.com/verification-pack',
    type: 'website',
  },
}

const sources = [
  { title: 'How it works', description: 'Understand the stated platform flow, account steps, and information to review before proceeding.', href: '/how-it-works', label: 'Read the process' },
  { title: 'Smart contracts', description: 'Open the published contract references and network links for independent technical inspection.', href: '/smart-contracts', label: 'View contract references' },
  { title: 'WOLV token information', description: 'Review token data, market references, supply information, and the limits of public market data.', href: '/wolv-token', label: 'Review token data' },
  { title: 'Security information', description: 'See the difference between public source visibility, account controls, operational information, and an independent audit.', href: '/security', label: 'Read security information' },
  { title: 'Risk disclosure', description: 'Read the risks relating to volatility, liquidity, smart contracts, custody, withdrawals, and operations.', href: '/risk-disclosure', label: 'Read risk disclosure' },
  { title: 'Platform terms', description: 'Review the current terms, privacy notice, and withdrawal-policy pages before sharing information or using the service.', href: '/terms-of-service', label: 'Review terms' },
]

export default function VerificationPackPage() {
  const baseUrl = getSiteUrl()
  return (
    <main className="min-h-screen bg-slate-50 pt-20 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'WolvCapital Verification Pack',
        description: 'Public sources for independent evaluation of WolvCapital.',
        url: `${baseUrl}/verification-pack`,
        isPartOf: { '@type': 'WebSite', name: 'WolvCapital', url: baseUrl },
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: 'Verification Pack', item: `${baseUrl}/verification-pack` },
        ],
      }) }} />
      <section className="border-b border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Independent review starting point</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">The WolvCapital verification pack</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-700">Use this page to review the public sources behind the platform before deciding whether it is suitable for you. It is an information resource, not an endorsement, offer, suitability assessment, or guarantee.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="#sources" className="rounded-lg bg-[#0b2f6b] px-5 py-3 text-sm font-semibold text-white hover:bg-[#16498f]">Open the source checklist</Link>
            <a href="/Whitepaper.pdf" download className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:border-blue-400">Download whitepaper</a>
          </div>
          <p className="mt-4 text-xs text-slate-500">Last reviewed: 23 September 2026 · Public information changes over time; check the linked pages for their current terms and dates.</p>
        </div>
      </section>
      <section id="sources" className="mx-auto max-w-5xl px-4 py-14 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => <article key={source.href} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">{source.title}</h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{source.description}</p>
            <Link href={source.href} className="mt-5 text-sm font-semibold text-blue-700 hover:text-blue-900">{source.label} →</Link>
          </article>)}
        </div>
        <div className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm leading-relaxed text-amber-950">
          <strong>Important distinction:</strong> Public contract source code or blockchain records can be reviewed independently, but they are not the same as an independent security audit, proof of reserves, custody statement, regulatory authorization, or guarantee of performance.
        </div>
        <p className="mt-6 text-sm text-slate-600">Need a step-by-step review? Read <Link href="/how-to-verify-wolvcapital" className="font-semibold text-blue-700 underline">How to verify WolvCapital independently</Link>.</p>
      </section>
      <section className="border-y border-slate-200 bg-white py-14">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 lg:grid-cols-[1fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Request the pack</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Want the checklist in one follow-up?</h2>
            <p className="mt-4 leading-relaxed text-slate-600">Request the verification checklist and current public-source summary. The team may use your audience selection to send a more relevant response. No deposit or account is required to request information.</p>
            <p className="mt-5 text-sm leading-relaxed text-slate-500">If you prefer not to submit a form, you can use the public links above or contact <a className="font-semibold text-blue-700 underline" href="mailto:support@mail.wolvcapital.com">support@mail.wolvcapital.com</a>.</p>
          </div>
          <VerificationPackRequest />
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 pt-12 lg:px-8">
        <div className="rounded-2xl bg-[#0b2f6b] p-7 text-white sm:p-9">
          <h2 className="text-2xl font-bold">Choose your next step</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <Link href="/plans" className="rounded-xl border border-white/20 bg-white/10 p-4 text-sm hover:bg-white/15"><strong className="block">Compare plans</strong><span className="mt-1 block text-blue-100">Review structures and terms.</span></Link>
            <Link href="/faq" className="rounded-xl border border-white/20 bg-white/10 p-4 text-sm hover:bg-white/15"><strong className="block">Ask a question</strong><span className="mt-1 block text-blue-100">Read common objections and answers.</span></Link>
            <Link href="/contact" className="rounded-xl border border-white/20 bg-white/10 p-4 text-sm hover:bg-white/15"><strong className="block">Contact support</strong><span className="mt-1 block text-blue-100">Discuss product or partnership questions.</span></Link>
          </div>
        </div>
      </section>
    </main>
  )
}
