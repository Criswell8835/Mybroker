import { Link } from "react-router-dom";
import { MiniSpark } from "@/components/MiniSpark";
import { AssetMark } from "@/src/app/ui/AssetMark";
import { formatPct, formatPrice, markets } from "@/src/data/dashboardMock";
import { cn } from "@/lib/cn";

export function MarketOverview() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[13px] tracking-[0.16em] text-zinc-500">MARKETS</h2>
        <Link to="/app/markets" className="text-[12px] text-zinc-400 hover:text-white">View All Markets</Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {markets.slice(0, 5).map((item) => {
          const down = item.change24h < 0;
          return (
            <Link key={item.id} to={`/app/trade?pair=${item.pair.split("/")[0]}`} className="desk-card min-w-[180px] flex-1 rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-3">
              <div className="flex items-center gap-2">
                <AssetMark symbol={item.pair.split("/")[0]} size={24} />
                <div>
                  <p className="text-[13px] text-white">{item.asset}</p>
                  <p className="text-[11px] text-zinc-500">{item.pair}</p>
                </div>
              </div>
              <p className="mt-3 font-mono text-[15px] text-zinc-100">{formatPrice(item.price)}</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className={cn("text-[12px]", down ? "text-crimson" : "text-orange")}>{formatPct(item.change24h)}</p>
                <div className="h-7 w-16">
                  <MiniSpark values={item.spark} width={64} height={28} tone={down ? "crimson" : "orange"} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
