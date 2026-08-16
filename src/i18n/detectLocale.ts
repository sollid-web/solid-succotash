import { cookies, headers } from 'next/headers'

const supportedLocales = ['en', 'de', 'es', 'fr', 'it', 'pt', 'ru', 'no']

const localeAliases: Record<string, string> = {
  nb: 'no',
  nn: 'no',
}

function normalizeLocale(value: any): string {
  if (!value || typeof value !== 'string') return ''
  const locale = value.trim().toLowerCase().split(';')[0].split('-')[0]
  return localeAliases[locale] ?? locale
}

// Fixed function signature to handle typical Next.js searchParams
export async function detectLocale(
  searchParams?: any 
): Promise<string> {
  
  // 1. Handle searchParams (Awaiting in case it's a promise from Page.tsx)
  const resolvedParams = await searchParams;
  const paramLocale = normalizeLocale(resolvedParams?.lang);
  if (supportedLocales.includes(paramLocale)) return paramLocale

  // 2. Persisted cookie
  const cookieStore = await cookies()
  const cookieLocale = normalizeLocale(cookieStore.get('next-locale')?.value)
  if (supportedLocales.includes(cookieLocale)) return cookieLocale

  // 3. Browser Accept-Language header
  const headerStore = await headers()
  const acceptLanguage = headerStore.get('accept-language') || ''
  
  // Simple parser to find the first supported language in the header string
  const browserLocales = acceptLanguage.split(',').map(lang => normalizeLocale(lang.split(';')[0]));
  const detected = browserLocales.find(lang => supportedLocales.includes(lang));

  return detected || 'en'
}