'use client';

import { ReactNode } from 'react';
import { WalletProvider } from '../_client/WalletProvider';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <WalletProvider>
      <main className="pt-16">
        {children}
      </main>
    </WalletProvider>
  );
}