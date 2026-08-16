"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

type CampaignAnnouncement = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  body: string;
  cta_label: string;
  cta_url: string;
  publish_at: string;
  expires_at: string | null;
  is_published: boolean;
  is_live: boolean;
};

export default function CampaignsPage() {
  const [items, setItems] = useState<CampaignAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadCampaigns = async () => {
      try {
        const response = await apiFetch("/api/campaigns/");
        const data = await response.json();
        if (!active) return;

        if (!response.ok) {
          setError(data?.detail || data?.error || "Unable to load campaigns.");
          return;
        }

        setItems(Array.isArray(data) ? data : data.results || []);
      } catch {
        if (active) setError("Network error while loading campaigns.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadCampaigns();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(0,168,150,0.22),transparent_38%),linear-gradient(180deg,#08101f_0%,#0c1831_100%)] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#00c9b1]">Campaigns</p>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">Live offers, launches, and product updates.</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
            A simple public surface for campaign announcements. Add or retire items in Django admin without changing the financial workflows.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        {loading ? (
          <div className="text-white/70">Loading campaigns...</div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-200">{error}</div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white/70">No campaigns are live right now.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-200">
                    {item.is_live ? "Live" : "Scheduled"}
                  </span>
                  <span className="text-xs text-white/45">{new Date(item.publish_at).toLocaleDateString()}</span>
                </div>
                <h2 className="mt-5 text-2xl font-bold tracking-tight">{item.title}</h2>
                {item.summary ? <p className="mt-3 text-sm leading-6 text-white/70">{item.summary}</p> : null}
                {item.body ? <p className="mt-4 text-sm leading-6 text-white/60 whitespace-pre-line">{item.body}</p> : null}
                {item.cta_label && item.cta_url ? (
                  <div className="mt-6">
                    <Link
                      href={item.cta_url}
                      className="inline-flex items-center rounded-full bg-[#00a896] px-4 py-2 text-sm font-semibold text-[#04111c] transition hover:bg-[#00c9b1]"
                    >
                      {item.cta_label}
                    </Link>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}