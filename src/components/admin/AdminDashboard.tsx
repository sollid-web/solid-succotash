'use client'

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ClipboardList,
  Eye,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  Menu,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  WalletCards,
  X,
} from 'lucide-react'
import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import {
  AdminUser,
  ApiRecord,
  clearAdminSession,
  createAdminResource,
  deleteAdminResource,
  getAdminResource,
  getCurrentAdmin,
  getStoredAdminUser,
  isPlatformAdmin,
  listAdminResource,
  loginAdmin,
  setStoredAdminUser,
  updateAdminResource,
} from '@/lib/admin-api'

type ResourceKey = 'overview' | 'campaigns' | 'plans' | 'transactions' | 'investments' | 'kyc' | 'documents'
type Mode = 'list' | 'create' | 'edit' | 'show'
type FieldType = 'text' | 'textarea' | 'number' | 'datetime-local' | 'date' | 'url' | 'checkbox'

type ResourceConfig = {
  key: Exclude<ResourceKey, 'overview'>
  label: string
  singular: string
  path: string
  icon: typeof ClipboardList
  description: string
  searchFields: string[]
  columns: { key: string; label: string; kind?: 'status' | 'currency' | 'date' }[]
  fields: {
    key: string
    label: string
    type: FieldType
    required?: boolean
    placeholder?: string
    help?: string
  }[]
  workflow?: 'transaction' | 'investment' | 'kyc' | 'document'
}

