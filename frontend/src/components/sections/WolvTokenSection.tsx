import Link from 'next/link'

const WOLV_CONTRACT = '0xe0167279aef7bf4ad313d261da82e8366822270c'
const POOL_CONTRACT = '0xb233cf74b14abf9d9702d585c540030125599579'
const STAKING_CONTRACT = '0x4b62efee5695ed55cd362a0b818f4c5f9694322b'

export default function WolvTokenSection() {
  return (
    <section id="wolv-token" style={{
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0f1a35 100%)',
      padding: '80px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,168,150,0.12) 0%, transparent 70%)' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(0,168,150,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,168,150,0.04) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0,168,150,0.12)', border: '1px solid rgba(0,168,150,0.3)', borderRadius: '99px', padding: '6px 16px', fontSize: '12px', color: '#00a896', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '20px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00a896', display: 'inline-block' }} />
            LIVE ON BNB CHAIN
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '16px', lineHeight: 1.1 }}>
            WOLV — The Proof of Your Returns
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
            Every profit distributed on WolvCapital is recorded permanently on the BNB blockchain. Stake BNB or BUSD, earn WOLV rewards — verified by anyone, anywhere, anytime.
          </p>
        </div>

        {/* Token stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '48px' }}>
          {[
            { label: 'Token Name',    value: 'Wolv Capital' },
            { label: 'Symbol',        value: 'WOLV' },
            { label: 'Network',       value: 'BNB Smart Chain' },
            { label: 'Max Supply',    value: '1,000,000,000' },
            { label: '1 WOLV =',      value: '$1.00 USD' },
            { label: 'Reward Pool',   value: '1,000,000 WOLV' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{s.label}</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#00a896', fontFamily: 'monospace' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Staking APY cards */}
        <div style={{ marginBottom: '48px' }}>
          <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, textAlign: 'center', marginBottom: '24px' }}>Staking Plans — Earn WOLV Rewards</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {[
              { name: 'Pioneer',    apy: '8%',  days: '90',  min: '$100',    color: '#3b82f6' },
              { name: 'Vanguard',   apy: '12%', days: '150', min: '$1,000',  color: '#00a896' },
              { name: 'Horizon',    apy: '18%', days: '180', min: '$5,000',  color: '#8b5cf6' },
              { name: 'Summit VIP', apy: '25%', days: '365', min: '$15,000', color: '#f59e0b' },
            ].map(p => (
              <div key={p.name} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${p.color}40`, borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{p.name}</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: p.color, fontFamily: 'monospace', lineHeight: 1 }}>{p.apy}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>APY · {p.days} days · Min {p.min}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified contracts */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,168,150,0.2)', borderRadius: '16px', padding: '28px', marginBottom: '32px' }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Verified Smart Contracts</div>
          {[
            { name: 'WOLV Token',       address: WOLV_CONTRACT },
            { name: 'Reward Pool',      address: POOL_CONTRACT },
            { name: 'Staking Contract', address: STAKING_CONTRACT },
          ].map(c => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 500 }}>{c.name}</span>
              <a href={`https://bscscan.com/address/${c.address}#code`} target="_blank" rel="noopener noreferrer" style={{ color: '#00a896', fontSize: '12px', fontFamily: 'monospace' }}>
                {c.address.slice(0, 10)}...{c.address.slice(-8)} ↗
              </a>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/dashboard/stake" style={{ padding: '14px 32px', borderRadius: '10px', background: 'linear-gradient(135deg, #00a896, #1a3a8f)', color: '#fff', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
            Start Staking →
          </Link>
          <Link href="/wolv-token" style={{ padding: '14px 32px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>
            Learn About WOLV
          </Link>
        </div>
      </div>
    </section>
  )
}