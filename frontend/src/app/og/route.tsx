// src/app/og/route.tsx
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const BASE_COLOR = '#2A52BE'
const TEAL = '#00a896'

// ── Page configs ──────────────────────────────────────────────────────────────
const PAGES: Record<string, { title: string; subtitle: string; accent: string; tag: string }> = {
  home: {
    title: 'WolvCapital',
    subtitle: 'Next-generation DeFi on BNB Smart Chain. Stake, earn, and govern with WOLV.',
    accent: TEAL,
    tag: 'DeFi Protocol',
  },
  'wolv-token': {
    title: 'WOLV Token',
    subtitle: 'The core utility token powering the WolvCapital ecosystem. 1 WOLV = $1.00 USD.',
    accent: BASE_COLOR,
    tag: 'LIVE · BNB Chain',
  },
  tokenomics: {
    title: 'Tokenomics',
    subtitle: 'Hard-capped supply of 1,000,000,000 WOLV. Transparent, auditable, on-chain.',
    accent: TEAL,
    tag: 'Supply & Distribution',
  },
  roadmap: {
    title: 'Roadmap',
    subtitle: 'Our path to a fully decentralized, community-owned DeFi protocol.',
    accent: '#3b82f6',
    tag: 'Development Milestones',
  },
  whitepaper: {
    title: 'Whitepaper',
    subtitle: 'Technical architecture, tokenomics model, and governance framework in full detail.',
    accent: '#60a5fa',
    tag: 'Technical Documentation',
  },
}

// ── Staking tier configs ──────────────────────────────────────────────────────
const TIERS: Record<string, { apy: string; duration: string; min: string; accent: string; gradient: string; label: string }> = {
  pioneer: {
    label: 'Pioneer Plan',
    apy: '8%',
    duration: '90 Days',
    min: '$100',
    accent: '#38bdf8',
    gradient: 'radial-gradient(circle at 90% 10%, #0c4a6e 0%, #05070f 70%)',
  },
  vanguard: {
    label: 'Vanguard Plan',
    apy: '12%',
    duration: '150 Days',
    min: '$1,000',
    accent: '#a855f7',
    gradient: 'radial-gradient(circle at 90% 10%, #4c1d95 0%, #05070f 70%)',
  },
  horizon: {
    label: 'Horizon Plan',
    apy: '18%',
    duration: '180 Days',
    min: '$5,000',
    accent: '#f97316',
    gradient: 'radial-gradient(circle at 90% 10%, #7c2d12 0%, #05070f 70%)',
  },
  summit: {
    label: 'Summit VIP',
    apy: '25%',
    duration: '365 Days',
    min: '$15,000',
    accent: '#eab308',
    gradient: 'radial-gradient(circle at 90% 10%, #1e1b4b 0%, #05070f 70%)',
  },
}

function GridOverlay() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'linear-gradient(rgba(42,82,190,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(42,82,190,0.06) 1px, transparent 1px)',
      backgroundSize: '60px 60px',
      display: 'flex',
    }} />
  )
}

function PageImage({ page }: { page: typeof PAGES[string] }) {
  return (
    <div style={{
      width: '1200px', height: '630px', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(135deg, #060c1a 0%, #0d1b38 60%, #091525 100%)',
      position: 'relative', fontFamily: 'sans-serif', overflow: 'hidden',
    }}>
      <GridOverlay />
      <div style={{ position: 'absolute', top: '-120px', right: '-80px', width: '480px', height: '480px', borderRadius: '50%', background: `radial-gradient(circle, ${page.accent}28 0%, transparent 70%)`, display: 'flex' }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '340px', height: '340px', borderRadius: '50%', background: 'radial-gradient(circle, #2A52BE22 0%, transparent 70%)', display: 'flex' }} />
      <div style={{ position: 'absolute', right: '80px', top: '50%', fontSize: '260px', color: `${page.accent}12`, display: 'flex', lineHeight: 1 }}>⬡</div>
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '56px 72px', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `linear-gradient(135deg, ${page.accent}, #2A52BE)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⬡</div>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '20px', fontWeight: 700 }}>WolvCapital</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: `${page.accent}18`, border: `1px solid ${page.accent}40`, borderRadius: '99px', padding: '6px 18px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: page.accent }} />
            <span style={{ color: page.accent, fontSize: '13px', fontWeight: 600 }}>{page.tag}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '720px' }}>
          <h1 style={{ fontSize: '72px', fontWeight: 900, color: '#ffffff', margin: 0, lineHeight: 1, letterSpacing: '-3px' }}>{page.title}</h1>
          <p style={{ fontSize: '22px', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5, maxWidth: '600px' }}>{page.subtitle}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {[
            { label: 'Chain', value: 'BNB Smart Chain' },
            { label: 'Max Supply', value: '1,000,000,000' },
            { label: 'APY up to', value: '25%' },
            { label: 'Peg', value: '$1.00 USD' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: page.accent }}>{s.value}</span>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>wolvcapital.io</span>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, transparent, ${page.accent}, #2A52BE, transparent)`, display: 'flex' }} />
    </div>
  )
}

function TierImage({ tier }: { tier: typeof TIERS[string] }) {
  return (
    <div style={{
      width: '1200px', height: '630px', display: 'flex', flexDirection: 'column',
      alignItems: 'flex-start', justifyContent: 'space-between',
      backgroundColor: '#05070f', backgroundImage: tier.gradient,
      padding: '60px 80px', fontFamily: 'sans-serif', position: 'relative', overflow: 'hidden',
    }}>
      <GridOverlay />
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: tier.accent }} />
            <span style={{ fontSize: '26px', fontWeight: 'bold', color: '#ffffff', letterSpacing: '-0.05em' }}>WOLVCAPITAL</span>
          </div>
          <span style={{ color: '#64748b', fontSize: '18px', fontWeight: 500 }}>BSC Staking Vault</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ color: tier.accent, fontSize: '22px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Verified Asset Pool · Active
          </span>
          <span style={{ fontSize: '64px', fontWeight: 'bold', color: '#ffffff', letterSpacing: '-0.02em' }}>
            {tier.label}
          </span>
        </div>
        <div style={{ display: 'flex', width: '100%', borderTop: '1px solid #1e293b', paddingTop: '36px', justifyContent: 'space-between' }}>
          {[
            { label: 'Yield Rate',      value: `${tier.apy} APY`, color: '#22c55e' },
            { label: 'Contract Lock',   value: tier.duration,     color: '#ffffff' },
            { label: 'Minimum Funding', value: `${tier.min} USD`, color: '#ffffff' },
          ].map(m => (
            <div key={m.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#64748b', fontSize: '17px', fontWeight: 500 }}>{m.label}</span>
              <span style={{ color: m.color, fontSize: '38px', fontWeight: 'bold' }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, transparent, ${tier.accent}, transparent)`, display: 'flex' }} />
    </div>
  )
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const pageKey = searchParams.get('page')
  const tierKey = searchParams.get('tier')

  if (tierKey) {
    const tier = TIERS[tierKey.toLowerCase()] ?? TIERS.pioneer
    return new ImageResponse(<TierImage tier={tier} />, { width: 1200, height: 630 })
  }

  const page = PAGES[pageKey ?? 'home'] ?? PAGES.home
  return new ImageResponse(<PageImage page={page} />, { width: 1200, height: 630 })
}
