import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Bell,
  CandlestickChart,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  PieChart,
  Repeat,
  Settings,
  Shield,
  Sparkles,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";

export type DeskNavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
};

export const deskNav: { label: string; items: DeskNavItem[] }[] = [
  {
    label: "Main",
    items: [
      { to: "/app", label: "Overview", icon: LayoutDashboard, end: true },
      { to: "/app/ai-trading", label: "AI Trading", icon: Sparkles },
      { to: "/app/copy-trading", label: "Copy Trading", icon: Users },
      { to: "/app/markets", label: "Markets", icon: CandlestickChart },
      { to: "/app/portfolio", label: "Portfolio", icon: PieChart },
    ],
  },
  {
    label: "Money",
    items: [
      { to: "/app/deposit", label: "Deposit", icon: ArrowDownToLine },
      { to: "/app/withdrawal", label: "Withdrawal", icon: ArrowUpFromLine },
      { to: "/app/transactions", label: "Transactions", icon: Repeat },
    ],
  },
  {
    label: "Trading",
    items: [
      { to: "/app/watchlist", label: "Watchlist", icon: Star },
      { to: "/app/alerts", label: "Alerts", icon: Bell },
    ],
  },
  {
    label: "Plans",
    items: [
      { to: "/app/subscription", label: "Subscription", icon: CreditCard },
      { to: "/app/subscription#plans", label: "Pricing / Upgrade", icon: CreditCard },
    ],
  },
  {
    label: "Account",
    items: [
      { to: "/app/settings", label: "Settings", icon: Settings },
      { to: "/app/security", label: "Security", icon: Shield },
      { to: "/app/support", label: "Support", icon: LifeBuoy },
    ],
  },
];

export const deskPages: Record<string, { title: string; subtitle: string }> = {
  "/app": { title: "Overview", subtitle: "Account command" },
  "/app/ai-trading": { title: "AI Trading", subtitle: "Strategy desk" },
  "/app/ai-trading/start": { title: "Start AI Trading", subtitle: "Allocation and risk" },
  "/app/copy-trading": { title: "Copy Trading", subtitle: "Trader marketplace" },
  "/app/markets": { title: "Markets", subtitle: "Spot pairs" },
  "/app/portfolio": { title: "Portfolio", subtitle: "Holdings" },
  "/app/deposit": { title: "Deposit", subtitle: "Funding desk" },
  "/app/withdrawal": { title: "Withdrawal", subtitle: "Funding desk" },
  "/app/transactions": { title: "Transactions", subtitle: "Account ledger" },
  "/app/trade": { title: "Trade", subtitle: "Order ticket" },
  "/app/watchlist": { title: "Watchlist", subtitle: "Saved pairs" },
  "/app/alerts": { title: "Alerts", subtitle: "Session notices" },
  "/app/profile": { title: "Profile", subtitle: "Account details" },
  "/app/verification": { title: "Verification", subtitle: "Identity review" },
  "/app/security": { title: "Security", subtitle: "Access" },
  "/app/settings": { title: "Settings", subtitle: "Desk preferences" },
  "/app/help": { title: "Help Center", subtitle: "Guides" },
  "/app/support": { title: "Support", subtitle: "Contact" },
  "/app/subscription": { title: "Subscription", subtitle: "Plan and access" },
};

export function deskTitle(pathname: string) {
  if (deskPages[pathname]) return deskPages[pathname];
  if (pathname.startsWith("/app/ai-trading/")) return { title: "AI Trading", subtitle: "Strategy terminal" };
  if (pathname.startsWith("/app/copy-trading/")) return { title: "Copy Trading", subtitle: "Trader profile" };
  if (pathname.startsWith("/app/markets/")) return { title: "Markets", subtitle: "Pair detail" };
  return { title: "Overview", subtitle: "Account command" };
}

export const accountLinks = [
  { to: "/app/profile", label: "Profile" },
  { to: "/app/verification", label: "Verification" },
  { to: "/app/subscription", label: "Subscription" },
  { to: "/app/settings", label: "Settings" },
  { to: "/app/security", label: "Security" },
];
