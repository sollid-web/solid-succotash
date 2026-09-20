'use client'

export default function WolvChartSection() {
  const CONTRACT = '0xe0167279aef7bf4ad313d261da82e8366822270c'

  return (
    <section style={{
      background: '#080d1a',
      padding: '64px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(0,168,150,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,168,150,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#00a896' }}>
            LIVE ON DEX
          </span>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '12px', lineHeight: 1.1 }}>
            WOLV is Now Tradeable
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', maxWidth: '500px', margin: '0 auto' }}>
            WOLV/BNB is live on PancakeSwap V2. Buy, sell, and track price in real time.
          </p>
        </div>

        {/* Token info grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '32px' }}>
          {[
            { label: 'Network', value: 'BNB Smart Chain' },
            { label: 'DEX', value: 'PancakeSwap V2' },
            { label: 'Holders', value: '231+' },
            { label: 'Contract', value: 'Verified ✓' },
            { label: 'Max Supply', value: '1,000,000,000' },
            { label: 'Token Type', value: 'BEP-20' },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              padding: '16px 20px',
            }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
              <div style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Contract address */}
        <div style={{
          background: 'rgba(0,168,150,0.06)', border: '1px solid rgba(0,168,150,0.2)',
          borderRadius: '14px', padding: '16px 20px', marginBottom: '24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
        }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contract Address (BEP-20)</div>
            <div style={{ color: '#5eead4', fontSize: '13px', fontFamily: 'monospace', wordBreak: 'break-all' }}>{CONTRACT}</div>
          </div>
          <a
            href={`https://bscscan.com/token/${CONTRACT}`}
            target="_blank" rel="noopener noreferrer"
            style={{ color: '#5eead4', fontSize: '12px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            View on BSCScan ↗
          </a>
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href={`https://pancakeswap.finance/swap?outputCurrency=${CONTRACT}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 28px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #00a896, #1a3a8f)',
              color: '#fff', fontWeight: 700, fontSize: '14px', textDecoration: 'none',
            }}
          >
            🥞 Buy WOLV on PancakeSwap
          </a>
          <a
            href={`https://dexscreener.com/bsc/${CONTRACT}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 28px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff', fontWeight: 600, fontSize: '14px', textDecoration: 'none',
            }}
          >
            📊 View Chart on DEXScreener
          </a>
          <a
            href={`https://www.dextools.io/app/en/bnb/pair-explorer/${CONTRACT}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 28px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff', fontWeight: 600, fontSize: '14px', textDecoration: 'none',
            }}
          >
            🔍 DEXTools
          </a>
        </div>
      </div>
    </section>
  )
}
