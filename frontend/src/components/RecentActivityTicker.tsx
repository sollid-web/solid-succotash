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
  minIntervalMs?: number;
  maxIntervalMs?: number;
  soundPath?: string;
  soundVolume?: number;
  preventRepeatMs?: number;
}

// Concise country list with male-only sample names and controlled weights.
// Distribution can be tuned; includes Scotland (as part of UK/GB but labelled Scotland here).
const COUNTRIES = [
  { code: "SC", name: "Scotland", weight: 0.2, names: ["Callum", "Lewis", "Ewan", "Alistair", "Gavin", "Hamish", "Iain", "Ross"] },
  { code: "NO", name: "Norway", weight: 0.2, names: ["Soren", "Erik", "Bjorn", "Rolf", "Per", "Torsten", "Olav"] },
  { code: "US", name: "United States", weight: 0.2, names: ["Brandon", "Marcus", "Tyler", "Joshua", "Daniel", "Nathan", "Justin"] },
  { code: "GB", name: "United Kingdom", weight: 0.1, names: ["Oliver", "Henry", "Jack", "Benjamin", "Charlie"] },
  { code: "DE", name: "Germany", weight: 0.08, names: ["Tobias", "Jonas", "Karl", "Franz"] },
  { code: "FR", name: "France", weight: 0.07, names: ["Antoine", "Laurent", "Nicolas", "Julien"] },
  { code: "SG", name: "Singapore", weight: 0.05, names: ["Wei", "Ming", "Arjun", "Kai"] },
  { code: "OTHER", name: "Other", weight: 0.1, names: ["Alex", "Sam", "Lee", "Max"] },
];

const DEFAULT_PLANS = ["Pioneer", "Vanguard", "Horizon", "Summit"];
// Concise amounts typical for business-level ticker
const AMOUNTS = [500, 1000, 2500, 5000, 10000, 25000, 50000];
const TIME_AGO_OPTIONS = ["just now", "moments ago", "1 min ago"];
let GLOBAL_ID = 1;

function pickWeightedCountry() {
  const total = COUNTRIES.reduce((s, c) => s + c.weight, 0);
  const r = Math.random() * total;
  let acc = 0;
  for (const c of COUNTRIES) {
    acc += c.weight;
    if (r <= acc) return c;
  }
  return COUNTRIES[COUNTRIES.length - 1];
}

function pickRandom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function generateRandomActivity(plans: string[], prev?: Activity | null): Activity {
  const country = pickWeightedCountry();
  const name = pickRandom(country.names);
  // Make transactions more common to match business spec
  const roll = Math.random();
  let type: ActivityType = roll < 0.7 ? "deposit" : roll < 0.9 ? "withdrawal" : "plan";
  let amount: number | undefined;
  let plan: string | undefined;
  let message: string;

  if (type === "plan") {
    plan = pickRandom(plans);
    message = `${name} (${country.name}) started ${plan}`;
  } else {
    amount = pickRandom(AMOUNTS);
    const action = type === "deposit" ? "deposited" : "withdrew";
    // concise business-level message
    message = `${name} (${country.name}) ${action} $${amount.toLocaleString()}`;
  }

  const timeAgo = pickRandom(TIME_AGO_OPTIONS);
  return {
    id: GLOBAL_ID++,
    name,
    country: country.name,
    countryCode: country.code,
    type,
    amount,
    plan,
    message,
    timeAgo,
  };
}

const RecentActivityTicker: React.FC<Props> = ({
  plans = DEFAULT_PLANS,
  // Default interval between 30s and 60s per request
  minIntervalMs = 30000,
  maxIntervalMs = 60000,
  soundPath = "/sounds/chime.wav",
  soundVolume = 0.35,
  preventRepeatMs = 2000,
}) => {
  const [activity, setActivity] = useState<Activity | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayedRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(soundPath);
    audioRef.current.volume = soundVolume;
    const first = generateRandomActivity(plans, null);
    setActivity(first);
    const scheduleNext = (prev: Activity | null) => {
      const delay = Math.round(randBetween(minIntervalMs, maxIntervalMs));
      timeoutRef.current = window.setTimeout(() => {
        const next = generateRandomActivity(plans, prev || undefined);
        setActivity(next);
        tryPlaySound(audioRef.current, preventRepeatMs, lastPlayedRef);
        scheduleNext(next);
      }, delay);
    };
    scheduleNext(first);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [plans, minIntervalMs, maxIntervalMs, soundPath, soundVolume, preventRepeatMs]);

  if (!activity) return null;
  const classType =
    activity.type === "plan"
      ? "plan"
      : activity.type === "deposit"
      ? "deposit"
      : "withdrawal";
  return (
    <div className="wrapper">
      <div key={activity.id} className={`card ${classType}`}>
        <img
          src={`/flags/${activity.countryCode}.svg`}
          alt={activity.country}
          className="flag"
        />
        <div className="text">
          <div className="main">{activity.message}</div>
          <div className="meta">
            {activity.type === "plan"
              ? activity.plan
              : `${activity.country} • ${activity.timeAgo}`}
          </div>
        </div>
      </div>
      <style jsx>{`
        .wrapper {
          position: fixed;
          left: 1rem;
          bottom: 1rem;
          max-width: 420px;
          z-index: 99999;
          pointer-events: none;
        }
        .card {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(15, 15, 22, 0.94);
          color: #fff;
          padding: 0.75rem 1rem;
          border-radius: 30px;
          font-size: 0.9rem;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(6px);
          animation: fadeIn 0.35s ease-out;
        }
        .flag {
          width: 24px;
          height: 16px;
          object-fit: cover;
          border-radius: 2px;
        }
        .card.plan {
          background: linear-gradient(
            90deg,
            rgba(6, 22, 40, 0.95),
            rgba(8, 58, 80, 0.94)
          );
        }
        .main {
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .meta {
          font-size: 0.75rem;
          opacity: 0.8;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 600px) {
          .wrapper {
            left: 0.5rem;
            bottom: 0.5rem;
            max-width: 98vw;
          }
          .card {
            font-size: 0.8rem;
            padding: 0.5rem 0.7rem;
            border-radius: 22px;
          }
          .flag {
            width: 18px;
            height: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default RecentActivityTicker;

function tryPlaySound(
  audio: HTMLAudioElement | null,
  preventRepeatMs: number,
  lastPlayedRef: React.MutableRefObject<number>
) {
  if (!audio) return;
  const now = Date.now();
  if (now - lastPlayedRef.current < preventRepeatMs) return;
  lastPlayedRef.current = now;
  audio.currentTime = 0;
  const p = audio.play();
  if (p?.catch) p.catch(() => {});
}
