"use client";

import { ArrowUpRight, Brain, Copy, LineChart, Workflow } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";

const features = [
  {
    icon: Brain,
    title: "AI Market Intelligence",
    description:
      "Read momentum, sentiment and volatility in one market view before you act.",
    className: "md:col-span-2",
    extra: (
      <div className="mt-8 flex items-end gap-8 text-sm">
        <div>
          <p className="text-[10px] tracking-[0.16em] text-zinc-500">MOMENTUM</p>
          <p className="mt-1 text-white">Strong</p>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.16em] text-zinc-500">SENTIMENT</p>
          <p className="mt-1 text-white">Bullish</p>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.16em] text-zinc-500">VOLATILITY</p>
          <p className="mt-1 text-white">Moderate</p>
        </div>
      </div>
    ),
  },
  {
    icon: Workflow,
    title: "Automated Strategies",
    description:
      "Inspect momentum, trend and analysis frameworks without surrendering judgment.",
    className: "",
    extra: null,
  },
  {
    icon: Copy,
    title: "Copy Trading",
    description:
      "Discover sample traders, review risk and follow strategies that match your profile.",
    className: "",
    extra: null,
  },
  {
    icon: LineChart,
    title: "Advanced Analytics",
    description:
      "Charts, levels and session context presented with the restraint of a trading desk.",
    className: "md:col-span-2",
    extra: (
      <div className="mt-8 h-[42px] w-full bg-[linear-gradient(to_right,transparent,rgba(200,16,46,0.45),rgba(255,255,255,0.35),transparent)] opacity-70" />
    ),
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="scroll-mt-24 px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="max-w-2xl">
          <p className="text-[11px] font-medium tracking-[0.26em] text-zinc-500">
            FEATURES
          </p>
          <h2 className="mt-4 text-[36px] font-medium leading-[1.05] tracking-[-0.035em] text-white sm:text-[48px]">
            Everything you need to navigate crypto markets.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal
                key={feature.title}
                delay={index * 0.06}
                className={cn(feature.className)}
              >
                <a
                  href={
                    feature.title === "Copy Trading"
                      ? "#copy-trading"
                      : "#ai-trading"
                  }
                  className="group flex h-full flex-col rounded-[24px] border border-white/8 bg-white/[0.025] p-6 transition-colors duration-300 hover:border-white/16 hover:bg-white/[0.04] sm:p-7"
                >
                  <div className="flex items-start justify-between">
                    <Icon className="text-zinc-300" size={18} />
                    <ArrowUpRight
                      size={16}
                      className="text-zinc-600 transition-colors group-hover:text-white"
                    />
                  </div>
                  <h3 className="mt-8 text-lg font-medium tracking-tight text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-[14px] leading-6 text-zinc-400">
                    {feature.description}
                  </p>
                  {feature.extra}
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