const resources: ResourceConfig[] = [
  {
    key: 'campaigns',
    label: 'Campaigns',
    singular: 'campaign',
    path: '/api/admin/campaigns/',
    icon: Sparkles,
    description: 'Publish, schedule, and manage campaign announcements.',
    searchFields: ['title', 'slug', 'summary'],
    columns: [
      { key: 'title', label: 'Campaign' },
      { key: 'is_published', label: 'Published', kind: 'status' },
      { key: 'is_live', label: 'Live', kind: 'status' },
      { key: 'publish_at', label: 'Publish at', kind: 'date' },
      { key: 'expires_at', label: 'Expires', kind: 'date' },
    ],
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true, help: 'Stable URL identifier used by the public campaign surface.' },
      { key: 'summary', label: 'Summary', type: 'textarea', required: true },
      { key: 'body', label: 'Body', type: 'textarea', required: true },
      { key: 'cta_label', label: 'CTA label', type: 'text' },
      { key: 'cta_url', label: 'CTA URL', type: 'url' },
      { key: 'publish_at', label: 'Publish at', type: 'datetime-local', required: true },
      { key: 'expires_at', label: 'Expires at', type: 'datetime-local' },
      { key: 'is_published', label: 'Published', type: 'checkbox' },
    ],
  },
  {
    key: 'plans',
    label: 'Investment plans',
    singular: 'investment plan',
    path: '/api/admin/plans/',
    icon: WalletCards,
    description: 'Configure ROI, duration, and amount limits for investment plans.',
    searchFields: ['name', 'description'],
    columns: [
      { key: 'name', label: 'Plan' },
      { key: 'daily_roi', label: 'Daily ROI' },
      { key: 'duration_days', label: 'Duration' },
      { key: 'min_amount', label: 'Minimum', kind: 'currency' },
      { key: 'max_amount', label: 'Maximum', kind: 'currency' },
    ],
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true },
      { key: 'daily_roi', label: 'Daily ROI (%)', type: 'number', required: true, placeholder: '0.00' },
      { key: 'duration_days', label: 'Duration (days)', type: 'number', required: true, placeholder: '30' },
      { key: 'min_amount', label: 'Minimum amount', type: 'number', required: true, placeholder: '100.00' },
      { key: 'max_amount', label: 'Maximum amount', type: 'number', required: true, placeholder: '10000.00' },
    ],
  },
  {
    key: 'transactions',
    label: 'Transactions',
    singular: 'transaction',
    path: '/api/admin/transactions/',
    icon: ClipboardList,
    description: 'Review deposits, withdrawals, and manual credits with controlled status transitions.',
    searchFields: ['user_email', 'reference', 'tx_type', 'status'],
    columns: [
      { key: 'user_email', label: 'User' },
      { key: 'tx_type', label: 'Type' },
      { key: 'amount', label: 'Amount', kind: 'currency' },
      { key: 'status', label: 'Status', kind: 'status' },
      { key: 'created_at', label: 'Created', kind: 'date' },
    ],
    fields: [
      { key: 'status', label: 'Status', type: 'text', help: 'Use approved or rejected to trigger the backend approval workflow.' },
      { key: 'notes', label: 'Review notes', type: 'textarea' },
    ],
    workflow: 'transaction',
  },
  {
    key: 'investments',
    label: 'User investments',
    singular: 'user investment',
    path: '/api/admin/investments/',
    icon: LayoutDashboard,
    description: 'Review investment requests and approve or reject their lifecycle transitions.',
    searchFields: ['user_email', 'plan_name', 'status'],
    columns: [
      { key: 'user_email', label: 'User' },
      { key: 'plan_name', label: 'Plan' },
      { key: 'amount', label: 'Amount', kind: 'currency' },
      { key: 'status', label: 'Status', kind: 'status' },
      { key: 'created_at', label: 'Created', kind: 'date' },
    ],
    fields: [
      { key: 'status', label: 'Status', type: 'text', help: 'Use approved or rejected to trigger the backend lifecycle workflow.' },
      { key: 'notes', label: 'Review notes', type: 'textarea' },
    ],
    workflow: 'investment',
  },
  {
    key: 'kyc',
    label: 'KYC applications',
    singular: 'KYC application',
    path: '/api/admin/kyc/',
    icon: ShieldCheck,
    description: 'Review applicant information and approve or reject KYC applications.',
    searchFields: ['user_email', 'status'],
    columns: [
      { key: 'user_email', label: 'Applicant' },
      { key: 'status', label: 'Status', kind: 'status' },
      { key: 'last_submitted_at', label: 'Submitted', kind: 'date' },
      { key: 'reviewed_at', label: 'Reviewed', kind: 'date' },
    ],
    fields: [
      { key: 'status', label: 'Status', type: 'text', help: 'Use approved or rejected to trigger review logic.' },
      { key: 'notes', label: 'Review notes', type: 'textarea' },
      { key: 'reason', label: 'Rejection reason', type: 'textarea', help: 'Required when rejecting an application.' },
    ],
    workflow: 'kyc',
  },
  {
    key: 'documents',
    label: 'KYC documents',
    singular: 'KYC document',
    path: '/api/admin/kyc-documents/',
    icon: FileCheck2,
    description: 'Approve or reject uploaded identity and address documents.',
    searchFields: ['user_email', 'document_type', 'status'],
    columns: [
      { key: 'user_email', label: 'Applicant' },
      { key: 'document_type', label: 'Document' },
      { key: 'status', label: 'Status', kind: 'status' },
      { key: 'submitted_at', label: 'Submitted', kind: 'date' },
      { key: 'reviewed_at', label: 'Reviewed', kind: 'date' },
    ],
    fields: [
      { key: 'approval_action', label: 'Review action', type: 'text', help: 'Use approve or reject.' },
      { key: 'approval_notes', label: 'Approval notes', type: 'textarea', help: 'Required when rejecting a document.' },
    ],
    workflow: 'document',
  },
]

const resourceByKey = Object.fromEntries(resources.map((resource) => [resource.key, resource])) as Record<Exclude<ResourceKey, 'overview'>, ResourceConfig>

