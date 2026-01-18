'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'

type Withdrawal = {
  id: string
  user_email: string
  tx_type: 'withdrawal'
  amount: string
  reference: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  notes?: string
  created_at: string
}

export default function AdminWithdrawalsPage() {
  const [rows, setRows] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notesById, setNotesById] = useState<Record<string, string>>({})
  const [actionId, setActionId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await apiFetch('/api/admin/transactions/?tx_type=withdrawal&status=pending')
      if (!res.ok) {
        throw new Error(`Failed to load withdrawals (${res.status})`)
      }
      const data = await res.json()
      setRows(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setError(e?.message || 'Failed to load withdrawals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const updateNotes = (id: string, val: string) => {
    setNotesById((prev) => ({ ...prev, [id]: val }))
  }

  const submitAction = async (id: string, status: 'approved' | 'rejected') => {
    setActionId(id)
    setError('')
    try {
      const res = await apiFetch(`/api/admin/transactions/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          notes: notesById[id] || '',
        }),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Failed to ${status} withdrawal`)
      }
      setRows((prev) => prev.filter((row) => row.id !== id))
    } catch (e: any) {
      setError(e?.message || `Failed to ${status} withdrawal`)
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-lg font-semibold">Pending Withdrawals</div>
          <div className="flex items-center gap-3">
            <button
              onClick={load}
              className="px-3 py-2 rounded-md border border-gray-300 text-sm"
              disabled={loading}
            >
              Refresh
            </button>
            <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-md border bg-white p-6">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="rounded-md border bg-white p-6 text-gray-600">No pending withdrawals.</div>
        ) : (
          <div className="space-y-4">
            {rows.map((row) => (
              <div key={row.id} className="rounded-lg border bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-500">User</div>
                    <div className="font-medium">{row.user_email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Amount</div>
                    <div className="font-semibold">${row.amount}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Requested</div>
                    <div className="text-sm">{new Date(row.created_at).toLocaleString()}</div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  Reference: {row.reference}
                </div>
                <div className="mt-3">
                  <label className="block text-xs text-gray-500 mb-1">Admin notes</label>
                  <input
                    type="text"
                    value={notesById[row.id] || ''}
                    onChange={(e) => updateNotes(row.id, e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="Optional notes"
                  />
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => submitAction(row.id, 'approved')}
                    disabled={actionId === row.id}
                    className="px-3 py-2 rounded bg-green-600 text-white text-sm disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => submitAction(row.id, 'rejected')}
                    disabled={actionId === row.id}
                    className="px-3 py-2 rounded bg-red-600 text-white text-sm disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
