'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'

type Withdrawal = {
  id: string
  user_email: string
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
      if (!res.ok) throw new Error(`Failed to load (${res.status})`)
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

      if (!res.ok) throw new Error(`Failed to ${status}`)

      setRows(prev => prev.filter(r => r.id !== id))
    } catch (e: any) {
      setError(e?.message || `Failed to ${status}`)
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Pending Withdrawals</h1>
          <Link href="/dashboard" className="text-blue-600 text-sm underline">
            Dashboard
          </Link>
        </div>

        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

        {loading ? (
          <div>Loading...</div>
        ) : rows.length === 0 ? (
          <div>No pending withdrawals.</div>
        ) : (
          rows.map(row => (
            <div key={row.id} className="bg-white p-4 border rounded mb-4">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{row.user_email}</div>
                  <div className="text-sm text-gray-500">
                    ${row.amount} • {new Date(row.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              <input
                className="mt-3 border rounded px-3 py-2 w-full text-sm"
                placeholder="Admin notes"
                value={notesById[row.id] || ''}
                onChange={(e) =>
                  setNotesById(prev => ({ ...prev, [row.id]: e.target.value }))
                }
              />

              <div className="mt-3 flex gap-2">
                <button
                  disabled={actionId === row.id}
                  onClick={() => submitAction(row.id, 'approved')}
                  className="px-3 py-2 bg-green-600 text-white rounded text-sm"
                >
                  Approve
                </button>
                <button
                  disabled={actionId === row.id}
                  onClick={() => submitAction(row.id, 'rejected')}
                  className="px-3 py-2 bg-red-600 text-white rounded text-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}