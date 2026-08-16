'use client'
import { useEffect, useState, useMemo } from 'react'
import { apiFetch } from '@/lib/api'

interface Transaction {
  id: string; tx_type: string; amount: string; reference: string;
  payment_method: string; tx_hash: string; wallet_address_used: string;
  status: string; created_at: string; updated_at: string; approval_notes?: string;
}

const TYPE_CONFIG: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  deposit:    { label: "Deposit",    icon: "↓", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  withdrawal: { label: "Withdrawal", icon: "↑", color: "#ef4444", bg: "rgba(239,68,68,0.1)"  },
  profit:     { label: "Profit",     icon: "◈", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  investment: { label: "Investment", icon: "⬡", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  bonus:      { label: "Bonus",      icon: "★", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
};
const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  approved:  { color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  completed: { color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  pending:   { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  rejected:  { color: "#ef4444", bg: "rgba(239,68,68,0.1)"  },
  failed:    { color: "#ef4444", bg: "rgba(239,68,68,0.1)"  },
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date'|'amount'>('date')
  const [sortOrder, setSortOrder] = useState<'asc'|'desc'>('desc')

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const qs = filterType !== 'all' ? `?tx_type=${encodeURIComponent(filterType)}` : ''
        const res = await apiFetch(`/api/transactions/${qs}`, { headers: { 'Content-Type': 'application/json' } })
        if (res.ok) { const data = await res.json(); setTransactions(Array.isArray(data) ? data : []) }
        else setError('Failed to load transactions')
      } catch { setError('Network error. Please try again.') }
      finally { setLoading(false) }
    }
    fetch_()
  }, [filterType])

  const filtered = useMemo(() => {
    let f = [...transactions]
    if (filterType !== 'all') f = f.filter(t => t.tx_type === filterType)
    if (filterStatus !== 'all') f = f.filter(t => t.status === filterStatus)
    if (searchTerm) { const s = searchTerm.toLowerCase(); f = f.filter(t => t.id.toLowerCase().includes(s) || t.reference?.toLowerCase().includes(s) || t.payment_method?.toLowerCase().includes(s)) }
    f.sort((a, b) => {
      if (sortBy === 'date') { const da = new Date(a.created_at).getTime(), db = new Date(b.created_at).getTime(); return sortOrder === 'asc' ? da-db : db-da }
      const na = parseFloat(a.amount||'0'), nb = parseFloat(b.amount||'0'); return sortOrder === 'asc' ? na-nb : nb-na
    })
    return f
  }, [transactions, filterType, filterStatus, searchTerm, sortBy, sortOrder])

  const stats = useMemo(() => ({
    totalDeposits: transactions.filter(t => t.tx_type === 'deposit' && t.status === 'approved').reduce((s,t) => s + parseFloat(t.amount||'0'), 0),
    totalWithdrawals: transactions.filter(t => t.tx_type === 'withdrawal' && t.status === 'approved').reduce((s,t) => s + parseFloat(t.amount||'0'), 0),
    pendingCount: transactions.filter(t => t.status === 'pending').length,
  }), [transactions])

  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: 700, marginBottom: "4px" }}>Transaction History</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>All deposits, withdrawals, and activity</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" }}>
        {[
          { label: "Total Deposits", value: fmt(stats.totalDeposits), color: "#10b981" },
          { label: "Total Withdrawals", value: fmt(stats.totalWithdrawals), color: "#ef4444" },
          { label: "Pending", value: String(stats.pendingCount), color: "#f59e0b" },
        ].map(s => (
          <div key={s.label} style={{ borderRadius: "16px", padding: "16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "6px" }}>{s.label}</div>
            <div style={{ color: s.color, fontSize: "20px", fontWeight: 700, fontFamily: "monospace" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ borderRadius: "16px", padding: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", marginBottom: "20px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "12px" }}>
        <div>
          <label>Search</label>
          <input type="text" placeholder="ID, reference..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div><label>Type</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
            <option value="profit">Profit</option>
          </select>
        </div>
        <div><label>Status</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div><label>Sort By</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} style={{ flex: 1 }}>
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>
            <button onClick={() => setSortOrder(s => s === 'asc' ? 'desc' : 'asc')} style={{ padding: "0 12px", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: "14px" }}>
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ borderRadius: "16px", overflow: "hidden", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>Loading transactions...</div>
        ) : error ? (
          <div style={{ padding: "16px", color: "#f87171", fontSize: "13px" }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📋</div>
            <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>No transactions found</p>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px" }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Type</th><th>Transaction</th><th>Method</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                  <th>Status</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(tx => {
                  const type = TYPE_CONFIG[tx.tx_type] || { label: tx.tx_type, icon: "·", color: "#9ca3af", bg: "rgba(156,163,175,0.1)" }
                  const stat = STATUS_CONFIG[tx.status] || { color: "#9ca3af", bg: "rgba(156,163,175,0.1)" }
                  const isCredit = ["deposit","profit","bonus"].includes(tx.tx_type)
                  const d = new Date(tx.created_at)
                  return (
                    <tr key={tx.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: type.bg, display: "flex", alignItems: "center", justifyContent: "center", color: type.color, fontWeight: 700, fontSize: "14px" }}>{type.icon}</div>
                          <span style={{ color: "#fff", fontWeight: 500 }}>{type.label}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", fontFamily: "monospace" }}>#{tx.id.slice(0,8)}</div>
                        {tx.reference && <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px" }}>Ref: {tx.reference}</div>}
                      </td>
                      <td style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>{tx.payment_method || "—"}</td>
                      <td style={{ textAlign: "right", color: isCredit ? "#10b981" : "#f87171", fontFamily: "monospace", fontWeight: 600 }}>
                        {isCredit ? "+" : "-"}${parseFloat(tx.amount||'0').toFixed(2)}
                      </td>
                      <td>
                        <span style={{ padding: "3px 10px", borderRadius: "99px", background: stat.bg, color: stat.color, fontSize: "11px", fontWeight: 600 }}>
                          ● {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>{d.toLocaleDateString()}</div>
                        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>{d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
              Showing {filtered.length} of {transactions.length} transactions
            </div>
          </div>
        )}
      </div>
    </div>
  )
}