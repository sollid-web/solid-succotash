'use client'

export type ActivityOverTimePoint = {
  date: string // YYYY-MM-DD
  count: number
}

export default function ActivityOverTimeChart({
  data,
}: {
  data: ActivityOverTimePoint[]
}) {
  const max = Math.max(0, ...data.map((d) => d.count))
  const safeMax = max === 0 ? 1 : max

  const chartHeight = 112
  const plotHeight = 100
  const viewWidth = 1000
  const gap = 2
  const barWidth = data.length ? viewWidth / data.length : viewWidth

  if (!data.length) {
    return <p className="text-sm text-gray-500">No activity yet.</p>
  }

  return (
    <div>
      <div className="h-28">
        <svg
          viewBox={`0 0 ${viewWidth} ${chartHeight}`}
          className="h-28 w-full"
          role="img"
          aria-label="Activity over time"
        >
          {data.map((d, idx) => {
            const pct = Math.max(0, Math.min(1, d.count / safeMax))
            const h = Math.round(pct * plotHeight)
            const x = idx * barWidth
            const y = plotHeight - h

            return (
              <g key={d.date}>
                <rect
                  x={x + gap / 2}
                  y={y}
                  width={Math.max(0, barWidth - gap)}
                  height={h}
                  rx={6}
                  fill="currentColor"
                  className="text-blue-100"
                >
                  <title>{`${d.date}: ${d.count}`}</title>
                </rect>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="mt-2 flex gap-1">
        {data.map((d, idx) => {
          const showLabel = idx === 0 || idx === data.length - 1 || idx % 7 === 0
          return (
            <div
              key={d.date}
              className="flex-1 text-center text-[10px] text-gray-400 leading-none"
            >
              {showLabel ? d.date.slice(5) : ''}
            </div>
          )
        })}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>Less</span>
        <span>More</span>
      </div>
    </div>
  )
}
