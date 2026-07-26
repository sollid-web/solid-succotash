'use client';
import { useAccount, useDisconnect, useReadContract } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { formatUnits } from 'viem';

const WOLV_ADDRESS = '0xe0167279aef7bf4ad313d261da82e8366822270c' as const;
const WOLV_ABI = [
  { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] },
] as const;

export default function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();

  const { data: balance } = useReadContract({
    address: WOLV_ADDRESS,
    abi: WOLV_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const wolvBalance = balance ? parseFloat(formatUnits(balance, 18)).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0';

  if (!isConnected) {
    return (
      <button
        onClick={() => openConnectModal?.()}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '8px 14px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #2A52BE, #1E3A8A)',
          border: 'none', color: '#fff', fontSize: '12px',
          fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' as const,
          boxShadow: '0 4px 12px rgba(42,82,190,0.3)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 7H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
          <path d="M16 12h.01"/>
        </svg>
        Connect Wallet
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '10px', background: 'rgba(0,168,150,0.1)', border: '1px solid rgba(0,168,150,0.25)' }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00a896', display: 'inline-block', boxShadow: '0 0 6px #00a896' }} />
      <span style={{ fontSize: '12px', color: '#00a896', fontWeight: 700, fontFamily: 'monospace' }}>{wolvBalance} WOLV</span>
      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{address?.slice(0,4)}...{address?.slice(-3)}</span>
      <button onClick={() => disconnect()} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '11px', cursor: 'pointer', padding: '0 2px' }}>✕</button>
    </div>
  );
}
