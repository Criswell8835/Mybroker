import { Link } from "react-router-dom";
import { formatSignedUsd, formatUsd } from "@/src/data/dashboardMock";
import { useDeskState } from "@/src/app/state/DeskState";
import { StatusPill } from "@/src/app/ui/StatusPill";
import { cn } from "@/lib/cn";

export function AiDesk() {
  const { strategies, setStrategyStatus } = useDeskState();
  const live = strategies.filter((item) => item.status !== "STOPPED");
  const capital = live.reduce((sum, item) => sum + item.allocated, 0);
  const active = strategies.filter((item) => item.status === "ACTIVE").length;
  const positions = strategies.reduce((sum, item) => sum + (item.status === "ACTIVE" ? seededPositions(item.id) : 0), 0);
  const today = live.reduce((sum, item) => sum + item.todayPnl, 0);
  const total = live.reduce((sum, item) => sum + item.totalPnl, 0);

  return (
    <div className="space-y-3">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[22px] tracking-[-0.03em] text-white">AI Trading</h2>
          <p className="mt-1 max-w-xl text-[13px] leading-6 text-zinc-400">
            Let AI analyze the market and execute trades based on your selected strategy and risk controls.
          </p>
        </div>
        <Link to="/app/ai-trading/start" className="desk-action desk-action-buy">+ Start AI Trading</Link>
      </header>
      <p className="text-[12px] text-zinc-600">Desk preview. Activating a strategy records it in this session and does not send orders.</p>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="AI Capital" value={formatUsd(capital)} />
        <Metric label="Active Strategies" value={String(active)} />
        <Metric label="Open Positions" value={String(positions)} />
        <Metric label="Today's P&L" value={formatSignedUsd(today)} tone={today >= 0 ? "up" : "down"} />
        <Metric label="Total AI P&L" value={formatSignedUsd(total)} tone={total >= 0 ? "up" : "down"} />
      </div>
      <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c]">
        <header className="border-b border-white/[0.05] px-4 py-3">
          <h3 className="text-[13px] tracking-[0.14em] text-zinc-500">ACTIVE AI STRATEGIES</h3>
        </header>
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[860px] text-left text-[12px]">
            <thead className="text-[10px] tracking-[0.14em] text-zinc-600">
              <tr>
                {["Strategy", "Asset", "Allocated", "Available", "Open Positions", "Today's P&L", "Risk", "Status", "Actions"].map((label) => (
                  <th key={label} className="px-4 py-2 font-normal">{label.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {strategies.map((item) => (
                <tr key={item.id} className="border-t border-white/[0.04]">
                  <td className="px-4 py-2.5 text-white">{item.name}</td>
                  <td className="px-4 py-2.5 text-zinc-300">{item.asset}</td>
                  <td className="px-4 py-2.5 font-mono text-zinc-300">{formatUsd(item.allocated)}</td>
                  <td className="px-4 py-2.5 font-mono text-zinc-300">{formatUsd(item.available)}</td>
                  <td className="px-4 py-2.5 text-zinc-300">{item.status === "STOPPED" ? 0 : seededPositions(item.id)}</td>
                  <td className={cn("px-4 py-2.5 font-mono", item.todayPnl < 0 ? "text-crimson" : "text-orange")}>{formatSignedUsd(item.todayPnl)}</td>
                  <td className="px-4 py-2.5 text-zinc-300">{item.risk}</td>
                  <td className="px-4 py-2.5"><StatusPill value={item.status === "ACTIVE" ? "Active" : item.status === "PAUSED" ? "Paused" : "Stopped"} /></td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-2">
                      <Link to={`/app/ai-trading/${item.id}`} className="text-orange">View</Link>
                      <Link to={`/app/ai-trading/${item.id}`} className="text-zinc-400">Manage</Link>
                      {item.status !== "STOPPED" ? (
                        <button type="button" className="text-zinc-400" onClick={() => setStrategyStatus(item.id, item.status === "PAUSED" ? "ACTIVE" : "PAUSED")}>
                          {item.status === "PAUSED" ? "Resume" : "Pause"}
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="divide-y divide-white/[0.04] lg:hidden">
          {strategies.map((item) => (
            <li key={item.id} className="space-y-2 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[14px] text-white">{item.name}</p>
                  <p className="text-[12px] text-zinc-500">{item.asset} · {item.risk}</p>
                </div>
                <StatusPill value={item.status === "ACTIVE" ? "Active" : item.status === "PAUSED" ? "Paused" : "Stopped"} />
              </div>
              <p className="font-mono text-[13px] text-zinc-200">{formatUsd(item.allocated)} allocated · {formatSignedUsd(item.todayPnl)}</p>
              <div className="flex gap-3 text-[12px]">
                <Link to={`/app/ai-trading/${item.id}`} className="text-orange">View</Link>
                {item.status !== "STOPPED" ? (
                  <button type="button" className="text-zinc-400" onClick={() => setStrategyStatus(item.id, item.status === "PAUSED" ? "ACTIVE" : "PAUSED")}>
                    {item.status === "PAUSED" ? "Resume" : "Pause"}
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function seededPositions(id: string) {
  if (id === "momentum-alpha") return 3;
  if (id === "trend-matrix") return 2;
  if (id === "alpha-core") return 1;
  return 0;
}

function Metric({ label, value, tone = "flat" }: { label: string; value: string; tone?: "up" | "down" | "flat" }) {
  return (
    <article className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] px-4 py-3">
      <p className="text-[10px] tracking-[0.14em] text-zinc-500">{label.toUpperCase()}</p>
      <p className={cn("mt-2 font-mono text-[18px] text-white", tone === "up" && "text-orange", tone === "down" && "text-crimson")}>{value}</p>
    </article>
  );
}
