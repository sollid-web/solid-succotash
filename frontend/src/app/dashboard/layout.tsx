"use client"
import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import DashboardShell from "./_components/DashboardShell";
import { WalletProviderClient } from "@/_client/WalletProviderClient";


function VisitorTracker() {
  const pathname = usePathname()
  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || ''
    if (!API) return
    const token = localStorage.getItem('authToken')
    if (!token) return
    // Get user info then ping
    fetch(`${API}/api/auth/me/`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    }).then(r => r.json()).then(me => {
      fetch(`${API}/api/chat/visitor/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: me.email || '',
          user_name: `${me.first_name || ''} ${me.last_name || ''}`.trim() || me.email || '',
          page: pathname
        })
      }).catch(() => {})
    }).catch(() => {})
  }, [pathname])
  return null
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
          
    <VisitorTracker />
    <WalletProviderClient>
    <DashboardShell>
        {children}
      </DashboardShell>
    </WalletProviderClient>
    );
  }
