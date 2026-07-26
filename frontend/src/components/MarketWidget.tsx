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
      className="max-w-[520px] rounded-xl border border-gray-200 bg-white p-5"
    >
      <h3 className="mb-3 font-semibold">Market Overview</h3>

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
