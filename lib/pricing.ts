export type BillingCycle = "monthly" | "yearly";

export type PricingPlan = {
  id: "free" | "pro" | "advanced";
  name: string;
  positioning: string;
  monthly: number;
  yearly: number;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    positioning: "Explore",
    monthly: 0,
    yearly: 0,
    description: "Essential tools to understand the crypto market.",
    features: [
      "Market overview",
      "Crypto watchlist",
      "Basic market charts",
      "Basic AI insights",
      "Limited AI trade signals",
      "Basic market sentiment",
      "Limited AI trend analysis",
      "Basic portfolio analytics",
      "Copy trading preview",
      "Limited trader discovery",
      "Basic risk analytics",
      "Limited AI alerts",
      "1 watchlist",
      "Limited historical data",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    positioning: "Trade Smarter",
    monthly: 50,
    yearly: 500,
    description: "Advanced intelligence and analytics for active traders.",
    features: [
      "Everything in Free",
      "Advanced AI market analysis",
      "AI trade signals",
      "Advanced technical indicators",
      "Advanced market sentiment",
      "Advanced AI trend analysis",
      "Advanced portfolio analytics",
      "Full copy trading access",
      "Trader discovery",
      "Copy-trading analytics",
      "Advanced risk analytics",
      "AI alerts",
      "Custom alerts",
      "Up to 10 watchlists",
      "Extended historical data",
      "Advanced market data",
      "Priority processing",
    ],
    cta: "Start Pro",
    highlighted: true,
  },
  {
    id: "advanced",
    name: "Advanced",
    positioning: "Full Intelligence",
    monthly: 100,
    yearly: 1000,
    description:
      "Deeper analytics and advanced tools for traders who want maximum control.",
    features: [
      "Everything in Pro",
      "Advanced AI market reasoning",
      "Multi-timeframe analysis",
      "Advanced risk analytics",
      "Portfolio stress testing",
      "Correlation analysis",
      "Strategy analytics",
      "Advanced alert controls",
      "Full historical market data",
      "Advanced copy-trader analytics",
      "Advanced AI tools",
      "Unlimited watchlists",
      "Early access to new AI capabilities",
      "Priority support",
    ],
    cta: "Go Advanced",
    highlighted: false,
  },
];

export type ComparisonValue = boolean | string;

export type ComparisonRow = {
  label: string;
  free: ComparisonValue;
  pro: ComparisonValue;
  advanced: ComparisonValue;
};

export type ComparisonGroup = {
  title: string;
  rows: ComparisonRow[];
};

export const comparisonGroups: ComparisonGroup[] = [
  {
    title: "Market Intelligence",
    rows: [
      { label: "Market overview", free: true, pro: true, advanced: true },
      { label: "Market charts", free: "Basic", pro: "Advanced", advanced: "Advanced" },
      { label: "Market sentiment", free: "Basic", pro: "Advanced", advanced: "Advanced" },
      { label: "Technical indicators", free: false, pro: "Advanced", advanced: "Advanced" },
      { label: "Historical data", free: "Limited", pro: "Extended", advanced: "Full" },
      { label: "Multi-timeframe analysis", free: false, pro: false, advanced: true },
      { label: "Market data depth", free: "Standard", pro: "Advanced", advanced: "Advanced" },
    ],
  },
  {
    title: "Portfolio & Analytics",
    rows: [
      { label: "Portfolio analytics", free: "Basic", pro: "Advanced", advanced: "Advanced" },
      { label: "Risk analytics", free: "Basic", pro: "Advanced", advanced: "Advanced" },
      { label: "Portfolio stress testing", free: false, pro: false, advanced: true },
      { label: "Correlation analysis", free: false, pro: false, advanced: true },
      { label: "Strategy analytics", free: false, pro: false, advanced: true },
    ],
  },
  {
    title: "Copy Trading",
    rows: [
      { label: "Copy trading", free: "Preview", pro: "Full access", advanced: "Full access" },
      { label: "Trader discovery", free: "Limited", pro: "Full", advanced: "Full" },
      { label: "Copy-trading analytics", free: false, pro: true, advanced: "Advanced" },
    ],
  },
  {
    title: "Alerts & Watchlists",
    rows: [
      { label: "AI alerts", free: "Limited", pro: true, advanced: true },
      { label: "Custom alerts", free: false, pro: true, advanced: true },
      { label: "Alert controls", free: "Standard", pro: "Standard", advanced: "Advanced" },
      { label: "Watchlists", free: "1", pro: "Up to 10", advanced: "Unlimited" },
    ],
  },
  {
    title: "AI Tools",
    rows: [
      { label: "AI insights", free: "Basic", pro: "Advanced", advanced: "Advanced" },
      { label: "AI trade signals", free: "Limited", pro: true, advanced: true },
      { label: "AI trend analysis", free: "Limited", pro: "Advanced", advanced: "Advanced" },
      { label: "AI market reasoning", free: false, pro: false, advanced: true },
      { label: "Advanced AI tools", free: false, pro: false, advanced: true },
      { label: "Early access to new AI capabilities", free: false, pro: false, advanced: true },
      { label: "Priority processing", free: false, pro: true, advanced: true },
    ],
  },
  {
    title: "Support",
    rows: [
      { label: "Support", free: "Standard", pro: "Standard", advanced: "Priority" },
    ],
  },
];

export function formatPlanPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
