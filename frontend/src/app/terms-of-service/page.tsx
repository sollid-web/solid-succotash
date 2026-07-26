import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — WolvCapital',
  description: 'Read WolvCapital\'s terms of service, user agreement, and platform rules governing digital asset investment services.',
  openGraph: {
    title: 'Terms of Service — WolvCapital',
    description: 'User Agreement & Platform Rules',
    images: ['/og-images/terms-og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service — WolvCapital',
    description: 'User Agreement & Platform Rules',
    images: ['/og-images/terms-og.png'],
  },
}

export default function TermsOfServicePage() {
  const cardStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    marginBottom: '16px',
    padding: '28px 28px 24px',
  }
  const h2Style = { fontSize: '20px', fontWeight: 700, color: '#ffffff', margin: '0 0 14px', lineHeight: 1.3 }
  const h3Style = { fontSize: '16px', fontWeight: 600, color: '#00c9b1', margin: '16px 0 8px' }
  const pStyle = { fontSize: '15px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, margin: '0 0 10px' }
  const liStyle = { fontSize: '15px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, marginBottom: '8px' }
  const accentBar = { width: '3px', minHeight: '24px', borderRadius: '4px', background: 'linear-gradient(180deg,#2a52be,#00a896)', flexShrink: 0, marginTop: '4px' }
  const stats = [
    { value: 'Oct 2025', label: 'Effective Date' },
    { value: 'BEP-20', label: 'Token Standard' },
    { value: '5 Days', label: 'Max Withdrawal' },
    { value: 'U.S. Law', label: 'Governed By' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#060c1a' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg,#060c1a 0%,#0d1f4e 45%,#0a3d35 100%)', borderBottom: '1px solid rgba(0,168,150,0.25)', padding: '80px 20px 0', position: 'relative', overflow: 'hidden', minHeight: '420px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.07, backgroundImage: 'radial-gradient(circle, #00a896 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,transparent,#00a896,transparent)', opacity: 0.6 }} />
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(42,82,190,0.4),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '0', right: '-60px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,168,150,0.3),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '24px', left: '24px', width: '28px', height: '28px', borderTop: '2px solid rgba(0,168,150,0.5)', borderLeft: '2px solid rgba(0,168,150,0.5)' }} />
        <div style={{ position: 'absolute', top: '24px', right: '24px', width: '28px', height: '28px', borderTop: '2px solid rgba(0,168,150,0.5)', borderRight: '2px solid rgba(0,168,150,0.5)' }} />

        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, flex: 1 }}>
          <div style={{ position: 'relative', width: '88px', height: '88px', margin: '0 auto 28px' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(0,168,150,0.3)' }} />
            <div style={{ position: 'absolute', inset: '8px', borderRadius: '50%', border: '1px solid rgba(0,168,150,0.5)' }} />
            <div style={{ position: 'absolute', inset: '16px', borderRadius: '50%', background: 'rgba(0,168,150,0.15)', border: '1.5px solid rgba(0,168,150,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(0,168,150,0.3)' }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#00a896" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0,168,150,0.1)', border: '1px solid rgba(0,168,150,0.3)', borderRadius: '4px', padding: '4px 12px', marginBottom: '16px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00a896' }} />
            <span style={{ fontSize: '11px', color: '#00c9b1', fontWeight: 700, letterSpacing: '0.12em' }}>LEGAL AGREEMENT</span>
          </div>

          <h1 style={{ fontSize: 'clamp(36px,7vw,58px)', fontWeight: 800, color: '#ffffff', margin: '0 0 14px', lineHeight: 1.08, textShadow: '0 0 60px rgba(0,168,150,0.25)' }}>Terms of Service</h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', fontWeight: 400, margin: '0 0 32px' }}>
            Effective Date: October 2025 · Addendum Effective: February 2, 2026
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(0,168,150,0.08)', border: '1px solid rgba(0,168,150,0.3)', borderRadius: '999px', padding: '10px 24px', marginBottom: '48px' }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#00a896" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            <span style={{ fontSize: '13px', color: '#00c9b1', fontWeight: 600 }}>Binding agreement · Read fully before using the platform</span>
          </div>
        </div>

        {/* stats bar */}
        <div style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'center' }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{ flex: 1, padding: '18px 12px', textAlign: 'center', borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#00c9b1', marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 16px 80px' }}>

        {/* Intro */}
        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={accentBar} />
            <p style={{ ...pStyle, margin: 0 }}>By accessing or using WolvCapital, you agree to comply with these Terms of Service. If you do not agree with any part of these terms, do not use the platform. These terms constitute a legally binding agreement between you and WolvCapital, Inc.</p>
          </div>
        </div>

        {/* 1. Acceptance */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={accentBar} />
            <div style={{ flex: 1 }}>
              <h2 style={h2Style}>1. Acceptance of Terms</h2>
              <p style={pStyle}>These terms constitute a legally binding agreement between you and WolvCapital. By registering, depositing funds, or using platform features, you accept all terms and policies in full.</p>
            </div>
          </div>
        </div>

        {/* 2. Eligibility */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={accentBar} />
            <div style={{ flex: 1 }}>
              <h2 style={h2Style}>2. Eligibility</h2>
              <p style={{ ...pStyle }}>You must meet all of the following criteria to use the platform:</p>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                {['At least 18 years of age','Legally permitted to invest in digital assets in your jurisdiction','Capable of entering a binding legal contract','Able to pass KYC/AML verification'].map(b => <li key={b} style={liStyle}>{b}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Investment Participation */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={accentBar} />
            <div style={{ flex: 1 }}>
              <h2 style={h2Style}>3. Investment Participation</h2>
              <p style={pStyle}>All investment plans are subject to availability and compliance review. WolvCapital operates four staking tiers on BNB Smart Chain — Pioneer (8% APY), Vanguard (12% APY), Horizon (18% APY), and Summit VIP (25% APY). WolvCapital reserves the right to:</p>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                {['Modify investment plans and APY rates','Suspend or terminate platform access at any time','Require additional KYC/AML verification for withdrawals','Adjust reward pool allocations based on on-chain conditions'].map(b => <li key={b} style={liStyle}>{b}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* 4. Withdrawals */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={accentBar} />
            <div style={{ flex: 1 }}>
              <h2 style={h2Style}>4. Withdrawals & Payouts</h2>
              <p style={pStyle}>Withdrawal requests are processed manually and may require up to 5 business days. WOLV token rewards are distributed on-chain via the BNB Smart Chain Reward Pool contract. Additional compliance verification may be requested before disbursement. Investment plan maturity indicates eligibility for withdrawal review — not immediate disbursement.</p>
            </div>
          </div>
        </div>

        {/* 5. Addendum */}
        <div style={{ ...cardStyle, border: '1px solid rgba(0,168,150,0.2)' }}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={{ ...accentBar, background: 'linear-gradient(180deg,#00a896,#2a52be)' }} />
            <div style={{ flex: 1 }}>
              <h2 style={h2Style}>5. Terms & Conditions Addendum</h2>
              <p style={{ ...pStyle, color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Addendum Effective Date: February 2, 2026 · Capital Participation, Compounding & Withdrawals</p>
              <ol style={{ margin: '12px 0 0', paddingLeft: '20px' }}>
                {[
                  { title: 'Nature of the Platform', text: 'Wolv Capital operates as a crypto trading and portfolio management platform. Returns distributed to investors are derived from active on-chain trading activities and portfolio deployment. The platform does not guarantee fixed, instant, or automated payouts.' },
                  { title: 'Capital Participation & Compounding', text: 'Investors may choose to compound profits, make additional capital deposits, or maintain their current position. Compounding alone does not independently expand portfolio capacity. Accounts with limited capital participation may experience adjusted growth rates and extended liquidity timelines.' },
                  { title: 'Withdrawals & Maturity', text: 'Investment plan maturity indicates eligibility for withdrawal review, not immediate disbursement. All withdrawals are processed according to operational liquidity availability, portfolio cycle completion, and internal risk management protocols.' },
                  { title: 'Liquidity Management', text: 'Wolv Capital reserves the right to schedule withdrawals to protect platform stability, ensure fair execution across investors, and maintain sustainable trading operations.' },
                  { title: 'No Obligation to Reinvest', text: 'Investors are under no obligation to make additional deposits. Participation decisions remain voluntary. Continued participation constitutes acceptance of the platform\'s operational model and timelines.' },
                ].map((item, i) => (
                  <li key={item.title} style={{ ...liStyle, marginBottom: '16px' }}>
                    <strong style={{ color: '#ffffff', display: 'block', marginBottom: '4px' }}>{item.title}</strong>
                    {item.text}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* 6. Investment Terms & Risk */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={accentBar} />
            <div style={{ flex: 1 }}>
              <h2 style={h2Style}>6. Investment Terms & Risk Disclosures</h2>
              {[
                { title: 'Nature of Returns', text: 'WolvCapital provides access to investment opportunities with projected returns based on historical data, current market analysis, and our strategies. All returns are target ranges and are subject to change. Actual returns may differ and are not guaranteed. Past performance does not indicate future results.' },
                { title: 'Market Risk Disclosure', text: 'Investing involves risk, including the potential loss of principal. Returns are subject to market conditions, economic factors, and other variables beyond our control. Market fluctuations can impact the value of your investments and overall account equity.' },
                { title: 'Position Management', text: 'To protect client accounts and maintain platform integrity, WolvCapital may adjust or liquidate positions automatically in response to market movements or risk thresholds. These actions are taken to manage risk and may occur without prior notice.' },
                { title: 'Margin and Account Risk', text: 'Investments may be subject to margin requirements. If your account falls below required thresholds, positions may be reduced or closed automatically. You are not obligated to deposit additional funds in the event of a margin call or account shortfall.' },
                { title: 'Client Control & Options', text: 'You retain control over your investment decisions within the options provided by the platform. You may review, modify, or close your positions as permitted by platform features and policies.' },
                { title: 'Risk Acknowledgment', text: 'By investing with WolvCapital, you acknowledge that all investments carry risk, returns are not guaranteed, and you may lose some or all of your invested capital. You agree to review all disclosures and seek independent advice if needed.' },
                { title: 'Limitation of Liability', text: 'WolvCapital, its affiliates, and partners are not liable for any losses, damages, or expenses arising from investment activities, market movements, or platform operations. Our liability is limited to the maximum extent permitted by applicable U.S. law.' },
              ].map(({ title, text }) => (
                <div key={title} style={{ marginBottom: '18px' }}>
                  <h3 style={h3Style}>{title}</h3>
                  <p style={{ ...pStyle, margin: 0 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7. Account Security */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={accentBar} />
            <div style={{ flex: 1 }}>
              <h2 style={h2Style}>7. Account Security</h2>
              <p style={{ ...pStyle, margin: 0 }}>You are responsible for protecting your login credentials and account access. Enable two-factor authentication where available. Notify support immediately at <a href="mailto:support@mail.wolvcapital.com" style={{ color: '#00c9b1', textDecoration: 'underline' }}>support@mail.wolvcapital.com</a> if unauthorized activity is suspected.</p>
            </div>
          </div>
        </div>

        {/* 8. Prohibited Activities */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={accentBar} />
            <div style={{ flex: 1 }}>
              <h2 style={h2Style}>8. Prohibited Activities</h2>
              <p style={pStyle}>The following actions are strictly prohibited and may result in immediate account termination:</p>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                {['Using the platform for money laundering, fraud, or terrorist financing','Creating multiple accounts to circumvent platform rules','Attempting to exploit system vulnerabilities or smart contract weaknesses','Providing false or misleading information during KYC verification','Unauthorized scraping, copying, or redistribution of platform data'].map(b => <li key={b} style={liStyle}>{b}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* 9. Changes to Terms */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={accentBar} />
            <div style={{ flex: 1 }}>
              <h2 style={h2Style}>9. Changes to Terms</h2>
              <p style={{ ...pStyle, margin: 0 }}>WolvCapital may update these terms at any time. We will notify users of material changes via email or platform notification. Continued use of the platform after changes are published constitutes full acceptance of the revised terms.</p>
            </div>
          </div>
        </div>

        {/* 10. Governing Law */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={accentBar} />
            <div style={{ flex: 1 }}>
              <h2 style={h2Style}>10. Governing Law & Jurisdiction</h2>
              <p style={{ ...pStyle, margin: 0 }}>These Terms of Service are governed by the laws of the United States of America. Any disputes arising from your use of WolvCapital shall be subject to the exclusive jurisdiction of U.S. federal and state courts. WolvCapital operates in compliance with FinCEN MSB registration requirements, SEC guidance, and applicable AML/KYC regulations.</p>
            </div>
          </div>
        </div>

        {/* Contact card */}
        <div style={{ background: 'rgba(0,168,150,0.07)', border: '1px solid rgba(0,168,150,0.25)', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#00a896" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.75, margin: 0 }}>
                For questions about these terms, contact us at{" "}
                <a href="mailto:support@mail.wolvcapital.com" style={{ color: '#00c9b1', fontWeight: 600, textDecoration: 'underline' }}>support@mail.wolvcapital.com</a>
                {" "}or visit our <Link href="/legal" style={{ color: '#00c9b1', fontWeight: 600, textDecoration: 'underline' }}>Legal & Compliance</Link> page.
              </p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', paddingTop: '8px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: '#00a896', textDecoration: 'none' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
