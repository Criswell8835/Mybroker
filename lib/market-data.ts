export const DEMO_LABEL = "DEMO DATA";

export const DEMO_DISCLAIMER =
  "Figures on this page are illustrative demonstration data and do not represent live markets.";

export type MarketAsset = {
  id: string;
  symbol: string;
  name: string;
  pair: string;
  price: number;
  change24h: number;
  volume: string;
  market: string;
  high24h: number;
  low24h: number;
};

export type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export const marketAssets: MarketAsset[] = [
  {
    id: "btc",
    symbol: "BTC",
    name: "Bitcoin",
    pair: "BTC/USD",
    price: 104284.2,
    change24h: 2.84,
    volume: "28.4B",
    market: "Spot",
    high24h: 105112.0,
    low24h: 101348.0,
  },
  {
    id: "eth",
    symbol: "ETH",
    name: "Ethereum",
    pair: "ETH/USD",
    price: 3482.16,
    change24h: 1.42,
    volume: "12.1B",
    market: "Spot",
    high24h: 3528.4,
    low24h: 3391.2,
  },
  {
    id: "sol",
    symbol: "SOL",
    name: "Solana",
    pair: "SOL/USD",
    price: 178.4,
    change24h: 3.21,
    volume: "4.6B",
    market: "Spot",
    high24h: 181.9,
    low24h: 171.2,
  },
  {
    id: "bnb",
    symbol: "BNB",
    name: "BNB",
    pair: "BNB/USD",
    price: 612.08,
    change24h: -0.64,
    volume: "1.8B",
    market: "Spot",
    high24h: 624.5,
    low24h: 608.1,
  },
  {
    id: "xrp",
    symbol: "XRP",
    name: "XRP",
    pair: "XRP/USD",
    price: 2.18,
    change24h: 0.92,
    volume: "2.3B",
    market: "Spot",
    high24h: 2.24,
    low24h: 2.11,
  },
  {
    id: "doge",
    symbol: "DOGE",
    name: "Dogecoin",
    pair: "DOGE/USD",
    price: 0.1842,
    change24h: -1.15,
    volume: "980M",
    market: "Spot",
    high24h: 0.191,
    low24h: 0.181,
  },
];

export const tickerAssets = marketAssets;

export const tableAssets = marketAssets.filter((asset) => asset.id !== "doge");

function mulberry32(seed: number) {
  return function random() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateCandles(
  count: number,
  endPrice: number,
  change24h: number,
  seed: number,
): Candle[] {
  const random = mulberry32(seed);
  const startPrice = endPrice / (1 + change24h / 100);
  const candles: Candle[] = [];
  let price = startPrice;

  for (let i = 0; i < count; i += 1) {
    const progress = i / Math.max(count - 1, 1);
    const drift = (endPrice - startPrice) / count;
    const wave = Math.sin(progress * Math.PI * 3.1) * endPrice * 0.004;
    const noise = (random() - 0.48) * endPrice * 0.006;
    const open = price;
    const close = Math.max(endPrice * 0.92, open + drift + wave + noise);
    const high = Math.max(open, close) + random() * endPrice * 0.0035;
    const low = Math.min(open, close) - random() * endPrice * 0.0035;
    const volume = 0.35 + random() * 0.85 + (close > open ? 0.15 : 0);

    candles.push({ open, high, low, close, volume });
    price = close;
  }

  return candles;
}

export function generateEquity(
  count: number,
  end: number,
  changePct: number,
  seed: number,
): number[] {
  const random = mulberry32(seed);
  const start = end / (1 + changePct / 100);
  const points: number[] = [];
  let value = start;

  for (let i = 0; i < count; i += 1) {
    const progress = i / Math.max(count - 1, 1);
    const drift = (end - start) / count;
    const wave = Math.sin(progress * Math.PI * 1.7) * end * 0.006;
    value = Math.max(end * 0.88, value + drift + wave + (random() - 0.48) * end * 0.0045);
    points.push(value);
  }

  points[points.length - 1] = end;
  return points;
}

export const candleSets: Record<string, Candle[]> = {
  btc: generateCandles(56, 104284.2, 2.84, 104284),
  eth: generateCandles(56, 3482.16, 1.42, 3482),
  sol: generateCandles(56, 178.4, 3.21, 1784),
};

export const sparklineSets: Record<string, number[]> = Object.fromEntries(
  marketAssets.map((asset, index) => {
    const candles = generateCandles(18, asset.price, asset.change24h, 900 + index * 17);
    return [asset.id, candles.map((candle) => candle.close)];
  }),
);

export function formatPrice(value: number) {
  if (value < 1) {
    return `$${value.toFixed(4)}`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatChange(value: number) {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(2)}%`;
}

export const aiAnalysis = {
  momentum: "Strong",
  momentumDetail: "Momentum strengthening",
  sentiment: "Bullish",
  sentimentScore: 78,
  volatility: "Moderate",
  trend: "Uptrend",
  keyLevels: {
    resistance: 105400,
    support: 101850,
  },
};
