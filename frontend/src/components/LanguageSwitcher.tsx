"use client";
import React from 'react';
import { useTranslation } from '@/i18n/TranslationProvider';

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'no', label: 'Norsk', flag: '🇳🇴' },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();
  const currentLanguage = languages.find(l => l.code === locale) || languages[0];
  
  return (
    <div className="relative">
      <select
        aria-label="Change language"
        className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] transition-colors cursor-pointer min-w-0"
        value={locale}
        onChange={(e) => setLocale(e.target.value)}
      >
        {languages.map(l => (
          <option key={l.code} value={l.code}>
            {l.flag} {l.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
