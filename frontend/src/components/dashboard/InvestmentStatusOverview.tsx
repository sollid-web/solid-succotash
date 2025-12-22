'use client'

function Bar({
  label,
  value,
  max,
  colorClass,
}: {
  label: string
  value: number
  max: number
  colorClass: string
}) {
  const pct = max <= 0 ? 0 : Math.round((value / max) * 100)
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-700">{label}</span>
        <span className="font-semibold text-gray-900">{value}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
        <svg viewBox="0 0 100 8" className="h-2 w-full" preserveAspectRatio="none">
          <rect
            x={0}
            y={0}
            width={pct}
            height={8}
            rx={4}
            fill="currentColor"
            className={colorClass}
          />
        </svg>
      </div>
    </div>
  )
}

export default function InvestmentStatusOverview({
  active,
  completed,
  pending,
}: {
  active: number
  completed: number
  pending: number
}) {
  const max = Math.max(active, completed, pending, 1)

  return (
    <div className="space-y-4">
      <Bar label="Active" value={active} max={max} colorClass="text-blue-500" />
      <Bar
        label="Completed"
        value={completed}
        max={max}
        colorClass="text-emerald-500"
      />
      <Bar label="Pending" value={pending} max={max} colorClass="text-amber-500" />
    </div>
  )
}
