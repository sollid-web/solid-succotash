import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy · WolvCapital',
  description: 'WolvCapital privacy policy. Learn how we collect, use, and protect your personal data in accordance with U.S. financial and data protection regulations.',
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', marginBottom: '16px', padding: '28px 28px 24px' }
  const h2Style = { fontSize: '20px', fontWeight: 700, color: '#ffffff', margin: '0 0 14px', lineHeight: 1.3 }
  const h3Style = { fontSize: '16px', fontWeight: 600, color: '#00c9b1', margin: '16px 0 10px' }
  const pStyle = { fontSize: '15px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, margin: '0 0 10px' }
  const liStyle = { fontSize: '15px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, marginBottom: '8px' }
  const accentBar = { width: '3px', minHeight: '24px', borderRadius: '4px', background: 'linear-gradient(180deg,#2a52be,#00a896)', flexShrink: 0 as const, marginTop: '4px' }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#060c1a' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg,#060c1a 0%,#0d1f4e 45%,#0a3d35 100%)', borderBottom: '1px solid rgba(0,168,150,0.25)', padding: '80px 20px 0', position: 'relative', overflow: 'hidden', minHeight: '420px', display: 'flex', flexDirection: 'column' }}>
        {/* animated dot grid */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08, backgroundImage: 'radial-gradient(circle, #00a896 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        {/* scan line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,#00a896,transparent)', opacity: 0.6 }} />
        {/* glow blobs */}
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(42,82,190,0.4),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '0', right: '-60px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,168,150,0.3),transparent 70%)', pointerEvents: 'none' }} />
        {/* corner brackets */}
        <div style={{ position: 'absolute', top: '24px', left: '24px', width: '28px', height: '28px', borderTop: '2px solid rgba(0,168,150,0.5)', borderLeft: '2px solid rgba(0,168,150,0.5)' }} />
        <div style={{ position: 'absolute', top: '24px', right: '24px', width: '28px', height: '28px', borderTop: '2px solid rgba(0,168,150,0.5)', borderRight: '2px solid rgba(0,168,150,0.5)' }} />

        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, flex: 1 }}>
          {/* icon ring */}
          <div style={{ position: 'relative', width: '88px', height: '88px', margin: '0 auto 28px' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(0,168,150,0.3)', animation: 'pulse 3s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', inset: '8px', borderRadius: '50%', border: '1px solid rgba(0,168,150,0.5)' }} />
            <div style={{ position: 'absolute', inset: '16px', borderRadius: '50%', background: 'rgba(0,168,150,0.15)', border: '1.5px solid rgba(0,168,150,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(0,168,150,0.3)' }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#00a896" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* PRIVACY tag */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0,168,150,0.1)', border: '1px solid rgba(0,168,150,0.3)', borderRadius: '4px', padding: '4px 12px', marginBottom: '16px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00a896' }} />
            <span style={{ fontSize: '11px', color: '#00c9b1', fontWeight: 700, letterSpacing: '0.12em' }}>DATA PROTECTION</span>
          </div>

          <h1 style={{ fontSize: 'clamp(36px,7vw,58px)', fontWeight: 800, color: '#ffffff', margin: '0 0 14px', lineHeight: 1.08, textShadow: '0 0 60px rgba(0,168,150,0.25)' }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', fontWeight: 400, margin: '0 0 32px', letterSpacing: '0.03em' }}>
            Effective Date: October 2025 &nbsp;·&nbsp; U.S. Financial & Data Protection Regulations
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(0,168,150,0.08)', border: '1px solid rgba(0,168,150,0.3)', borderRadius: '999px', padding: '10px 24px', marginBottom: '48px' }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#00a896" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            <span style={{ fontSize: '13px', color: '#00c9b1', fontWeight: 600 }}>Your Data. Protected. · U.S. Regulatory Compliant</span>
          </div>
        </div>

        {/* stats bar */}
        <div style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'center', gap: 0 }}>
          {[
            { label: 'Encryption', value: 'AES-256' },
            { label: 'Compliance', value: 'GDPR · CCPA' },
            { label: 'Data Retention', value: '7 Years' },
            { label: 'Auth', value: 'MFA Enforced' },
          ].map((s, i) => (
            <div key={s.label} style={{ flex: 1, padding: '18px 12px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#00c9b1', marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 16px 80px' }}>

        {/* OG image card */}

        {/* Intro */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={accentBar} />
            <p style={{ ...pStyle, margin: 0 }}>At WolvCapital, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and protect your information when you use our services, in accordance with U.S. financial and data protection regulations.</p>
          </div>
        </div>

        {/* 1. Information We Collect */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={accentBar} />
            <div style={{ flex: 1 }}>
              <h2 style={h2Style}>1. Information We Collect</h2>
              <h3 style={h3Style}>Personal Data</h3>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                <li style={liStyle}><strong style={{ color: '#ffffff' }}>Identity Information:</strong> Full name, date of birth, nationality, and government-issued identification</li>
                <li style={liStyle}><strong style={{ color: '#ffffff' }}>Contact Information:</strong> Email address, phone number, and residential address</li>
                <li style={liStyle}><strong style={{ color: '#ffffff' }}>Verification Documents:</strong> Passport, driver's license, or other KYC documentation</li>
              </ul>
              <h3 style={h3Style}>Financial Data</h3>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                <li style={liStyle}>Deposit and withdrawal details, including payment methods and amounts</li>
                <li style={liStyle}>Transaction history and investment portfolio data</li>
                <li style={liStyle}>Cryptocurrency wallet addresses</li>
                <li style={liStyle}>Virtual card usage and transaction records</li>
              </ul>
              <h3 style={h3Style}>Technical Data</h3>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                <li style={liStyle}>IP address and geolocation data</li>
                <li style={liStyle}>Device information (type, operating system, browser)</li>
                <li style={liStyle}>Login timestamps and session duration</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. How We Use Your Data */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={accentBar} />
            <div style={{ flex: 1 }}>
              <h2 style={h2Style}>2. How We Use Your Data</h2>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                <li style={liStyle}><strong style={{ color: '#ffffff' }}>Service Provision:</strong> To provide our digital investment platform and process transactions</li>
                <li style={liStyle}><strong style={{ color: '#ffffff' }}>Compliance:</strong> To comply with AML and KYC requirements</li>
                <li style={liStyle}><strong style={{ color: '#ffffff' }}>Security:</strong> To enhance platform security and prevent fraud</li>
                <li style={liStyle}><strong style={{ color: '#ffffff' }}>Communication:</strong> To notify you about account activity and service updates</li>
                <li style={liStyle}><strong style={{ color: '#ffffff' }}>Customer Support:</strong> To respond to your inquiries and provide assistance</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Data Sharing */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={accentBar} />
            <div style={{ flex: 1 }}>
              <h2 style={h2Style}>3. Data Sharing</h2>
              <p style={pStyle}><strong style={{ color: '#ffffff' }}>We do not sell your personal data.</strong> However, we may share your information with service providers and legal authorities in accordance with U.S. financial and data protection regulations:</p>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                <li style={liStyle}><strong style={{ color: '#ffffff' }}>Service Providers:</strong> Payment processors, identity verification partners, cloud hosting providers</li>
                <li style={liStyle}><strong style={{ color: '#ffffff' }}>Legal Authorities:</strong> When required by law or legal process</li>
                <li style={liStyle}><strong style={{ color: '#ffffff' }}>Business Transfers:</strong> In the event of a merger or acquisition</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. Data Security */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={accentBar} />
            <div style={{ flex: 1 }}>
              <h2 style={h2Style}>4. Data Security</h2>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                <li style={liStyle}><strong style={{ color: '#ffffff' }}>Encryption:</strong> End-to-end encryption for data transmission and storage</li>
                <li style={liStyle}><strong style={{ color: '#ffffff' }}>Secure Authentication:</strong> Multi-factor authentication and secure password requirements</li>
                <li style={liStyle}><strong style={{ color: '#ffffff' }}>Manual Review:</strong> Human oversight for all financial transactions</li>
                <li style={liStyle}><strong style={{ color: '#ffffff' }}>Access Controls:</strong> Strict role-based access to data</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5. Data Retention */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={accentBar} />
            <div style={{ flex: 1 }}>
              <h2 style={h2Style}>5. Data Retention</h2>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                <li style={liStyle}><strong style={{ color: '#ffffff' }}>Active Accounts:</strong> Data retained for the duration of your account relationship</li>
                <li style={liStyle}><strong style={{ color: '#ffffff' }}>Closed Accounts:</strong> Personal and financial data retained for 7 years to comply with financial regulations</li>
                <li style={liStyle}><strong style={{ color: '#ffffff' }}>Transaction Records:</strong> Maintained for 7 years from the transaction date</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 6. Your Rights */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={accentBar} />
            <div style={{ flex: 1 }}>
              <h2 style={h2Style}>6. Your Rights</h2>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                <li style={liStyle}><strong style={{ color: '#ffffff' }}>Access:</strong> Request a copy of the personal data we hold about you</li>
                <li style={liStyle}><strong style={{ color: '#ffffff' }}>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li style={liStyle}><strong style={{ color: '#ffffff' }}>Deletion:</strong> Request deletion of your data (subject to legal retention requirements)</li>
                <li style={liStyle}><strong style={{ color: '#ffffff' }}>Objection:</strong> Object to certain types of data processing, such as marketing</li>
              </ul>
              <p style={{ ...pStyle, marginTop: '14px', marginBottom: 0 }}>To exercise these rights, contact us at <a href="mailto:privacy@wolvcapital.com" style={{ color: '#00c9b1', fontWeight: 600, textDecoration: 'underline' }}>privacy@wolvcapital.com</a>.</p>
            </div>
          </div>
        </div>

        {/* 7. Contact */}
        <div style={{ background: 'rgba(0,168,150,0.07)', border: '1px solid rgba(0,168,150,0.25)', borderRadius: '16px', marginBottom: '16px', padding: '28px 28px 24px' }}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={accentBar} />
            <div style={{ flex: 1 }}>
              <h2 style={h2Style}>7. Contact</h2>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                <li style={liStyle}><strong style={{ color: '#ffffff' }}>Email:</strong> <a href="mailto:privacy@wolvcapital.com" style={{ color: '#00c9b1', fontWeight: 600, textDecoration: 'underline' }}>privacy@wolvcapital.com</a></li>
                <li style={liStyle}><strong style={{ color: '#ffffff' }}>General Support:</strong> <a href="mailto:support@mail.wolvcapital.com" style={{ color: '#00c9b1', fontWeight: 600, textDecoration: 'underline' }}>support@mail.wolvcapital.com</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Closing statement */}
        <div style={{ background: 'rgba(0,168,150,0.06)', border: '1px solid rgba(0,168,150,0.2)', borderRadius: '16px', padding: '24px 28px', marginBottom: '24px' }}>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, margin: 0, fontStyle: 'italic' }}>
            WolvCapital is committed to transparency and data protection. If you have any questions about how we handle your personal information, please contact us. All communications are handled in accordance with U.S. financial and data protection regulations.
          </p>
        </div>

        <div style={{ textAlign: 'center', paddingTop: '8px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: '#00a896', textDecoration: 'none' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
