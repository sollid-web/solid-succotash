import { NextResponse } from 'next/server'

// Environment variable pointing to real backend feed (e.g. Django API endpoint)
const LIVE_FEED_URL = process.env.LIVE_FEED_URL || ''

interface TxEvent {
  id: string
  type: 'Deposit' | 'Withdrawal'
  name: string
  amount: number
  currency?: string
  createdAt: string
}

// Fallback mock data (privacy-safe, anonymized)
const MOCK: TxEvent[] = [
  { id: 'm1', type: 'Deposit', name: 'Alex R.', amount: 1500, currency: 'USD', createdAt: new Date(Date.now() - 60_000).toISOString() },
  { id: 'm2', type: 'Withdrawal', name: 'María G.', amount: 420, currency: 'USD', createdAt: new Date(Date.now() - 5 * 60_000).toISOString() },
  { id: 'm3', type: 'Deposit', name: 'D. Chen', amount: 8000, currency: 'USD', createdAt: new Date(Date.now() - 12 * 60_000).toISOString() },
  { id: 'm4', type: 'Deposit', name: 'Sofia L.', amount: 275, currency: 'USD', createdAt: new Date(Date.now() - 20 * 60_000).toISOString() },
  { id: 'm5', type: 'Withdrawal', name: 'K. Patel', amount: 1200, currency: 'USD', createdAt: new Date(Date.now() - 45 * 60_000).toISOString() },
]

export async function GET() {
  // Try real feed first
  if (LIVE_FEED_URL) {
    try {
      const res = await fetch(LIVE_FEED_URL, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length) {
          // Basic shape enforcement & limiting
          const normalized: TxEvent[] = data.slice(0, 20).map((d, i) => ({
            id: String(d.id ?? `ext_${i}`),
            type: d.type === 'Withdrawal' ? 'Withdrawal' : 'Deposit',
            name: typeof d.name === 'string' ? d.name : 'User',
            amount: typeof d.amount === 'number' ? d.amount : 0,
            currency: d.currency || 'USD',
            createdAt: typeof d.createdAt === 'string' ? d.createdAt : new Date().toISOString(),
          }))
          return NextResponse.json(normalized, { status: 200 })
        }
      }
    } catch (err) {
      // fall through to mock
    }
  }
  return NextResponse.json(MOCK, { status: 200 })
}
