"use client";
import React from 'react';
import { useTranslation } from '@/i18n/TranslationProvider';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();
  return (
    <select
      aria-label="Change language"
      className="border rounded-md px-2 py-1 text-sm"
      value={locale}
      onChange={(e) => setLocale(e.target.value)}
    >
      {languages.map(l => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  );
}
