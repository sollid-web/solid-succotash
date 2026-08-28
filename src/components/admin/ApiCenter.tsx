'use client'

import { Braces, Check, Copy, Play, RefreshCw, Search, Terminal, X } from 'lucide-react'
import { FormEvent, useMemo, useState } from 'react'
import { adminRequest } from '@/lib/admin-api'

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type Endpoint = {
  group: string
  label: string
  method: Method
  path: string
  description: string
  body?: string
}

const endpoints: Endpoint[] = [
  { group: 'Authentication', label: 'Current user', method: 'GET', path: '/api/auth/me/', description: 'Returns the authenticated user and staff flags.' },
  { group: 'Authentication', label: 'JWT token aliases', method: 'POST', path: '/api/token/', description: 'Legacy route alias for obtaining the Simple JWT pair.', body: '{\n  "email": "",\n  "password": ""\n}' },
  { group: 'Authentication', label: 'JWT refresh alias', method: 'POST', path: '/api/token/refresh/', description: 'Legacy route alias for refreshing a Simple JWT.', body: '{\n  "refresh": ""\n}' },
  { group: 'Authentication', label: 'Logout', method: 'POST', path: '/api/auth/logout/', description: 'Invalidates the legacy token/session for the current user.' },
  { group: 'Authentication', label: 'Verify active token', method: 'POST', path: '/api/auth/token/verify/', description: 'Checks the current authenticated token.' },
  { group: 'Authentication', label: 'Generate legacy token', method: 'POST', path: '/api/auth/token/generate/', description: 'Generates a token from email and password. Use only when explicitly required.', body: '{\n  "email": "",\n  "password": ""\n}' },
  { group: 'Authentication', label: 'Refresh legacy token', method: 'POST', path: '/api/auth/token/refresh/', description: 'Regenerates the current user’s legacy token.' },
  { group: 'Authentication', label: 'Resend verification', method: 'POST', path: '/api/auth/verification/resend/', description: 'Resends an account verification message.', body: '{\n  "email": ""\n}' },
  { group: 'Authentication', label: 'Complete signup', method: 'POST', path: '/api/auth/complete-signup/', description: 'Completes the custom signup flow.', body: '{\n  "email": "",\n  "password": ""\n}' },
  { group: 'Authentication', label: 'Verify email link', method: 'GET', path: '/api/auth/verify-email/?token=', description: 'Consumes an email verification token.' },
  { group: 'Authentication', label: 'Request password reset', method: 'POST', path: '/api/auth/password/reset/', description: 'Starts a password reset flow.', body: '{\n  "email": ""\n}' },
  { group: 'Authentication', label: 'Confirm password reset', method: 'POST', path: '/api/auth/password/reset/confirm/', description: 'Confirms a password reset token.', body: '{\n  "token": "",\n  "password": ""\n}' },
  { group: 'Platform data', label: 'Agreements', method: 'GET', path: '/api/agreements/', description: 'Lists active legal agreements.' },
  { group: 'Platform data', label: 'Accept agreement', method: 'POST', path: '/api/agreements/{id}/accept/', description: 'Accepts a specific agreement for the current user.' },
  { group: 'Platform data', label: 'Public campaigns', method: 'GET', path: '/api/campaigns/', description: 'Lists currently published campaigns.' },
  { group: 'Platform data', label: 'Public plans', method: 'GET', path: '/api/plans/', description: 'Lists investment plans visible to users.' },
  { group: 'Platform data', label: 'Crypto wallets', method: 'GET', path: '/api/crypto-wallets/', description: 'Lists active company deposit wallets.' },
  { group: 'Platform data', label: 'Public certificate', method: 'GET', path: '/api/public/certificate/', description: 'Returns the active platform certificate.' },
  { group: 'User resources', label: 'My investments', method: 'GET', path: '/api/investments/my/', description: 'Lists investments for the authenticated user.' },
  { group: 'User resources', label: 'Create investment', method: 'POST', path: '/api/investments/', description: 'Creates an investment using serializer validation.', body: '{\n  "plan_id": 0,\n  "amount": 0\n}' },
  { group: 'User resources', label: 'My transactions', method: 'GET', path: '/api/transactions/', description: 'Lists authenticated-user transactions. Supports tx_type query filtering.' },
  { group: 'User resources', label: 'Create transaction', method: 'POST', path: '/api/transactions/', description: 'Creates a validated deposit, withdrawal, profit, or manual credit.', body: '{\n  "tx_type": "deposit",\n  "amount": 0,\n  "reference": "",\n  "payment_method": "bank_transfer"\n}' },
  { group: 'User resources', label: 'Wallet', method: 'GET', path: '/api/wallet/', description: 'Returns the authenticated user wallet summary.' },
  { group: 'User resources', label: 'Analytics overview', method: 'GET', path: '/api/analytics/overview/?days=30', description: 'Returns user-scoped dashboard analytics.' },
  { group: 'User resources', label: 'Virtual cards', method: 'GET', path: '/api/virtual-cards/', description: 'Lists virtual cards owned by the authenticated user.' },
  { group: 'User resources', label: 'Request virtual card', method: 'POST', path: '/api/virtual-cards/', description: 'Creates a virtual card request.', body: '{\n  "purchase_amount": 1000,\n  "notes": ""\n}' },
  { group: 'User resources', label: 'KYC applications', method: 'GET', path: '/api/kyc/', description: 'Lists the current user’s KYC applications.' },
  { group: 'User resources', label: 'Submit KYC personal info', method: 'POST', path: '/api/kyc/personal-info/', description: 'Submits validated KYC personal information.', body: '{\n  "first_name": "",\n  "last_name": "",\n  "date_of_birth": "YYYY-MM-DD",\n  "nationality": "",\n  "address": ""\n}' },
  { group: 'User resources', label: 'Submit KYC document metadata', method: 'POST', path: '/api/kyc/documents/', description: 'Submits KYC document metadata.', body: '{\n  "government_id": {},\n  "proof_of_address": {}\n}' },
  { group: 'User resources', label: 'KYC documents', method: 'GET', path: '/api/kyc-documents/', description: 'Lists current-user KYC documents.' },
  { group: 'User resources', label: 'Notifications', method: 'GET', path: '/api/notifications/', description: 'Lists current-user notifications.' },
  { group: 'User resources', label: 'Unread notification count', method: 'GET', path: '/api/notifications/unread-count/', description: 'Returns the unread notification count.' },
  { group: 'User resources', label: 'Mark notification read', method: 'POST', path: '/api/notifications/{id}/mark-read/', description: 'Marks a notification as read.' },
  { group: 'User resources', label: 'Mark all notifications read', method: 'POST', path: '/api/notifications/mark-all-read/', description: 'Marks all current-user notifications as read.' },
  { group: 'User resources', label: 'Email preferences', method: 'GET', path: '/api/profile/email-preferences/', description: 'Reads current-user email preferences.' },
  { group: 'User resources', label: 'Update email preferences', method: 'PATCH', path: '/api/profile/email-preferences/', description: 'Updates current-user email preferences.', body: '{\n  "email_notifications_enabled": true\n}' },
  { group: 'User resources', label: 'Update language', method: 'POST', path: '/api/update-language/', description: 'Updates the current user language preference.', body: '{\n  "language": "en"\n}' },
  { group: 'User resources', label: 'Generate Telegram link token', method: 'POST', path: '/api/telegram/link-token/', description: 'Creates a token for Telegram account linking.' },
  { group: 'User resources', label: 'Referral summary', method: 'GET', path: '/api/referrals/summary/', description: 'Returns referral summary data.' },
  { group: 'User resources', label: 'Generate referral code', method: 'POST', path: '/api/referrals/generate-code/', description: 'Generates or retrieves a referral code for the current user.' },
  { group: 'User resources', label: 'Referral signup hook', method: 'POST', path: '/api/referrals/signup-hook/', description: 'Attaches a referral code during signup.', body: '{\n  "referral_code": ""\n}' },
  { group: 'Admin resources', label: 'Manual referral reward', method: 'POST', path: '/api/referrals/manual-reward/', description: 'Creates a pending referral reward. Staff-only workflow.', body: '{\n  "user_id": 0,\n  "amount": 0,\n  "reason": ""\n}' },
  { group: 'User resources', label: 'Referral rewards', method: 'GET', path: '/api/referrals/rewards/', description: 'Lists referral rewards.' },
  { group: 'User resources', label: 'Checkout completion', method: 'POST', path: '/api/checkout/completion/', description: 'Completes the checkout workflow.', body: '{\n  "session_id": ""\n}' },
  { group: 'Cards', label: 'Card details', method: 'GET', path: '/api/cards/', description: 'Returns the latest virtual card details for the current user.' },
  { group: 'Cards', label: 'Request card', method: 'POST', path: '/api/cards/', description: 'Requests a card using the cards app workflow.', body: '{\n  "purchase_amount": 1000\n}' },
  { group: 'Cards', label: 'Freeze or unfreeze card', method: 'POST', path: '/api/cards/freeze/', description: 'Toggles the active/suspended state of the current card.' },
  { group: 'Cards', label: 'Card transactions', method: 'GET', path: '/api/cards/transactions/', description: 'Returns card transaction data.' },
  { group: 'Cards', label: 'Verify card password', method: 'POST', path: '/api/cards/verify-password/', description: 'Verifies the account password for a card action.', body: '{\n  "password": ""\n}' },
  { group: 'Cards', label: 'Set card PIN', method: 'POST', path: '/api/cards/set-pin/', description: 'Sets the initial card PIN.', body: '{\n  "pin": ""\n}' },
  { group: 'Cards', label: 'Check card PIN', method: 'POST', path: '/api/cards/check-pin/', description: 'Checks a card PIN.', body: '{\n  "pin": ""\n}' },
  { group: 'Support and operations', label: 'Support request', method: 'POST', path: '/api/support/', description: 'Creates a support request.', body: '{\n  "topic": "",\n  "message": ""\n}' },
  { group: 'Support and operations', label: 'Support requests', method: 'GET', path: '/api/support/requests/', description: 'Lists current-user support requests.' },
  { group: 'Support and operations', label: 'Health check', method: 'GET', path: '/healthz/', description: 'Returns backend health status.' },
  { group: 'Support and operations', label: 'Chat test', method: 'GET', path: '/api/chat/test/', description: 'Checks whether the chat bridge is responding.' },
  { group: 'Support and operations', label: 'Chat reply', method: 'POST', path: '/api/chat/', description: 'Sends a message to the AI chat system.', body: '{\n  "message": "",\n  "session_id": ""\n}' },
  { group: 'Support and operations', label: 'Request human support', method: 'POST', path: '/api/chat/human/', description: 'Requests a human support handoff.', body: '{\n  "session_id": "",\n  "message": ""\n}' },
  { group: 'Support and operations', label: 'Agent reply', method: 'POST', path: '/api/chat/agent-reply/', description: 'Posts an agent response to a chat session.', body: '{\n  "session_id": "",\n  "message": ""\n}' },
  { group: 'Support and operations', label: 'Chat sessions', method: 'GET', path: '/api/chat/sessions/', description: 'Lists or manages chat sessions.' },
  { group: 'Support and operations', label: 'Chat messages', method: 'GET', path: '/api/chat/messages/{session_id}/', description: 'Returns message history for a chat session.' },
  { group: 'Support and operations', label: 'Visitor heartbeat', method: 'POST', path: '/api/chat/visitor/', description: 'Registers or updates a visitor chat heartbeat.' },
  { group: 'Support and operations', label: 'Chat widget script', method: 'GET', path: '/api/chat/widget.js', description: 'Returns the embeddable chat widget JavaScript.' },
  { group: 'Admin resources', label: 'Admin campaigns', method: 'GET', path: '/api/admin/campaigns/', description: 'Lists all campaign announcements for staff.' },
  { group: 'Admin resources', label: 'Admin plans', method: 'GET', path: '/api/admin/plans/', description: 'Lists all investment plans for staff.' },
  { group: 'Admin resources', label: 'Admin transactions', method: 'GET', path: '/api/admin/transactions/', description: 'Lists all transactions for staff.' },
  { group: 'Admin resources', label: 'Admin investments', method: 'GET', path: '/api/admin/investments/', description: 'Lists all user investments for staff.' },
  { group: 'Admin resources', label: 'Admin KYC applications', method: 'GET', path: '/api/admin/kyc/', description: 'Lists all KYC applications for staff.' },
  { group: 'Admin resources', label: 'Admin KYC documents', method: 'GET', path: '/api/admin/kyc-documents/', description: 'Lists all KYC documents for staff.' },
  { group: 'Admin resources', label: 'Admin transition', method: 'PATCH', path: '/api/admin/transactions/{id}/', description: 'Updates an admin transaction using backend workflow validation.', body: '{\n  "status": "approved",\n  "notes": ""\n}' },
  { group: 'Admin resources', label: 'Admin investment transition', method: 'PATCH', path: '/api/admin/investments/{id}/', description: 'Approves or rejects a user investment.', body: '{\n  "status": "approved",\n  "notes": ""\n}' },
  { group: 'Admin resources', label: 'Admin KYC decision', method: 'PATCH', path: '/api/admin/kyc/{id}/', description: 'Approves or rejects a KYC application.', body: '{\n  "status": "approved",\n  "notes": "",\n  "reason": ""\n}' },
  { group: 'Admin resources', label: 'Admin document decision', method: 'PATCH', path: '/api/admin/kyc-documents/{id}/', description: 'Approves or rejects a KYC document.', body: '{\n  "approval_action": "approve",\n  "approval_notes": ""\n}' },
  { group: 'Scheduled operations', label: 'ROI cron trigger', method: 'POST', path: '/api/cron/roi/', description: 'Backend cron endpoint. Requires the configured cron secret; do not run without authorization.', body: '{\n  "date": "YYYY-MM-DD",\n  "secret": ""\n}' },
  { group: 'Scheduled operations', label: 'Drip cron trigger', method: 'POST', path: '/api/cron/drip/', description: 'Backend cron endpoint. Requires the configured cron secret; do not run without authorization.', body: '{\n  "dry_run": true,\n  "secret": ""\n}' },
]

