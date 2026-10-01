export type PerformanceRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";

export type DashboardMarket = {
  id: string;
  pair: string;
  asset: string;
  price: number;
  change24h: number;
  high: number;
  low: number;
  volume: string;
  cap: string;
  spark: number[];
};

export const portfolioSummary = {
  total: 128450.24,
  available: 42680.1,
  invested: 85770.14,
  todayPnl: 2184.62,
  todayPnlPct: 1.72,
  totalPnl: 18420.55,
  totalPnlPct: 16.74,
};

export const performanceSeries: Record<
  PerformanceRange,
  { change: number; changePct: number; labels: string[]; points: number[] }
> = {
  "1D": {
    change: 2184.62,
    changePct: 1.72,
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
    points: [126265, 126410, 126180, 127040, 127620, 128450],
  },
  "1W": {
    change: 4860.18,
    changePct: 3.93,
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    points: [123590, 124120, 123840, 125210, 126040, 127180, 128450],
  },
  "1M": {
    change: 14820.42,
    changePct: 12.84,
    labels: ["W1", "W2", "W3", "W4"],
    points: [113630, 116240, 115480, 119920, 122410, 124860, 126540, 128450],
  },
  "3M": {
    change: 22140.55,
    changePct: 20.83,
    labels: ["Jun", "Jul", "Aug"],
    points: [106310, 109840, 108220, 114560, 118940, 121770, 125330, 128450],
  },
  "1Y": {
    change: 38420.11,
    changePct: 42.68,
    labels: ["Q1", "Q2", "Q3", "Q4"],
    points: [90030, 94880, 91240, 101550, 108420, 114880, 121260, 128450],
  },
  ALL: {
    change: 53450.24,
    changePct: 71.27,
    labels: ["2023", "2024", "2025", "2026"],
    points: [75000, 81240, 78660, 96440, 110280, 118640, 124910, 128450],
  },
};

export const allocation = [
  { symbol: "BTC", name: "Bitcoin", pct: 42, value: 53949.1 },
  { symbol: "ETH", name: "Ethereum", pct: 25, value: 32112.56 },
  { symbol: "SOL", name: "Solana", pct: 15, value: 19267.54 },
  { symbol: "USDT", name: "Tether", pct: 10, value: 12845.02 },
  { symbol: "Other", name: "Other", pct: 8, value: 10276.02 },
];

export const aiOverview = {
  strategy: "Momentum Alpha",
  asset: "BTC/USDT",
  allocation: 25000,
  todayPnl: 842.31,
  risk: "Moderate",
  positions: 3,
  spark: [22, 24, 23, 26, 25, 28, 27, 31, 30, 34],
};

export type AiRisk = "Low" | "Moderate" | "High";
export type AiStatus = "ACTIVE" | "PAUSED" | "STOPPED";

export type AiCatalogItem = {
  id: string;
  name: string;
  style: string;
  risk: AiRisk;
  frequency: string;
  assets: string[];
};

export const aiCatalog: AiCatalogItem[] = [
  { id: "momentum", name: "Momentum", style: "Follows sustained moves on liquid pairs.", risk: "Moderate", frequency: "Intraday", assets: ["BTC/USDT", "ETH/USDT", "SOL/USDT"] },
  { id: "trend", name: "Trend Following", style: "Stays with the higher-timeframe direction.", risk: "Moderate", frequency: "Swing", assets: ["BTC/USDT", "ETH/USDT", "BNB/USDT"] },
  { id: "neutral", name: "Market Neutral", style: "Keeps net exposure tighter across offsets.", risk: "Low", frequency: "Intraday", assets: ["BTC/USDT", "ETH/USDT"] },
  { id: "alpha", name: "Alpha", style: "Looks for relative strength inside the majors.", risk: "High", frequency: "Active", assets: ["SOL/USDT", "BNB/USDT", "XRP/USDT"] },
  { id: "adaptive", name: "Adaptive", style: "Shifts pace when realized range changes.", risk: "Moderate", frequency: "Mixed", assets: ["BTC/USDT", "ETH/USDT", "SOL/USDT", "XRP/USDT"] },
];

