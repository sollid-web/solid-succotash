'use client';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { WalletProviderClient } from '@/_client/WalletProviderClient';

const WOLV_ADDRESS = '0xe0167279aef7bf4ad313d261da82e8366822270c' as const;
const POOL_ADDRESS = '0xb233cf74b14abf9d9702d585c540030125599579' as const;
const BURN_ADDRESS = '0x000000000000000000000000000000000000dEaD' as const;

const ERC20_ABI = [
  { name: 'totalSupply', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'balanceOf',   type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] },
] as const;

const POOL_ABI = [
  { name: 'poolBalance', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
] as const;

function fmt(val: bigint | undefined, decimals = 18) {
  if (!val) return '—';
  return Number(formatUnits(val, decimals)).toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function MetricCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}30`, borderRadius: '16px', padding: '20px' }}>
      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' as const, letterSpacing: '1.5px', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontSize: '24px', fontWeight: 700, color, fontFamily: "'DM Mono', monospace", marginBottom: '4px' }}>{value}</div>
      {sub && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{sub}</div>}
    </div>
  );
}

function Metrics() {
  const { data: totalSupply, isLoading: l1 } = useReadContract({ address: WOLV_ADDRESS, abi: ERC20_ABI, functionName: 'totalSupply' });
  const { data: burnedSupply, isLoading: l2 } = useReadContract({ address: WOLV_ADDRESS, abi: ERC20_ABI, functionName: 'balanceOf', args: [BURN_ADDRESS] });
  const { data: poolBalance, isLoading: l3 } = useReadContract({ address: POOL_ADDRESS, abi: POOL_ABI, functionName: 'poolBalance' });
  const { data: treasuryBalance, isLoading: l4 } = useReadContract({ address: WOLV_ADDRESS, abi: ERC20_ABI, functionName: 'balanceOf', args: ['0x1dFCbcD65466E4f5EAdecC5f17E3DBc6E1dD05BA'] });

  const circulating = totalSupply && burnedSupply ? totalSupply - burnedSupply : undefined;
  const loading = l1 || l2 || l3 || l4;

  return (
    <div style={{ background: 'linear-gradient(135deg, #0a0f1e, #0f1a35)', border: '1px solid rgba(42,82,190,0.25)', borderRadius: '20px', padding: '32px', marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: loading ? '#f59e0b' : '#00a896', display: 'inline-block', boxShadow: loading ? '0 0 8px #f59e0b' : '0 0 8px #00a896' }} />
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff', letterSpacing: '0.5px' }}>
          {loading ? 'Fetching live chain data...' : 'Live BNB Chain Data'}
        </span>
        <a href={`https://bscscan.com/token/${WOLV_ADDRESS}`} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', fontSize: '11px', color: '#2A52BE', textDecoration: 'none', fontWeight: 600 }}>
          Verify on BSCScan ↗
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        <MetricCard label="Total Minted Supply"    value={loading ? '...' : fmt(totalSupply)}    sub="Max 1,000,000,000 WOLV"     color="#2A52BE" />
        <MetricCard label="Circulating Supply"      value={loading ? '...' : fmt(circulating)}    sub="Minted minus burned"         color="#00a896" />
        <MetricCard label="Reward Pool Balance"     value={loading ? '...' : fmt(poolBalance)}    sub="Available for stakers"       color="#3b82f6" />
        <MetricCard label="Burned / Redeemed"       value={loading ? '...' : fmt(burnedSupply)}   sub="Permanently removed"         color="#60a5fa" />
      </div>

      <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(42,82,190,0.08)', borderRadius: '10px', fontSize: '11px', color: 'rgba(255,255,255,0.3)', textAlign: 'center' as const }}>
        Data pulled directly from BNB Smart Chain · Updates on every page load · No intermediaries
      </div>
    </div>
  );
}

export default function LiveChainMetrics() {
  return (
    <WalletProviderClient>
      <Metrics />
    </WalletProviderClient>
  );
}
