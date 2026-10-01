import { AccountCta } from "@/components/AccountCta";
import { CopyTradingSection } from "@/components/CopyTradingSection";
import { CopyTradingSteps } from "@/components/CopyTradingSteps";
import { PublicShell } from "@/components/PublicShell";
import { Reveal } from "@/components/Reveal";

const points = [
  { title: "Discover", text: "Browse strategy types rather than a list of invented trader profiles." },
  { title: "Review", text: "Read the approach, market focus, and how risk is described." },
  { title: "Choose", text: "Decide which approach fits the way you want to participate." },
  { title: "Allocate", text: "Set how much of an account relationship should follow that approach." },
  { title: "Copy", text: "Follow the strategy’s subsequent activity from one account view." },
  { title: "Monitor", text: "Keep the relationship, allocation, and status visible so you can pause it." },
];

export function CopyTradingPage() {
  return (
    <PublicShell>
      <section className="px-5 pb-4 pt-32 sm:px-8 lg:px-12 lg:pt-40">
        <Reveal className="mx-auto max-w-[1200px]">
          <p className="text-[11px] tracking-[0.26em] text-zinc-500">COPY TRADING</p>
          <h1 className="mt-5 max-w-3xl text-[40px] font-normal leading-[1.02] tracking-[-0.045em] text-white sm:text-[60px]">
            Follow a strategy you can evaluate.
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-7 text-zinc-400">
            Copy Trading is presented as a product workflow. This page does not
            publish named traders or performance records.
          </p>
        </Reveal>
      </section>
      <section className="px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1200px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((point) => (
            <article key={point.title} className="rounded-[18px] border border-white/[0.07] bg-[#0c0c0c] px-5 py-5">
              <h2 className="text-[16px] text-white">{point.title}</h2>
              <p className="mt-2 text-[13px] leading-6 text-zinc-400">{point.text}</p>
            </article>
          ))}
        </div>
      </section>
      <CopyTradingSection />
      <CopyTradingSteps />
      <AccountCta
        title="Create an account to follow a strategy."
        text="You can review the product here. Following starts after an account exists."
        label="Create Account"
      />
    </PublicShell>
  );
}
