"use client";

import { useEffect, useRef, useState } from 'react';

interface Review {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number; // 1..5
}

const REVIEWS: Review[] = [
  {
    id: 'r1',
    name: 'Emily R.',
    location: 'Austin, US',
    quote:
      'I appreciate the human approval step. Deposits and withdrawals feel safer than anywhere else I tried.',
    rating: 5,
  },
  {
    id: 'r2',
    name: 'Carlos M.',
    location: 'Madrid, ES',
    quote:
      'Transparent plans and responsive support. My experience has been consistently positive.',
    rating: 5,
  },
  {
    id: 'r3',
    name: 'Sofia L.',
    location: 'Toronto, CA',
    quote:
      'ROI performance matched expectations and payouts were reviewed quickly by the team.',
    rating: 4,
  },
  {
    id: 'r4',
    name: 'Noah D.',
    location: 'NYC, US',
    quote:
      'The virtual Visa card is superb for online purchases. Setup was instant and support is 24/7.',
    rating: 5,
  },
];

function Stars({ n }: { n: number }) {
  const items = Array.from({ length: 5 }, (_, i) => i < n);
  return (
    <div className="flex gap-1" aria-label={`${n} out of 5 stars`}>
      {items.map((filled, i) => (
        <svg
          key={i}
          className={filled ? 'w-4 h-4 text-yellow-400' : 'w-4 h-4 text-gray-300'}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsRotator({ intervalMs = 5000 }: { intervalMs?: number }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    timer.current = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % REVIEWS.length);
        setFade(true);
      }, 250); // brief fade-out before showing next
    }, intervalMs);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [intervalMs]);

  const r = REVIEWS[idx];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 md:p-8 shadow-sm">
      <div className={`transition-all duration-300 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>
        <div className="flex items-center justify-between mb-2">
          <Stars n={r.rating} />
          <span className="text-xs text-gray-500">Auto-rotating reviews</span>
        </div>
        <p className="text-gray-800 text-lg leading-relaxed">“{r.quote}”</p>
        <div className="mt-4 text-sm text-gray-600">
          <span className="font-semibold text-[#0b2f6b]">{r.name}</span>
          <span className="mx-2">•</span>
          <span>{r.location}</span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        {REVIEWS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-[#0b2f6b]' : 'w-2 bg-gray-300'}`}
            aria-label={i === idx ? 'current review' : 'review'}
          />
        ))}
      </div>
    </div>
  );
}
