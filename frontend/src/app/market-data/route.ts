import { NextResponse } from 'next/server'

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'
const ALLOWED_IDS = new Set(['bitcoin', 'ethereum', 'solana', 'binancecoin'])

function normalizeIds(raw: string | null): string {
  const requested = (raw || 'bitcoin,ethereum')
    .split(',')
    .map((id) => id.trim().toLowerCase())
    .filter(Boolean)

  const filtered = requested.filter((id) => ALLOWED_IDS.has(id)).slice(0, 4)
  if (!filtered.length) return 'bitcoin,ethereum'
  return filtered.join(',')
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const idsCsv = normalizeIds(searchParams.get('ids'))

  const upstreamUrl =
    `${COINGECKO_BASE}/coins/markets` +
    `?vs_currency=usd&ids=${encodeURIComponent(idsCsv)}` +
    `&sparkline=true&price_change_percentage=24h`

  try {
    const res = await fetch(upstreamUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      return NextResponse.json(
        {
          error: 'Upstream market provider returned an error',
          provider: 'coingecko',
          status: res.status,
          ids: idsCsv,
          bodyPreview: body.slice(0, 200),
        },
        { status: 502 },
      )
    }

    const data = await res.json()
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, max-age=30, s-maxage=60' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Market data unavailable'
    return NextResponse.json(
      { error: 'Failed to fetch market data', provider: 'coingecko', ids: idsCsv, message },
      { status: 502 },
    )
  }
}
