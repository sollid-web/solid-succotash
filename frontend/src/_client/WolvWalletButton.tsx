'use client';

import { useAccount, useConnect, useDisconnect, useReadContract } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';
import { formatUnits } from 'viem';
import { useState } from 'react';

const WOLV_CONTRACT = '0xbcb3d35bcbbd141f1955aaf8f51b48b801b117bf';
const WOLV_DECIMALS = 18;

const WOLV_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

export function WolvWalletButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const { data: balance } = useReadContract({
    address: WOLV_CONTRACT,
    abi: WOLV_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const formattedBalance = balance
    ? parseFloat(formatUnits(balance, WOLV_DECIMALS)).toLocaleString(undefined, { maximumFractionDigits: 2 })
    : '0';

  const addWolvToWallet = async () => {
    if (!(window as any).ethereum) return;
    setAdding(true);
    try {
      await (window as any).ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: { address: WOLV_CONTRACT, symbol: 'WOLV', decimals: WOLV_DECIMALS },
        },
      });
      setAdded(true);
    } catch (err) {
      console.error('Failed to add token:', err);
    } finally {
      setAdding(false);
    }
  };

  const connectMetaMask = () => {
    connect({ connector: injected() });
    setShowOptions(false);
    setTimeout(() => addWolvToWallet(), 1500);
  };

  const connectWalletConnect = () => {
    connect({
      connector: walletConnect({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
      }),
    });
    setShowOptions(false);
  };

  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|Android/i.test(navigator.userAgent);

  if (!isConnected) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '2rem', textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0,168,150,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00a896' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 7H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
            <path d="M16 12h.01"/>
            <path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/>
          </svg>
        </div>
        <div>
          <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: 600, margin: '0 0 6px' }}>Connect your wallet</h3>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0, maxWidth: '300px' }}>
            Connect to view your WOLV profit balance and receive future earnings directly to your wallet.
          </p>
        </div>

        {!showOptions ? (
          <button
            onClick={() => isMobile ? connectWalletConnect() : setShowOptions(true)}
            style={{ background: 'linear-gradient(135deg, #00a896, #1a3a8f)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 28px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', width: '100%', maxWidth: '260px' }}
          >
            Connect Wallet
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '260px' }}>
            {/* MetaMask */}
            <button onClick={connectMetaMask} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', padding: '12px 16px', cursor: 'pointer', color: '#fff',
              fontSize: '14px', fontWeight: 600, width: '100%',
            }}>
              <span style={{ fontSize: '22px' }}>🦊</span> MetaMask
            </button>
            {/* WalletConnect */}
            <button onClick={connectWalletConnect} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', padding: '12px 16px', cursor: 'pointer', color: '#fff',
              fontSize: '14px', fontWeight: 600, width: '100%',
            }}>
              <span style={{ fontSize: '22px' }}>🔗</span> WalletConnect
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginLeft: 'auto' }}>Trust Wallet, etc.</span>
            </button>
            <button onClick={() => setShowOptions(false)} style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)',
              fontSize: '12px', cursor: 'pointer', padding: '4px',
            }}>Cancel</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00a896', flexShrink: 0, display: 'inline-block' }} />
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace', flex: 1 }}>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
        <button onClick={() => disconnect()} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>Disconnect</button>
      </div>

      <div style={{ background: 'rgba(0,168,150,0.08)', border: '1px solid rgba(0,168,150,0.2)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Your WOLV Balance</div>
        <div style={{ fontSize: '32px', fontWeight: 700, color: '#00a896', marginBottom: '4px', fontFamily: 'monospace' }}>{formattedBalance} WOLV</div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Earned as investment profits</div>
      </div>

      {!added ? (
        <button onClick={addWolvToWallet} disabled={adding} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,168,150,0.3)', color: '#00a896', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', width: '100%' }}>
          {adding ? 'Adding...' : '+ Add WOLV to Wallet'}
        </button>
      ) : (
        <div style={{ textAlign: 'center', fontSize: '13px', color: '#00a896', fontWeight: 500, padding: '8px' }}>✅ WOLV added to your wallet</div>
      )}
    </div>
  );
}
