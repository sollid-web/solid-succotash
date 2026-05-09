'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { parseUnits, formatUnits } from 'viem';

// ── Contracts ─────────────────────────────────────────────────────────────────
const WOLV_V2      = '0xe0167279aef7bf4ad313d261da82e8366822270c' as const;
const POOL         = '0xb233cf74b14abf9d9702d585c540030125599579' as const;
const STAKING      = '0x4b62efee5695ed55cd362a0b818f4c5f9694322b' as const;

// ── ABIs ──────────────────────────────────────────────────────────────────────
const ERC20_ABI = [
  { name: 'balanceOf',   type: 'function', stateMutability: 'view',       inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { name: 'approve',     type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'spender', type: 'address' }, { name: 'value', type: 'uint256' }], outputs: [{ type: 'bool' }] },
  { name: 'allowance',   type: 'function', stateMutability: 'view',       inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { name: 'totalSupply', type: 'function', stateMutability: 'view',       inputs: [], outputs: [{ type: 'uint256' }] },
] as const;

const POOL_ABI = [
  { name: 'poolBalance',       type: 'function', stateMutability: 'view',       inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'fund',              type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'amount', type: 'uint256' }], outputs: [] },
  { name: 'queueWithdraw',     type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'amount', type: 'uint256' }], outputs: [] },
  { name: 'executeWithdraw',   type: 'function', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { name: 'cancelWithdraw',    type: 'function', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { name: 'withdrawUnlocksAt', type: 'function', stateMutability: 'view',       inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'pendingWithdrawAmount', type: 'function', stateMutability: 'view',   inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'stakingSet',        type: 'function', stateMutability: 'view',       inputs: [], outputs: [{ type: 'bool' }] },
] as const;

const STAKING_ABI = [
  { name: 'paused',       type: 'function', stateMutability: 'view',       inputs: [], outputs: [{ type: 'bool' }] },
  { name: 'setPaused',    type: 'function', stateMutability: 'nonpayable', inputs: [{ name: '_paused', type: 'bool' }], outputs: [] },
  { name: 'getBnbPrice',  type: 'function', stateMutability: 'view',       inputs: [], outputs: [{ type: 'uint256' }] },
] as const;

type Tab = 'overview' | 'fund' | 'withdraw' | 'emergency'

export default function WolvAdminPage() {
  const { address, isConnected } = useAccount();
  const { openConnectModal }     = useConnectModal();
  const { writeContractAsync }   = useWriteContract();

  const [tab, setTab]           = useState<Tab>('overview');
  const [fundAmt, setFundAmt]   = useState('');
  const [wdAmt, setWdAmt]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [txHash, setTxHash]     = useState('');

  // ── Reads ─────────────────────────────────────────────────────────────────
  const { data: treasuryBalance, refetch: refetchTreasury } = useReadContract({
    address: WOLV_V2, abi: ERC20_ABI, functionName: 'balanceOf',
    args: address ? [address] : undefined, query: { enabled: !!address },
  });
  const { data: poolBalance, refetch: refetchPool } = useReadContract({
    address: POOL, abi: POOL_ABI, functionName: 'poolBalance',
  });
  const { data: totalSupply } = useReadContract({
    address: WOLV_V2, abi: ERC20_ABI, functionName: 'totalSupply',
  });
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: WOLV_V2, abi: ERC20_ABI, functionName: 'allowance',
    args: address ? [address, POOL] : undefined, query: { enabled: !!address },
  });
  const { data: stakingPaused } = useReadContract({
    address: STAKING, abi: STAKING_ABI, functionName: 'paused',
  });
  const { data: bnbPrice } = useReadContract({
    address: STAKING, abi: STAKING_ABI, functionName: 'getBnbPrice',
  });
  const { data: withdrawUnlocksAt, refetch: refetchWd } = useReadContract({
    address: POOL, abi: POOL_ABI, functionName: 'withdrawUnlocksAt',
  });
  const { data: pendingWdAmt } = useReadContract({
    address: POOL, abi: POOL_ABI, functionName: 'pendingWithdrawAmount',
  });
  const { data: stakingSet } = useReadContract({
    address: POOL, abi: POOL_ABI, functionName: 'stakingSet',
  });

  // ── Helpers ───────────────────────────────────────────────────────────────
  const fmt  = (v?: bigint) => v ? Number(formatUnits(v, 18)).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0';
  const reset = () => { setError(''); setSuccess(''); setTxHash(''); };

  const now = Math.floor(Date.now() / 1000);
  const wdUnlocks  = withdrawUnlocksAt ? Number(withdrawUnlocksAt) : 0;
  const wdPending  = wdUnlocks > 0;
  const wdReady    = wdPending && now >= wdUnlocks;
  const wdHoursLeft = wdPending && !wdReady ? Math.ceil((wdUnlocks - now) / 3600) : 0;

  // ── Fund pool ─────────────────────────────────────────────────────────────
  const handleFund = async () => {
    reset();
    if (!fundAmt || isNaN(Number(fundAmt)) || Number(fundAmt) <= 0) return setError('Enter a valid amount');
    setLoading(true);
    try {
      const amt = parseUnits(fundAmt, 18);
      // Check allowance first
      if (!allowance || (allowance as bigint) < amt) {
        setSuccess('Step 1/2: Approving WOLV...');
        const approveHash = await writeContractAsync({
          address: WOLV_V2, abi: ERC20_ABI, functionName: 'approve',
          args: [POOL, amt],
        });
        setSuccess('Approval submitted. Waiting...');
        await new Promise(r => setTimeout(r, 5000));
        await refetchAllowance();
      }
      setSuccess('Step 2/2: Funding pool...');
      const hash = await writeContractAsync({
        address: POOL, abi: POOL_ABI, functionName: 'fund', args: [amt],
      });
      setTxHash(hash);
      setSuccess(`✅ ${fundAmt} WOLV funded into reward pool`);
      setFundAmt('');
      await refetchPool();
      await refetchTreasury();
    } catch (e: any) { setError(e?.shortMessage || e?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  // ── Queue withdraw ────────────────────────────────────────────────────────
  const handleQueueWithdraw = async () => {
    reset();
    if (!wdAmt || isNaN(Number(wdAmt)) || Number(wdAmt) <= 0) return setError('Enter a valid amount');
    setLoading(true);
    try {
      const hash = await writeContractAsync({
        address: POOL, abi: POOL_ABI, functionName: 'queueWithdraw', args: [parseUnits(wdAmt, 18)],
      });
      setTxHash(hash);
      setSuccess(`✅ Withdrawal of ${wdAmt} WOLV queued. Executable in 48 hours.`);
      setWdAmt('');
      await refetchWd();
    } catch (e: any) { setError(e?.shortMessage || e?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  // ── Execute withdraw ──────────────────────────────────────────────────────
  const handleExecuteWithdraw = async () => {
    reset(); setLoading(true);
    try {
      const hash = await writeContractAsync({
        address: POOL, abi: POOL_ABI, functionName: 'executeWithdraw',
      });
      setTxHash(hash);
      setSuccess('✅ Withdrawal executed');
      await refetchPool(); await refetchTreasury(); await refetchWd();
    } catch (e: any) { setError(e?.shortMessage || e?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  // ── Cancel withdraw ───────────────────────────────────────────────────────
  const handleCancelWithdraw = async () => {
    reset(); setLoading(true);
    try {
      const hash = await writeContractAsync({
        address: POOL, abi: POOL_ABI, functionName: 'cancelWithdraw',
      });
      setTxHash(hash);
      setSuccess('✅ Withdrawal cancelled');
      await refetchWd();
    } catch (e: any) { setError(e?.shortMessage || e?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  // ── Pause staking ─────────────────────────────────────────────────────────
  const handlePause = async (pause: boolean) => {
    reset(); setLoading(true);
    try {
      const hash = await writeContractAsync({
        address: STAKING, abi: STAKING_ABI, functionName: 'setPaused', args: [pause],
      });
      setTxHash(hash);
      setSuccess(`✅ Staking ${pause ? 'paused' : 'resumed'}`);
    } catch (e: any) { setError(e?.shortMessage || e?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const inputStyle = { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' as const };
  const btn = (color = '#00a896', disabled = false) => ({ background: disabled ? 'rgba(255,255,255,0.06)' : color, color: disabled ? 'rgba(255,255,255,0.3)' : '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: disabled ? 'not-allowed' as const : 'pointer' as const, width: '100%', marginTop: '8px' });

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview',  label: 'Overview',  icon: '📊' },
    { id: 'fund',      label: 'Fund Pool', icon: '💰' },
    { id: 'withdraw',  label: 'Withdraw',  icon: '🔐' },
    { id: 'emergency', label: 'Emergency', icon: '🛡️' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', fontFamily: "'DM Sans', system-ui, sans-serif", padding: '24px 16px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap'); input::placeholder { color: rgba(255,255,255,0.25); }`}</style>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>WolvCapital Admin</div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', marginBottom: '4px' }}>WOLV Staking Admin</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: 0 }}>Manage reward pool, monitor staking, emergency controls</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Treasury Balance', value: `${fmt(treasuryBalance as bigint)} WOLV`, color: '#00a896' },
            { label: 'Reward Pool',      value: `${fmt(poolBalance as bigint)} WOLV`,     color: '#3b82f6' },
            { label: 'Total Supply',     value: `${fmt(totalSupply as bigint)} WOLV`,      color: '#8b5cf6' },
            { label: 'BNB Price',        value: bnbPrice ? `$${(Number(bnbPrice)/1e8).toFixed(2)}` : '—', color: '#f59e0b' },
            { label: 'Staking',          value: stakingPaused ? '⏸ Paused' : '✅ Active',  color: stakingPaused ? '#ef4444' : '#10b981' },
            { label: 'Pool Linked',      value: stakingSet ? '✅ Yes' : '❌ No',            color: stakingSet ? '#10b981' : '#ef4444' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '16px' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{s.label}</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: s.color, fontFamily: 'monospace' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Wallet connect */}
        {!isConnected ? (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,168,150,0.2)', borderRadius: '16px', padding: '32px', textAlign: 'center', marginBottom: '24px' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>Connect your treasury wallet to manage the reward pool</p>
            <button onClick={() => openConnectModal?.()} style={btn()}>Connect Treasury Wallet</button>
          </div>
        ) : (
          <div style={{ background: 'rgba(0,168,150,0.08)', border: '1px solid rgba(0,168,150,0.2)', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00a896', display: 'inline-block' }} />
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>{address?.slice(0,6)}...{address?.slice(-4)}</span>
            <span style={{ fontSize: '12px', color: '#00a896', marginLeft: 'auto' }}>Treasury Connected</span>
          </div>
        )}

        {/* Contract links */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {[
            { label: 'WOLV Token', addr: WOLV_V2 },
            { label: 'Reward Pool', addr: POOL },
            { label: 'Staking', addr: STAKING },
          ].map(c => (
            <a key={c.addr} href={`https://bscscan.com/address/${c.addr}`} target="_blank" rel="noreferrer"
              style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
              {c.label} ↗
            </a>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); reset(); }} style={{ padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: 'none', background: tab === t.id ? 'rgba(0,168,150,0.2)' : 'rgba(255,255,255,0.04)', color: tab === t.id ? '#00a896' : 'rgba(255,255,255,0.5)', borderBottom: tab === t.id ? '2px solid #00a896' : '2px solid transparent' }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px' }}>

          {tab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ color: '#fff', margin: 0 }}>System Status</h3>
              {[
                ['WOLV Token', WOLV_V2, 'Fixed supply · No mint · No pause'],
                ['Reward Pool', POOL, '48hr timelock on withdrawals'],
                ['Staking Contract', STAKING, 'Chainlink BNB/USD · 4 plans'],
              ].map(([name, addr, desc]) => (
                <div key={addr} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>{name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginTop: '2px' }}>{desc}</div>
                      <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', fontFamily: 'monospace', marginTop: '4px' }}>{addr}</div>
                    </div>
                    <span style={{ color: '#10b981', fontSize: '20px' }}>✅</span>
                  </div>
                </div>
              ))}
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                💡 To top up rewards: go to <strong style={{ color: '#fff' }}>Fund Pool</strong> tab → enter WOLV amount → confirm. Do this monthly or when pool runs low.
              </div>
            </div>
          )}

          {tab === 'fund' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ color: '#fff', margin: 0 }}>Fund Reward Pool</h3>
              <div style={{ padding: '14px 16px', borderRadius: '10px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                Current pool balance: <strong style={{ color: '#3b82f6' }}>{fmt(poolBalance as bigint)} WOLV</strong>
                <br />Your treasury: <strong style={{ color: '#00a896' }}>{fmt(treasuryBalance as bigint)} WOLV</strong>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>WOLV Amount to Fund</label>
                <input style={inputStyle} type="number" placeholder="e.g. 500000" value={fundAmt} onChange={e => setFundAmt(e.target.value)} />
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '6px' }}>This will trigger an approve + fund transaction if needed.</p>
              </div>
              <button onClick={handleFund} disabled={loading || !isConnected} style={btn('#00a896', loading || !isConnected)}>
                {loading ? 'Processing...' : '💰 Fund Reward Pool'}
              </button>
            </div>
          )}

          {tab === 'withdraw' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ color: '#fff', margin: 0 }}>Emergency Withdraw (48hr Timelock)</h3>
              <div style={{ padding: '14px 16px', borderRadius: '10px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', fontSize: '13px', color: '#fbbf24' }}>
                ⚠️ Withdrawals are visible on-chain for 48 hours before execution. This protects investors.
              </div>

              {wdPending && (
                <div style={{ padding: '14px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '13px', color: '#fca5a5' }}>
                  Pending withdrawal: <strong>{fmt(pendingWdAmt as bigint)} WOLV</strong>
                  <br />{wdReady ? '✅ Ready to execute' : `⏳ Unlocks in ${wdHoursLeft} hours`}
                </div>
              )}

              {!wdPending && (
                <div>
                  <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>WOLV Amount</label>
                  <input style={inputStyle} type="number" placeholder="e.g. 100000" value={wdAmt} onChange={e => setWdAmt(e.target.value)} />
                  <button onClick={handleQueueWithdraw} disabled={loading || !isConnected} style={btn('#f59e0b', loading || !isConnected)}>
                    {loading ? 'Processing...' : '🔐 Queue Withdrawal (starts 48hr timer)'}
                  </button>
                </div>
              )}

              {wdPending && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button onClick={handleExecuteWithdraw} disabled={loading || !isConnected || !wdReady} style={btn('#10b981', loading || !isConnected || !wdReady)}>
                    ✅ Execute
                  </button>
                  <button onClick={handleCancelWithdraw} disabled={loading || !isConnected} style={btn('#ef4444', loading || !isConnected)}>
                    ❌ Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === 'emergency' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ color: '#fff', margin: 0 }}>Emergency Controls</h3>
              <div style={{ padding: '14px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '13px', color: '#fca5a5' }}>
                ⚠️ Pausing stops all staking and claiming. Use only in emergencies.
              </div>
              <div style={{ padding: '14px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                Staking status: <strong style={{ color: stakingPaused ? '#ef4444' : '#10b981' }}>{stakingPaused ? '⏸ Paused' : '✅ Active'}</strong>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button onClick={() => handlePause(true)} disabled={loading || !isConnected || !!stakingPaused} style={btn('#ef4444', loading || !isConnected || !!stakingPaused)}>
                  ⏸ Pause Staking
                </button>
                <button onClick={() => handlePause(false)} disabled={loading || !isConnected || !stakingPaused} style={btn('#10b981', loading || !isConnected || !stakingPaused)}>
                  ▶️ Resume Staking
                </button>
              </div>
            </div>
          )}

          {/* Feedback */}
          {error   && <div style={{ marginTop: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#fca5a5' }}>❌ {error}</div>}
          {success && (
            <div style={{ marginTop: '16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#6ee7b7' }}>
              {success}
              {txHash && <div style={{ marginTop: '8px' }}><a href={`https://bscscan.com/tx/${txHash}`} target="_blank" rel="noreferrer" style={{ color: '#00a896', fontSize: '12px', fontFamily: 'monospace' }}>View on BSCScan ↗</a></div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}