export type AiStrategyRecord = {
  id: string;
  name: string;
  style: string;
  asset: string;
  allocated: number;
  available: number;
  todayPnl: number;
  totalPnl: number;
  risk: AiRisk;
  status: AiStatus;
  winRate: number;
  maxPositionPct: number;
  stopLoss: string;
  maxDailyLoss: number;
  maxPositions: number;
  volatile: boolean;
};

export const aiStrategySeed: AiStrategyRecord[] = [
  { id: "momentum-alpha", name: "Momentum Alpha", style: "Momentum", asset: "BTC/USDT", allocated: 25000, available: 8420, todayPnl: 842.31, totalPnl: 2140.18, risk: "Moderate", status: "ACTIVE", winRate: 61, maxPositionPct: 25, stopLoss: "2.5%", maxDailyLoss: 750, maxPositions: 4, volatile: true },
  { id: "trend-matrix", name: "Trend Matrix", style: "Trend Following", asset: "ETH/USDT", allocated: 15000, available: 4220, todayPnl: 421.8, totalPnl: 980.44, risk: "Moderate", status: "ACTIVE", winRate: 58, maxPositionPct: 20, stopLoss: "3%", maxDailyLoss: 450, maxPositions: 3, volatile: false },
  { id: "alpha-core", name: "Alpha Core", style: "Alpha", asset: "SOL/USDT", allocated: 10000, available: 7800, todayPnl: 183.22, totalPnl: 410.06, risk: "Low", status: "PAUSED", winRate: 54, maxPositionPct: 15, stopLoss: "2%", maxDailyLoss: 250, maxPositions: 2, volatile: false },
];

export type AiPositionRecord = {
  id: string;
  strategyId: string;
  asset: string;
  side: "LONG" | "SHORT";
  entry: number;
  current: number;
  size: string;
  pnl: number;
  duration: string;
  opened: string;
  note: string;
};

export const aiPositions: AiPositionRecord[] = [
  { id: "p1", strategyId: "momentum-alpha", asset: "BTC/USDT", side: "LONG", entry: 105420, current: 106180, size: "0.12 BTC", pnl: 91.2, duration: "2h 14m", opened: "Today, 10:42", note: "Momentum held above the session range. Preview status only." },
  { id: "p2", strategyId: "momentum-alpha", asset: "BTC/USDT", side: "LONG", entry: 104880, current: 106180, size: "0.08 BTC", pnl: 104, duration: "4h 02m", opened: "Today, 08:54", note: "Added after the first push. Preview status only." },
  { id: "p3", strategyId: "momentum-alpha", asset: "BTC/USDT", side: "SHORT", entry: 106640, current: 106180, size: "0.04 BTC", pnl: 18.4, duration: "51m", opened: "Today, 12:05", note: "Small hedge against the open long. Preview status only." },
  { id: "p4", strategyId: "trend-matrix", asset: "ETH/USDT", side: "LONG", entry: 3410, current: 3482.16, size: "1.40 ETH", pnl: 101.02, duration: "6h 20m", opened: "Today, 06:36", note: "Trend filter stayed positive. Preview status only." },
  { id: "p5", strategyId: "trend-matrix", asset: "ETH/USDT", side: "LONG", entry: 3448, current: 3482.16, size: "0.80 ETH", pnl: 27.33, duration: "1h 48m", opened: "Today, 11:08", note: "Second clip inside the same direction. Preview status only." },
  { id: "p6", strategyId: "alpha-core", asset: "SOL/USDT", side: "LONG", entry: 172.4, current: 178.4, size: "18 SOL", pnl: 108, duration: "1d 3h", opened: "Yesterday, 14:10", note: "Paused with the strategy. Preview status only." },
];

export const aiEvents = [
  { id: "e1", strategyId: "momentum-alpha", time: "10:42", text: "AI opened BTC/USDT LONG" },
  { id: "e2", strategyId: "momentum-alpha", time: "10:18", text: "AI increased allocation" },
  { id: "e3", strategyId: "momentum-alpha", time: "09:51", text: "AI closed ETH/USDT position" },
  { id: "e4", strategyId: "momentum-alpha", time: "09:30", text: "AI reduced exposure due to risk threshold" },
  { id: "e5", strategyId: "trend-matrix", time: "11:08", text: "AI opened ETH/USDT LONG" },
  { id: "e6", strategyId: "trend-matrix", time: "09:12", text: "AI kept the trend filter on" },
  { id: "e7", strategyId: "alpha-core", time: "08:02", text: "AI paused after the daily loss guard" },
];

