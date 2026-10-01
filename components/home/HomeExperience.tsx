import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CountStat } from "@/components/home/CountStat";
import { MiniSpark } from "@/components/MiniSpark";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";
import { formatChange, formatPrice, sparklineSets, tableAssets } from "@/lib/market-data";
import {
  platformOffers,
  platformStats,
  prototypeTraders,
  testimonials,
  whyPoints,
} from "@/lib/platform-content";

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <Reveal className="max-w-2xl">
      <p className="text-[11px] tracking-[0.26em] text-zinc-500">{eyebrow}</p>
      <h2 className="mt-5 text-[34px] font-normal leading-[1.05] tracking-[-0.045em] text-white sm:text-[48px]">
        {title}
      </h2>
      {text ? <p className="mt-5 max-w-lg text-[15px] leading-7 text-zinc-400">{text}</p> : null}
    </Reveal>
  );
}

export function PlatformStats() {
  return (
    <section className="border-y border-white/[0.06] px-5 py-14 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1200px] gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {platformStats.map((stat) => (
          <div key={stat.id} className="border-l border-white/[0.08] pl-5">
            <p className="text-[42px] font-normal tracking-[-0.05em] text-white sm:text-[52px]">
              {stat.countTo != null && stat.figure.startsWith(String(stat.countTo)) ? (
                <>
                  <CountStat to={stat.countTo} />
                  <span className="text-orange">{stat.figure.slice(String(stat.countTo).length)}</span>
                </>
              ) : (
                <span className="text-orange">{stat.figure}</span>
              )}
            </p>
            <p className="mt-2 text-[13px] tracking-[0.08em] text-zinc-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PlatformOffer() {
  return (
    <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="THE DESK"
          title="Everything you need to navigate the market."
          text="Market access, strategy, copy trading, and portfolio context in one environment."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {platformOffers.map((offer, index) => (
            <Reveal key={offer.title} delay={index * 0.04}>
              <article className="card-lift flex h-full flex-col rounded-[18px] border border-white/[0.07] bg-[#0c0c0c] px-6 py-6">
                <p className="font-mono text-[12px] tracking-[0.16em] text-orange">{offer.index}</p>
                <h3 className="mt-4 text-[22px] tracking-[-0.03em] text-white">{offer.title}</h3>
                <p className="mt-3 flex-1 text-[14px] leading-6 text-zinc-400">{offer.text}</p>
                {offer.to && offer.cta ? (
                  <Link to={offer.to} className="mt-6 inline-flex items-center gap-2 text-[13px] text-white">
                    {offer.cta}
                    <ArrowRight size={14} />
                  </Link>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyPlatform() {
  return (
    <section className="px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
      <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeading eyebrow="WHY THIS DESK" title="A platform organized around the trade." />
        <div className="divide-y divide-white/[0.07] border-t border-white/[0.07]">
          {whyPoints.map((point) => (
            <div key={point.index} className="grid gap-3 py-6 sm:grid-cols-[88px_1fr] sm:gap-8">
              <p className="font-mono text-[12px] tracking-[0.16em] text-orange">{point.index}</p>
              <div>
                <h3 className="text-[20px] tracking-[-0.03em] text-white">{point.title}</h3>
                <p className="mt-2 max-w-lg text-[14px] leading-6 text-zinc-400">{point.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductShowcase() {
  const btc = tableAssets[0];
  const eth = tableAssets[1];
  return (
    <section className="px-5 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="THE PRODUCT"
          title="Interfaces for the work, not the pitch."
        />
        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          <ShowcaseCard title="Real-time market intelligence" text="Trend, momentum, and the pair in one readout.">
            <div className="mt-6 rounded-xl border border-white/[0.07] bg-[#080808] p-4">
              <p className="text-[11px] tracking-[0.16em] text-zinc-500">{btc.symbol}/USDT</p>
              <p className="mt-2 text-[28px] tracking-[-0.04em] text-white">{formatPrice(btc.price)}</p>
              <p className="mt-1 text-[13px] text-orange">{formatChange(btc.change24h)}</p>
              <div className="mt-4">
                <MiniSpark values={sparklineSets[btc.id] ?? []} width={280} height={64} />
              </div>
            </div>
          </ShowcaseCard>
          <ShowcaseCard title="AI trading terminal" text="Asset, strategy, risk, and session status before anything is active.">
            <dl className="mt-6 grid grid-cols-2 gap-3 text-[13px]">
              {[
                ["Pair", `${btc.symbol}/USDT`],
                ["Status", "Ready"],
                ["Strategy", "Trend"],
                ["Risk", "Moderate"],
                ["Allocation", "—"],
                ["Position", "Flat"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/[0.07] bg-[#080808] px-3 py-3">
                  <dt className="text-[10px] tracking-[0.14em] text-zinc-500">{label}</dt>
                  <dd className="mt-1 text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </ShowcaseCard>
          <ShowcaseCard title="Copy trading" text="Strategy, risk, and a follow action that starts at the account.">
            <div className="mt-6 space-y-3">
              {prototypeTraders.slice(0, 2).map((trader) => (
                <div key={trader.id} className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-[#080808] px-3 py-3">
                  <div className="flex items-center gap-3">
                    <img src={trader.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                    <div>
                      <p className="text-[14px] text-white">{trader.name}</p>
                      <p className="text-[12px] text-zinc-500">{trader.strategy} · {trader.risk}</p>
                    </div>
                  </div>
                  <p className="text-[13px] text-orange">{trader.performance}</p>
                </div>
              ))}
            </div>
          </ShowcaseCard>
          <ShowcaseCard title="Portfolio analytics" text="Allocation across the pairs you are actually watching.">
            <div className="mt-6 space-y-3">
              {[
                ["Bitcoin", "42%"],
                ["Ethereum", "28%"],
                ["Large cap", "18%"],
                ["Other", "12%"],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="flex justify-between text-[12px] text-zinc-400">
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="mt-1.5 h-px bg-white/10">
                    <div className="h-px bg-orange" style={{ width: value }} />
                  </div>
                </div>
              ))}
            </div>
          </ShowcaseCard>
          <ShowcaseCard title="Advanced charts" text={`${eth.symbol}/USDT with the session range beside the move.`}>
            <div className="mt-6">
              <p className="text-[22px] text-white">{formatPrice(eth.price)}</p>
              <p className="mt-1 text-[12px] text-zinc-500">24h {formatPrice(eth.low24h)} – {formatPrice(eth.high24h)}</p>
              <div className="mt-4">
                <MiniSpark values={sparklineSets[eth.id] ?? []} width={320} height={72} />
              </div>
            </div>
          </ShowcaseCard>
          <ShowcaseCard title="Market overview" text="Featured pairs, movement, and a path into the full market page.">
            <ul className="mt-6 divide-y divide-white/[0.06]">
              {tableAssets.slice(0, 4).map((asset) => (
                <li key={asset.id} className="flex items-center justify-between py-2.5 text-[13px]">
                  <span className="text-white">{asset.symbol}/USDT</span>
                  <span className={asset.change24h < 0 ? "text-crimson" : "text-orange"}>{formatChange(asset.change24h)}</span>
                </li>
              ))}
            </ul>
          </ShowcaseCard>
        </div>
      </div>
    </section>
  );
}

function ShowcaseCard({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <article className="card-lift rounded-[18px] border border-white/[0.07] bg-[#0c0c0c] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-7">
      <h3 className="text-[22px] tracking-[-0.03em] text-white">{title}</h3>
      <p className="mt-2 max-w-md text-[14px] leading-6 text-zinc-400">{text}</p>
      {children}
    </article>
  );
}

export function AiTradingBand() {
  const steps = ["Choose asset", "Configure strategy", "Set risk", "Activate", "Monitor"];
  return (
    <section className="px-5 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="AI TRADING"
            title="Let your strategy work around the clock."
            text="Choose the asset, set the strategy and the risk, then keep the session where you can see it and stop it."
          />
          <ol className="mt-8 space-y-3">
            {steps.map((step, index) => (
              <li key={step} className="flex items-center gap-3 text-[14px] text-zinc-300">
                <span className="font-mono text-[11px] text-orange">0{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <Link to="/ai-trading" className="mt-8 inline-flex items-center gap-2 text-[13px] text-white">
            Explore AI Trading
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="rounded-[18px] border border-white/[0.08] bg-[#0c0c0c] p-6 shadow-[0_32px_80px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between">
            <p className="text-[12px] tracking-[0.16em] text-zinc-500">BTC/USDT</p>
            <p className="text-[12px] text-orange">Ready</p>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-4 text-[13px]">
            {[
              ["Strategy", "Trend following"],
              ["Allocation", "Unset"],
              ["Position", "Flat"],
              ["P&L", "—"],
              ["Risk", "Moderate"],
              ["Activity", "Idle"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[10px] tracking-[0.14em] text-zinc-500">{label}</dt>
                <dd className="mt-1 text-white">{value}</dd>
              </div>
            ))}
          </dl>
          <Link to="/signup" className="btn-primary mt-8 w-full">
            Create Account
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function CopyTradingBand() {
  return (
    <section className="px-5 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="COPY TRADING"
          title="Follow strategies. Trade with conviction."
          text="These profiles illustrate the interface. They are not a live leaderboard."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {prototypeTraders.map((trader) => (
            <article key={trader.id} className="rounded-[18px] border border-white/[0.07] bg-[#0c0c0c] p-5">
              <div className="flex items-center gap-3">
                <img
                  src={trader.avatar}
                  alt=""
                  className="h-10 w-10 rounded-full border border-white/[0.08] object-cover"
                />
                <div>
                  <p className="text-[15px] text-white">{trader.name}</p>
                  <p className="text-[12px] text-zinc-500">{trader.strategy}</p>
                </div>
              </div>
              <dl className="mt-5 grid grid-cols-3 gap-2 text-[12px]">
                <div>
                  <dt className="text-zinc-500">Risk</dt>
                  <dd className="mt-1 text-white">{trader.risk}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Result</dt>
                  <dd className="mt-1 text-orange">{trader.performance}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Followers</dt>
                  <dd className="mt-1 text-white">{trader.followers}</dd>
                </div>
              </dl>
              <Link to="/signup" className="btn-secondary mt-5 w-full">
                Copy
              </Link>
            </article>
          ))}
        </div>
        <Link to="/copy-trading" className="mt-8 inline-flex items-center gap-2 text-[13px] text-white">
          Explore Copy Trading
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

export function MarketsBand() {
  return (
    <section className="px-5 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="MARKETS" title="The pairs on the desk." text="Illustrative prices for the featured USDT markets." />
          <Link to="/markets" className="inline-flex items-center gap-2 text-[13px] text-white">
            Explore Markets
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {tableAssets.map((asset) => {
            const down = asset.change24h < 0;
            return (
              <article key={asset.id} className="rounded-[18px] border border-white/[0.07] bg-[#0c0c0c] p-4">
                <p className="text-[12px] tracking-[0.12em] text-zinc-500">{asset.symbol}/USDT</p>
                <p className="mt-3 text-[20px] tracking-[-0.03em] text-white">{formatPrice(asset.price)}</p>
                <p className={cn("mt-1 text-[12px]", down ? "text-crimson" : "text-orange")}>{formatChange(asset.change24h)}</p>
                <div className="mt-4">
                  <MiniSpark values={sparklineSets[asset.id] ?? []} width={140} height={36} tone={down ? "crimson" : "orange"} />
                </div>
                <p className="mt-3 text-[11px] text-zinc-500">{asset.market} · {asset.volume}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function TestimonialRail() {
  const loop = [...testimonials, ...testimonials];
  return (
    <section className="overflow-hidden px-5 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="FROM THE DESK" title="How the workflow is described." />
          <Link to="/reviews" className="inline-flex items-center gap-2 text-[13px] text-white">
            Read reviews
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
      <div className="mt-12 flex snap-x gap-4 overflow-x-auto px-5 pb-2 md:hidden">
        {testimonials.map((item) => (
          <TestimonialCard key={item.id} item={item} className="min-w-[84%] snap-start" />
        ))}
      </div>
      <div className="mt-12 hidden overflow-hidden md:block">
        <div className="testimonial-track">
          {loop.map((item, index) => (
            <TestimonialCard key={`${item.id}-${index}`} item={item} className="w-[360px]" />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  item,
  className,
}: {
  item: (typeof testimonials)[number];
  className?: string;
}) {
  return (
    <article className={cn("rounded-[18px] border border-white/[0.07] bg-[#0c0c0c] p-5", className)}>
      <div className="flex items-center gap-3">
        <img src={item.photo} alt="" className="h-11 w-11 rounded-full object-cover" />
        <div>
          <p className="text-[14px] text-white">{item.name}</p>
          <p className="text-[12px] text-zinc-500">{item.role} · {item.location}</p>
        </div>
      </div>
      <p className="mt-4 text-[12px] tracking-[0.14em] text-orange">{"★".repeat(item.rating)}</p>
      <p className="mt-3 text-[14px] leading-6 text-zinc-300">“{item.quote}”</p>
      <p className="mt-4 text-[11px] tracking-[0.08em] text-zinc-600">{item.date}</p>
    </article>
  );
}
