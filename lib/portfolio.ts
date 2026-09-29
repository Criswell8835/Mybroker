import { generateEquity } from "@/lib/market-data";

export const portfolioDemo = {
  id: "KV-84021",
  total: 48291.06,
  changeValue: 1284.2,
  changePct: 2.84,
  available: 4120,
  invested: 44171.06,
  cashPct: 8.5,
  risk: "Moderate",
  exposure: "Large-cap crypto",
  updated: "09:41 UTC",
  allocation: [
    { name: "Bitcoin", pct: 42, amount: 20282.24, tone: "rgba(232,92,36,0.92)" },
    { name: "Ethereum", pct: 26, amount: 12555.68, tone: "rgba(244,244,245,0.62)" },
    { name: "Solana", pct: 14, amount: 6760.75, tone: "rgba(244,244,245,0.34)" },
    { name: "Stablecoins", pct: 12, amount: 5794.93, tone: "rgba(200,16,46,0.55)" },
    { name: "Other Assets", pct: 6, amount: 2897.46, tone: "rgba(244,244,245,0.16)" },
  ],
  exposureBands: [
    { name: "Large cap", pct: 68 },
    { name: "Layer 1", pct: 18 },
    { name: "Cash & stables", pct: 12 },
    { name: "Other", pct: 2 },
  ],
  activity: [
    { time: "08:12", title: "Copy allocation reviewed", detail: "Strategy marketplace" },
    { time: "07:44", title: "Watchlist updated", detail: "ETH/USD added to desk" },
    { time: "07:02", title: "AI market readout", detail: "Momentum constructive" },
  ],
  watchlist: [
    { pair: "BTC/USD", price: "$104,284.20", change: "+2.84%" },
    { pair: "ETH/USD", price: "$3,482.16", change: "+1.42%" },
    { pair: "SOL/USD", price: "$178.40", change: "+3.21%" },
  ],
};

export type PortfolioRange = "1D" | "1W" | "1M" | "3M" | "1Y";

export const performanceByRange: Record<PortfolioRange, number[]> = {
  "1D": generateEquity(36, 48291.06, 2.84, 121),
  "1W": generateEquity(42, 48291.06, 4.1, 122),
  "1M": generateEquity(48, 48291.06, 6.4, 123),
  "3M": generateEquity(52, 48291.06, 9.2, 124),
  "1Y": generateEquity(56, 48291.06, 18.6, 125),
};
