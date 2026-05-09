'use client';


import Link from 'next/link';


const WOLV_CONTRACT = '0xe0167279aef7bf4ad313d261da82e8366822270c';
const BSCSCAN_URL = `https://bscscan.com/token/${WOLV_CONTRACT}`;

export default function WolvTokenPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1e',
      fontFamily: "'Syne', system-ui, sans-serif",
      color: '#fff',
      overflowX: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

        .wolv-hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,168,150,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 80% 60%, rgba(26,58,143,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 30% 50% at 10% 80%, rgba(0,168,150,0.08) 0%, transparent 60%);
          pointer-events: none;
        }
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,168,150,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,168,150,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(1deg); }
          66% { transform: translateY(-6px) rotate(-1deg); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .fade-up-1 { animation-delay: 0.1s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.2s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.3s; opacity: 0; }
        .fade-up-4 { animation-delay: 0.4s; opacity: 0; }
        .fade-up-5 { animation-delay: 0.5s; opacity: 0; }
        .wolv-coin {
          animation: float 6s ease-in-out infinite;
        }
        .pulse-ring {
          animation: pulse-ring 2.5s ease-out infinite;
        }
        .shimmer-text {
          background: linear-gradient(90deg, #00a896 0%, #7dd3c8 40%, #00a896 60%, #1a3a8f 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .feature-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,168,150,0.06) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .feature-card:hover::before { opacity: 1; }
        .feature-card:hover {
          border-color: rgba(0,168,150,0.3);
          transform: translateY(-4px);
          box-shadow: 0 24px 64px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,168,150,0.1);
        }
        .stat-pill {
          background: rgba(0,168,150,0.1);
          border: 1px solid rgba(0,168,150,0.25);
          border-radius: 99px;
          padding: 6px 16px;
          font-size: 13px;
          color: #00a896;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .contract-box {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .copy-btn {
          background: rgba(0,168,150,0.15);
          border: 1px solid rgba(0,168,150,0.3);
          color: #00a896;
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .copy-btn:hover { background: rgba(0,168,150,0.25); }
        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 36px;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
          font-family: 'Syne', system-ui, sans-serif;
        }
        .cta-primary {
          background: linear-gradient(135deg, #00a896, #1a8fc1);
          color: #fff;
          box-shadow: 0 8px 32px rgba(0,168,150,0.3);
        }
        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 48px rgba(0,168,150,0.4);
        }
        .cta-secondary {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.15);
          color: #fff;
        }
        .cta-secondary:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.25);
        }
        .timeline-item {
          display: flex;
          gap: 20px;
          position: relative;
        }
        .timeline-item:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 19px;
          top: 44px;
          bottom: -20px;
          width: 1px;
          background: linear-gradient(to bottom, rgba(0,168,150,0.4), transparent);
        }
        .faq-item {
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 24px 0;
        }
      `}</style>

      {/* Hero Section */}
      <section style={{ position: 'relative', padding: '120px 24px 100px', textAlign: 'center', overflow: 'hidden' }}>
        <div className="wolv-hero-bg" />
        <div className="grid-overlay" />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>
          {/* Live badge */}
          <div className="fade-up fade-up-1" style={{ marginBottom: '32px' }}>
            <span className="stat-pill">
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00a896', display: 'inline-block', boxShadow: '0 0 8px #00a896' }} />
              Live on BNB Smart Chain
            </span>
          </div>

          {/* WOLV Coin Visual */}
          <div className="fade-up fade-up-1" style={{ marginBottom: '40px', position: 'relative', display: 'inline-block' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
              {/* Pulse rings */}
              <div className="pulse-ring" style={{ position: 'absolute', inset: '-20px', borderRadius: '50%', border: '1px solid rgba(0,168,150,0.3)' }} />
              <div className="pulse-ring" style={{ position: 'absolute', inset: '-20px', borderRadius: '50%', border: '1px solid rgba(0,168,150,0.3)', animationDelay: '1.2s' }} />
              {/* Coin */}
              <div className="wolv-coin" style={{
                width: '120px', height: '120px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #00a896 0%, #1a3a8f 50%, #00a896 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 60px rgba(0,168,150,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                position: 'relative', zIndex: 1,
              }}>
                <span style={{ fontSize: '48px', fontWeight: 800, color: '#fff', fontFamily: 'Syne', letterSpacing: '-2px' }}>W</span>
              </div>
            </div>
          </div>

          <h1 className="fade-up fade-up-2" style={{ fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 800, lineHeight: 1.05, marginBottom: '24px', letterSpacing: '-2px' }}>
            <span className="shimmer-text">WOLV Token</span>
            <br />
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>Your Profits. On-Chain.</span>
          </h1>

          <p className="fade-up fade-up-3" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)', maxWidth: '600px', margin: '0 auto 48px', lineHeight: 1.7, fontFamily: 'DM Sans' }}>
            WOLV is the native profit token of WolvCapital. Every dollar you earn as an investor is minted as WOLV — giving you verifiable, blockchain-backed proof of your returns.
          </p>

          <div className="fade-up fade-up-4" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/accounts/signup" className="cta-btn cta-primary">
              Start Earning WOLV →
            </Link>
            <a href={BSCSCAN_URL} target="_blank" rel="noopener noreferrer" className="cta-btn cta-secondary">
              View on BSCScan ↗
            </a>
          </div>
        </div>
      </section>

      {/* Token Stats */}
      <section style={{ padding: '0 24px 80px', maxWidth: '1100px', margin: '0 auto' }}>
        <div className="fade-up fade-up-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {[
            { label: 'Token Name', value: 'Wolv Capital', mono: false },
            { label: 'Symbol', value: 'WOLV', mono: true },
            { label: 'Network', value: 'BNB Smart Chain', mono: false },
            { label: 'Standard', value: 'BEP-20', mono: true },
            { label: 'Decimals', value: '18', mono: true },
            { label: 'Max Supply', value: '1,000,000,000', mono: true },
          ].map((stat) => (
            <div key={stat.label} className="feature-card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px', fontFamily: 'DM Sans' }}>
                {stat.label}
              </div>
              <div style={{
                fontSize: '18px', fontWeight: 700,
                color: stat.mono ? '#00a896' : '#fff',
                fontFamily: stat.mono ? "'DM Mono', monospace" : 'Syne',
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contract Address */}
      <section style={{ padding: '0 24px 80px', maxWidth: '1100px', margin: '0 auto' }}>
        <div className="fade-up fade-up-3">
          <h2 style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', fontFamily: 'DM Sans' }}>
            Verified Contract Address
          </h2>
          <div className="contract-box">
            <div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '6px', fontFamily: 'DM Sans' }}>BNB Smart Chain (BSC)</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '14px', color: '#7dd3c8', wordBreak: 'break-all' }}>
                {WOLV_CONTRACT}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button
                className="copy-btn"
                onClick={() => navigator.clipboard.writeText(WOLV_CONTRACT)}
              >
                Copy
              </button>
              <a href={BSCSCAN_URL} target="_blank" rel="noopener noreferrer" className="copy-btn" style={{ textDecoration: 'none' }}>
                BSCScan ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: '0 24px 100px', maxWidth: '1100px', margin: '0 auto' }}>
        <div className="fade-up fade-up-2" style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>
            How WOLV Works
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px', fontFamily: 'DM Sans', maxWidth: '500px' }}>
            A transparent, on-chain record of every profit you earn.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '640px' }}>
          {[
            {
              step: '01',
              title: 'You invest on WolvCapital',
              desc: 'Choose a plan — Pioneer, Vanguard, Horizon, or Summit VIP — and deposit funds to start earning.',
              color: '#00a896',
            },
            {
              step: '02',
              title: 'Your plan generates returns',
              desc: 'WolvCapital manages your investment and generates structured daily returns over your plan duration.',
              color: '#1a8fc1',
            },
            {
              step: '03',
              title: 'WOLV is minted to your wallet',
              desc: 'When profits are distributed, WOLV tokens are minted directly to your connected wallet — on-chain, verifiable, permanent.',
              color: '#7c3aed',
            },
            {
              step: '04',
              title: 'Your balance is always visible',
              desc: 'Check your WOLV balance anytime in your wallet or on BSCScan. Every token is proof of real earnings.',
              color: '#0ea5e9',
            },
          ].map((item) => (
            <div key={item.step} className="timeline-item">
              <div style={{ flexShrink: 0 }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: `${item.color}20`,
                  border: `1px solid ${item.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'DM Mono', monospace", fontSize: '11px', color: item.color, fontWeight: 600,
                }}>
                  {item.step}
                </div>
              </div>
              <div style={{ paddingTop: '8px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '6px', color: '#fff' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0, fontFamily: 'DM Sans' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why WOLV */}
      <section style={{ padding: '0 24px 100px', maxWidth: '1100px', margin: '0 auto' }}>
        <div className="fade-up fade-up-2" style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>
            Why WOLV Matters
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px', fontFamily: 'DM Sans', maxWidth: '500px' }}>
            Built for transparency, trust, and long-term investor confidence.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {[
            {
              icon: '🔗',
              title: 'Fully On-Chain',
              desc: 'Every WOLV token is recorded on BNB Smart Chain — immutable, public, and verifiable by anyone at any time.',
            },
            {
              icon: '✅',
              title: 'Verified Contract',
              desc: 'The WOLV smart contract is open-source and verified on BSCScan. No hidden code, no surprises.',
            },
            {
              icon: '🔒',
              title: 'Owner-Controlled Minting',
              desc: 'Only WolvCapital can mint WOLV tokens. Supply only grows when real investor profits are distributed.',
            },
            {
              icon: '🛡️',
              title: 'Emergency Pause',
              desc: 'Built-in pause mechanism lets WolvCapital freeze all transfers instantly in case of a security or compliance event.',
            },
            {
              icon: '🔥',
              title: 'Burn on Redemption',
              desc: 'When investors withdraw profits, WOLV is burned — keeping total supply accurate and tied to real earnings.',
            },
            {
              icon: '📊',
              title: '1 Billion Max Supply',
              desc: 'Hard-capped at 1,000,000,000 WOLV. Supply is controlled, predictable, and never diluted beyond this limit.',
            },
          ].map((f) => (
            <div key={f.title} className="feature-card">
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>{f.title}</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0, fontFamily: 'DM Sans' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '0 24px 100px', maxWidth: '760px', margin: '0 auto' }}>
        <div className="fade-up fade-up-2" style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>
            Frequently Asked Questions
          </h2>
        </div>

        {[
          {
            q: 'What is WOLV token?',
            a: 'WOLV is a BEP-20 token on BNB Smart Chain issued by WolvCapital. It represents profit earnings from investment plans on the WolvCapital platform.',
          },
          {
            q: 'How do I earn WOLV?',
            a: 'You earn WOLV by investing in a WolvCapital plan. When your plan generates profits, WolvCapital mints WOLV directly to your connected wallet address.',
          },
          {
            q: 'Does WOLV have real value?',
            a: 'WOLV currently represents proof of profit earnings on the WolvCapital platform. Future utility including trading on DEXes like PancakeSwap is planned.',
          },
          {
            q: 'How do I add WOLV to my wallet?',
            a: 'Log in to your dashboard, connect your MetaMask or compatible wallet, and click "Add WOLV to Wallet". The token will be imported automatically.',
          },
          {
            q: 'Can I verify the WOLV contract?',
            a: `Yes. The WOLV smart contract is publicly verified on BSCScan at ${WOLV_CONTRACT}. You can read the full source code there.`,
          },
          {
            q: 'Is WOLV available on exchanges?',
            a: 'Not yet. WolvCapital plans to add WOLV liquidity on PancakeSwap in the future. Current WOLV is earned exclusively through the WolvCapital investment platform.',
          },
        ].map((faq) => (
          <div key={faq.q} className="faq-item">
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '10px', color: '#fff' }}>{faq.q}</h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: 0, fontFamily: 'DM Sans' }}>{faq.a}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{ padding: '0 24px 120px', textAlign: 'center' }}>
        <div style={{
          maxWidth: '700px', margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(0,168,150,0.1) 0%, rgba(26,58,143,0.1) 100%)',
          border: '1px solid rgba(0,168,150,0.2)',
          borderRadius: '28px', padding: '64px 40px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,168,150,0.12) 0%, transparent 70%)' }} />
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px' }}>
            Ready to earn WOLV?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '16px', marginBottom: '36px', fontFamily: 'DM Sans', lineHeight: 1.6 }}>
            Join thousands of investors earning verifiable, blockchain-backed profits on WolvCapital.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/accounts/signup" className="cta-btn cta-primary">
              Create Account →
            </Link>
            <Link href="/plans" className="cta-btn cta-secondary">
              View Investment Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}