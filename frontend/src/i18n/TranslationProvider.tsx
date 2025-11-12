"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import no from './no.json';

// Basic dictionary map
const dictionaries: Record<string, Record<string,string>> = { en, es, fr, no };

function normalizeLocale(input: string | undefined | null): string {
  if (!input) return '';
  const base = String(input).toLowerCase().split('-')[0];
  // Map common Norwegian codes to our canonical 'no'
  if (base === 'nb' || base === 'nn') return 'no';
  return base;
}

interface TranslationContextValue {
  locale: string;
  t: (key: string) => string;
  setLocale: (locale: string) => void;
}

const TranslationContext = createContext<TranslationContextValue | undefined>(undefined);

function detectInitialLocale(): string {
  // 1. Check explicit user preference in localStorage
  if (typeof window !== 'undefined') {
    const storedRaw = window.localStorage.getItem('wolvcapital.locale');
    const stored = normalizeLocale(storedRaw);
    if (stored && dictionaries[stored]) return stored;
  }
  // 2. Check cookie set by middleware (geo/ip) - e.g. x-wolv-locale
  if (typeof document !== 'undefined') {
    const cookieLocale = document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith('wolvcapital_locale='));
    if (cookieLocale) {
      const value = normalizeLocale(cookieLocale.split('=')[1]);
      if (value && dictionaries[value]) return value;
    }
  }
  // 3. Browser language fallback
  if (typeof navigator !== 'undefined') {
    const nav = normalizeLocale(navigator.language);
    if (nav && dictionaries[nav]) return nav;
  }
  // 4. Default
  return 'en';
}

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<string>(detectInitialLocale());

  const setLocale = (loc: string) => {
    const normalized = normalizeLocale(loc);
    if (!dictionaries[normalized]) return;
    setLocaleState(normalized);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('wolvcapital.locale', normalized);
      document.cookie = `wolvcapital_locale=${normalized};path=/;max-age=${60*60*24*365}`;
    }
  };

  const t = (key: string) => {
    const dict = dictionaries[locale] || dictionaries.en;
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
