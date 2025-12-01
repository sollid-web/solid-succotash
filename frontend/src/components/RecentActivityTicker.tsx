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
  count?: number; // how many rolling activities to keep / show
}

// Countries with combined-gender name pools
const COUNTRIES = [
  {
    code: "SC",
    name: "Scotland",
    weight: 0.12,
    names: [
      // male
      "Callum",
      "Lewis",
      "Ewan",
      "Alistair",
      "Gavin",
      "Hamish",
      "Iain",
      "Ross",
      "Finlay",
      "Duncan",
      // female
      "Isla",
      "Freya",
      "Eilidh",
      "Skye",
      "Ailsa",
      "Mhairi",
    ],
  },
  {
    code: "NO",
    name: "Norway",
    weight: 0.08,
    names: [
      // male
      "Soren",
      "Erik",
      "Bjorn",
      "Rolf",
      "Per",
      "Torsten",
      "Olav",
      "Leif",
      "Magnus",
      // female
      "Ingrid",
      "Astrid",
      "Liv",
      "Kari",
      "Sigrid",
      "Helene",
    ],
  },
  {
    code: "US",
    name: "United States",
    weight: 0.18,
    names: [
      // male
      "Brandon",
      "Marcus",
      "Tyler",
      "Joshua",
      "Daniel",
      "Nathan",
      "Justin",
      "Ethan",
      "Samuel",
      "Carlos",
      "Derek",
      // female
      "Emily",
      "Sarah",
      "Jessica",
      "Ashley",
      "Brittany",
      "Emma",
      "Olivia",
      "Sophia",
      "Hannah",
    ],
  },
  {
    code: "GB",
    name: "United Kingdom",
    weight: 0.12,
    names: [
      // male
      "Oliver",
      "Henry",
      "Jack",
      "Benjamin",
      "Charlie",
      "Theo",
      "Liam",
      "Freddie",
      // female
      "Amelia",
      "Emily",
      "Grace",
      "Sophie",
      "Chloe",
      "Lily",
      "Mia",
      "Victoria",
    ],
  },
  {
    code: "DE",
    name: "Germany",
    weight: 0.07,
    names: [
      // male
      "Tobias",
      "Jonas",
      "Karl",
      "Franz",
      "Lukas",
      "Matthias",
      // female
      "Anna",
      "Julia",
      "Lena",
      "Sophie",
      "Emma",
      "Katharina",
    ],
  },
  {
    code: "FR",
    name: "France",
    weight: 0.06,
    names: [
      // male
      "Antoine",
      "Laurent",
      "Nicolas",
      "Julien",
      "Pierre",
      // female
      "Camille",
      "Clara",
      "Léa",
      "Amélie",
      "Chloé",
      "Manon",
    ],
  },
  {
    code: "SG",
    name: "Singapore",
    weight: 0.04,
    names: [
      // male
      "Wei",
      "Ming",
      "Arjun",
      "Kai",
      "Hao",
      // female
      "Li Na",
      "Mei",
      "Jia",
      "Ananya",
      "Siti",
      "Hema",
    ],
  },
  {
    code: "IN",
    name: "India",
    weight: 0.07,
    names: [
      // male
      "Amit",
      "Ravi",
      "Sahil",
      "Arjun",
      "Karan",
      "Vikram",
      // female
      "Priya",
      "Aisha",
      "Neha",
      "Divya",
      "Riya",
      "Anjali",
    ],
  },
  {
    code: "NG",
    name: "Nigeria",
    weight: 0.06,
    names: [
      // male
      "Chinedu",
      "Emeka",
      "Tunde",
      "Kelechi",
      "Ifeanyi",
      // female
      "Ada",
      "Chioma",
      "Amara",
      "Blessing",
      "Onyinye",
      "Chisom",
    ],
  },
  {
    code: "ZA",
    name: "South Africa",
    weight: 0.04,
    names: [
      // male
      "Thabo",
      "Sipho",
      "Lerato",
      "Jabu",
      // female
      "Naledi",
      "Zinhle",
      "Thandi",
      "Ayanda",
      "Zanele",
    ],
  },
  {
    code: "CA",
    name: "Canada",
    weight: 0.03,
    names: [
      // male
      "Liam",
      "Noah",
      "Ethan",
      "Lucas",
      // female
      "Ava",
      "Charlotte",
      "Ella",
      "Harper",
      "Emily",
    ],
  },
  {
    code: "AU",
    name: "Australia",
    weight: 0.03,
    names: [
      // male
      "Jack",
      "Oliver",
      "Connor",
      "Henry",
      // female
      "Charlotte",
      "Matilda",
      "Ruby",
      "Isla",
      "Evie",
    ],
  },
  {
    code: "OTHER",
    name: "Other",
    weight: 0.08,
    names: [
      // male
      "Alex",
      "Sam",
      "Lee",
      "Max",
      "Robin",
      "Jordan",
      "Taylor",
      // female
      "Sarah",
      "Mia",
      "Zoe",
      "Ada",
      "Layla",
      "Hope",
      "Naomi",
    ],
  },
];

