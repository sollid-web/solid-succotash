import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteUrl } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'WolvCapital Fees, Withdrawals, and Custody Questions',
  description: 'Questions to review about fees, lock periods, withdrawals, custody, liquidity, and operational controls before using a digital-asset platform.',
  alternates: { canonical: 'https://www.wolvcapital.com/fees-withdrawals-custody' },
}

const questions = [
  ['Fees', 'What deposit, staking, withdrawal, network, performance, or early-exit fees apply? When are they charged, and can they change under the current terms?'],
  ['Lock periods', 'When does a lock begin and end? Is early exit possible? Is a queue used? What happens if a market, contract, or operational event interrupts normal processing?'],
  ['Withdrawal conditions', 'What asset is returned, how long can processing take, what identity or eligibility checks apply, and what information is shown before confirmation?'],
  ['Custody and control', 'Who controls the wallet or contract? Which operations are controlled by code, administrators, or service providers? What public evidence supports the stated flow of funds?'],
  ['Liquidity and execution', 'Where would an asset be sold or exchanged? What are the pool depth, slippage, fees, market hours, and conditions that could prevent execution at a displayed reference price?'],
  ['Operational incidents', 'How are outages, smart-contract issues, paused withdrawals, compromised keys, and material changes communicated? Is there a dated incident and correction process?'],
]

export default function FeesWithdrawalsCustodyPage() {
  const baseUrl = getSiteUrl()
  return <main className="min-h-screen bg-white pt-20 pb-20"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: 'WolvCapital Fees, Withdrawals, and Custody Questions', description: metadata.description, datePublished: '2026-09-23', dateModified: '2026-09-23', author: { '@type': 'Organization', name: 'WolvCapital Editorial Team', url: baseUrl }, mainEntityOfPage: { '@type': 'WebPage', '@id': `${baseUrl}/fees-withdrawals-custody` } }) }} />
    <div className="mx-auto max-w-4xl px-4 lg:px-8"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Evaluation checklist</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">Fees, withdrawals, and custody: questions to answer before using a platform</h1><p className="mt-5 text-lg leading-relaxed text-slate-700">A balance, target reward, or public transaction does not answer the practical questions that determine whether an asset is usable. Use this checklist with the current terms, withdrawal policy, public contract references, and risk disclosure.</p><p className="mt-4 text-sm text-slate-500">Published and reviewed: 23 September 2026 · <Link href="/editorial-policy" className="underline">Editorial policy</Link></p><div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm leading-relaxed text-amber-950"><strong>Important:</strong> This page does not state that any particular fee, custody arrangement, withdrawal time, or operational control exists. Confirm the current source and terms before relying on it.</div><section className="mt-12 space-y-5">{questions.map(([title, body]) => <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6"><h2 className="text-xl font-bold text-slate-950">{title}</h2><p className="mt-3 leading-relaxed text-slate-700">{body}</p></article>)}</section><section className="mt-12 rounded-2xl bg-[#0b2f6b] p-7 text-white"><h2 className="text-2xl font-bold">Use the primary sources</h2><p className="mt-3 leading-relaxed text-blue-100">Review the current <Link href="/withdrawal-policy" className="font-semibold underline">withdrawal policy</Link>, <Link href="/terms-of-service" className="font-semibold underline">terms</Link>, <Link href="/risk-disclosure" className="font-semibold underline">risk disclosure</Link>, and <Link href="/verification-pack" className="font-semibold underline">verification pack</Link> before making a decision.</p></section></div></main>
}
