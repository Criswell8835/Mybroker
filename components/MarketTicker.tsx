import { DemoBadge } from "@/components/DemoBadge";
import { cn } from "@/lib/cn";
import { formatChange, formatPrice, tickerAssets } from "@/lib/market-data";

export function MarketTicker() {
  const row = [...tickerAssets, ...tickerAssets];

  return (
    <section
      aria-label="Demonstration market ticker"
      className="relative border-y border-white/[0.06] bg-[#070707]"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#070707] to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#070707] to-transparent sm:w-28" />

      <div className="flex items-center gap-4">
        <div className="relative z-20 hidden shrink-0 items-center gap-2 border-r border-white/8 px-5 py-3.5 sm:flex">
          <DemoBadge />
        </div>

        <div className="overflow-hidden py-3.5">
          <div className="ticker-track flex items-center">
            {row.map((asset, index) => {
              const up = asset.change24h >= 0;
              return (
                <div
                  key={`${asset.id}-${index}`}
                  className="flex items-center gap-4 px-6"
                >
                  <span className="text-[12px] tracking-[0.14em] text-zinc-300">
                    {asset.pair}
                  </span>
                  <span className="font-mono text-[12px] text-zinc-400">
                    {formatPrice(asset.price)}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[12px]",
                      up ? "text-zinc-200" : "text-crimson",
                    )}
                  >
                    {formatChange(asset.change24h)}
                  </span>
                  <span className="h-3 w-px bg-white/10" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
