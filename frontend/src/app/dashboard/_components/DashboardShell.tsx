"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { apiFetch } from "@/lib/api";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import RecentActivityTicker from "@/components/RecentActivityTicker";
import ValidationBanner from "./ValidationBanner";

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

  useEffect(() => {
    // Enhanced authentication check
    const checkAuth = async () => {
      try {
        const response = await apiFetch("/api/auth/me/", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Invalid token");
        }

        const userData = await response.json();
        setUser(userData);
        setChecking(false);
      } catch (error) {
        // Clear invalid tokens and redirect
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
        const response = await apiFetch("/api/kyc/", {
          method: "GET",
          cache: "no-store",
        });
        if (!response.ok || response.status === 401) {
          if (active) setKycVerified(false);
          return;
        }
        const payload = (await response.json()) as Array<{ status?: string }> | { status?: string };
        const latest = Array.isArray(payload) ? payload[0] : payload;
        const statusValue = String(latest?.status || "").toLowerCase();
        const isApproved = statusValue === "approved";
        if (active) setKycVerified(isApproved);
      } catch {
        if (active) setKycVerified(false);
      }
    };
    loadKyc();
    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      // API logout
      await apiFetch("/api/auth/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.warn("Logout API call failed:", error);
    } finally {
      // Always clear client state
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        document.cookie = "authToken=; Max-Age=0; Path=/; SameSite=Lax; Secure";
      }
      router.push("/accounts/login");
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Securing your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <ValidationBanner />
      {banner ? <div className="px-4 lg:px-8 py-3">{banner}</div> : null}
      {/* Protected Dashboard Header - completely separate from public site */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          {/* Dashboard Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0b2f6b] to-[#2563eb] rounded-xl text-white flex items-center justify-center text-xl font-bold shadow-lg">
              W
            </div>
            <div>
              <h1 className="font-bold text-[#0b2f6b] text-xl">WolvCapital</h1>
              <p className="text-xs text-gray-500 -mt-1">Investment Dashboard</p>
            </div>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
              <div className="w-8 h-8 bg-[#2563eb] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user?.first_name?.charAt(0) || user?.last_name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.first_name || user?.last_name
                    ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
                    : (user?.email ? user.email.split("@")[0] : "User")}
                </p>
                <p className="text-xs text-gray-500">
                  Account Status: {kycVerified ? "Verified" : "Not verified"}
                </p>
              </div>
            </div>

            <div className="md:hidden text-xs text-gray-500">
              Account Status: {kycVerified ? "Verified" : "Not verified"}
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <Link
              href="/dashboard"
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                pathname === "/dashboard"
                  ? "border-[#2563eb] text-[#2563eb]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </Link>
            <Link
              href="/dashboard/deposit"
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                pathname === "/dashboard/deposit"
                  ? "border-[#2563eb] text-[#2563eb]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Deposit
            </Link>
            <Link
              href="/dashboard/withdraw"
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                pathname === "/dashboard/withdraw"
                  ? "border-[#2563eb] text-[#2563eb]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Withdraw
            </Link>
            <Link
              href="/dashboard/new-investment"
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                pathname === "/dashboard/new-investment"
                  ? "border-[#2563eb] text-[#2563eb]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Invest
            </Link>
            <Link
              href="/dashboard/transactions"
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                pathname === "/dashboard/transactions"
                  ? "border-[#2563eb] text-[#2563eb]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Transactions
            </Link>
            <Link
              href="/dashboard/support"
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                pathname === "/dashboard/support"
                  ? "border-[#2563eb] text-[#2563eb]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Support
            </Link>
            <Link
              href="/dashboard/kyc"
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                pathname === "/dashboard/kyc"
                  ? "border-[#2563eb] text-[#2563eb]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              KYC Verification
            </Link>
            {(user?.is_staff || user?.is_superuser) && (
              <Link
                href="/admin/withdrawals"
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  pathname === "/admin/withdrawals"
                    ? "border-[#2563eb] text-[#2563eb]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Admin Withdrawals
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {children}
      </main>

      {/* Dashboard-specific Activity Ticker */}
      <RecentActivityTicker minIntervalMs={150000} maxIntervalMs={220000} displayDurationMs={6500} />

      {/* Dashboard Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© 2024 WolvCapital. Secure Investment Platform.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <button
                onClick={() => router.push("/")}
                className="text-gray-500 hover:text-[#2563eb] text-sm transition-colors"
              >
                Visit Public Site
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
