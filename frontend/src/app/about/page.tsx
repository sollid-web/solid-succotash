import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us — WolvCapital',
  description: "Learn about WolvCapital's mission to provide secure, transparent digital asset investment opportunities with sustainable returns.",
  openGraph: {
    title: 'About WolvCapital',
    description: 'Global, Secure, Transparent Digital Asset Management',
    images: ['/og-images/about-og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About WolvCapital',
    description: 'Global, Secure, Transparent Digital Asset Management',
    images: ['/og-images/about-og.png'],
  },
}

export default function AboutPage() {
  const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px 28px 24px', marginBottom: '16px' }
  const h2Style = { fontSize: '22px', fontWeight: 700, color: '#ffffff', margin: '0 0 14px' }
  const h3Style = { fontSize: '17px', fontWeight: 600, color: '#00c9b1', margin: '0 0 8px' }
  const pStyle = { fontSize: '15px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.8, margin: 0 }
  const accentBar = { width: '3px', minHeight: '24px', borderRadius: '4px', background: 'linear-gradient(180deg,#2a52be,#00a896)', flexShrink: 0 as const, marginTop: '4px' }
  const stats = [
    { value: '120+', label: 'Countries Served' },
    { value: '8–25%', label: 'APY Range' },
    { value: 'BEP-20', label: 'Token Standard' },
    { value: 'FinCEN', label: 'MSB Registered' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#060c1a' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg,#060c1a 0%,#0d1f4e 45%,#0a3d35 100%)', borderBottom: '1px solid rgba(0,168,150,0.25)', padding: '80px 20px 0', position: 'relative', overflow: 'hidden', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.07, backgroundImage: 'radial-gradient(circle,#00a896 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,#00a896,transparent)', opacity: 0.6 }} />
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(42,82,190,0.4),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '0', right: '-60px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,168,150,0.3),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '24px', left: '24px', width: '28px', height: '28px', borderTop: '2px solid rgba(0,168,150,0.5)', borderLeft: '2px solid rgba(0,168,150,0.5)' }} />
        <div style={{ position: 'absolute', top: '24px', right: '24px', width: '28px', height: '28px', borderTop: '2px solid rgba(0,168,150,0.5)', borderRight: '2px solid rgba(0,168,150,0.5)' }} />

        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, flex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0,168,150,0.1)', border: '1px solid rgba(0,168,150,0.3)', borderRadius: '4px', padding: '4px 12px', marginBottom: '16px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00a896' }} />
            <span style={{ fontSize: '11px', color: '#00c9b1', fontWeight: 700, letterSpacing: '0.12em' }}>U.S. REGULATED · GLOBAL PLATFORM</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px,6vw,52px)', fontWeight: 800, color: '#ffffff', margin: '0 0 16px', lineHeight: 1.1, textShadow: '0 0 60px rgba(0,168,150,0.25)' }}>About WolvCapital</h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, margin: '0 0 48px', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
            A digital asset investment platform dedicated to delivering secure, transparent, and technology-driven financial solutions for individuals worldwide.
          </p>
        </div>

        {/* Stats bar */}
        <div style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(12px)', display: 'flex' }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{ flex: 1, padding: '18px 12px', textAlign: 'center', borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#00c9b1', marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '48px 16px 80px' }}>

        {/* Mission */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={accentBar} />
            <div>
              <p style={{ ...pStyle, marginBottom: '14px' }}>Since inception, our mission has been to simplify access to digital asset opportunities while maintaining industry-leading security, compliance, and operational excellence.</p>
              <p style={pStyle}>Our investment model focuses on sustainable returns of 8%–25% APY, supported by diversified digital asset strategies and on-chain reward distribution via BNB Smart Chain. We serve verified investors across more than 120 countries.</p>
            </div>
          </div>
        </div>

        {/* Commitment */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={accentBar} />
            <div style={{ flex: 1 }}>
              <h2 style={h2Style}>Our Commitment</h2>
              <p style={{ ...pStyle, marginBottom: '14px' }}>We prioritize integrity, transparency, and professional risk management. Each investor benefits from:</p>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                {['8%–25% APY Staking Plans on BNB Smart Chain','256-bit SSL encryption across all connections','KYC & AML compliance for every account','24/7 system monitoring and fraud detection','Protected user-data environment (GDPR · CCPA)'].map(b => (
                  <li key={b} style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, marginBottom: '8px' }}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Vision */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={accentBar} />
            <div>
              <h2 style={h2Style}>Our Vision</h2>
              <p style={pStyle}>To become a trusted global leader in digital asset investment by offering accessible, secure, and consistent growth opportunities backed by innovation and professional oversight.</p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={accentBar} />
            <div style={{ flex: 1 }}>
              <h2 style={h2Style}>Our Values</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '16px', marginTop: '4px' }}>
                {[
                  { title: 'Security First', text: 'Every system is built with protection in mind.' },
                  { title: 'Transparency', text: 'Investors receive clear insights into operations and policies.' },
                  { title: 'Accessibility', text: 'Our platform is designed for both new and experienced investors.' },
                  { title: 'Sustainability', text: 'We prioritize steady, controlled investment performance.' },
                ].map(({ title, text }) => (
                  <div key={title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px' }}>
                    <h3 style={h3Style}>{title}</h3>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, margin: 0 }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Closing */}
        <div style={{ background: 'rgba(0,168,150,0.06)', border: '1px solid rgba(0,168,150,0.2)', borderRadius: '16px', padding: '24px 28px' }}>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}>
            WolvCapital continues to evolve as global digital markets grow, maintaining a forward-thinking approach to investor success.
          </p>
        </div>
      </div>
    </div>
  )
}
