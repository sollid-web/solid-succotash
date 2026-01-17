"use client";

import { useEffect, useMemo, useState } from "react";
import { getApiBaseUrl } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

type LoginResponse = {
  success?: boolean;
  access?: string;
  refresh?: string;
  token?: string;
  authToken?: string;

  // common API error fields
  error?: string;
  detail?: string;
  message?: string;

  inactive?: boolean;

  // sometimes nested
  data?: any;
};

function extractTokens(data: LoginResponse) {
  // Try direct fields first
  const access =
    data?.access ||
    data?.token ||
    data?.authToken ||
    data?.data?.access ||
    data?.data?.token ||
    data?.data?.authToken ||
    null;

  const refresh = data?.refresh || data?.data?.refresh || null;

  return { access, refresh };
}

function storeTokens(access: string | null, refresh: string | null) {
  if (!access) return;

  // Keep multiple keys for backwards compatibility across your codebase
  localStorage.setItem("access_token", access);
  localStorage.setItem("authToken", access);
  localStorage.setItem("token", access);

  if (refresh) {
    localStorage.setItem("refresh_token", refresh);
  }
}

function getErrorMessage(data: LoginResponse, fallback: string) {
  return (
    data?.error ||
    data?.detail ||
    data?.message ||
    (typeof data === "string" ? data : "") ||
    fallback
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const apiBase = useMemo(() => getApiBaseUrl(), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("signup") === "success") {
      setSignupSuccess(true);
      setTimeout(() => {
        window.history.replaceState({}, "", window.location.pathname);
      }, 5000);
    }
  }, []);

  // Optional lightweight health check (do not block login)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isProdLike =
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1";

    if (isProdLike && apiBase.includes("localhost")) {
      setError(
        "Configuration error: API base URL is localhost. Set NEXT_PUBLIC_API_BASE_URL (or NEXT_PUBLIC_BACKEND_URL) and redeploy."
      );
      return;
    }

    fetch(`${apiBase}/healthz/`, { method: "GET" }).catch(() => {
      setError((prev) => prev || "Network error. Please check your connection and try again.");
    });
  }, [apiBase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Submitting login to:", `${apiBase}/api/auth/login/`, { email });

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${apiBase}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      const raw = await response.text();
      let data: any = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        data = null;
      }

      console.log("Login status:", response.status);
      console.log("Login response raw:", raw);
      console.log("Login response json:", data);

      if (!response.ok) {
        setError(
          data?.error ||
            data?.detail ||
            data?.message ||
            raw ||
            `Login failed (${response.status})`
        );
        return;
      }

      const access = data?.access || data?.token || data?.authToken;
      const refresh = data?.refresh;

      if (!access) {
        setError(`Login succeeded but no access token returned. Raw: ${raw}`);
        return;
      }

      localStorage.setItem("access_token", access);
      localStorage.setItem("authToken", access);
      if (refresh) localStorage.setItem("refresh_token", refresh);

      const params = new URLSearchParams(window.location.search);
      window.location.href = params.get("next") || "/dashboard";
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.name === "AbortError" ? "Login request timed out." : "Network error. Please try again.");
    } finally {
      clearTimeout(t);
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    if (!email) {
      setError("Enter your email above to resend the verification link.");
      return;
    }

    try {
      const res = await fetch(`${apiBase}/api/auth/verification/resend/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.ok) {
        setError("Verification email resent. Please check your inbox.");
      } else {
        setError(data?.error || data?.detail || "Unable to resend verification. Try again later.");
      }
    } catch (e) {
      console.error("Resend error", e);
      setError("Network error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-hero-auth bg-cover bg-center bg-no-repeat">
      <div className="flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-3">
              <Image
                src="/wolv-logo.svg"
                alt="WolvCapital"
                width={240}
                height={80}
                priority
                className="h-12 w-auto"
              />
            </Link>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10">
            <h1 className="text-3xl font-bold text-[#0b2f6b] mb-2 text-center">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Sign in to access your investment dashboard
            </p>

            {signupSuccess && (
              <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-bold text-emerald-800 mb-1">
                      Account Created Successfully!
                    </p>
                    <p className="text-sm text-emerald-700">
                      Please sign in with your credentials to access your dashboard.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2563eb] focus:outline-none transition"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#2563eb] focus:outline-none transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#2563eb] border-gray-300 rounded focus:ring-[#2563eb]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Remember me</span>
                </label>

                <a
                  href={`${apiBase}/accounts/password/reset/`}
                  className="text-sm text-[#2563eb] hover:text-[#1d4ed8] font-semibold transition"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#0b2f6b] via-[#2563eb] to-[#1d4ed8] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

              {error.toLowerCase().includes("not verified") && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-sm text-[#2563eb] hover:text-[#1d4ed8] font-semibold"
                  >
                    Resend verification email
                  </button>
                </div>
              )}
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/accounts/signup"
                  className="text-[#2563eb] hover:text-[#1d4ed8] font-bold transition"
                >
                  Sign Up
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                By signing in, you agree to our{" "}
                <Link href="/terms-of-service" className="text-[#2563eb] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#2563eb] hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link href="/" className="text-white hover:text-gray-200 font-semibold transition">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}