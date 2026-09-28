"use client";

import { CandlestickChart } from "@/components/CandlestickChart";
import { DemoBadge } from "@/components/DemoBadge";
import { Reveal } from "@/components/Reveal";
import { candleSets, formatPrice } from "@/lib/market-data";

const watchlist = [
  { pair: "BTC/USD", price: "$104,284", change: "+2.84%" },
  { pair: "ETH/USD", price: "$3,482.16", change: "+1.42%" },
  { pair: "SOL/USD", price: "$178.40", change: "+3.21%" },
];

const positions = [
  { market: "BTC/USD", side: "Long", size: "0.42", pnl: "+1.8%" },
  { market: "ETH/USD", side: "Long", size: "2.10", pnl: "+0.6%" },
];

export function DashboardPreview() {
  return (
    <section className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="mb-10 max-w-2xl">
          <p className="text-[11px] font-medium tracking-[0.26em] text-zinc-500">
            PLATFORM PREVIEW
          </p>
          <h2 className="mt-4 text-[36px] font-medium tracking-[-0.035em] text-white sm:text-[48px]">
            One workspace for intelligence and copy trading.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative">
            <div className="ambient left-1/2 top-10 h-[280px] w-[520px] -translate-x-1/2 bg-[rgba(200,16,46,0.16)]" />
            <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-[#0b0b0b] shadow-[0_50px_140px_rgba(0,0,0,0.55)]">
              <div className="flex items-center gap-2 border-b border-white/8 bg-[#0e0e0e] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <div className="ml-3 flex-1 rounded-full border border-white/8 bg-black/40 px-3 py-1 text-center text-[11px] tracking-[0.14em] text-zinc-500">
                  app.kaivo.trade
                </div>
                <DemoBadge>PRODUCT PREVIEW</DemoBadge>
              </div>

              <div className="grid lg:grid-cols-[180px_1fr_220px]">
                <aside className="hidden border-r border-white/8 p-4 lg:block">
                  <p className="px-2 text-[10px] tracking-[0.2em] text-zinc-600">
                    KAIVO
                  </p>
                  <nav className="mt-6 space-y-1 text-[13px]">
                    {["Overview", "Markets", "AI Desk", "Copy", "Analytics"].map(
                      (item, index) => (
                        <div
                          key={item}
                          className={`rounded-lg px-3 py-2 ${
                            index === 0
                              ? "bg-white/[0.05] text-white"
                              : "text-zinc-500"
                          }`}
                        >
                          {item}
                        </div>
                      ),
                    )}
                  </nav>
                </aside>

                <div className="min-w-0 p-4 sm:p-5">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-[11px] tracking-[0.16em] text-zinc-500">
                        PORTFOLIO OVERVIEW
                      </p>
                      <p className="mt-1 text-2xl font-medium tracking-tight text-white">
                        $48,291.06
                      </p>
                      <p className="text-[12px] text-zinc-500">
                        Illustrative preview · not an account
                      </p>
                    </div>
                    <p className="text-[12px] text-zinc-400">BTC chart · demo</p>
                  </div>

                  <div className="mt-4 h-[180px] rounded-2xl border border-white/8 bg-black/30 sm:h-[210px]">
                    <CandlestickChart
                      candles={candleSets.btc}
                      height={200}
                      showVolume={false}
                      idPrefix="preview"
                    />
                  </div>

                  <div className="mt-4 overflow-hidden rounded-2xl border border-white/8">
                    <div className="border-b border-white/8 px-4 py-2 text-[10px] tracking-[0.16em] text-zinc-500">
                      POSITIONS · SAMPLE
                    </div>
                    {positions.map((position) => (
                      <div
                        key={position.market}
                        className="flex items-center justify-between border-b border-white/6 px-4 py-2.5 text-[12px] last:border-0"
                      >
                        <span className="text-zinc-300">{position.market}</span>
                        <span className="text-zinc-500">{position.side}</span>
                        <span className="font-mono text-zinc-400">
                          {position.size}
                        </span>
                        <span className="text-zinc-200">{position.pnl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <aside className="border-t border-white/8 p-4 lg:border-l lg:border-t-0">
                  <p className="text-[10px] tracking-[0.16em] text-zinc-500">
                    WATCHLIST
                  </p>
                  <div className="mt-3 space-y-2">
                    {watchlist.map((item) => (
                      <div
                        key={item.pair}
                        className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] px-3 py-2"
                      >
                        <span className="text-[12px] text-zinc-300">
                          {item.pair}
                        </span>
                        <span className="font-mono text-[11px] text-zinc-400">
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="mt-5 text-[10px] tracking-[0.16em] text-zinc-500">
                    AI INSIGHTS
                  </p>
                  <p className="mt-2 text-[12px] leading-5 text-zinc-400">
                    Momentum remains constructive on BTC. Volatility is moderate.
                    Sentiment reads bullish in this demonstration.
                  </p>

                  <p className="mt-5 text-[10px] tracking-[0.16em] text-zinc-500">
                    COPY ACTIVITY
                  </p>
                  <p className="mt-2 text-[12px] leading-5 text-zinc-400">
                    Sample follow: Alex Morgan · Crypto Strategy. No live
                    execution.
                  </p>
                  <p className="mt-3 font-mono text-[11px] text-zinc-600">
                    {formatPrice(104284.2)}
                  </p>
                </aside>
              </div>
            </div>
            <div className="mx-auto mt-px h-8 w-[72%] rounded-b-[28px] bg-gradient-to-b from-white/5 to-transparent opacity-40 blur-sm" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
