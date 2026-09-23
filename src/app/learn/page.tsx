import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteUrl } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'WolvCapital Learn | Digital-Asset Guides and Verification',
  description: 'A focused library of educational guides covering BNB Smart Chain staking, independent verification, metrics, terms, and digital-asset risks.',
  alternates: { canonical: 'https://www.wolvcapital.com/learn' },
}

const guides = [
  ['BNB Smart Chain staking explained', 'Understand staking mechanics, lock periods, liquidity, APY assumptions, and risk.', '/bnb-smart-chain-staking-guide'],
  ['How to verify WolvCapital independently', 'Use a practical checklist for domains, contracts, token data, terms, and withdrawals.', '/how-to-verify-wolvcapital'],
  ['Verification Pack', 'Collect the public source checklist, risk disclosures, token information, and current terms.', '/verification-pack'],
  ['Live metrics methodology', 'See data sources, refresh behavior, timestamps, and the limits of displayed metrics.', '/metrics-methodology'],
  ['Security information', 'Review public contract references, account controls, and distinctions between visibility and assurance.', '/security'],
  ['Risk disclosure', 'Read the key digital-asset, liquidity, smart-contract, operational, and withdrawal risks.', '/risk-disclosure'],
]

export default function LearnPage() {
  const baseUrl = getSiteUrl()
  return <main className="min-h-screen bg-slate-50 pt-20 pb-20">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'WolvCapital Learn', description: metadata.description, url: `${baseUrl}/learn`, isPartOf: { '@type': 'WebSite', name: 'WolvCapital', url: baseUrl } }) }} />
    <div className="mx-auto max-w-6xl px-4 lg:px-8">
      <section className="rounded-3xl bg-white px-6 py-14 shadow-sm sm:px-10"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">WolvCapital Learn</p><h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">Learn first. Verify the details. Decide carefully.</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-700">A focused library for people researching digital-asset staking, contracts, token information, platform terms, and risk. Educational content is not financial advice or a promise of performance.</p></section>
      <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{guides.map(([title, description, href]) => <article key={href} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-slate-950">{title}</h2><p className="mt-3 flex-1 leading-relaxed text-slate-600">{description}</p><Link href={href} className="mt-5 text-sm font-semibold text-blue-700 hover:text-blue-900">Read guide →</Link></article>)}</section>
      <section className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm leading-relaxed text-amber-950"><strong>Review principle:</strong> Public data, source-code visibility, market references, and platform claims should be treated as inputs for independent review—not as proof of safety, solvency, regulatory authorization, liquidity, or future results.</section>
    </div>
  </main>
}
