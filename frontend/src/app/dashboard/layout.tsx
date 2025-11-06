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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0b2f6b] to-[#2563eb] rounded-lg text-white flex items-center justify-center text-sm font-bold">
              W
            </div>
            <span className="font-bold text-[#0b2f6b]">Dashboard</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
