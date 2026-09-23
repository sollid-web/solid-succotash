'use client'

import { FormEvent, useState } from 'react'

function track(name: string, props: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  const w = window as Window & { gtag?: (...args: unknown[]) => void; analytics?: { track?: (event: string, properties?: Record<string, unknown>) => void } }
  w.gtag?.('event', name, props)
  w.analytics?.track?.(name, props)
}

export default function VerificationPackRequest() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const email = String(data.get('email') || '').trim()
    const consent = data.get('consent') === 'on'

    if (!email || !consent) {
      setStatus('error')
      setMessage('Enter an email address and confirm that you want the requested information.')
      return
    }

    track('lead_form_submit', { form: 'verification_pack', audience: data.get('audience') || 'unspecified' })
    setStatus('sending')
    setMessage('')

    try {
      const response = await fetch('/api/verification-pack-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(data.get('name') || '').trim(),
          email,
          country: String(data.get('country') || '').trim(),
          audience: String(data.get('audience') || 'unspecified'),
          consent,
          website: String(data.get('website') || ''),
          source: typeof window !== 'undefined' ? window.location.href : '/verification-pack',
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result?.error || 'Request could not be sent.')
      form.reset()
      setStatus('success')
      setMessage('Request received. The support team will follow up using the address you provided.')
      track('lead_form_complete', { form: 'verification_pack' })
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Request could not be sent. Please email support@mail.wolvcapital.com instead.')
      track('lead_form_error', { form: 'verification_pack' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm" aria-describedby="verification-pack-note">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">Name <span className="font-normal text-slate-400">(optional)</span>
          <input name="name" type="text" autoComplete="name" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="Your name" />
        </label>
        <label className="text-sm font-medium text-slate-700">Email address <span className="text-red-500">*</span>
          <input name="email" type="email" required autoComplete="email" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="you@example.com" />
        </label>
        <label className="text-sm font-medium text-slate-700">Audience
          <select name="audience" className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option value="individual">Individual visitor</option>
            <option value="token-researcher">Token researcher</option>
            <option value="partner">Partner or media</option>
            <option value="professional">Professional reviewer</option>
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700">Country <span className="font-normal text-slate-400">(optional)</span>
          <input name="country" type="text" autoComplete="country-name" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="Country of residence" />
        </label>
      </div>
      <label className="mt-4 flex gap-3 text-sm leading-relaxed text-slate-600">
        <input name="consent" type="checkbox" required className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
        <span>I agree to receive the requested verification information and understand that this request is not an offer, recommendation, or promise of performance. See the <a href="/privacy" className="font-semibold text-blue-700 underline">Privacy Policy</a>.</span>
      </label>
      <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-px w-px opacity-0" />
      <button type="submit" disabled={status === 'sending'} className="mt-5 inline-flex items-center justify-center rounded-lg bg-[#0b2f6b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16498f] disabled:cursor-wait disabled:opacity-60">
        {status === 'sending' ? 'Sending request…' : 'Request the verification pack'}
      </button>
      <p id="verification-pack-note" className="mt-3 text-xs leading-relaxed text-slate-500">We use this information to respond to your request. We do not use this form to approve eligibility or process deposits.</p>
      {message && <p role="status" className={`mt-4 rounded-lg p-3 text-sm ${status === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>{message}</p>}
    </form>
  )
}
