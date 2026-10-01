import { useMemo, useState } from "react";
import { CandlestickChart } from "@/components/CandlestickChart";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";
import {
  DEMO_DISCLAIMER,
  candleSets,
  formatChange,
  formatPrice,
  sparklineSets,
  tableAssets,
} from "@/lib/market-data";

const categories = [
  { id: "all", label: "All" },
  { id: "majors", label: "Majors" },
  { id: "large-cap", label: "Large cap" },
] as const;

type CategoryId = (typeof categories)[number]["id"];

const categoryOf: Record<string, CategoryId> = {
  btc: "majors",
  eth: "majors",
  sol: "large-cap",
  bnb: "large-cap",
  xrp: "large-cap",
};

function Sparkline({ values, down }: { values: number[]; down: boolean }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const width = 88;
  const height = 28;
  const d = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / span) * height;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-7 w-[88px]">
      <path
        d={d}
        fill="none"
        stroke={down ? "#C8102E" : "#E85C24"}
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function CryptoMarkets() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId>("all");
  const [selectedId, setSelectedId] = useState(tableAssets[0]?.id ?? "btc");

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return tableAssets.filter((asset) => {
      const inCategory = category === "all" || categoryOf[asset.id] === category;
      const matches =
        term.length === 0 ||
        asset.symbol.toLowerCase().includes(term) ||
        asset.name.toLowerCase().includes(term) ||
        asset.pair.toLowerCase().includes(term);
      return inCategory && matches;
    });
  }, [category, query]);

  const selected = tableAssets.find((asset) => asset.id === selectedId) ?? tableAssets[0];
  const candles = selected ? candleSets[selected.id] ?? candleSets.btc : [];

  return (
    <section className="scroll-mt-24 px-5 py-16 sm:px-8 lg:px-12 lg:pb-28 lg:pt-20">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.id)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-[12px] tracking-[0.04em]",
                    category === item.id
                      ? "border-orange/40 bg-orange/10 text-white"
                      : "border-white/[0.08] text-zinc-400",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <label className="block w-full sm:w-64">
              <span className="sr-only">Search markets</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search BTC, ETH, SOL…"
                className="w-full rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[13px] text-zinc-100 outline-none placeholder:text-zinc-600"
              />
            </label>
          </div>
        </Reveal>

        {selected && candles ? (
          <Reveal delay={0.06}>
            <div className="mt-6 overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#0c0c0c]">
              <div className="flex items-end justify-between border-b border-white/[0.06] px-5 py-4 sm:px-6">
                <div>
                  <p className="text-[11px] tracking-[0.18em] text-zinc-500">
                    {selected.pair} · SAMPLE
                  </p>
                  <div className="mt-1.5 flex items-baseline gap-3">
                    <p className="text-[24px] tracking-[-0.03em] text-white">
                      {formatPrice(selected.price)}
                    </p>
                    <p className={cn("font-mono text-[13px]", selected.change24h < 0 ? "text-crimson" : "text-orange")}>
                      {formatChange(selected.change24h)}
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500">24h range {formatPrice(selected.low24h)} – {formatPrice(selected.high24h)}</p>
              </div>
              <div className="h-[280px] px-2 pb-3 sm:h-[320px]">
                <CandlestickChart candles={candles} />
              </div>
            </div>
          </Reveal>
        ) : null}

        <Reveal delay={0.08}>
          <div className="mt-4 overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#0c0c0c]">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3 sm:px-6">
              <p className="text-[10px] tracking-[0.2em] text-zinc-500">MARKET TERMINAL</p>
              <p className="font-mono text-[10px] tracking-[0.12em] text-zinc-600">SAMPLE SPOT</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/[0.06] text-[10px] tracking-[0.18em] text-zinc-500">
                    <th className="px-6 py-3.5 font-normal">Asset</th>
                    <th className="px-6 py-3.5 font-normal">Price</th>
                    <th className="px-6 py-3.5 font-normal">24H</th>
                    <th className="px-6 py-3.5 font-normal">Volume</th>
                    <th className="px-6 py-3.5 font-normal">Market</th>
                    <th className="px-6 py-3.5 font-normal">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((asset) => {
                    const down = asset.change24h < 0;
                    const active = asset.id === selected?.id;
                    return (
                      <tr
                        key={asset.id}
                        onClick={() => setSelectedId(asset.id)}
                        className={cn(
                          "cursor-pointer border-b border-white/[0.045] transition-colors duration-150",
                          active ? "bg-white/[0.04]" : "hover:bg-white/[0.03]",
                        )}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3.5">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] text-[8px] tracking-[0.1em] text-zinc-400">
                              {asset.symbol}
                            </span>
                            <div>
                              <p className="text-[14px] text-white">{asset.name}</p>
                              <p className="mt-0.5 text-[11px] text-zinc-500">{asset.pair}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 font-mono text-[13px] text-zinc-200">{formatPrice(asset.price)}</td>
                        <td className={cn("px-6 py-5 font-mono text-[13px]", down ? "text-crimson" : "text-orange")}>
                          {formatChange(asset.change24h)}
                        </td>
                        <td className="px-6 py-5 font-mono text-[13px] text-zinc-500">{asset.volume}</td>
                        <td className="px-6 py-5 text-[13px] text-zinc-500">{asset.market}</td>
                        <td className="px-6 py-5">
                          <Sparkline values={sparklineSets[asset.id] ?? []} down={down} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {visible.length === 0 ? (
              <p className="px-6 py-8 text-[13px] text-zinc-500">No sample assets match that search.</p>
            ) : null}
          </div>
          <p className="mt-5 text-[12px] leading-6 text-zinc-600">{DEMO_DISCLAIMER}</p>
        </Reveal>
      </div>
    </section>
  );
}
