'use client';
import Image from 'next/image';
import Link from 'next/link';
import { WolvWalletButton } from '../_client/WolvWalletButton';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="WolvCapital"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-lg font-semibold text-white">WolvCapital</span>
          </Link>

          <WolvWalletButton compact />
        </div>
      </div>
    </header>
  );
}