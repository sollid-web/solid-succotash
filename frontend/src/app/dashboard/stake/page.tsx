'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAccount, useWriteContract, useReadContract, usePublicClient } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { parseUnits, formatUnits } from 'viem'

// ── Contract addresses ────────────────────────────────────────────────────────
const STAKING_ADDRESS = '0x4b62efee5695ed55cd362a0b818f4c5f9694322b' as const
const POOL_ADDRESS    = '0xb233cf74b14abf9d9702d585c540030125599579' as const
const WOLV_ADDRESS    = '0xe0167279aef7bf4ad313d261da82e8366822270c' as const
const BUSD_ADDRESS    = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56' as const

// ── ABIs ──────────────────────────────────────────────────────────────────────
const STAKING_ABI = [
  { name: 'stakeBNB',      type: 'function', stateMutability: 'payable',    inputs: [{ name: 'planId', type: 'uint8' }], outputs: [] },
  { name: 'stakeBUSD',     type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'planId', type: 'uint8' }, { name: 'amount', type: 'uint256' }], outputs: [] },
  { name: 'claimRewards',  type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'stakeId', type: 'uint256' }], outputs: [] },
  { name: 'earlyExit',     type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'stakeId', type: 'uint256' }], outputs: [] },
  { name: 'getStakeCount', type: 'function', stateMutability: 'view',       inputs: [{ name: 'user', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { name: 'getStake',      type: 'function', stateMutability: 'view',       inputs: [{ name: 'user', type: 'address' }, { name: 'stakeId', type: 'uint256' }], outputs: [{ type: 'tuple', components: [{ name: 'planId', type: 'uint8' }, { name: 'token', type: 'uint8' }, { name: 'amountUSD', type: 'uint256' }, { name: 'stakedAt', type: 'uint256' }, { name: 'unlocksAt', type: 'uint256' }, { name: 'claimed', type: 'bool' }, { name: 'active', type: 'bool' }] }] },
  { name: 'pendingReward', type: 'function', stateMutability: 'view',       inputs: [{ name: 'user', type: 'address' }, { name: 'stakeId', type: 'uint256' }], outputs: [{ type: 'uint256' }] },
  { name: 'getBnbPrice',   type: 'function', stateMutability: 'view',       inputs: [], outputs: [{ type: 'uint256' }] },
] as const

const POOL_ABI = [
  { name: 'poolBalance', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
] as const

const ERC20_ABI = [
  { name: 'approve',   type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'spender', type: 'address' }, { name: 'value', type: 'uint256' }], outputs: [{ type: 'bool' }] },
  { name: 'allowance', type: 'function', stateMutability: 'view',       inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { name: 'balanceOf', type: 'function', stateMutability: 'view',       inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] },
] as const

// ── Plan definitions ──────────────────────────────────────────────────────────
const PLANS = [
  { id: 0, name: 'Pioneer',    sub: 'Conservative · 90 days',  apy: 8,  apyLabel: '8%',  min: '$100',    lockDays: 90,  exitFee: '2.0%', color: '#3b82f6' },
  { id: 1, name: 'Vanguard',   sub: 'Balanced · 150 days',     apy: 12, apyLabel: '12%', min: '$1,000',  lockDays: 150, exitFee: '2.5%', color: '#00a896' },
  { id: 2, name: 'Horizon',    sub: 'Active · 180 days',       apy: 18, apyLabel: '18%', min: '$5,000',  lockDays: 180, exitFee: '3.0%', color: '#8b5cf6' },
  { id: 3, name: 'Summit VIP', sub: 'Premium · 365 days',      apy: 25, apyLabel: '25%', min: '$15,000', lockDays: 365, exitFee: '3.5%', color: '#f59e0b' },
]

type Token = 'BNB' | 'BUSD'

interface Position {
  stakeId: number
  planId: number
  token: number
  amountUSD: bigint
  stakedAt: bigint
  unlocksAt: bigint
  claimed: boolean
  active: boolean
  pendingReward: bigint
}

export default function StakePage() {
  const { address, isConnected } = useAccount()
  const { openConnectModal }     = useConnectModal()
  const { writeContractAsync }   = useWriteContract()
  const publicClient             = usePublicClient()

  const [selectedPlan, setSelectedPlan] = useState(0)
  const [token, setToken]               = useState<Token>('BNB')
  const [amount, setAmount]             = useState('')
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')
  const [success, setSuccess]           = useState('')
  const [txHash, setTxHash]             = useState<`0x${string}` | undefined>()
  const [tab, setTab]                   = useState<'stake' | 'positions'>('stake')
  const [positions, setPositions]       = useState<Position[]>([])
  const [posLoading, setPosLoading]     = useState(false)
  const [lastRefresh, setLastRefresh]   = useState(0)

  // ── Static reads ──────────────────────────────────────────────────────────
  const { data: poolBalance, refetch: refetchPool } = useReadContract({
    address: POOL_ADDRESS, abi: POOL_ABI, functionName: 'poolBalance',
  })
  const { data: stakeCount, refetch: refetchCount } = useReadContract({
    address: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'getStakeCount',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })
  const { data: bnbPrice } = useReadContract({
    address: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'getBnbPrice',
  })
  const { data: busdAllowance, refetch: refetchAllowance } = useReadContract({
    address: BUSD_ADDRESS, abi: ERC20_ABI, functionName: 'allowance',
    args: address ? [address, STAKING_ADDRESS] : undefined,
    query: { enabled: !!address && token === 'BUSD' },
  })

  const plan            = PLANS[selectedPlan]
  const poolBalanceFmt  = poolBalance ? Number(formatUnits(poolBalance as bigint, 18)).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—'
  const bnbPriceFmt     = bnbPrice    ? `$${(Number(bnbPrice) / 1e8).toFixed(2)}` : '—'
  const totalPending    = positions.reduce((sum, p) => sum + Number(formatUnits(p.pendingReward, 18)), 0)
  const totalStakedUSD  = positions.filter(p => p.active).reduce((sum, p) => sum + Number(p.amountUSD) / 1e8, 0)

  // ── FIX 1: Dynamic position loader — reads ALL stakes + live pendingReward ──
  const loadPositions = useCallback(async () => {
    if (!address || !publicClient || !stakeCount || stakeCount === 0n) {
      setPositions([])
      return
    }
    setPosLoading(true)
    try {
      const count = Number(stakeCount)
      const loaded: Position[] = []

      // Fetch all stakes in parallel
      const stakePromises = Array.from({ length: count }, (_, i) =>
        publicClient.readContract({
          address: STAKING_ADDRESS,
          abi: STAKING_ABI,
          functionName: 'getStake',
          args: [address, BigInt(i)],
        })
      )

      // Fetch all pending rewards in parallel
      const rewardPromises = Array.from({ length: count }, (_, i) =>
        publicClient.readContract({
          address: STAKING_ADDRESS,
          abi: STAKING_ABI,
          functionName: 'pendingReward',
          args: [address, BigInt(i)],
        })
      )

      const [stakes, rewards] = await Promise.all([
        Promise.all(stakePromises),
        Promise.all(rewardPromises),
      ])

      for (let i = 0; i < count; i++) {
        const s = stakes[i] as any
        if (s && s.active) {
          loaded.push({
            stakeId:       i,
            planId:        s.planId,
            token:         s.token,
            amountUSD:     s.amountUSD,
            stakedAt:      s.stakedAt,
            unlocksAt:     s.unlocksAt,
            claimed:       s.claimed,
            active:        s.active,
            pendingReward: rewards[i] as bigint,
          })
        }
      }
      setPositions(loaded)
      setLastRefresh(Date.now())
    } catch (e) {
      console.error('Failed to load positions:', e)
    } finally {
      setPosLoading(false)
    }
  }, [address, publicClient, stakeCount])

  // Load positions when tab changes or stakeCount updates
  useEffect(() => {
    if (tab === 'positions') loadPositions()
  }, [tab, loadPositions])

  // FIX 2: Auto-refresh pending rewards every 30 seconds
  useEffect(() => {
    if (tab !== 'positions' || !isConnected) return
    const interval = setInterval(() => loadPositions(), 30_000)
    return () => clearInterval(interval)
  }, [tab, isConnected, loadPositions])

  // ── Estimated reward preview ──────────────────────────────────────────────
  const estimatedReward = () => {
    if (!amount || isNaN(Number(amount))) return '—'
    const usd = Number(amount)
    return (usd * plan.apy * plan.lockDays / 365 / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  // ── Stake handler ─────────────────────────────────────────────────────────
  const handleStake = async () => {
    setError(''); setSuccess('')
    if (!isConnected || !address) return openConnectModal?.()
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return setError('Enter a valid amount')

    setLoading(true)
    try {
      if (token === 'BNB') {
        if (!bnbPrice) throw new Error('BNB price unavailable — try again shortly')
        const bnbAmt = BigInt(Math.floor(Number(amount) * 1e18 / (Number(bnbPrice) / 1e8)))
        const hash = await writeContractAsync({
          address: STAKING_ADDRESS, abi: STAKING_ABI,
          functionName: 'stakeBNB', args: [selectedPlan], value: bnbAmt,
        })
        setTxHash(hash)
        setSuccess(`✅ Stake submitted! Tx: ${hash.slice(0, 10)}...`)
      } else {
        const busdAmt = parseUnits(amount, 18)
        if (!busdAllowance || (busdAllowance as bigint) < busdAmt) {
          setSuccess('Step 1/2 — Approving BUSD...')
          await writeContractAsync({
            address: BUSD_ADDRESS, abi: ERC20_ABI,
            functionName: 'approve', args: [STAKING_ADDRESS, busdAmt],
          })
          await new Promise(r => setTimeout(r, 4000))
          await refetchAllowance()
        }
        setSuccess('Step 2/2 — Staking BUSD...')
        const hash = await writeContractAsync({
          address: STAKING_ADDRESS, abi: STAKING_ABI,
          functionName: 'stakeBUSD', args: [selectedPlan, busdAmt],
        })
        setTxHash(hash)
        setSuccess(`✅ Stake submitted! Tx: ${hash.slice(0, 10)}...`)
      }
      // Refresh counts after stake
      await Promise.all([refetchCount(), refetchPool()])
      setAmount('')
    } catch (e: any) {
      setError(e?.shortMessage || e?.message || 'Transaction failed')
    } finally {
      setLoading(false)
    }
  }

  // ── Claim handler ─────────────────────────────────────────────────────────
  const handleClaim = async (stakeId: number) => {
    setLoading(true)
    try {
      const hash = await writeContractAsync({
        address: STAKING_ADDRESS, abi: STAKING_ABI,
        functionName: 'claimRewards', args: [BigInt(stakeId)],
      })
      setSuccess(`✅ Claim submitted! Tx: ${hash.slice(0, 10)}...`)
      await loadPositions()
    } catch (e: any) {
      setError(e?.shortMessage || e?.message || 'Claim failed')
    } finally {
      setLoading(false)
    }
  }

  // ── Early exit handler ────────────────────────────────────────────────────
  const handleExit = async (stakeId: number) => {
    if (!confirm('Early exit will incur a fee on your principal. Continue?')) return
    setLoading(true)
    try {
      const hash = await writeContractAsync({
        address: STAKING_ADDRESS, abi: STAKING_ABI,
        functionName: 'earlyExit', args: [BigInt(stakeId)],
      })
      setSuccess(`✅ Exit submitted! Tx: ${hash.slice(0, 10)}...`)
      await loadPositions()
    } catch (e: any) {
      setError(e?.shortMessage || e?.message || 'Exit failed')
    } finally {
      setLoading(false)
    }
  }

  const now = Math.floor(Date.now() / 1000)

  // ── Styles ────────────────────────────────────────────────────────────────
  const cardStyle = (active: boolean, color: string) => ({
    borderRadius: '16px', padding: '18px', cursor: 'pointer',
    background: active ? `${color}18` : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? color : 'rgba(255,255,255,0.08)'}`,
    transition: 'all 0.2s',
  })

  const btnStyle = (color: string, outline = false) => ({
    padding: '10px 22px', borderRadius: '8px', fontSize: '13px',
    fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
    border: outline ? `1px solid ${color}40` : 'none',
    background: outline ? `${color}18` : color,
    color: outline ? color : '#fff',
    opacity: loading ? 0.6 : 1,
    transition: 'all 0.2s',
  })

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; } input::placeholder { color: rgba(255,255,255,0.2); }`}</style>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '4px' }}>
          WOLV Staking
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
          Stake BNB or BUSD — earn WOLV rewards live on BNB Smart Chain
        </p>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px', marginBottom: '28px' }}>
        {[
          { label: 'Reward Pool',      value: `${poolBalanceFmt} WOLV`, color: '#00a896' },
          { label: 'BNB Price',        value: bnbPriceFmt,              color: '#f59e0b' },
          { label: '1 WOLV =',         value: '$1.00 USD',              color: '#3b82f6' },
          { label: 'My Pending',       value: isConnected ? `${totalPending.toLocaleString(undefined, { maximumFractionDigits: 4 })} WOLV` : '—', color: '#8b5cf6' },
          { label: 'My Staked (USD)',  value: isConnected ? `$${totalStakedUSD.toLocaleString()}` : '—', color: '#10b981' },
        ].map(s => (
          <div key={s.label} style={{ borderRadius: '12px', padding: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{s.label}</div>
            <div style={{ color: s.color, fontWeight: 700, fontSize: '14px', fontFamily: 'monospace' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Global feedback */}
      {error   && <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '13px', marginBottom: '16px' }}>❌ {error}</div>}
      {success && <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399', fontSize: '13px', marginBottom: '16px' }}>
        {success}
        {txHash && <a href={`https://bscscan.com/tx/${txHash}`} target="_blank" rel="noreferrer" style={{ marginLeft: '8px', color: '#00a896', textDecoration: 'underline' }}>View on BSCScan ↗</a>}
      </div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {(['stake', 'positions'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setError(''); setSuccess('') }} style={{
            padding: '9px 22px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', border: 'none',
            background: tab === t ? '#2A52BE' : 'rgba(255,255,255,0.06)',
            color: tab === t ? '#fff' : 'rgba(255,255,255,0.4)',
          }}>
            {t === 'stake' ? '⬡ Stake' : `📊 My Positions${stakeCount && stakeCount > 0n ? ` (${stakeCount})` : ''}`}
          </button>
        ))}
      </div>

      {/* ── STAKE TAB ── */}
      {tab === 'stake' && (
        <>
          {/* Plan cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '12px', marginBottom: '28px' }}>
            {PLANS.map(p => (
              <div key={p.id} onClick={() => setSelectedPlan(p.id)} style={cardStyle(selectedPlan === p.id, p.color)}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '16px', marginBottom: '10px' }}>⬡</div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px', marginBottom: '2px' }}>{p.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginBottom: '10px' }}>{p.sub}</div>
                <div style={{ color: p.color, fontWeight: 800, fontSize: '26px', fontFamily: 'monospace', marginBottom: '2px' }}>{p.apyLabel}</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', marginBottom: '4px' }}>APY</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>Min {p.min} · Exit {p.exitFee}</div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div style={{ maxWidth: '460px' }}>
            {/* Token toggle */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {(['BNB', 'BUSD'] as Token[]).map(t => (
                <button key={t} onClick={() => setToken(t)} style={{
                  padding: '8px 24px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', border: 'none',
                  background: token === t ? plan.color : 'rgba(255,255,255,0.06)',
                  color: token === t ? '#fff' : 'rgba(255,255,255,0.4)',
                }}>{t}</button>
              ))}
            </div>

            {/* Amount */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                Amount ({token})
              </label>
              <input
                type="number" min="0" step="0.01" value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder={`Enter ${token} amount`}
                style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
              />
              {token === 'BNB' && bnbPrice && amount && (
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '5px' }}>
                  ≈ ${(Number(amount) * Number(bnbPrice) / 1e8).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD at current BNB price
                </div>
              )}
            </div>

            {/* Preview */}
            {amount && Number(amount) > 0 && (
              <div style={{ padding: '18px', borderRadius: '14px', background: 'rgba(42,82,190,0.08)', border: '1px solid rgba(42,82,190,0.2)', marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                  Stake Preview
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    ['Plan',         plan.name],
                    ['APY',          plan.apyLabel],
                    ['Lock Period',  `${plan.lockDays} days`],
                    ['Est. Reward',  `~${estimatedReward()} WOLV`],
                    ['Exit Fee',     plan.exitFee],
                    ['Paid In',      'WOLV ($1 each)'],
                  ].map(([l, v]) => (
                    <div key={l}>
                      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>{l}</div>
                      <div style={{ color: '#93c5fd', fontWeight: 600, fontSize: '13px' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={handleStake} disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: '10px', fontSize: '15px',
              fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? 'rgba(255,255,255,0.1)' : `linear-gradient(135deg,${plan.color},${plan.color}cc)`,
              color: '#fff', transition: 'all 0.2s',
              boxShadow: loading ? 'none' : `0 8px 24px ${plan.color}40`,
            }}>
              {!isConnected ? '🔗 Connect Wallet to Stake' : loading ? 'Processing...' : `Stake ${token} → Earn WOLV`}
            </button>

            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', marginTop: '10px', lineHeight: 1.6 }}>
              Funds locked for {plan.lockDays} days. Early exit incurs {plan.exitFee} fee on principal. Rewards paid in WOLV at $1/WOLV. Principal at risk.
            </p>
          </div>
        </>
      )}

      {/* ── POSITIONS TAB ── */}
      {tab === 'positions' && (
        <div>
          {!isConnected && (
            <div style={{ textAlign: 'center', padding: '48px 24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>Connect your wallet to view your staking positions</p>
              <button onClick={() => openConnectModal?.()} style={{ padding: '12px 28px', borderRadius: '10px', background: '#2A52BE', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                Connect Wallet
              </button>
            </div>
          )}

          {isConnected && posLoading && (
            <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
              Loading live on-chain data...
            </div>
          )}

          {isConnected && !posLoading && positions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>⬡</div>
              <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>No active staking positions found</p>
              <button onClick={() => setTab('stake')} style={{ padding: '10px 24px', borderRadius: '8px', background: '#2A52BE', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                Start Staking →
              </button>
            </div>
          )}

          {isConnected && !posLoading && positions.length > 0 && (
            <>
              {/* Refresh row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
                  Last updated: {lastRefresh ? new Date(lastRefresh).toLocaleTimeString() : '—'} · Auto-refreshes every 30s
                </div>
                <button onClick={loadPositions} disabled={posLoading} style={{ padding: '6px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: '12px', cursor: 'pointer', fontWeight: 500 }}>
                  ↻ Refresh
                </button>
              </div>

              {/* Positions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {positions.map((p) => {
                  const plan      = PLANS[p.planId]
                  const unlocks   = Number(p.unlocksAt)
                  const locked    = now < unlocks
                  const daysLeft  = locked ? Math.ceil((unlocks - now) / 86400) : 0
                  const usd       = Number(p.amountUSD) / 1e8
                  const pending   = Number(formatUnits(p.pendingReward, 18))
                  const progress  = Math.min(100, Math.round(((now - Number(p.stakedAt)) / (unlocks - Number(p.stakedAt))) * 100))

                  return (
                    <div key={p.stakeId} style={{ borderRadius: '18px', padding: '22px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${plan.color}35` }}>
                      {/* Position header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${plan.color}20`, border: `1px solid ${plan.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: plan.color, fontSize: '16px' }}>⬡</div>
                          <div>
                            <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>{plan.name}</div>
                            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>{p.token === 0 ? 'BNB' : 'BUSD'} · {plan.apyLabel} APY · Stake #{p.stakeId}</div>
                          </div>
                        </div>
                        <div style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: 600, background: locked ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)', color: locked ? '#f59e0b' : '#34d399', border: `1px solid ${locked ? '#f59e0b' : '#34d399'}30` }}>
                          {locked ? `🔒 ${daysLeft}d left` : '✅ Unlocked'}
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>Lock Progress</span>
                          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{progress}%</span>
                        </div>
                        <div style={{ height: '5px', borderRadius: '99px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg,${plan.color},${plan.color}99)`, borderRadius: '99px', transition: 'width 0.5s ease' }} />
                        </div>
                      </div>

                      {/* Stats grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px,1fr))', gap: '10px', marginBottom: '16px' }}>
                        {[
                          { label: 'Staked (USD)',    value: `$${usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, color: plan.color },
                          { label: 'Pending WOLV',   value: `${pending.toLocaleString(undefined, { maximumFractionDigits: 4 })} WOLV`, color: '#00a896', live: true },
                          { label: 'Stake Date',      value: new Date(Number(p.stakedAt) * 1000).toLocaleDateString(), color: 'rgba(255,255,255,0.6)' },
                          { label: 'Unlocks',         value: new Date(unlocks * 1000).toLocaleDateString(), color: locked ? '#f59e0b' : '#34d399' },
                        ].map(({ label, value, color, live }) => (
                          <div key={label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '10px 12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
                              {live && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#00a896', display: 'inline-block', boxShadow: '0 0 6px #00a896' }} title="Live from blockchain" />}
                            </div>
                            <div style={{ color, fontWeight: 700, fontSize: '13px', fontFamily: 'monospace' }}>{value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {!locked && !p.claimed && (
                          <button onClick={() => handleClaim(p.stakeId)} disabled={loading || pending === 0} style={btnStyle('#00a896')}>
                            Claim {pending > 0 ? `${pending.toFixed(2)} WOLV` : 'Rewards'}
                          </button>
                        )}
                        {locked && (
                          <button onClick={() => handleExit(p.stakeId)} disabled={loading} style={btnStyle('#ef4444', true)}>
                            Early Exit ({plan.exitFee} fee)
                          </button>
                        )}
                        <a href={`https://bscscan.com/address/${STAKING_ADDRESS}#readContract`} target="_blank" rel="noreferrer" style={{ ...btnStyle('#2A52BE', true), textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                          Verify on BSCScan ↗
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
