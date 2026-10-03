'use client';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

const WalletProvider = dynamic(
  () => import('./WalletProvider').then(m => m.WalletProvider),
  { ssr: false }
);

export function WalletProviderClient({ children }: { children: ReactNode }) {
  const [browserState, setBrowserState] = useState<'checking' | 'supported' | 'embedded'>('checking');

  useEffect(() => {
    const userAgent = navigator.userAgent || '';
    const isEmbeddedBrowser = /WhatsApp|FBAN|FBAV|Instagram|Messenger|Telegram|Line\//i.test(userAgent);
    setBrowserState(isEmbeddedBrowser ? 'embedded' : 'supported');
  }, []);

  // WhatsApp and other social apps may keep links in an embedded WebView.
  // Do not initialize RainbowKit/WalletConnect there: those SDKs can attempt
  // wallet handoffs that close the WebView and make the shared page appear to
  // "fall back" to the messaging app. Public content remains available; the
  // wallet UI is intentionally omitted until the visitor opens a full browser.
  if (browserState !== 'supported') return null;

  return <WalletProvider>{children}</WalletProvider>;
}
