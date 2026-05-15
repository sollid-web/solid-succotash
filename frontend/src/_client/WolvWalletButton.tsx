'use client';
import { useAccount, useChainId, useDisconnect, useReadContract, useSwitchChain } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { formatUnits } from 'viem';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    setMounted(true);
  }, []);

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
      if (!target.closest('.wallet-dropdown')) {
        setDropdownOpen(false);
      }
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
    if (!openConnectModal) {
      setError('Wallet connection is not available.');
      return;
    }
    openConnectModal();
  };

  const addWolvToWallet = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      setError('Wallet extension not detected.');
      return;
    }
    setAdding(true);
    setError(null);
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
      setError('Unable to add WOLV to wallet.');
    } finally {
      setAdding(false);
    }
  };

  if (!mounted) {
    return (
      <div className="mx-auto flex max-w-md items-center justify-center rounded-[28px] border border-teal-500/20 bg-[#071a3c] p-6 text-center text-sm text-slate-400">
        Loading wallet interface...
      </div>
    );
  }

  if (isConnected) {
    const hasWrongChain = chainId !== 56;
    const isCorrectChain = chainId === 56;

    if (compact) {
      return (
        <div className="relative wallet-dropdown">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:border-teal-300/40"
          >
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
                    <button
                      type="button"
                      onClick={() => {
                        if (!switchChain) { setError('Network switching not supported.'); return; }
                        setError(null);
                        switchChain({ chainId: 56 });
                        setDropdownOpen(false);
                      }}
                      disabled={!switchChain || isSwitching}
                      className="mt-2 w-full rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white transition disabled:opacity-60"
                    >
                      {isSwitching ? 'Switching...' : 'Switch to BNB Chain'}
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => { disconnect(); setDropdownOpen(false); }}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:border-teal-300/40"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center gap-3 rounded-[20px] border border-white/10 bg-white/5 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-teal-400" />
          <span className="truncate text-[13px] text-slate-300 font-mono">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          <button
            type="button"
            onClick={() => disconnect()}
            className="ml-auto rounded-xl border border-white/10 px-3 py-1 text-[12px] text-slate-300 transition hover:border-teal-300/40"
          >
            Disconnect
          </button>
        </div>

        {hasWrongChain ? (
          <div className="rounded-[20px] border border-red-500/20 bg-red-500/10 p-5 text-center text-white">
            <p className="mb-3 text-sm font-semibold">Connected to the wrong network.</p>
            <button
              type="button"
              onClick={() => {
                if (!switchChain) { setError('Network switching is not supported by this wallet.'); return; }
                setError(null);
                switchChain({ chainId: 56 });
              }}
              disabled={!switchChain || isSwitching}
              className="inline-flex w-full justify-center rounded-2xl bg-red-500 px-5 py-4 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSwitching ? 'Switching...' : 'Switch to BNB Chain'}
            </button>
          </div>
        ) : (
          <div className="rounded-[20px] border border-teal-500/20 bg-teal-500/10 p-6 text-center">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Your WOLV Balance</div>
            <div className="mt-3 text-4xl font-semibold text-teal-300">{formattedBalance} WOLV</div>
            <div className="mt-1 text-sm text-slate-300">(~${usdValue})</div>
          </div>
        )}

        {isCorrectChain && (
          added ? (
            <div className="rounded-2xl bg-teal-500/10 px-5 py-4 text-center text-sm font-semibold text-teal-200">
              ✅ WOLV added to wallet
            </div>
          ) : (
            <button
              type="button"
              onClick={addWolvToWallet}
              disabled={adding}
              className="rounded-2xl border border-teal-500/30 bg-white/5 px-5 py-4 text-sm font-semibold text-teal-200 transition hover:border-teal-300/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {adding ? 'Adding...' : '+ Add WOLV to Wallet'}
            </button>
          )
        )}

        {error && <div className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
      </div>
    );
  }

  // Not connected
  return (
    <div className={compact ? "relative" : "flex w-full max-w-md flex-col items-center gap-5 rounded-[28px] border border-white/10 bg-[#071a3c] p-6 text-center text-slate-200 sm:p-8"}>
      {compact ? (
        <button
          type="button"
          onClick={openWallet}
          className="rounded-2xl bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-400"
        >
          Connect
        </button>
      ) : (
        <>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-500/10 text-teal-300">
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 7H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
              <path d="M16 12h.01" />
              <path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
            </svg>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white">Connect your wallet</h3>
            <p className="mt-2 text-sm text-slate-400">
              Connect a secure wallet to access WOLV staking rewards on BNB Chain.
            </p>
          </div>

          <button
            type="button"
            onClick={openWallet}
            className="w-full rounded-2xl bg-teal-500 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-teal-400"
          >
            Connect Wallet
          </button>

          {(!hasInjectedProvider && !isMobileBrowser) && (
            <p className="text-sm text-slate-500">
              No browser wallet detected. RainbowKit supports MetaMask, WalletConnect, and more.
            </p>
          )}

          {error && <div className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
        </>
      )}
    </div>
  );
}
