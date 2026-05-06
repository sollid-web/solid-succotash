'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { parseUnits, formatUnits } from 'viem';

const WOLV_CONTRACT = '0xbcb3d35bcbbd141f1955aaf8f51b48b801b117bf' as const;

const WOLV_ABI = [
  { name: 'distributeProfits', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'investor', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [] },
  { name: 'distributeProfitsBatch', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'investors', type: 'address[]' }, { name: 'amounts', type: 'uint256[]' }], outputs: [] },
  { name: 'reclaimTokens', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'investor', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [] },
  { name: 'pause', type: 'function', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { name: 'unpause', type: 'function', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { name: 'totalSupply', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { name: 'remainingSupply', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { name: 'paused', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'bool' }] },
  { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] },
] as const;

type Tab = 'distribute' | 'batch' | 'reclaim' | 'emergency';

export default function WolvAdminPage() {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { writeContractAsync } = useWriteContract();

  const [tab, setTab] = useState<Tab>('distribute');
  const [investor, setInvestor] = useState('');
  const [amount, setAmount] = useState('');
  const [batchText, setBatchText] = useState('');
  const [reclaimAddress, setReclaimAddress] = useState('');
  const [reclaimAmount, setReclaimAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { data: totalSupply } = useReadContract({ address: WOLV_CONTRACT, abi: WOLV_ABI, functionName: 'totalSupply' });
  const { data: remainingSupply } = useReadContract({ address: WOLV_CONTRACT, abi: WOLV_ABI, functionName: 'remainingSupply' });
  const { data: isPaused } = useReadContract({ address: WOLV_CONTRACT, abi: WOLV_ABI, functionName: 'paused' });
  const { data: ownerBalance } = useReadContract({ address: WOLV_CONTRACT, abi: WOLV_ABI, functionName: 'balanceOf', args: address ? [address] : undefined, query: { enabled: !!address } });

  const fmt = (val: bigint | undefined) => val ? parseFloat(formatUnits(val, 18)).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0';
  const reset = () => { setError(''); setSuccess(''); setTxHash(''); };

  const inputStyle = { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' as const };
  const btnStyle = (color = '#00a896') => ({ background: `linear-gradient(135deg, ${color}, ${color}cc)`, color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' as const : 'pointer' as const, opacity: loading ? 0.6 : 1, width: '100%', marginTop: '8px' });

  const handleDistribute = async () => {
    reset();
    if (!investor || !amount) return setError('Fill in all fields.');
    if (!investor.startsWith('0x') || investor.length !== 42) return setError('Invalid wallet address.');
    setLoading(true);
    try {
      const hash = await writeContractAsync({ address: WOLV_CONTRACT, abi: WOLV_ABI, functionName: 'distributeProfits', args: [investor as `0x${string}`, parseUnits(amount, 18)] });
      setTxHash(hash); setSuccess(`✅ ${amount} WOLV minted to ${investor.slice(0,6)}...${investor.slice(-4)}`);
      setInvestor(''); setAmount('');
    } catch (e: any) { setError(e?.shortMessage || e?.message || 'Transaction failed.'); }
    finally { setLoading(false); }
  };

  const handleBatch = async () => {
    reset();
    const lines = batchText.trim().split('\n').filter(Boolean);
    if (!lines.length) return setError('Enter at least one line.');
    const investors: `0x${string}`[] = [];
    const amounts: bigint[] = [];
    for (const line of lines) {
      const [addr, amt] = line.split(',').map(s => s.trim());
      if (!addr || !amt) return setError(`Invalid line: "${line}". Format: address, amount`);
      investors.push(addr as `0x${string}`); amounts.push(parseUnits(amt, 18));
    }
    setLoading(true);
    try {
      const hash = await writeContractAsync({ address: WOLV_CONTRACT, abi: WOLV_ABI, functionName: 'distributeProfitsBatch', args: [investors, amounts] });
      setTxHash(hash); setSuccess(`✅ WOLV distributed to ${investors.length} investors`); setBatchText('');
    } catch (e: any) { setError(e?.shortMessage || e?.message || 'Transaction failed.'); }
    finally { setLoading(false); }
  };

  const handleReclaim = async () => {
    reset();
    if (!reclaimAddress || !reclaimAmount) return setError('Fill in all fields.');
    setLoading(true);
    try {
      const hash = await writeContractAsync({ address: WOLV_CONTRACT, abi: WOLV_ABI, functionName: 'reclaimTokens', args: [reclaimAddress as `0x${string}`, parseUnits(reclaimAmount, 18)] });
      setTxHash(hash); setSuccess(`✅ ${reclaimAmount} WOLV reclaimed`); setReclaimAddress(''); setReclaimAmount('');
    } catch (e: any) { setError(e?.shortMessage || e?.message || 'Transaction failed.'); }
    finally { setLoading(false); }
  };

  const handlePause = async (shouldPause: boolean) => {
    reset(); setLoading(true);
    try {
      const hash = await writeContractAsync({ address: WOLV_CONTRACT, abi: WOLV_ABI, functionName: shouldPause ? 'pause' : 'unpause' });
      setTxHash(hash); setSuccess(`✅ Contract ${shouldPause ? 'paused' : 'unpaused'}`);
    } catch (e: any) { setError(e?.shortMessage || e?.message || 'Transaction failed.'); }
    finally { setLoading(false); }
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'distribute', label: 'Distribute', icon: '📤' },
    { id: 'batch', label: 'Batch', icon: '📦' },
    { id: 'reclaim', label: 'Reclaim', icon: '🔥' },
    { id: 'emergency', label: 'Emergency', icon: '🛡️' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', fontFamily: "'DM Sans', system-ui, sans-serif", padding: '24px 16px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap'); input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.25); }`}</style>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>WolvCapital Admin</div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', marginBottom: '4px' }}>WOLV Token Manager</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: 0 }}>Mint, burn and manage WOLV profit tokens</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Total Minted', value: fmt(totalSupply) + ' WOLV', color: '#00a896' },
            { label: 'Remaining', value: fmt(remainingSupply) + ' WOLV', color: '#1a8fc1' },
            { label: 'Your Balance', value: fmt(ownerBalance) + ' WOLV', color: '#f59e0b' },
            { label: 'Status', value: isPaused ? '⏸ Paused' : '✅ Active', color: isPaused ? '#ef4444' : '#10b981' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '16px' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{s.label}</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: s.color, fontFamily: 'monospace' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {!isConnected ? (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,168,150,0.2)', borderRadius: '16px', padding: '32px', textAlign: 'center', marginBottom: '24px' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>Connect your owner wallet to manage WOLV tokens</p>
            <button onClick={() => openConnectModal?.()} style={btnStyle()}>Connect Owner Wallet</button>
          </div>
        ) : (
          <div style={{ background: 'rgba(0,168,150,0.08)', border: '1px solid rgba(0,168,150,0.2)', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00a896', display: 'inline-block' }} />
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            <span style={{ fontSize: '12px', color: '#00a896', marginLeft: 'auto' }}>Owner Connected</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); reset(); }} style={{ padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: 'none', background: tab === t.id ? 'rgba(0,168,150,0.2)' : 'rgba(255,255,255,0.04)', color: tab === t.id ? '#00a896' : 'rgba(255,255,255,0.5)', borderBottom: tab === t.id ? '2px solid #00a896' : '2px solid transparent' }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px' }}>
          {tab === 'distribute' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Investor Wallet Address</label>
                <input style={inputStyle} placeholder="0x..." value={investor} onChange={e => setInvestor(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>WOLV Amount</label>
                <input style={inputStyle} placeholder="e.g. 100" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
              <button onClick={handleDistribute} disabled={loading || !isConnected} style={btnStyle('#00a896')}>
                {loading ? 'Processing...' : '📤 Distribute Profits'}
              </button>
            </div>
          )}

          {tab === 'batch' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
                  One per line: <span style={{ color: '#00a896' }}>address, amount</span>
                </label>
                <textarea style={{ ...inputStyle, height: '180px', resize: 'vertical' as const, lineHeight: '1.6' }} placeholder={`0xABC...123, 100\n0xDEF...456, 250`} value={batchText} onChange={e => setBatchText(e.target.value)} />
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>{batchText.trim().split('\n').filter(Boolean).length} investors queued</div>
              </div>
              <button onClick={handleBatch} disabled={loading || !isConnected} style={btnStyle('#1a3a8f')}>
                {loading ? 'Processing...' : '📦 Batch Distribute'}
              </button>
            </div>
          )}

          {tab === 'reclaim' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#fca5a5' }}>
                ⚠️ Burns WOLV from investor wgit add -A && git commit -m "remove wolv admin link from nav" && git pushallet. Use only on withdrawal.
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Investor Wallet Address</label>
                <input style={inputStyle} placeholder="0x..." value={reclaimAddress} onChange={e => setReclaimAddress(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>WOLV Amount to Burn</label>
                <input style={inputStyle} placeholder="e.g. 100" type="number" value={reclaimAmount} onChange={e => setReclaimAmount(e.target.value)} />
              </div>
              <button onClick={handleReclaim} disabled={loading || !isConnected} style={btnStyle('#ef4444')}>
                {loading ? 'Processing...' : '🔥 Reclaim Tokens'}
              </button>
            </div>
          )}

          {tab === 'emergency' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', padding: '16px', fontSize: '13px', color: '#fbbf24' }}>
                ⚠️ Pausing freezes ALL WOLV transfers instantly.
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button onClick={() => handlePause(true)} disabled={loading || !isConnected || !!isPaused} style={{ ...btnStyle('#ef4444'), marginTop: 0, opacity: isPaused ? 0.4 : 1 }}>⏸️ Pause</button>
                <button onClick={() => handlePause(false)} disabled={loading || !isConnected || !isPaused} style={{ ...btnStyle('#10b981'), marginTop: 0, opacity: !isPaused ? 0.4 : 1 }}>▶️ Unpause</button>
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                Status: <span style={{ color: isPaused ? '#ef4444' : '#10b981', fontWeight: 600 }}>{isPaused ? '⏸ Paused' : '✅ Active'}</span>
              </div>
            </div>
          )}

          {error && <div style={{ marginTop: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#fca5a5' }}>❌ {error}</div>}
          {success && (
            <div style={{ marginTop: '16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#6ee7b7' }}>
              {success}
              {txHash && <div style={{ marginTop: '8px' }}><a href={`https://bscscan.com/tx/${txHash}`} target="_blank" rel="noopener noreferrer" style={{ color: '#00a896', fontSize: '12px', fontFamily: 'monospace' }}>View on BSCScan ↗</a></div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
