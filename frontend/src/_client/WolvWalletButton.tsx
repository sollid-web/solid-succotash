'use client';
import { useAccount, useChainId, useDisconnect, useReadContract, useSwitchChain, useConnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { formatUnits } from 'viem';
import { useEffect, useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const WOLV_CONTRACT = '0xe0167279aef7bf4ad313d261da82e8366822270c';
const WOLV_DECIMALS = 18;
const PRICE_PER_WOLV = 1;
const WOLV_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

interface WolvWalletButtonProps {
  compact?: boolean;
}

// ── QR Tab: generates a WalletConnect URI via the walletConnect connector ──
function QRConnectTab() {
  const { connect, connectors } = useConnect();
  const [uri, setUri] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'generating' | 'ready' | 'error'>('idle');
  const [copied, setCopied] = useState(false);
  const uriRef = useRef<string | null>(null);

  const wcConnector = connectors.find(
    (c) => c.id === 'walletConnect' || c.name?.toLowerCase().includes('walletconnect')
  );

  const generate = async () => {
    if (!wcConnector) {
      setStatus('error');
      return;
    }
    setStatus('generating');
    setUri(null);

    try {
      // Listen for the URI emitted by the WalletConnect connector
      const onUri = (data: { uri?: string }) => {
        if (data?.uri && data.uri !== uriRef.current) {
          uriRef.current = data.uri;
          setUri(data.uri);
          setStatus('ready');
        }
      };

      // wagmi v2 connectors expose an event emitter
      wcConnector.emitter?.on('message', onUri);

      connect({ connector: wcConnector });

      // Fallback: poll connector's internal getProvider for URI
      const provider = await (wcConnector as any).getProvider?.().catch(() => null);
      if (provider?.signer?.uri) {
        uriRef.current = provider.signer.uri;
        setUri(provider.signer.uri);
        setStatus('ready');
      } else if (provider?.session?.uri) {
        uriRef.current = provider.session.uri;
        setUri(provider.session.uri);
        setStatus('ready');
      }

      // Last resort timeout
      setTimeout(() => {
        wcConnector.emitter?.off('message', onUri);
        if (!uriRef.current) setStatus('error');
      }, 12000);
    } catch {
      setStatus('error');
    }
  };

  const copyUri = () => {
    if (!uri) return;
    navigator.clipboard.writeText(uri).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (status === 'idle') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '8px 0' }}>
        <div style={{
          width: '200px', height: '200px', borderRadius: '16px',
          background: 'rgba(255,255,255,0.03)', border: '2px dashed rgba(255,255,255,0.1)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px',
        }}>
          {/* QR placeholder corners */}
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ opacity: 0.25 }}>
            <rect x="2" y="2" width="16" height="16" rx="2" stroke="white" strokeWidth="2" fill="none"/>
            <rect x="30" y="2" width="16" height="16" rx="2" stroke="white" strokeWidth="2" fill="none"/>
            <rect x="2" y="30" width="16" height="16" rx="2" stroke="white" strokeWidth="2" fill="none"/>
            <rect x="6" y="6" width="8" height="8" rx="1" fill="white" opacity="0.5"/>
            <rect x="34" y="6" width="8" height="8" rx="1" fill="white" opacity="0.5"/>
            <rect x="6" y="34" width="8" height="8" rx="1" fill="white" opacity="0.5"/>
            <line x1="30" y1="30" x2="46" y2="46" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="30" y1="46" x2="46" y2="30" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>QR appears here</span>
        </div>

        <button
          type="button"
          onClick={generate}
          style={{
            width: '100%', padding: '13px 20px', borderRadius: '13px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8, #1e3a8a)',
            border: '1px solid rgba(59,130,246,0.4)',
            color: '#fff', fontSize: '14px', fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px',
            boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
            transition: 'all 0.2s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <path d="M14 14h2v2h-2zM18 14h3v3h-3zM14 18h2v3h-2zM18 19h3v2h-3z"/>
          </svg>
          Generate QR Code
        </button>

        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
          Scan with MetaMask, Trust Wallet, Coinbase Wallet, or any WalletConnect-compatible app
        </p>
      </div>
    );
  }

  if (status === 'generating') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '16px 0' }}>
        <div style={{
          width: '200px', height: '200px', borderRadius: '16px',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px',
        }}>
          <div style={{
            width: '36px', height: '36px',
            border: '3px solid rgba(37,99,235,0.25)',
            borderTop: '3px solid #2563eb',
            borderRadius: '50%',
            animation: 'wc-spin 0.9s linear infinite',
          }} />
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Connecting…</span>
        </div>
        <style>{`@keyframes wc-spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', textAlign: 'center', margin: 0 }}>
          Initialising WalletConnect session
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', padding: '8px 0' }}>
        <div style={{
          width: '200px', height: '200px', borderRadius: '16px',
          background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
        }}>
          <span style={{ fontSize: '32px' }}>⚠️</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', textAlign: 'center', padding: '0 16px' }}>
            Could not generate QR. Use the Button tab or try again.
          </span>
        </div>
        <button type="button" onClick={() => { setStatus('idle'); setUri(null); uriRef.current = null; }}
          style={{
            padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff',
          }}>
          Try Again
        </button>
      </div>
    );
  }

  // status === 'ready'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
      {/* QR Code */}
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '14px',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <QRCodeSVG
          value={uri!}
          size={188}
          bgColor="#ffffff"
          fgColor="#0a0f1e"
          level="M"
          imageSettings={{
            src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563eb' stroke-width='2'%3E%3Crect x='1' y='4' width='22' height='16' rx='2'/%3E%3Cpath d='M16 12h.01'/%3E%3C/svg%3E",
            height: 28,
            width: 28,
            excavate: true,
          }}
        />
      </div>

      {/* Status pill */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '6px 14px', borderRadius: '999px',
        background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
      }}>
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
        <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 600 }}>Session active · scan now</span>
      </div>

      {/* Wallet logos */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {['MetaMask', 'Trust', 'Coinbase', 'Rainbow'].map((name) => (
          <div key={name} style={{
            padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 600,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.45)',
          }}>{name}</div>
        ))}
      </div>

      {/* Copy URI */}
      <button type="button" onClick={copyUri} style={{
        width: '100%', padding: '10px 16px', borderRadius: '10px',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
        color: copied ? '#10b981' : 'rgba(255,255,255,0.5)', fontSize: '12px',
        fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: '6px', transition: 'all 0.2s',
      }}>
        {copied ? (
          <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg> Copied!</>
        ) : (
          <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy connection URI</>
        )}
      </button>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export function WolvWalletButton({ compact = false }: WolvWalletButtonProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { openConnectModal } = useConnectModal() || {};

  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [hasInjectedProvider, setHasInjectedProvider] = useState(false);
  const [isMobileBrowser, setIsMobileBrowser] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tab, setTab] = useState<'button' | 'qr'>('button');

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    setHasInjectedProvider(typeof window !== 'undefined' && Boolean((window as any).ethereum));
    setIsMobileBrowser(
      typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    );
  }, [mounted]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.wallet-dropdown')) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const { data: balance } = useReadContract({
    address: WOLV_CONTRACT,
    abi: WOLV_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && chainId === 56 },
  });

  const rawBalance = balance ? parseFloat(formatUnits(balance, WOLV_DECIMALS)) : 0;
  const formattedBalance = rawBalance.toLocaleString(undefined, { maximumFractionDigits: 2 });
  const usdValue = (rawBalance * PRICE_PER_WOLV).toLocaleString(undefined, { maximumFractionDigits: 2 });

  const openWallet = () => {
    setError(null);
    if (!openConnectModal) { setError('Wallet connection is not available.'); return; }
    openConnectModal();
  };

  const addWolvToWallet = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      setError('Wallet extension not detected.'); return;
    }
    setAdding(true); setError(null);
    try {
      await (window as any).ethereum.request({
        method: 'wallet_watchAsset',
        params: { type: 'ERC20', options: { address: WOLV_CONTRACT, symbol: 'WOLV', decimals: WOLV_DECIMALS } },
      });
      setAdded(true);
    } catch {
      setError('Unable to add WOLV to wallet.');
    } finally {
      setAdding(false);
    }
  };

  if (!mounted) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
        Loading wallet interface…
      </div>
    );
  }

  // ── Connected ──
  if (isConnected) {
    const hasWrongChain = chainId !== 56;
    const isCorrectChain = chainId === 56;

    if (compact) {
      return (
        <div className="relative wallet-dropdown">
          <button type="button" onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:border-teal-300/40">
            <span className="h-2 w-2 rounded-full bg-teal-400" />
            <span className="font-mono text-xs">{address?.slice(0, 4)}...{address?.slice(-4)}</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-white/10 bg-[#071a3c] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-xs text-slate-400 uppercase tracking-wide">Connected Wallet</div>
                  <div className="mt-1 font-mono text-sm text-slate-300">{address}</div>
                </div>
                {isCorrectChain && (
                  <div className="text-center">
                    <div className="text-xs text-slate-400 uppercase tracking-wide">WOLV Balance</div>
                    <div className="mt-1 text-lg font-semibold text-teal-300">{formattedBalance} WOLV</div>
                    <div className="text-xs text-slate-400">(~${usdValue})</div>
                  </div>
                )}
                {hasWrongChain && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center">
                    <p className="text-xs text-red-200">Wrong network</p>
                    <button type="button"
                      onClick={() => { if (!switchChain) { setError('Network switching not supported.'); return; } setError(null); switchChain({ chainId: 56 }); setDropdownOpen(false); }}
                      disabled={!switchChain || isSwitching}
                      className="mt-2 w-full rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white transition disabled:opacity-60">
                      {isSwitching ? 'Switching...' : 'Switch to BNB Chain'}
                    </button>
                  </div>
                )}
                <button type="button" onClick={() => { disconnect(); setDropdownOpen(false); }}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:border-teal-300/40">
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Address row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', flexShrink: 0 }} />
          <span style={{ fontFamily: 'Inter, monospace', fontSize: '13px', color: 'rgba(255,255,255,0.7)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
            {address?.slice(0, 8)}...{address?.slice(-6)}
          </span>
          <button type="button" onClick={() => disconnect()} style={{ padding: '5px 12px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
            Disconnect
          </button>
        </div>

        {/* Wrong chain */}
        {hasWrongChain && (
          <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', textAlign: 'center' }}>
            <p style={{ color: '#fca5a5', fontSize: '13px', fontWeight: 600, margin: '0 0 10px' }}>Wrong network — switch to BNB Chain</p>
            <button type="button"
              onClick={() => { if (!switchChain) { setError('Network switching not supported.'); return; } setError(null); switchChain({ chainId: 56 }); }}
              disabled={!switchChain || isSwitching}
              style={{ width: '100%', padding: '11px', borderRadius: '12px', background: '#ef4444', border: 'none', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', opacity: isSwitching ? 0.6 : 1 }}>
              {isSwitching ? 'Switching…' : 'Switch to BNB Chain'}
            </button>
          </div>
        )}

        {/* Balance */}
        {isCorrectChain && (
          <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(0,168,150,0.08)', border: '1px solid rgba(0,168,150,0.2)', textAlign: 'center' }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>Your WOLV Balance</div>
            <div style={{ color: '#00c9b1', fontSize: '36px', fontWeight: 700, fontFamily: 'Inter, system-ui, sans-serif', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>{formattedBalance}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '4px' }}>WOLV · ~${usdValue} USD</div>
          </div>
        )}

        {/* Add to wallet */}
        {isCorrectChain && (
          added ? (
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', textAlign: 'center', color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
              ✅ WOLV added to wallet
            </div>
          ) : (
            <button type="button" onClick={addWolvToWallet} disabled={adding}
              style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,168,150,0.25)', color: '#00c9b1', fontSize: '13px', fontWeight: 600, cursor: 'pointer', opacity: adding ? 0.6 : 1 }}>
              {adding ? 'Adding…' : '+ Add WOLV to Wallet'}
            </button>
          )
        )}

        {error && <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: '13px' }}>{error}</div>}
      </div>
    );
  }

  // ── Not connected ──
  return (
    <div className={compact ? 'relative' : 'flex w-full flex-col gap-4'}>
      {compact ? (
        <button type="button" onClick={openWallet}
          style={{ padding: '8px 16px', borderRadius: '10px', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', border: 'none', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
          Connect
        </button>
      ) : (
        <>
          {/* ── Tab switcher ── */}
          <div style={{
            display: 'flex', gap: '4px', padding: '4px',
            background: 'rgba(0,0,0,0.25)', borderRadius: '13px',
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            {(['button', 'qr'] as const).map((t) => (
              <button key={t} type="button" onClick={() => setTab(t)} style={{
                flex: 1, padding: '9px 12px', borderRadius: '10px', fontSize: '13px',
                fontWeight: tab === t ? 700 : 500, cursor: 'pointer', transition: 'all 0.2s',
                background: tab === t ? 'linear-gradient(135deg, rgba(37,99,235,0.7), rgba(29,78,216,0.7))' : 'transparent',
                border: tab === t ? '1px solid rgba(59,130,246,0.4)' : '1px solid transparent',
                color: tab === t ? '#fff' : 'rgba(255,255,255,0.4)',
                boxShadow: tab === t ? '0 4px 12px rgba(37,99,235,0.25)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
              }}>
                {t === 'button' ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 7H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                      <path d="M16 12h.01"/>
                    </svg>
                    Browser Wallet
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                      <rect x="3" y="14" width="7" height="7" rx="1"/>
                      <path d="M14 14h2v2h-2zM18 14h3v2h-3zM14 18h2v3h-2zM18 18h3v3h-3z"/>
                    </svg>
                    Scan QR Code
                  </>
                )}
              </button>
            ))}
          </div>

          {/* ── Tab content ── */}
          {tab === 'button' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button type="button" onClick={openWallet} style={{
                width: '100%', padding: '14px 24px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e3a8a 100%)',
                border: '1px solid rgba(59,130,246,0.4)', color: '#fff', fontSize: '15px',
                fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '10px',
                boxShadow: '0 8px 24px rgba(37,99,235,0.4), inset 0 1px 0 rgba(255,255,255,0.12)',
                transition: 'all 0.2s',
              }}
                onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 32px rgba(37,99,235,0.55)'; }}
                onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(37,99,235,0.4)'; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 7H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                  <path d="M16 12h.01"/><path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/>
                </svg>
                Connect Wallet
              </button>

              {!hasInjectedProvider && !isMobileBrowser && (
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
                  No browser wallet detected — install MetaMask or use the QR tab to connect from your phone.
                </p>
              )}
              {error && <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: '13px' }}>{error}</div>}
            </div>
          ) : (
            <QRConnectTab />
          )}
        </>
      )}
    </div>
  );
}
