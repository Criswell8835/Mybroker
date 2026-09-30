
import { Reveal } from "@/components/Reveal";
import { MiniSpark } from "@/components/MiniSpark";
import { formatChange, formatPrice, marketAssets, sparklineSets, aiAnalysis } from "@/lib/market-data";
import { portfolioDemo } from "@/lib/portfolio";
import { cn } from "@/lib/cn";

export function Features() {
  const btc = marketAssets[0];
  const markets = marketAssets.slice(0, 4);

  return (
    <section
      id="features"
      className="scroll-mt-24 px-5 py-28 sm:px-8 lg:px-12 lg:py-36"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="max-w-2xl">
          <p className="text-[11px] tracking-[0.28em] text-zinc-500">
            FEATURES
          </p>
          <h2 className="mt-5 text-[34px] font-normal leading-[1.06] tracking-[-0.045em] text-white sm:text-[46px]">
            Everything you need to navigate crypto.
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-7 text-zinc-400">
            One intelligent platform for market discovery, AI-assisted trading
            and copy trading.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <Reveal className="lg:row-span-2">
            <article className="card-lift group flex h-full flex-col overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#0c0c0c]">
              <div className="px-6 pt-6 sm:px-8 sm:pt-8">
                <p className="text-[11px] tracking-[0.2em] text-orange">AI TRADING</p>
                <h3 className="mt-3 text-[22px] font-normal tracking-[-0.03em] text-white">
                  Intelligence on the desk
                </h3>
                <p className="mt-3 max-w-md text-[14px] leading-6 text-zinc-400">
                  Read price, momentum and sentiment beside a live-style market
                  chart before you act.
                </p>
              </div>
              <div className="relative mx-5 mt-6 flex-1 overflow-hidden rounded-xl border border-white/[0.07] bg-[#080808] sm:mx-7">
                <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                  <div>
                    <p className="text-[10px] tracking-[0.16em] text-zinc-500">
                      {btc.pair}
                    </p>
                    <p className="mt-1 text-[18px] tracking-[-0.03em] text-white">
                      {formatPrice(btc.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[12px] text-orange">
                      {formatChange(btc.change24h)}
                    </p>
                  </div>
                </div>
                <div className="h-[118px] px-3 pt-3">
                  <MiniSpark values={sparklineSets.btc} width={420} height={110} />
                </div>
                <div className="grid grid-cols-3 gap-px border-t border-white/[0.06] bg-white/[0.04]">
                  {[
                    ["Momentum", aiAnalysis.momentum],
                    ["Sentiment", aiAnalysis.sentiment],
                    ["Trend", aiAnalysis.trend],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-[#080808] px-3 py-3">
                      <p className="text-[9px] tracking-[0.14em] text-zinc-500">
                        {label}
                      </p>
                      <p className="mt-1 text-[12px] text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-6" />
            </article>
          </Reveal>

          <Reveal delay={0.06}>
            <article className="card-lift h-full rounded-[18px] border border-white/[0.07] bg-[#0c0c0c] p-6 sm:p-7">
              <p className="text-[11px] tracking-[0.2em] text-zinc-500">
                COPY TRADING
              </p>
              <h3 className="mt-3 text-[18px] tracking-[-0.02em] text-white">
                Discover. Review. Follow.
              </h3>
              <p className="mt-2 text-[13px] leading-6 text-zinc-400">
                Compare strategy categories and risk context before you follow
                an approach.
              </p>
              <div className="mt-5 space-y-3">
                {[
                  ["Momentum", "Majors · Moderate"],
                  ["Trend following", "Large cap · Moderate"],
                  ["Relative value", "Cross-market · Low"],
                ].map(([name, detail]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/30 px-4 py-3"
                  >
                    <p className="text-[13px] text-white">{name}</p>
                    <p className="text-[11px] text-zinc-500">{detail}</p>
                  </div>
                ))}
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.1}>
            <article className="card-lift h-full rounded-[18px] border border-white/[0.07] bg-[#0c0c0c] p-6 sm:p-7">
              <p className="text-[11px] tracking-[0.2em] text-zinc-500">
                MARKET INTELLIGENCE
              </p>
              <h3 className="mt-3 text-[18px] tracking-[-0.02em] text-white">
                Session overview
              </h3>
              <p className="mt-2 text-[13px] leading-6 text-zinc-400">
                Watch majors with 24H movement and sentiment in one terminal
                strip.
              </p>
              <ul className="mt-5 space-y-2">
                {markets.map((asset) => {
                  const down = asset.change24h < 0;
                  return (
                    <li
                      key={asset.id}
                      className="flex items-center justify-between gap-3 border-b border-white/[0.05] py-2 last:border-0"
                    >
                      <span className="text-[12px] text-zinc-300">{asset.pair}</span>
                      <span className="font-mono text-[12px] text-zinc-400">
                        {formatPrice(asset.price)}
                      </span>
                      <span
                        className={cn(
                          "w-14 text-right font-mono text-[12px]",
                          down ? "text-crimson" : "text-orange",
                        )}
                      >
                        {formatChange(asset.change24h)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 flex items-center justify-between rounded-lg border border-white/[0.06] px-3 py-2.5">
                <span className="text-[11px] text-zinc-500">Sentiment</span>
                <span className="text-[12px] text-white">{aiAnalysis.sentiment}</span>
              </div>
            </article>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="mt-4">
          <article className="card-lift overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#0c0c0c] p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-8 lg:flex-row">
              <div className="max-w-sm">
                <p className="text-[11px] tracking-[0.2em] text-zinc-500">
                  ADVANCED ANALYTICS
                </p>
                <h3 className="mt-3 text-[18px] tracking-[-0.02em] text-white">
                  Portfolio structure at a glance
                </h3>
                <p className="mt-3 text-[13px] leading-6 text-zinc-400">
                  Allocation, exposure and performance presented with the same
                  restraint as a private-bank desk.
                </p>
              </div>
              <ul className="min-w-0 flex-1 space-y-3">
                {portfolioDemo.allocation.map((item) => (
                  <li key={item.name}>
                    <div className="mb-1.5 flex items-center justify-between text-[12px]">
                      <span className="text-zinc-400">{item.name}</span>
                      <span className="font-mono text-zinc-300">{item.pct}%</span>
                    </div>
                    <div className="h-px bg-white/[0.06]">
                      <div
                        className="h-px bg-orange/70"
                        style={{ width: `${item.pct}%`, opacity: 0.35 + item.pct / 100 }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
