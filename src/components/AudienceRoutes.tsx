import Link from 'next/link'

const routes = [
  { eyebrow: 'New to crypto', title: 'Understand the risks first', text: 'Start with the process, key terms, and risk disclosures before considering an account.', href: '/how-it-works', label: 'How it works' },
  { eyebrow: 'Evaluating plans', title: 'Compare structures and terms', text: 'Review plan information, eligibility notes, lock periods, and the limits of public projections.', href: '/plans', label: 'Compare plans' },
  { eyebrow: 'Researching WOLV', title: 'Verify the public data', text: 'Inspect the token information, contract references, market links, and independent-review checklist.', href: '/verification-pack', label: 'Open verification pack' },
  { eyebrow: 'Partners and professionals', title: 'Request a focused briefing', text: 'Use the verification request or contact path for partnership, media, and professional questions.', href: '/contact', label: 'Contact support' },
]

export default function AudienceRoutes() {
  return (
    <section className="py-14 sm:py-18" aria-labelledby="audience-routes-heading">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-300">Choose your starting point</p>
          <h2 id="audience-routes-heading" className="mt-3 text-3xl font-extrabold tracking-tight text-white">Get the information that matches your question</h2>
          <p className="mt-4 leading-relaxed text-white/60">WolvCapital serves different visitor needs. Choose a lower-commitment route before creating an account or visiting a market link.</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {routes.map((route) => <article key={route.href} className="glass flex flex-col p-5 transition-transform duration-300 hover:-translate-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-300">{route.eyebrow}</p>
            <h3 className="mt-3 text-lg font-bold text-white">{route.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">{route.text}</p>
            <Link href={route.href} className="mt-5 text-sm font-semibold text-teal-300 hover:text-teal-200">{route.label} →</Link>
          </article>)}
        </div>
      </div>
    </section>
  )
}
