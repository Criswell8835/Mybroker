import { Link } from "react-router-dom";
import { MiniSpark } from "@/components/MiniSpark";
import { copyStrategies, formatUsd } from "@/src/data/dashboardMock";
import { StatusPill } from "@/src/app/ui/StatusPill";

export function CopyTradingRow() {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-[13px] tracking-[0.16em] text-zinc-500">COPY TRADING</h2>
          <p className="mt-1 text-[12px] text-zinc-600">Configurable prototype profiles. Not verified traders.</p>
        </div>
        <Link to="/app/copy-trading" className="text-[12px] text-zinc-400 hover:text-white">Explore Copy Trading</Link>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {copyStrategies.map((item) => (
          <article key={item.id} className="desk-card rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[14px] text-white">{item.name}</p>
                <p className="text-[12px] text-zinc-500">{item.category} · {item.risk}</p>
              </div>
              <StatusPill value={item.status} />
            </div>
            <p className="mt-3 font-mono text-[18px] text-orange">{item.result}</p>
            <p className="text-[11px] text-zinc-500">{item.period} · {item.followers} copies</p>
            <div className="mt-3 h-10">
              <MiniSpark values={item.spark} width={180} height={40} />
            </div>
            <p className="mt-2 text-[12px] text-zinc-400">Allocation {formatUsd(item.allocation)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
