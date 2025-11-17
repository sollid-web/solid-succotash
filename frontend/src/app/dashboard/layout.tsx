"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Client-side guard as a fallback to middleware
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (!token) {
      const next = encodeURIComponent(pathname || '/dashboard');
      router.push(`/accounts/login?next=${next}`);
    } else {
      setChecking(false);
    }
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard-only topbar (no public site header) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#0b2f6b] to-[#2563eb] rounded-lg text-white flex items-center justify-center text-sm sm:text-lg font-bold">
              W
            </div>
            <span className="font-bold text-[#0b2f6b] text-base sm:text-xl">Dashboard</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <Link href="/plans" className="text-gray-600 hover:text-[#0b2f6b]">Plans</Link>
            <Link href="/contact" className="text-gray-600 hover:text-[#0b2f6b]">Support</Link>
            <button
              onClick={() => {
                try {
                  // Best-effort API logout
                  const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
                  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
                  fetch(`${apiBase}/api/auth/logout/`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      ...(token ? { 'Authorization': `Token ${token}` } : {}),
                    },
                    credentials: 'include',
                  }).catch(() => {})
                } catch {}
                // Clear client state
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('authToken')
                  document.cookie = 'authToken=; Max-Age=0; Path=/; SameSite=Lax; Secure'
                }
                router.push('/accounts/login')
              }}
              className="text-gray-600 hover:text-[#0b2f6b]"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {children}
      </main>
      {/* Mobile bottom nav (visible on small screens) */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex md:hidden justify-around items-center h-14 z-50">
        <Link href="/dashboard" className="flex flex-col items-center justify-center text-xs text-gray-600 hover:text-[#2563eb] py-2">
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" /></svg>
          Home
        </Link>
        <Link href="/dashboard/deposit" className="flex flex-col items-center justify-center text-xs text-gray-600 hover:text-[#2563eb] py-2">
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Deposit
        </Link>
        <Link href="/dashboard/withdraw" className="flex flex-col items-center justify-center text-xs text-gray-600 hover:text-[#2563eb] py-2">
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20V4m8 8H4" /></svg>
          Withdraw
        </Link>
        <Link href="/dashboard/support" className="flex flex-col items-center justify-center text-xs text-gray-600 hover:text-[#2563eb] py-2">
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          Support
        </Link>
      </nav>
    </div>
  );
}
