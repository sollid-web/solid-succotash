'use client'

import { CheckCircle2, ChevronLeft, ChevronRight, Edit3, Eye, LockKeyhole, Plus, RefreshCw, Search, ShieldAlert, Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ApiRecord,
  createAdminResource,
  deleteAdminResource,
  getAdminResource,
  listAdminResource,
  updateAdminResource,
} from '@/lib/admin-api'

type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'datetime-local' | 'url' | 'checkbox' | 'password'
type Field = { key: string; label: string; type: FieldType; required?: boolean; help?: string }
type Action = { label: string; path: string; confirm?: string; tone?: 'normal' | 'danger' }
type ControlResource = {
  key: string
  label: string
  path: string
  description: string
  readOnly?: boolean
  searchFields?: string[]
  columns: { key: string; label: string }[]
  fields: Field[]
  actions?: Action[]
}

type Mode = 'list' | 'create' | 'edit' | 'show'

const resources: ControlResource[] = [
  { key: 'users', label: 'User accounts', path: '/api/admin/users/', description: 'Manage account identity, activation, and staff access.', searchFields: ['email', 'username', 'first_name', 'last_name'], columns: [{ key: 'email', label: 'Email' }, { key: 'first_name', label: 'First name' }, { key: 'is_active', label: 'Active' }, { key: 'is_staff', label: 'Staff' }, { key: 'date_joined', label: 'Joined' }], fields: [{ key: 'username', label: 'Username', type: 'text' }, { key: 'email', label: 'Email', type: 'text', required: true }, { key: 'first_name', label: 'First name', type: 'text' }, { key: 'last_name', label: 'Last name', type: 'text' }, { key: 'is_active', label: 'Active', type: 'checkbox' }, { key: 'is_staff', label: 'Staff access', type: 'checkbox' }, { key: 'is_superuser', label: 'Superuser access', type: 'checkbox' }, { key: 'password', label: 'Set password', type: 'password', help: 'Optional. Use at least eight characters.' }] },
  { key: 'profiles', label: 'User profiles', path: '/api/admin/profiles/', description: 'Control roles, verification, communication preferences, Telegram, and card flags.', searchFields: ['user__email', 'full_name', 'telegram_username'], columns: [{ key: 'user_email', label: 'User' }, { key: 'role', label: 'Role' }, { key: 'full_name', label: 'Name' }, { key: 'email_verified', label: 'Verified' }, { key: 'is_card_frozen', label: 'Card frozen' }], fields: [{ key: 'user', label: 'User ID', type: 'number', required: true }, { key: 'role', label: 'Role', type: 'text' }, { key: 'full_name', label: 'Full name', type: 'text' }, { key: 'email_notifications_enabled', label: 'Email notifications', type: 'checkbox' }, { key: 'email_marketing', label: 'Marketing email', type: 'checkbox' }, { key: 'email_verified', label: 'Email verified', type: 'checkbox' }, { key: 'telegram_notifications_enabled', label: 'Telegram notifications', type: 'checkbox' }, { key: 'is_card_frozen', label: 'Freeze card', type: 'checkbox' }] },
  { key: 'wallets', label: 'User wallets', path: '/api/admin/wallets/', description: 'Review balances and apply controlled wallet adjustments.', searchFields: ['user__email'], columns: [{ key: 'user_email', label: 'User' }, { key: 'balance', label: 'Balance' }, { key: 'updated_at', label: 'Updated' }], fields: [{ key: 'user', label: 'User ID', type: 'number', required: true }, { key: 'balance', label: 'Balance', type: 'number', required: true }] },
  { key: 'notifications', label: 'User notifications', path: '/api/admin/notifications/', description: 'Create and manage user-facing notices and delivery state.', searchFields: ['user__email', 'title', 'message'], columns: [{ key: 'user_email', label: 'User' }, { key: 'title', label: 'Title' }, { key: 'priority', label: 'Priority' }, { key: 'is_read', label: 'Read' }, { key: 'created_at', label: 'Created' }], fields: [{ key: 'user', label: 'User ID', type: 'number', required: true }, { key: 'notification_type', label: 'Type', type: 'text', required: true }, { key: 'title', label: 'Title', type: 'text', required: true }, { key: 'message', label: 'Message', type: 'textarea', required: true }, { key: 'action_url', label: 'Action URL', type: 'url' }, { key: 'priority', label: 'Priority', type: 'text' }, { key: 'is_read', label: 'Read', type: 'checkbox' }], actions: [{ label: 'Mark read', path: 'mark-read/' }] },
  { key: 'agreements', label: 'Legal agreements', path: '/api/admin/agreements/', description: 'Publish, version, and retire user-facing legal agreements.', searchFields: ['title', 'slug', 'version'], columns: [{ key: 'title', label: 'Title' }, { key: 'version', label: 'Version' }, { key: 'is_active', label: 'Active' }, { key: 'effective_date', label: 'Effective' }], fields: [{ key: 'title', label: 'Title', type: 'text', required: true }, { key: 'slug', label: 'Slug', type: 'text', required: true }, { key: 'version', label: 'Version', type: 'text', required: true }, { key: 'body', label: 'Agreement body', type: 'textarea', required: true }, { key: 'effective_date', label: 'Effective date', type: 'date', required: true }, { key: 'is_active', label: 'Active', type: 'checkbox' }] },
  { key: 'support', label: 'Support requests', path: '/api/admin/support/', description: 'Read, assign, annotate, and resolve customer support cases.', searchFields: ['contact_email', 'full_name', 'topic', 'message'], columns: [{ key: 'contact_email', label: 'Contact' }, { key: 'topic', label: 'Topic' }, { key: 'status', label: 'Status' }, { key: 'handled_by_email', label: 'Handled by' }, { key: 'created_at', label: 'Created' }], fields: [{ key: 'status', label: 'Status', type: 'text' }, { key: 'admin_notes', label: 'Admin notes', type: 'textarea' }, { key: 'handled_by', label: 'Handled by user ID', type: 'number' }], actions: [{ label: 'Resolve', path: 'resolve/', confirm: 'Resolve this support request?' }] },
  { key: 'inbox', label: 'Email inbox', path: '/api/admin/inbox/', description: 'Organize inbound email, assign ownership, star messages, and mark replies.', searchFields: ['subject', 'from_email', 'from_name', 'body_text'], columns: [{ key: 'subject', label: 'Subject' }, { key: 'from_email', label: 'From' }, { key: 'status', label: 'Status' }, { key: 'priority', label: 'Priority' }, { key: 'received_at', label: 'Received' }], fields: [{ key: 'status', label: 'Status', type: 'text' }, { key: 'priority', label: 'Priority', type: 'text' }, { key: 'is_starred', label: 'Starred', type: 'checkbox' }, { key: 'labels', label: 'Labels', type: 'text' }, { key: 'folder', label: 'Folder', type: 'text' }, { key: 'assigned_to', label: 'Assigned user ID', type: 'number' }], actions: [{ label: 'Mark replied', path: 'mark-replied/' }, { label: 'Toggle star', path: 'toggle-star/' }] },
  { key: 'email-templates', label: 'Email templates', path: '/api/admin/email-templates/', description: 'Maintain reusable support and lifecycle email templates.', searchFields: ['name', 'subject', 'category'], columns: [{ key: 'name', label: 'Name' }, { key: 'subject', label: 'Subject' }, { key: 'category', label: 'Category' }, { key: 'is_active', label: 'Active' }], fields: [{ key: 'name', label: 'Name', type: 'text', required: true }, { key: 'subject', label: 'Subject', type: 'text', required: true }, { key: 'body', label: 'Body', type: 'textarea', required: true }, { key: 'category', label: 'Category', type: 'text' }, { key: 'is_active', label: 'Active', type: 'checkbox' }] },
  { key: 'certificates', label: 'Platform certificates', path: '/api/admin/certificates/', description: 'Manage the public certificate of operation and verification links.', searchFields: ['title', 'certificate_id', 'jurisdiction', 'issuing_authority'], columns: [{ key: 'title', label: 'Title' }, { key: 'certificate_id', label: 'Certificate ID' }, { key: 'jurisdiction', label: 'Jurisdiction' }, { key: 'is_active', label: 'Active' }], fields: [{ key: 'title', label: 'Title', type: 'text', required: true }, { key: 'certificate_id', label: 'Certificate ID', type: 'text', required: true }, { key: 'issue_date', label: 'Issue date', type: 'date', required: true }, { key: 'jurisdiction', label: 'Jurisdiction', type: 'text', required: true }, { key: 'issuing_authority', label: 'Issuing authority', type: 'text', required: true }, { key: 'verification_url', label: 'Verification URL', type: 'url' }, { key: 'is_active', label: 'Active', type: 'checkbox' }] },
  { key: 'drip-campaigns', label: 'Drip campaigns', path: '/api/admin/drip-campaigns/', description: 'Control automated lifecycle campaign enrollment and progress.', searchFields: ['user__email'], columns: [{ key: 'user_email', label: 'User' }, { key: 'current_day', label: 'Day' }, { key: 'active', label: 'Active' }, { key: 'completed', label: 'Completed' }, { key: 'enrolled_at', label: 'Enrolled' }], fields: [{ key: 'user', label: 'User ID', type: 'number', required: true }, { key: 'current_day', label: 'Current day', type: 'number' }, { key: 'active', label: 'Active', type: 'checkbox' }, { key: 'completed', label: 'Completed', type: 'checkbox' }] },
  { key: 'crypto-wallets', label: 'Crypto wallets', path: '/api/admin/crypto-wallets/', description: 'Manage deposit addresses and network availability.', searchFields: ['currency', 'wallet_address', 'network'], columns: [{ key: 'currency', label: 'Currency' }, { key: 'network', label: 'Network' }, { key: 'wallet_address', label: 'Address' }, { key: 'is_active', label: 'Active' }], fields: [{ key: 'currency', label: 'Currency', type: 'text', required: true }, { key: 'wallet_address', label: 'Wallet address', type: 'text', required: true }, { key: 'network', label: 'Network', type: 'text' }, { key: 'is_active', label: 'Active', type: 'checkbox' }] },
  { key: 'cards', label: 'Virtual cards', path: '/api/admin/cards/', description: 'Review card requests and control activation, suspension, and generated details.', searchFields: ['user__email', 'cardholder_name', 'card_type'], columns: [{ key: 'user_email', label: 'User' }, { key: 'masked_number', label: 'Card' }, { key: 'status', label: 'Status' }, { key: 'balance', label: 'Balance' }, { key: 'is_active', label: 'Active' }], fields: [{ key: 'user', label: 'User ID', type: 'number', required: true }, { key: 'card_type', label: 'Card type', type: 'text' }, { key: 'balance', label: 'Balance', type: 'number' }, { key: 'purchase_amount', label: 'Purchase amount', type: 'number' }, { key: 'status', label: 'Status', type: 'text' }, { key: 'is_active', label: 'Active', type: 'checkbox' }, { key: 'notes', label: 'Admin notes', type: 'textarea' }], actions: [{ label: 'Generate details', path: 'generate-details/', confirm: 'Generate card details using the backend card generator?' }, { label: 'Freeze', path: 'freeze/', confirm: 'Suspend this card?', tone: 'danger' }, { label: 'Activate', path: 'activate/' }] },
  { key: 'ops-notifications', label: 'Operations alerts', path: '/api/admin/ops-notifications/', description: 'Resolve internal operational notifications and review escalation priority.', searchFields: ['title', 'message', 'entity_id'], columns: [{ key: 'title', label: 'Alert' }, { key: 'priority', label: 'Priority' }, { key: 'is_read', label: 'Read' }, { key: 'is_resolved', label: 'Resolved' }, { key: 'created_at', label: 'Created' }], fields: [{ key: 'notification_type', label: 'Type', type: 'text', required: true }, { key: 'title', label: 'Title', type: 'text', required: true }, { key: 'message', label: 'Message', type: 'textarea', required: true }, { key: 'priority', label: 'Priority', type: 'text' }, { key: 'is_read', label: 'Read', type: 'checkbox' }, { key: 'is_resolved', label: 'Resolved', type: 'checkbox' }], actions: [{ label: 'Resolve', path: 'resolve/', confirm: 'Resolve this operations alert?' }] },
  { key: 'audit-logs', label: 'Admin audit log', path: '/api/admin/audit-logs/', description: 'Read-only record of staff changes and workflow decisions.', readOnly: true, searchFields: ['entity', 'entity_id', 'action'], columns: [{ key: 'admin_email', label: 'Admin' }, { key: 'action', label: 'Action' }, { key: 'entity', label: 'Entity' }, { key: 'entity_id', label: 'Entity ID' }, { key: 'created_at', label: 'Created' }], fields: [] },
  { key: 'agreement-acceptances', label: 'Agreement acceptances', path: '/api/admin/agreement-acceptances/', description: 'Read-only compliance record of accepted agreement versions.', readOnly: true, columns: [{ key: 'user_email', label: 'User' }, { key: 'agreement_title', label: 'Agreement' }, { key: 'agreement_version', label: 'Version' }, { key: 'accepted_at', label: 'Accepted' }], fields: [] },
  { key: 'chat-sessions', label: 'Chat sessions', path: '/api/admin/chat-sessions/', description: 'Review visitor conversations and manage human handoff state.', searchFields: ['session_id', 'user_email', 'user_name'], columns: [{ key: 'session_id', label: 'Session' }, { key: 'user_email', label: 'Email' }, { key: 'status', label: 'Status' }, { key: 'updated_at', label: 'Updated' }], fields: [{ key: 'user_email', label: 'Email', type: 'text' }, { key: 'user_name', label: 'Name', type: 'text' }, { key: 'status', label: 'Status', type: 'text' }, { key: 'alert_sent', label: 'Alert sent', type: 'checkbox' }] },
  { key: 'chat-messages', label: 'Chat messages', path: '/api/admin/chat-messages/', description: 'Read-only transcript records for support and quality review.', readOnly: true, columns: [{ key: 'session_id', label: 'Session' }, { key: 'role', label: 'Role' }, { key: 'content', label: 'Message' }, { key: 'created_at', label: 'Created' }], fields: [] },
]

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'object') return JSON.stringify(value)
  if (typeof value === 'string' && (value.includes('T') || value.endsWith('Z'))) {
    const date = new Date(value)
    if (!Number.isNaN(date.getTime())) return date.toLocaleString()
  }
  return String(value)
}

