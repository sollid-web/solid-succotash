"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'

type Campaign = {
  id: number
  title: string
  slug: string
  summary: string
  body: string
  cta_label: string
  cta_url: string
  publish_at: string
  expires_at: string | null
  is_published: boolean
  is_live: boolean
  created_at: string
  updated_at: string
}

function getLocalDatetimeValue(date = new Date()) {
  const tzOffsetMs = date.getTimezoneOffset() * 60000
  const local = new Date(date.getTime() - tzOffsetMs)
  return local.toISOString().slice(0, 16)
}

const emptyDraft = {
  title: '',
  slug: '',
  summary: '',
  body: '',
  cta_label: '',
  cta_url: '',
  publish_at: getLocalDatetimeValue(),
  expires_at: '',
  is_published: true,
}

function toInputValue(value: string | null | undefined) {
  if (!value) return ''
  return value.slice(0, 16)
}

export default function AdminCampaignsPage() {
  const [items, setItems] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [draft, setDraft] = useState(emptyDraft)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<'publish_desc' | 'publish_asc' | 'title_asc'>('publish_desc')
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'published' | 'hidden'>('all')

  const loadItems = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await apiFetch('/api/admin/campaigns/')
      const data = await response.json()
      if (!response.ok) throw new Error(data?.detail || data?.error || 'Failed to load campaigns')
      setItems(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setError(e?.message || 'Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  const liveCount = useMemo(() => items.filter(item => item.is_live).length, [items])

  const visibleItems = useMemo(() => {
    const filtered = items.filter(item => {
      if (statusFilter === 'live') return item.is_live
      if (statusFilter === 'published') return item.is_published
      if (statusFilter === 'hidden') return !item.is_published
      return true
    })

    return filtered.sort((a, b) => {
      if (sortBy === 'title_asc') return a.title.localeCompare(b.title)
      if (sortBy === 'publish_asc') return new Date(a.publish_at).getTime() - new Date(b.publish_at).getTime()
      return new Date(b.publish_at).getTime() - new Date(a.publish_at).getTime()
    })
  }, [items, sortBy, statusFilter])

  const startEdit = (item: Campaign) => {
    setEditingId(item.id)
    setDraft({
      title: item.title,
      slug: item.slug,
      summary: item.summary || '',
      body: item.body || '',
      cta_label: item.cta_label || '',
      cta_url: item.cta_url || '',
      publish_at: toInputValue(item.publish_at),
      expires_at: toInputValue(item.expires_at),
      is_published: item.is_published,
    })
  }

  const resetDraft = () => {
    setEditingId(null)
    setDraft(emptyDraft)
  }

  const setPublishNow = () => {
    setDraft(prev => ({ ...prev, publish_at: getLocalDatetimeValue() }))
  }

  const submit = async () => {
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...draft,
        publish_at: draft.publish_at ? new Date(draft.publish_at).toISOString() : new Date().toISOString(),
        expires_at: draft.expires_at ? new Date(draft.expires_at).toISOString() : null,
      }
      const response = await apiFetch(editingId ? `/api/admin/campaigns/${editingId}/` : '/api/admin/campaigns/', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.detail || data?.error || 'Save failed')
      await loadItems()
      resetDraft()
    } catch (e: any) {
      setError(e?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: number) => {
    setSaving(true)
    setError('')
    try {
      const response = await apiFetch(`/api/admin/campaigns/${id}/`, { method: 'DELETE' })
      if (!response.ok && response.status !== 204) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data?.detail || data?.error || 'Delete failed')
      }
      await loadItems()
      if (editingId === id) resetDraft()
    } catch (e: any) {
      setError(e?.message || 'Delete failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Admin</p>
            <h1 className="text-3xl font-black">Campaign announcements</h1>
            <p className="mt-2 text-sm text-white/60">Manage public campaign cards for staking, token updates, and launches.</p>
          </div>
          <Link href="/campaigns" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:text-white">
            View public page
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-3xl font-black">{items.length}</div>
            <div className="text-sm text-white/60">Total campaigns</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-3xl font-black text-emerald-300">{liveCount}</div>
            <div className="text-sm text-white/60">Live now</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-3xl font-black text-cyan-300">{items.filter(item => item.is_published).length}</div>
            <div className="text-sm text-white/60">Published</div>
          </div>
        </div>

        {error && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">{error}</div>}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <select
                className="rounded-full border border-white/15 bg-slate-900 px-3 py-2 text-sm"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as 'all' | 'live' | 'published' | 'hidden')}
              >
                <option value="all">All</option>
                <option value="live">Live</option>
                <option value="published">Published</option>
                <option value="hidden">Hidden</option>
              </select>
              <select
                className="rounded-full border border-white/15 bg-slate-900 px-3 py-2 text-sm"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'publish_desc' | 'publish_asc' | 'title_asc')}
              >
                <option value="publish_desc">Newest first</option>
                <option value="publish_asc">Oldest first</option>
                <option value="title_asc">Title A-Z</option>
              </select>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/60">Loading campaigns...</div>
            ) : visibleItems.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/60">No campaigns yet.</div>
            ) : (
              visibleItems.map(item => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold">{item.title}</h2>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.25em] ${item.is_live ? 'bg-emerald-400/10 text-emerald-300' : 'bg-white/10 text-white/50'}`}>
                          {item.is_live ? 'Live' : 'Hidden'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-white/55">{item.slug}</p>
                      <p className="mt-3 text-sm text-white/70">{item.summary || item.body}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(item)} className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/80 hover:text-white">Edit</button>
                      <button onClick={() => remove(item.id)} className="rounded-full border border-red-500/30 px-3 py-2 text-sm text-red-200 hover:bg-red-500/10" disabled={saving}>Delete</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">{editingId ? 'Edit campaign' : 'Create campaign'}</h2>
              {editingId ? <button onClick={resetDraft} className="text-sm text-white/60 hover:text-white">Cancel</button> : null}
            </div>

            <div className="mt-5 space-y-4">
              <input className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm" placeholder="Title" value={draft.title} onChange={e => setDraft(prev => ({ ...prev, title: e.target.value }))} />
              <input className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm" placeholder="Slug" value={draft.slug} onChange={e => setDraft(prev => ({ ...prev, slug: e.target.value }))} />
              <input className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm" placeholder="Summary" value={draft.summary} onChange={e => setDraft(prev => ({ ...prev, summary: e.target.value }))} />
              <textarea className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm" placeholder="Body" rows={5} value={draft.body} onChange={e => setDraft(prev => ({ ...prev, body: e.target.value }))} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm" placeholder="CTA label" value={draft.cta_label} onChange={e => setDraft(prev => ({ ...prev, cta_label: e.target.value }))} />
                <input className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm" placeholder="CTA URL" value={draft.cta_url} onChange={e => setDraft(prev => ({ ...prev, cta_url: e.target.value }))} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input type="datetime-local" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm" value={draft.publish_at} onChange={e => setDraft(prev => ({ ...prev, publish_at: e.target.value }))} />
                <input type="datetime-local" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm" value={draft.expires_at} onChange={e => setDraft(prev => ({ ...prev, expires_at: e.target.value }))} />
              </div>
              <button onClick={setPublishNow} className="w-full rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 hover:text-white" type="button">
                Set publish time to now
              </button>
              <label className="flex items-center gap-3 text-sm text-white/75">
                <input type="checkbox" checked={draft.is_published} onChange={e => setDraft(prev => ({ ...prev, is_published: e.target.checked }))} />
                Published
              </label>
              <button onClick={submit} disabled={saving} className="w-full rounded-full bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300 disabled:opacity-60">
                {saving ? 'Saving...' : editingId ? 'Update campaign' : 'Create campaign'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}