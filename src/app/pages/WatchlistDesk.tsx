import { Star } from "lucide-react";
import { MiniSpark } from "@/components/MiniSpark";
import { useDeskState } from "@/src/app/state/DeskState";
import { formatPct, formatPrice, markets } from "@/src/data/dashboardMock";
import { cn } from "@/lib/cn";

export function WatchlistDesk() {
  const { watchlist, toggleWatch } = useDeskState();

  return (
    <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c]">
      <header className="border-b border-white/[0.05] px-4 py-3">
        <h2 className="text-[15px] text-white">Watchlist</h2>
        <p className="text-[12px] text-zinc-600">Stars stay in this session only.</p>
      </header>
      <ul>
        {markets.map((item) => {
          const active = watchlist.includes(item.id);
          const down = item.change24h < 0;
          return (
            <li key={item.id} className="flex items-center gap-3 border-t border-white/[0.04] px-4 py-3">
              <button type="button" aria-label={active ? `Remove ${item.asset}` : `Watch ${item.asset}`} onClick={() => toggleWatch(item.id)}>
                <Star size={15} className={active ? "fill-orange text-orange" : "text-zinc-600"} />
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] text-white">{item.asset}</p>
                <p className="text-[11px] text-zinc-500">{item.pair}</p>
              </div>
              <div className="hidden h-7 w-16 sm:block">
                <MiniSpark values={item.spark} width={64} height={28} tone={down ? "crimson" : "orange"} />
              </div>
              <div className="text-right">
                <p className="font-mono text-[12px] text-zinc-200">{formatPrice(item.price)}</p>
                <p className={cn("text-[11px]", down ? "text-crimson" : "text-orange")}>{formatPct(item.change24h)}</p>
                <p className="text-[11px] text-zinc-600">{item.volume}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
