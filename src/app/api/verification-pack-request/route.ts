import { NextResponse } from 'next/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>
    const name = String(body.name || '').trim().slice(0, 120)
    const email = String(body.email || '').trim().toLowerCase().slice(0, 254)
    const country = String(body.country || '').trim().slice(0, 100)
    const audience = String(body.audience || 'unspecified').trim().slice(0, 80)
    const source = String(body.source || '/verification-pack').trim().slice(0, 300)
    const honeypot = String(body.website || '').trim()

    if (honeypot) return NextResponse.json({ ok: true })
    if (!EMAIL_RE.test(email)) return NextResponse.json({ ok: false, error: 'Please provide a valid email address.' }, { status: 400 })
    if (body.consent !== true) return NextResponse.json({ ok: false, error: 'Consent is required to request the pack.' }, { status: 400 })

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID
    if (!botToken || !chatId) {
      return NextResponse.json({ ok: false, error: 'The request channel is temporarily unavailable. Please email support@mail.wolvcapital.com.' }, { status: 503 })
    }

    const message = [
      'New WolvCapital verification-pack request',
      `Name: ${name || 'Not provided'}`,
      `Email: ${email}`,
      `Audience: ${audience}`,
      `Country: ${country || 'Not provided'}`,
      `Source: ${source}`,
      'Consent: confirmed',
    ].join('\n')

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message }),
      cache: 'no-store',
    })
    if (!response.ok) throw new Error('Notification provider rejected the request')

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Request could not be sent. Please email support@mail.wolvcapital.com.' }, { status: 500 })
  }
}