function formatDate(value: unknown) {
  if (!value) return '—'
  const date = new Date(String(value))
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

function formatCurrency(value: unknown) {
  if (value === null || value === undefined || value === '') return '—'
  const amount = Number(value)
  return Number.isNaN(amount) ? String(value) : `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatLabel(value: string) {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function displayValue(value: unknown) {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}

function toInputValue(value: unknown, type: FieldType) {
  if (value === undefined || value === null) return type === 'checkbox' ? false : ''
  if (type === 'checkbox') return Boolean(value)
  if (type === 'datetime-local') {
    const date = new Date(String(value))
    if (Number.isNaN(date.getTime())) return String(value)
    const offset = date.getTimezoneOffset()
    return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16)
  }
  return String(value)
}

function fromInputValue(value: string | boolean, type: FieldType) {
  if (type === 'checkbox') return Boolean(value)
  if (type === 'number') return value === '' ? null : Number(value)
  if (type === 'datetime-local' && typeof value === 'string' && value) return new Date(value).toISOString()
  return value
}

function Button({ children, variant = 'primary', onClick, type = 'button', disabled = false, className = '' }: { children: ReactNode; variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean; className?: string }) {
  const styles = {
    primary: 'bg-slate-950 text-white shadow-sm hover:bg-slate-800',
    secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
    ghost: 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
  }
  return <button type={type} onClick={onClick} disabled={disabled} className={`inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}>{children}</button>
}

