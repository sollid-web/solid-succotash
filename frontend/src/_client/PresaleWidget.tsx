'use client'
import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useReadContract, useChainId, useSwitchChain } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { formatUnits, parseEther } from 'viem'

const PRESALE_ADDRESS = '0x04b5c5e204e812c176ce632f3781ea88c500497c' as const

const PRESALE_ABI = [
  { name: 'buy', type: 'function', stateMutability: 'payable', inputs: [], outputs: [] },
  { name: 'priceUSD', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'hardCapUSD', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'totalRaisedUSD', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'startTime', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'endTime', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'paused', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'bool' }] },
  { name: 'purchasedWOLV', type: 'function', stateMutability: 'view', inputs: [{ name: 'buyer', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { name: 'getBnbPrice', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
] as const

function formatDuration(seconds: number) {
  if (seconds <= 0) return '0d 0h 0m 0s'
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${d}d ${h}h ${m}m ${s}s`
}

export default function PresaleWidget() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const { openConnectModal } = useConnectModal() || {}
  const { writeContractAsync } = useWriteContract()

  const [bnbAmount, setBnbAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000))

  useEffect(() => {
    const interval = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000)
    return () => clearInterval(interval)
  }, [])

  const { data: priceUSD } = useReadContract({ address: PRESALE_ADDRESS, abi: PRESALE_ABI, functionName: 'priceUSD' })
  const { data: hardCapUSD } = useReadContract({ address: PRESALE_ADDRESS, abi: PRESALE_ABI, functionName: 'hardCapUSD' })
  const { data: totalRaisedUSD, refetch: refetchRaised } = useReadContract({ address: PRESALE_ADDRESS, abi: PRESALE_ABI, functionName: 'totalRaisedUSD' })
  const { data: startTime } = useReadContract({ address: PRESALE_ADDRESS, abi: PRESALE_ABI, functionName: 'startTime' })
  const { data: endTime } = useReadContract({ address: PRESALE_ADDRESS, abi: PRESALE_ABI, functionName: 'endTime' })
  const { data: paused } = useReadContract({ address: PRESALE_ADDRESS, abi: PRESALE_ABI, functionName: 'paused' })
  const { data: bnbPrice } = useReadContract({ address: PRESALE_ADDRESS, abi: PRESALE_ABI, functionName: 'getBnbPrice' })
  const { data: purchased, refetch: refetchPurchased } = useReadContract({
    address: PRESALE_ADDRESS, abi: PRESALE_ABI, functionName: 'purchasedWOLV',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const priceFmt = priceUSD ? Number(priceUSD) / 1e8 : undefined
  const hardCapFmt = hardCapUSD ? Number(hardCapUSD) / 1e8 : undefined
  const raisedFmt = totalRaisedUSD ? Number(totalRaisedUSD) / 1e8 : 0
  const bnbPriceFmt = bnbPrice ? Number(bnbPrice) / 1e8 : undefined
  const progress = hardCapFmt ? Math.min(100, Math.round((raisedFmt / hardCapFmt) * 100)) : 0
  const purchasedFmt = purchased ? Number(formatUnits(purchased as bigint, 18)) : 0

  const started = startTime !== undefined ? now >= Number(startTime) : false
  const ended = endTime !== undefined ? now >= Number(endTime) : false
  const soldOut = hardCapFmt !== undefined && raisedFmt >= hardCapFmt
  const isPaused = Boolean(paused)
  const isLive = started && !ended && !soldOut && !isPaused
  const wrongChain = isConnected && chainId !== 56

  const estimatedWolv = () => {
    if (!bnbAmount || isNaN(Number(bnbAmount)) || !priceFmt || !bnbPriceFmt) return '—'
    const usd = Number(bnbAmount) * bnbPriceFmt
    return (usd / priceFmt).toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  const handleBuy = async () => {
    setError(''); setSuccess('')
    if (!isConnected || !address) return openConnectModal?.()
    if (wrongChain) { setError('Switch to BNB Smart Chain to continue'); return }
    if (!bnbAmount || isNaN(Number(bnbAmount)) || Number(bnbAmount) <= 0) return setError('Enter a valid BNB amount')
    if (!isLive) return setError('The presale is not currently open for purchases')

    setLoading(true)
    try {
      const hash = await writeContractAsync({
        address: PRESALE_ADDRESS, abi: PRESALE_ABI,
        functionName: 'buy', args: [], value: parseEther(bnbAmount),
      })
      setTxHash(hash)
      setSuccess(`✅ Purchase submitted! Tx: ${hash.slice(0, 10)}...`)
      setBnbAmount('')
      await Promise.all([refetchRaised(), refetchPurchased()])
    } catch (e: any) {
      setError(e?.shortMessage || e?.message || 'Transaction failed')
    } finally {
      setLoading(false)
    }
  }

  let countdownLabel = ''
  let countdownValue = ''
  if (!started && startTime !== undefined) {
    countdownLabel = 'Sale opens in'
    countdownValue = formatDuration(Number(startTime) - now)
  } else if (started && !ended && endTime !== undefined) {
    countdownLabel = 'Sale ends in'
    countdownValue = formatDuration(Number(endTime) - now)
  }

  let statusBadge = { text: 'Loading…', color: 'rgba(255,255,255,0.3)' }
  if (isPaused) statusBadge = { text: '⏸ Sale Paused', color: '#f59e0b' }
  else if (soldOut) statusBadge = { text: '🎉 Sold Out', color: '#8b5cf6' }
  else if (ended) statusBadge = { text: 'Sale Ended', color: 'rgba(255,255,255,0.5)' }
  else if (startTime !== undefined && !started) statusBadge = { text: 'Opening Soon', color: '#3b82f6' }
  else if (isLive) statusBadge = { text: '🔥 Live Now', color: '#00a896' }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", maxWidth: '520px', margin: '0 auto' }}>
      {/* Status + countdown */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '99px',
          background: `${statusBadge.color}18`, border: `1px solid ${statusBadge.color}40`,
          color: statusBadge.color, fontSize: '13px', fontWeight: 700,
        }}>
          {statusBadge.text}
        </span>
        {countdownValue && (
          <div style={{ marginTop: '14px' }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{countdownLabel}</div>
            <div style={{ color: '#fff', fontSize: '24px', fontWeight: 700, fontFamily: 'monospace' }}>{countdownValue}</div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Price', value: priceFmt ? `$${priceFmt.toFixed(2)}` : '—' },
          { label: 'Hard Cap', value: hardCapFmt ? `$${hardCapFmt.toLocaleString()}` : '—' },
          { label: 'Raised', value: `$${raisedFmt.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
        ].map(s => (
          <div key={s.label} style={{ borderRadius: '12px', padding: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{s.label}</div>
            <div style={{ color: '#00c9b1', fontWeight: 700, fontSize: '14px', fontFamily: 'monospace' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>Progress to hard cap</span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{progress}%</span>
        </div>
        <div style={{ height: '8px', borderRadius: '99px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#2A52BE,#00a896)', borderRadius: '99px', transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {/* Feedback */}
      {error && <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '13px', marginBottom: '16px' }}>❌ {error}</div>}
      {success && (
        <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399', fontSize: '13px', marginBottom: '16px' }}>
          {success}
          {txHash && <a href={`https://bscscan.com/tx/${txHash}`} target="_blank" rel="noreferrer" style={{ marginLeft: '8px', color: '#00a896', textDecoration: 'underline' }}>View on BSCScan ↗</a>}
        </div>
      )}
      {wrongChain && (
        <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', textAlign: 'center', marginBottom: '16px' }}>
          <p style={{ color: '#fca5a5', fontSize: '13px', fontWeight: 600, margin: '0 0 10px' }}>Wrong network — switch to BNB Chain</p>
          <button type="button" onClick={() => switchChain({ chainId: 56 })} disabled={isSwitching}
            style={{ width: '100%', padding: '11px', borderRadius: '12px', background: '#ef4444', border: 'none', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', opacity: isSwitching ? 0.6 : 1 }}>
            {isSwitching ? 'Switching…' : 'Switch to BNB Chain'}
          </button>
        </div>
      )}

      {/* Buy form */}
      <div>
        <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
          Amount (BNB)
        </label>
        <input
          type="number" min="0" step="0.01" value={bnbAmount}
          onChange={e => setBnbAmount(e.target.value)}
          placeholder="Enter BNB amount"
          disabled={!isLive}
          style={{ width: '100%', padding: '13px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box', opacity: isLive ? 1 : 0.5 }}
        />
        {bnbAmount && (
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '6px' }}>
            ≈ {estimatedWolv()} WOLV
          </div>
        )}

        <button onClick={handleBuy} disabled={loading || (!isLive && isConnected && !wrongChain)} style={{
          width: '100%', padding: '14px', borderRadius: '10px', fontSize: '15px', marginTop: '16px',
          fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          background: loading || (!isLive && isConnected) ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#2A52BE,#00a896)',
          color: '#fff', transition: 'all 0.2s',
          boxShadow: loading ? 'none' : '0 8px 24px rgba(0,168,150,0.3)',
        }}>
          {!isConnected ? '🔗 Connect Wallet to Buy' : loading ? 'Processing...' : !isLive ? statusBadge.text : 'Buy WOLV →'}
        </button>

        {isConnected && purchasedFmt > 0 && (
          <div style={{ marginTop: '14px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
            You've purchased <strong style={{ color: '#00c9b1' }}>{purchasedFmt.toLocaleString(undefined, { maximumFractionDigits: 2 })} WOLV</strong> so far
          </div>
        )}

        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', marginTop: '14px', lineHeight: 1.6, textAlign: 'center' }}>
          WOLV is delivered instantly to your wallet — no vesting, no lock-up. Presale contract:{' '}
          <a href={`https://bscscan.com/address/${PRESALE_ADDRESS}#code`} target="_blank" rel="noreferrer" style={{ color: '#93c5fd' }}>
            {PRESALE_ADDRESS.slice(0, 8)}...{PRESALE_ADDRESS.slice(-6)} ↗
          </a>
        </p>
      </div>
    </div>
  )
}
