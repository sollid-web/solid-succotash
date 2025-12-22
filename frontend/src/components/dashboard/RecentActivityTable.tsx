'use client'

export type RecentActivityRow = {
  date: string // ISO
  action_type: string
  status: string
}

function statusPill(status: string) {
  const s = (status || '').toLowerCase()
  if (s === 'approved' || s === 'completed') return 'bg-emerald-100 text-emerald-700'
  if (s === 'pending' || s === 'draft') return 'bg-amber-100 text-amber-700'
  if (s === 'rejected') return 'bg-rose-100 text-rose-700'
  return 'bg-gray-100 text-gray-700'
}

export default function RecentActivityTable({ rows }: { rows: RecentActivityRow[] }) {
  if (!rows.length) {
    return <p className="text-sm text-gray-500">No recent activity.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Action type</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.map((r, idx) => (
            <tr key={`${r.date}-${idx}`}>
              <td className="px-4 py-3 text-gray-700">
                {r.date ? new Date(r.date).toLocaleString() : ''}
              </td>
              <td className="px-4 py-3 text-gray-700">{r.action_type}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusPill(r.status)}`}>
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
