import { NextResponse } from 'next/server'

// Deprecated route: public transactions feed disabled to preserve brand and UX
export async function GET() {
  return NextResponse.json({ disabled: true, reason: 'Live feed removed' }, { status: 410 })
}
