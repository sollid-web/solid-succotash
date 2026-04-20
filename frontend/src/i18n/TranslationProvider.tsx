"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import en from './en.json';
import de from './de.json';

const supportedLocales = ['en', 'de']
const localeCookieName = 'next-locale'

const dictionaries: Record<string, Record<string,string>> = {
  en,
  de,
};

function normalizeLocale(input: string | undefined | null): string {
  if (!input) return '';
  const base = String(input).toLowerCase().split('-')[0];
  return base;
}

interface TranslationContextValue {
  locale: string;
  t: (key: string) => string;
  setLocale: (locale: string) => void;
}

const TranslationContext = createContext<TranslationContextValue | undefined>(undefined);

function detectInitialLocale(): string {
  if (typeof window === 'undefined') return 'en';

  // 1. URL parameter is highest-priority for user-selected language.
  const urlSearch = new URLSearchParams(window.location.search);
  const paramLocale = normalizeLocale(urlSearch.get('lang'));
  if (supportedLocales.includes(paramLocale)) return paramLocale;

  // 2. Check explicit user preference in localStorage
  const storedRaw = window.localStorage.getItem('wolvcapital.locale');
  const stored = normalizeLocale(storedRaw);
  if (supportedLocales.includes(stored)) return stored;

  // 3. Check cookie set by middleware or legacy client code
  const cookieLocale = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${localeCookieName}=`) || c.startsWith('wolvcapital_locale='));
  if (cookieLocale) {
    const value = normalizeLocale(cookieLocale.split('=')[1]);
    if (supportedLocales.includes(value)) return value;
  }

  // 4. Browser language fallback
  const nav = normalizeLocale(navigator.language);
  if (supportedLocales.includes(nav)) return nav;

  // 5. Default
  return 'en';
}

export const TranslationProvider = ({ children, initialLocale = 'en' }: { children: ReactNode; initialLocale?: string }) => {
  const [locale, setLocaleState] = useState<string>(supportedLocales.includes(initialLocale) ? initialLocale : 'en');

  useEffect(() => {
    setLocaleState(supportedLocales.includes(initialLocale) ? initialLocale : detectInitialLocale());
  }, [initialLocale]);

  const setLocale = (loc: string) => {
    const normalized = normalizeLocale(loc);
    if (!supportedLocales.includes(normalized)) return;
    setLocaleState(normalized);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('wolvcapital.locale', normalized);
      document.cookie = `${localeCookieName}=${normalized};path=/;max-age=${60*60*24*365}`;
      document.cookie = `wolvcapital_locale=${normalized};path=/;max-age=${60*60*24*365}`;
    }
  };

  const t = (key: string) => {
    const dict = supportedLocales.includes(locale) ? dictionaries[locale] : dictionaries.en;
    return dict[key] || key;
  };

  // Keep the <html lang="..."> attribute in sync with the active locale for
  // accessibility and correct language exposure to crawlers/assistive tech.
  useEffect(() => {
    if (typeof document !== 'undefined' && locale) {
      document.documentElement.setAttribute('lang', locale);
    }
  }, [locale]);

  return (
    <TranslationContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </TranslationContext.Provider>
  );
};

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error('useTranslation must be used within TranslationProvider');
  return ctx;
}
