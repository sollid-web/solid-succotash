import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Legal Disclaimer · WolvCapital Digital Investment Platform',
  description: "Read WolvCapital's official legal disclaimer for secure investment returns, cryptocurrency investment opportunities, and U.S. regulatory compliance.",
  keywords: ['digital investment platform','U.S. fintech company','secure investment returns','cryptocurrency investment','regulated financial platform','legal disclaimer','WolvCapital'],
  openGraph: {
    title: 'WolvCapital Legal Disclaimer · U.S. Digital Investment Platform',
    description: 'Official investment disclaimer and compliance notice by WolvCapital, a U.S. regulated platform.',
    images: [{ url: '/images/legal/wolvcapital-legal-disclaimer.jpg', width: 1200, height: 630, alt: 'WolvCapital legal disclaimer' }],
  },
  robots: { index: true, follow: true },
}

const sections = [
  { title: 'Important Notice', text: 'WolvCapital is a U.S. regulated digital investment platform offering cryptocurrency-based financial services. By accessing or using our services, you acknowledge and agree to the following terms and conditions, which are designed to meet U.S. financial and data protection standards.' },
  { title: 'No Guarantee of Returns', text: 'Investment returns are subject to market conditions and platform performance. Past performance does not guarantee future results. All investments carry inherent risk, and you may receive back less than your original investment amount. WolvCapital does not provide any guarantee of performance.' },
  { title: 'User Responsibility', text: 'Users must ensure the accuracy of their account information and maintain the confidentiality of their credentials. You are solely responsible for compliance with all applicable laws and regulations in your jurisdiction.', bullets: ['Maintaining the security of your account credentials','Providing accurate and up-to-date personal information','Understanding the risks associated with your investments','Complying with applicable laws and regulations in your jurisdiction'] },
  { title: 'Service Availability', text: 'Platform features are subject to availability and approval. Service interruptions may occur due to regulatory requirements, compliance reviews, or operational constraints:', bullets: ['Scheduled maintenance and system upgrades','Technical difficulties or security concerns','Regulatory requirements or legal obligations','Market conditions or operational constraints'] },
  { title: 'Manual Review Process', text: 'All transactions undergo manual off-chain review for security and regulatory compliance purposes. Processing times typically range from 24-72 hours but may vary during high-volume periods or additional compliance checks.' },
  { title: 'Limitation of Liability', text: 'WolvCapital shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform, investment losses, or service interruptions. All services are provided in accordance with applicable U.S. financial regulations.' },
]

export default function LegalDisclaimerPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#060c1a' }}>
      <div style={{ background: 'linear-gradient(160deg,#060c1a 0%,#0d1f4e 40%,#0a3d35 100%)', borderBottom: '1px solid rgba(0,168,150,0.25)', padding: '72px 20px 64px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.07, backgroundImage: 'radial-gradient(circle, #00a896 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(42,82,190,0.35),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', right: '-40px', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,168,150,0.25),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(0,168,150,0.15)', border: '1.5px solid rgba(0,168,150,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 32px rgba(0,168,150,0.2)' }}>
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#00a896" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <h1 style={{ fontSize: 'clamp(34px,7vw,54px)', fontWeight: 800, color: '#ffffff', margin: '0 0 12px', lineHeight: 1.1, textShadow: '0 0 40px rgba(0,168,150,0.3)' }}>Legal Disclaimer</h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', fontWeight: 400, margin: '0 0 28px', letterSpacing: '0.04em' }}>LAST UPDATED: NOVEMBER 2025</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(0,168,150,0.1)', border: '1px solid rgba(0,168,150,0.35)', borderRadius: '999px', padding: '10px 22px' }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#00a896" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            <span style={{ fontSize: '13px', color: '#00c9b1', fontWeight: 600, letterSpacing: '0.02em' }}>Verified &amp; reviewed by legal counsel · U.S. regulatory compliance</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 16px 80px' }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
          <Image src="/images/legal/wolvcapital-legal-disclaimer.jpg" alt="WolvCapital Legal Disclaimer" width={820} height={340} priority style={{ width: '100%', height: '220px', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '12px 20px', margin: 0, fontStyle: 'italic' }}>Signed and reviewed by legal counsel. All platform operations are subject to U.S. regulatory compliance and audit.</p>
        </div>

        {sections.map(({ title, text, bullets }) => (
          <div key={title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', marginBottom: '16px', padding: '28px 28px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{ width: '3px', minHeight: '24px', borderRadius: '4px', background: 'linear-gradient(180deg,#2a52be,#00a896)', flexShrink: 0, marginTop: '4px' }} />
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: '0 0 12px', lineHeight: 1.3 }}>{title}</h2>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, margin: bullets ? '0 0 12px' : 0 }}>{text}</p>
                {bullets && <ul style={{ margin: 0, paddingLeft: '18px' }}>{bullets.map((b) => <li key={b} style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, marginBottom: '6px' }}>{b}</li>)}</ul>}
              </div>
            </div>
          </div>
        ))}

        <div style={{ background: 'rgba(0,168,150,0.07)', border: '1px solid rgba(0,168,150,0.25)', borderRadius: '16px', marginBottom: '16px', padding: '28px 28px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ width: '3px', minHeight: '24px', borderRadius: '4px', background: 'linear-gradient(180deg,#2a52be,#00a896)', flexShrink: 0, marginTop: '4px' }} />
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: '0 0 12px' }}>Contact Information</h2>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, margin: 0 }}>
                If you have any questions about this Legal Disclaimer, please contact us at{" "}
                <a href="mailto:legal@wolvcapital.com" style={{ color: '#00c9b1', fontWeight: 600, textDecoration: 'underline' }}>legal@wolvcapital.com</a>.
                {" "}All communications are handled in accordance with U.S. regulatory requirements.
              </p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', paddingTop: '16px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: '#00a896', textDecoration: 'none' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
