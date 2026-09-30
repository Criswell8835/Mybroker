import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { HeroAtmosphere } from "@/components/HeroAtmosphere";
import { HeroProductStage } from "@/components/HeroProductStage";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      <HeroAtmosphere />

      <div className="relative z-10 mx-auto max-w-[1120px] px-5 text-center sm:px-8">
        <h1 className="mx-auto max-w-[860px] text-[44px] font-normal leading-[0.98] tracking-[-0.048em] text-white sm:text-[70px] lg:text-[84px]">
          Trade Crypto.
          <br />
          Think Smarter.
        </h1>

        <p className="mx-auto mt-7 max-w-[440px] text-[15px] leading-[1.7] text-zinc-400 sm:mt-8 sm:text-[16px]">
          AI-powered market intelligence and copy trading, built for the next
          generation of crypto traders.
        </p>

        <div className="mt-10 flex justify-center">
          <Link to="/signup" className="btn-primary w-full sm:w-auto">
            Start Trading
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="relative z-10 mt-16 px-5 pb-20 sm:mt-20 sm:px-8 lg:mt-24 lg:pb-28">
        <HeroProductStage />
      </div>
    </section>
  );
}