export type CopyTrader = {
  id: string;
  name: string;
  handle: string;
  style: string;
  rating: number;
  followers: string;
  roi30: number;
  roi90: number;
  winRate: number;
  risk: string;
  aum: string;
  spark: number[];
  trades: { time: string; text: string; pnl: string }[];
  positions: { asset: string; side: string; pnl: string }[];
};

export const copyTraders: CopyTrader[] = [
  { id: "cryptoking", name: "CryptoKing", handle: "@cryptoking", style: "Altcoin swing setups · high conviction", rating: 4.8, followers: "5,620", roi30: 98.3, roi90: 142.6, winRate: 72, risk: "Moderate", aum: "$4.2M", spark: [8, 10, 9, 14, 18, 16, 22, 28], trades: [{ time: "12:10", text: "Opened SOL/USDT", pnl: "+1.8%" }, { time: "09:40", text: "Closed AVAX/USDT", pnl: "+3.1%" }], positions: [{ asset: "SOL/USDT", side: "LONG", pnl: "+2.4%" }] },
  { id: "yuki", name: "YukiTrade", handle: "@yuki.trades", style: "Tokyo session · SOL and majors", rating: 4.9, followers: "3,842", roi30: 118.6, roi90: 164.2, winRate: 74, risk: "Moderate", aum: "$3.1M", spark: [6, 8, 12, 11, 16, 20, 24, 30], trades: [{ time: "11:02", text: "Opened BTC/USDT", pnl: "+0.6%" }], positions: [{ asset: "BTC/USDT", side: "LONG", pnl: "+0.9%" }, { asset: "SOL/USDT", side: "LONG", pnl: "+1.4%" }] },
  { id: "harbor", name: "Harbor Lane", handle: "@harbor.lane", style: "Conservative majors, smaller clips", rating: 4.6, followers: "2,104", roi30: 24.1, roi90: 38.4, winRate: 68, risk: "Low", aum: "$1.6M", spark: [10, 10, 11, 12, 12, 13, 14, 14], trades: [{ time: "08:15", text: "Reduced ETH/USDT", pnl: "+0.4%" }], positions: [{ asset: "ETH/USDT", side: "LONG", pnl: "+0.7%" }] },
  { id: "north", name: "North Desk", handle: "@north.desk", style: "Trend on BTC and ETH", rating: 4.7, followers: "4,310", roi30: 41.8, roi90: 73.2, winRate: 63, risk: "Moderate", aum: "$2.8M", spark: [9, 11, 10, 13, 15, 14, 17, 19], trades: [{ time: "10:22", text: "Added BTC/USDT", pnl: "+1.1%" }], positions: [{ asset: "BTC/USDT", side: "LONG", pnl: "+1.6%" }] },
  { id: "solstice", name: "Solstice", handle: "@solstice", style: "SOL with a wider swing band", rating: 4.5, followers: "1,890", roi30: 56.2, roi90: 81.4, winRate: 61, risk: "High", aum: "$980K", spark: [7, 12, 9, 15, 13, 18, 16, 21], trades: [{ time: "13:01", text: "Opened SOL/USDT", pnl: "-0.4%" }], positions: [{ asset: "SOL/USDT", side: "LONG", pnl: "+3.2%" }] },
  { id: "quiet", name: "Quiet Book", handle: "@quiet.book", style: "Low turnover, majors only", rating: 4.8, followers: "980", roi30: 12.4, roi90: 21.8, winRate: 70, risk: "Low", aum: "$740K", spark: [8, 8, 9, 9, 10, 10, 11, 11], trades: [{ time: "Yesterday", text: "Held ETH/USDT", pnl: "+0.3%" }], positions: [{ asset: "ETH/USDT", side: "LONG", pnl: "+0.5%" }] },
  { id: "range", name: "Range Atlas", handle: "@range.atlas", style: "Mean reversion inside ranges", rating: 4.4, followers: "1,540", roi30: 31.6, roi90: 44.9, winRate: 66, risk: "Moderate", aum: "$1.1M", spark: [12, 11, 13, 12, 14, 13, 15, 16], trades: [{ time: "07:48", text: "Closed BNB/USDT", pnl: "+1.2%" }], positions: [{ asset: "BNB/USDT", side: "SHORT", pnl: "+0.4%" }] },
  { id: "ember", name: "Ember", handle: "@ember.desk", style: "Momentum breakouts", rating: 4.6, followers: "2,760", roi30: 67.9, roi90: 96.1, winRate: 64, risk: "High", aum: "$1.9M", spark: [5, 9, 8, 14, 12, 18, 17, 23], trades: [{ time: "12:44", text: "Opened XRP/USDT", pnl: "+0.8%" }], positions: [{ asset: "XRP/USDT", side: "LONG", pnl: "+1.1%" }] },
];

