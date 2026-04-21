import { cookies, headers } from 'next/headers'

const supportedLocales = ['en', 'de']

function normalizeLocale(value: string | string[] | undefined | null): string {
  if (!value) return ''
  const locale = Array.isArray(value) ? value[0] : value
  return locale.trim().toLowerCase().split(';')[0].split('-')[0]
}

function parseAcceptLanguage(header: string): string[] {
  return header
    .split(',')
    .map((item) => {
      const [tag, q] = item.trim().split(';q=')
      return {
        locale: normalizeLocale(tag),
        weight: q ? Number(q) : 1,
      }
    })
    .filter((item) => item.locale)
    .sort((a, b) => b.weight - a.weight)
    .map((item) => item.locale)
}

export async function detectLocale(
  searchParams?: Record<string, string | string[] | undefined>
): Promise<string> {
  const paramLocale = normalizeLocale(searchParams?.lang)
  if (supportedLocales.includes(paramLocale)) return paramLocale

  const cookieStore = await cookies()
  const cookieLocale = normalizeLocale(cookieStore.get('next-locale')?.value)
  if (supportedLocales.includes(cookieLocale)) return cookieLocale

  const headerStore = await headers()
  const acceptLanguage = headerStore.get('accept-language') || ''
  const preferredLanguages = parseAcceptLanguage(acceptLanguage)
  return preferredLanguages.find((lang) => supportedLocales.includes(lang)) || 'en'
}