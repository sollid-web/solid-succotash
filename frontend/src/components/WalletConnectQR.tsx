'use client';

import { useEffect, useRef, useState } from 'react';
import { useConnect } from 'wagmi';

interface WalletConnectQRProps {
  onClose?: () => void;
}

export function WalletConnectQR({ onClose }: WalletConnectQRProps) {
  const { connect, connectors } = useConnect();
  const [uri, setUri] = useState<string>('');
  const [qrError, setQrError] = useState(false);
  const connectionAttempted = useRef(false);
  const uriListener = useRef<((newUri: string) => void) | null>(null);

  useEffect(() => {
    const connector = connectors.find((c) => c.id === 'walletConnect');
    if (!connector || connectionAttempted.current) return;

    let provider: any;
    const handleUri = (newUri: string) => setUri(newUri);
    uriListener.current = handleUri;

    const setupProvider = async () => {
      try {
        provider = await connector.getProvider();
        provider.on('display_uri', handleUri);
        connectionAttempted.current = true;
        connect({ connector });
      } catch (error) {
        console.error('Failed to initialize WalletConnect provider:', error);
        setQrError(true);
      }
    };

    setupProvider();

    return () => {
      if (provider && uriListener.current) {
        provider.removeListener('display_uri', uriListener.current);
      }
    };
  }, [connect, connectors]);

  if (!uri && !qrError) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-3xl border border-teal-500/20 bg-slate-950 p-8 text-center text-slate-100">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-500/20 border-t-teal-300" />
        <p className="max-w-xs text-sm text-slate-300">Initializing secure mobile connection...</p>
      </div>
    );
  }

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(uri)}&bgcolor=ffffff&color=0b2f6b&margin=2`;

  return (
    <div className="flex min-h-[420px] w-full flex-col items-center justify-between gap-6 rounded-3xl border border-teal-500/20 bg-[#0b2f6b] p-8 text-slate-100">
      <div className="space-y-3 text-center">
        <h3 className="text-xl font-semibold text-white">Scan to connect</h3>
        <p className="text-sm text-slate-300">
          Open your mobile wallet app, scan the QR code, and connect to WolvCapital on BNB Chain.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
        {qrError ? (
          <div className="min-h-[260px] w-[260px] rounded-3xl bg-red-500/10 p-6 text-center text-sm text-red-200">
            Failed to generate QR code. Please try again.
          </div>
        ) : (
          <img
            src={qrSrc}
            alt="WalletConnect QR"
            className="h-[260px] w-[260px] rounded-3xl object-cover"
            onError={() => setQrError(true)}
          />
        )}
      </div>

      <div className="grid w-full gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(uri);
          }}
          className="rounded-2xl bg-teal-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-400"
        >
          Copy Link
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-teal-300/40"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
