import Link from 'next/link'

export default function WolvTokenSection() {
  const WOLV_CONTRACT = '0xbcb3d35bcbbd141f1955aaf8f51b48b801b117bf'

  return (
    <section id="wolv-token" style={{
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0f1a35 100%)',
      padding: '80px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background effects */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,168,150,0.12) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(0,168,150,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,168,150,0.04) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(0,168,150,0.12)', border: '1px solid rgba(0,168,150,0.3)',
            borderRadius: '99px', padding: '6px 16px', fontSize: '12px',
            color: '#00a896', fontWeight: 600, marginBottom: '20px', letterSpacing: '0.5px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00a896', boxShadow: '0 0 8px #00a896', display: 'inline-block' }} />
            Live on BNB Smart Chain
          </span>
          <h2 style={{
            fontSize: 'clamp(32px, 6vw, 52px)', fontWeight: 800,
            color: '#fff', letterSpacing: '-1.5px', lineHeight: 1.1,
            marginBottom: '16px', fontFamily: "'DM Sans', system-ui, sans-serif",
          }}>
            Earn <span style={{ color: '#00a896' }}>WOLV Tokens</span>
            <br />as Profit Rewards
          </h2>
          <p style={{
            fontSize: '16px', color: 'rgba(255,255,255,0.5)',
            maxWidth: '520px', margin: '0 auto', lineHeight: 1.7,
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}>
            Every dollar you earn on WolvCapital is minted as WOLV — a verifiable, blockchain-backed token on BNB Smart Chain.
          </p>
        </div>

        {/* Main content grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          {/* Coin card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,168,150,0.12) 0%, rgba(26,58,143,0.1) 100%)',
            border: '1px solid rgba(0,168,150,0.25)',
            borderRadius: '24px', padding: '40px 32px',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            textAlign: 'center', gap: '20px',
          }}>
            <div style={{
              width: '100px', height: '100px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #00a896, #1a3a8f)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 40px rgba(0,168,150,0.3)',
              fontSize: '44px', fontWeight: 800, color: '#fff',
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}>W</div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>WOLV Token</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>BEP-20 · BNB Smart Chain</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%' }}>
              {[
                { label: 'Symbol', value: 'WOLV' },
                { label: 'Decimals', value: '18' },
                { label: 'Max Supply', value: '1B' },
                { label: 'Status', value: '✓ Verified' },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'rgba(255,255,255,0.05)', borderRadius: '10px',
                  padding: '10px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{s.label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: s.value === '✓ Verified' ? '#00a896' : '#fff', fontFamily: 'monospace' }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { num: '01', title: 'Invest in a plan', desc: 'Choose Pioneer, Vanguard, Horizon, or Summit VIP and start earning returns.', color: '#00a896' },
              { num: '02', title: 'Profits are distributed', desc: 'WolvCapital generates returns and distributes them to your account.', color: '#1a8fc1' },
              { num: '03', title: 'WOLV minted to your wallet', desc: 'Profit tokens are minted directly to your connected wallet — on-chain proof of earnings.', color: '#7c3aed' },
              { num: '04', title: 'Verify anytime on BSCScan', desc: 'Every token is publicly verifiable. No trust required — check the blockchain yourself.', color: '#0ea5e9' },
            ].map((step) => (
              <div key={step.num} style={{
                display: 'flex', gap: '16px', alignItems: 'flex-start',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px', padding: '20px',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                  background: `${step.color}20`, border: `1px solid ${step.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', color: step.color, fontWeight: 700, fontFamily: 'monospace',
                }}>{step.num}</div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{step.title}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contract address */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px', padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '12px', flexWrap: 'wrap', marginBottom: '32px',
        }}>
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Verified Contract · BNB Smart Chain</div>
            <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#7dd3c8', wordBreak: 'break-all' }}>{WOLV_CONTRACT}</div>
          </div>
          <a
            href={`https://bscscan.com/token/${WOLV_CONTRACT}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'rgba(0,168,150,0.15)', border: '1px solid rgba(0,168,150,0.3)',
              color: '#00a896', borderRadius: '8px', padding: '8px 16px',
              fontSize: '13px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            View on BSCScan ↗
          </a>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/accounts/signup" style={{
            background: 'linear-gradient(135deg, #00a896, #1a3a8f)',
            color: '#fff', padding: '14px 32px', borderRadius: '12px',
            fontWeight: 700, fontSize: '15px', textDecoration: 'none',
            boxShadow: '0 8px 32px rgba(0,168,150,0.25)',
          }}>
            Start Earning WOLV →
          </Link>
          <Link href="/wolv-token" style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', padding: '14px 32px', borderRadius: '12px',
            fontWeight: 600, fontSize: '15px', textDecoration: 'none',
          }}>
            Learn More
          </Link>
        </div>
      </div>
    </section>
  )
}
