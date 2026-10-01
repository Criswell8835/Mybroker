import { Features } from "@/components/Features";
import { PublicShell } from "@/components/PublicShell";
import { Reveal } from "@/components/Reveal";
import { SecuritySection } from "@/components/SecuritySection";
import { Link } from "react-router-dom";

const areas = [
  { title: "AI Trading", text: "Configure an asset, strategy, and risk limits, then pause or stop the session.", to: "/ai-trading" },
  { title: "Copy Trading", text: "Review strategy approaches and follow one after an account exists.", to: "/copy-trading" },
  { title: "Market Intelligence", text: "Read sample prices, change, and chart context before you decide.", to: "/markets" },
  { title: "Portfolio Analytics", text: "A portfolio view for positions and activity once an account is in use." },
  { title: "Alerts & Watchlists", text: "Lists and alerts are part of the plan structure. Delivery is not live in this preview." },
  { title: "Trading Tools", text: "Charts, strategy readouts, and market tables stay in one visual system." },
  { title: "Account Management", text: "Sign in, create an account, and return to the platform from the same navigation.", to: "/signup" },
];

export function FeaturesPage() {
  return (
    <PublicShell>
      <Features />
      <section className="px-5 pb-8 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1200px] gap-4 sm:grid-cols-2">
          {areas.map((area) => (
            <Reveal key={area.title}>
              <article className="h-full rounded-[18px] border border-white/[0.07] bg-[#0c0c0c] px-6 py-6">
                <h2 className="text-[18px] tracking-[-0.02em] text-white">{area.title}</h2>
                <p className="mt-2 text-[14px] leading-6 text-zinc-400">{area.text}</p>
                {area.to ? (
                  <Link to={area.to} className="mt-4 inline-block text-[13px] text-orange">
                    Open
                  </Link>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <SecuritySection />
    </PublicShell>
  );
}
