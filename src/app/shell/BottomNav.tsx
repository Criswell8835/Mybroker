import { CandlestickChart, LayoutDashboard, PieChart, Sparkles, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/cn";

const items = [
  { to: "/app", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/app/ai-trading", label: "AI", icon: Sparkles },
  { to: "/app/markets", label: "Markets", icon: CandlestickChart },
  { to: "/app/portfolio", label: "Portfolio", icon: PieChart },
];

export function BottomNav({ onAccount }: { onAccount: () => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-white/[0.08] bg-[#070707]/95 px-1 py-1 backdrop-blur-md lg:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn("flex flex-col items-center gap-0.5 rounded-md py-1.5 text-[10px]", isActive ? "text-orange" : "text-zinc-500")
            }
          >
            <Icon size={16} strokeWidth={1.6} />
            {item.label}
          </NavLink>
        );
      })}
      <button type="button" onClick={onAccount} className="flex flex-col items-center gap-0.5 rounded-md py-1.5 text-[10px] text-zinc-500">
        <UserRound size={16} strokeWidth={1.6} />
        Account
      </button>
    </nav>
  );
}
