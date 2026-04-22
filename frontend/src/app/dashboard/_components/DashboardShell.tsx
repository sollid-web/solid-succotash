"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { apiFetch } from "@/lib/api";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

type DashboardShellProps = {
  children: ReactNode;
  banner?: ReactNode;
};

export default function DashboardShell({ children, banner }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [kycVerified, setKycVerified] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiFetch("/api/auth/me/", {
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Invalid token");
        const userData = await response.json();
        setUser(userData);
        setChecking(false);
      } catch (error) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
          document.cookie = "authToken=; Max-Age=0; Path=/; SameSite=Lax; Secure";
        }
        const next = encodeURIComponent(pathname || "/dashboard");
        router.push(`/accounts/login?next=${next}`);
      }
    };
    checkAuth();
  }, [pathname, router]);

  useEffect(() => {
    let active = true;
    const loadKyc = async () => {
      try {
        const response = await apiFetch("/api/kyc/", { method: "GET", cache: "no-store" });
        if (!response.ok || response.status === 401) { if (active) setKycVerified(false); return; }
        const payload = (await response.json()) as Array<{ status?: string }> | { status?: string };
        const latest = Array.isArray(payload) ? payload[0] : payload;
        const statusValue = String(latest?.status || "").toLowerCase();
        if (active) setKycVerified(statusValue === "approved");
      } catch { if (active) setKycVerified(false); }
    };
    loadKyc();
    return () => { active = false; };
  }, []);

  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/logout/", { method: "POST", headers: { "Content-Type": "application/json" } });
    } catch (error) {
      console.warn("Logout API call failed:", error);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        document.cookie = "authToken=; Max-Age=0; Path=/; SameSite=Lax; Secure";
      }
      router.push("/accounts/login");
    }
  };

  const navLinks = [
    { href: "/dashboard", label: "Overview", icon: "⬡" },
    { href: "/dashboard/deposit", label: "Deposit", icon: "↓" },
    { href: "/dashboard/withdraw", label: "Withdraw", icon: "↑" },
    { href: "/dashboard/new-investment", label: "Invest", icon: "◈" },
    { href: "/dashboard/card", label: "Virtual Card", icon: "▣" },
    { href: "/dashboard/transactions", label: "Transactions", icon: "≡" },
    { href: "/dashboard/support", label: "Support", icon: "◎" },
    { href: "/dashboard/kyc", label: "KYC", icon: "✓" },
  ];

  const userInitial = user?.first_name?.charAt(0) || user?.email?.charAt(0) || "U";
  const userName = user?.first_name || user?.last_name
    ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
    : user?.email?.split("@")[0] || "User";

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0b1929 0%, #0d2340 50%, #0b2f6b 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 56, height: 56, border: "3px solid rgba(37,99,235,0.3)", borderTop: "3px solid #2563eb", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px" }} />
          <div style={{ color: "#93c5fd", fontSize: 15, fontWeight: 500, letterSpacing: 0.5 }}>Securing your dashboard…</div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5fb", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .nav-link { transition: all 0.2s; }
        .nav-link:hover { background: rgba(37,99,235,0.08) !important; color: #2563eb !important; }
        .nav-link.active { background: rgba(37,99,235,0.12) !important; color: #2563eb !important; }
        .nav-link.active::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 60%; background: #2563eb; border-radius: 0 2px 2px 0; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(37,99,235,0.12) !important; }
        .stat-card { transition: all 0.25s; }
        .action-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,99,235,0.3) !important; }
        .action-btn { transition: all 0.2s; }
        .tx-row:hover { background: #f8faff !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
      `}</style>

      {/* ── SIDEBAR (desktop) ── */}
      <aside style={{
        position: "fixed", top: 0, left: 0, bottom: 0, width: 240,
        background: "linear-gradient(180deg, #0a1628 0%, #0b1f3a 60%, #0c2347 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column", zIndex: 100,
        boxShadow: "4px 0 24px rgba(0,0,0,0.2)",
      }} className="hidden lg:flex">
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 42, height: 42, background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
              borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 800, color: "white", boxShadow: "0 4px 12px rgba(37,99,235,0.4)",
            }}>W</div>
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>WolvCapital</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase" }}>Investment Platform</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
          <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", padding: "0 8px 10px" }}>Menu</div>
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}
                className={`nav-link ${isActive ? "active" : ""}`}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                  borderRadius: 10, marginBottom: 2, textDecoration: "none", position: "relative",
                  color: isActive ? "#93c5fd" : "rgba(255,255,255,0.55)", fontSize: 13.5, fontWeight: isActive ? 600 : 400,
                }}>
                <span style={{ fontSize: 12, opacity: 0.8 }}>{link.icon}</span>
                {link.label}
                {link.href === "/dashboard/card" && (
                  <span style={{ marginLeft: "auto", background: "rgba(37,99,235,0.25)", color: "#60a5fa", fontSize: 9, padding: "2px 7px", borderRadius: 20, fontWeight: 600, letterSpacing: 0.5 }}>NEW</span>
                )}
              </Link>
            );
          })}
          {(user?.is_staff || user?.is_superuser) && (
            <Link href="/admin/withdrawals"
              className={`nav-link ${pathname === "/admin/withdrawals" ? "active" : ""}`}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                borderRadius: 10, marginBottom: 2, textDecoration: "none", position: "relative",
                color: pathname === "/admin/withdrawals" ? "#93c5fd" : "rgba(255,255,255,0.55)", fontSize: 13.5,
              }}>
              <span style={{ fontSize: 12 }}>⚙</span> Admin
            </Link>
          )}
        </nav>

        {/* User profile bottom */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 10, marginBottom: 10 }}>
            <div style={{ width: 34, height: 34, background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
              {userInitial.toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: "white", fontSize: 12.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: kycVerified ? "#22c55e" : "#f59e0b" }} />
                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 10 }}>{kycVerified ? "KYC Verified" : "Not Verified"}</span>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            width: "100%", padding: "9px 12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 10, color: "#fca5a5", fontSize: 12.5, fontWeight: 500, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit",
          }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── MOBILE TOP BAR ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 90,
        background: "linear-gradient(90deg, #0a1628 0%, #0b2f6b 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
      }} className="lg:hidden">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#1d4ed8,#2563eb)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 14 }}>W</div>
          <span style={{ color: "white", fontWeight: 700, fontSize: 15 }}>WolvCapital</span>
        </div>
        <button onClick={() => setMobileMenuOpen(o => !o)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", padding: 6 }}>
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </header>

      {/* ── MOBILE DRAWER ── */}
      {mobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 80 }} className="lg:hidden">
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} onClick={() => setMobileMenuOpen(false)} />
          <div style={{
            position: "absolute", top: 56, left: 0, bottom: 0, width: 260,
            background: "linear-gradient(180deg, #0a1628, #0b1f3a)",
            padding: "16px 12px", overflowY: "auto",
          }}>
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                    borderRadius: 10, marginBottom: 4, textDecoration: "none",
                    color: isActive ? "#93c5fd" : "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: isActive ? 600 : 400,
                    background: isActive ? "rgba(37,99,235,0.15)" : "transparent",
                  }}>
                  <span style={{ fontSize: 12 }}>{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <button onClick={handleLogout} style={{ width: "100%", padding: "12px", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, color: "#fca5a5", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT AREA ── */}
      <div style={{ marginLeft: 0 }} className="lg:ml-[240px]">
        {/* Top bar (desktop) */}
        <div style={{
          background: "white", borderBottom: "1px solid #e8eef8", padding: "0 32px", height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
        }} className="hidden lg:flex">
          <div>
            <div style={{ fontSize: 13, color: "#94a3b8" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f1f5fb", padding: "6px 14px", borderRadius: 30 }}>
              <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 11, fontWeight: 700 }}>
                {userInitial.toUpperCase()}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#1e293b" }}>{userName}</span>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: kycVerified ? "#22c55e" : "#f59e0b", marginLeft: 4 }} />
            </div>
          </div>
        </div>

        {banner}

        <main style={{ padding: "28px 24px 80px" }} className="lg:px-8">
          {children}
        </main>

        <footer style={{ background: "white", borderTop: "1px solid #e8eef8", padding: "20px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>© 2024 WolvCapital — Secure Investment Platform</span>
            <button onClick={() => router.push("/")} style={{ fontSize: 12, color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              ← Visit Public Site
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}