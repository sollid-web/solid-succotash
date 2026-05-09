
'use client'
import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { parseUnits, formatUnits } from 'viem'

// ── Contract addresses ────────────────────────────────────────────────────────
const STAKING_ADDRESS = '0x4b62efee5695ed55cd362a0b818f4c5f9694322b' as const
const POOL_ADDRESS    = '0xb233cf74b14abf9d9702d585c540030125599579' as const
const WOLV_ADDRESS    = '0xe0167279aef7bf4ad313d261da82e8366822270c' as const
const BUSD_ADDRESS    = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56' as const

// ── ABIs (minimal) ────────────────────────────────────────────────────────────
const STAKING_ABI = [
  { name: 'stakeBNB',      type: 'function', stateMutability: 'payable',    inputs: [{ name: 'planId', type: 'uint8' }],                             outputs: [] },
  { name: 'stakeBUSD',     type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'planId', type: 'uint8' }, { name: 'amount', type: 'uint256' }], outputs: [] },
  { name: 'claimRewards',  type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'stakeId', type: 'uint256' }],                          outputs: [] },
  { name: 'earlyExit',     type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'stakeId', type: 'uint256' }],                          outputs: [] },
  { name: 'getStakeCount', type: 'function', stateMutability: 'view',       inputs: [{ name: 'user', type: 'address' }],                             outputs: [{ type: 'uint256' }] },
  { name: 'getStake',      type: 'function', stateMutability: 'view',       inputs: [{ name: 'user', type: 'address' }, { name: 'stakeId', type: 'uint256' }], outputs: [{ type: 'tuple', components: [{ name: 'planId', type: 'uint8' }, { name: 'token', type: 'uint8' }, { name: 'amountUSD', type: 'uint256' }, { name: 'stakedAt', type: 'uint256' }, { name: 'unlocksAt', type: 'uint256' }, { name: 'claimed', type: 'bool' }, { name: 'active', type: 'bool' }] }] },
  { name: 'pendingReward', type: 'function', stateMutability: 'view',       inputs: [{ name: 'user', type: 'address' }, { name: 'stakeId', type: 'uint256' }], outputs: [{ type: 'uint256' }] },
  { name: 'getBnbPrice',   type: 'function', stateMutability: 'view',       inputs: [],                                                              outputs: [{ type: 'uint256' }] },
] as const

const POOL_ABI = [
  { name: 'poolBalance', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
] as const

const ERC20_ABI = [
  { name: 'approve',   type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'spender', type: 'address' }, { name: 'value', type: 'uint256' }], outputs: [{ type: 'bool' }] },
  { name: 'allowance', type: 'function', stateMutability: 'view',       inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { name: 'balanceOf', type: 'function', stateMutability: 'view',       inputs: [{ name: 'account', type: 'address' }],                                     outputs: [{ type: 'uint256' }] },
] as const

// ── Plan definitions (mirrors contract) ──────────────────────────────────────
const PLANS = [
  { id: 0, name: 'Pioneer',    sub: 'Conservative · 90 days',  apy: '8%',  min: '$100',    lockDays: 90,  exitFee: '2.0%',  color: '#3b82f6' },
  { id: 1, name: 'Vanguard',   sub: 'Balanced · 150 days',     apy: '12%', min: '$1,000',  lockDays: 150, exitFee: '2.5%',  color: '#00a896' },
  { id: 2, name: 'Horizon',    sub: 'Active · 180 days',       apy: '18%', min: '$5,000',  lockDays: 180, exitFee: '3.0%',  color: '#8b5cf6' },
  { id: 3, name: 'Summit VIP', sub: 'Custom · 365 days',       apy: '25%', min: '$15,000', lockDays: 365, exitFee: '3.5%',  color: '#f59e0b' },
]

type Token = 'BNB' | 'BUSD'

