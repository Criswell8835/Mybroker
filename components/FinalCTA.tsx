import { Link } from "react-router-dom";
import { Reveal } from "@/components/Reveal";

export function FinalCTA() {
  return (
    <section
      id="cta"
      className="relative scroll-mt-24 overflow-hidden px-5 py-28 sm:px-8 lg:px-12 lg:py-36"
    >
      <div className="ambient bottom-[-90px] left-1/2 h-[360px] w-[520px] -translate-x-1/2 bg-[rgba(232,92,36,0.14)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative mx-auto max-w-[820px] text-center">
        <Reveal>
          <h2 className="text-[42px] font-normal leading-[0.98] tracking-[-0.048em] text-white sm:text-[64px] lg:text-[76px]">
            Trade smarter.
            <br />
            Move with the market.
          </h2>
          <p className="mx-auto mt-7 max-w-md text-[15px] leading-7 text-zinc-400">
            Explore AI-powered crypto trading and copy trading from one powerful
            platform.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/signup" className="btn-primary w-full sm:w-auto">
              Start Trading
            </Link>
            <a href="#copy-trading" className="btn-secondary w-full sm:w-auto">
              Explore Copy Trading
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
