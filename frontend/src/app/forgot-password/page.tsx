"use client";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiFetch("/api/auth/password/reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.detail || "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="WolvCapital"
              width={160}
              height={40}
              priority
            />
          </Link>
        </div>

        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-8">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Check your email</h2>
              <p className="text-[#888888] text-sm mb-6">
                If that email address is registered with WolvCapital, you will receive a password reset link shortly.
              </p>
              <Link
                href="/accounts/login"
                className="text-[#a855f7] hover:text-[#c084fc] text-sm transition-colors"
              >
                ← Back to login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-white mb-2">Reset your password</h1>
              <p className="text-[#888888] text-sm mb-6">
                Enter your email address and we will send you a link to reset your password.
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3 mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-[#888888] mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-[#1a1a1a] border border-[#333333] text-white rounded-lg px-4 py-3 text-sm placeholder-[#555555] focus:outline-none focus:border-[#a855f7] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#a855f7] hover:bg-[#9333ea] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg py-3 text-sm transition-colors"
                >
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </form>

              <p className="text-center text-sm text-[#888888] mt-6">
                Remember your password?{" "}
                <Link href="/accounts/login" className="text-[#a855f7] hover:text-[#c084fc] transition-colors">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