export default function StakePage() {
  const { address, isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { writeContractAsync } = useWriteContract()

  const [selectedPlan, setSelectedPlan] = useState<number>(0)
  const [token, setToken]               = useState<Token>('BNB')
  const [amount, setAmount]             = useState('')
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')
  const [success, setSuccess]           = useState('')
  const [txHash, setTxHash]             = useState<`0x${string}` | undefined>()
  const [tab, setTab]                   = useState<'stake' | 'positions'>('stake')

  // ── Read pool balance ─────────────────────────────────────────────────────
  const { data: poolBalance } = useReadContract({
    address: POOL_ADDRESS, abi: POOL_ABI, functionName: 'poolBalance',
  })

  // ── Read stake count ──────────────────────────────────────────────────────
  const { data: stakeCount } = useReadContract({
    address: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'getStakeCount',
    args: address ? [address] : undefined, query: { enabled: !!address },
  })

  // ── Read BUSD allowance ───────────────────────────────────────────────────
  const { data: busdAllowance, refetch: refetchAllowance } = useReadContract({
    address: BUSD_ADDRESS, abi: ERC20_ABI, functionName: 'allowance',
    args: address ? [address, STAKING_ADDRESS] : undefined,
    query: { enabled: !!address && token === 'BUSD' },
  })

  // ── Read BNB price ────────────────────────────────────────────────────────
  const { data: bnbPrice } = useReadContract({
    address: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'getBnbPrice',
  })

  const plan = PLANS[selectedPlan]
  const poolBalanceFmt = poolBalance ? Number(formatUnits(poolBalance as bigint, 18)).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—'
  const bnbPriceFmt    = bnbPrice    ? `$${(Number(bnbPrice) / 1e8).toFixed(2)}` : '—'

  // ── Estimated reward preview ──────────────────────────────────────────────
  const estimatedReward = () => {
    if (!amount || isNaN(Number(amount))) return '—'
    const usd = Number(amount)
    const apyPct = [8, 12, 18, 25][selectedPlan]
    const days   = [90, 150, 180, 365][selectedPlan]
    return (usd * apyPct * days / 365 / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  // ── Stake handler ─────────────────────────────────────────────────────────
  const handleStake = async () => {
    setError(''); setSuccess('')
    if (!isConnected || !address) return openConnectModal?.()
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return setError('Enter a valid amount')

    setLoading(true)
    try {
      if (token === 'BNB') {
        if (!bnbPrice) throw new Error('BNB price unavailable')
        // Convert USD amount to BNB: amount / (bnbPrice/1e8)
        const bnbAmt = BigInt(Math.floor(Number(amount) * 1e18 / (Number(bnbPrice) / 1e8)))
        const hash = await writeContractAsync({
          address: STAKING_ADDRESS, abi: STAKING_ABI,
          functionName: 'stakeBNB',
          args: [selectedPlan],
          value: bnbAmt,
        })
        setTxHash(hash)
        setSuccess('Stake submitted! Waiting for confirmation...')
      } else {
        // BUSD — check allowance first
        const busdAmt = parseUnits(amount, 18)
        if (!busdAllowance || (busdAllowance as bigint) < busdAmt) {
          const approveHash = await writeContractAsync({
            address: BUSD_ADDRESS, abi: ERC20_ABI,
            functionName: 'approve',
            args: [STAKING_ADDRESS, busdAmt],
          })
          setSuccess('Approving BUSD... please wait')
          // wait briefly then stake
          await new Promise(r => setTimeout(r, 4000))
          await refetchAllowance()
        }
        const hash = await writeContractAsync({
          address: STAKING_ADDRESS, abi: STAKING_ABI,
          functionName: 'stakeBUSD',
          args: [selectedPlan, parseUnits(amount, 18)],
        })
        setTxHash(hash)
        setSuccess('Stake submitted! Waiting for confirmation...')
      }
    } catch (e: any) {
      setError(e?.shortMessage || e?.message || 'Transaction failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>WOLV Staking</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Stake BNB or BUSD — earn WOLV rewards on-chain</p>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '28px' }}>
        {[
          { label: 'Reward Pool', value: `${poolBalanceFmt} WOLV` },
          { label: 'BNB Price',   value: bnbPriceFmt },
          { label: '1 WOLV =',    value: '$1.00 USD' },
          { label: 'Plans',       value: '4 Active' },
        ].map(s => (
          <div key={s.label} style={{ borderRadius: '12px', padding: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{s.label}</div>
            <div style={{ color: '#00a896', fontWeight: 700, fontSize: '15px', fontFamily: 'monospace' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {(['stake', 'positions'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: 'none',
            background: tab === t ? '#00a896' : 'rgba(255,255,255,0.06)',
            color: tab === t ? '#fff' : 'rgba(255,255,255,0.4)',
          }}>{t === 'stake' ? 'Stake' : `My Positions${stakeCount ? ` (${stakeCount})` : ''}`}</button>
        ))}
      </div>

      {tab === 'stake' && (
        <>
          {/* Plan cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '28px' }}>
            {PLANS.map(p => (
              <div key={p.id} onClick={() => setSelectedPlan(p.id)} style={{
                borderRadius: '16px', padding: '16px', cursor: 'pointer',
                background: selectedPlan === p.id ? `rgba(0,168,150,0.12)` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${selectedPlan === p.id ? p.color : 'rgba(255,255,255,0.08)'}`,
                transition: 'all 0.2s',
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px', marginBottom: '10px' }}>⬡</div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{p.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginBottom: '8px' }}>{p.sub}</div>
                <div style={{ color: p.color, fontWeight: 700, fontSize: '22px', fontFamily: 'monospace', marginBottom: '2px' }}>{p.apy}<span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 400 }}> APY</span></div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>Min {p.min} · Exit fee {p.exitFee}</div>
              </div>
            ))}
          </div>

          {/* Stake form */}
          <div style={{ maxWidth: '480px' }}>
            {error   && <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
            {success && <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399', fontSize: '13px', marginBottom: '16px' }}>{success}{txHash && <a href={`https://bscscan.com/tx/${txHash}`} target="_blank" rel="noreferrer" style={{ marginLeft: '8px', color: '#00a896' }}>View tx ↗</a>}</div>}

            {/* Token toggle */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {(['BNB', 'BUSD'] as Token[]).map(t => (
                <button key={t} onClick={() => setToken(t)} style={{
                  padding: '8px 24px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: 'none',
                  background: token === t ? plan.color : 'rgba(255,255,255,0.06)',
                  color: token === t ? '#fff' : 'rgba(255,255,255,0.4)',
                }}>{t}</button>
              ))}
            </div>

            {/* Amount input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                Amount ({token})
              </label>
              <input
                type="number" min="0" step="0.01" value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder={`Enter ${token} amount`}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', marginTop: '6px' }}>Minimum: {plan.min} USD equivalent</p>
            </div>

            {/* Reward preview */}
            {amount && (
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(0,168,150,0.08)', border: '1px solid rgba(0,168,150,0.2)', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    ['Plan',          plan.name],
                    ['APY',           plan.apy],
                    ['Lock Period',   `${plan.lockDays} days`],
                    ['Est. Reward',   `~${estimatedReward()} WOLV`],
                    ['Exit Fee',      plan.exitFee],
                    ['Reward Token',  'WOLV ($1 each)'],
                  ].map(([l, v]) => (
                    <div key={l}>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>{l}</div>
                      <div style={{ color: '#00a896', fontWeight: 600, fontSize: '13px' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleStake}
              disabled={loading}
              style={{
                padding: '14px 32px', borderRadius: '10px', fontSize: '14px', fontWeight: 700,
                background: loading ? 'rgba(255,255,255,0.1)' : plan.color,
                color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {!isConnected ? 'Connect Wallet to Stake' : loading ? 'Processing...' : `Stake ${token} → Earn WOLV`}
            </button>

            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', marginTop: '12px' }}>
              Funds are locked for {plan.lockDays} days. Early exit incurs a {plan.exitFee} fee on principal. Rewards paid in WOLV at $1/WOLV.
            </p>
          </div>
        </>
      )}

      {tab === 'positions' && (
        <PositionsTab address={address} stakeCount={stakeCount as bigint | undefined} writeContractAsync={writeContractAsync} />
      )}
    </div>
  )
}

// ── Positions tab ─────────────────────────────────────────────────────────────
function PositionsTab({ address, stakeCount, writeContractAsync }: {
  address?: `0x${string}`
  stakeCount?: bigint
  writeContractAsync: any
}) {
  const [positions, setPositions] = useState<any[]>([])
  const [loading, setLoading]     = useState(false)
  const [msg, setMsg]             = useState('')

  const { data: stake0 } = useReadContract({ address: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'getStake', args: address && stakeCount && stakeCount > 0n ? [address, 0n] : undefined, query: { enabled: !!address && !!stakeCount && stakeCount > 0n } })
  const { data: stake1 } = useReadContract({ address: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'getStake', args: address && stakeCount && stakeCount > 1n ? [address, 1n] : undefined, query: { enabled: !!address && !!stakeCount && stakeCount > 1n } })
  const { data: stake2 } = useReadContract({ address: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'getStake', args: address && stakeCount && stakeCount > 2n ? [address, 2n] : undefined, query: { enabled: !!address && !!stakeCount && stakeCount > 2n } })

  useEffect(() => {
    const all = [stake0, stake1, stake2].filter(Boolean).map((s: any, i) => ({ ...s, stakeId: i }))
    setPositions(all)
  }, [stake0, stake1, stake2])

  const now = Math.floor(Date.now() / 1000)

  const claim = async (stakeId: number) => {
    setMsg(''); setLoading(true)
    try {
      const hash = await writeContractAsync({ address: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'claimRewards', args: [BigInt(stakeId)] })
      setMsg(`Claim submitted! Tx: ${hash}`)
    } catch (e: any) { setMsg(e?.shortMessage || 'Failed') }
    finally { setLoading(false) }
  }

  const exit = async (stakeId: number) => {
    setMsg(''); setLoading(true)
    try {
      const hash = await writeContractAsync({ address: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'earlyExit', args: [BigInt(stakeId)] })
      setMsg(`Exit submitted! Tx: ${hash}`)
    } catch (e: any) { setMsg(e?.shortMessage || 'Failed') }
    finally { setLoading(false) }
  }

  if (!address) return <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Connect your wallet to see positions.</p>
  if (!stakeCount || stakeCount === 0n) return <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>No active stakes found.</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {msg && <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399', fontSize: '13px' }}>{msg}</div>}
      {positions.filter(p => p.active).map((p) => {
        const plan    = PLANS[p.planId]
        const unlocks = Number(p.unlocksAt)
        const locked  = now < unlocks
        const daysLeft = locked ? Math.ceil((unlocks - now) / 86400) : 0
        const usd     = Number(p.amountUSD) / 1e8
        const apyPct  = [8, 12, 18, 25][p.planId]
        const reward  = (usd * apyPct * plan.lockDays / 365 / 100).toFixed(2)

        return (
          <div key={p.stakeId} style={{ borderRadius: '16px', padding: '20px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${plan.color}40` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '15px' }}>{plan.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>{p.token === 0 ? 'BNB' : 'BUSD'} stake · {plan.apy} APY</div>
              </div>
              <div style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: locked ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)', color: locked ? '#f59e0b' : '#34d399' }}>
                {locked ? `${daysLeft}d left` : 'Unlocked'}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
              {[['Staked (USD)', `$${usd.toLocaleString()}`], ['Est. Reward', `${reward} WOLV`], ['Unlocks', new Date(unlocks * 1000).toLocaleDateString()]].map(([l, v]) => (
                <div key={l}>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>{l}</div>
                  <div style={{ color: plan.color, fontWeight: 600, fontSize: '13px' }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!locked && (
                <button onClick={() => claim(p.stakeId)} disabled={loading} style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, background: '#00a896', color: '#fff', border: 'none', cursor: 'pointer' }}>
                  Claim WOLV
                </button>
              )}
              {locked && (
                <button onClick={() => exit(p.stakeId)} disabled={loading} style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer' }}>
                  Early Exit ({plan.exitFee} fee)
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

