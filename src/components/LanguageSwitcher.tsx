"use client";
import React from 'react';
import { useTranslation } from '@/components/TranslationProvider';

const languages = [
  { code: 'en', label: 'English',    flag: '🇺🇸' },
  { code: 'de', label: 'Deutsch',    flag: '🇩🇪' },
  { code: 'es', label: 'Español',    flag: '🇪🇸' },
  { code: 'fr', label: 'Français',   flag: '🇫🇷' },
  { code: 'it', label: 'Italiano',   flag: '🇮🇹' },
  { code: 'pt', label: 'Português',  flag: '🇵🇹' },
  { code: 'ru', label: 'Русский',    flag: '🇷🇺' },
  { code: 'no', label: 'Norsk',      flag: '🇳🇴' },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value;
    setLocale(nextLocale);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', nextLocale);
      window.history.replaceState({}, '', url.toString());
    }
  };

  return (
    <div className="relative">
      <select
        aria-label="Change language"
        className="appearance-none bg-transparent border border-white/20 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-white hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors cursor-pointer min-w-0"
        value={locale}
        onChange={handleLanguageChange}
      >
        {languages.map(l => (
          <option key={l.code} value={l.code}>
            {l.flag} {l.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
