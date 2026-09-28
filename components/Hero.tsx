"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CryptoMarketVisualization } from "@/components/CryptoMarketVisualization";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="top"
      className="relative px-5 pb-6 pt-28 sm:px-8 sm:pt-32 lg:px-12 lg:pt-36"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="ambient -left-24 top-10 h-[420px] w-[420px] bg-[rgba(200,16,46,0.14)]" />
        <div className="ambient right-[-80px] top-40 h-[380px] w-[380px] bg-[rgba(200,16,46,0.08)]" />
        <div className="absolute inset-x-0 top-0 h-[640px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.04),transparent_58%)]" />
      </div>

      <div className="relative mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.28em] text-zinc-400"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-crimson" />
            AI-POWERED CRYPTO TRADING
          </motion.p>

          <motion.h1
            className="mt-6 text-[46px] font-medium leading-[0.96] tracking-[-0.045em] text-white sm:text-[68px] lg:text-[84px]"
            initial={false}
          >
            Trade Crypto.
            <br />
            Think Smarter.
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-xl text-[15px] leading-7 text-zinc-400 sm:text-base"
            initial={false}
          >
            AI-powered market intelligence and copy trading, built for the next
            generation of crypto traders.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            initial={false}
          >
            <a
              href="#ai-trading"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-crimson px-6 text-sm font-medium text-white transition-colors hover:bg-crimson-soft sm:w-auto"
            >
              Start Trading
              <ArrowRight size={16} />
            </a>
            <a
              href="#copy-trading"
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 text-sm text-zinc-200 transition-colors hover:border-white/20 hover:bg-white/[0.05] sm:w-auto"
            >
              Explore Trading
            </a>
          </motion.div>
        </div>

        <motion.div
          className="relative mt-14 lg:mt-16"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <CryptoMarketVisualization />
        </motion.div>
      </div>
    </section>
  );
}
