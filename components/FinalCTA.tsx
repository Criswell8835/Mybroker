"use client";

import { Reveal } from "@/components/Reveal";

export function FinalCTA() {
  return (
    <section
      id="cta"
      className="relative scroll-mt-24 overflow-hidden px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
    >
      <div className="ambient bottom-[-80px] left-1/2 h-[420px] w-[620px] -translate-x-1/2 bg-[rgba(200,16,46,0.22)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-crimson/40 to-transparent" />

      <div className="relative mx-auto max-w-[900px] text-center">
        <Reveal>
          <h2 className="text-[42px] font-medium leading-[0.98] tracking-[-0.045em] text-white sm:text-[64px] lg:text-[76px]">
            Trade smarter.
            <br />
            Move with the market.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[15px] leading-7 text-zinc-400">
            Explore AI-powered crypto trading and copy trading from one powerful
            platform.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#pricing"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-crimson px-6 text-sm font-medium text-white transition-colors hover:bg-crimson-soft sm:w-auto"
            >
              Get Started
            </a>
            <a
              href="#copy-trading"
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 text-sm text-zinc-200 transition-colors hover:bg-white/[0.05] sm:w-auto"
            >
              Explore Trading
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
