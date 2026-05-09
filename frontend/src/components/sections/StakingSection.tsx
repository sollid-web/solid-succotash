import Link from 'next/link'

const PLANS = [
  { id: 'pioneer',  name: 'Pioneer',    sub: 'Conservative · 90 days',  apy: '8%',  min: '$100',    lockDays: 90,  exitFee: '2.0%', token: 'BNB or BUSD', color: '#3b82f6', colorBg: 'rgba(59,130,246,0.1)' },
  { id: 'vanguard', name: 'Vanguard',   sub: 'Balanced · 150 days',     apy: '12%', min: '$1,000',  lockDays: 150, exitFee: '2.5%', token: 'BNB or BUSD', color: '#00a896', colorBg: 'rgba(0,168,150,0.1)',  featured: true },
  { id: 'horizon',  name: 'Horizon',    sub: 'Active · 180 days',       apy: '18%', min: '$5,000',  lockDays: 180, exitFee: '3.0%', token: 'BNB or BUSD', color: '#8b5cf6', colorBg: 'rgba(139,92,246,0.1)' },
  { id: 'summit',   name: 'Summit VIP', sub: 'Premium · 365 days',      apy: '25%', min: '$15,000', lockDays: 365, exitFee: '3.5%', token: 'BNB or BUSD', color: '#f59e0b', colorBg: 'rgba(245,158,11,0.1)' },
]

export default function StakingSection() {
  return (
    <section id="staking" style={{
      background: '#0a0f1e',
      padding: '80px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(0,168,150,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,168,150,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#00a896' }}>
            WOLV Staking
          </span>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '16px', lineHeight: 1.1 }}>
            Stake BNB or BUSD.<br />Earn WOLV On-Chain.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
            Lock your assets in our audited smart contracts and earn WOLV rewards at up to 25% APY. Every reward is recorded permanently on the BNB blockchain.
          </p>
        </div>

        {/* Chainlink badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0,168,150,0.08)', border: '1px solid rgba(0,168,150,0.2)', borderRadius: '99px', padding: '8px 20px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00a896', display: 'inline-block' }} />
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
              Powered by Chainlink oracles · Audited contracts · BNB Smart Chain
            </span>
          </div>
        </div>

        {/* Plan cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '48px' }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{
              background: plan.featured ? plan.colorBg : 'rgba(255,255,255,0.03)',
              border: `1px solid ${plan.featured ? plan.color : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '20px', padding: '28px',
              position: 'relative', overflow: 'hidden',
              transition: 'all 0.2s',
            }}>
              {plan.featured && (
                <div style={{ position: 'absolute', top: '16px', right: '16px', background: plan.color, color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px', letterSpacing: '0.5px' }}>
                  POPULAR
                </div>
              )}
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: plan.colorBg, border: `1px solid ${plan.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <span style={{ color: plan.color, fontSize: '18px' }}>⬡</span>
              </div>
              <div style={{ color: '#fff', fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{plan.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '20px' }}>{plan.sub}</div>
              <div style={{ color: plan.color, fontSize: '48px', fontWeight: 800, fontFamily: 'monospace', lineHeight: 1, marginBottom: '4px' }}>{plan.apy}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '20px' }}>Annual Percentage Yield</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                {[
                  ['Min Investment', plan.min],
                  ['Lock Period',    `${plan.lockDays} days`],
                  ['Early Exit Fee', plan.exitFee],
                  ['Stake With',     plan.token],
                  ['Rewards In',     'WOLV ($1 each)'],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{l}</span>
                    <span style={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <Link href="/accounts/signup" style={{
                display: 'block', textAlign: 'center', padding: '12px',
                borderRadius: '10px', background: plan.featured ? plan.color : 'rgba(255,255,255,0.06)',
                border: `1px solid ${plan.featured ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                color: '#fff', fontWeight: 700, fontSize: '13px', textDecoration: 'none',
              }}>
                Start Staking →
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px', maxWidth: '600px', margin: '0 auto 24px' }}>
            Staking contracts are publicly verified on BSCScan. Rewards are paid in WOLV tokens at $1 per WOLV. Early exit incurs a fee on principal. Past performance does not guarantee future returns.
          </p>
          <Link href="/dashboard/stake" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', borderRadius: '10px', background: 'linear-gradient(135deg, #00a896, #1a3a8f)', color: '#fff', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
            View All Staking Plans →
          </Link>
        </div>
      </div>
    </section>
  )
}