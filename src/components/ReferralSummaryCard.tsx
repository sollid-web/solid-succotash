"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { apiFetch } from "@/lib/api"
import { pressableTapProps } from "@/lib/motionPress"

interface SummaryData {
  code: string
  referred_count: number
  total_rewards: number
  latest_reward?: {
    amount: string | null
    status: string | null
  } | null
}

export default function ReferralSummaryCard() {
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const run = async () => {
      try {
        const resp = await apiFetch("/api/referrals/summary/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
        if (!resp.ok) {
          throw new Error(`Failed to load summary: ${resp.status}`)
        }
        const data = await resp.json()
        setSummary(data)
      } catch (e) {
        setError("Unable to load referral summary.")
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const handleCopyLink = async () => {
    if (!summary?.code || typeof window === "undefined") return
    const link = `${window.location.origin}/accounts/signup?ref=${encodeURIComponent(summary.code)}`
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error("Clipboard error", e)
    }
  }

  if (loading) {
    return (
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,168,150,0.2)", borderRadius: "20px", padding: "24px",
        backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
      }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Loading referral summary…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,168,150,0.2)", borderRadius: "20px", padding: "24px",
        backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
      }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginBottom: "12px" }}>{error}</p>
        <Link href="/accounts/login" style={{
          display: "inline-block", padding: "9px 18px", borderRadius: "10px",
          background: "linear-gradient(135deg, #1d4ed8, #2563eb)", color: "#fff", fontWeight: 600, fontSize: "13px", textDecoration: "none",
        }}>Log in</Link>
      </div>
    )
  }

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,168,150,0.2)", borderRadius: "20px", padding: "24px",
      backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05), 0 20px 50px rgba(0,0,0,0.25)",
    }}>
      {summary ? (
        <div className="space-y-4">
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px",
            padding: "12px 16px",
          }}>
            <div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "3px" }}>Referral Code</p>
              <p style={{ fontFamily: "monospace", fontSize: "16px", letterSpacing: "1px", color: "#fff" }}>{summary.code}</p>
            </div>
            <motion.button
              onClick={handleCopyLink}
              {...pressableTapProps}
              style={{
                padding: "9px 16px", borderRadius: "10px", fontWeight: 600, fontSize: "13px",
                background: copied ? "rgba(16,185,129,0.15)" : "linear-gradient(135deg, #1d4ed8, #2563eb)",
                color: copied ? "#10b981" : "#fff",
                border: copied ? "1px solid rgba(16,185,129,0.3)" : "none",
              }}
            >
              {copied ? "Copied" : "Copy Link"}
            </motion.button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
              <p style={{ color: "#93c5fd", fontSize: "10px", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "3px" }}>Total Referrals</p>
              <p style={{ color: "#93c5fd", fontSize: "20px", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{summary.referred_count}</p>
            </div>
            <div style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
              <p style={{ color: "#c4b5fd", fontSize: "10px", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "3px" }}>Rewards Count</p>
              <p style={{ color: "#c4b5fd", fontSize: "20px", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{summary.total_rewards}</p>
            </div>
            <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
              <p style={{ color: "#10b981", fontSize: "10px", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "3px" }}>Latest Reward</p>
              <p style={{ color: "#10b981", fontSize: "15px", fontWeight: 700 }}>
                {summary.latest_reward?.amount ?? "—"}
              </p>
              <p style={{ color: "rgba(16,185,129,0.7)", fontSize: "10px" }}>
                {summary.latest_reward?.status ?? "—"}
              </p>
            </div>
          </div>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>Rewards require manual admin approval per policy.</p>
        </div>
      ) : (
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>No referral data available yet.</p>
      )}
    </div>
  )
}
