"use client";

import NavBar from '@/components/NavBar';
import TawkToChat from '@/components/TawkToChat';
import RecentActivityTicker from '@/components/RecentActivityTicker';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-20">{/* offset for fixed navbar */}
        {children}
      </main>
      <TawkToChat />
      <RecentActivityTicker />
    </>
  );
}