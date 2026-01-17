// src/lib/api.ts

export function getApiBaseUrl() {
  // Always prefer an explicit environment variable.
  // This prevents accidental calls to the frontend domain (e.g., wolvcapital.com/api/...)
  const envBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_BASE_URL;

  if (envBase && typeof envBase === "string") {
    return envBase.replace(/\/$/, "");
  }

  // Hard fallback (your Railway backend)
  return "https://solid-succotash-production.up.railway.app";
}

export function buildApiUrl(path: string) {
  const base = getApiBaseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
