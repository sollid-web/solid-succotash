'use client';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

const WalletProvider = dynamic(
  () => import('./WalletProvider').then(m => m.WalletProvider),
  { ssr: false }
);

export function WalletProviderClient({ children }: { children: ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>;
}
