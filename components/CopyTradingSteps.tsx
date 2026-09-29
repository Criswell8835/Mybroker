
import { Reveal } from "@/components/Reveal";
import { copyTradingSteps } from "@/lib/traders";

export function CopyTradingSteps() {
  return (
    <section id="copy-flow" className="scroll-mt-24 px-5 pb-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <p className="text-[11px] tracking-[0.28em] text-zinc-500">
            HOW COPY TRADING WORKS
          </p>
        </Reveal>

        <div className="relative mt-10">
          <div className="absolute left-[15px] top-2 hidden h-[calc(100%-16px)] w-px bg-white/10 md:left-0 md:right-0 md:top-5 md:h-px md:w-full md:block" />

          <div className="grid gap-8 md:grid-cols-3 md:gap-6">
            {copyTradingSteps.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.08}>
                <div className="relative pl-10 md:pl-0">
                  <div className="absolute left-0 top-1.5 flex h-[11px] w-[11px] items-center justify-center md:relative md:top-0 md:mb-6">
                    <span className="h-[11px] w-[11px] rounded-full border border-orange/80 bg-[#050505] shadow-[0_0_0_4px_rgba(232,92,36,0.12)]" />
                  </div>
                  <p className="font-mono text-[12px] tracking-[0.18em] text-orange">
                    {step.number}
                  </p>
                  <h3 className="mt-3 text-[16px] font-normal tracking-[-0.02em] text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-[13px] leading-6 text-zinc-500">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
