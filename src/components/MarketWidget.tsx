"use client";

import { useEffect, useState } from "react";

type Coin = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: { price: number[] };
};

export default function MarketWidget() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  async function fetchMarket(signal?: AbortSignal) {
    try {
      const res = await fetch("/market-data?ids=bitcoin,ethereum", {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal,
      });

      if (!res.ok) {
        throw new Error(`Market request failed (${res.status})`);
      }

      const data = await res.json();
      setCoins(data);
      setUpdatedAt(new Date().toUTCString());
      setStatus("ready");
    } catch (err) {
      setStatus((prev) => (prev === "ready" ? "ready" : "error"));
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    fetchMarket(controller.signal);
    const interval = setInterval(() => fetchMarket(controller.signal), 120000); // auto-update
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  return (
    <section
      className="market-widget max-w-[620px] rounded-[24px] border border-white/10 bg-[#081633]/90 p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,.35)] backdrop-blur-xl sm:p-6"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div><p className="text-[10px] uppercase tracking-[0.22em] text-blue-200/60">Live reference frame</p><h3 className="mt-2 text-lg font-semibold tracking-tight">Market overview</h3></div>
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-blue-200"><span className="h-1.5 w-1.5 rounded-full bg-blue-300 shadow-[0_0_12px_#60a5fa]" /> Online</span>
      </div>

      {status === "loading" ? (
        <p className="text-sm text-gray-600">Loading live market data…</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-gray-600">
          Market data temporarily unavailable. Please try again shortly.
        </p>
      ) : null}

      {coins.map((coin) => {
        const prices = Array.isArray(coin?.sparkline_in_7d?.price) ? coin.sparkline_in_7d.price : [];
        if (!prices.length) return null;
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const range = Math.max(1e-9, max - min);

        const points = prices
          .map((p, i) => {
            const x = (i / prices.length) * 100;
            const y = 30 - ((p - min) / range) * 30;
            return `${x},${y}`;
          })
          .join(" ");

        return (
          <div
            key={coin.id}
            className="mb-3 flex items-center justify-between"
          >
            <div>
              <strong>{coin.symbol.toUpperCase()}</strong>{" "}
              <span className="text-gray-500">${coin.current_price.toLocaleString()}</span>
              <div
                className={`text-sm ${
                  coin.price_change_percentage_24h >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </div>
            </div>

            <svg width="100" height="30">
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
                points={points}
              />
            </svg>
          </div>
        );
      })}

      <div className="text-xs text-gray-500">
        Last updated: {updatedAt}
      </div>

      <div className="mt-2 text-xs">
        Source:{" "}
        <a
          href="https://www.coingecko.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600"
        >
          CoinGecko
        </a>
      </div>
    </section>
  );
}
