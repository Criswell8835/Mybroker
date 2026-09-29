"use client";

import { ArrowRight } from "lucide-react";
import { MiniSpark } from "@/components/MiniSpark";
import { Reveal } from "@/components/Reveal";
import { APP_ROUTE } from "@/lib/brand";
import { cn } from "@/lib/cn";

const categories = [
  { name: "Momentum", focus: "Majors", risk: "Moderate", weight: 78 },
  { name: "Trend following", focus: "Large cap", risk: "Moderate", weight: 64 },
  { name: "Mean reversion", focus: "Liquid pairs", risk: "Low", weight: 46 },
  { name: "Relative value", focus: "Cross-market", risk: "Low", weight: 32 },
];

const riskMix = [
  { label: "Low", pct: 36, tone: "bg-white/35" },
  { label: "Moderate", pct: 46, tone: "bg-orange" },
  { label: "Higher", pct: 18, tone: "bg-crimson/80" },
];

const exposure = [
  { label: "Bitcoin", pct: 42 },
  { label: "Ethereum", pct: 28 },
  { label: "Large cap", pct: 18 },
  { label: "Other", pct: 12 },
];

const path = [18, 22, 20, 28, 26, 34, 31, 40, 38, 46, 44, 52];

const workflow = ["Discover", "Compare", "Allocate", "Follow"];

export function CopyTradingSection() {
  return (
    <section
      id="copy-trading"
      className="relative scroll-mt-24 px-5 py-28 sm:px-8 lg:px-12 lg:py-36"
    >
      <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-16">
        <Reveal>
          <p className="text-[11px] tracking-[0.26em] text-zinc-500">
            COPY TRADING
          </p>
          <h2 className="mt-5 max-w-md text-[34px] font-normal leading-[1.06] tracking-[-0.045em] text-white sm:text-[46px]">
            Follow strategies that match your approach.
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-7 text-zinc-400">
            Discover professional traders, compare their strategies, and explore
            approaches that match your preferred risk profile.
          </p>
          <a href={APP_ROUTE} className="btn-primary mt-9 w-full sm:w-auto">
            Explore Professional Traders
            <ArrowRight size={14} />
          </a>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#0c0c0c] shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
            <div className="pointer-events-none h-px bg-gradient-to-r from-transparent via-orange/40 to-transparent" />
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5 sm:px-6">
              <p className="text-[10px] tracking-[0.18em] text-zinc-500">
                STRATEGY MARKETPLACE
              </p>
              <p className="text-[10px] tracking-[0.16em] text-zinc-600">
                COMPARE
              </p>
            </div>

            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              <div className="border-b border-white/[0.06] lg:border-b-0 lg:border-r">
                <ul>
                  {categories.map((item) => (
                    <li
                      key={item.name}
                      className="border-b border-white/[0.05] px-5 py-4 last:border-b-0 sm:px-6"
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="text-[14px] tracking-[-0.01em] text-white">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-zinc-500">{item.focus}</p>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="h-px flex-1 bg-white/[0.06]">
                          <div
                            className="h-px bg-orange/80"
                            style={{ width: `${item.weight}%` }}
                          />
                        </div>
                        <span className="w-16 text-right text-[10px] tracking-[0.12em] text-zinc-500">
                          {item.risk}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-5 py-5 sm:px-6">
                <p className="text-[10px] tracking-[0.18em] text-zinc-500">
                  RISK MIX
                </p>
                <div className="mt-4 flex h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                  {riskMix.map((band) => (
                    <div
                      key={band.label}
                      className={cn("h-full", band.tone)}
                      style={{ width: `${band.pct}%` }}
                    />
                  ))}
                </div>
                <ul className="mt-4 space-y-2">
                  {riskMix.map((band) => (
                    <li
                      key={band.label}
                      className="flex items-center justify-between text-[12px]"
                    >
                      <span className="text-zinc-400">{band.label}</span>
                      <span className="font-mono text-zinc-500">{band.pct}%</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-6 text-[10px] tracking-[0.18em] text-zinc-500">
                  MARKET EXPOSURE
                </p>
                <ul className="mt-3 space-y-2.5">
                  {exposure.map((item) => (
                    <li key={item.label}>
                      <div className="mb-1 flex justify-between text-[11px] text-zinc-500">
                        <span>{item.label}</span>
                        <span className="font-mono">{item.pct}%</span>
                      </div>
                      <div className="h-px bg-white/[0.06]">
                        <div
                          className="h-px bg-white/35"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid gap-4 border-t border-white/[0.06] px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6">
              <div>
                <p className="text-[10px] tracking-[0.18em] text-zinc-500">
                  STRATEGY PATH
                </p>
                <div className="mt-2 h-9">
                  <MiniSpark values={path} width={280} height={36} />
                </div>
              </div>
              <ol className="flex flex-wrap gap-x-4 gap-y-2">
                {workflow.map((step, index) => (
                  <li
                    key={step}
                    className="text-[11px] tracking-[0.08em] text-zinc-500"
                  >
                    <span className="mr-1.5 font-mono text-orange">
                      0{index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
