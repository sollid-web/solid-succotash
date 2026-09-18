'use client'

export default function WolvChartSection() {
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

        {/* Stats row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {[
            { label: 'Network', value: 'BNB Chain' },
            { label: 'DEX', value: 'PancakeSwap V2' },
            { label: 'Holders', value: '231+' },
            { label: 'Contract', value: 'Verified ✓' },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '12px 20px',
              textAlign: 'center',
              minWidth: '120px',
            }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginBottom: '4px' }}>{label}</div>
              <div style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* DEXScreener embed */}
        <div style={{
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(0,168,150,0.2)',
          boxShadow: '0 0 40px rgba(0,168,150,0.08)',
          marginBottom: '24px',
        }}>
          <iframe
            src="https://dexscreener.com/bsc/0xe0167279aef7bf4ad313d261da82e8366822270c?embed=1&theme=dark&trades=0&info=0"
            style={{ width: '100%', height: '400px', border: 'none', display: 'block' }}
            title="WOLV/BNB Live Chart"
            loading="lazy"
          />
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href="https://pancakeswap.finance/swap?outputCurrency=0xe0167279aef7bf4ad313d261da82e8366822270c"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 28px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #00a896, #1a3a8f)',
              color: '#fff', fontWeight: 700, fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            🥞 Buy on PancakeSwap
          </a>
          <a
            href="https://dexscreener.com/bsc/0xe0167279aef7bf4ad313d261da82e8366822270c"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 28px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff', fontWeight: 700, fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            📊 View on DEXScreener
          </a>
          <a
            href="https://www.dextools.io/app/en/bnb/pair-explorer/0xe0167279aef7bf4ad313d261da82e8366822270c"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 28px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff', fontWeight: 700, fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            🔍 View on DEXTools
          </a>
        </div>

      </div>
    </section>
  )
}
