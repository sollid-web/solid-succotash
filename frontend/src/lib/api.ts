// src/lib/api.ts

const DEFAULT_API_BASE = "https://solid-succotash-production.up.railway.app";

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

  if (!headers.has("Authorization") && typeof window !== "undefined") {
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
