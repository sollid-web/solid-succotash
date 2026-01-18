// src/lib/api.ts

const DEFAULT_API_BASE = "https://solid-succotash-production.up.railway.app";
const CSRF_COOKIE_NAME = "csrftoken";

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

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function isUnsafeMethod(method: string) {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase());
}

export function apiFetch(path: string, init: RequestInit = {}) {
  const url = path.startsWith("http") ? path : buildApiUrl(path);
  const headers = new Headers(init.headers || {});

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const method = (init.method || "GET").toUpperCase();
  if (isUnsafeMethod(method)) {
    const csrfToken = readCookie(CSRF_COOKIE_NAME);
    if (csrfToken && !headers.has("X-CSRFToken")) {
      headers.set("X-CSRFToken", csrfToken);
    }
  }

  return fetch(url, {
    ...init,
    headers,
    credentials: "include",
  });
}
