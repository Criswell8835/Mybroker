import { Link } from "react-router-dom";
import { MiniSpark } from "@/components/MiniSpark";
import { useDeskState } from "@/src/app/state/DeskState";
import { activity, aiOverview, formatSignedUsd, formatUsd } from "@/src/data/dashboardMock";
import { StatusPill } from "@/src/app/ui/StatusPill";

export function AiTradingCard() {
  const { aiPaused, setAiPaused } = useDeskState();
  const notes = activity.filter((item) => item.kind === "AI Trading");

  return (
    <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] text-white">AI Trading</h2>
          <p className="mt-1 text-[12px] text-zinc-500">{aiOverview.strategy}</p>
        </div>
        <StatusPill value={aiPaused ? "Paused" : "Active"} />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[12px] sm:grid-cols-3">
        <div>
          <dt className="text-zinc-500">Asset</dt>
          <dd className="mt-1 text-white">{aiOverview.asset}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Allocation</dt>
          <dd className="mt-1 font-mono text-white">{formatUsd(aiOverview.allocation)}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Today's P&L</dt>
          <dd className="mt-1 font-mono text-orange">{formatSignedUsd(aiOverview.todayPnl)}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Risk</dt>
          <dd className="mt-1 text-white">{aiOverview.risk}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Positions</dt>
          <dd className="mt-1 text-white">{aiOverview.positions}</dd>
        </div>
      </dl>
      <div className="mt-4 h-14">
        <MiniSpark values={aiOverview.spark} width={360} height={56} />
      </div>
      <ul className="mt-3 space-y-1 text-[12px] text-zinc-400">
        {notes.map((item) => (
          <li key={item.id}>{item.text} · {item.time}</li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link to="/app/ai-trading" className="desk-action desk-action-buy">View AI Trading</Link>
        <button type="button" className="desk-action" onClick={() => setAiPaused(!aiPaused)}>
          {aiPaused ? "Resume Strategy" : "Pause Strategy"}
        </button>
      </div>
      <p className="mt-3 text-[11px] leading-5 text-zinc-600">Pause is local. This desk does not send strategy orders.</p>
    </section>
  );
}
