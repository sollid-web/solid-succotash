'use client';

import Link from 'next/link';
import { useState } from 'react';

// ── New verified contracts ────────────────────────────────────────────────────
const WOLV_CONTRACT    = '0xe0167279aef7bf4ad313d261da82e8366822270c';
const POOL_CONTRACT    = '0xb233cf74b14abf9d9702d585c540030125599579';
const STAKING_CONTRACT = '0x4b62efee5695ed55cd362a0b818f4c5f9694322b';
const BSCSCAN_URL      = `https://bscscan.com/token/${WOLV_CONTRACT}`;

// ── Brand colours ─────────────────────────────────────────────────────────────
const B = {
  blue:       '#2A52BE',
  blueDark:   '#1E3A8A',
  blueLight:  'rgba(42,82,190,0.12)',
  blueBorder: 'rgba(42,82,190,0.3)',
  navy:       '#0F172A',
  white:      '#fff',
  muted:      'rgba(255,255,255,0.45)',
  border:     'rgba(255,255,255,0.08)',
  card:       'rgba(255,255,255,0.04)',
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ background: B.blueLight, border: `1px solid ${B.blueBorder}`, color: B.blue, borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}

export default function WolvTokenPage() {
  return (
    <div style={{ minHeight: '100vh', background: B.navy, fontFamily: "'Syne', system-ui, sans-serif", color: B.white, overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-12px) rotate(1deg)} 66%{transform:translateY(-6px) rotate(-1deg)} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.8);opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .fade-up{animation:fadeUp .7s ease forwards}
        .f1{animation-delay:.1s;opacity:0} .f2{animation-delay:.2s;opacity:0} .f3{animation-delay:.3s;opacity:0} .f4{animation-delay:.4s;opacity:0}
        .wolv-coin{animation:float 6s ease-in-out infinite}
        .pulse-ring{animation:pulse-ring 2.5s ease-out infinite}
        .shimmer-text{background:linear-gradient(90deg,${B.blue} 0%,#7b9ef0 40%,${B.blue} 60%,${B.blueDark} 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 4s linear infinite}
        .feature-card{background:linear-gradient(135deg,rgba(255,255,255,0.05) 0%,rgba(255,255,255,0.02) 100%);border:1px solid ${B.border};border-radius:20px;padding:28px;transition:all .3s;position:relative;overflow:hidden}
        .feature-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,${B.blueLight} 0%,transparent 60%);opacity:0;transition:opacity .3s}
        .feature-card:hover::before{opacity:1}
        .feature-card:hover{border-color:${B.blueBorder};transform:translateY(-4px);box-shadow:0 24px 64px rgba(0,0,0,.3),0 0 0 1px rgba(42,82,190,.1)}
        .plan-card{background:rgba(255,255,255,0.04);border:1px solid ${B.border};border-radius:18px;padding:24px;transition:all .25s}
        .plan-card:hover{border-color:${B.blueBorder};transform:translateY(-3px);box-shadow:0 20px 50px rgba(0,0,0,.25)}
        .plan-card.featured{background:${B.blueLight};border-color:${B.blueBorder}}
        .faq-item{border-bottom:1px solid rgba(255,255,255,0.07);padding:24px 0}
        .timeline-item{display:flex;gap:20px;position:relative}
        .timeline-item:not(:last-child)::after{content:'';position:absolute;left:19px;top:44px;bottom:-20px;width:1px;background:linear-gradient(to bottom,${B.blueBorder},transparent)}
        .cta-btn{display:inline-flex;align-items:center;gap:8px;padding:16px 36px;border-radius:14px;font-size:16px;font-weight:700;text-decoration:none;transition:all .2s;font-family:'Syne',system-ui,sans-serif}
        .cta-primary{background:linear-gradient(135deg,${B.blue},${B.blueDark});color:#fff;box-shadow:0 8px 32px rgba(42,82,190,.35)}
        .cta-primary:hover{transform:translateY(-2px);box-shadow:0 16px 48px rgba(42,82,190,.45)}
        .cta-secondary{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);color:#fff}
        .cta-secondary:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.25)}
        .contract-box{background:rgba(255,255,255,0.03);border:1px solid ${B.border};border-radius:14px;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
      `}</style>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', padding: '120px 24px 100px', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% -10%, rgba(42,82,190,0.2) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 60%, rgba(42,82,190,0.1) 0%, transparent 60%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(42,82,190,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(42,82,190,0.04) 1px, transparent 1px)`, backgroundSize: '60px 60px', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>
          <div className="fade-up f1" style={{ marginBottom: '32px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: B.blueLight, border: `1px solid ${B.blueBorder}`, borderRadius: '99px', padding: '6px 16px', fontSize: '12px', color: B.blue, fontWeight: 600, letterSpacing: '0.5px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: B.blue, display: 'inline-block', boxShadow: `0 0 8px ${B.blue}` }} />
              Live on BNB Smart Chain · Verified on BSCScan
            </span>
          </div>

          <div className="fade-up f1" style={{ marginBottom: '40px' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
              <div className="pulse-ring" style={{ position: 'absolute', inset: '-20px', borderRadius: '50%', border: `1px solid ${B.blueBorder}` }} />
              <div className="pulse-ring" style={{ position: 'absolute', inset: '-20px', borderRadius: '50%', border: `1px solid ${B.blueBorder}`, animationDelay: '1.2s' }} />
              <div className="wolv-coin" style={{ width: '120px', height: '120px', borderRadius: '50%', background: `linear-gradient(135deg, ${B.blue} 0%, ${B.blueDark} 60%, #1a3a8f 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 60px rgba(42,82,190,0.4), inset 0 1px 0 rgba(255,255,255,0.2)`, position: 'relative', zIndex: 1 }}>
                <span style={{ fontSize: '48px', fontWeight: 800, color: '#fff', letterSpacing: '-2px' }}>W</span>
              </div>
            </div>
          </div>

          <h1 className="fade-up f2" style={{ fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 800, lineHeight: 1.05, marginBottom: '24px', letterSpacing: '-2px' }}>
            <span className="shimmer-text">WOLV Token</span><br />
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>Stake. Earn. Verified.</span>
          </h1>

          <p className="fade-up f3" style={{ fontSize: '18px', color: B.muted, maxWidth: '620px', margin: '0 auto 48px', lineHeight: 1.7, fontFamily: 'DM Sans' }}>
            WOLV is the native profit token of WolvCapital. Stake BNB or BUSD to earn WOLV rewards on-chain — or receive WOLV as verifiable proof of your investment returns, permanently recorded on the BNB blockchain.
          </p>

          <div className="fade-up f4" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard/stake" className="cta-btn cta-primary">Start Staking →</Link>
            <a href={BSCSCAN_URL} target="_blank" rel="noopener noreferrer" className="cta-btn cta-secondary">View on BSCScan ↗</a>
          </div>
        </div>
      </section>

      {/* ── Token Stats ── */}
      <section style={{ padding: '0 24px 80px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px' }}>
          {[
            { label: 'Token Name', value: 'Wolv Capital', mono: false },
            { label: 'Symbol',     value: 'WOLV',         mono: true  },
            { label: 'Network',    value: 'BNB Smart Chain', mono: false },
            { label: 'Standard',   value: 'BEP-20',       mono: true  },
            { label: 'Max Supply', value: '1,000,000,000', mono: true  },
            { label: '1 WOLV =',   value: '$1.00 USD',    mono: true  },
          ].map(s => (
            <div key={s.label} className="feature-card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px', fontFamily: 'DM Sans' }}>{s.label}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: s.mono ? B.blue : B.white, fontFamily: s.mono ? "'DM Mono', monospace" : 'Syne' }}>{s.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Staking Plans ── */}
      <section style={{ padding: '0 24px 100px', maxWidth: '1100px', margin: '0 auto' }}>
        <div className="fade-up f2" style={{ marginBottom: '48px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: B.blue, display: 'block', marginBottom: '12px' }}>WOLV Staking</span>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>Stake BNB or BUSD. Earn WOLV.</h2>
          <p style={{ color: B.muted, fontSize: '16px', fontFamily: 'DM Sans', maxWidth: '520px', lineHeight: 1.7 }}>
            Lock your assets in our audited smart contracts and earn WOLV rewards at up to 25% APY. Powered by Chainlink price oracles.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { name: 'Pioneer',    sub: '90 days',  apy: '8%',  min: '$100',    exitFee: '2.0%', featured: false },
            { name: 'Vanguard',   sub: '150 days', apy: '12%', min: '$1,000',  exitFee: '2.5%', featured: true  },
            { name: 'Horizon',    sub: '180 days', apy: '18%', min: '$5,000',  exitFee: '3.0%', featured: false },
            { name: 'Summit VIP', sub: '365 days', apy: '25%', min: '$15,000', exitFee: '3.5%', featured: false },
          ].map(p => (
            <div key={p.name} className={`plan-card${p.featured ? ' featured' : ''}`} style={{ position: 'relative' }}>
              {p.featured && <div style={{ position: 'absolute', top: '14px', right: '14px', background: B.blue, color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px' }}>POPULAR</div>}
              <div style={{ color: B.white, fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{p.name}</div>
              <div style={{ color: B.muted, fontSize: '12px', marginBottom: '16px', fontFamily: 'DM Sans' }}>Conservative · {p.sub}</div>
              <div style={{ color: B.blue, fontSize: '44px', fontWeight: 800, fontFamily: "'DM Mono', monospace", lineHeight: 1, marginBottom: '4px' }}>{p.apy}</div>
              <div style={{ color: B.muted, fontSize: '12px', marginBottom: '20px', fontFamily: 'DM Sans' }}>Annual Percentage Yield</div>
              {[['Min Investment', p.min], ['Lock Period', p.sub], ['Exit Fee', p.exitFee], ['Stake With', 'BNB or BUSD'], ['Rewards In', 'WOLV ($1 each)']].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: B.muted, fontSize: '12px', fontFamily: 'DM Sans' }}>{l}</span>
                  <span style={{ color: B.white, fontSize: '12px', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              <Link href="/dashboard/stake" style={{ display: 'block', textAlign: 'center', marginTop: '20px', padding: '11px', borderRadius: '10px', background: p.featured ? B.blue : 'rgba(255,255,255,0.07)', border: `1px solid ${p.featured ? 'transparent' : 'rgba(255,255,255,0.1)'}`, color: '#fff', fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}>
                Start Staking →
              </Link>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/dashboard/stake" className="cta-btn cta-primary">Open Staking Dashboard →</Link>
        </div>
      </section>

      {/* ── How WOLV Works ── */}
      <section style={{ padding: '0 24px 100px', maxWidth: '1100px', margin: '0 auto' }}>
        <div className="fade-up f2" style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>How WOLV Works</h2>
          <p style={{ color: B.muted, fontSize: '16px', fontFamily: 'DM Sans', maxWidth: '500px' }}>Two paths to earning WOLV — both fully on-chain.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '640px' }}>
          {[
            { step: '01', title: 'Choose your path',             desc: 'Stake BNB or BUSD directly in our smart contracts, or invest in a managed portfolio plan (Pioneer, Vanguard, Horizon, Summit VIP).', color: B.blue },
            { step: '02', title: 'Your position earns returns',  desc: 'Staking earns WOLV at 8–25% APY based on your plan. Investment plans generate managed returns distributed as WOLV.', color: B.blue },
            { step: '03', title: 'WOLV sent to your wallet',     desc: 'When you claim, WOLV tokens are transferred from the on-chain reward pool directly to your connected wallet — permanent proof of earnings.', color: B.blue },
            { step: '04', title: 'Verify anytime on BSCScan',    desc: 'Every transaction is publicly visible. Check your WOLV balance on BSCScan or in any compatible wallet.', color: B.blue },
          ].map(item => (
            <div key={item.step} className="timeline-item">
              <div style={{ flexShrink: 0 }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: B.blueLight, border: `1px solid ${B.blueBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Mono', monospace", fontSize: '11px', color: B.blue, fontWeight: 600 }}>{item.step}</div>
              </div>
              <div style={{ paddingTop: '8px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '6px', color: B.white }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: B.muted, lineHeight: 1.6, margin: 0, fontFamily: 'DM Sans' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Verified Contracts ── */}
      <section style={{ padding: '0 24px 100px', maxWidth: '1100px', margin: '0 auto' }}>
        <div className="fade-up f2" style={{ marginBottom: '32px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: B.blue, display: 'block', marginBottom: '12px' }}>Transparency</span>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>Verified Smart Contracts</h2>
          <p style={{ color: B.muted, fontSize: '16px', fontFamily: 'DM Sans', maxWidth: '520px', lineHeight: 1.7 }}>All three contracts are publicly verified on BSCScan. Read the source code yourself — no trust required.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {[
            { name: 'WOLV Token',       address: WOLV_CONTRACT,    desc: 'Fixed supply · No mint after deploy · BEP-20',    url: `https://bscscan.com/address/${WOLV_CONTRACT}#code` },
            { name: 'Reward Pool',      address: POOL_CONTRACT,    desc: '48hr timelock · Treasury funded · Claimable',     url: `https://bscscan.com/address/${POOL_CONTRACT}#code` },
            { name: 'Staking Contract', address: STAKING_CONTRACT, desc: 'BNB & BUSD staking · Chainlink oracle · Verified', url: `https://bscscan.com/address/${STAKING_CONTRACT}#code` },
          ].map(c => (
            <div key={c.name} className="contract-box">
              <div>
                <div style={{ color: B.white, fontWeight: 600, fontSize: '14px', marginBottom: '3px' }}>{c.name}</div>
                <div style={{ color: B.muted, fontSize: '12px', marginBottom: '6px', fontFamily: 'DM Sans' }}>{c.desc}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', color: B.blue }}>{c.address}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <CopyButton text={c.address} />
                <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ background: B.blueLight, border: `1px solid ${B.blueBorder}`, color: B.white, borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>BSCScan ↗</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why WOLV ── */}
      <section style={{ padding: '0 24px 100px', maxWidth: '1100px', margin: '0 auto' }}>
        <div className="fade-up f2" style={{ marginBottom: '48px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: B.blue, display: 'block', marginBottom: '12px' }}>Why WOLV</span>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-1px' }}>Built for Trust & Transparency</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {[
            { icon: '🔗', title: 'Fully On-Chain',        desc: 'Every WOLV token is recorded on BNB Smart Chain — immutable, public, and verifiable by anyone at any time.' },
            { icon: '✅', title: 'Verified Contracts',    desc: 'All smart contracts are open-source and verified on BSCScan. No hidden code, no surprises.' },
            { icon: '⚡', title: 'Chainlink Price Feeds', desc: 'Staking uses Chainlink oracles for tamper-proof, real-time BNB/USD pricing — no manual manipulation.' },
            { icon: '🔒', title: 'Fixed Supply',          desc: 'Hard-capped at 1 billion WOLV. Supply is controlled, predictable, and never diluted beyond this limit.' },
            { icon: '🛡️', title: '48hr Timelock',        desc: 'The reward pool has a 48-hour timelock — no funds can be moved without public on-chain notice.' },
            { icon: '📊', title: 'Public Reward Rate',    desc: 'The formula for calculating rewards is written in the smart contract — anyone can verify their expected returns.' },
          ].map(f => (
            <div key={f.title} className="feature-card">
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px', color: B.white }}>{f.title}</h3>
              <p style={{ fontSize: '14px', color: B.muted, lineHeight: 1.6, margin: 0, fontFamily: 'DM Sans' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '0 24px 100px', maxWidth: '760px', margin: '0 auto' }}>
        <div className="fade-up f2" style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-1px' }}>Frequently Asked Questions</h2>
        </div>
        {[
          { q: 'What is WOLV token?',          a: 'WOLV is a BEP-20 token on BNB Smart Chain issued by WolvCapital. It represents profit earnings — earned by staking BNB/BUSD or investing in a WolvCapital plan.' },
          { q: 'How do I earn WOLV?',           a: 'Two ways: stake BNB or BUSD in our smart contracts and claim WOLV rewards after your lock period, or invest in a managed plan and receive WOLV as proof of profit distributions.' },
          { q: 'What is the reward pool?',      a: `The reward pool contract (${POOL_CONTRACT}) holds WOLV tokens funded by the treasury. It releases WOLV to investors when they claim rewards — fully visible on BSCScan.` },
          { q: 'Is WOLV supply fixed?',         a: '1 billion WOLV was minted at deployment — no more can ever be created. The supply is hard-capped in the contract code, which anyone can verify on BSCScan.' },
          { q: 'What is the 48hr timelock?',   a: 'Any withdrawal from the reward pool must be publicly queued 48 hours before it executes. This protects investors — they can see any fund movement before it happens.' },
          { q: 'Can I verify the contracts?',   a: `Yes. All three contracts are verified on BSCScan: WOLV Token (${WOLV_CONTRACT}), Reward Pool (${POOL_CONTRACT}), Staking Contract (${STAKING_CONTRACT}).` },
          { q: 'Is WOLV on exchanges?',         a: 'Not yet. WolvCapital plans to add WOLV liquidity on PancakeSwap in the future. Currently WOLV is earned through staking or investment plans on the platform.' },
        ].map(faq => (
          <div key={faq.q} className="faq-item">
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '10px', color: B.white }}>{faq.q}</h3>
            <p style={{ fontSize: '14px', color: B.muted, lineHeight: 1.7, margin: 0, fontFamily: 'DM Sans' }}>{faq.a}</p>
          </div>
        ))}
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '0 24px 120px', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', background: `linear-gradient(135deg, ${B.blueLight} 0%, rgba(30,58,138,0.15) 100%)`, border: `1px solid ${B.blueBorder}`, borderRadius: '28px', padding: '64px 40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: `radial-gradient(circle, rgba(42,82,190,0.15) 0%, transparent 70%)` }} />
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px' }}>Ready to earn WOLV?</h2>
          <p style={{ color: B.muted, fontSize: '16px', marginBottom: '36px', fontFamily: 'DM Sans', lineHeight: 1.6 }}>
            Stake BNB or BUSD in our verified smart contracts and earn WOLV at up to 25% APY — fully on-chain.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard/stake" className="cta-btn cta-primary">Start Staking →</Link>
            <Link href="/plans" className="cta-btn cta-secondary">View Investment Plans</Link>
          </div>
        </div>
      </section>
    </div>
  );
}