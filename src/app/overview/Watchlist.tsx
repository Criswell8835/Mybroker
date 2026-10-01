import { Star } from "lucide-react";
import { MiniSpark } from "@/components/MiniSpark";
import { useDeskState } from "@/src/app/state/DeskState";
import { formatPct, formatPrice, markets } from "@/src/data/dashboardMock";
import { cn } from "@/lib/cn";

export function Watchlist({ framed = true }: { framed?: boolean }) {
  const { watchlist, toggleWatch } = useDeskState();
  const rows = markets.filter((item) => watchlist.includes(item.id));

  return (
    <section className={framed ? "rounded-lg border border-white/[0.06] bg-[#0c0c0c]" : ""}>
      {framed ? (
        <header className="border-b border-white/[0.05] px-4 py-3">
          <h2 className="text-[13px] text-white">Watchlist</h2>
        </header>
      ) : null}
      {rows.length === 0 ? <p className="px-4 py-6 text-[13px] text-zinc-500">No assets on the watchlist.</p> : null}
      <ul>
        {rows.map((item) => {
          const down = item.change24h < 0;
          return (
            <li key={item.id} className="flex items-center gap-3 border-t border-white/[0.04] px-4 py-2.5 first:border-t-0">
              <button type="button" aria-label={`Remove ${item.asset}`} onClick={() => toggleWatch(item.id)}>
                <Star size={14} className="fill-orange text-orange" />
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] text-white">{item.asset}</p>
                <p className={cn("text-[11px]", down ? "text-crimson" : "text-orange")}>{formatPct(item.change24h)}</p>
              </div>
              <div className="h-6 w-14">
                <MiniSpark values={item.spark} width={56} height={24} tone={down ? "crimson" : "orange"} />
              </div>
              <p className="font-mono text-[12px] text-zinc-300">{formatPrice(item.price)}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
