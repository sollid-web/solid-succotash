import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteUrl } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'How to Verify WolvCapital Independently | Contracts, Terms, and Risks',
  description: 'A practical checklist for reviewing WolvCapital public contract references, token information, platform terms, withdrawal conditions, and digital-asset risks.',
  alternates: { canonical: 'https://www.wolvcapital.com/how-to-verify-wolvcapital' },
  openGraph: {
    title: 'How to Verify WolvCapital Independently',
    description: 'Use public sources and current terms to evaluate WolvCapital before creating an account or using a market link.',
    url: 'https://www.wolvcapital.com/how-to-verify-wolvcapital',
    type: 'article',
  },
}

const checks = [
  ['Confirm the official domain', 'Use https://www.wolvcapital.com and check that the page uses HTTPS. Treat similarly named domains, social accounts, and unsolicited messages as separate sources that require independent verification.', '/'],
  ['Check the contract references', 'Open the published contract addresses from the smart-contract page and compare the network, address, source-code page, and transaction activity. A published or verified source does not by itself prove safety, solvency, liquidity, or withdrawal availability.', '/smart-contracts'],
  ['Review token and market information', 'Read the WOLV token page and check the market-data provider or exchange link directly. Prices, holder counts, liquidity, and volume can change quickly and are not promises of value or execution.', '/wolv-token'],
  ['Read terms before providing information', 'Review eligibility, fees, lock periods, withdrawal conditions, privacy terms, and account rules before opening an account or sharing personal information.', '/terms-of-service'],
  ['Read risks and limitations', 'Consider volatility, liquidity, smart-contract, operational, custody, counterparty, and withdrawal risks. Digital assets can lose value, and no return or token outcome is guaranteed.', '/risk-disclosure'],
  ['Ask for missing evidence', 'If you need a source, date, scope, or explanation that is not published, request it before making a decision. The verification pack provides a lower-commitment way to organize the public review.', '/verification-pack'],
]

const faqs = [
  ['Does a verified contract mean the platform is audited?', 'No. Source-code verification means the published source corresponds to deployed bytecode. An independent audit is a separate review with its own auditor, scope, date, findings, and remediation record.'],
  ['Does a blockchain transaction prove that a platform is safe?', 'No. On-chain activity can help you inspect addresses and transactions, but it does not establish solvency, custody, legal authorization, future performance, or the ability to withdraw.'],
  ['Does this page provide investment advice?', 'No. This is an educational checklist. It does not assess suitability, eligibility, tax treatment, legal status, or the likelihood of profit or loss.'],
]

export default function HowToVerifyPage() {
  const baseUrl = getSiteUrl()
  const faqSchema = faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } }))
  return (
    <main className="min-h-screen bg-white pt-20 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Article', headline: 'How to Verify WolvCapital Independently', description: metadata.description, datePublished: '2026-09-23', dateModified: '2026-09-23', author: { '@type': 'Organization', name: 'WolvCapital Editorial Team', url: baseUrl }, publisher: { '@type': 'Organization', name: 'WolvCapital', url: baseUrl }, mainEntityOfPage: { '@type': 'WebPage', '@id': `${baseUrl}/how-to-verify-wolvcapital` }, articleSection: 'Security & Compliance', keywords: 'how to verify WolvCapital, WolvCapital contract, WOLV token risks, crypto platform due diligence',
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqSchema }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl }, { '@type': 'ListItem', position: 2, name: 'Verification Pack', item: `${baseUrl}/verification-pack` }, { '@type': 'ListItem', position: 3, name: 'How to Verify WolvCapital', item: `${baseUrl}/how-to-verify-wolvcapital` }] }) }} />
      <article className="mx-auto max-w-4xl px-4 lg:px-8">
        <header className="border-b border-slate-200 pb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Independent review guide</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">How to verify WolvCapital independently</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-700">Use this checklist to review the official domain, public contract references, WOLV token information, current terms, withdrawal conditions, and risks before creating an account or using a market link.</p>
          <p className="mt-4 text-sm text-slate-500">Published and reviewed: 23 September 2026 · WolvCapital Editorial Team · <Link href="/editorial-policy" className="underline hover:text-blue-700">Editorial policy</Link></p>
        </header>
        <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm leading-relaxed text-amber-950"><strong>Important:</strong> This page is an educational checklist, not a legal opinion, investment recommendation, regulator endorsement, audit, proof of reserves, or promise of performance. Verify information independently and consider qualified professional advice where appropriate.</div>
        <section className="mt-12" aria-labelledby="checklist-heading">
          <h2 id="checklist-heading" className="text-3xl font-bold text-slate-950">Six checks before you proceed</h2>
          <div className="mt-6 space-y-4">{checks.map(([title, description, href], index) => <section key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6"><div className="flex gap-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0b2f6b] text-sm font-bold text-white">{index + 1}</span><div><h3 className="text-xl font-bold text-slate-950">{title}</h3><p className="mt-2 leading-relaxed text-slate-700">{description}</p><Link href={href} className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:text-blue-900">Open related source →</Link></div></div></section>)}</div>
        </section>
        <section className="mt-14" aria-labelledby="faq-heading"><h2 id="faq-heading" className="text-3xl font-bold text-slate-950">Common verification questions</h2><div className="mt-6 space-y-6">{faqs.map(([question, answer]) => <div key={question} className="border-b border-slate-200 pb-6"><h3 className="text-lg font-bold text-slate-950">{question}</h3><p className="mt-2 leading-relaxed text-slate-700">{answer}</p></div>)}</div></section>
        <section className="mt-14 rounded-2xl bg-[#0b2f6b] p-7 text-white sm:p-9"><h2 className="text-2xl font-bold">Keep the review organized</h2><p className="mt-3 max-w-2xl leading-relaxed text-blue-100">Use the verification pack to collect the public sources in one place. If important information is missing, contact support with a specific question rather than relying on a screenshot, social post, or third-party claim as proof.</p><div className="mt-5 flex flex-wrap gap-3"><Link href="/verification-pack" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#0b2f6b] hover:bg-blue-50">Open verification pack</Link><Link href="/contact" className="rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Contact support</Link></div></section>
      </article>
    </main>
  )
}
