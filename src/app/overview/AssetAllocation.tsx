import { AllocationDonut } from "@/src/app/charts/AllocationDonut";
import { allocation, formatUsd } from "@/src/data/dashboardMock";

export function AssetAllocation() {
  return (
    <article className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
      <h2 className="text-[13px] text-white">Asset allocation</h2>
      <p className="mt-1 text-[11px] text-zinc-600">Prototype weights. Not a live book.</p>
      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
        <AllocationDonut slices={allocation} />
        <ul className="w-full space-y-2">
          {allocation.map((item) => (
            <li key={item.symbol} className="flex items-center justify-between gap-3 text-[12px]">
              <span className="text-zinc-200">
                {item.symbol}
                <span className="ml-2 text-zinc-500">{item.pct}%</span>
              </span>
              <span className="font-mono text-zinc-400">{formatUsd(item.value)}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