function StatusBadge({ value }: { value: unknown }) {
  const status = String(value ?? 'unknown').toLowerCase()
  const color = status.includes('approved') || status === 'active' || status === 'completed' || status === 'true'
    ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10'
    : status.includes('reject') || status === 'failed' || status === 'false'
      ? 'bg-rose-50 text-rose-700 ring-rose-600/10'
      : 'bg-amber-50 text-amber-700 ring-amber-600/10'
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${color}`}>{String(value ?? '—').replaceAll('_', ' ')}</span>
}

function LoginScreen({ onLogin }: { onLogin: (user: AdminUser) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginAdmin(email, password)
      const user = await getCurrentAdmin()
      if (!isPlatformAdmin(user)) throw new Error('Your account is authenticated but is not a platform administrator.')
      setStoredAdminUser(user)
      onLogin(user)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to sign in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return <main className="min-h-screen bg-[#f7f9fc] px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
      <div className="grid w-full overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative hidden min-h-[560px] overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl" />
          <div className="relative">
            <div className="mb-16 flex items-center gap-3 text-sm font-semibold tracking-[0.18em] text-white/70"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-950"><ShieldCheck size={21} /></span> WOLVCAPITAL</div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Operations console</p>
            <h1 className="max-w-md text-5xl font-semibold leading-[1.03] tracking-[-0.05em]">A calmer way to run the platform.</h1>
            <p className="mt-6 max-w-md text-base leading-7 text-slate-300">Review transactions, approve investments, and keep compliance workflows moving from one focused workspace.</p>
          </div>
          <div className="relative grid grid-cols-3 gap-3 text-xs text-slate-300"><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="mb-2 text-2xl font-semibold text-white">6</p>live resources</div><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="mb-2 text-2xl font-semibold text-white">JWT</p>secured access</div><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="mb-2 text-2xl font-semibold text-white">DRF</p>native API</div></div>
        </div>
        <div className="flex min-h-[560px] flex-col justify-center p-7 sm:p-12">
          <div className="mb-10 lg:hidden"><div className="mb-5 flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-slate-500"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-white"><ShieldCheck size={21} /></span> WOLVCAPITAL</div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">Operations console</p></div>
          <div className="mb-8"><p className="mb-3 text-sm font-semibold text-cyan-600">Staff access</p><h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">Sign in to admin</h2><p className="mt-3 text-sm leading-6 text-slate-500">Use your Django staff account to access platform operations.</p></div>
          <form onSubmit={submit} className="space-y-5">
            <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Email address</span><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" required className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10" placeholder="admin@company.com" /></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Password</span><input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" required className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10" placeholder="Enter your password" /></label>
            {error && <div className="flex gap-3 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm leading-5 text-rose-700"><AlertCircle className="mt-0.5 shrink-0" size={17} />{error}</div>}
            <Button type="submit" disabled={loading} className="h-12 w-full">{loading ? <><RefreshCw className="animate-spin" size={17} /> Signing in…</> : <>Continue to dashboard <ArrowRight size={17} /></>}</Button>
          </form>
          <p className="mt-8 text-xs leading-5 text-slate-400">Authentication is handled by the existing Django Simple JWT endpoint. Your access token stays in this browser session.</p>
        </div>
      </div>
    </div>
  </main>
}

function Sidebar({ active, onSelect, onLogout, user, onClose }: { active: ResourceKey; onSelect: (key: ResourceKey) => void; onLogout: () => void; user: AdminUser | null; onClose?: () => void }) {
  return <aside className="flex h-full w-[280px] shrink-0 flex-col bg-slate-950 text-white">
    <div className="flex items-center justify-between px-6 py-7"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-400 text-slate-950"><ShieldCheck size={21} /></span><div><p className="text-sm font-bold tracking-[0.18em]">WOLV</p><p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Admin console</p></div></div>{onClose && <button aria-label="Close navigation" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"><X size={18} /></button>}</div>
    <nav className="flex-1 px-3">
      <p className="px-3 pb-3 pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Workspace</p>
      <button onClick={() => { onSelect('overview'); onClose?.() }} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${active === 'overview' ? 'bg-white text-slate-950' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}><LayoutDashboard size={17} /> Overview</button>
      {resources.map((resource) => { const Icon = resource.icon; return <button key={resource.key} onClick={() => { onSelect(resource.key); onClose?.() }} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${active === resource.key ? 'bg-white text-slate-950' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}><Icon size={17} /> {resource.label}</button> })}
    </nav>
    <div className="border-t border-white/10 p-4"><div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-cyan-400/20 text-sm font-bold text-cyan-300">{String(user?.email ?? 'A').slice(0, 1).toUpperCase()}</span><div className="min-w-0"><p className="truncate text-xs font-semibold text-white">{user?.email ?? 'Administrator'}</p><p className="text-[11px] text-slate-500">Platform staff</p></div></div><button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400 hover:bg-rose-500/10 hover:text-rose-300"><LogOut size={17} /> Sign out</button></div>
  </aside>
}

function Overview({ onSelect }: { onSelect: (key: ResourceKey) => void }) {
  const cards = [
    { key: 'campaigns' as const, label: 'Campaigns', text: 'Manage public announcements and launch windows.', icon: Sparkles, accent: 'bg-violet-50 text-violet-700' },
    { key: 'plans' as const, label: 'Investment plans', text: 'Tune ROI, duration, and investment limits.', icon: WalletCards, accent: 'bg-cyan-50 text-cyan-700' },
    { key: 'transactions' as const, label: 'Transactions', text: 'Review money movement and approve transitions.', icon: ClipboardList, accent: 'bg-amber-50 text-amber-700' },
    { key: 'investments' as const, label: 'User investments', text: 'Process pending investment requests.', icon: LayoutDashboard, accent: 'bg-blue-50 text-blue-700' },
    { key: 'kyc' as const, label: 'KYC applications', text: 'Review applicant information and decisions.', icon: ShieldCheck, accent: 'bg-emerald-50 text-emerald-700' },
    { key: 'documents' as const, label: 'KYC documents', text: 'Approve identity and address documentation.', icon: FileCheck2, accent: 'bg-rose-50 text-rose-700' },
  ]
  return <div className="space-y-8"><div className="max-w-2xl"><p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600">Operations overview</p><h1 className="text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">Everything important, in one place.</h1><p className="mt-5 text-base leading-7 text-slate-500">This workspace is connected to the existing Django REST Framework admin endpoints. Choose a resource to review or update records with the same validation and permissions as the backend.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map((card) => { const Icon = card.icon; return <button key={card.key} onClick={() => onSelect(card.key)} className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_8px_28px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)]"><div className="mb-8 flex items-start justify-between"><span className={`grid h-11 w-11 place-items-center rounded-2xl ${card.accent}`}><Icon size={20} /></span><ArrowRight className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-800" size={19} /></div><h3 className="text-base font-semibold text-slate-950">{card.label}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{card.text}</p></button> })}</div><div className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-5 text-sm leading-6 text-cyan-950"><p className="font-semibold">Built for the API you already have.</p><p className="mt-1 text-cyan-900/70">Authentication uses email/password JWT login, requests send Bearer access tokens, and lists work with both unpaginated arrays and standard DRF result envelopes.</p></div></div>
}

function EmptyState({ message }: { message: string }) {
  return <div className="grid min-h-56 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center"><div><div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-white text-slate-300 shadow-sm"><Search size={19} /></div><p className="text-sm font-semibold text-slate-700">No records found</p><p className="mt-1 text-sm text-slate-400">{message}</p></div></div>
}

function ResourceList({ resource, onMode, onSelect, onDelete }: { resource: ResourceConfig; onMode: (mode: Mode) => void; onSelect: (record: ApiRecord) => void; onDelete: (record: ApiRecord) => void }) {
  const [records, setRecords] = useState<ApiRecord[]>([])
  const [count, setCount] = useState(0)
  const [next, setNext] = useState<string | null>(null)
  const [previous, setPrevious] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async (pageNumber = 1, searchValue = '', statusValue = '') => {
    setLoading(true)
    setError('')
    try {
      const response = await listAdminResource<ApiRecord>(resource.path, { page: pageNumber, search: searchValue || undefined, status: statusValue || undefined })
      setRecords(response.results)
      setCount(response.count)
      setNext(response.next)
      setPrevious(response.previous)
      setPage(pageNumber)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load records.')
    } finally {
      setLoading(false)
    }
  }, [resource.path])

  useEffect(() => { void load(1, '', '') }, [load])
  const visibleRecords = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    if (!normalized) return records
    return records.filter((record) => resource.searchFields.some((field) => String(record[field] ?? '').toLowerCase().includes(normalized)))
  }, [records, resource.searchFields, search])
  const pageCount = Math.max(1, Math.ceil(count / Math.max(records.length, 1)))
  const hasWorkflow = Boolean(resource.workflow)

  function submitSearch(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void load(1, search, status) }

  return <div className="space-y-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600">{resource.label}</p><h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">{resource.description}</h1></div>{!hasWorkflow && <Button onClick={() => onMode('create')}><Plus size={17} /> New {resource.singular}</Button>}</div><div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:flex-row"><form onSubmit={submitSearch} className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-slate-50 px-3"><Search size={17} className="shrink-0 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${resource.label.toLowerCase()}…`} className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" /></form><div className="relative"><select value={status} onChange={(event) => { setStatus(event.target.value); void load(1, search, event.target.value) }} className="h-10 appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 text-sm font-semibold text-slate-600 outline-none focus:border-cyan-500"><option value="">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="active">Active</option><option value="completed">Completed</option></select><ChevronDown className="pointer-events-none absolute right-3 top-3 text-slate-400" size={15} /></div><Button variant="secondary" onClick={() => void load(page, search, status)}><RefreshCw size={16} /> Refresh</Button></div>{error && <div className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700"><AlertCircle className="mt-0.5 shrink-0" size={17} /><div><p className="font-semibold">Could not load {resource.label.toLowerCase()}</p><p className="mt-1 text-rose-700/80">{error}</p></div></div>}{loading ? <div className="grid min-h-56 place-items-center rounded-2xl border border-slate-200 bg-white"><RefreshCw className="animate-spin text-cyan-600" size={22} /></div> : visibleRecords.length === 0 ? <EmptyState message="Try another search or create the first record." /> : <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_28px_rgba(15,23,42,0.04)]"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="border-b border-slate-100 bg-slate-50/80"><tr>{resource.columns.map((column) => <th key={column.key} className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">{column.label}</th>)}<th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{visibleRecords.map((record, index) => <tr key={String(record.id ?? index)} className="group transition hover:bg-slate-50/70">{resource.columns.map((column) => <td key={column.key} className="max-w-[240px] truncate px-5 py-4 text-sm text-slate-600">{column.kind === 'status' ? <StatusBadge value={record[column.key]} /> : column.kind === 'currency' ? <span className="font-semibold text-slate-900">{formatCurrency(record[column.key])}</span> : column.kind === 'date' ? formatDate(record[column.key]) : <span className={column.key === 'title' || column.key === 'name' || column.key === 'user_email' ? 'font-semibold text-slate-900' : ''}>{displayValue(record[column.key])}</span>}</td>)}<td className="px-5 py-4"><div className="flex justify-end gap-1 opacity-70 transition group-hover:opacity-100"><button onClick={() => onSelect(record)} aria-label={`View ${resource.singular}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900"><Eye size={16} /></button>{!hasWorkflow && <button onClick={() => { onSelect(record); onMode('edit') }} aria-label={`Edit ${resource.singular}`} className="rounded-lg p-2 text-slate-400 hover:bg-cyan-50 hover:text-cyan-700"><Pencil size={16} /></button>}{!hasWorkflow && <button onClick={() => onDelete(record)} aria-label={`Delete ${resource.singular}`} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-700"><Trash2 size={16} /></button>}</div></td></tr>)}</tbody></table></div><div className="flex flex-col justify-between gap-3 border-t border-slate-100 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center"><p>Showing <span className="font-semibold text-slate-800">{visibleRecords.length}</span> of <span className="font-semibold text-slate-800">{count}</span> records</p><div className="flex items-center gap-2"><Button variant="secondary" disabled={!previous} onClick={() => void load(Math.max(1, page - 1), search, status)}><ArrowLeft size={15} /> Previous</Button><span className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">Page {page}{pageCount > 1 ? ` of ${pageCount}` : ''}</span><Button variant="secondary" disabled={!next} onClick={() => void load(page + 1, search, status)}>Next <ArrowRight size={15} /></Button></div></div></div>}</div>
}

function RecordForm({ resource, record, mode, onCancel, onSaved }: { resource: ResourceConfig; record: ApiRecord | null; mode: 'create' | 'edit'; onCancel: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<ApiRecord>(() => Object.fromEntries(resource.fields.map((field) => [field.key, toInputValue(record?.[field.key], field.type)])))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function setValue(key: string, value: string | boolean) { setForm((current) => ({ ...current, [key]: value })) }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError('')
    const payload = Object.fromEntries(resource.fields.map((field) => [field.key, fromInputValue(form[field.key] as string | boolean, field.type)]))
    try {
      if (mode === 'create') await createAdminResource(resource.path, payload)
      else await updateAdminResource(resource.path, record?.id as string | number, payload)
      onSaved()
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to save this record.') } finally { setSaving(false) }
  }
  return <div className="mx-auto max-w-3xl space-y-6"><div className="flex items-start justify-between gap-4"><div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600">{mode === 'create' ? 'Create' : 'Edit'} {resource.singular}</p><h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">{mode === 'create' ? 'Add a new record' : 'Update record'}</h2><p className="mt-2 text-sm text-slate-500">Changes are validated by the Django serializer before they are saved.</p></div><Button variant="secondary" onClick={onCancel}><ArrowLeft size={16} /> Back</Button></div><form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:p-7"><div className="grid gap-5 sm:grid-cols-2">{resource.fields.map((field) => <label key={field.key} className={`${field.type === 'textarea' ? 'sm:col-span-2' : ''} block`}><span className="mb-2 block text-sm font-semibold text-slate-700">{field.label}{field.required && <span className="ml-1 text-cyan-600">*</span>}</span>{field.type === 'textarea' ? <textarea required={field.required} value={String(form[field.key] ?? '')} onChange={(event) => setValue(field.key, event.target.value)} rows={5} placeholder={field.placeholder} className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10" /> : field.type === 'checkbox' ? <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4"><input type="checkbox" checked={Boolean(form[field.key])} onChange={(event) => setValue(field.key, event.target.checked)} className="h-4 w-4 accent-cyan-600" /><span className="text-sm text-slate-600">Enable this setting</span></div> : <input required={field.required} type={field.type} value={String(form[field.key] ?? '')} onChange={(event) => setValue(field.key, event.target.value)} placeholder={field.placeholder} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10" />}{field.help && <p className="mt-1.5 text-xs leading-5 text-slate-400">{field.help}</p>}</label>)}</div>{error && <div className="mt-5 flex gap-3 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm leading-5 text-rose-700"><AlertCircle className="mt-0.5 shrink-0" size={17} />{error}</div>}<div className="mt-7 flex flex-col-reverse justify-end gap-3 sm:flex-row"><Button variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? <><RefreshCw className="animate-spin" size={16} /> Saving…</> : <><Check size={16} /> Save changes</>}</Button></div></form></div>
}

function RecordShow({ resource, record, onBack, onEdit, onUpdated }: { resource: ResourceConfig; record: ApiRecord; onBack: () => void; onEdit: () => void; onUpdated: () => void }) {
  const [detail, setDetail] = useState<ApiRecord>(record)
  const [loading, setLoading] = useState(false)
  const [reviewing, setReviewing] = useState(false)
  const [action, setAction] = useState('')
  const [notes, setNotes] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { setDetail(record); setAction(''); setNotes(''); setReason(''); setError('') }, [record])
  useEffect(() => { let active = true; setLoading(true); void getAdminResource(resource.path, record.id as string | number).then((fresh) => { if (active) setDetail(fresh) }).catch(() => undefined).finally(() => { if (active) setLoading(false) }); return () => { active = false } }, [resource.path, record.id])

  async function review() {
    if (!action) return
    setReviewing(true); setError('')
    const payload: ApiRecord = resource.workflow === 'document' ? { approval_action: action, approval_notes: notes } : { status: action, notes, ...(resource.workflow === 'kyc' && action === 'rejected' ? { reason } : {}) }
    try { const updated = await updateAdminResource(resource.path, record.id as string | number, payload); setDetail(updated); onUpdated() } catch (caught) { setError(caught instanceof Error ? caught.message : 'Review update failed.') } finally { setReviewing(false) }
  }

  const reviewOptions = resource.workflow === 'document' ? ['approve', 'reject'] : ['approved', 'rejected']
  return <div className="space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><button onClick={onBack} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-900"><ArrowLeft size={16} /> Back to {resource.label.toLowerCase()}</button><p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600">{resource.singular} details</p><h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">{String(detail.title ?? detail.name ?? detail.user_email ?? `Record ${detail.id}`)}</h2></div><div className="flex gap-2">{resource.workflow ? <Button onClick={() => setAction(resource.workflow === 'document' ? 'approve' : 'approved')}><FileCheck2 size={16} /> Review</Button> : <Button variant="secondary" onClick={onEdit}><Pencil size={16} /> Edit</Button>}</div></div>{loading && <div className="flex items-center gap-2 text-sm text-slate-400"><RefreshCw className="animate-spin" size={15} /> Loading latest record…</div>}<div className="grid gap-4 sm:grid-cols-2">{Object.entries(detail).map(([key, value]) => <div key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_28px_rgba(15,23,42,0.03)]"><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">{formatLabel(key)}</p>{key === 'status' || key === 'is_published' || key === 'is_live' ? <StatusBadge value={value} /> : key.endsWith('_at') || key.endsWith('_date') ? <p className="text-sm font-semibold text-slate-800">{formatDate(value)}</p> : <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-6 text-slate-700">{displayValue(value)}</pre>}</div>)}</div>{resource.workflow && action && <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:p-7"><div className="mb-5"><p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600">Controlled workflow</p><h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">Review this {resource.singular}</h3><p className="mt-2 text-sm text-slate-500">This action is sent using the exact transition payload expected by the Django viewset.</p></div><div className="grid gap-5 sm:grid-cols-2"><label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Decision</span><select value={action} onChange={(event) => setAction(event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-cyan-500 focus:bg-white">{reviewOptions.map((option) => <option key={option} value={option}>{formatLabel(option)}</option>)}</select></label><label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">{resource.workflow === 'document' ? 'Approval notes' : 'Review notes'}</span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-500 focus:bg-white" /></label>{resource.workflow === 'kyc' && action === 'rejected' && <label className="block sm:col-span-2"><span className="mb-2 block text-sm font-semibold text-slate-700">Rejection reason <span className="text-cyan-600">*</span></span><textarea required value={reason} onChange={(event) => setReason(event.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-500 focus:bg-white" /></label>}</div>{error && <div className="mt-5 flex gap-3 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700"><AlertCircle className="mt-0.5 shrink-0" size={17} />{error}</div>}<div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row"><Button variant="secondary" onClick={() => setAction('')}>Cancel</Button><Button variant={action.includes('reject') ? 'danger' : 'primary'} disabled={reviewing || (action.includes('reject') && resource.workflow === 'document' && !notes) || (action.includes('reject') && resource.workflow === 'kyc' && !reason)} onClick={() => void review()}>{reviewing ? <><RefreshCw className="animate-spin" size={16} /> Updating…</> : <><Check size={16} /> Confirm {formatLabel(action)}</>}</Button></div></div>}</div>
}

export default function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [checking, setChecking] = useState(true)
  const [active, setActive] = useState<ResourceKey>('overview')
  const [mode, setMode] = useState<Mode>('list')
  const [selected, setSelected] = useState<ApiRecord | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => { let activeRequest = true; const stored = getStoredAdminUser(); if (stored && isPlatformAdmin(stored)) setUser(stored); void getCurrentAdmin().then((current) => { if (activeRequest && isPlatformAdmin(current)) { setStoredAdminUser(current); setUser(current) } }).catch(() => { if (activeRequest) setUser(null) }).finally(() => { if (activeRequest) setChecking(false) }); return () => { activeRequest = false } }, [])
  useEffect(() => { if (!toast) return; const timeout = window.setTimeout(() => setToast(''), 2800); return () => window.clearTimeout(timeout) }, [toast])

  function chooseResource(key: ResourceKey) { setActive(key); setMode('list'); setSelected(null) }
  function logout() { clearAdminSession(); setUser(null) }
  function onSaved() { setToast('Saved successfully.'); setMode('list'); setSelected(null) }
  async function onDelete(record: ApiRecord) { if (!window.confirm(`Delete ${String(record.title ?? record.name ?? record.id)}? This cannot be undone.`)) return; const resource = resourceByKey[active as Exclude<ResourceKey, 'overview'>]; try { await deleteAdminResource(resource.path, record.id as string | number); setToast('Deleted successfully.'); setMode('list') } catch (caught) { setToast(caught instanceof Error ? caught.message : 'Delete failed.') } }

  if (checking) return <main className="grid min-h-screen place-items-center bg-[#f7f9fc]"><RefreshCw className="animate-spin text-cyan-600" size={24} /></main>
  if (!user) return <LoginScreen onLogin={setUser} />

  const currentResource = active === 'overview' ? null : resourceByKey[active]
  return <div className="min-h-screen bg-[#f7f9fc] text-slate-950"><div className="fixed inset-y-0 left-0 z-40 hidden lg:block"><Sidebar active={active} onSelect={chooseResource} onLogout={logout} user={user} /></div>{mobileOpen && <div className="fixed inset-0 z-50 flex lg:hidden"><button aria-label="Close navigation overlay" onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-slate-950/50" /><div className="relative"><Sidebar active={active} onSelect={chooseResource} onLogout={logout} user={user} onClose={() => setMobileOpen(false)} /></div></div>}<div className="lg:pl-[280px]"><header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-[#f7f9fc]/90 px-4 backdrop-blur-xl sm:px-7 lg:px-10"><div className="flex items-center gap-3"><button onClick={() => setMobileOpen(true)} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 lg:hidden"><Menu size={18} /></button><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">WolvCapital / Admin</p><p className="mt-1 text-sm font-semibold text-slate-900">{active === 'overview' ? 'Workspace overview' : resourceByKey[active].label}</p></div></div><div className="flex items-center gap-3"><span className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 sm:flex"><span className="h-2 w-2 rounded-full bg-emerald-500" /> API connected</span><span className="grid h-9 w-9 place-items-center rounded-full bg-slate-950 text-xs font-bold text-white">{String(user.email ?? 'A').slice(0, 1).toUpperCase()}</span></div></header><main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-7 sm:py-10 lg:px-10">{active === 'overview' ? <Overview onSelect={chooseResource} /> : mode === 'list' ? <ResourceList resource={currentResource!} onMode={setMode} onSelect={(record) => { setSelected(record); setMode('show') }} onDelete={onDelete} /> : mode === 'show' && selected ? <RecordShow resource={currentResource!} record={selected} onBack={() => setMode('list')} onEdit={() => setMode('edit')} onUpdated={() => setToast('Review decision saved.')} /> : <RecordForm resource={currentResource!} record={mode === 'edit' ? selected : null} mode={mode === 'edit' ? 'edit' : 'create'} onCancel={() => setMode('list')} onSaved={onSaved} />}</main></div>{toast && <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-2xl">{toast}</div>}</div>
}
