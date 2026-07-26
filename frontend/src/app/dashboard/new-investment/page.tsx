'use client'
import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import Link from 'next/link'

interface Plan { id: number; name: string; description: string; daily_roi: string; duration_days: number; min_amount: string; max_amount: string }

const PLAN_COLORS = ["#3b82f6","#00a896","#8b5cf6","#f59e0b","#10b981"]

export default function NewInvestmentPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [planId, setPlanId] = useState<number|''>('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const readErrorMessage = async (res: Response) => {
    const text = await res.text()
    if (!text) return `Request failed (${res.status})`
    try {
      const data = JSON.parse(text)
      if (data?.detail) return String(data.detail)
      if (data?.error) return String(data.error)
      const fieldErrors = Object.entries(data).filter(([,v]) => Array.isArray(v) && (v as any[]).length).map(([k,v]) => `${k}: ${(v as string[]).join(', ')}`)
      if (fieldErrors.length) return fieldErrors.join(' | ')
      return text
    } catch { return text }
  }

  useEffect(() => {
    const load = async () => { try { const res = await apiFetch('/api/plans/'); if (res.ok) { const data = await res.json(); setPlans(data) } } catch {} }
    load()
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setMessage('')
    if (!planId) return setError('Please select a plan')
    if (!amount) return setError('Please enter an amount')
    setLoading(true)
    try {
      const res = await apiFetch('/api/investments/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan_id: Number(planId), amount: Number(amount) }) })
      if (res.ok) { setMessage('Investment created successfully!'); setTimeout(() => (window.location.href = '/dashboard'), 1500) }
      else { const msg = await readErrorMessage(res); setError(msg || 'Failed to create investment') }
    } catch { setError('Network error. Please try again.') }
    finally { setLoading(false) }
  }

  const selectedPlan = plans.find(p => p.id === planId)

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: 700, marginBottom: "4px" }}>New Investment</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Choose a plan and start growing your portfolio</p>
      </div>

      {/* Plan cards */}
      {plans.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px", marginBottom: "28px" }}>
          {plans.map((p, i) => (
            <div key={p.id} onClick={() => setPlanId(p.id)} style={{
              borderRadius: "16px", padding: "16px", cursor: "pointer",
              background: planId === p.id ? `rgba(${i===0?'59,130,246':i===1?'0,168,150':i===2?'139,92,246':i===3?'245,158,11':'16,185,129'},0.15)` : "rgba(255,255,255,0.04)",
              border: `1px solid ${planId === p.id ? PLAN_COLORS[i%5] : "rgba(255,255,255,0.08)"}`,
              transition: "all 0.2s",
            }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: PLAN_COLORS[i%5], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "14px", marginBottom: "10px" }}>⬡</div>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>{p.name}</div>
              <div style={{ color: PLAN_COLORS[i%5], fontWeight: 700, fontSize: "18px", fontFamily: "monospace", marginBottom: "4px" }}>{p.daily_roi}%<span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 400 }}>/day</span></div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>{p.duration_days} days</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginTop: "4px" }}>${p.min_amount} – ${p.max_amount}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ maxWidth: "480px" }}>
        {error && <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: "13px", marginBottom: "16px" }}>{error}</div>}
        {message && <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399", fontSize: "13px", marginBottom: "16px" }}>{message}</div>}

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label>Select Plan</label>
            <select value={planId} onChange={e => setPlanId(Number(e.target.value))}>
              <option value="">Choose a plan</option>
              {plans.map(p => <option key={p.id} value={p.id}>{p.name} · {p.daily_roi}% · {p.duration_days} days</option>)}
            </select>
          </div>

          {selectedPlan && (
            <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(0,168,150,0.08)", border: "1px solid rgba(0,168,150,0.2)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[["Daily ROI", `${selectedPlan.daily_roi}%`], ["Duration", `${selectedPlan.duration_days} days`], ["Min Amount", `$${selectedPlan.min_amount}`], ["Max Amount", `$${selectedPlan.max_amount}`]].map(([l,v]) => (
                  <div key={l}><div style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>{l}</div><div style={{ color: "#00a896", fontWeight: 600, fontSize: "14px" }}>{v}</div></div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label>Amount (USD)</label>
            <input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" />
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px", marginTop: "6px" }}>Must be within the plan's min/max limits.</p>
          </div>

          <button type="submit" disabled={loading} className="btn-cta-sky" style={{ width: "fit-content" }}>
            {loading ? 'Creating...' : 'Create Investment'}
          </button>
        </form>
      </div>
    </div>
  )
}