export const subscriptionPreview = {
  planId: "pro" as const,
  status: "ACTIVE",
  nextBilling: "Oct 30, 2026",
};

export const copyStrategies = [
  {
    id: "atlas",
    name: "Atlas Momentum",
    initials: "AM",
    category: "Momentum",
    risk: "Moderate",
    result: "+18.42%",
    period: "30D",
    followers: "1,240",
    allocation: 8000,
    status: "Preview",
    spark: [12, 14, 13, 16, 18, 17, 21, 24],
    description: "A trend approach on liquid majors. Interface example only.",
  },
  {
    id: "reducer",
    name: "RiskReducer",
    initials: "RR",
    category: "Balanced",
    risk: "Balanced",
    result: "+14.87%",
    period: "30D",
    followers: "860",
    allocation: 6500,
    status: "Preview",
    spark: [10, 11, 12, 11, 13, 14, 15, 16],
    description: "Smaller swings and a lower allocation pace. Prototype profile.",
  },
  {
    id: "harbor",
    name: "Harbor",
    initials: "HB",
    category: "Conservative",
    risk: "Low",
    result: "+6.40%",
    period: "30D",
    followers: "410",
    allocation: 4200,
    status: "Preview",
    spark: [8, 8, 9, 9, 10, 10, 11, 11],
    description: "A slower allocation example. Not a live strategy.",
  },
  {
    id: "alpha",
    name: "Alpha Quant",
    initials: "AQ",
    category: "Alpha",
    risk: "Higher",
    result: "+22.31%",
    period: "30D",
    followers: "540",
    allocation: 9100,
    status: "Preview",
    spark: [9, 12, 11, 15, 14, 18, 17, 22],
    description: "A faster model with wider swings. Not a leaderboard entry.",
  },
];

export const markets: DashboardMarket[] = [
  { id: "btc", pair: "BTC/USDT", asset: "Bitcoin", price: 104284.2, change24h: 2.84, high: 106420, low: 101880, volume: "$28.4B", cap: "$2.06T", spark: [30, 32, 31, 34, 33, 36, 38, 37, 40] },
  { id: "eth", pair: "ETH/USDT", asset: "Ethereum", price: 3482.16, change24h: 1.42, high: 3560, low: 3394, volume: "$12.1B", cap: "$419B", spark: [22, 24, 23, 21, 25, 24, 27, 26, 28] },
  { id: "sol", pair: "SOL/USDT", asset: "Solana", price: 178.4, change24h: 3.21, high: 184.2, low: 169.8, volume: "$4.6B", cap: "$86B", spark: [12, 14, 13, 16, 15, 18, 17, 19, 21] },
  { id: "bnb", pair: "BNB/USDT", asset: "BNB", price: 612.08, change24h: -0.64, high: 624.4, low: 601.1, volume: "$1.8B", cap: "$89B", spark: [20, 19, 21, 18, 17, 18, 16, 17, 15] },
  { id: "xrp", pair: "XRP/USDT", asset: "XRP", price: 2.18, change24h: 0.92, high: 2.26, low: 2.09, volume: "$2.3B", cap: "$124B", spark: [8, 9, 8, 10, 11, 10, 12, 11, 13] },
  { id: "ada", pair: "ADA/USDT", asset: "Cardano", price: 0.74, change24h: -1.18, high: 0.77, low: 0.71, volume: "$640M", cap: "$26B", spark: [14, 13, 15, 12, 11, 12, 10, 11, 10] },
  { id: "avax", pair: "AVAX/USDT", asset: "Avalanche", price: 36.42, change24h: 2.05, high: 37.8, low: 34.9, volume: "$510M", cap: "$15B", spark: [9, 10, 9, 12, 11, 13, 14, 13, 15] },
  { id: "doge", pair: "DOGE/USDT", asset: "Dogecoin", price: 0.182, change24h: -2.44, high: 0.191, low: 0.176, volume: "$1.1B", cap: "$27B", spark: [16, 15, 14, 16, 13, 12, 13, 11, 10] },
];

