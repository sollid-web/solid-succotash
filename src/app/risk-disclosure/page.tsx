import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Risk Disclosure — WolvCapital',
  description: 'Understand the risks associated with digital asset investment. WolvCapital provides transparent disclosure of investment risks and volatility.',
  openGraph: {
    title: 'Risk Disclosure — WolvCapital',
    description: 'Understand Digital Asset Investment Risks',
    images: ['/og-images/risk-disclosure-og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Risk Disclosure — WolvCapital',
    description: 'Understand Digital Asset Investment Risks',
    images: ['/og-images/risk-disclosure-og.png'],
  },
}

const sections = [
  {
    title: 'Market Volatility',
    text: 'Digital asset prices may experience rapid and unpredictable changes. Market conditions can impact the value of your investments at any time. Price swings of 20–50% within short periods are not uncommon in crypto markets.',
  },
  {
    title: 'No Guarantees',
    text: 'WolvCapital does not guarantee investment returns. While our strategies aim for consistent ROI, external factors including market downturns, liquidity constraints, and macroeconomic shifts may affect performance.',
  },
  {
    title: 'Operational Risk',
    text: 'Technology failures, cybersecurity incidents, or human error may affect platform operations. We employ industry-standard security protocols including AES-256 encryption and MFA, but cannot eliminate all operational risk.',
  },
  {
    title: 'Regulatory Considerations',
    text: 'Digital asset regulations vary by jurisdiction and are evolving rapidly. Legal or regulatory changes may impact platform operations, investment availability, or withdrawal processing times.',
  },
  {
    title: 'Liquidity Risk',
    text: 'Some digital assets may have limited liquidity, making it difficult to exit positions at desired prices. Investment lock-up periods apply depending on your chosen plan.',
  },
  {
    title: 'Counterparty Risk',
    text: 'Investments may involve third-party service providers, exchanges, or custodians. The failure or insolvency of any counterparty could result in loss of funds.',
  },
]

const stats = [
  { value: 'HIGH', label: 'Volatility Class' },
  { value: '24–72h', label: 'Review Period' },
  { value: 'Manual', label: 'All Transactions' },
  { value: 'U.S. Law', label: 'Governed By' },
]

export default function RiskDisclosurePage() {
  const cardStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    marginBottom: '16px',
    padding: '28px 28px 24px',
  }
  const h2Style = { fontSize: '20px', fontWeight: 700, color: '#ffffff', margin: '0 0 12px', lineHeight: 1.3 }
  const pStyle = { fontSize: '15px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, margin: 0 }
  const accentBar = { width: '3px', minHeight: '24px', borderRadius: '4px', background: 'linear-gradient(180deg,#f59e0b,#ef4444)', flexShrink: 0 as const, marginTop: '4px' }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#060c1a' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg,#060c1a 0%,#1a0a0a 45%,#1a1a0a 100%)', borderBottom: '1px solid rgba(239,68,68,0.2)', padding: '80px 20px 0', position: 'relative', overflow: 'hidden', minHeight: '420px', display: 'flex', flexDirection: 'column' }}>
        {/* dot grid */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.07, backgroundImage: 'radial-gradient(circle, #ef4444 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        {/* scan line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,#ef4444,transparent)', opacity: 0.5 }} />
        {/* glow blobs */}
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(239,68,68,0.25),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '0', right: '-60px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,158,11,0.2),transparent 70%)', pointerEvents: 'none' }} />
        {/* corner brackets */}
        <div style={{ position: 'absolute', top: '24px', left: '24px', width: '28px', height: '28px', borderTop: '2px solid rgba(239,68,68,0.5)', borderLeft: '2px solid rgba(239,68,68,0.5)' }} />
        <div style={{ position: 'absolute', top: '24px', right: '24px', width: '28px', height: '28px', borderTop: '2px solid rgba(239,68,68,0.5)', borderRight: '2px solid rgba(239,68,68,0.5)' }} />

        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, flex: 1 }}>
          {/* icon ring */}
          <div style={{ position: 'relative', width: '88px', height: '88px', margin: '0 auto 28px' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(239,68,68,0.3)' }} />
            <div style={{ position: 'absolute', inset: '8px', borderRadius: '50%', border: '1px solid rgba(239,68,68,0.5)' }} />
            <div style={{ position: 'absolute', inset: '16px', borderRadius: '50%', background: 'rgba(239,68,68,0.12)', border: '1.5px solid rgba(239,68,68,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(239,68,68,0.25)' }}>
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          {/* tag */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', padding: '4px 12px', marginBottom: '16px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ fontSize: '11px', color: '#fca5a5', fontWeight: 700, letterSpacing: '0.12em' }}>INVESTMENT RISK NOTICE</span>
          </div>

          <h1 style={{ fontSize: 'clamp(36px,7vw,58px)', fontWeight: 800, color: '#ffffff', margin: '0 0 14px', lineHeight: 1.08, textShadow: '0 0 60px rgba(239,68,68,0.2)' }}>
            Risk Disclosure
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', fontWeight: 400, margin: '0 0 32px' }}>
            All investments carry inherent risk · Digital assets are subject to market volatility
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '999px', padding: '10px 24px', marginBottom: '48px' }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span style={{ fontSize: '13px', color: '#fca5a5', fontWeight: 600 }}>Read carefully before investing · Past performance does not guarantee future results</span>
          </div>
        </div>

        {/* stats bar */}
        <div style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'center' }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{ flex: 1, padding: '18px 12px', textAlign: 'center', borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#fca5a5', marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 16px 80px' }}>

        {/* Intro warning card */}
        <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '16px', padding: '24px 28px', marginBottom: '24px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, margin: '0 0 10px' }}>
              All investment opportunities carry inherent risk. Digital asset markets are particularly volatile, with prices subject to significant fluctuation. Past performance does not guarantee future results.
            </p>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, margin: 0 }}>
              By investing with WolvCapital, you acknowledge and accept the following risks:
            </p>
          </div>
        </div>

        {/* Risk section cards */}
        {sections.map(({ title, text }) => (
          <div key={title} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={accentBar} />
              <div style={{ flex: 1 }}>
                <h2 style={h2Style}>{title}</h2>
                <p style={pStyle}>{text}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Closing advisory */}
        <div style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, margin: 0, fontWeight: 500 }}>
              Only invest funds you can afford to lose. Review all terms and policies before participating.
              Contact <a href="mailto:support@mail.wolvcapital.com" style={{ color: '#f59e0b', textDecoration: 'underline', fontWeight: 600 }}>support@mail.wolvcapital.com</a> for further clarification.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', paddingTop: '8px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: '#ef4444', textDecoration: 'none' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