const methodClasses: Record<Method, string> = {
  GET: 'bg-cyan-50 text-cyan-700',
  POST: 'bg-violet-50 text-violet-700',
  PUT: 'bg-amber-50 text-amber-700',
  PATCH: 'bg-orange-50 text-orange-700',
  DELETE: 'bg-rose-50 text-rose-700',
}

function pretty(value: unknown) {
  if (typeof value === 'string') return value
  return JSON.stringify(value, null, 2)
}

export default function ApiCenter() {
  const [selected, setSelected] = useState<Endpoint>(endpoints[0])
  const [path, setPath] = useState(endpoints[0].path)
  const [body, setBody] = useState(endpoints[0].body ?? '')
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [response, setResponse] = useState<unknown>(null)
  const [copied, setCopied] = useState(false)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return endpoints
    return endpoints.filter((endpoint) => `${endpoint.label} ${endpoint.path} ${endpoint.group} ${endpoint.description}`.toLowerCase().includes(term))
  }, [search])

  function selectEndpoint(endpoint: Endpoint) {
    setSelected(endpoint)
    setPath(endpoint.path)
    setBody(endpoint.body ?? '')
    setQuery('')
    setResponse(null)
    setError('')
  }

  async function execute(event?: FormEvent) {
    event?.preventDefault()
    setLoading(true)
    setError('')
    setResponse(null)
    try {
      const finalPath = path.includes('?') || !query.trim() ? path : `${path}?${query.trim().replace(/^\?/, '')}`
      const options: RequestInit = { method: selected.method }
      if (selected.method !== 'GET' && selected.method !== 'DELETE' && body.trim()) {
        try {
          options.body = JSON.stringify(JSON.parse(body))
          options.headers = { 'Content-Type': 'application/json' }
        } catch {
          throw new Error('Request body must be valid JSON.')
        }
      }
      setResponse(await adminRequest(finalPath, options))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Request failed.')
    } finally {
      setLoading(false)
    }
  }

  async function copyResponse() {
    await navigator.clipboard.writeText(pretty(response))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
      <div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600">API center</p><h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">Every backend capability, one workspace.</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">Browse every routed Django endpoint, including user resources, admin workflows, authentication utilities, support operations, referrals, and scheduled triggers. Requests inherit the current administrator’s Bearer session.</p></div><div className="flex items-center gap-2 rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-xs font-semibold text-cyan-800"><Braces size={16} /> {endpoints.length} mapped endpoints</div>
    </div>
    <div className="grid gap-5 xl:grid-cols-[minmax(260px,0.75fr)_minmax(0,1.25fr)]">
      <section className="min-h-[620px] rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_8px_28px_rgba(15,23,42,0.04)]">
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-slate-50 px-3"><Search size={16} className="shrink-0 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Search endpoints…" /></div>
        <div className="max-h-[540px] space-y-4 overflow-y-auto pr-1">{Array.from(new Set(filtered.map((endpoint) => endpoint.group))).map((group) => <div key={group}><p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{group}</p><div className="space-y-1">{filtered.filter((endpoint) => endpoint.group === group).map((endpoint) => <button key={`${endpoint.method}-${endpoint.path}`} onClick={() => selectEndpoint(endpoint)} className={`w-full rounded-xl px-3 py-3 text-left transition ${selected === endpoint ? 'bg-slate-950 text-white shadow-sm' : 'hover:bg-slate-50'}`}><div className="flex items-start gap-2"><span className={`mt-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${selected === endpoint ? 'bg-white/15 text-cyan-200' : methodClasses[endpoint.method]}`}>{endpoint.method}</span><span className={`min-w-0 flex-1 truncate text-sm font-semibold ${selected === endpoint ? 'text-white' : 'text-slate-800'}`}>{endpoint.label}</span></div><p className={`mt-1 truncate pl-11 font-mono text-[10px] ${selected === endpoint ? 'text-slate-300' : 'text-slate-400'}`}>{endpoint.path}</p></button>)}</div></div>)}</div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:p-7">
        <div className="flex items-start justify-between gap-4"><div><div className="mb-3 flex items-center gap-2"><span className={`rounded-lg px-2 py-1 text-[11px] font-bold ${methodClasses[selected.method]}`}>{selected.method}</span><span className="font-mono text-xs text-slate-400">{selected.group}</span></div><h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">{selected.label}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{selected.description}</p></div><Terminal className="shrink-0 text-cyan-600" size={22} /></div>
        <form onSubmit={execute} className="mt-7 space-y-5"><label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Endpoint path</span><input value={path} onChange={(event) => setPath(event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 font-mono text-sm outline-none focus:border-cyan-500" /></label><label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Query string <span className="font-normal text-slate-400">(optional, without ?)</span></span><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 font-mono text-sm outline-none focus:border-cyan-500" placeholder="page=1&status=pending" /></label>{selected.method !== 'GET' && selected.method !== 'DELETE' && <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">JSON request body</span><textarea value={body} onChange={(event) => setBody(event.target.value)} rows={9} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-xs leading-6 outline-none focus:border-cyan-500" placeholder="{}" /></label>}{error && <div className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700"><X className="mt-0.5 shrink-0" size={17} /><div><p className="font-semibold">Request failed</p><p className="mt-1">{error}</p></div></div>}<button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50">{loading ? <RefreshCw className="animate-spin" size={17} /> : <Play size={17} />} {loading ? 'Running request…' : 'Run authenticated request'}</button></form>
        {response !== null && <div className="mt-7 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950"><div className="flex items-center justify-between border-b border-white/10 px-4 py-3"><div className="flex items-center gap-2 text-xs font-semibold text-slate-300"><Check size={15} className="text-emerald-400" /> Response</div><button type="button" onClick={() => void copyResponse()} className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white">{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}</button></div><pre className="max-h-[360px] overflow-auto p-4 font-mono text-xs leading-6 text-cyan-100">{pretty(response)}</pre></div>}
      </section>
    </div>
  </div>
}
