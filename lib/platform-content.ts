export type PlatformStat = {
  id: string;
  figure: string;
  countTo?: number;
  label: string;
};

export const platformStats: PlatformStat[] = [
  { id: "access", figure: "24/7", countTo: 24, label: "Market access" },
  { id: "pairs", figure: "5", countTo: 5, label: "Featured USDT pairs" },
  { id: "paths", figure: "2", countTo: 2, label: "Strategy paths" },
  { id: "desk", figure: "1", countTo: 1, label: "Trading desk" },
];

export type Offer = {
  index: string;
  title: string;
  text: string;
  to?: string;
  cta?: string;
};

export const platformOffers: Offer[] = [
  {
    index: "01",
    title: "AI Trading",
    text: "Configure a strategy, select an asset, define risk, and activate a session you can pause.",
    to: "/ai-trading",
    cta: "Explore AI Trading",
  },
  {
    index: "02",
    title: "Copy Trading",
    text: "Review strategy approaches and follow one after an account exists.",
    to: "/copy-trading",
    cta: "Explore Copy Trading",
  },
  {
    index: "03",
    title: "Crypto Markets",
    text: "Read featured markets with price, movement, and chart context.",
    to: "/markets",
    cta: "Explore Markets",
  },
  {
    index: "04",
    title: "Portfolio Management",
    text: "Allocation, balances, and activity belong in one account view.",
  },
  {
    index: "05",
    title: "Market Intelligence",
    text: "Trend, momentum, volatility, and sentiment sit beside the chart.",
  },
  {
    index: "06",
    title: "Trading Tools",
    text: "Charts, watchlists, and alerts are organized as desk tools, not a separate product.",
  },
];

export const whyPoints = [
  {
    index: "01",
    title: "Built around the market",
    text: "Price, range, and movement stay in front of the decision.",
  },
  {
    index: "02",
    title: "Trade with more control",
    text: "Configure a strategy, set risk, and monitor the position from one desk.",
  },
  {
    index: "03",
    title: "One platform. Multiple strategies.",
    text: "AI Trading, copy trading, markets, and portfolio tools share the same environment.",
  },
  {
    index: "04",
    title: "Designed for serious traders",
    text: "A quiet interface, detailed market information, and a professional trading layout.",
  },
];

export type ServiceItem = {
  id: string;
  title: string;
  text: string;
  points: string[];
  to: string;
  cta: string;
};

export const services: ServiceItem[] = [
  {
    id: "ai",
    title: "AI Trading",
    text: "A session for an asset, a strategy, and the risk limits you accept before it is active.",
    points: ["Choose the market", "Set the strategy", "Define risk", "Pause or stop"],
    to: "/signup",
    cta: "Create Account",
  },
  {
    id: "copy",
    title: "Copy Trading",
    text: "Review an approach, then follow it from an account. Public profiles on this site are interface examples.",
    points: ["Read the strategy", "Compare risk", "Allocate", "Monitor the relationship"],
    to: "/signup",
    cta: "Create Account",
  },
  {
    id: "markets",
    title: "Crypto Markets",
    text: "Featured USDT pairs with price, 24h movement, and chart context.",
    points: ["BTC, ETH, SOL, BNB, XRP", "Category filters", "Chart view", "Search"],
    to: "/markets",
    cta: "Explore Markets",
  },
  {
    id: "portfolio",
    title: "Portfolio Management",
    text: "Balances, allocation, and activity are meant to live in the account, not across separate tools.",
    points: ["Allocation", "Activity", "Position context"],
    to: "/signup",
    cta: "Create Account",
  },
  {
    id: "intelligence",
    title: "Market Intelligence",
    text: "A readout of trend, momentum, volatility, and sentiment next to the chart.",
    points: ["Trend", "Momentum", "Volatility", "Key levels"],
    to: "/ai-trading",
    cta: "View AI Trading",
  },
  {
    id: "tools",
    title: "Trading Tools",
    text: "Charts, lists, and alerts as part of the desk rather than a second product.",
    points: ["Charts", "Watchlists", "Alerts"],
    to: "/markets",
    cta: "Explore Markets",
  },
  {
    id: "alerts",
    title: "Alerts & Watchlists",
    text: "Lists and alerts are part of the plan structure. Delivery is not live in this preview.",
    points: ["Watchlists by plan", "Alert preferences", "Market context"],
    to: "/pricing",
    cta: "View Pricing",
  },
  {
    id: "account",
    title: "Account Management",
    text: "Create an account, sign in, and return to the platform from the same navigation.",
    points: ["Email and password", "Country", "Sign in", "Password reset"],
    to: "/signup",
    cta: "Create Account",
  },
];

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  role: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
  quote: string;
  photo: string;
  category: "Trading Experience" | "Platform" | "Markets" | "Copy Trading" | "AI Trading" | "Support";
};

