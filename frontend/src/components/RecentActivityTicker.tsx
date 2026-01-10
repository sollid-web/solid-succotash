"use client";

import React, { useEffect, useRef, useState } from "react";

type ActivityType = "deposit" | "withdrawal" | "plan";

interface Activity {
  id: number;
  name: string;
  country: string;
  countryCode: string;
  type: ActivityType;
  amount?: number;
  plan?: string;
  message: string;
  timeAgo: string;
}

interface Props {
  plans?: string[];
  // Interval is now fixed to 30s by default (both min & max set to 30000)
  minIntervalMs?: number;
  maxIntervalMs?: number;
  soundPath?: string;
  soundVolume?: number;
  preventRepeatMs?: number;
  initialDelayMs?: number;
  className?: string;
}

type Country = {
  code: string;
  name: string;
  weight: number;
  names: string[];
};

// --- Combined-gender country pool with enhanced global diversity ---
const COUNTRIES: Country[] = [
  // Withdrawal-prioritized distribution (50% total)
  { code: "US", name: "United States", weight: 0.09, names: ["Daniel","Marcus","Tyler","Ethan","Joshua","Michael","Sarah","Emily","Jessica","Olivia"] },
  { code: "GB", name: "United Kingdom", weight: 0.07, names: ["Oliver","Jack","Henry","Liam","George","Amelia","Sophie","Grace","Isabella"] },
  { code: "DE", name: "Germany", weight: 0.05, names: ["Lukas","Jonas","Felix","Tobias","Leon","Anna","Julia","Lena"] },
  { code: "FR", name: "France", weight: 0.04, names: ["Thomas","Julien","Pierre","Louis","Gabriel","Camille","Clara","Chloé"] },
  { code: "CA", name: "Canada", weight: 0.04, names: ["Liam","Noah","Ethan","Owen","Ava","Charlotte","Ella"] },
  { code: "AU", name: "Australia", weight: 0.03, names: ["Jack","Oliver","Connor","William","Ruby","Isla","Mia"] },
  { code: "SG", name: "Singapore", weight: 0.03, names: ["Kai","Ryan","Ethan","Wei","Ming","Cheryl","Rachel"] },
  { code: "IN", name: "India", weight: 0.04, names: ["Arjun","Rohan","Aditya","Karan","Vikram","Priya","Neha"] },
  { code: "NO", name: "Norway", weight: 0.025, names: ["Erik","Magnus","Leif","Olav","Ingrid","Astrid"] },
  { code: "SE", name: "Sweden", weight: 0.025, names: ["Oscar","Johan","Gustav","Emma","Maja","Elsa"] },
  { code: "NL", name: "Netherlands", weight: 0.025, names: ["Daan","Lucas","Milan","Levi","Sophie","Lotte"] },
  { code: "BR", name: "Brazil", weight: 0.025, names: ["Lucas","Gabriel","Rafael","Pedro","Julia","Beatriz"] }
];
// Remaining 50% → other activities (trading, fees, transfers, internal ops)


const DEFAULT_PLANS = ["Pioneer", "Vanguard", "Horizon", "Summit"];
const AMOUNTS = [100,250,500,750,1000,1500,2000,2500,3500,5000,7500,10000,12500,15000,20000,25000,30000,40000,50000,75000,100000];
const TIME_AGO_OPTIONS = ["just now","moments ago","1 min ago","2 mins ago","3 mins ago","5 mins ago"];

let GLOBAL_ID = Date.now() % 1000000;

function pickWeightedCountry() {
  const total = COUNTRIES.reduce((s, c) => s + c.weight, 0);
  let r = Math.random() * total;
  for (const c of COUNTRIES) {
    if (r <= c.weight) return c;
    r -= c.weight;
  }
  return COUNTRIES[COUNTRIES.length - 1];
}
function pickRandom<T>(arr: T[]) { return arr[Math.floor(Math.random()*arr.length)]; }
function randBetween(min:number,max:number){ return Math.round(min + Math.random()*(max-min)); }

function generateRandomActivity(plans: string[]): Activity {
  const country = pickWeightedCountry();
  const name = pickRandom(country.names);
  const roll = Math.random();
  const type: ActivityType = roll < 0.7 ? "deposit" : roll < 0.9 ? "withdrawal" : "plan";
  let amount: number|undefined;
  let plan: string|undefined;
  let message: string;

  if (type === "plan") {
    plan = pickRandom(plans);
    message = `${name} (${country.name}) started ${plan}`;
  } else {
    amount = pickRandom(AMOUNTS);
    const action = type === "deposit" ? "deposited" : "withdrew";
    message = `${name} (${country.name}) ${action} $${amount.toLocaleString()}`;
  }

  return {
    id: ++GLOBAL_ID,
    name,
    country: country.name,
    countryCode: country.code,
    type,
    amount,
    plan,
    message,
    timeAgo: pickRandom(TIME_AGO_OPTIONS),
  };
}

