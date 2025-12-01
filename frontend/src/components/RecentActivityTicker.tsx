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

// --- Combined-gender country pool ---
const COUNTRIES = [
  { code: "SC", name: "Scotland", weight: 0.12, names: ["Callum","Lewis","Ewan","Alistair","Gavin","Hamish","Iain","Ross","Finlay","Duncan","Isla","Freya","Eilidh","Skye","Ailsa","Mhairi"] },
  { code: "NO", name: "Norway", weight: 0.08, names: ["Soren","Erik","Bjorn","Rolf","Per","Torsten","Olav","Leif","Magnus","Ingrid","Astrid","Liv","Kari","Sigrid","Helene"] },
  { code: "US", name: "United States", weight: 0.18, names: ["Brandon","Marcus","Tyler","Joshua","Daniel","Nathan","Justin","Ethan","Samuel","Carlos","Derek","Emily","Sarah","Jessica","Ashley","Brittany","Emma","Olivia","Sophia","Hannah"] },
  { code: "GB", name: "United Kingdom", weight: 0.12, names: ["Oliver","Henry","Jack","Benjamin","Charlie","Theo","Liam","Freddie","Amelia","Emily","Grace","Sophie","Chloe","Lily","Mia","Victoria"] },
  { code: "DE", name: "Germany", weight: 0.07, names: ["Tobias","Jonas","Karl","Franz","Lukas","Matthias","Anna","Julia","Lena","Sophie","Emma","Katharina"] },
  { code: "FR", name: "France", weight: 0.06, names: ["Antoine","Laurent","Nicolas","Julien","Pierre","Camille","Clara","Léa","Amélie","Chloé","Manon"] },
  { code: "SG", name: "Singapore", weight: 0.04, names: ["Wei","Ming","Arjun","Kai","Hao","Li Na","Mei","Jia","Ananya","Siti","Hema"] },
  { code: "IN", name: "India", weight: 0.07, names: ["Amit","Ravi","Sahil","Arjun","Karan","Vikram","Priya","Aisha","Neha","Divya","Riya","Anjali"] },
  { code: "ZA", name: "South Africa", weight: 0.04, names: ["Thabo","Sipho","Lerato","Jabu","Naledi","Zinhle","Thandi","Ayanda","Zanele"] },
  { code: "CA", name: "Canada", weight: 0.03, names: ["Liam","Noah","Ethan","Lucas","Ava","Charlotte","Ella","Harper","Emily"] },
  { code: "AU", name: "Australia", weight: 0.03, names: ["Jack","Oliver","Connor","Henry","Charlotte","Matilda","Ruby","Isla","Evie"] },
  { code: "OTHER", name: "Other", weight: 0.08, names: ["Alex","Sam","Lee","Max","Robin","Jordan","Taylor","Sarah","Mia","Zoe","Ada","Layla","Hope","Naomi"] },
];

const DEFAULT_PLANS = ["Pioneer", "Vanguard", "Horizon", "Summit", "Retirement", "VIP"];
const AMOUNTS = [100,250,500,750,1000,1250,2500,5000,7500,10000,15000,20000,25000,35000,50000,75000,100000];
const TIME_AGO_OPTIONS = ["just now","moments ago","1 min ago","2 mins ago","5 mins ago"];

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
          gap: 0.7rem;
          background: linear-gradient(180deg, rgba(16,16,20,0.96), rgba(10,10,14,0.95));
          color: #fff;
          padding: 0.9rem 1.1rem;
          border-radius: 28px;
          font-size: 0.95rem;
          box-shadow: 0 20px 40px rgba(2,6,23,0.55), inset 0 1px 0 rgba(255,255,255,0.02);
          backdrop-filter: blur(8px);
          transform-origin: left bottom;
          display: flex;
          align-items: center;
          min-width: 220px;
          max-width: 420px;
          pointer-events: none;
          transition: transform 420ms cubic-bezier(.22,.9,.35,1), opacity 420ms ease;
          opacity: 0;
          transform: translateY(8px) scale(0.995);
        }

        .card.enter {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .card.exit {
          opacity: 0;
          transform: translateY(8px) scale(0.995);
        }

        .flag {
          width: 26px;
          height: 18px;
          object-fit: cover;
          border-radius: 3px;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(0,0,0,0.45);
        }

        .text { overflow: hidden; min-width: 0; }
        .main {
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: calc(100% - 40px);
        }
        .meta {
          font-size: 0.75rem;
          opacity: 0.8;
          margin-top: 4px;
        }

        .card.plan { background: linear-gradient(90deg, rgba(5,28,48,0.96), rgba(7,65,85,0.96)); }
        .card.deposit { /* default dark */ }
        .card.withdrawal { background: linear-gradient(90deg, rgba(36,16,16,0.96), rgba(48,18,18,0.95)); }

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