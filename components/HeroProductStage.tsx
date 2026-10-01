
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CandlestickChart } from "@/components/CandlestickChart";
import { MiniSpark } from "@/components/MiniSpark";
import { cn } from "@/lib/cn";
import {
  aiAnalysis,
  candleSets,
  formatChange,
  formatPrice,
  marketAssets,
  sparklineSets,
} from "@/lib/market-data";

const pairs = marketAssets.filter((asset) =>
  ["btc", "eth", "sol"].includes(asset.id),
);

export function HeroProductStage() {
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState("btc");
  const asset = useMemo(
    () => pairs.find((item) => item.id === activeId) ?? pairs[0],
    [activeId],
  );
  const candles = candleSets[activeId] ?? candleSets.btc;
  const positive = asset.change24h >= 0;
  const btc = marketAssets[0];
  const eth = marketAssets[1];
  const sol = marketAssets[2];
  return (
    <div className="relative mx-auto max-w-[1180px]">
      <AssetCard
        pair={`${btc.symbol}/USDT`}
        price={formatPrice(btc.price)}
        change={formatChange(btc.change24h)}
        values={sparklineSets.btc}
        className="hidden xl:block left-0 top-12"
        delay={0.28}
        reduce={reduce}
        floatClass="float-slow"
      />
      <AssetCard
        pair={`${eth.symbol}/USDT`}
        price={formatPrice(eth.price)}
        change={formatChange(eth.change24h)}
        values={sparklineSets.eth}
        className="hidden xl:block right-0 top-8"
        delay={0.38}
        reduce={reduce}
        floatClass="float-slower"
      />
      <AssetCard
        pair={`${sol.symbol}/USDT`}
        price={formatPrice(sol.price)}
        change={formatChange(sol.change24h)}
        values={sparklineSets.sol}
        className="hidden xl:block left-0 bottom-10"
        delay={0.48}
        reduce={reduce}
        floatClass="float-slowest"
      />
      <CopyCard
        className="hidden xl:block right-0 bottom-6"
        delay={0.56}
        reduce={reduce}
      />

      <motion.div
        initial={false}
        className="relative xl:mx-[228px] xl:py-8"
      >
        <div className="pointer-events-none absolute -inset-x-16 top-6 h-32 bg-[radial-gradient(ellipse_at_top,rgba(232,92,36,0.1),transparent_72%)] blur-2xl" />

        <div className="relative overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#0c0c0c] shadow-[0_48px_120px_rgba(0,0,0,0.62),0_0_60px_rgba(232,92,36,0.05)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/45 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_0%,rgba(232,92,36,0.07),transparent_38%)]" />

          <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-4 sm:px-6">
            <div className="flex items-center gap-5">
              {pairs.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={cn(
                    "relative pb-1 text-[12px] tracking-[0.1em] transition-colors",
                    item.id === activeId
                      ? "text-white"
                      : "text-zinc-500 hover:text-zinc-300",
                  )}
                >
                  {`${item.symbol}/USDT`}
                  {item.id === activeId ? (
                    <span className="absolute inset-x-0 -bottom-[17px] h-px bg-orange" />
                  ) : null}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-[11px] tracking-[0.16em] text-zinc-600 sm:inline">
                1H
              </span>
            </div>
          </div>

          <div className="relative grid gap-8 px-5 py-6 sm:px-6 lg:grid-cols-[1fr_188px]">
            <div>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] tracking-[0.18em] text-zinc-500">
                    {`${asset.symbol}/USDT`}
                  </p>
                  <div className="mt-2 flex items-baseline gap-3">
                    <p className="text-[28px] font-normal tracking-[-0.03em] text-white sm:text-[34px]">
                      {formatPrice(asset.price)}
                    </p>
                    <span
                      className={cn(
                        "text-[13px]",
                        positive ? "text-orange" : "text-crimson",
                      )}
                    >
                      {formatChange(asset.change24h)}
                    </span>
                  </div>
                </div>
                <p className="font-mono text-[11px] text-zinc-600">
                  24H {formatPrice(asset.low24h)} — {formatPrice(asset.high24h)}
                </p>
              </div>
              <div className="h-[210px] sm:h-[248px] lg:h-[268px]">
                <CandlestickChart candles={candles} idPrefix={`hero-${activeId}`} />
              </div>
            </div>

            <aside className="flex flex-col justify-between border-t border-white/[0.06] pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
              <div>
                <p className="text-[10px] tracking-[0.2em] text-zinc-500">
                  AI ANALYSIS
                </p>
                <dl className="mt-5 space-y-3.5">
                  <Metric label="Momentum" value={aiAnalysis.momentum} />
                  <Metric label="Sentiment" value={aiAnalysis.sentiment} />
                  <Metric label="Volatility" value={aiAnalysis.volatility} />
                  <Metric label="Trend" value={aiAnalysis.trend} />
                  <Metric
                    label="Resistance"
                    value={formatPrice(aiAnalysis.keyLevels.resistance)}
                  />
                  <Metric
                    label="Support"
                    value={formatPrice(aiAnalysis.keyLevels.support)}
                  />
                </dl>
              </div>
              <p className="mt-7 text-[11px] leading-relaxed text-zinc-600">
                Model readout is illustrative and does not execute trades.
              </p>
            </aside>
          </div>
        </div>
      </motion.div>

      <div className="mt-5 grid grid-cols-2 gap-3 xl:hidden">
        <AssetCard
          pair={btc.pair}
          price={formatPrice(btc.price)}
          change={formatChange(btc.change24h)}
          values={sparklineSets.btc}
          className="relative"
          delay={0}
          reduce
        />
        <AssetCard
          pair={eth.pair}
          price={formatPrice(eth.price)}
          change={formatChange(eth.change24h)}
          values={sparklineSets.eth}
          className="relative"
          delay={0}
          reduce
        />
        <AssetCard
          pair={sol.pair}
          price={formatPrice(sol.price)}
          change={formatChange(sol.change24h)}
          values={sparklineSets.sol}
          className="relative"
          delay={0}
          reduce
        />
        <CopyCard className="relative" delay={0} reduce />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-white/[0.05] pb-2.5">
      <dt className="text-[11px] tracking-[0.04em] text-zinc-500">{label}</dt>
      <dd className="text-[12px] text-white">{value}</dd>
    </div>
  );
}

