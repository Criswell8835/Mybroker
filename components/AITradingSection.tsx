
import { ArrowRight } from "lucide-react";
import { CandlestickChart } from "@/components/CandlestickChart";
import { Reveal } from "@/components/Reveal";
import {
  aiAnalysis,
  candleSets,
  formatChange,
  formatPrice,
} from "@/lib/market-data";

const indicators = [
  { label: "Trend", value: aiAnalysis.trend },
  { label: "Momentum", value: aiAnalysis.momentum },
  { label: "Volatility", value: aiAnalysis.volatility },
  { label: "Sentiment", value: aiAnalysis.sentiment },
  { label: "Support", value: formatPrice(3391) },
  { label: "Resistance", value: formatPrice(3528) },
];

export function AITradingSection() {
  return (
    <section
      id="ai-trading"
      className="relative overflow-hidden scroll-mt-24 px-5 py-28 sm:px-8 lg:px-12 lg:py-40"
    >
      <div className="ambient right-[-80px] top-24 hidden h-[280px] w-[280px] bg-[rgba(232,92,36,0.07)] lg:block" />
      <div className="mx-auto grid max-w-[1200px] items-center gap-16 lg:grid-cols-[0.86fr_1.14fr] lg:gap-20">
        <Reveal>
          <p className="text-[11px] tracking-[0.26em] text-zinc-500">
            AI CRYPTO TRADING
          </p>
          <h2 className="mt-5 max-w-md text-[34px] font-normal leading-[1.06] tracking-[-0.045em] text-white sm:text-[46px]">
            Intelligence behind every trade.
          </h2>
          <p className="mt-6 max-w-[420px] text-[15px] leading-7 text-zinc-400">
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

        <Reveal delay={0.12}>
          <div className="relative overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#0c0c0c] shadow-[0_32px_90px_rgba(0,0,0,0.42)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/40 to-transparent" />
            <div className="flex items-end justify-between border-b border-white/[0.06] px-5 py-4 sm:px-6">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-zinc-500">
                  ETH/USD DESK
                </p>
                <div className="mt-1.5 flex items-baseline gap-3">
                  <p className="text-[24px] font-normal tracking-[-0.03em] text-white">
                    {formatPrice(3482.16)}
                  </p>
                  <span className="text-[12px] text-orange">
                    {formatChange(1.42)}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-[228px] px-2 pt-3 sm:h-[268px]">
              <CandlestickChart
                candles={candleSets.eth}
                height={250}
                idPrefix="ai-desk"
              />
            </div>

            <div className="grid grid-cols-2 gap-px border-t border-white/[0.06] bg-white/[0.035] sm:grid-cols-3 lg:grid-cols-6">
              {indicators.map((item) => (
                <div key={item.label} className="bg-[#0c0c0c] px-3 py-3.5">
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
