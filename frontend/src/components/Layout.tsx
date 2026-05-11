'use client';

import { ReactNode } from 'react';
import { WalletProvider } from '../_client/WalletProvider';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <WalletProvider>
      <Header />
      <main className="pt-16">
        {children}
      </main>
    </WalletProvider>
  );
}