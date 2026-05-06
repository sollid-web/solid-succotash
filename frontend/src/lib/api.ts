// src/lib/api.ts

const DEFAULT_API_BASE = "https://django-production-2764.up.railway.app";

export function getApiBaseUrl() {
  // Use a single env var to avoid mixed backends.
  const envBase = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (envBase && typeof envBase === "string") {
    return envBase.replace(/\/$/, "");
  }

  // Hard fallback (Railway backend)
  return DEFAULT_API_BASE;
}

export function buildApiUrl(path: string) {
  const base = getApiBaseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export function apiFetch(path: string, init: RequestInit = {}) {
  const url = path.startsWith("http") ? path : buildApiUrl(path);
  const headers = new Headers(init.headers || {});

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const lowerUrl = url.toLowerCase();
  const skipAuth =
    lowerUrl.includes("/api/auth/jwt/create/") ||
    lowerUrl.includes("/api/auth/jwt/refresh/");

  if (!skipAuth && !headers.has("Authorization") && typeof window !== "undefined") {
    const token = window.localStorage.getItem("authToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  return fetch(url, {
    ...init,
    headers,
  });
}

export async function apiFetchWithRefresh(path: string, init: RequestInit = {}): Promise<Response> {
  let res = await apiFetch(path, init);
  if (res.status === 401) {
    const refresh = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;
    if (refresh) {
      const refreshRes = await fetch(`${getApiBaseUrl()}/api/auth/jwt/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        const newToken = data.access;
        localStorage.setItem("authToken", newToken);
        localStorage.setItem("access_token", newToken);
        localStorage.setItem("token", newToken);
        res = await apiFetch(path, init);
      }
    }
  }
  return res;
}
