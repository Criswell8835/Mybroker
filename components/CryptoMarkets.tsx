"use client";

import { Reveal } from "@/components/Reveal";
import { DemoBadge } from "@/components/DemoBadge";
import { cn } from "@/lib/cn";
import {
  DEMO_DISCLAIMER,
  formatChange,
  formatPrice,
  sparklineSets,
  tableAssets,
} from "@/lib/market-data";

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
        stroke={down ? "#C8102E" : "rgba(244,244,245,0.8)"}
        strokeWidth="1.3"
      />
    </svg>
  );
}

export function CryptoMarkets() {
  return (
    <section
      id="markets"
      className="scroll-mt-24 px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-medium tracking-[0.26em] text-zinc-500">
              CRYPTO MARKETS
            </p>
            <h2 className="mt-4 text-[36px] font-medium tracking-[-0.035em] text-white sm:text-[48px]">
              Explore the crypto market.
            </h2>
          </div>
          <DemoBadge />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 overflow-hidden rounded-[24px] border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.02] text-[11px] tracking-[0.16em] text-zinc-500">
                    <th className="px-5 py-3.5 font-medium">Asset</th>
                    <th className="px-5 py-3.5 font-medium">Price</th>
                    <th className="px-5 py-3.5 font-medium">24H</th>
                    <th className="px-5 py-3.5 font-medium">Volume</th>
                    <th className="px-5 py-3.5 font-medium">Market</th>
                    <th className="px-5 py-3.5 font-medium">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {tableAssets.map((asset) => {
                    const down = asset.change24h < 0;
                    return (
                      <tr
                        key={asset.id}
                        className="border-b border-white/6 transition-colors hover:bg-white/[0.035]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-[9px] tracking-[0.08em] text-zinc-300">
                              {asset.symbol}
                            </span>
                            <div>
                              <p className="text-sm text-white">{asset.name}</p>
                              <p className="text-[11px] text-zinc-500">
                                {asset.pair}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-mono text-sm text-zinc-200">
                          {formatPrice(asset.price)}
                        </td>
                        <td
                          className={cn(
                            "px-5 py-4 font-mono text-sm",
                            down ? "text-crimson" : "text-zinc-200",
                          )}
                        >
                          {formatChange(asset.change24h)}
                        </td>
                        <td className="px-5 py-4 font-mono text-sm text-zinc-400">
                          {asset.volume}
                        </td>
                        <td className="px-5 py-4 text-sm text-zinc-400">
                          {asset.market}
                        </td>
                        <td className="px-5 py-4">
                          <Sparkline
                            values={sparklineSets[asset.id] ?? []}
                            down={down}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 text-[12px] text-zinc-600">{DEMO_DISCLAIMER}</p>
        </Reveal>
      </div>
    </section>
  );
}
