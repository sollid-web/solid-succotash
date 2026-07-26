"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch, getApiBaseUrl } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await apiFetch("/api/auth/jwt/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      const raw = await response.text();
      let data: any = null;
      try { data = raw ? JSON.parse(raw) : null; } catch { data = null; }

      if (!response.ok) {
        setError(data?.error || data?.detail || data?.message || `Login failed (${response.status})`);
        return;
      }

      const access = data?.access || data?.token || data?.authToken;
      const refresh = data?.refresh;

      if (!access) {
        setError(`Login succeeded but no access token returned.`);
        return;
      }

      localStorage.setItem("access_token", access);
      localStorage.setItem("authToken", access);
      localStorage.setItem("token", access);
      if (refresh) localStorage.setItem("refresh_token", refresh);

      const params = new URLSearchParams(window.location.search);
      window.location.href = params.get("next") || "/dashboard";
    } catch (err: any) {
      setError(err?.name === "AbortError" ? "Login request timed out." : "Network error. Please try again.");
    } finally {
      clearTimeout(t);
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    if (!email) { setError("Enter your email above to resend the verification link."); return; }
    try {
      const res = await apiFetch("/api/auth/verification/resend/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      let data: any = {};
      try { data = await res.json(); } catch { data = {}; }
      if (res.ok) {
        setError("Verification email resent. Please check your inbox.");
      } else {
        setError(data?.error || data?.detail || "Unable to resend. Try again later.");
      }
    } catch {
      setError("Network error. Please try again later.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1E3A8A 60%, #2A52BE 100%)' }}
    >
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <Image
              src="/wolv-logo.svg"
              alt="WolvCapital"
              width={160}
              height={52}
              priority
              className="h-12 w-auto mx-auto"
            />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl px-8 py-10">

          <h1 className="text-2xl font-extrabold text-white mb-1 text-center">
            Welcome Back
          </h1>
          <p className="text-sm text-blue-200 text-center mb-8">
            Sign in to access your investment dashboard
          </p>

          {/* Signup success banner */}
          {signupSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl flex items-start gap-3">
              <span className="text-emerald-600 text-lg mt-0.5">✅</span>
              <div>
                <p className="text-sm font-bold text-emerald-800">Account Created Successfully!</p>
                <p className="text-xs text-emerald-700 mt-0.5">Please sign in with your credentials.</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-blue-200 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition text-sm"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-blue-200 mb-1.5">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-blue-200">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 font-semibold transition"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-white text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #2A52BE 0%, #1E3A8A 100%)' }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            {error.toLowerCase().includes("not verified") && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Resend verification email
                </button>
              </div>
            )}
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-blue-200">
              Don&apos;t have an account?{" "}
              <Link href="/accounts/signup" className="text-blue-600 font-bold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-blue-300">
              By signing in, you agree to our{" "}
              <Link href="/terms-of-service" className="text-blue-600 hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-blue-200 hover:text-white text-sm font-semibold transition">
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
