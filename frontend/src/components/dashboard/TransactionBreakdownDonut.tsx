'use client'

export default function TransactionBreakdownDonut({
  deposits,
  withdrawals,
}: {
  deposits: number
  withdrawals: number
}) {
  const total = Math.max(0, deposits) + Math.max(0, withdrawals)

  if (total === 0) {
    return <p className="text-sm text-gray-500">No transactions yet.</p>
  }

  const r = 44
  const c = 2 * Math.PI * r
  const depPct = deposits / total
  const depLen = depPct * c
  const wdLen = c - depLen

  return (
    <div className="flex items-center gap-6">
      <svg width={120} height={120} viewBox="0 0 120 120" role="img" aria-label="Transaction breakdown">
        <g transform="translate(60 60)">
          <circle r={r} fill="none" stroke="currentColor" strokeWidth={14} className="text-gray-200" />
          <circle
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={14}
            strokeLinecap="butt"
            strokeDasharray={`${depLen} ${wdLen}`}
            transform="rotate(-90)"
            className="text-emerald-500"
          />
          <circle
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={14}
            strokeLinecap="butt"
            strokeDasharray={`${wdLen} ${depLen}`}
            strokeDashoffset={-depLen}
            transform="rotate(-90)"
            className="text-orange-500"
          />
        </g>
      </svg>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-emerald-500" />
          <span className="text-sm text-gray-700">Deposits</span>
          <span className="text-sm font-semibold text-gray-900">{deposits}</span>
          <span className="text-xs text-gray-500">({Math.round(depPct * 100)}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-orange-500" />
          <span className="text-sm text-gray-700">Withdrawals</span>
          <span className="text-sm font-semibold text-gray-900">{withdrawals}</span>
          <span className="text-xs text-gray-500">({Math.round((withdrawals / total) * 100)}%)</span>
        </div>
        <div className="pt-2 text-xs text-gray-500">Counts only (no amounts).</div>
      </div>
    </div>
  )
}