function inputValue(value: unknown, field: Field) {
  if (field.type === 'checkbox') return Boolean(value)
  if (value === null || value === undefined) return ''
  if (field.type === 'datetime-local') return String(value).slice(0, 16)
  return String(value)
}

function serializeForm(form: Record<string, unknown>, fields: Field[]) {
  const payload: ApiRecord = {}
  fields.forEach((field) => {
    const value = form[field.key]
    if (value === '' || value === undefined) return
    if (field.type === 'number') payload[field.key] = Number(value)
    else payload[field.key] = value
  })
  return payload
}

export default function AdminControlCenter() {
  const [resourceKey, setResourceKey] = useState(resources[0].key)
  const [mode, setMode] = useState<Mode>('list')
  const [records, setRecords] = useState<ApiRecord[]>([])
  const [selected, setSelected] = useState<ApiRecord | null>(null)
  const [count, setCount] = useState(0)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const resource = useMemo(() => resources.find((item) => item.key === resourceKey) ?? resources[0], [resourceKey])
  const pageSize = 25

  const load = useCallback(async () => {
    setLoading(true)
    setMessage('')
    try {
      const result = await listAdminResource<ApiRecord>(resource.path, { search, limit: pageSize, offset: page * pageSize })
      setRecords(result.results)
      setCount(result.count)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load this control surface.')
    } finally {
      setLoading(false)
    }
  }, [page, resource.path, search])

  useEffect(() => { setMode('list'); setSelected(null); setPage(0) }, [resourceKey])
  useEffect(() => { void load() }, [load])

  function selectRecord(record: ApiRecord) { setSelected(record); setMode('show'); setMessage('') }

  async function refreshSelected() {
    if (!selected?.id) return
    try { setSelected(await getAdminResource(resource.path, String(selected.id))) } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not refresh record.') }
  }

  async function save(form: Record<string, unknown>) {
    setSaving(true); setMessage('')
    try {
      const payload = serializeForm(form, resource.fields)
      if (mode === 'edit' && selected?.id) await updateAdminResource(resource.path, String(selected.id), payload)
      else await createAdminResource(resource.path, payload)
      setMessage('Saved successfully.')
      setMode('list'); setSelected(null); await load()
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Save failed.') } finally { setSaving(false) }
  }

  async function remove(record: ApiRecord) {
    if (!record.id || !window.confirm('Delete this record? This action cannot be undone.')) return
    try { await deleteAdminResource(resource.path, String(record.id)); setMessage('Deleted successfully.'); await load() } catch (error) { setMessage(error instanceof Error ? error.message : 'Delete failed.') }
  }

  async function runAction(action: Action) {
    if (!selected?.id) return
    if (action.confirm && !window.confirm(action.confirm)) return
    setSaving(true); setMessage('')
    try {
      const result = await fetch(`${resource.path}${String(selected.id)}/${action.path}`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${window.localStorage.getItem('authToken') ?? ''}` }, body: JSON.stringify({}) })
      const payload = await result.json().catch(() => null)
      if (!result.ok) throw new Error(typeof payload?.detail === 'string' ? payload.detail : `Action failed (${result.status}).`)
      setSelected(payload); setMessage(`${action.label} completed.`); await load()
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Action failed.') } finally { setSaving(false) }
  }

  return <div className="space-y-6">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600">Django control center</p><h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">Run the platform from one place.</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">This workspace exposes the backend’s operational models and workflow actions with Django permission checks, pagination, filters, and explicit safeguards for destructive or financial operations.</p></div><div className="flex items-center gap-2"><button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-cyan-200"><RefreshCw size={16} /> Refresh</button>{!resource.readOnly && <button onClick={() => { setSelected(null); setMode('create') }} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-700"><Plus size={16} /> New</button>}</div></div>
    <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)]"><aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_8px_28px_rgba(15,23,42,0.04)]"><div className="mb-3 flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400"><ShieldAlert size={15} className="text-cyan-600" /> Backend domains</div><div className="max-h-[620px] space-y-1 overflow-y-auto">{resources.map((item) => <button key={item.key} onClick={() => setResourceKey(item.key)} className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${item.key === resource.key ? 'bg-cyan-50 text-cyan-800' : 'text-slate-600 hover:bg-slate-50'}`}>{item.label}</button>)}</div></aside><section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:p-6"><div className="mb-5 flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-end lg:justify-between"><div><h2 className="text-xl font-semibold text-slate-950">{resource.label}</h2><p className="mt-1 text-sm text-slate-500">{resource.description}</p></div>{mode === 'list' && <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3"><Search size={16} className="text-slate-400" /><input value={search} onChange={(event) => { setPage(0); setSearch(event.target.value) }} className="h-11 w-full min-w-0 bg-transparent text-sm outline-none lg:w-64" placeholder="Search this resource…" /></div>}</div>{message && <div className="mb-4 rounded-xl bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-800">{message}</div>}{mode === 'list' ? <ListView resource={resource} records={records} loading={loading} onSelect={selectRecord} onDelete={remove} /> : mode === 'show' && selected ? <ShowView resource={resource} record={selected} saving={saving} onBack={() => setMode('list')} onEdit={() => setMode('edit')} onRefresh={() => void refreshSelected()} onAction={runAction} /> : <FormView resource={resource} record={mode === 'edit' ? selected : null} saving={saving} onCancel={() => setMode(selected ? 'show' : 'list')} onSave={save} />}{mode === 'list' && <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500"><span>{count} record{count === 1 ? '' : 's'}</span><span className="flex items-center gap-2"><button disabled={page === 0} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"><ChevronLeft size={16} /></button><span>Page {page + 1}</span><button disabled={(page + 1) * pageSize >= count} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"><ChevronRight size={16} /></button></span></div>}</section></div>
  </div>
}

function ListView({ resource, records, loading, onSelect, onDelete }: { resource: ControlResource; records: ApiRecord[]; loading: boolean; onSelect: (record: ApiRecord) => void; onDelete: (record: ApiRecord) => void }) {
  if (loading) return <div className="grid place-items-center py-20"><RefreshCw className="animate-spin text-cyan-600" size={24} /></div>
  if (!records.length) return <div className="grid place-items-center py-20 text-center"><LockKeyhole className="mb-3 text-slate-300" size={28} /><p className="text-sm text-slate-500">No records returned for this domain.</p></div>
  return <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead><tr className="border-b border-slate-100 text-xs uppercase tracking-[0.12em] text-slate-400">{resource.columns.map((column) => <th key={column.key} className="px-3 py-3 font-bold">{column.label}</th>)}<th className="px-3 py-3 text-right font-bold">Actions</th></tr></thead><tbody>{records.map((record, index) => <tr key={String(record.id ?? index)} className="border-b border-slate-50 hover:bg-slate-50/70">{resource.columns.map((column) => <td key={column.key} className="max-w-[260px] truncate px-3 py-4 text-slate-700">{formatValue(record[column.key])}</td>)}<td className="px-3 py-4"><div className="flex justify-end gap-1"><button onClick={() => onSelect(record)} className="rounded-lg p-2 text-slate-500 hover:bg-cyan-50 hover:text-cyan-700" title="View"><Eye size={16} /></button>{!resource.readOnly && <><button onClick={() => { onSelect(record) }} className="rounded-lg p-2 text-slate-500 hover:bg-cyan-50 hover:text-cyan-700" title="Edit"><Edit3 size={16} /></button><button onClick={() => onDelete(record)} className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700" title="Delete"><Trash2 size={16} /></button></>}</div></td></tr>)}</tbody></table></div>
}

function ShowView({ resource, record, saving, onBack, onEdit, onRefresh, onAction }: { resource: ControlResource; record: ApiRecord; saving: boolean; onBack: () => void; onEdit: () => void; onRefresh: () => void; onAction: (action: Action) => void }) {
  return <div><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"><ChevronLeft size={16} /> Back</button><div className="flex flex-wrap gap-2">{resource.actions?.map((action) => <button key={action.path} disabled={saving} onClick={() => onAction(action)} className={`rounded-xl px-3 py-2 text-sm font-semibold ${action.tone === 'danger' ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100'}`}>{action.label}</button>)}{!resource.readOnly && <button onClick={onEdit} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white"><Edit3 size={15} /> Edit</button>}<button onClick={onRefresh} className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:text-slate-900"><RefreshCw size={16} /></button></div></div><div className="grid gap-3 sm:grid-cols-2">{Object.entries(record).map(([key, value]) => <div key={key} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">{key.replaceAll('_', ' ')}</p><pre className="mt-2 max-h-52 overflow-auto whitespace-pre-wrap break-words font-sans text-sm text-slate-700">{formatValue(value)}</pre></div>)}</div></div>
}

function FormView({ resource, record, saving, onCancel, onSave }: { resource: ControlResource; record: ApiRecord | null; saving: boolean; onCancel: () => void; onSave: (form: Record<string, unknown>) => void }) {
  const [form, setForm] = useState<Record<string, unknown>>(() => Object.fromEntries(resource.fields.map((field) => [field.key, inputValue(record?.[field.key], field)])))
  return <form onSubmit={(event) => { event.preventDefault(); onSave(form) }}><div className="mb-5 flex items-center justify-between"><div><h3 className="text-lg font-semibold text-slate-950">{record ? 'Edit record' : 'Create record'}</h3><p className="mt-1 text-sm text-slate-500">Only fields supported by the backend serializer are sent.</p></div><button type="button" onClick={onCancel} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X size={18} /></button></div><div className="grid gap-4 md:grid-cols-2">{resource.fields.map((field) => <label key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}><span className="mb-1.5 block text-sm font-semibold text-slate-700">{field.label}{field.required && <span className="text-rose-500"> *</span>}</span>{field.type === 'textarea' ? <textarea required={field.required} value={String(form[field.key] ?? '')} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))} className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50" /> : field.type === 'checkbox' ? <span className="flex h-11 items-center gap-3 rounded-xl border border-slate-200 px-3"><input type="checkbox" checked={Boolean(form[field.key])} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.checked }))} /><span className="text-sm text-slate-600">Enabled</span></span> : <input required={field.required} type={field.type} value={String(form[field.key] ?? '')} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50" />}{field.help && <span className="mt-1 block text-xs text-slate-400">{field.help}</span>}</label>)}</div><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={onCancel} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600">Cancel</button><button disabled={saving} type="submit" className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save changes'}</button></div></form>
}
