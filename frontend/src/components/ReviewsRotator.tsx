"use client";

import { useEffect, useRef, useState } from 'react';

interface Review {
  id: string;
  name: string;
  location?: string;
  walletMasked: string;
  quote: string;
  rating: number; // 1..5
}

// Reviews are intentionally anonymized (initials + masked wallet) to preserve privacy.
const REVIEWS: Review[] = [
  { id: 'r001', name: 'Daniel M.', location: 'London, UK', walletMasked: '0x8f4c…9ad1', quote: 'Payouts have matched what was shown in my dashboard, and the weekly summary is easy to read.', rating: 5 },
  { id: 'r002', name: 'Michael A.', location: 'US', walletMasked: 'bc1q…alltj', quote: 'Signup and verification were straightforward. I got answers when I had questions.', rating: 5 },
  { id: 'r003', name: 'Patrick W.', location: 'US', walletMasked: 'TQh7…8p2k', quote: 'I like that the terms are clear. Nothing felt hidden when I deposited.', rating: 4 },
  { id: 'r004', name: 'Andrew C.', location: 'CA', walletMasked: '0x12b0…6e3f', quote: 'The interface is clean and it’s easy to track what’s happening day to day.', rating: 5 },
  { id: 'r005', name: 'Sebastian K.', location: 'DE', walletMasked: 'bc1p…3q8m', quote: 'Support was responsive. The process feels structured and not rushed.', rating: 5 },
  { id: 'r006', name: 'Thomas R.', location: 'AU', walletMasked: '0x5a2d…0c11', quote: 'So far it’s been stable. I check in a few times a week and the updates make sense.', rating: 5 },
  { id: 'r007', name: 'Benjamin L.', location: 'SG', walletMasked: 'TNd3…qv7a', quote: 'The docs helped me get set up without guessing. Security info is explained in plain terms.', rating: 5 },
  { id: 'r008', name: 'Erik J.', location: 'NO', walletMasked: 'bc1q…z8rw', quote: 'Reporting is consistent and I can export what I need. That’s mainly why I’m still using it.', rating: 5 },
  { id: 'r009', name: 'Johan L.', location: 'SE', walletMasked: '0x2c09…f1b4', quote: 'When something wasn’t clear, support pointed me to the right page. No back-and-forth.', rating: 5 },
  { id: 'r010', name: 'Lukas M.', location: 'CH', walletMasked: 'bc1q…k5vd', quote: 'It does what it says: plan details, tracking, and a predictable workflow. That’s enough for me.', rating: 5 },
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

export default function ReviewsRotator({ intervalMs }: { intervalMs?: number }) {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const timer = useRef<NodeJS.Timeout | null>(null);

  // If no interval provided, pick a random value between 30s and 60s.
  function randomInterval() {
    return Math.floor(30000 + Math.random() * 30000);
  }

  useEffect(() => {
    setFade(true);
    const usedInterval = intervalMs ?? randomInterval();
    timer.current = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % REVIEWS.length);
        setFade(true);
      }, 250);
    }, usedInterval);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [intervalMs]);

  const r = REVIEWS[idx] || REVIEWS[0];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 md:p-8 shadow-sm">
      <div className={`transition-all duration-300 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>
        <div className="flex items-center justify-between mb-2">
          <Stars n={r.rating} />
          <span className="text-xs text-gray-500">Names abbreviated for privacy</span>
        </div>
        <p className="text-gray-800 text-lg leading-relaxed">"{r.quote}"</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600">
          <span className="font-semibold text-[#0b2f6b]">{r.name}</span>
          {r.location ? (
            <>
              <span aria-hidden="true">•</span>
              <span>{r.location}</span>
            </>
          ) : null}
          <span aria-hidden="true">•</span>
          <span className="text-gray-500">Wallet</span>
          <span className="font-mono text-xs text-gray-700 blur-[1px] select-none" aria-label="Wallet (masked)">
            {r.walletMasked}
          </span>
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
