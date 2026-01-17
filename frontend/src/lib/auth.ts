// frontend/src/lib/auth.ts

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  // Try common keys that different codebases use
  const candidates = [
    "access_token",
    "access",
    "token",
    "accessToken",
    "jwt",
    "auth_token",
  ];

  for (const key of candidates) {
    const v = window.localStorage.getItem(key);
    if (v && v.trim()) return v.trim();
  }

  return null;
}

export function authHeaders(extra?: HeadersInit): HeadersInit {
  const token = getAccessToken();

  const base: Record<string, string> = {
    Accept: "application/json",
  };

  if (token) {
    base.Authorization = `Bearer ${token}`;
  }

  // Merge extra headers last (so caller can override if needed)
  return { ...base, ...(extra as any) };
}
