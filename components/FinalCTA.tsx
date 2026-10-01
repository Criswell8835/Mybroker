import { ArrowRight } from "lucide-react";
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

      <div className="relative mx-auto max-w-[860px] text-center">
        <Reveal>
          <h2 className="text-[42px] font-normal leading-[0.98] tracking-[-0.048em] text-white sm:text-[64px] lg:text-[76px]">
            Your next move
            <br />
            starts here.
          </h2>
          <p className="mx-auto mt-7 max-w-md text-[15px] leading-7 text-zinc-400">
            Create an account and explore the platform built for modern crypto trading.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/signup" className="btn-primary w-full sm:w-auto">
              Create Account
              <ArrowRight size={14} />
            </Link>
            <Link to="/markets" className="btn-secondary w-full sm:w-auto">
              Explore Markets
              <ArrowRight size={14} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
