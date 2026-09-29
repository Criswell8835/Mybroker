"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";

const strategies = [
  {
    id: "momentum",
    name: "Momentum",
    description:
      "Reads continuation in price and volume when directional pressure is building.",
    conditions: "Strong trend, expanding volume, constructive sentiment.",
    note: "A research view — not a promise of outcome.",
    bars: [28, 36, 32, 48, 44, 61, 58, 72, 68, 84],
  },
  {
    id: "trend",
    name: "Trend Following",
    description:
      "Stays aligned with established market structure rather than short-lived noise.",
    conditions: "Higher highs, stable volatility, confirmed bias.",
    note: "A research view — not a promise of outcome.",
    bars: [40, 42, 38, 46, 52, 50, 58, 63, 61, 70],
  },
  {
    id: "analysis",
    name: "Market Analysis",
    description:
      "Combines trend, momentum, volatility and sentiment into a single market readout.",
    conditions: "Multi-factor confirmation across the trading desk.",
    note: "A research view — not a promise of outcome.",
    bars: [34, 44, 41, 39, 55, 49, 60, 57, 66, 64],
  },
];

export function TradingStrategies() {
  const [active, setActive] = useState(strategies[0].id);
  const current = strategies.find((item) => item.id === active) ?? strategies[0];

  return (
    <section className="px-5 pb-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#0c0c0c]">
        <div className="grid lg:grid-cols-[280px_1fr]">
          <Reveal className="border-b border-white/8 p-6 lg:border-b-0 lg:border-r lg:p-8">
            <p className="text-[11px] tracking-[0.24em] text-zinc-500">
              AI STRATEGIES
            </p>
            <div className="mt-6 flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
              {strategies.map((strategy) => (
                <button
                  key={strategy.id}
                  type="button"
                  onClick={() => setActive(strategy.id)}
                  className={cn(
                    "whitespace-nowrap rounded-md px-4 py-3 text-left text-[13px] transition-colors",
                    strategy.id === active
                      ? "bg-white/[0.06] text-white"
                      : "text-zinc-500 hover:text-zinc-300",
                  )}
                >
                  {strategy.name}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08} className="p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-8 md:flex-row">
              <div className="max-w-md">
                <h3 className="text-[22px] font-normal tracking-[-0.03em] text-white">
                  {current.name}
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-zinc-400">
                  {current.description}
                </p>
                <p className="mt-5 text-[12px] tracking-[0.14em] text-zinc-500">
                  MARKET CONDITIONS
                </p>
                <p className="mt-2 text-sm text-zinc-300">{current.conditions}</p>
                <p className="mt-6 text-[12px] text-zinc-600">{current.note}</p>
              </div>

              <div className="flex min-w-[220px] items-end gap-1.5">
                {current.bars.map((bar, index) => (
                  <div
                    key={`${current.id}-${index}`}
                    className={cn(
                      "flex-1 rounded-t-[1px]",
                      index > current.bars.length - 3
                        ? "bg-orange/80"
                        : "bg-white/70",
                    )}
                    style={{ height: `${bar}px` }}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
