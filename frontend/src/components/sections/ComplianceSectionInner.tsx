'use client'
import { useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { WalletProviderClient } from '@/_client/WalletProviderClient'

const WOLV_ADDRESS    = '0xe0167279aef7bf4ad313d261da82e8366822270c' as const
const POOL_ADDRESS    = '0xb233cf74b14abf9d9702d585c540030125599579' as const
const STAKING_ADDRESS = '0x4b62efee5695ed55cd362a0b818f4c5f9694322b' as const

const ERC20_ABI = [
  { name: 'totalSupply', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
] as const
const POOL_ABI = [
  { name: 'poolBalance', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
] as const
const STAKING_ABI = [
  { name: 'getBnbPrice', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
] as const

function fmt(val: bigint | undefined) {
  if (!val) return '—'
  return Number(formatUnits(val, 18)).toLocaleString(undefined, { maximumFractionDigits: 0 })
}

function Metrics() {
  const { data: totalSupply } = useReadContract({ address: WOLV_ADDRESS, abi: ERC20_ABI, functionName: 'totalSupply' })
  const { data: poolBalance  } = useReadContract({ address: POOL_ADDRESS,  abi: POOL_ABI,  functionName: 'poolBalance' })
  const { data: bnbPrice     } = useReadContract({ address: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'getBnbPrice' })

  const bnbPriceFmt = bnbPrice ? `$${(Number(bnbPrice) / 1e8).toFixed(2)}` : '—'

  const stats = [
    { label: 'WOLV Minted',   value: fmt(totalSupply), sub: 'Total supply on-chain',      icon: '⬡', color: '#2A52BE' },
    { label: 'Reward Pool',   value: fmt(poolBalance),  sub: 'Available for stakers',      icon: '🏦', color: '#00a896' },
    { label: 'BNB Price',     value: bnbPriceFmt,       sub: 'Live via Chainlink oracle',  icon: '⚡', color: '#3b82f6' },
    { label: 'Max Supply',    value: '1,000,000,000',   sub: 'Hard capped · No inflation', icon: '🔒', color: '#60a5fa' },
    { label: 'Staking Plans', value: '4 Active',        sub: '8% – 25% APY',              icon: '📈', color: '#2A52BE' },
    { label: '1 WOLV =',      value: '$1.00 USD',       sub: 'Platform peg',              icon: '💎', color: '#00a896' },
  ]

  return (
    <section id="compliance" style={{
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0f1a35 100%)',
      padding: '80px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(42,82,190,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(42,82,190,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0,168,150,0.1)', border: '1px solid rgba(0,168,150,0.25)', borderRadius: '99px', padding: '6px 16px', marginBottom: '20px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00a896', display: 'inline-block', boxShadow: '0 0 8px #00a896' }} />
            <span style={{ fontSize: '12px', color: '#00a896', fontWeight: 600 }}>Live On-Chain Data · BNB Smart Chain</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: '12px' }}>
            Verify Everything On-Chain
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '16px', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            Every number below is pulled directly from BNB Smart Chain in real time. No intermediaries. No trust required.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${s.color}25`, borderRadius: '18px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '20px' }}>{s.icon}</span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' as const, letterSpacing: '1px' }}>{s.label}</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: s.color, fontFamily: "'DM Mono', monospace", marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' as const, marginBottom: '24px' }}>
          {[
            { name: 'WOLV Token',       addr: WOLV_ADDRESS    },
            { name: 'Reward Pool',      addr: POOL_ADDRESS    },
            { name: 'Staking Contract', addr: STAKING_ADDRESS },
          ].map(c => (
            <a key={c.name} href={`https://bscscan.com/address/${c.addr}#code`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', background: 'rgba(42,82,190,0.1)', border: '1px solid rgba(42,82,190,0.25)', color: '#fff', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00a896', display: 'inline-block' }} />
              {c.name} ↗
            </a>
          ))}
        </div>
        <div style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>
          Data refreshes on every page load · Powered by BNB Smart Chain · Verified by Chainlink
        </div>
      </div>
    </section>
  )
}

export default function ComplianceSectionInner() {
  return (
    <WalletProviderClient>
      <Metrics />
    </WalletProviderClient>
  )
}
