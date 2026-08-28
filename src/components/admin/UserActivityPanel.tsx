'use client'

import { Clock3, Eye, Globe2, RefreshCw, Search, UserRound } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { adminRequestWithMeta, listAdminResource } from '@/lib/admin-api'

type ActivityUser = {
  id: number
  email: string
  username?: string
  first_name?: string
  last_name?: string
  is_staff?: boolean
  is_superuser?: boolean
  last_seen_at?: string | null
  current_page?: string | null
  current_page_title?: string
  page_visit_count?: number
}

type PageVisit = {
  id: number
  session_id: string
  page_path: string
  page_title: string
  visited_at: string
}

function relativeTime(value?: string | null) {
  if (!value) return 'Never'
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000))
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function isOnline(value?: string | null) {
  return Boolean(value && Date.now() - new Date(value).getTime() < 5 * 60 * 1000)
}

export default function UserActivityPanel() {
  const [users, setUsers] = useState<ActivityUser[]>([])
  const [count, setCount] = useState(0)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<ActivityUser | null>(null)
  const [visits, setVisits] = useState<PageVisit[]>([])
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [error, setError] = useState('')

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await listAdminResource<ActivityUser>('/api/admin/activity/users/', { search, limit: 100, offset: 0 })
      setUsers(result.results)
      setCount(result.count)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not load activity.')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { void loadUsers() }, [loadUsers])

  async function showHistory(user: ActivityUser) {
    setSelected(user)
    setDetailLoading(true)
    try {
      const result = await adminRequestWithMeta(`/api/admin/activity/users/${user.id}/pages/?limit=100`)
      if (!result.ok) throw new Error(`History request returned ${result.status}.`)
      const payload = result.payload as { results?: PageVisit[] }
      setVisits(payload.results ?? [])
    } catch (caught) {
      setVisits([])
      setError(caught instanceof Error ? caught.message : 'Could not load page history.')
    } finally {
      setDetailLoading(false)
    }
  }

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600">People & presence</p><h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">See who is active.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Monitor authenticated user presence and understand which product pages are being visited. Activity is refreshed from Django and excludes query strings.</p></div><button onClick={() => void loadUsers()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-cyan-200 hover:text-cyan-700"><RefreshCw size={16} /> Refresh</button></div>
    <div className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Tracked users</p><p className="mt-2 text-3xl font-semibold text-slate-950">{count}</p></div><div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">Active now</p><p className="mt-2 text-3xl font-semibold text-emerald-950">{users.filter((user) => isOnline(user.last_seen_at)).length}</p></div><div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-700">Page events shown</p><p className="mt-2 text-3xl font-semibold text-cyan-950">{users.reduce((sum, user) => sum + (user.page_visit_count ?? 0), 0)}</p></div></div>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.75fr)]">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:p-6"><div className="mb-5 flex items-center gap-2 rounded-xl bg-slate-50 px-3"><Search size={16} className="text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Search email or name…" /></div>{error && <p className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}{loading ? <div className="grid place-items-center py-16"><RefreshCw className="animate-spin text-cyan-600" size={22} /></div> : users.length === 0 ? <div className="py-16 text-center text-sm text-slate-400">No tracked users found yet.</div> : <div className="space-y-3">{users.map((user) => { const online = isOnline(user.last_seen_at); return <button key={user.id} onClick={() => void showHistory(user)} className={`w-full rounded-2xl border p-4 text-left transition hover:border-cyan-200 hover:shadow-sm ${selected?.id === user.id ? 'border-cyan-300 bg-cyan-50/50' : 'border-slate-200 bg-white'}`}><div className="flex items-start gap-3"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${online ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}><UserRound size={18} /></span><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2"><span className="truncate text-sm font-semibold text-slate-900">{user.first_name || user.last_name ? `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() : user.email}</span>{user.is_staff && <span className="rounded-md bg-violet-50 px-1.5 py-0.5 text-[10px] font-bold text-violet-700">STAFF</span>}<span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase ${online ? 'text-emerald-600' : 'text-slate-400'}`}><span className={`h-1.5 w-1.5 rounded-full ${online ? 'bg-emerald-500' : 'bg-slate-300'}`} />{online ? 'Online' : 'Away'}</span></span><span className="mt-1 block truncate text-xs text-slate-500">{user.email}</span></span><span className="shrink-0 text-right"><span className="block text-xs font-semibold text-slate-700">{relativeTime(user.last_seen_at)}</span><span className="mt-1 block text-[11px] text-slate-400">{user.page_visit_count ?? 0} visits</span></span></div><div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600"><Globe2 size={14} className="shrink-0 text-cyan-600" /><span className="truncate">{user.current_page || 'No page recorded'}</span></div></button> })}</div>}</section>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:p-6"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Page history</p><h2 className="mt-1 truncate text-xl font-semibold text-slate-950">{selected?.email ?? 'Select a user'}</h2></div>{selected && <Eye className="text-cyan-600" size={20} />}</div>{!selected ? <div className="grid min-h-[300px] place-items-center text-center text-sm leading-6 text-slate-400">Select a user to inspect their recent pages.</div> : detailLoading ? <div className="grid min-h-[300px] place-items-center"><RefreshCw className="animate-spin text-cyan-600" size={22} /></div> : visits.length === 0 ? <div className="grid min-h-[300px] place-items-center text-center text-sm leading-6 text-slate-400">No page visits recorded for this user yet.</div> : <div className="mt-5 space-y-3">{visits.map((visit) => <div key={visit.id} className="flex gap-3 rounded-xl border border-slate-100 p-3"><span className="mt-0.5 rounded-lg bg-cyan-50 p-2 text-cyan-700"><Globe2 size={15} /></span><div className="min-w-0 flex-1"><p className="truncate font-mono text-xs font-semibold text-slate-700">{visit.page_path}</p><p className="mt-1 truncate text-xs text-slate-400">{visit.page_title || 'Untitled page'}</p><p className="mt-2 flex items-center gap-1 text-[11px] text-slate-400"><Clock3 size={12} />{new Date(visit.visited_at).toLocaleString()}</p></div></div>)}</div>}</section>
    </div>
  </div>
}
