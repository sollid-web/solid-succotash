import Link from 'next/link'
import RiskDisclaimer from '@/components/RiskDisclaimer'

export const metadata = {
  title: 'Investment Plans — Pioneer, Vanguard, Horizon & Summit | Wolv Capital',
  description: 'Choose from 4 staking plans with daily ROI. Pioneer starts at $50, Summit up to $50,000. All plans run on BNB Smart Chain with verifiable smart contracts.',
  openGraph: {
    title: 'Investment Plans — WolvCapital',
    description: 'Plan structures • Eligibility • Key terms (no guarantees)',
    images: ['/og-images/plans-og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Investment Plans — WolvCapital',
    description: 'Plan structures • Eligibility • Key terms (no guarantees)',
    images: ['/og-images/plans-og.png'],
  },
}

const PLANS = [
  {
    key: 'pioneer',
    name: 'Pioneer',
    apy: '8% APY',
    duration: '90 Days',
    min: '$100',
    max: '$999',
    color: '#00a896',
    summary: 'A structured entry point for new investors building their first position.',
    fit: 'Best for: first-time investors and smaller allocations.',
    details: [
      'Eligibility and limits apply; review plan terms before requesting.',
      'Funding and withdrawals follow verification and manual review.',
      'Performance varies with market conditions; no guarantees.',
      'Ongoing monitoring and reporting available in your dashboard.',
    ],
    href: '/plans/pioneer',
  },
  {
    key: 'vanguard',
    name: 'Vanguard',
    apy: '12% APY',
    duration: '150 Days',
    min: '$1,000',
    max: '$4,999',
    color: '#3b82f6',
    summary: 'Balanced structure with clear terms for investors ready to scale.',
    fit: 'Best for: investors seeking a mid-range plan structure.',
    details: [
      'Plan terms and eligibility are defined up front for clarity.',
      'Requests are subject to compliance checks and manual approval.',
      'Digital assets are volatile; outcomes can be positive or negative.',
      'Account activity is logged for transparency and audit support.',
    ],
    href: '/plans/vanguard',
  },
  {
    key: 'horizon',
    name: 'Horizon',
    apy: '18% APY',
    duration: '180 Days',
    min: '$5,000',
    max: '$14,999',
    color: '#8b5cf6',
    summary: 'Longer-term structure with defined terms for experienced investors.',
    fit: 'Best for: experienced investors with higher allocations.',
    details: [
      'All activity is reviewed under platform policies and disclosures.',
      'Withdrawals may require additional verification depending on context.',
      'No predictions, signals, or guaranteed outcomes are provided.',
      'You can track plan status and records in your dashboard.',
    ],
    href: '/plans/horizon',
  },
  {
    key: 'summit',
    name: 'Summit VIP',
    apy: '25% APY',
    duration: '365 Days',
    min: '$15,000',
    max: '$100,000',
    color: '#f59e0b',
    summary: 'Premium structure for institutional and high-net-worth allocations.',
    fit: 'Best for: high-allocation investors seeking a structured workflow.',
    details: [
      'Designed for investors who require a higher-touch, documented process.',
      'Enhanced verification and review may apply.',
      'Market conditions can change rapidly; no guarantees.',
      'Support is available for understanding terms and requirements.',
    ],
    href: '/plans/summit',
  },
] as const

export default function PlansPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ?? 'https://wolvcapital.com'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#060c1a' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
              { '@type': 'ListItem', position: 2, name: 'Plans', item: `${baseUrl}/plans` },
            ],
          }),
        }}
      />

      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg,#060c1a 0%,#0d1f4e 45%,#0a3d35 100%)', borderBottom: '1px solid rgba(0,168,150,0.25)', padding: '80px 20px 0', position: 'relative', overflow: 'hidden', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.07, backgroundImage: 'radial-gradient(circle, #00a896 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,#00a896,transparent)', opacity: 0.6 }} />
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(42,82,190,0.4),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '0', right: '-60px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,168,150,0.3),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '24px', left: '24px', width: '28px', height: '28px', borderTop: '2px solid rgba(0,168,150,0.5)', borderLeft: '2px solid rgba(0,168,150,0.5)' }} />
        <div style={{ position: 'absolute', top: '24px', right: '24px', width: '28px', height: '28px', borderTop: '2px solid rgba(0,168,150,0.5)', borderRight: '2px solid rgba(0,168,150,0.5)' }} />

        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, flex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0,168,150,0.1)', border: '1px solid rgba(0,168,150,0.3)', borderRadius: '4px', padding: '4px 12px', marginBottom: '16px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00a896' }} />
            <span style={{ fontSize: '11px', color: '#00c9b1', fontWeight: 700, letterSpacing: '0.12em' }}>BNB SMART CHAIN · ON-CHAIN REWARDS</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px,6vw,52px)', fontWeight: 800, color: '#ffffff', margin: '0 0 16px', lineHeight: 1.1, textShadow: '0 0 60px rgba(0,168,150,0.25)' }}>
            Investment Plans
          </h1>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: '0 0 12px', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
            Understand the structure, terms, and review process before you decide.
          </p>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', margin: '0 0 48px' }}>
            Digital assets are volatile and outcomes are not guaranteed.
          </p>
        </div>

        {/* Plan tier bar */}
        <div style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(12px)', display: 'flex' }}>
          {[
            { name: 'Pioneer', apy: '8% APY', color: '#00a896' },
            { name: 'Vanguard', apy: '12% APY', color: '#3b82f6' },
            { name: 'Horizon', apy: '18% APY', color: '#8b5cf6' },
            { name: 'Summit VIP', apy: '25% APY', color: '#f59e0b' },
          ].map((p, i, arr) => (
            <div key={p.name} style={{ flex: 1, padding: '16px 8px', textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: p.color, marginBottom: '2px' }}>{p.apy}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>{p.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 16px 0' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: '0 0 20px' }}>How plans work</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px' }}>
            {[
              { step: '01', title: 'Review', text: 'Read the plan terms and disclosures. Choose what fits your goals and risk tolerance.' },
              { step: '02', title: 'Request', text: 'Submit a request from your account. Eligibility checks and KYC verification may apply.' },
              { step: '03', title: 'Oversight', text: 'All investment activity is subject to manual review. Monitor status in your dashboard.' },
            ].map(({ step, title, text }) => (
              <div key={step} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#00a896', letterSpacing: '0.1em', marginBottom: '8px' }}>{step}</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>{title}</div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '16px', margin: '16px 0 0' }}>
            No hype, no urgency. Take the time you need to review terms before making any request.
          </p>
        </div>
      </div>

      {/* Plan cards */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 16px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', margin: '0 0 10px' }}>Choose your plan</h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
            All plans distribute rewards in WOLV tokens on BNB Smart Chain · Performance not guaranteed
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px', marginBottom: '32px' }}>
          {PLANS.map((plan) => (
            <div key={plan.key} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${plan.color}30`, borderRadius: '16px', padding: '24px 20px', display: 'flex', flexDirection: 'column' }}>
              {/* tier badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: plan.color }} />
                <span style={{ fontSize: '11px', fontWeight: 700, color: plan.color, letterSpacing: '0.1em' }}>{plan.name.toUpperCase()}</span>
              </div>

              {/* APY */}
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', lineHeight: 1, marginBottom: '4px' }}>{plan.apy}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>{plan.duration} · {plan.min}–{plan.max}</div>

              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, margin: '0 0 8px', flex: 1 }}>{plan.summary}</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', margin: '0 0 16px' }}>{plan.fit}</p>

              {/* details */}
              <div style={{ marginBottom: '20px' }}>
                {plan.details.map((d) => (
                  <div key={d} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: plan.color, flexShrink: 0, marginTop: '6px' }} />
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{d}</span>
                  </div>
                ))}
              </div>

              <Link href={plan.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0', borderRadius: '8px', border: `1px solid ${plan.color}50`, background: `${plan.color}10`, color: plan.color, fontSize: '13px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.15s' }}>
                Review plan →
              </Link>
            </div>
          ))}
        </div>

        <RiskDisclaimer className="mt-4" />
      </div>
    </div>
  )
}
