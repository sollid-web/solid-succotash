"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from '@/i18n/TranslationProvider';

interface TxEvent {
  id: string;
  type: 'Deposit' | 'Withdrawal' | 'Investment';
  name: string;
  amount: number;
  currency: string;
  createdAt: string;
  description: string; // human readable activity line
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const FIRST_NAMES = [
  'James','Sophia','Liam','Olivia','Noah','Emma','Ethan','Ava','Lucas','Mia','Benjamin','Charlotte','Henry','Amelia','Mason','Isabella','Elijah','Harper','Daniel','Gianna','Jacob','Scarlett','Michael','Victoria','Sebastian','Grace','Jack','Chloe','Aiden','Zoe','Samuel','Stella','David','Lily','Carter','Hannah','Wyatt','Violet','Matthew','Ellie','Gabriel','Nora','Owen','Riley','Logan','Aria','Julian','Penelope','Luke','Layla'
];
const LAST_INITIALS = ['A','B','C','D','E','F','G','H','J','K','L','M','N','P','R','S','T','V','W','Y'];
const PLANS = ['Pioneer','Vanguard','Horizon','Summit'];

function randomAmount(type: 'Deposit'|'Withdrawal'|'Investment') {
  if (type === 'Investment') return Math.floor(Math.random()* (25000 - 120 + 1)) + 120; // 120..25000
  if (type === 'Deposit') return Math.floor(Math.random()* (15000 - 50 + 1)) + 50; // 50..15000
  return Math.floor(Math.random()* (9000 - 40 + 1)) + 40; // withdrawal 40..9000
}

function pickUniqueName(recent: string[]): string {
  let tries = 0;
  while (tries < 50) {
    const first = FIRST_NAMES[Math.floor(Math.random()*FIRST_NAMES.length)];
    const last = LAST_INITIALS[Math.floor(Math.random()*LAST_INITIALS.length)];
    const name = `${first} ${last}.`;
    if (!recent.includes(name)) return name;
    tries++;
  }
  // fallback (unlikely) - allow reuse
  return recent[0] || 'User X.';
}

function buildEvent(recentNames: string[]): TxEvent {
  // Alternate among types with weighted probability
  const r = Math.random();
  const type: 'Deposit' | 'Withdrawal' | 'Investment' = r < 0.5 ? 'Deposit' : r < 0.75 ? 'Withdrawal' : 'Investment';
  const name = pickUniqueName(recentNames);
  const amount = randomAmount(type);
  const currency = 'USD';
  const createdAt = new Date().toISOString();
  let description: string;
  if (type === 'Investment') {
    const plan = PLANS[Math.floor(Math.random()*PLANS.length)];
    description = `${name} invested $${amount.toLocaleString()} in the ${plan} plan`;
  } else if (type === 'Deposit') {
    description = `${name} deposited $${amount.toLocaleString()}`;
  } else {
    description = `${name} withdrew $${amount.toLocaleString()}`;
  }
  return {
    id: `${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
    type,
    name,
    amount,
    currency,
    createdAt,
    description,
  };
}

export default function LiveTransactionsTicker({
  initialItems = 8,
  intervalMs = 5000,
  maxItems = 40,
  recentNameWindow = 12,
}: {
  initialItems?: number;
  intervalMs?: number;
  maxItems?: number;
  recentNameWindow?: number;
}) {
  const [events, setEvents] = useState<TxEvent[]>([]);
  const recentNamesRef = useRef<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // seed initial list
    const seed: TxEvent[] = [];
    for (let i=0;i<initialItems;i++) {
      const ev = buildEvent(recentNamesRef.current);
      recentNamesRef.current.unshift(ev.name);
      recentNamesRef.current = recentNamesRef.current.slice(0, recentNameWindow);
      seed.push(ev);
    }
    setEvents(seed);

    timerRef.current = setInterval(() => {
      setEvents(prev => {
        const ev = buildEvent(recentNamesRef.current);
        recentNamesRef.current.unshift(ev.name);
        recentNamesRef.current = recentNamesRef.current.slice(0, recentNameWindow);
        const next = [ev, ...prev];
        return next.slice(0, maxItems);
      });
    }, intervalMs);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [initialItems, intervalMs, maxItems, recentNameWindow]);

  const rendered = useMemo(() => events.map((e,index) => (
    <div
      key={e.id}
      className="flex items-center justify-between py-2 animate-[fadeIn_0.5s_ease]"
      style={{ animationDelay: `${Math.min(index,10)*20}ms` }}
    >
      <div className="flex items-start gap-3">
        <span className={`mt-1 inline-flex h-2.5 w-2.5 rounded-full ${
          e.type === 'Deposit' ? 'bg-green-500' : e.type === 'Withdrawal' ? 'bg-amber-500' : 'bg-blue-500'
        } animate-pulse`} />
        <div className="text-sm text-gray-700 leading-snug">
          <strong className="text-[#0b2f6b]">{e.name}</strong>{' '}<span className="text-gray-600">{e.description.replace(e.name+' ','')}</span>
          <div className="text-xs text-gray-500 mt-1">{timeAgo(e.createdAt)}</div>
        </div>
      </div>
      <div className="text-sm font-semibold text-gray-900 text-right min-w-[90px]">
        ${e.amount.toLocaleString()}
      </div>
    </div>
  )), [events]);

  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm overflow-hidden">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-[#0b2f6b]">{t('ticker.recentActivity')}</h3>
      </div>
      <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-2">
        {rendered}
      </div>
      <style jsx>{`
        @keyframes fadeIn { from { opacity:0; transform: translateY(-4px);} to { opacity:1; transform: translateY(0);} }
      `}</style>
    </div>
  );
}
