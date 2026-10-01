import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/Reveal";

const previews = [
  {
    to: "/ai-trading",
    eyebrow: "AI TRADING",
    title: "Set the rules. Let the desk follow them.",
    text: "Choose an asset, configure a strategy and risk limits, then monitor or pause the session.",
    cta: "View AI Trading",
  },
  {
    to: "/copy-trading",
    eyebrow: "COPY TRADING",
    title: "Follow an approach you can read.",
    text: "Compare strategy types, choose what to follow, and keep the relationship in view.",
    cta: "View Copy Trading",
  },
  {
    to: "/markets",
    eyebrow: "MARKETS",
    title: "A quieter look at the majors.",
    text: "Sample prices, change, and charts for BTC, ETH, SOL, BNB, and XRP.",
    cta: "View Markets",
  },
  {
    to: "/features",
    eyebrow: "PLATFORM",
    title: "Research, analytics, and account tools.",
    text: "Market context, portfolio views, alerts, and the controls around an account.",
    cta: "View Features",
  },
  {
    to: "/pricing",
    eyebrow: "PRICING",
    title: "Free, Pro, and Advanced.",
    text: "Three plans. Pro is marked Most Popular. Paid plans start at account creation.",
    cta: "View Pricing",
  },
];

export function HomePreviews() {
  return (
    <section className="px-5 pb-28 sm:px-8 lg:px-12 lg:pb-36">
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="max-w-xl">
          <p className="text-[11px] tracking-[0.26em] text-zinc-500">THE PLATFORM</p>
          <h2 className="mt-5 text-[34px] font-normal leading-[1.06] tracking-[-0.045em] text-white sm:text-[46px]">
            Five places to look closer.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {previews.map((item, index) => (
            <Reveal key={item.to} delay={index * 0.04} className={index === 0 ? "md:col-span-2" : undefined}>
              <article className="flex h-full flex-col rounded-[18px] border border-white/[0.07] bg-[#0c0c0c] px-6 py-6 sm:px-8 sm:py-8">
                <p className="text-[11px] tracking-[0.2em] text-orange">{item.eyebrow}</p>
                <h3 className="mt-4 max-w-lg text-[26px] font-normal tracking-[-0.04em] text-white sm:text-[32px]">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-md text-[14px] leading-6 text-zinc-400">{item.text}</p>
                <Link to={item.to} className="mt-6 inline-flex items-center gap-2 text-[13px] text-white">
                  {item.cta}
                  <ArrowRight size={14} />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
