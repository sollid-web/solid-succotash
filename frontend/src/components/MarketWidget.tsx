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

  async function fetchMarket() {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets" +
          "?vs_currency=usd&ids=bitcoin,ethereum" +
          "&sparkline=true&price_change_percentage=24h"
      );

      const data = await res.json();
      setCoins(data);
      setUpdatedAt(new Date().toUTCString());
    } catch (err) {
      console.error("Market fetch failed", err);
    }
  }

  useEffect(() => {
    fetchMarket();
    const interval = setInterval(fetchMarket, 120000); // auto-update
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="max-w-[520px] rounded-xl border border-gray-200 bg-white p-5"
    >
      <h3 className="mb-3 font-semibold">Market Overview</h3>

      {coins.map((coin) => {
        const prices = coin.sparkline_in_7d.price;
        const min = Math.min(...prices);
        const max = Math.max(...prices);

        const points = prices
          .map((p, i) => {
            const x = (i / prices.length) * 100;
            const y = 30 - ((p - min) / (max - min)) * 30;
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
