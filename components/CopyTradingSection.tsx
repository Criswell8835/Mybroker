"use client";

import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { TraderCard } from "@/components/TraderCard";
import { sampleTraders } from "@/lib/traders";

export function CopyTradingSection() {
  return (
    <section
      id="copy-trading"
      className="relative scroll-mt-24 px-5 py-28 sm:px-8 lg:px-12 lg:py-36"
    >
      <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
        <Reveal>
          <p className="text-[11px] tracking-[0.28em] text-zinc-500">
            COPY TRADING
          </p>
          <h2 className="mt-5 max-w-md text-[34px] font-normal leading-[1.08] tracking-[-0.04em] text-white sm:text-[46px]">
            Follow strategies you understand.
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-7 text-zinc-400">
            Discover traders, compare their approaches and explore strategies
            that match your preferred risk profile.
          </p>
          <a
            href="#copy-flow"
            className="mt-9 inline-flex items-center gap-2 text-[13px] tracking-[0.02em] text-white transition-colors hover:text-zinc-300"
          >
            Explore Traders
            <ArrowRight size={16} />
          </a>
        </Reveal>

        <div className="relative">
          <div className="absolute -inset-px hidden rounded-2xl bg-[radial-gradient(ellipse_at_top_right,rgba(200,16,46,0.07),transparent_48%)] lg:block" />
          <div className="relative grid gap-4">
            <Reveal delay={0.08}>
              <TraderCard trader={sampleTraders[0]} featured />
            </Reveal>
            <Reveal delay={0.16} className="lg:ml-10">
              <TraderCard trader={sampleTraders[1]} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
