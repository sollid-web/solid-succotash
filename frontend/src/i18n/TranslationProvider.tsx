"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';

// Basic dictionary map
const dictionaries: Record<string, Record<string,string>> = { en, es, fr };

interface TranslationContextValue {
  locale: string;
  t: (key: string) => string;
  setLocale: (locale: string) => void;
}

const TranslationContext = createContext<TranslationContextValue | undefined>(undefined);

function detectInitialLocale(): string {
  // 1. Check explicit user preference in localStorage
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem('wolvcapital.locale');
    if (stored && dictionaries[stored]) return stored;
  }
  // 2. Check cookie set by middleware (geo/ip) - e.g. x-wolv-locale
  if (typeof document !== 'undefined') {
    const cookieLocale = document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith('wolvcapital_locale='));
    if (cookieLocale) {
      const value = cookieLocale.split('=')[1];
      if (value && dictionaries[value]) return value;
    }
  }
  // 3. Browser language fallback
  if (typeof navigator !== 'undefined') {
    const nav = navigator.language?.split('-')[0];
    if (nav && dictionaries[nav]) return nav;
  }
  // 4. Default
  return 'en';
}

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<string>(detectInitialLocale());

  const setLocale = (loc: string) => {
    if (!dictionaries[loc]) return;
    setLocaleState(loc);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('wolvcapital.locale', loc);
      document.cookie = `wolvcapital_locale=${loc};path=/;max-age=${60*60*24*365}`;
    }
  };

  const t = (key: string) => {
    const dict = dictionaries[locale] || dictionaries.en;
    return dict[key] || key;
  };

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