// --- Component: single activity view with stylish animation (30s default interval) ---
const RecentActivitySingle: React.FC<Props> = ({
  plans = DEFAULT_PLANS,
  minIntervalMs = 30000, // default fixed to 30 seconds
  maxIntervalMs = 30000, // default fixed to 30 seconds
  soundPath = "/sounds/chime.wav",
  soundVolume = 0.35,
  preventRepeatMs = 2000,
  initialDelayMs = 800,
  className,
}) => {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [visible, setVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayedRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const recentRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    audioRef.current = soundPath ? new Audio(soundPath) : null;
    if (audioRef.current) audioRef.current.volume = soundVolume;

    const first = generateRandomActivity(plans);
    recentRef.current.add(first.message);
    setActivity(first);

    const startTimeout = window.setTimeout(() => {
      setVisible(true);
      if (audioRef.current) tryPlaySound(audioRef.current, preventRepeatMs, lastPlayedRef);
    }, initialDelayMs);

    const schedule = () => {
      const delay = randBetween(minIntervalMs, maxIntervalMs); // both are 30000 by default now
      timerRef.current = window.setTimeout(() => {
        setVisible(false);
        window.setTimeout(() => {
          let attempts = 0;
          let next = generateRandomActivity(plans);
          while (recentRef.current.has(next.message) && attempts < 8) {
            next = generateRandomActivity(plans);
            attempts++;
          }
          recentRef.current.add(next.message);
          if (recentRef.current.size > 100) {
            recentRef.current.clear();
            recentRef.current.add(next.message);
          }
          setActivity(next);
          setVisible(true);
          if (audioRef.current) tryPlaySound(audioRef.current, preventRepeatMs, lastPlayedRef);
          schedule();
        }, 420);
      }, delay);
    };

    schedule();

    return () => {
      clearTimeout(startTimeout as number);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plans, minIntervalMs, maxIntervalMs, soundPath, soundVolume, preventRepeatMs, initialDelayMs]);

  if (!activity) return null;

  const classType = activity.type === "plan" ? "plan" : activity.type === "deposit" ? "deposit" : "withdrawal";

  return (
    <div className={`single-wrapper ${className || ""}`} aria-live="polite" aria-atomic="true">
      <div className={`card ${classType} ${visible ? "enter" : "exit"}`} key={activity.id}>
        <img
          src={`/flags/${activity.countryCode}.svg`}
          alt={activity.country}
          className="flag"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/flags/OTHER.svg"; }}
        />
        <div className="text">
          <div className="main" title={activity.message}>{activity.message}</div>
          <div className="meta">{activity.type === "plan" ? activity.plan : `${activity.country} • ${activity.timeAgo}`}</div>
        </div>
      </div>

      <style jsx>{`
        .single-wrapper {
          position: fixed;
          left: 1rem;
          bottom: 1.25rem;
          z-index: 99999;
          pointer-events: none;
          max-width: 420px;
          width: auto;
        }

        .card {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: linear-gradient(135deg, rgba(11,47,107,0.97), rgba(20,37,75,0.95));
          color: #fff;
          padding: 1rem 1.3rem;
          border-radius: 24px;
          font-size: 0.96rem;
          box-shadow: 0 12px 32px rgba(11,47,107,0.35), 0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.08);
          transform-origin: left bottom;
          display: flex;
          align-items: center;
          min-width: 240px;
          max-width: 440px;
          pointer-events: none;
          transition: transform 380ms cubic-bezier(.22,.9,.35,1), opacity 380ms ease, box-shadow 380ms ease;
          opacity: 0;
          transform: translateY(10px) scale(0.98);
        }

        .card.enter {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .card.exit {
          opacity: 0;
          transform: translateY(10px) scale(0.98);
        }

        .flag {
          width: 28px;
          height: 20px;
          object-fit: cover;
          border-radius: 5px;
          flex-shrink: 0;
          box-shadow: 0 3px 8px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.25);
          border: 1px solid rgba(255,255,255,0.12);
        }

        .text { overflow: hidden; min-width: 0; flex: 1; }
        .main {
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
          letter-spacing: -0.01em;
          text-shadow: 0 1px 2px rgba(0,0,0,0.25);
        }
        .meta {
          font-size: 0.78rem;
          opacity: 0.82;
          margin-top: 3px;
          color: rgba(255,255,255,0.85);
          font-weight: 500;
        }

        .card.plan { 
          background: linear-gradient(135deg, rgba(37,99,235,0.96), rgba(29,78,216,0.94));
          box-shadow: 0 12px 32px rgba(37,99,235,0.4), 0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .card.deposit { 
          background: linear-gradient(135deg, rgba(5,150,105,0.96), rgba(4,120,87,0.94));
          box-shadow: 0 12px 32px rgba(5,150,105,0.4), 0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .card.withdrawal { 
          background: linear-gradient(135deg, rgba(220,38,38,0.96), rgba(185,28,28,0.94));
          box-shadow: 0 12px 32px rgba(220,38,38,0.35), 0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1);
        }

        @media (max-width: 640px) {
          .single-wrapper { left: 0.6rem; bottom: 0.9rem; max-width: 96vw; }
          .card { padding: 0.75rem 0.9rem; border-radius: 22px; font-size: 0.88rem; }
          .flag { width: 20px; height: 14px; }
          .main { font-size: 0.92rem; }
        }
      `}</style>
    </div>
  );
};

export default RecentActivitySingle;

function tryPlaySound(audio: HTMLAudioElement | null, preventRepeatMs: number, lastPlayedRef: React.MutableRefObject<number>) {
  if (!audio) return;
  const now = Date.now();
  if (now - lastPlayedRef.current < preventRepeatMs) return;
  lastPlayedRef.current = now;
  audio.currentTime = 0;
  const p = audio.play();
  if (p?.catch) p.catch(() => {});
}