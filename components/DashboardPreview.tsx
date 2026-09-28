"use client";

import { useState } from "react";
import { DemoBadge } from "@/components/DemoBadge";
import {
  AllocationRing,
  PerformanceChart,
  RangeTabs,
} from "@/components/PerformanceChart";
import { Reveal } from "@/components/Reveal";
import { formatPrice } from "@/lib/market-data";
import {
  performanceByRange,
  portfolioDemo,
  type PortfolioRange,
} from "@/lib/portfolio";

const ranges: PortfolioRange[] = ["1D", "1W", "1M", "3M", "1Y"];

export function DashboardPreview() {
  const [range, setRange] = useState<PortfolioRange>("1M");
  const equity = performanceByRange[range];

  return (
    <section className="relative scroll-mt-24 px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="mb-12 max-w-xl">
          <p className="text-[11px] tracking-[0.28em] text-zinc-500">
            PLATFORM PREVIEW
          </p>
          <h2 className="mt-5 text-[34px] font-normal leading-[1.08] tracking-[-0.04em] text-white sm:text-[46px]">
            One workspace for intelligence and copy trading.
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="relative">
            <div className="ambient left-1/2 top-8 h-[240px] w-[480px] -translate-x-1/2 bg-[rgba(200,16,46,0.08)]" />
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#090909] shadow-[0_40px_120px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#0c0c0c] px-4 py-2.5">
                <span className="h-2 w-2 rounded-full bg-white/12" />
                <span className="h-2 w-2 rounded-full bg-white/12" />
                <span className="h-2 w-2 rounded-full bg-white/12" />
                <div className="ml-3 flex-1 text-center font-mono text-[10px] tracking-[0.16em] text-zinc-600">
                  app.kaivo.trade
                </div>
                <DemoBadge>PRODUCT PREVIEW</DemoBadge>
              </div>

              <div className="grid lg:grid-cols-[168px_minmax(0,1fr)]">
                <aside className="hidden border-r border-white/[0.06] p-5 lg:block">
                  <p className="text-[10px] tracking-[0.22em] text-zinc-600">
                    KAIVO
                  </p>
                  <nav className="mt-7 space-y-0.5 text-[13px]">
                    {["Overview", "Markets", "AI Desk", "Copy", "Analytics"].map(
                      (item, index) => (
                        <div
                          key={item}
                          className={`px-2.5 py-2 ${
                            index === 0
                              ? "border-l border-crimson text-white"
                              : "border-l border-transparent text-zinc-500"
                          }`}
                        >
                          {item}
                        </div>
                      ),
                    )}
                  </nav>
                  <div className="mt-10 space-y-3 border-t border-white/[0.06] pt-5 font-mono text-[10px] tracking-[0.08em] text-zinc-600">
                    <p>ID {portfolioDemo.id}</p>
                    <p>Updated {portfolioDemo.updated}</p>
                  </div>
                </aside>

                <div className="min-w-0 p-4 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] tracking-[0.2em] text-zinc-500">
                        TOTAL PORTFOLIO VALUE
                      </p>
                      <p className="mt-2 text-[34px] font-normal tracking-[-0.04em] text-white sm:text-[42px]">
                        {formatPrice(portfolioDemo.total)}
                      </p>
                      <p className="mt-2.5 text-[14px] tracking-[-0.01em] text-zinc-200">
                        {`+${formatPrice(portfolioDemo.changeValue)}`}{" "}
                        <span className="text-zinc-500">
                          {`+${portfolioDemo.changePct.toFixed(2)}%`} · 24H
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <DemoBadge>DEMO / SAMPLE DATA</DemoBadge>
                      <RangeTabs
                        value={range}
                        options={ranges}
                        onChange={(next) => setRange(next as PortfolioRange)}
                      />
                    </div>
                  </div>

                  <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.04] sm:grid-cols-4">
                    {[
                      ["Available", formatPrice(portfolioDemo.available)],
                      ["Invested", formatPrice(portfolioDemo.invested)],
                      ["Cash", `${portfolioDemo.cashPct}%`],
                      ["Risk", portfolioDemo.risk],
                    ].map(([label, value]) => (
                      <div key={label} className="bg-[#090909] px-4 py-3">
                        <dt className="text-[10px] tracking-[0.16em] text-zinc-500">
                          {label}
                        </dt>
                        <dd className="mt-1 text-[13px] text-white">{value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-5 grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
                    <div className="rounded-lg border border-white/[0.06] bg-black/20 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] tracking-[0.18em] text-zinc-500">
                          PORTFOLIO PERFORMANCE
                        </p>
                        <p className="text-[10px] text-zinc-600">{range} · demo</p>
                      </div>
                      <div className="mt-2 h-[180px] sm:h-[210px]">
                        <PerformanceChart values={equity} idPrefix={`eq-${range}`} />
                      </div>
                    </div>

                    <div className="rounded-lg border border-white/[0.06] bg-black/20 p-4">
                      <p className="text-[10px] tracking-[0.18em] text-zinc-500">
                        ASSET ALLOCATION
                      </p>
                      <div className="mt-4 flex items-center gap-5">
                        <AllocationRing segments={portfolioDemo.allocation} />
                        <ul className="min-w-0 flex-1 space-y-2">
                          {portfolioDemo.allocation.map((item) => (
                            <li
                              key={item.name}
                              className="flex items-center justify-between gap-3 text-[12px]"
                            >
                              <span className="flex items-center gap-2 text-zinc-400">
                                <span
                                  className="h-1.5 w-1.5 rounded-full"
                                  style={{ background: item.tone }}
                                />
                                {item.name}
                              </span>
                              <span className="font-mono text-zinc-300">
                                {item.pct}%
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    <div className="rounded-lg border border-white/[0.06] p-4 lg:col-span-1">
                      <p className="text-[10px] tracking-[0.18em] text-zinc-500">
                        MARKET EXPOSURE
                      </p>
                      <ul className="mt-4 space-y-3">
                        {portfolioDemo.exposureBands.map((band) => (
                          <li key={band.name}>
                            <div className="mb-1 flex justify-between text-[11px] text-zinc-400">
                              <span>{band.name}</span>
                              <span className="font-mono">{band.pct}%</span>
                            </div>
                            <div className="h-px bg-white/[0.06]">
                              <div
                                className="h-px bg-white/35"
                                style={{ width: `${band.pct}%` }}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-lg border border-white/[0.06] p-4">
                      <p className="text-[10px] tracking-[0.18em] text-zinc-500">
                        RECENT ACTIVITY
                      </p>
                      <ul className="mt-4 space-y-3">
                        {portfolioDemo.activity.map((item) => (
                          <li key={item.time} className="flex gap-3">
                            <span className="w-10 shrink-0 font-mono text-[10px] text-zinc-600">
                              {item.time}
                            </span>
                            <span>
                              <span className="block text-[12px] text-zinc-200">
                                {item.title}
                              </span>
                              <span className="mt-0.5 block text-[11px] text-zinc-500">
                                {item.detail}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-lg border border-white/[0.06] p-4">
                        <p className="text-[10px] tracking-[0.18em] text-zinc-500">
                          WATCHLIST
                        </p>
                        <ul className="mt-3 space-y-2">
                          {portfolioDemo.watchlist.map((item) => (
                            <li
                              key={item.pair}
                              className="flex items-center justify-between text-[12px]"
                            >
                              <span className="text-zinc-300">{item.pair}</span>
                              <span className="font-mono text-zinc-400">
                                {item.price}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg border border-white/[0.06] p-4">
                        <p className="text-[10px] tracking-[0.18em] text-zinc-500">
                          AI INSIGHTS
                        </p>
                        <p className="mt-2 text-[12px] leading-5 text-zinc-400">
                          Momentum remains constructive. Volatility is moderate.
                          Sentiment reads bullish in this demonstration.
                        </p>
                        <p className="mt-3 text-[10px] tracking-[0.14em] text-zinc-600">
                          COPY ACTIVITY
                        </p>
                        <p className="mt-1 text-[12px] text-zinc-400">
                          Sample follow: Alex Morgan · Crypto Strategy.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-auto h-6 w-[70%] bg-gradient-to-b from-white/[0.04] to-transparent opacity-50 blur-md" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
