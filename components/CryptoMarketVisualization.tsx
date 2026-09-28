"use client";

import { useMemo, useState } from "react";
import { CandlestickChart } from "@/components/CandlestickChart";
import { DemoBadge } from "@/components/DemoBadge";
import { FloatingMetric } from "@/components/FloatingMetric";
import { cn } from "@/lib/cn";
import {
  aiAnalysis,
  candleSets,
  formatChange,
  formatPrice,
  marketAssets,
} from "@/lib/market-data";

const pairs = marketAssets.filter((asset) =>
  ["btc", "eth", "sol"].includes(asset.id),
);

export function CryptoMarketVisualization() {
  const [activeId, setActiveId] = useState("btc");
  const asset = useMemo(
    () => pairs.find((item) => item.id === activeId) ?? pairs[0],
    [activeId],
  );
  const candles = candleSets[activeId] ?? candleSets.btc;
  const positive = asset.change24h >= 0;

  return (
    <div className="relative mx-auto max-w-[1200px]">
      <div className="relative xl:mx-14 xl:pt-6 xl:pb-6">
        <FloatingMetric
          label="AI MARKET ANALYSIS"
          value={aiAnalysis.momentumDetail}
          detail={`Momentum · ${aiAnalysis.momentum}`}
          className="hidden xl:block left-5 -top-5"
          delay={0.45}
          floatClassName="float-slow"
        />
        <FloatingMetric
          label="MARKET SENTIMENT"
          value={aiAnalysis.sentiment}
          detail={`${aiAnalysis.sentimentScore}%`}
          className="hidden xl:block right-24 -top-5"
          delay={0.62}
          floatClassName="float-slower"
        />
        <FloatingMetric
          label="VOLATILITY"
          value={aiAnalysis.volatility}
          detail="Range held within session"
          className="hidden xl:block left-5 -bottom-5"
          delay={0.8}
          floatClassName="float-slowest"
        />

      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#070707] shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(200,16,46,0.12),transparent_42%)]" />
        <div className="pointer-events-none absolute inset-px rounded-[27px] ring-1 ring-white/[0.04]" />

        <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-white/8 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] p-1">
            {pairs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveId(item.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[12px] transition-colors",
                  item.id === activeId
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:text-white",
                )}
              >
                {item.pair}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-[11px] tracking-[0.16em] text-zinc-500 sm:inline">
              1H
            </span>
            <DemoBadge />
          </div>
        </div>

        <div className="relative grid gap-6 px-4 pb-3 pt-5 sm:px-6 lg:grid-cols-[1fr_220px]">
          <div>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[12px] tracking-[0.16em] text-zinc-500">
                  {asset.pair}
                </p>
                <div className="mt-1 flex items-baseline gap-3">
                  <p className="text-[32px] font-medium tracking-tight text-white sm:text-[38px]">
                    {formatPrice(asset.price)}
                  </p>
                  <span
                    className={cn(
                      "text-sm",
                      positive ? "text-zinc-200" : "text-crimson",
                    )}
                  >
                    {formatChange(asset.change24h)}
                  </span>
                </div>
              </div>
              <p className="font-mono text-[11px] text-zinc-500">
                24H {formatPrice(asset.low24h)} — {formatPrice(asset.high24h)}
              </p>
            </div>

            <div className="h-[250px] sm:h-[300px] lg:h-[320px]">
              <CandlestickChart candles={candles} idPrefix={`hero-${activeId}`} />
            </div>
          </div>

          <aside className="flex flex-col justify-between rounded-2xl border border-white/8 bg-white/[0.025] p-4">
            <div>
              <p className="text-[10px] font-medium tracking-[0.2em] text-zinc-500">
                AI ANALYSIS
              </p>
              <dl className="mt-5 space-y-4">
                <Metric label="Momentum" value={aiAnalysis.momentum} />
                <Metric label="Market Sentiment" value={aiAnalysis.sentiment} />
                <Metric label="Volatility" value={aiAnalysis.volatility} />
                <Metric
                  label="Resistance"
                  value={formatPrice(aiAnalysis.keyLevels.resistance)}
                />
                <Metric
                  label="Support"
                  value={formatPrice(aiAnalysis.keyLevels.support)}
                />
              </dl>
            </div>
            <p className="mt-6 text-[11px] leading-relaxed text-zinc-600">
              Model readout is illustrative and does not execute trades.
            </p>
          </aside>
        </div>
      </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/6 pb-3">
      <dt className="text-[12px] text-zinc-500">{label}</dt>
      <dd className="text-[12px] font-medium text-white">{value}</dd>
    </div>
  );
}