const DEFAULT_PLANS = ["Pioneer", "Vanguard", "Horizon", "Summit", "Retirement", "VIP"];

const AMOUNTS = [
  100, 250, 500, 750, 1000, 1250, 2500, 5000, 7500, 10000,
  15000, 20000, 25000, 35000, 50000, 75000, 100000,
];

const TIME_AGO_OPTIONS = ["just now", "moments ago", "1 min ago", "2 mins ago", "5 mins ago"];

let GLOBAL_ID = Date.now() % 1000000;

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

function generateRandomActivity(plans: string[]): Activity {
  const country = pickWeightedCountry();
  const name = pickRandom(country.names);
  const roll = Math.random();
  const type: ActivityType = roll < 0.7 ? "deposit" : roll < 0.9 ? "withdrawal" : "plan";
  let amount: number | undefined;
  let plan: string | undefined;
  let message: string;

  if (type === "plan") {
    plan = pickRandom(plans);
    message = `${name} (${country.name}) started ${plan}`;
  } else {
    amount = pickRandom(AMOUNTS);
    const action = type === "deposit" ? "deposited" : "withdrew";
    message = `${name} (${country.name}) ${action} $${amount.toLocaleString()}`;
  }

  const timeAgo = pickRandom(TIME_AGO_OPTIONS);
  return {
    id: ++GLOBAL_ID,
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
  minIntervalMs = 30000,
  maxIntervalMs = 60000,
  soundPath = "/sounds/chime.wav",
  soundVolume = 0.35,
  preventRepeatMs = 2000,
  count = 20,
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayedRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);
  const recentMessagesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    audioRef.current = new Audio(soundPath);
    audioRef.current.volume = soundVolume;

    const initial: Activity[] = [];
    const recent = recentMessagesRef.current;
    // seed initial activities
    while (initial.length < count) {
      const next = generateRandomActivity(plans);
      if (recent.has(next.message)) continue;
      recent.add(next.message);
      initial.push(next);
    }
    if (recent.size > count * 3) {
      recent.clear();
      initial.forEach((a) => recent.add(a.message));
    }
    setActivities(initial);

    const scheduleNext = () => {
      const delay = Math.round(randBetween(minIntervalMs, maxIntervalMs));
      timeoutRef.current = window.setTimeout(() => {
        let attempts = 0;
        let next = generateRandomActivity(plans);
        while (recent.has(next.message) && attempts < 8) {
          next = generateRandomActivity(plans);
          attempts++;
        }

        setActivities((prev) => {
          const nextArr = [next, ...prev];
          const trimmed = nextArr.slice(0, count);
          recent.add(next.message);
          if (recent.size > count * 3) {
            recent.clear();
            trimmed.forEach((a) => recent.add(a.message));
          }
          return trimmed;
        });

        tryPlaySound(audioRef.current, preventRepeatMs, lastPlayedRef);
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plans, minIntervalMs, maxIntervalMs, soundPath, soundVolume, preventRepeatMs, count]);

  if (!activities.length) return null;

  return (
    <div className="wrapper" aria-live="polite">
      <div className="stack">
        {activities.map((activity) => {
          const classType =
            activity.type === "plan" ? "plan" : activity.type === "deposit" ? "deposit" : "withdrawal";
          return (
            <div key={activity.id} className={`card ${classType}`}>
              <img
                src={`/flags/${activity.countryCode}.svg`}
                alt={activity.country}
                className="flag"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/flags/OTHER.svg";
                }}
              />
              <div className="text">
                <div className="main" title={activity.message}>
                  {activity.message}
                </div>
                <div className="meta">
                  {activity.type === "plan" ? activity.plan : `${activity.country} • ${activity.timeAgo}`}
                </div>
              </div>
            </div>
          );
        })}
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
        .stack {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .card {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(15, 15, 22, 0.94);
          color: #fff;
          padding: 0.6rem 0.9rem;
          border-radius: 20px;
          font-size: 0.85rem;
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(6px);
          transform-origin: left bottom;
          animation: slideIn 0.28s ease-out;
          pointer-events: none;
        }
        .flag {
          width: 22px;
          height: 14px;
          object-fit: cover;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .card.plan {
          background: linear-gradient(90deg, rgba(6,22,40,0.95), rgba(8,58,80,0.94));
        }
        .main {
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .meta {
          font-size: 0.72rem;
          opacity: 0.8;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 600px) {
          .wrapper {
            left: 0.6rem;
            bottom: 0.6rem;
            max-width: 96vw;
          }
          .card {
            font-size: 0.78rem;
            padding: 0.45rem 0.6rem;
            border-radius: 18px;
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
