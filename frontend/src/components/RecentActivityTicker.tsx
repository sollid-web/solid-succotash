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

const COUNTRIES = [
  { code: "NO", name: "Norway", weight: 0.25, names: ["Matthew", "Olav", "Soren", "Ingrid", "Lars", "Kari", "Erik", "Astrid", "Magnus", "Freya", "Bjorn", "Sigrid"] },
  { code: "US", name: "United States", weight: 0.25, names: ["Sonya", "James", "Alicia", "Michael", "Laura", "Kevin", "Jessica", "David", "Sarah", "Robert", "Emily", "Christopher"] },
  { code: "GB", name: "United Kingdom", weight: 0.25, names: ["Kenneth", "Harry", "Amelia", "Olivia", "George", "Chloe", "William", "Charlotte", "Thomas", "Sophie", "James", "Isabella"] },
  { code: "DE", name: "Germany", weight: 0.15, names: ["Lukas", "Mia", "Leon", "Hannah", "Felix", "Emma", "Maximilian", "Sophia", "Alexander", "Lena", "Noah", "Lea"] },
  { code: "CA", name: "Canada", weight: 0.1, names: ["Jacob", "Emma", "Ethan", "Olivia", "Alexander", "Ava", "William", "Isabella", "James", "Sophia", "Benjamin", "Charlotte"] }
];

const DEFAULT_PLANS = ["Pioneer", "Vanguard", "Horizon", "Summit"];
const AMOUNTS = [150, 200, 250, 300, 350, 400, 450, 500, 600, 750, 850, 1000, 1200, 1500, 1800, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 7000, 7500, 8000, 9000, 10000, 12000, 15000, 18000, 20000, 25000];
const TIME_AGO_OPTIONS = ["just now", "a few seconds ago", "30 seconds ago", "1 min ago", "2 mins ago", "3 mins ago", "5 mins ago", "a moment ago"];
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
  const roll = Math.random();
  let type: ActivityType;
  if (roll < 0.15) type = "plan";
  else if (roll < 0.35) type = "withdrawal";
  else type = "deposit";
  let amount: number | undefined;
  let plan: string | undefined;
  let message: string;
  if (type === "deposit") {
    amount = pickRandom(AMOUNTS);
    const depositActions = ["deposited", "funded their account with", "added", "transferred", "invested"];
    message = `${name} from ${country.name} just ${pickRandom(depositActions)} $${amount.toLocaleString()}`;
  } else if (type === "withdrawal") {
    amount = pickRandom(AMOUNTS);
    const withdrawalActions = ["withdrew", "requested payout of", "cashed out", "transferred out", "claimed"];
    message = `${name} from ${country.name} just ${pickRandom(withdrawalActions)} $${amount.toLocaleString()}`;
  } else {
    plan = pickRandom(plans);
    const verbs = ["joined", "migrated to", "upgraded to", "switched to", "enrolled in", "activated", "selected", "chose", "invested in", "started with"];
    message = `${name} ${pickRandom(verbs)} ${plan}`;
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
    timeAgo
  };
}

const RecentActivityTicker: React.FC<Props> = ({
  plans = DEFAULT_PLANS,
  minIntervalMs = 8000,
  maxIntervalMs = 15000,
  soundPath = "/sounds/chime.wav",
  soundVolume = 0.35,
  preventRepeatMs = 2000
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
