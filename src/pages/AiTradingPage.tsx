import { AccountCta } from "@/components/AccountCta";
import { AITradingSection } from "@/components/AITradingSection";
import { PublicShell } from "@/components/PublicShell";
import { Reveal } from "@/components/Reveal";
import { TradingStrategies } from "@/components/TradingStrategies";

const steps = [
  { title: "Choose an asset", text: "Start from a supported market you want the strategy to watch." },
  { title: "Configure strategy", text: "Select the approach, from momentum to trend following or a broader readout." },
  { title: "Set risk parameters", text: "Define the limits you are willing to accept before anything is active." },
  { title: "Activate AI Trading", text: "Turn the session on only after the asset, strategy, and risk are set." },
  { title: "Monitor positions", text: "Follow open activity and how the session is behaving." },
  { title: "Pause or stop", text: "Review the session and pause or stop it when you want control back." },
];

export function AiTradingPage() {
  return (
    <PublicShell>
      <section className="px-5 pb-8 pt-32 sm:px-8 lg:px-12 lg:pt-40">
        <Reveal className="mx-auto max-w-[1200px]">
          <p className="text-[11px] tracking-[0.26em] text-zinc-500">AI TRADING</p>
          <h1 className="mt-5 max-w-3xl text-[40px] font-normal leading-[1.02] tracking-[-0.045em] text-white sm:text-[60px]">
            Autonomous trading, within the limits you set.
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-7 text-zinc-400">
            AI Trading is a workflow for choosing a market, configuring a strategy,
            and staying able to pause it. It does not promise a profit.
          </p>
        </Reveal>
      </section>
      <section className="px-5 pb-8 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1200px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.04}>
              <article className="h-full rounded-[18px] border border-white/[0.07] bg-[#0c0c0c] px-5 py-5">
                <p className="font-mono text-[11px] tracking-[0.16em] text-orange">0{index + 1}</p>
                <h2 className="mt-3 text-[18px] tracking-[-0.02em] text-white">{step.title}</h2>
                <p className="mt-2 text-[13px] leading-6 text-zinc-400">{step.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <AITradingSection />
      <TradingStrategies />
      <AccountCta
        title="Open an account to configure AI Trading."
        text="Account creation is the start. Strategy controls are available after you sign in."
        label="Create Account"
      />
    </PublicShell>
  );
}