export const watchlistSeed = markets;

export type DeskStatus = "Pending" | "Processing" | "Completed" | "Failed" | "Rejected";

export type DeskActivity = {
  id: string;
  kind: "Trade" | "Deposit" | "Withdrawal" | "AI Trading" | "Copy Trading" | "System";
  text: string;
  time: string;
  amount: string;
  status: DeskStatus;
};

export const activity: DeskActivity[] = [
  { id: "trade", kind: "Trade", text: "BTC/USDT ticket prepared", time: "2 minutes ago", amount: "0.02 BTC", status: "Completed" },
  { id: "ai", kind: "AI Trading", text: "Momentum Alpha marked active", time: "18 minutes ago", amount: "+$842.31", status: "Completed" },
  { id: "deposit", kind: "Deposit", text: "USDT deposit draft", time: "42 minutes ago", amount: "5,000 USDT", status: "Pending" },
  { id: "withdraw", kind: "Withdrawal", text: "ETH withdrawal draft", time: "3 hours ago", amount: "1.20 ETH", status: "Processing" },
  { id: "copy", kind: "Copy Trading", text: "Atlas allocation noted", time: "5 hours ago", amount: "$8,000", status: "Completed" },
  { id: "system", kind: "System", text: "Signed in on this browser", time: "1 hour ago", amount: "—", status: "Completed" },
];

export const holdings = [
  { symbol: "BTC", name: "Bitcoin", qty: 0.51732685, entry: 91240 },
  { symbol: "ETH", name: "Ethereum", qty: 9.222286, entry: 3120 },
  { symbol: "SOL", name: "Solana", qty: 107.99966, entry: 162.4 },
  { symbol: "USDT", name: "Tether", qty: 12845.02, entry: 1 },
];

export type DeskTransaction = {
  id: string;
  date: string;
  type: DeskActivity["kind"];
  asset: string;
  amount: string;
  status: DeskStatus;
  reference: string;
};

export const transactions: DeskTransaction[] = [
  { id: "t1", date: "2026-09-30T16:12:00", type: "Trade", asset: "BTC/USDT", amount: "0.02 BTC", status: "Completed", reference: "PV-20418" },
  { id: "t2", date: "2026-09-30T15:40:00", type: "AI Trading", asset: "BTC/USDT", amount: "+$842.31", status: "Completed", reference: "PV-20402" },
  { id: "t3", date: "2026-09-30T14:05:00", type: "Deposit", asset: "USDT", amount: "5,000 USDT", status: "Pending", reference: "PV-20388" },
  { id: "t4", date: "2026-09-29T11:20:00", type: "Withdrawal", asset: "ETH", amount: "1.20 ETH", status: "Processing", reference: "PV-20311" },
  { id: "t5", date: "2026-09-28T09:02:00", type: "Copy Trading", asset: "USD", amount: "$8,000.00", status: "Completed", reference: "PV-20240" },
  { id: "t6", date: "2026-09-21T18:44:00", type: "Deposit", asset: "BTC", amount: "0.15 BTC", status: "Rejected", reference: "PV-19802" },
  { id: "t7", date: "2026-09-18T08:15:00", type: "Withdrawal", asset: "SOL", amount: "12 SOL", status: "Failed", reference: "PV-19610" },
];