export const testimonials: Testimonial[] = [
  {
    id: "sarah",
    name: "Sarah Mitchell",
    location: "London, UK",
    role: "Discretionary trader",
    rating: 5,
    date: "March 2026",
    quote: "The desk keeps price, range, and the strategy in one view. I spend less time reconstructing context.",
    photo: "/reviews/review-amelia.jpg",
    category: "Trading Experience",
  },
  {
    id: "kenji",
    name: "Kenji Sato",
    location: "Tokyo, Japan",
    role: "Market analyst",
    rating: 5,
    date: "February 2026",
    quote: "Charts and the readout sit together. I can see what the session is watching without opening another tool.",
    photo: "/reviews/review-kenji.jpg",
    category: "Markets",
  },
  {
    id: "sofia",
    name: "Sofia Alvarez",
    location: "Madrid, Spain",
    role: "Portfolio manager",
    rating: 4,
    date: "January 2026",
    quote: "Allocation and activity are easier to scan. The interface stays quiet when the market is not.",
    photo: "/reviews/review-sofia.jpg",
    category: "Platform",
  },
  {
    id: "daniel",
    name: "Daniel Berger",
    location: "Berlin, Germany",
    role: "Systematic trader",
    rating: 5,
    date: "December 2025",
    quote: "I can set risk before a session is active, and I can stop it without hunting through menus.",
    photo: "/reviews/review-daniel.jpg",
    category: "AI Trading",
  },
  {
    id: "priya",
    name: "Priya Nair",
    location: "Singapore",
    role: "Multi-strategy trader",
    rating: 5,
    date: "November 2025",
    quote: "Copy trading is presented as an approach I can read, not a stream of noise.",
    photo: "/reviews/review-priya.jpg",
    category: "Copy Trading",
  },
  {
    id: "lucas",
    name: "Lucas Ferreira",
    location: "São Paulo, Brazil",
    role: "Active trader",
    rating: 4,
    date: "October 2025",
    quote: "Account creation was straightforward, and the market layout matches the way I already think about pairs.",
    photo: "/reviews/review-lucas.jpg",
    category: "Support",
  },
];

export const reviewCategories = [
  "All",
  "Trading Experience",
  "Platform",
  "Markets",
  "Copy Trading",
  "AI Trading",
  "Support",
] as const;

export type PrototypeTrader = {
  id: string;
  name: string;
  strategy: string;
  risk: string;
  performance: string;
  followers: string;
  avatar: string;
};

export const prototypeTraders: PrototypeTrader[] = [
  {
    id: "voss",
    name: "Elena Voss",
    strategy: "Trend following",
    risk: "Moderate",
    performance: "+12.4%",
    followers: "860",
    avatar: "/traders/elena.jpg",
  },
  {
    id: "park",
    name: "Min-jun Park",
    strategy: "Momentum",
    risk: "Higher",
    performance: "+9.1%",
    followers: "640",
    avatar: "/traders/minjun.jpg",
  },
  {
    id: "chen",
    name: "Mei Chen",
    strategy: "Mean reversion",
    risk: "Low",
    performance: "+6.8%",
    followers: "410",
    avatar: "/traders/mei.jpg",
  },
];
