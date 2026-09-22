import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteUrl } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Editorial Policy and Research Standards | WolvCapital',
  description: 'Learn how WolvCapital research content is sourced, dated, reviewed, corrected, and separated from product marketing.',
  alternates: { canonical: 'https://www.wolvcapital.com/editorial-policy' },
}

export default function EditorialPolicyPage() {
  const baseUrl = getSiteUrl()
  return (
    <main className="min-h-screen bg-white pt-28 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebPage', name: 'WolvCapital Editorial Policy', url: `${baseUrl}/editorial-policy`,
        isPartOf: { '@type': 'WebSite', name: 'WolvCapital', url: baseUrl },
      }) }} />
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Research standards</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">Editorial policy</h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-700">WolvCapital Research publishes educational information about digital assets, blockchain systems, security, and platform documentation. Research content is not financial, legal, tax, or investment advice.</p>
        <p className="mt-3 text-sm text-slate-500">Policy last reviewed: 23 September 2026</p>
        <div className="mt-10 space-y-8 text-slate-700 leading-relaxed">
          <section><h2 className="text-2xl font-bold text-slate-950">Authorship and review</h2><p className="mt-3">Each article displays its author field and publication date. Where a qualified external reviewer has reviewed a piece, the reviewer and scope should be identified on that article. A publication from WolvCapital is not presented as an independent audit, legal opinion, or regulator-approved analysis.</p></section>
          <section><h2 className="text-2xl font-bold text-slate-950">Sources and methodology</h2><p className="mt-3">Articles should link to primary sources where a claim can be checked, including official documentation, public blockchain records, protocol documentation, or clearly identified market-data providers. Current metrics should show a source and timestamp where practical. Screenshots and promotional statements are not treated as proof of reserves, solvency, performance, or safety.</p></section>
          <section><h2 className="text-2xl font-bold text-slate-950">Updates and corrections</h2><p className="mt-3">Material changes should update the visible modification date and explain the scope of the change where appropriate. If you identify an inaccurate, outdated, or unclear statement, contact <a href="mailto:support@mail.wolvcapital.com" className="font-semibold text-blue-700 underline">support@mail.wolvcapital.com</a> with the page URL and supporting source. Corrections are reviewed and, where accepted, applied with a note or updated date.</p></section>
          <section><h2 className="text-2xl font-bold text-slate-950">Separation from product decisions</h2><p className="mt-3">Educational content is intended to help readers ask better questions. It does not establish product suitability, eligibility, regulatory status, custody, audit completion, liquidity, or future token value. Review the <Link href="/verification-pack" className="font-semibold text-blue-700 underline">verification pack</Link>, current terms, and <Link href="/risk-disclosure" className="font-semibold text-blue-700 underline">risk disclosure</Link> before making a decision.</p></section>
        </div>
      </div>
    </main>
  )
}
