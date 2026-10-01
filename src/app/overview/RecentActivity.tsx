import { ArrowDownToLine, ArrowUpFromLine, Bell, Repeat, Sparkles, Users } from "lucide-react";
import { activity } from "@/src/data/dashboardMock";
import { StatusPill } from "@/src/app/ui/StatusPill";

const icons = {
  Trade: Repeat,
  Deposit: ArrowDownToLine,
  Withdrawal: ArrowUpFromLine,
  "AI Trading": Sparkles,
  "Copy Trading": Users,
  System: Bell,
} as const;

export function RecentActivity() {
  return (
    <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c]">
      <header className="border-b border-white/[0.05] px-4 py-3">
        <h2 className="text-[13px] text-white">Recent activity</h2>
      </header>
      <ul>
        {activity.map((item) => {
          const Icon = icons[item.kind];
          return (
            <li key={item.id} className="flex items-center gap-3 border-t border-white/[0.04] px-4 py-2.5 first:border-t-0">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-white/10 text-zinc-400">
                <Icon size={13} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] text-zinc-100">{item.text}</p>
                <p className="text-[11px] text-zinc-600">{item.kind} · {item.time}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[12px] text-zinc-300">{item.amount}</p>
                <StatusPill value={item.status} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
