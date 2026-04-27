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

const NAV_LINKS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/deposit", label: "Deposit" },
  { href: "/dashboard/withdraw", label: "Withdraw" },
  { href: "/dashboard/new-investment", label: "Invest" },
  { href: "/dashboard/transactions", label: "Transactions" },
  { href: "/dashboard/support", label: "Support" },
  { href: "/dashboard/kyc", label: "KYC" },
];

export default function DashboardShell({ children, banner }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [kycVerified, setKycVerified] = useState<boolean | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
      } catch {
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
        if (active) setKycVerified(String(latest?.status || "").toLowerCase() === "approved");
      } catch { if (active) setKycVerified(false); }
    };
    loadKyc();
    return () => { active = false; };
  }, []);

  const handleLogout = async () => {
    try { await apiFetch("/api/auth/logout/", { method: "POST", headers: { "Content-Type": "application/json" } }); }
    catch {}
    finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        document.cookie = "authToken=; Max-Age=0; Path=/; SameSite=Lax; Secure";
      }
      router.push("/accounts/login");
    }
  };

  const userInitial = user?.first_name?.charAt(0) || user?.email?.charAt(0) || "U";
  const userName = user?.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : user?.email?.split("@")[0] || "User";

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "48px", height: "48px", border: "3px solid rgba(0,168,150,0.3)", borderTop: "3px solid #00a896", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Securing your dashboard...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .nav-link { transition: all 0.2s; white-space: nowrap; }
        .nav-link:hover { color: #fff !important; }
        .nav-link.active { color: #fff !important; }
        .nav-link.active::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px; background: linear-gradient(90deg, #00a896, #1a8fc1);
          border-radius: 2px 2px 0 0;
        }
        .shell-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
        }
        input, select, textarea {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.12) !important;
          color: #fff !important;
          border-radius: 12px !important;
          padding: 12px 16px !important;
          font-family: 'DM Sans', system-ui, sans-serif !important;
          font-size: 14px !important;
          width: 100%;
          outline: none;
          transition: border-color 0.2s;
        }
        input:focus, select:focus, textarea:focus {
          border-color: rgba(0,168,150,0.5) !important;
          box-shadow: 0 0 0 3px rgba(0,168,150,0.1) !important;
        }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.25) !important; }
        select option { background: #1a2035; color: #fff; }
        label { color: rgba(255,255,255,0.5) !important; font-size: 12px !important; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 6px; display: block; }
        .btn-cta-sky {
          background: linear-gradient(135deg, #00a896, #0f7a70) !important;
          color: #fff !important;
          border: none !important;
          padding: 12px 24px !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          cursor: pointer;
          transition: all 0.2s !important;
          box-shadow: 0 8px 24px rgba(0,168,150,0.25) !important;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .btn-cta-sky:hover { box-shadow: 0 12px 32px rgba(0,168,150,0.4) !important; transform: translateY(-1px); }
        .btn-cta-sky:disabled { opacity: 0.5; transform: none; cursor: not-allowed; }
        h1, h2, h3, h4 { color: #fff; }
        p { color: rgba(255,255,255,0.5); }
        a { color: #00a896; text-decoration: none; }
        a:hover { color: #00c4b0; }
        table { width: 100%; border-collapse: collapse; }
        th { color: rgba(255,255,255,0.35) !important; font-size: 11px !important; letter-spacing: 1.5px; text-transform: uppercase; padding: 12px 16px; text-align: left; background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.06); }
        td { color: rgba(255,255,255,0.8); font-size: 13px; padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); }
        tr:hover td { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(10,15,30,0.95)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 16px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "38px", height: "38px", borderRadius: "10px",
              background: "linear-gradient(135deg, #1a3a8f, #00a896)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: "16px", color: "#fff",
              boxShadow: "0 4px 16px rgba(0,168,150,0.3)",
            }}>W</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px", lineHeight: 1.2 }}>WolvCapital</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", letterSpacing: "1px" }}>INVESTMENT DASHBOARD</div>
            </div>
          </div>

          {/* User + Logout */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 12px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "linear-gradient(135deg, #1a3a8f, #00a896)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "13px" }}>
                {userInitial.toUpperCase()}
              </div>
              <div style={{ display: "none" }} className="md-show">
                <div style={{ color: "#fff", fontSize: "13px", fontWeight: 500 }}>{userName}</div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px" }}>
                  {kycVerified ? "✓ Verified" : "Not verified"}
                </div>
              </div>
            </div>
            <button onClick={handleLogout} style={{
              padding: "8px 16px", borderRadius: "10px",
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
              color: "#f87171", fontSize: "13px", fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s",
            }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav style={{ background: "rgba(10,15,30,0.8)", borderBottom: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(10px)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 16px", overflowX: "auto", display: "flex" }}>
          {NAV_LINKS.map(link => {
            const isActive = link.href === "/dashboard" ? pathname === "/dashboard" : pathname?.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} className={`nav-link ${isActive ? "active" : ""}`} style={{
                padding: "14px 16px", fontSize: "13px", fontWeight: isActive ? 600 : 400,
                color: isActive ? "#fff" : "rgba(255,255,255,0.4)",
                position: "relative", whiteSpace: "nowrap",
                borderBottom: isActive ? "2px solid #00a896" : "2px solid transparent",
              }}>
                {link.label}
              </Link>
            );
          })}
          {(user?.is_staff || user?.is_superuser) && (
            <Link href="/admin/withdrawals" style={{
              padding: "14px 16px", fontSize: "13px", fontWeight: 400,
              color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap",
              borderBottom: "2px solid transparent",
            }}>Admin</Link>
          )}
        </div>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 16px 80px" }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "24px 16px", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>© 2024 WolvCapital · Secure Investment Platform</p>
      </footer>
    </div>
  );
}