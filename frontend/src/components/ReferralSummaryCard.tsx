"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { getApiBaseUrl } from "@/lib/api"

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
  const apiBase = useMemo(() => getApiBaseUrl(), [])
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const run = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
      if (!token) {
        setError("Please log in to view your referral stats.")
        setLoading(false)
        return
      }
      try {
        const resp = await fetch(`${apiBase}/api/referrals/summary/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          credentials: "include",
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
  }, [apiBase])

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
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <p className="text-gray-600">Loading referral summary…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <p className="text-gray-600 mb-3">{error}</p>
        <Link href="/accounts/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Log in</Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Referral Summary</h3>
      {summary ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <div>
              <p className="text-sm text-gray-600">Referral Code</p>
              <p className="font-mono text-lg tracking-wider text-gray-800">{summary.code}</p>
            </div>
            <button
              onClick={handleCopyLink}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {copied ? "Copied" : "Copy Link"}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-sm text-blue-700">Total Referrals</p>
              <p className="text-2xl font-bold text-blue-900">{summary.referred_count}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <p className="text-sm text-purple-700">Rewards Count</p>
              <p className="text-2xl font-bold text-purple-900">{summary.total_rewards}</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <p className="text-sm text-emerald-700">Latest Reward</p>
              <p className="text-lg font-semibold text-emerald-900">
                {summary.latest_reward?.amount ?? "—"}
              </p>
              <p className="text-xs text-emerald-700">
                {summary.latest_reward?.status ?? "—"}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Rewards require manual admin approval per policy.</p>
        </div>
      ) : (
        <p className="text-gray-600">No referral data available yet.</p>
      )}
    </div>
  )
}
