"use client";

import { useMemo, useState } from "react";
import { CandlestickChart } from "@/components/CandlestickChart";
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
      <div className="relative xl:mx-12 xl:pt-12 xl:pb-8">
        <FloatingMetric
          label="AI MARKET ANALYSIS"
          value={aiAnalysis.momentumDetail}
          detail={`Momentum · ${aiAnalysis.momentum}`}
          className="hidden xl:block left-8 -top-8"
          delay={0.4}
          floatClassName="float-slow"
        />
        <FloatingMetric
          label="MARKET SENTIMENT"
          value={aiAnalysis.sentiment}
          detail={`${aiAnalysis.sentimentScore}%`}
          className="hidden xl:block right-8 -top-8"
          delay={0.55}
          floatClassName="float-slower"
        />
        <FloatingMetric
          label="VOLATILITY"
          value={aiAnalysis.volatility}
          detail="Range held within session"
          className="hidden xl:block left-8 -bottom-6"
          delay={0.7}
          floatClassName="float-slowest"
        />

        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080808] shadow-[0_36px_100px_rgba(0,0,0,0.5)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_40%_0%,rgba(200,16,46,0.07),transparent_46%)]" />

          <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-4 sm:px-6">
            <div className="flex items-center gap-5">
              {pairs.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={cn(
                    "relative pb-1 text-[12px] tracking-[0.08em] transition-colors",
                    item.id === activeId
                      ? "text-white"
                      : "text-zinc-500 hover:text-zinc-300",
                  )}
                >
                  {item.pair}
                  {item.id === activeId ? (
                    <span className="absolute inset-x-0 -bottom-[17px] h-px bg-crimson" />
                  ) : null}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-[11px] tracking-[0.16em] text-zinc-600 sm:inline">
                1H
              </span>
            </div>
          </div>

          <div className="relative grid gap-8 px-5 py-6 sm:px-6 lg:grid-cols-[1fr_200px]">
            <div>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] tracking-[0.18em] text-zinc-500">
                    {asset.pair}
                  </p>
                  <div className="mt-2 flex items-baseline gap-3">
                    <p className="text-[28px] font-normal tracking-[-0.03em] text-white sm:text-[36px]">
                      {formatPrice(asset.price)}
                    </p>
                    <span
                      className={cn(
                        "text-[13px]",
                        positive ? "text-zinc-300" : "text-crimson",
                      )}
                    >
                      {formatChange(asset.change24h)}
                    </span>
                  </div>
                </div>
                <p className="font-mono text-[11px] text-zinc-600">
                  24H {formatPrice(asset.low24h)} — {formatPrice(asset.high24h)}
                </p>
              </div>
              <div className="h-[240px] sm:h-[290px] lg:h-[310px]">
                <CandlestickChart candles={candles} idPrefix={`hero-${activeId}`} />
              </div>
            </div>

            <aside className="flex flex-col justify-between border-t border-white/[0.06] pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
              <div>
                <p className="text-[10px] tracking-[0.2em] text-zinc-500">
                  AI ANALYSIS
                </p>
                <dl className="mt-6 space-y-4">
                  <Metric label="Momentum" value={aiAnalysis.momentum} />
                  <Metric label="Sentiment" value={aiAnalysis.sentiment} />
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
              <p className="mt-8 text-[11px] leading-relaxed text-zinc-600">
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
    <div className="flex items-baseline justify-between gap-3 border-b border-white/[0.05] pb-3">
      <dt className="text-[11px] tracking-[0.04em] text-zinc-500">{label}</dt>
      <dd className="text-[12px] text-white">{value}</dd>
    </div>
  );
}
