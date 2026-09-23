import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteUrl } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'WolvCapital Security and Audit Status Explained',
  description: 'Understand the difference between verified source code, automated checks, independent security audits, operational controls, and financial assurance.',
  alternates: { canonical: 'https://www.wolvcapital.com/security-audit-status' },
}

const distinctions = [
  ['Source-code visibility', 'A block explorer may display published source code associated with a deployed contract. This can help a reviewer inspect code and compare an address, but it is not an independent audit or a guarantee of safety.'],
  ['Automated checks', 'A scanner or automated tool can identify patterns or potential issues within its scope. Results depend on the tool, configuration, and interpretation; automated output is not equivalent to a complete human audit.'],
  ['Independent audit', 'A meaningful audit should identify the auditor, scope, deployment or commit reviewed, date, findings, severity, unresolved issues, and remediation status. Do not describe a contract as audited without that evidence.'],
  ['Operational controls', 'Identity checks, account controls, monitoring, support procedures, administrator permissions, and withdrawal review are operational matters. They should be described with the actual policy and availability, not broad labels.'],
  ['Financial assurance', 'Neither source visibility nor an audit proves reserves, solvency, custody, liquidity, insurance, future value, or the ability to withdraw. Those are separate evidence questions.'],
]

export default function SecurityAuditStatusPage() {
  const baseUrl = getSiteUrl()
  return <main className="min-h-screen bg-slate-50 pt-20 pb-20"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: 'WolvCapital Security and Audit Status Explained', description: metadata.description, datePublished: '2026-09-23', dateModified: '2026-09-23', author: { '@type': 'Organization', name: 'WolvCapital Editorial Team', url: baseUrl }, mainEntityOfPage: { '@type': 'WebPage', '@id': `${baseUrl}/security-audit-status` } }) }} />
    <div className="mx-auto max-w-4xl px-4 lg:px-8"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Security terminology</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">Security and audit status: what each claim actually means</h1><p className="mt-5 text-lg leading-relaxed text-slate-700">Trustworthy security communication separates technical visibility, independent review, operations, and financial assurance. These categories should not be collapsed into one “secure” or “audited” badge.</p><p className="mt-4 text-sm text-slate-500">Published and reviewed: 23 September 2026 · <Link href="/editorial-policy" className="underline">Editorial policy</Link></p><div className="mt-8 space-y-5">{distinctions.map(([title, body]) => <section key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-slate-950">{title}</h2><p className="mt-3 leading-relaxed text-slate-700">{body}</p></section>)}</div><div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm leading-relaxed text-amber-950"><strong>Review rule:</strong> Ask for the primary report, scope, date, findings, and remediation evidence. If it is not available, use precise wording such as “public contract reference” rather than “fully audited.”</div><div className="mt-10 flex flex-wrap gap-3"><Link href="/security" className="rounded-lg bg-[#0b2f6b] px-5 py-3 text-sm font-semibold text-white">View security information</Link><Link href="/how-to-verify-wolvcapital" className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800">Use verification guide</Link></div></div></main>
}
