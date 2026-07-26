export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || ''
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const base = path.startsWith('http') ? '' : getApiBaseUrl()
  const url = path.startsWith('http') ? path : `${base}${path}`

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
