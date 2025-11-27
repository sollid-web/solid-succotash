"use client";

import NavBar from '@/components/NavBar';
import TawkToChat from '@/components/TawkToChat';
import RecentActivityTicker from '@/components/RecentActivityTicker';

interface PublicLayoutProps {
  children: React.ReactNode;
  backgroundImageUrl?: string; // legacy support
  backgroundClassName?: string; // preferred utility-based backgrounds
}

export default function PublicLayout({ children, backgroundImageUrl, backgroundClassName }: PublicLayoutProps) {
  return (
    <>
      <NavBar />
      <main
        className={`min-h-screen pt-20 ${backgroundClassName ? `${backgroundClassName} bg-cover bg-center bg-no-repeat` : ''}`}
        style={backgroundImageUrl && !backgroundClassName ? {
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        } : undefined}
      >{/* offset for fixed navbar */}
        {children}
      </main>
      <TawkToChat />
      <RecentActivityTicker />
    </>
  );
}