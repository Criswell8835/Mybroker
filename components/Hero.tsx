"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CryptoMarketVisualization } from "@/components/CryptoMarketVisualization";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="top"
      className="relative px-5 pb-8 pt-36 sm:px-8 sm:pt-40 lg:px-12 lg:pt-44"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="ambient -left-28 top-16 h-[380px] w-[380px] bg-[rgba(200,16,46,0.08)]" />
        <div className="ambient right-[-120px] top-48 h-[320px] w-[320px] bg-[rgba(255,255,255,0.03)]" />
        <div className="absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.035),transparent_55%)]" />
      </div>

      <div className="relative mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-[720px] text-center">
          <h1 className="text-[48px] font-normal leading-[0.94] tracking-[-0.05em] text-white sm:text-[72px] lg:text-[88px]">
            Trade Crypto.
            <br />
            Think Smarter.
          </h1>

          <p className="mx-auto mt-8 max-w-[480px] text-[15px] font-normal leading-7 tracking-[0.01em] text-zinc-400 sm:text-[16px] sm:leading-8">
            AI-powered market intelligence and copy trading, built for the next
            generation of crypto traders.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-3.5">
            <a href="#ai-trading" className="btn-primary w-full sm:w-auto">
              Start Trading
            </a>
            <a href="#copy-trading" className="btn-secondary w-full sm:w-auto">
              Explore Copy Trading
            </a>
          </div>
        </div>

        <motion.div
          className="relative mt-20 lg:mt-24"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <CryptoMarketVisualization />
        </motion.div>
      </div>
    </section>
  );
}
