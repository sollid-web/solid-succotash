"use client";
import dynamic from "next/dynamic";
const WalletConnectButton = dynamic(() => import("@/_client/WalletConnectButton"), { ssr: false });

import { useEffect, useState, useRef } from "react";
import type { ReactNode } from "react";
import { apiFetch } from "@/lib/api";
import { usePathname, useRouter } from "next/navigation";  
import Link from "next/link";
import SupportChat from "@/components/SupportChat";

type DashboardShellProps = {
  children: ReactNode;
  banner?: ReactNode;
};

const NAV_LINKS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/deposit", label: "Deposit" },
  { href: "/dashboard/withdraw", label: "Withdraw" },
  { href: "/dashboard/new-investment", label: "Invest" },
  { href: "/dashboard/stake", label: "⬡ Stake WOLV" },
  { href: "/dashboard/wolv-token", label: "WOLV Token" },
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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const notificationsRef = useRef<HTMLDivElement | null>(null);

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
        if (!response.ok || response.status === 401) { 
          if (active) setKycVerified(false); 
          return; 
        }
        const payload = (await response.json()) as Array<{ status?: string }> | { status?: string };
        const latest = Array.isArray(payload) ? payload[0] : payload;
        if (active) setKycVerified(String(latest?.status || "").toLowerCase() === "approved");
      } catch { 
        if (active) setKycVerified(false); 
      }           
    };
    loadKyc();                                                 
    return () => { active = false; };
  }, []);

  // Fetch unread notification count (important only)
  const fetchUnreadCount = async () => {
    try {
      const res = await apiFetch("/api/notifications/unread-count/");
      if (!res.ok) return;
      const data = await res.json();
      // backend returns { unread: number } or a number
      const count = typeof data === "number" ? data : data?.count ?? data?.unread ?? data?.unread_count ?? 0;
      setUnreadCount(count || 0);
    } catch (e) {
      // noop
    }
  };

  useEffect(() => {
    // keep unread count in sync after user loads — poll every 60s
    if (!user) return;
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60_000);
    return () => clearInterval(interval);
  }, [user]);

  // KYC persistent notification
  const [kycNotifDismissed, setKycNotifDismissed] = useState(false);
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  useEffect(() => {
    const fetchKycForBanner = async () => {
      try {
        const res = await apiFetch("/api/kyc/");
        if (!res.ok) return;
        const data = await res.json();
        const latest = Array.isArray(data) ? data[0] : data;
        setKycStatus(latest?.status ?? null);
      } catch {}
    };
    if (user) fetchKycForBanner();
  }, [user]);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    if (notificationsOpen) window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [notificationsOpen]);

  const fetchNotifications = async () => {
    try {
      const res = await apiFetch("/api/notifications/?limit=10");
      if (!res.ok) return setNotifications([]);
      const data = await res.json();
      // Filter to important notifications: deposit, withdrawal, kyc, system_alert
      const important = (data || []).filter((n: any) => {
        const t = String(n.notification_type || "").toLowerCase();
        return (
          t.startsWith("deposit_") ||
          t.startsWith("withdrawal_") ||
          t.startsWith("kyc_") ||
          t === "system_alert" ||
          t.startsWith("wallet_")
        ) && t !== "roi_payout"; // exclude ROI
      });
      setNotifications(important.slice(0, 10));
    } catch (e) {
      setNotifications([]);
    }
  };

  const openNotifications = async () => {
    if (!notificationsOpen) {
      await fetchNotifications();
      await fetchUnreadCount();
      setNotificationsOpen(true);
    } else {
      setNotificationsOpen(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await apiFetch(`/api/notifications/${id}/mark-read/`, { method: "POST" });
      if (res.ok) {
        setNotifications(n => n.map(x => (x.id === id ? { ...x, is_read: true } : x)));
        await fetchUnreadCount();
      }
    } catch {}
  };

  const handleLogout = async () => {
    try { 
      await apiFetch("/api/auth/logout/", { method: "POST", headers: { "Content-Type": "application/json" } }); 
    } catch {} 
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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }                                                                  
        .nav-link { transition: all 0.2s; white-space: nowrap; }
        .nav-link:hover { color: #fff !important; }
        .nav-link.active { color: #fff !important; }               
        .nav-link.active::after {                                    
          content: ''; position: absolute; bottom: 0; left: 0; right: 0;                                                        
          height: 2px; background: linear-gradient(90deg, #2563eb, #1d4ed8);                                                    
          border-radius: 2px 2px 0 0;
        }
        .header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          min-height: 64px;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
          min-width: 0;
        }
        .user-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 12px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          min-width: 0;
        }
        .user-name {
          color: #fff;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 120px;
        }
        .notification-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 10px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          cursor: pointer;
          min-width: 40px;
          flex-shrink: 0;
        }
        .notification-button span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .connect-wallet-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 10px;
          background: linear-gradient(135deg, #2A52BE, #1E3A8A);
          border: none;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(42,82,190,0.3);
        }
        .logout-button {
          padding: 8px 14px;
          border-radius: 10px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          color: #f87171;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .notification-dropdown {
          position: absolute;
          right: 0;
          top: 44px;
          width: 360px;
          background: #071026;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 12px 40px rgba(2,6,23,0.6);
          z-index: 100;
        }
        @media (max-width: 640px) {
          .header-bar { padding: 10px 0; }
          .user-chip { padding: 6px 10px; }
          .user-name { display: none; }
          .notification-button { gap: 0; padding: 8px; }
          .logout-button { padding: 8px 10px; font-size: 11px; }
          .notification-dropdown { width: calc(100vw - 32px); max-width: 360px; right: 0; }
          .nav-link { padding: 12px 10px; font-size: 12px; }
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
          background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;                                                     
          color: #fff !important;                                    
          border: none !important;
          padding: 12px 24px !important;                             
          border-radius: 12px !important;                            
          font-weight: 600 !important;                               
          font-size: 14px !important;
          cursor: pointer;
          transition: all 0.2s !important;                           
          box-shadow: 0 8px 24px rgba(37,99,235,0.25) !important;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;                                 
        }
        .btn-cta-sky:hover { box-shadow: 0 12px 32px rgba(37,99,235,0.35) !important; transform: translateY(-1px); }
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

      {/* KYC Persistent Banner */}
      {kycStatus && kycStatus !== "approved" && !kycNotifDismissed && (
        <div style={{ background: kycStatus === "rejected" ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)", borderBottom: kycStatus === "rejected" ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(245,158,11,0.3)", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", position: "sticky", top: 0, zIndex: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "18px" }}>{kycStatus === "rejected" ? "🚫" : "⚠️"}</span>
            <span style={{ color: kycStatus === "rejected" ? "#fca5a5" : "#fcd34d", fontSize: "13px", fontWeight: 600 }}>
              {kycStatus === "rejected" ? "Your KYC was rejected — please review and resubmit." : kycStatus === "pending" ? "Your KYC is under review. We will notify you once complete." : "Complete your KYC verification to unlock full account access."}
            </span>
            <a href="/dashboard/kyc" style={{ color: "#60a5fa", fontSize: "12px", textDecoration: "underline" }}>Go to KYC →</a>
          </div>
          <button onClick={() => setKycNotifDismissed(true)} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "20px", lineHeight: 1, flexShrink: 0 }}>×</button>
        </div>
      )}

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(10,15,30,0.95)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div className="header-bar" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 16px" }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "38px", height: "38px", borderRadius: "10px",
              background: "linear-gradient(135deg, #1a3a8f, #234c8f)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: "16px", color: "#fff",
              boxShadow: "0 4px 16px rgba(35,76,143,0.2)",
            }}>W</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px", lineHeight: 1.2 }}>WolvCapital</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", letterSpacing: "1px" }}>INVESTMENT DASHBOARD</div>
            </div>
          </div>

          {/* User + Notifications + Logout */}
          <div className="header-actions" style={{ minWidth: 0 }}>
            <div className="user-chip">
              <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "linear-gradient(135deg, #1a3a8f, #00a896)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "13px" }}>
                {userInitial.toUpperCase()}
              </div>
              <div>
                <div className="user-name">{userName}</div>
              </div>
            </div>

            {/* Notifications */}
            <div style={{ position: "relative", flexShrink: 0 }} ref={notificationsRef}>
              <button onClick={openNotifications} aria-label="Notifications" className="notification-button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z"></path><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                {unreadCount > 0 && (
                  <span style={{ background: "#ef4444", color: "#fff", borderRadius: "999px", padding: "2px 6px", fontSize: "12px", fontWeight: 700, minWidth: "20px", textAlign: "center" }}>{unreadCount}</span>
                )}
              </button>

              {/* Dropdown */}
              {notificationsOpen && (
                <div style={{ position: "fixed", right: "12px", top: "70px", width: "min(360px, calc(100vw - 24px))", background: "#071026", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "12px", boxShadow: "0 12px 40px rgba(2,6,23,0.6)", zIndex: 9999 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div style={{ color: "#fff", fontWeight: 700 }}>Notifications</div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{unreadCount} unread</div>
                  </div>
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {notifications.length === 0 && (
                      <div style={{ color: "rgba(255,255,255,0.4)", padding: "12px 0" }}>No recent important notifications.</div>
                    )}
                    {notifications.map(n => (
                      <div key={n.id} style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                        <div style={{ flex: "0 0 40px" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: n.is_read ? "rgba(255,255,255,0.03)" : "linear-gradient(135deg,#2563eb,#1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }}>{(n.title || "?").charAt(0)}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: "#fff", fontWeight: 600 }}>{n.title}</div>
                          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", marginTop: "4px" }}>{n.message}</div>
                          <div style={{ marginTop: "6px", display: "flex", gap: "8px", alignItems: "center" }}>
                            {n.action_url ? (<Link href={n.action_url} style={{ color: "#00a896", fontSize: "13px" }}>View</Link>) : null}
                            {!n.is_read && (<button onClick={() => markAsRead(n.id)} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "13px" }}>Mark read</button>)}
                          </div>
                        </div>
                        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px" }}>{new Date(n.created_at).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                    <button onClick={async () => { await Promise.all(notifications.filter((x:any)=>!x.is_read).map((x:any)=>markAsRead(x.id))); await fetchUnreadCount(); setNotificationsOpen(false); }} className="btn-cta-sky">Mark all read</button>
                    <Link href="/dashboard/transactions" onClick={() => setNotificationsOpen(false)} style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>See all activity</Link>
                  </div>
                </div>
              )}
            </div>
            <WalletConnectButton />
            <button onClick={handleLogout} className="logout-button">
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
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 16px", overflowX: "auto", display: "flex", alignItems: "center" }}>
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
        {banner && <div style={{ marginBottom: "24px" }}>{banner}</div>}
        {children}
      </main>

      <SupportChat />

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "24px 16px", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>© 2024 WolvCapital · Secure Investment Platform</p>
      </footer>
    </div>
  );
}

