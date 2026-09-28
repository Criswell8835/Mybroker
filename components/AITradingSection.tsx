"use client";

import { ArrowRight } from "lucide-react";
import { CandlestickChart } from "@/components/CandlestickChart";
import { DemoBadge } from "@/components/DemoBadge";
import { Reveal } from "@/components/Reveal";
import {
  aiAnalysis,
  candleSets,
  formatPrice,
} from "@/lib/market-data";

const indicators = [
  { label: "Market Trend", value: aiAnalysis.trend },
  { label: "Momentum", value: aiAnalysis.momentum },
  { label: "Volatility", value: aiAnalysis.volatility },
  { label: "Sentiment", value: aiAnalysis.sentiment },
  {
    label: "Key Levels",
    value: `${formatPrice(3391)} / ${formatPrice(3528)}`,
  },
];

export function AITradingSection() {
  return (
    <section
      id="ai-trading"
      className="relative scroll-mt-24 px-5 py-28 sm:px-8 lg:px-12 lg:py-36"
    >
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 lg:grid-cols-[0.86fr_1.14fr] lg:gap-20">
        <Reveal>
          <p className="text-[11px] tracking-[0.28em] text-zinc-500">
            AI CRYPTO TRADING
          </p>
          <h2 className="mt-5 max-w-md text-[34px] font-normal leading-[1.08] tracking-[-0.04em] text-white sm:text-[46px]">
            Intelligence behind every trade.
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-7 text-zinc-400">
            Analyze market conditions, identify trends and explore AI-assisted
            strategies through a powerful crypto trading interface.
          </p>
          <a
            href="#features"
            className="mt-9 inline-flex items-center gap-2 text-[13px] tracking-[0.02em] text-white transition-colors hover:text-zinc-300"
          >
            Explore AI Trading
            <ArrowRight size={14} />
          </a>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080808] shadow-[0_28px_80px_rgba(0,0,0,0.38)]">
            <div className="flex items-end justify-between border-b border-white/[0.06] px-5 py-4">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-zinc-500">
                  ETH/USD DESK
                </p>
                <p className="mt-1.5 text-[22px] font-normal tracking-[-0.03em] text-white">
                  {formatPrice(3482.16)}
                </p>
              </div>
              <DemoBadge />
            </div>

            <div className="h-[220px] px-2 pt-2 sm:h-[252px]">
              <CandlestickChart
                candles={candleSets.eth}
                height={240}
                idPrefix="ai-desk"
              />
            </div>

            <div className="grid grid-cols-2 gap-px border-t border-white/[0.06] bg-white/[0.04] sm:grid-cols-5">
              {indicators.map((item) => (
                <div key={item.label} className="bg-[#080808] px-3 py-3.5">
                  <p className="text-[10px] tracking-[0.14em] text-zinc-500">
                    {item.label}
                  </p>
                  <p className="mt-1.5 text-[11px] text-white sm:text-[12px]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
