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
const REVIEWS: Review[] =[
  { id: 'r001', name: 'Daniel Moore', location: 'London, UK', quote: 'Payouts have been on time and the reports are easy to follow. No issues so far.', rating: 5 },
  { id: 'r002', name: 'Erik Johansen', location: 'Oslo, NO', quote: 'The team is easy to work with and approvals didn’t take long. Happy with the service.', rating: 5 },
  { id: 'r003', name: 'Patrick Wilson', location: 'New York, US', quote: 'Fees are clear and results have been consistent. It’s been a good experience overall.', rating: 5 },
  { id: 'r004', name: 'Andrew Collins', location: 'Toronto, CA', quote: 'Getting started was straightforward. Everything has been running smoothly since.', rating: 5 },
  { id: 'r005', name: 'Sebastian Klein', location: 'Berlin, DE', quote: 'Support replies quickly and compliance feels solid. Does what we need.', rating: 5 },
  { id: 'r006', name: 'Thomas Reed', location: 'Sydney, AU', quote: 'The platform feels stable and settlements arrive when expected. Can’t complain.', rating: 5 },
  { id: 'r007', name: 'Benjamin Lee', location: 'Singapore, SG', quote: 'Docs are clear and security looks well handled. Setup was easier than expected.', rating: 5 },
  { id: 'r008', name: 'Michael O’Connor', location: 'Dublin, IE', quote: 'Our team picked it up quickly and reporting has been reliable so far.', rating: 5 },
  { id: 'r009', name: 'Johan Lundqvist', location: 'Stockholm, SE', quote: 'Support has been responsive and performance has been steady. Works for our needs.', rating: 5 },
  { id: 'r010', name: 'Lukas Meier', location: 'Zurich, CH', quote: 'Everything is pretty predictable, which is what we want. Overall a solid service.', rating: 5 },
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
