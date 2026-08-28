import { apiFetch, buildApiUrl, getApiBaseUrl } from '@/lib/api'

export type ApiRecord = Record<string, unknown>

export type ApiList<T> = {
  results: T[]
  count: number
  next: string | null
  previous: string | null
}

export type AdminUser = {
  id?: string | number
  email?: string
  username?: string
  first_name?: string
  last_name?: string
  is_staff?: boolean
  is_superuser?: boolean
  [key: string]: unknown
}

export class AdminApiError extends Error {
  status: number
  details: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'AdminApiError'
    this.status = status
    this.details = details
  }
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (typeof payload === 'string' && payload.trim()) return payload
  if (payload && typeof payload === 'object') {
    const values = Object.values(payload as Record<string, unknown>)
    const message = values
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .find((value) => typeof value === 'string' && value.trim())
    if (typeof message === 'string') return message
  }
  return fallback
}

async function readPayload(response: Response) {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

function getAccessToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem('authToken')
}

function getRefreshToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem('refreshToken')
}

function storeTokens(access: string, refresh?: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem('authToken', access)
  if (refresh) window.localStorage.setItem('refreshToken', refresh)
}

export function clearAdminSession() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem('authToken')
  window.localStorage.removeItem('refreshToken')
  window.localStorage.removeItem('adminUser')
}

async function refreshAccessToken() {
  const refresh = getRefreshToken()
  if (!refresh) return false

  const response = await fetch(buildApiUrl('/api/auth/jwt/refresh/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ refresh }),
  })

  if (!response.ok) {
    clearAdminSession()
    return false
  }

  const payload = (await readPayload(response)) as { access?: string; refresh?: string } | null
  if (!payload?.access) {
    clearAdminSession()
    return false
  }

  storeTokens(payload.access, payload.refresh)
  return true
}

export async function adminFetch(path: string, options: RequestInit = {}, canRefresh = true) {
  const response = await apiFetch(path, options)
  if (response.status === 401 && canRefresh && getRefreshToken()) {
    const refreshed = await refreshAccessToken()
    if (refreshed) return adminFetch(path, options, false)
  }
  return response
}

export type AdminRequestResult = {
  status: number
  ok: boolean
  payload: unknown
  headers: Record<string, string>
}

export async function adminRequestWithMeta(path: string, options: RequestInit = {}): Promise<AdminRequestResult> {
  if (!getApiBaseUrl()) {
    throw new AdminApiError('NEXT_PUBLIC_API_URL is not configured. Set it to the Django API origin before using the admin console.', 0)
  }
  const response = await adminFetch(path, options)
  const payload = await readPayload(response)
  const headers: Record<string, string> = {}
  response.headers.forEach((value, key) => { headers[key] = value })
  return { status: response.status, ok: response.ok, payload, headers }
}

export async function adminRequest<T = unknown>(path: string, options: RequestInit = {}) {
  if (!getApiBaseUrl()) {
    throw new AdminApiError('NEXT_PUBLIC_API_URL is not configured. Set it to the Django API origin before using the admin console.', 0)
  }
  const response = await adminFetch(path, options)
  const payload = await readPayload(response)
  if (!response.ok) {
    throw new AdminApiError(
      getErrorMessage(payload, `Request failed with status ${response.status}`),
      response.status,
      payload,
    )
  }
  return payload as T
}

export async function loginAdmin(email: string, password: string) {
  const payload = await adminRequest<{ access: string; refresh: string }>('/api/auth/jwt/create/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  storeTokens(payload.access, payload.refresh)
  return payload
}

export async function getCurrentAdmin() {
  return adminRequest<AdminUser>('/api/auth/me/')
}

export async function listAdminResource<T extends ApiRecord>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<ApiList<T>> {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') query.set(key, String(value))
  })
  const suffix = query.toString() ? `?${query.toString()}` : ''
  const payload = await adminRequest<unknown>(`${path}${suffix}`)

  if (Array.isArray(payload)) {
    return { results: payload as T[], count: payload.length, next: null, previous: null }
  }

  const objectPayload = (payload || {}) as Record<string, unknown>
  const results = Array.isArray(objectPayload.results)
    ? (objectPayload.results as T[])
    : Array.isArray(objectPayload.data)
      ? (objectPayload.data as T[])
      : []

  return {
    results,
    count: typeof objectPayload.count === 'number' ? objectPayload.count : results.length,
    next: typeof objectPayload.next === 'string' ? objectPayload.next : null,
    previous: typeof objectPayload.previous === 'string' ? objectPayload.previous : null,
  }
}

export function getAdminResource(path: string, id: string | number) {
  return adminRequest<ApiRecord>(`${path}${String(id).replace(/\/$/, '')}/`)
}

export function createAdminResource(path: string, payload: ApiRecord) {
  return adminRequest<ApiRecord>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function updateAdminResource(path: string, id: string | number, payload: ApiRecord) {
  return adminRequest<ApiRecord>(`${path}${String(id).replace(/\/$/, '')}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function deleteAdminResource(path: string, id: string | number) {
  return adminRequest<unknown>(`${path}${String(id).replace(/\/$/, '')}/`, { method: 'DELETE' })
}

export function getStoredAdminUser(): AdminUser | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem('adminUser')
  if (!raw) return null
  try {
    return JSON.parse(raw) as AdminUser
  } catch {
    return null
  }
}

export function setStoredAdminUser(user: AdminUser) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem('adminUser', JSON.stringify(user))
}

export function isPlatformAdmin(user: AdminUser | null) {
  return Boolean(user?.is_staff || user?.is_superuser)
}
