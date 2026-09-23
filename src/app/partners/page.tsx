import type { Metadata } from 'next'
import Link from 'next/link'
import VerificationPackRequest from '@/components/VerificationPackRequest'
import { getSiteUrl } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'WolvCapital for Partners, Media, and Professional Reviewers',
  description: 'Contact WolvCapital for partnership, media, ecosystem, and professional-review questions. Request public documentation before discussing collaboration.',
  alternates: { canonical: 'https://www.wolvcapital.com/partners' },
  openGraph: {
    title: 'WolvCapital for Partners and Professional Reviewers',
    description: 'A focused contact path for partnership, media, ecosystem, and professional-review questions.',
    url: 'https://www.wolvcapital.com/partners',
    type: 'website',
  },
}

const principles = [
  ['Evidence before promotion', 'Partners should be able to review public contracts, current terms, risk disclosures, token information, and available documentation before using WolvCapital in content or campaigns.'],
  ['Approved and consistent messaging', 'Partner materials should not promise returns, imply government approval, describe unsupported audit status, or present digital assets as risk-free or insured.'],
  ['Audience and jurisdiction awareness', 'Any collaboration should consider audience eligibility, applicable disclosure rules, geography, and whether the audience needs education rather than a transaction link.'],
  ['Measurable, responsible referrals', 'Referral activity should be attributable and reviewable, with clear disclosures and a process for removing inaccurate or non-compliant creative.'],
]

export default function PartnersPage() {
  const baseUrl = getSiteUrl()
  return (
    <main className="min-h-screen bg-slate-50 pt-20 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: 'WolvCapital for Partners and Professional Reviewers', description: metadata.description, url: `${baseUrl}/partners`, isPartOf: { '@type': 'WebSite', name: 'WolvCapital', url: baseUrl } }) }} />
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <section className="rounded-3xl bg-[#0b2f6b] px-6 py-14 text-white sm:px-10 sm:py-18">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">Partners and professional reviewers</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">Start with documentation, not promotion</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-blue-100">This page is for ecosystem partners, media, educators, researchers, and professional reviewers who need a focused source of public information before discussing WolvCapital.</p>
          <div className="mt-7 flex flex-wrap gap-3"><Link href="#request" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#0b2f6b] hover:bg-blue-50">Request a briefing</Link><Link href="/verification-pack" className="rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Open public sources</Link></div>
        </section>
        <section className="py-14" aria-labelledby="principles-heading">
          <h2 id="principles-heading" className="text-3xl font-bold text-slate-950">Collaboration principles</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">{principles.map(([title, body]) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h3 className="text-xl font-bold text-slate-950">{title}</h3><p className="mt-3 leading-relaxed text-slate-600">{body}</p></article>)}</div>
        </section>
        <section id="request" className="grid gap-10 border-t border-slate-200 py-14 lg:grid-cols-[1fr_1.1fr]">
          <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Request a briefing</p><h2 className="mt-3 text-3xl font-bold text-slate-950">Tell us what you need to verify</h2><p className="mt-4 leading-relaxed text-slate-600">Use the form to request public documentation or start a partnership conversation. Please do not include passwords, seed phrases, payment details, or sensitive identity documents.</p><div className="mt-6 space-y-3 text-sm text-slate-600"><p><strong className="text-slate-900">Useful requests include:</strong> media background, ecosystem partnership, technical review, educational collaboration, or public-source clarification.</p><p>For ordinary account support, use <Link href="/contact" className="font-semibold text-blue-700 underline">Contact Support</Link>. For independent review, start with the <Link href="/how-to-verify-wolvcapital" className="font-semibold text-blue-700 underline">verification guide</Link>.</p></div></div>
          <VerificationPackRequest />
        </section>
      </div>
    </main>
  )
}
