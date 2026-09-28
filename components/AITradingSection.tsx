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
      className="relative scroll-mt-24 px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
    >
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <p className="text-[11px] font-medium tracking-[0.26em] text-zinc-500">
            AI CRYPTO TRADING
          </p>
          <h2 className="mt-4 max-w-md text-[36px] font-medium leading-[1.05] tracking-[-0.035em] text-white sm:text-[48px]">
            Intelligence behind every trade.
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-7 text-zinc-400">
            Analyze market conditions, identify trends and explore AI-assisted
            strategies through a powerful crypto trading interface.
          </p>
          <a
            href="#features"
            className="mt-8 inline-flex items-center gap-2 text-sm text-white transition-colors hover:text-zinc-300"
          >
            Explore AI Trading
            <ArrowRight size={16} />
          </a>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#080808] shadow-[0_30px_90px_rgba(0,0,0,0.4)]">
            <div className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-[rgba(200,16,46,0.12)] blur-3xl" />
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <div>
                <p className="text-[12px] tracking-[0.16em] text-zinc-500">
                  ETH/USD DESK
                </p>
                <p className="mt-1 text-lg font-medium text-white">
                  {formatPrice(3482.16)}
                </p>
              </div>
              <DemoBadge />
            </div>

            <div className="h-[230px] px-2 pt-3 sm:h-[260px]">
              <CandlestickChart candles={candleSets.eth} height={240} idPrefix="ai-desk" />
            </div>

            <div className="grid grid-cols-2 gap-px border-t border-white/8 bg-white/[0.04] sm:grid-cols-5">
              {indicators.map((item) => (
                <div
                  key={item.label}
                  className="bg-[#080808] px-3 py-3 sm:px-3 sm:py-4"
                >
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
