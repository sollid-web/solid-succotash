const LIVE_API_ORIGIN = 'https://api.wolvcapital.com'

export function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL
  const origin = configured || (process.env.NODE_ENV === 'production' ? LIVE_API_ORIGIN : '')
  return origin.replace(/\/$/, '')
}

export function buildApiUrl(path: string): string {
  if (path.startsWith('http')) return path
  return `${getApiBaseUrl()}${path}`
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const url = buildApiUrl(path)

  const headers = new Headers(options.headers || {})
  if (!headers.has('Content-Type') && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json')
  }
  if (typeof window !== 'undefined' && !headers.has('Authorization')) {
    const token = window.localStorage.getItem('authToken')
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: options.credentials ?? 'include',
  })
}
