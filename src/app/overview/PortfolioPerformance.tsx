import { useState } from "react";
import { PerformanceChart } from "@/src/app/charts/PerformanceChart";
import { formatPct, formatSignedUsd, performanceSeries, type PerformanceRange } from "@/src/data/dashboardMock";

const ranges = Object.keys(performanceSeries) as PerformanceRange[];

export function PortfolioPerformance() {
  const [range, setRange] = useState<PerformanceRange>("1M");
  const series = performanceSeries[range];

  return (
    <article className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-[18px] tracking-[-0.03em] text-white">Portfolio Performance</h2>
        <div className="flex flex-wrap gap-1">
          {ranges.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRange(item)}
              className={
                item === range
                  ? "rounded-full bg-orange/15 px-2.5 py-1 text-[11px] text-orange"
                  : "rounded-full px-2.5 py-1 text-[11px] text-zinc-500 hover:text-zinc-200"
              }
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <PerformanceChart points={series.points} labels={series.labels} />
      </div>
      <div className="mt-2 flex items-baseline gap-3">
        <p className="font-mono text-[20px] text-orange">{formatSignedUsd(series.change)}</p>
        <p className="text-[13px] text-orange">{formatPct(series.changePct)}</p>
      </div>
    </article>
  );
}
