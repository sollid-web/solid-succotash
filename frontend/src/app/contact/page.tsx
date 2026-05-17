"use client"

import dynamic from 'next/dynamic'

const MapWithOverlay = dynamic(() => import('@/components/MapWithOverlay'), { ssr: false })

export default function ContactPage() {
  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '10px', color: '#ffffff',
    fontSize: '15px', outline: 'none',
    boxSizing: 'border-box' as const,
  }
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }
  const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px', marginBottom: '16px' }
  const h2Style = { fontSize: '22px', fontWeight: 700, color: '#ffffff', margin: '0 0 20px' }
  const pStyle = { fontSize: '15px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, margin: 0 }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#060c1a' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg,#060c1a 0%,#0d1f4e 45%,#0a3d35 100%)', borderBottom: '1px solid rgba(0,168,150,0.25)', padding: '80px 20px 64px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.07, backgroundImage: 'radial-gradient(circle,#00a896 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,#00a896,transparent)', opacity: 0.6 }} />
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(42,82,190,0.4),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,168,150,0.3),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '24px', left: '24px', width: '28px', height: '28px', borderTop: '2px solid rgba(0,168,150,0.5)', borderLeft: '2px solid rgba(0,168,150,0.5)' }} />
        <div style={{ position: 'absolute', top: '24px', right: '24px', width: '28px', height: '28px', borderTop: '2px solid rgba(0,168,150,0.5)', borderRight: '2px solid rgba(0,168,150,0.5)' }} />
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0,168,150,0.1)', border: '1px solid rgba(0,168,150,0.3)', borderRadius: '4px', padding: '4px 12px', marginBottom: '16px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00a896' }} />
            <span style={{ fontSize: '11px', color: '#00c9b1', fontWeight: 700, letterSpacing: '0.12em' }}>INVESTOR SUPPORT & COMPLIANCE</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px,6vw,52px)', fontWeight: 800, color: '#ffffff', margin: '0 0 16px', lineHeight: 1.1, textShadow: '0 0 60px rgba(0,168,150,0.25)' }}>Contact WolvCapital</h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, margin: 0, maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
            WolvCapital is a U.S. regulated digital investment platform. For compliance, account inquiries, or partnership discussions, please contact our investor support and compliance teams below.
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 16px 80px' }}>

        {/* Registered Office */}
        <div style={{ ...cardStyle, marginBottom: '32px' }}>
          <h2 style={h2Style}>Registered Office</h2>
          <p style={{ ...pStyle, marginBottom: '16px' }}>
            516 High St, Palo Alto, CA 94301, United States<br />
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px' }}>WolvCapital's principal office is located in Palo Alto, California. All regulatory correspondence and investor communications are managed through this location in accordance with U.S. financial regulations.</span>
          </p>
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            <MapWithOverlay
              query="516 High St, Palo Alto, CA 94301, United States"
              overlayWebp="/images/office-location-map.webp"
              overlayFallback="/images/office-location-map.jpg"
              title="WolvCapital Registered Office — United States"
            />
          </div>
        </div>

        {/* Two-col: Contact info + Form */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '24px' }}>

          {/* Contact Information */}
          <div style={cardStyle}>
            <h2 style={h2Style}>Contact Information</h2>
            {[
              {
                color: 'linear-gradient(135deg,#0b2f6b,#2563eb)',
                icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                title: 'Email Support',
                titleColor: '#00c9b1',
                lines: ['support@mail.wolvcapital.com', 'Our compliance and investor support teams respond to all inquiries within one business day.'],
              },
              {
                color: 'linear-gradient(135deg,#7c3aed,#6d28d9)',
                icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
                title: 'Business Hours',
                titleColor: '#a78bfa',
                lines: ['Monday–Friday, 9:00 AM–6:00 PM Pacific Time', 'Investor support is available outside business hours for urgent account matters.'],
              },
              {
                color: 'linear-gradient(135deg,#059669,#047857)',
                icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z',
                title: 'Live Chat',
                titleColor: '#34d399',
                lines: ['Secure live chat is available via your dashboard after login.', 'All conversations are encrypted and monitored for regulatory compliance.'],
              },
            ].map(({ color, icon, title, titleColor, lines }) => (
              <div key={title} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: titleColor, marginBottom: '6px' }}>{title}</div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>{lines[0]}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginTop: '4px' }}>{lines[1]}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div style={cardStyle}>
            <h2 style={h2Style}>Contact Form</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input type="text" placeholder="John Doe" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email Address *</label>
                <input type="email" placeholder="john@example.com" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Subject *</label>
                <input type="text" placeholder="Account inquiry, compliance, or partnership" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Message *</label>
                <textarea rows={5} placeholder="Please provide details regarding your inquiry." required style={{ ...inputStyle, resize: 'none' }} />
              </div>
              <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#2a52be,#00a896)', color: '#ffffff', fontSize: '15px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em' }}>
                Submit
              </button>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textAlign: 'center', margin: 0 }}>
                All fields are required. Your information is handled in accordance with our privacy policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