export const alertSeed = [
  { id: "a1", kind: "Price Alert", asset: "BTC/USDT", trigger: "Above 110,000", status: "Armed" as const },
  { id: "a2", kind: "Portfolio Alert", asset: "ETH", trigger: "Allocation above 30%", status: "Armed" as const },
  { id: "a3", kind: "AI Trading Alert", asset: "BTC/USDT", trigger: "Strategy paused", status: "Paused" as const },
];

export const alertKinds = [
  "Price Alert",
  "Market Alert",
  "Portfolio Alert",
  "AI Trading Alert",
  "Copy Trading Alert",
  "Deposit Alert",
  "Withdrawal Alert",
];

export const depositAssets = [
  { symbol: "BTC", name: "Bitcoin", networks: ["Bitcoin"] },
  { symbol: "ETH", name: "Ethereum", networks: ["Ethereum"] },
  { symbol: "USDT", name: "Tether", networks: ["Ethereum", "Tron"] },
  { symbol: "SOL", name: "Solana", networks: ["Solana"] },
  { symbol: "USDC", name: "USD Coin", networks: ["Ethereum", "Solana"] },
];

export const previewAddress = "PREVIEW-NOT-A-WALLET";

export type ChartRange = "1H" | "4H" | "1D" | "1W" | "1M" | "1Y";

export type Candle = { t: string; o: number; h: number; l: number; c: number; v: number };

const chartPattern: Record<ChartRange, number[]> = {
  "1H": [0.4, -0.2, 0.6, 0.1, -0.5, 0.8, -0.3, 0.5, 0.2, 0.7, -0.4, 0.3],
  "4H": [0.8, -1.1, 0.4, 1.4, -0.6, 0.9, 1.2, -0.3, 0.7, 1.1],
  "1D": [1.2, -0.8, 1.6, 0.4, -1.4, 2.1, -0.5, 1.3, 0.9, 1.8, -0.7, 1.1],
  "1W": [2.4, -1.2, 3.1, 1.4, -2.2, 2.8, 1.1, 3.4],
  "1M": [3.2, -1.8, 4.1, 2.2, -2.6, 5.1, 1.4, 3.8],
  "1Y": [6, -4, 8, 3, -5, 9, 4, 7],
};

const chartLabels: Record<ChartRange, string[]> = {
  "1H": ["08:00", "08:05", "08:10", "08:15", "08:20", "08:25", "08:30", "08:35", "08:40", "08:45", "08:50", "08:55"],
  "4H": ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "00:00", "04:00", "08:00", "12:00"],
  "1D": ["Sep 19", "Sep 20", "Sep 21", "Sep 22", "Sep 23", "Sep 24", "Sep 25", "Sep 26", "Sep 27", "Sep 28", "Sep 29", "Sep 30"],
  "1W": ["Aug 4", "Aug 11", "Aug 18", "Aug 25", "Sep 1", "Sep 8", "Sep 15", "Sep 22"],
  "1M": ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  "1Y": ["2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
};

export function buildCandles(base: number, range: ChartRange): Candle[] {
  const steps = chartPattern[range];
  const labels = chartLabels[range];
  let price = base * 0.94;
  return steps.map((step, index) => {
    const move = base * step * 0.004;
    const open = price;
    const close = Math.max(base * 0.02, price + move);
    const high = Math.max(open, close) + Math.abs(move) * 0.35;
    const low = Math.min(open, close) - Math.abs(move) * 0.28;
    price = close;
    return { t: labels[index] ?? String(index), o: open, h: high, l: low, c: close, v: 18 + Math.abs(step) * 12 };
  });
}

export function quote(symbol: string) {
  if (symbol === "USDT") return { price: 1, change24h: 0, spark: [1, 1, 1, 1, 1, 1] };
  const market = markets.find((item) => item.pair.startsWith(`${symbol}/`));
  return { price: market?.price ?? 0, change24h: market?.change24h ?? 0, spark: market?.spark ?? [] };
}

export function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

export function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatSignedUsd(value: number) {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${formatUsd(value)}`;
}

export function formatPct(value: number) {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(2)}%`;
}

export function formatPrice(value: number) {
  if (value >= 1000) return formatUsd(value);
  if (value >= 1) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}