function AssetCard({
  pair,
  price,
  change,
  values = [],
  className,
  delay,
  reduce,
  floatClass = "float-slow",
}: {
  pair: string;
  price: string;
  change: string;
  values?: number[];
  className?: string;
  delay: number;
  reduce?: boolean | null;
  floatClass?: string;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "product-chip z-20 min-w-[188px] rounded-xl p-4",
        className?.includes("relative") ? className : `absolute ${className}`,
        !reduce && floatClass,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] tracking-[0.16em] text-zinc-400">{pair}</p>
      </div>
      <p className="mt-2 text-[20px] tracking-[-0.03em] text-white">{price}</p>
      <p className="mt-1 text-[12px] text-orange">{change}</p>
      <div className="mt-3 h-9">
        <MiniSpark values={values} />
      </div>
    </motion.div>
  );
}

function CopyCard({
  className,
  delay,
  reduce,
}: {
  className?: string;
  delay: number;
  reduce?: boolean | null;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "product-chip z-20 min-w-[210px] rounded-xl p-4",
        className?.includes("relative") ? className : `absolute ${className}`,
        !reduce && "float-slower",
      )}
    >
      <p className="text-[10px] tracking-[0.18em] text-zinc-500">COPY TRADING</p>
      <p className="mt-2 text-[14px] text-white">Strategy marketplace</p>
      <p className="mt-0.5 text-[12px] text-zinc-500">Compare risk and exposure</p>
      <p className="mt-3 text-[11px] tracking-[0.08em] text-zinc-500">
        Discover · Compare · Follow
      </p>
    </motion.div>
  );
}
