"use client";

import { useEffect, useRef, useState } from 'react';

interface Review {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number; // 1..5
}

// Concise, male-only business-level reviews used for the rotator.
const REVIEWS: Review[] = [
  { id: 'r001', name: 'Owen B.', location: 'London, UK', quote: 'Reliable payouts and clear reporting — excellent for business.', rating: 5 },
  { id: 'r002', name: 'Marcus G.', location: 'Oslo, NO', quote: 'Professional team and fast approvals. Highly recommend.', rating: 5 },
  { id: 'r003', name: 'Liam H.', location: 'New York, US', quote: 'Consistent returns and transparent fees — great partner.', rating: 5 },
  { id: 'r004', name: 'Ethan S.', location: 'Toronto, CA', quote: 'Smooth onboarding and dependable operations for corporate accounts.', rating: 5 },
  { id: 'r005', name: 'Noah D.', location: 'Berlin, DE', quote: 'Solid compliance and excellent customer support.', rating: 5 },
  { id: 'r006', name: 'Mason R.', location: 'Sydney, AU', quote: 'Robust platform with timely settlements — trustable service.', rating: 5 },
  { id: 'r007', name: 'Lucas F.', location: 'Singapore, SG', quote: 'Clear documentation and strong security practices.', rating: 5 },
  { id: 'r008', name: 'James K.', location: 'Dublin, IE', quote: 'Efficient workflows and reliable reporting for our team.', rating: 5 },
  { id: 'r009', name: 'Henry P.', location: 'Stockholm, SE', quote: 'Great for institutional use — attentive support and steady performance.', rating: 5 },
  { id: 'r010', name: 'Oliver T.', location: 'Zurich, CH', quote: 'High-quality governance and predictable outcomes.', rating: 5 },
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
          <span className="text-xs text-gray-500">Auto-rotating reviews</span>
        </div>
        <p className="text-gray-800 text-lg leading-relaxed">"{r.quote}"</p>
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
