import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteUrl } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Live Metrics Methodology and Data Sources | WolvCapital',
  description: 'Learn where WolvCapital reference metrics come from, how often they refresh, and what the figures do and do not establish.',
  alternates: { canonical: 'https://www.wolvcapital.com/metrics-methodology' },
}

const rows = [
  ['WOLV market reference', 'DexScreener token endpoint', 'The first available pair returned by the provider at refresh time; displayed as a reference price, not a valuation or execution quote.'],
  ['Chain statistics', 'WolvCapital public chain-stats endpoint', 'The endpoint response at refresh time; a missing response displays an em dash rather than an invented fallback.'],
  ['BTC and ETH snapshot', 'CoinGecko public API', 'Educational reference prices and 24-hour changes with the visible source and last-updated time.'],
  ['Contract references', 'Linked block-explorer pages', 'Public address and source-code links for independent inspection; visibility is not an audit or safety guarantee.'],
]

export default function MetricsMethodologyPage() {
  const baseUrl = getSiteUrl()
  return (
    <main className="min-h-screen bg-white pt-28 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Live Metrics Methodology', url: `${baseUrl}/metrics-methodology` }) }} />
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Data transparency</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">Live metrics methodology</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-700">This page explains the public data sources used by selected site widgets. Figures can be delayed, incomplete, changed by the provider, or unavailable. They should not be treated as proof of reserves, liquidity, solvency, performance, ownership, or security.</p>
        <p className="mt-4 text-sm text-slate-500">Methodology last reviewed: 23 September 2026</p>
        <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50"><tr><th className="px-5 py-4 font-semibold text-slate-900">Metric</th><th className="px-5 py-4 font-semibold text-slate-900">Source</th><th className="px-5 py-4 font-semibold text-slate-900">Method and limit</th></tr></thead>
            <tbody className="divide-y divide-slate-200 bg-white">{rows.map(([metric, source, method]) => <tr key={metric}><td className="px-5 py-4 align-top font-semibold text-slate-900">{metric}</td><td className="px-5 py-4 align-top text-slate-700">{source}</td><td className="px-5 py-4 align-top leading-relaxed text-slate-600">{method}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6"><h2 className="text-xl font-bold text-slate-950">Refresh and timestamp behavior</h2><p className="mt-3 text-sm leading-relaxed text-slate-600">Client-side widgets request fresh data when the page loads and periodically while the page remains open. The visible update time describes the browser’s request cycle, not a guarantee that the upstream provider’s data is real-time.</p></section>
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6"><h2 className="text-xl font-bold text-slate-950">No fallback fabrication</h2><p className="mt-3 text-sm leading-relaxed text-slate-600">When a data source cannot be reached or returns an unexpected response, the public widget should show unavailable state rather than a stale promotional number. Check the linked source directly before relying on a figure.</p></section>
        </div>
        <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm leading-relaxed text-amber-950"><strong>Risk reminder:</strong> Market price, holder counts, reward-pool figures, and on-chain balances can change rapidly and may not describe your execution price, ability to withdraw, or financial outcome. Review the <Link href="/risk-disclosure" className="font-semibold underline">risk disclosure</Link> and <Link href="/verification-pack" className="font-semibold underline">verification pack</Link>.</div>
      </div>
    </main>
  )
}
