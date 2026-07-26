'use client';
import {
  useAccount, useChainId, useDisconnect,
  useReadContract, useSwitchChain, useConnect,
} from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { formatUnits } from 'viem';
import { useEffect, useState, useRef, useCallback } from 'react';
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

// WalletConnect proposals expire after 5 minutes.
// We refresh the URI after 4 minutes 30 seconds to stay ahead of expiry.
const URI_REFRESH_MS = 4.5 * 60 * 1000;

interface WolvWalletButtonProps {
  compact?: boolean;
}

// ─────────────────────────────────────────────
// QR tab — drives its own WalletConnect session
// ─────────────────────────────────────────────
function QRConnectTab() {
  // Use connectAsync to handle the promise lifecycle explicitly
  const { connectAsync, connectors } = useConnect();
  const { isConnected } = useAccount();
  const [uri, setUri] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'generating' | 'ready' | 'error'>('idle');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(270); // seconds until refresh

  // Refs to keep stable across renders
  const uriRef = useRef<string | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const providerRef = useRef<any>(null);
  const listenerCleanupRef = useRef<(() => void) | null>(null);

  const wcConnector = connectors.find(
    (c) => c.id === 'walletConnect' || c.name?.toLowerCase().includes('walletconnect'),
  );

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    refreshTimerRef.current = null;
    countdownRef.current = null;
  }, []);

  // Start countdown display + schedule auto-refresh
  const startCountdown = useCallback((refreshFn: () => void) => {
    clearTimers();
    setTimeLeft(Math.floor(URI_REFRESH_MS / 1000));

    countdownRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) return 0;
        return t - 1;
      });
    }, 1000);

    refreshTimerRef.current = setTimeout(() => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      refreshFn();
    }, URI_REFRESH_MS);
  }, [clearTimers]);

  // Core: get the WalletConnect Universal Provider and subscribe to URI events
  const initSession = useCallback(async () => {
    if (!wcConnector) { setStatus('error'); return; }

    setStatus('generating');
    setUri(null);
    uriRef.current = null;

    // Clean up any previous listener
    if (listenerCleanupRef.current) {
      listenerCleanupRef.current();
      listenerCleanupRef.current = null;
    }

    try {
      // Get the underlying WalletConnect provider (UniversalProvider)
      const provider = await (wcConnector as any).getProvider();
      providerRef.current = provider;

      // Helper that accepts the URI from any event shape
      const acceptUri = (rawUri: string) => {
        if (!rawUri || rawUri === uriRef.current) return;
        uriRef.current = rawUri;
        setUri(rawUri);
        setStatus('ready');
        // Schedule a refresh before this proposal expires
        startCountdown(() => initSession());
      };

      // WalletConnect Universal Provider emits 'display_uri' with the pairing URI
      const onDisplayUri = (uri: string) => acceptUri(uri);
      // Some versions emit it on the signer
      const onSignerUri = ({ uri }: { uri: string }) => acceptUri(uri);
      
      // Secondary listener fallback directly on the provider context
      const onConnect = (sessionData: any) => {
        console.log('[QRConnectTab] WalletConnect provider emitted connect event', sessionData);
      };

      provider.on?.('display_uri', onDisplayUri);
      provider.signer?.on?.('display_uri', onSignerUri);
      provider.on?.('connect', onConnect);

      // ... previous event listeners setup code (provider.on, provider.signer.on, etc.)

      listenerCleanupRef.current = () => {
        provider.off?.('display_uri', onDisplayUri);
        provider.signer?.off?.('display_uri', onSignerUri);
        provider.off?.('connect', onConnect);
      };

      // FIX: Defer the execution to the next event loop tick.
      // This ensures React completely finishes rendering/hydrating before 
      // Wagmi/RainbowKit mutations alter context state.
      setTimeout(() => {
        connectAsync({ connector: wcConnector })
          .then((res) => {
            console.log('[QRConnectTab] Remote session approved via promise resolution:', res);
          })
          .catch((err) => {
            if (err?.message?.includes('User rejected') || err?.code === 4001) {
              console.log('[QRConnectTab] Remote session request rejected or canceled.');
              return;
            }
            console.error('[QRConnectTab] connectAsync encountered an error:', err);
          });
      }, 0);

      // Fallback: if the provider already has a pending URI in state
      setTimeout(() => {
        if (uriRef.current) return; // already got it via event
        const pendingUri =
          provider?.signer?.uri ||
          provider?.session?.uri ||
          provider?.core?.pairing?.pairings?.values?.()[0]?.topic;
        if (typeof pendingUri === 'string' && pendingUri.startsWith('wc:')) {
          acceptUri(pendingUri);
        } else if (!uriRef.current) {
          // Give up — show error
          setStatus('error');
        }
      }, 8000);

    } catch (err) {
      console.error('[QRConnectTab] initSession error:', err);
      setStatus('error');
    }
  }, [wcConnector, connectAsync, startCountdown]);

  // Kick off on mount when this tab is first rendered
  useEffect(() => {
    initSession();
    return () => {
      clearTimers();
      if (listenerCleanupRef.current) listenerCleanupRef.current();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyUri = () => {
    if (!uri) return;
    navigator.clipboard.writeText(uri).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const formatTimeLeft = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // ── Generating ──
  if (status === 'generating') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '8px 0' }}>
        <div style={{
          width: '216px', height: '216px', borderRadius: '16px',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px',
        }}>
          <div style={{
            width: '40px', height: '40px',
            border: '3px solid rgba(37,99,235,0.2)',
            borderTop: '3px solid #2563eb',
            borderRadius: '50%',
            animation: 'wc-spin 0.85s linear infinite',
          }} />
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Initialising session…</span>
        </div>
        <style>{`@keyframes wc-spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', textAlign: 'center', margin: 0 }}>
          Setting up a WalletConnect pairing
        </p>
      </div>
    );
  }

  // ── Error ──
  if (status === 'error') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', padding: '8px 0' }}>
        <div style={{
          width: '216px', height: '216px', borderRadius: '16px',
          background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
        }}>
          <span style={{ fontSize: '36px' }}>⚠️</span>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', textAlign: 'center', padding: '0 20px', lineHeight: 1.6 }}>
            Could not generate QR code. Use the Browser Wallet tab or try again.
          </span>
        </div>
        <button type="button" onClick={initSession} style={{
          padding: '11px 24px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
          background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff',
          transition: 'all 0.2s',
        }}>
          Try Again
        </button>
      </div>
    );
  }

  // ── Ready: show QR ──
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>

      {/* QR Code */}
      <div style={{
        background: '#fff', borderRadius: '18px', padding: '14px',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.5)',
        position: 'relative',
      }}>
        <QRCodeSVG
          value={uri!}
          size={188}
          bgColor="#ffffff"
          fgColor="#0a0f1e"
          level="M"
        />
        {/* Centre logo overlay */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '36px', height: '36px',
          background: '#fff',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 0 2px rgba(37,99,235,0.15)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
            <path d="M19 7H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
            <path d="M16 12h.01"/>
            <path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/>
          </svg>
        </div>
      </div>

      {/* Status + countdown */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '5px 14px', borderRadius: '999px',
          background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
        }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
          <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 600 }}>Session active — scan now</span>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>
          Auto-refreshes in {formatTimeLeft(timeLeft)}
        </span>
      </div>

      {/* Supported wallets */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {['MetaMask', 'Trust', 'Coinbase', 'Rainbow', 'Zerion'].map((name) => (
          <div key={name} style={{
            padding: '3px 9px', borderRadius: '6px', fontSize: '10px', fontWeight: 600,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.4)',
          }}>{name}</div>
        ))}
      </div>

      {/* Copy URI */}
      <button type="button" onClick={copyUri} style={{
        width: '100%', padding: '10px 16px', borderRadius: '10px',
        background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
        border: copied ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.09)',
        color: copied ? '#10b981' : 'rgba(255,255,255,0.45)',
        fontSize: '12px', fontWeight: 600, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
        transition: 'all 0.2s',
      }}>
        {copied ? (
          <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>Copied!</>
        ) : (
          <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy connection URI</>
        )}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main exported component
// ─────────────────────────────────────────────
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
      typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent),
    );
  }, [mounted]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.wallet-dropdown')) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
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
    if (!(window as any)?.ethereum) { setError('Wallet extension not detected.'); return; }
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

  // ── Connected state ────────────────────────────────────────────────────
  if (isConnected) {
    const hasWrongChain = chainId !== 56;
    const isCorrectChain = chainId === 56;

    if (compact) {
      return (
        <div className="relative wallet-dropdown">
          <button type="button" onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:border-teal-300/40">
            <span className="h-2 w-2 rounded-full bg-teal-400" />
            <span className="font-mono text-xs">{address?.slice(0, 4)}…{address?.slice(-4)}</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-white/10 bg-[#071a3c] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-xs text-slate-400 uppercase tracking-wide">Connected Wallet</div>
                  <div className="mt-1 font-mono text-sm text-slate-300 break-all">{address}</div>
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
                      onClick={() => { if (!switchChain) return; setError(null); switchChain({ chainId: 56 }); setDropdownOpen(false); }}
                      disabled={!switchChain || isSwitching}
                      className="mt-2 w-full rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60">
                      {isSwitching ? 'Switching…' : 'Switch to BNB Chain'}
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
        {/* Address */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', flexShrink: 0 }} />
          <span style={{ fontFamily: 'Inter, monospace', fontSize: '13px', color: 'rgba(255,255,255,0.7)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
            {address?.slice(0, 8)}…{address?.slice(-6)}
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

  // ── Not connected ──────────────────────────────────────────────────────
  if (compact) {
    return (
      <button type="button" onClick={openWallet}
        style={{ padding: '8px 16px', borderRadius: '10px', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', border: 'none', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
        Connect
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* Tab switcher */}
      <div style={{
        display: 'flex', gap: '4px', padding: '4px',
        background: 'rgba(0,0,0,0.25)', borderRadius: '13px',
        border: '1px solid rgba(255,255,255,0.07)',
      }}>
        {(['button', 'qr'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} style={{
            flex: 1, padding: '9px 12px', borderRadius: '10px', fontSize: '13px',
            fontWeight: tab === t ? 700 : 500, cursor: 'pointer', transition: 'all 0.2s',
            background: tab === t ? 'linear-gradient(135deg,rgba(37,99,235,0.7),rgba(29,78,216,0.7))' : 'transparent',
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

      {/* Tab content */}
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
            <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: '11px', textAlign: 'center', margin: 0, lineHeight: 1.7 }}>
              No browser wallet detected
            </p>
          )}
        </div>
      ) : (
        <QRConnectTab />
      )}
    </div>
  );
}