import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Star } from "lucide-react";
import { MiniSpark } from "@/components/MiniSpark";
import { Workspace } from "@/src/app/trade/Workspace";
import { AssetMark } from "@/src/app/ui/AssetMark";
import { formatPct, formatPrice, markets } from "@/src/data/dashboardMock";
import { useDeskState } from "@/src/app/state/DeskState";
import { cn } from "@/lib/cn";

const filters = ["All", "Favorites", "Top Gainers", "Top Losers", "Spot"] as const;

export function MarketsDesk() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const { watchlist, toggleWatch } = useDeskState();
  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    let list = markets.filter((item) => !needle || item.pair.toLowerCase().includes(needle) || item.asset.toLowerCase().includes(needle));
    if (filter === "Favorites") list = list.filter((item) => watchlist.includes(item.id));
    if (filter === "Top Gainers") list = [...list].sort((a, b) => b.change24h - a.change24h);
    if (filter === "Top Losers") list = [...list].sort((a, b) => a.change24h - b.change24h);
    return list;
  }, [filter, query, watchlist]);

  return (
    <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.05] px-4 py-3">
        <div>
          <h2 className="text-[15px] text-white">Markets</h2>
          <p className="text-[12px] text-zinc-600">Static preview prices.</p>
        </div>
        <input className="desk-field w-full sm:w-56" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search assets" aria-label="Search assets" />
      </header>
      <div className="flex gap-1 overflow-x-auto border-b border-white/[0.05] px-3 py-2">
        {filters.map((item) => (
          <button key={item} type="button" onClick={() => setFilter(item)} className={cn("rounded-md px-2.5 py-1 text-[12px]", item === filter ? "bg-orange/15 text-orange" : "text-zinc-500")}>
            {item}
          </button>
        ))}
      </div>
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[860px] text-left text-[12px]">
          <thead className="text-[10px] tracking-[0.14em] text-zinc-600">
            <tr>
              {["", "Asset", "Price", "24h", "High", "Low", "Volume", "Market Cap", "Chart", ""].map((label) => (
                <th key={label || "mark"} className="px-3 py-2 font-normal">{label.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => {
              const down = item.change24h < 0;
              const base = item.pair.split("/")[0];
              return (
                <tr key={item.id} className="border-t border-white/[0.04]">
                  <td className="px-3 py-2">
                    <button type="button" aria-label={`Watch ${item.pair}`} onClick={() => toggleWatch(item.id)} className={watchlist.includes(item.id) ? "text-orange" : "text-zinc-600"}>
                      <Star size={14} fill={watchlist.includes(item.id) ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="px-3 py-2.5">
                    <Link to={`/app/markets/${item.id}`} className="flex items-center gap-2 text-white">
                      <AssetMark symbol={base} size={22} />
                      <span>
                        <span className="block">{item.asset}</span>
                        <span className="text-[11px] text-zinc-500">{item.pair}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-zinc-200">{formatPrice(item.price)}</td>
                  <td className={cn("px-3 py-2.5", down ? "text-crimson" : "text-orange")}>{formatPct(item.change24h)}</td>
                  <td className="px-3 py-2.5 font-mono text-zinc-400">{formatPrice(item.high)}</td>
                  <td className="px-3 py-2.5 font-mono text-zinc-400">{formatPrice(item.low)}</td>
                  <td className="px-3 py-2.5 text-zinc-400">{item.volume}</td>
                  <td className="px-3 py-2.5 text-zinc-400">{item.cap}</td>
                  <td className="w-24 px-3 py-2.5">
                    <div className="h-7"><MiniSpark values={item.spark} width={88} height={28} tone={down ? "crimson" : "orange"} /></div>
                  </td>
                  <td className="px-3 py-2.5">
                    <Link to={`/app/trade?pair=${base}`} className="text-orange">Trade</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ul className="divide-y divide-white/[0.04] lg:hidden">
        {rows.map((item) => {
          const down = item.change24h < 0;
          return (
            <li key={item.id}>
              <Link to={`/app/markets/${item.id}`} className="flex items-center justify-between gap-3 px-4 py-3">
                <span>
                  <span className="block text-[13px] text-white">{item.pair}</span>
                  <span className={cn("text-[12px]", down ? "text-crimson" : "text-orange")}>{formatPct(item.change24h)}</span>
                </span>
                <span className="text-right">
                  <span className="block font-mono text-[13px] text-zinc-200">{formatPrice(item.price)}</span>
                  <span className="text-[11px] text-zinc-500">{item.volume}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      {rows.length === 0 ? <p className="px-4 py-6 text-[13px] text-zinc-500">No pairs match.</p> : null}
    </section>
  );
}

export function MarketDetail() {
  const { marketId = "btc" } = useParams();
  const market = markets.find((item) => item.id === marketId) ?? markets[0];
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[12px] text-zinc-500">{market.asset}</p>
          <h2 className="text-[22px] text-white">{market.pair}</h2>
          <p className={cn("text-[13px]", market.change24h < 0 ? "text-crimson" : "text-orange")}>{formatPct(market.change24h)} · High {formatPrice(market.high)} · Low {formatPrice(market.low)}</p>
        </div>
        <p className="text-[12px] text-zinc-500">Volume {market.volume} · Cap {market.cap}</p>
      </div>
      <Workspace initial={market.pair.split("/")[0]} />
    </div>
  );
}
