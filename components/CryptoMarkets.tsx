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
        stroke={down ? "#C8102E" : "rgba(244,244,245,0.7)"}
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function CryptoMarkets() {
  return (
    <section
      id="markets"
      className="scroll-mt-24 px-5 py-28 sm:px-8 lg:px-12 lg:py-36"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] tracking-[0.28em] text-zinc-500">
              CRYPTO MARKETS
            </p>
            <h2 className="mt-5 text-[34px] font-normal tracking-[-0.04em] text-white sm:text-[46px]">
              Explore the crypto market.
            </h2>
          </div>
          <DemoBadge />
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-12 overflow-hidden rounded-xl border border-white/[0.07]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/[0.06] text-[10px] tracking-[0.18em] text-zinc-500">
                    <th className="px-6 py-4 font-normal">Asset</th>
                    <th className="px-6 py-4 font-normal">Price</th>
                    <th className="px-6 py-4 font-normal">24H</th>
                    <th className="px-6 py-4 font-normal">Volume</th>
                    <th className="px-6 py-4 font-normal">Market</th>
                    <th className="px-6 py-4 font-normal">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {tableAssets.map((asset) => {
                    const down = asset.change24h < 0;
                    return (
                      <tr
                        key={asset.id}
                        className="border-b border-white/[0.045] transition-colors duration-300 hover:bg-white/[0.025]"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3.5">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] text-[8px] tracking-[0.1em] text-zinc-400">
                              {asset.symbol}
                            </span>
                            <div>
                              <p className="text-[14px] text-white">{asset.name}</p>
                              <p className="mt-0.5 text-[11px] text-zinc-500">
                                {asset.pair}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 font-mono text-[13px] text-zinc-200">
                          {formatPrice(asset.price)}
                        </td>
                        <td
                          className={cn(
                            "px-6 py-5 font-mono text-[13px]",
                            down ? "text-crimson" : "text-zinc-300",
                          )}
                        >
                          {formatChange(asset.change24h)}
                        </td>
                        <td className="px-6 py-5 font-mono text-[13px] text-zinc-500">
                          {asset.volume}
                        </td>
                        <td className="px-6 py-5 text-[13px] text-zinc-500">
                          {asset.market}
                        </td>
                        <td className="px-6 py-5">
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
          <p className="mt-5 text-[12px] leading-6 text-zinc-600">
            {DEMO_DISCLAIMER}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
