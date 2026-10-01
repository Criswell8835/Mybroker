import { Link } from "react-router-dom";
import { AssetMark } from "@/src/app/ui/AssetMark";
import { allocation, formatPct, formatPrice, formatUsd, holdings, quote } from "@/src/data/dashboardMock";
import { cn } from "@/lib/cn";

export function HoldingsTable({ compact = false }: { compact?: boolean }) {
  const rows = holdings.map((item) => {
    const mark = quote(item.symbol);
    const value = mark.price * item.qty;
    const pnl = (mark.price - item.entry) * item.qty;
    const share = allocation.find((slice) => slice.symbol === item.symbol)?.pct ?? 0;
    return { ...item, ...mark, value, pnl, share };
  });

  return (
    <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c]">
      <header className="flex items-center justify-between border-b border-white/[0.05] px-4 py-3">
        <h2 className="text-[13px] text-white">Holdings</h2>
        <Link to="/app/portfolio" className="text-[12px] text-zinc-400 hover:text-white">View Portfolio</Link>
      </header>
      <div className="hidden md:block">
        <table className="w-full text-left text-[12px]">
          <thead className="text-[10px] tracking-[0.14em] text-zinc-600">
            <tr>
              {["Asset", "Amount", "Price", "24h", "Allocation", "Average entry", "P&L", "Value"].map((label) => (
                <th key={label} className="px-4 py-2 font-normal">{label.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.symbol} className="border-t border-white/[0.04]">
                <td className="px-4 py-2.5">
                  <span className="flex items-center gap-2 text-white">
                    <AssetMark symbol={item.symbol} size={22} />
                    {item.symbol}
                    <span className="text-zinc-500">{item.name}</span>
                  </span>
                </td>
                <td className="px-4 py-2.5 font-mono text-zinc-400">{item.qty >= 100 ? item.qty.toFixed(2) : item.qty.toFixed(4)}</td>
                <td className="px-4 py-2.5 font-mono text-zinc-300">{formatPrice(item.price)}</td>
                <td className={cn("px-4 py-2.5", item.change24h < 0 ? "text-crimson" : "text-orange")}>{formatPct(item.change24h)}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-1 w-16 overflow-hidden rounded-full bg-white/10">
                      <span className="block h-full bg-orange/80" style={{ width: `${item.share}%` }} />
                    </span>
                    <span className="text-zinc-400">{item.share}%</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 font-mono text-zinc-400">{formatPrice(item.entry)}</td>
                <td className={cn("px-4 py-2.5 font-mono", item.pnl < 0 ? "text-crimson" : "text-orange")}>{formatUsd(item.pnl)}</td>
                <td className="px-4 py-2.5 font-mono text-zinc-200">{formatUsd(item.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="divide-y divide-white/[0.04] md:hidden">
        {rows.slice(0, compact ? 4 : rows.length).map((item) => (
          <li key={item.symbol} className="px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[13px] text-white">
                <AssetMark symbol={item.symbol} size={22} />
                {item.symbol}
              </span>
              <span className="font-mono text-[13px] text-zinc-200">{formatUsd(item.value)}</span>
            </div>
            <div className="mt-2 flex justify-between text-[12px] text-zinc-500">
              <span>{formatPrice(item.price)}</span>
              <span className={item.pnl < 0 ? "text-crimson" : "text-orange"}>{formatUsd(item.pnl)}</span>
            </div>
          </li>
        ))}
      </ul>
      <p className="border-t border-white/[0.04] px-4 py-2 text-[11px] text-zinc-600">Prototype holdings. Not a live book.</p>
    </section>
  );
}
