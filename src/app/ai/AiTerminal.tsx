import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TradingChart } from "@/src/app/charts/TradingChart";
import { Modal } from "@/src/app/ui/Modal";
import { StatusPill } from "@/src/app/ui/StatusPill";
import { useDeskState } from "@/src/app/state/DeskState";
import { aiEvents, aiPositions, formatPrice, formatSignedUsd, formatUsd, type AiPositionRecord, type AiRisk } from "@/src/data/dashboardMock";
import { cn } from "@/lib/cn";

export function AiTerminal() {
  const { strategyId = "" } = useParams();
  const { strategies, setStrategyStatus, updateStrategyRisk, closedPositions, closePosition, localEvents } = useDeskState();
  const strategy = strategies.find((item) => item.id === strategyId);
  const [symbol, setSymbol] = useState(strategy?.asset.split("/")[0] ?? "BTC");
  const [selected, setSelected] = useState<AiPositionRecord | null>(null);
  const [riskOpen, setRiskOpen] = useState(false);
  const positions = useMemo(
    () => aiPositions.filter((item) => item.strategyId === strategyId && !closedPositions.includes(item.id)),
    [closedPositions, strategyId],
  );
  const events = [
    ...localEvents.filter((item) => item.strategyId === strategyId),
    ...aiEvents.filter((item) => item.strategyId === strategyId),
  ];

  if (!strategy) {
    return (
      <p className="text-[14px] text-zinc-400">
        That strategy is not in this session. <Link to="/app/ai-trading" className="text-orange">Back to AI Trading</Link>
      </p>
    );
  }

  const today = strategy.todayPnl;
  const total = strategy.totalPnl;

  return (
    <div className="space-y-3">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[12px] text-zinc-500">{strategy.asset}</p>
          <h2 className="text-[22px] text-white">{strategy.name}</h2>
          <p className="mt-1 flex items-center gap-2 text-[13px] text-orange">
            <span className="h-1.5 w-1.5 rounded-full bg-orange" />
            {strategy.status === "ACTIVE" ? "AI ACTIVE" : strategy.status}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="desk-action" onClick={() => setStrategyStatus(strategy.id, strategy.status === "PAUSED" ? "ACTIVE" : "PAUSED")}>
            {strategy.status === "PAUSED" ? "Resume AI" : "Pause AI"}
          </button>
          <button type="button" className="desk-action" onClick={() => setStrategyStatus(strategy.id, "STOPPED")}>Stop AI</button>
          <button type="button" className="desk-action" onClick={() => setRiskOpen(true)}>Adjust Risk</button>
        </div>
      </header>
      <p className="text-[12px] text-zinc-600">Prototype terminal. Markers and positions are sample state. No orders are sent.</p>
      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <Stat label="Allocated Capital" value={formatUsd(strategy.allocated)} />
        <Stat label="Available Capital" value={formatUsd(strategy.available)} />
        <Stat label="Open Positions" value={String(positions.length)} />
        <Stat label="Today's P&L" value={formatSignedUsd(today)} up={today >= 0} />
        <Stat label="Total P&L" value={formatSignedUsd(total)} up={total >= 0} />
        <Stat label="Win Rate" value={`${strategy.winRate}%`} />
      </div>
      <section className="overflow-hidden rounded-lg border border-white/[0.06] bg-[#0c0c0c]">
        <TradingChart
          symbol={symbol}
          onSymbol={setSymbol}
          marks={[
            { index: 2, label: "AI BUY" },
            { index: 5, label: "POSITION OPEN" },
            { index: 7, label: "AI SELL" },
            { index: 9, label: "POSITION CLOSED" },
          ]}
        />
      </section>
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_320px]">
        <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c]">
          <header className="border-b border-white/[0.05] px-4 py-3">
            <h3 className="text-[13px] text-white">Open positions</h3>
          </header>
          {positions.length === 0 ? <p className="px-4 py-6 text-[13px] text-zinc-500">No open positions in this session.</p> : null}
          <div className="hidden md:block">
            <table className="w-full text-left text-[12px]">
              <thead className="text-[10px] tracking-[0.14em] text-zinc-600">
                <tr>{["Asset", "Side", "Entry", "Current", "Size", "P&L", "Duration"].map((label) => <th key={label} className="px-4 py-2 font-normal">{label.toUpperCase()}</th>)}</tr>
              </thead>
              <tbody>
                {positions.map((item) => (
                  <tr key={item.id} className="cursor-pointer border-t border-white/[0.04] hover:bg-white/[0.02]" onClick={() => setSelected(item)}>
                    <td className="px-4 py-2.5 text-white">{item.asset}</td>
                    <td className="px-4 py-2.5 text-zinc-300">{item.side}</td>
                    <td className="px-4 py-2.5 font-mono text-zinc-300">{formatPrice(item.entry)}</td>
                    <td className="px-4 py-2.5 font-mono text-zinc-300">{formatPrice(item.current)}</td>
                    <td className="px-4 py-2.5 text-zinc-300">{item.size}</td>
                    <td className={cn("px-4 py-2.5 font-mono", item.pnl < 0 ? "text-crimson" : "text-orange")}>{formatSignedUsd(item.pnl)}</td>
                    <td className="px-4 py-2.5 text-zinc-500">{item.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="divide-y divide-white/[0.04] md:hidden">
            {positions.map((item) => (
              <li key={item.id}>
                <button type="button" className="w-full px-4 py-3 text-left" onClick={() => setSelected(item)}>
                  <span className="flex justify-between text-[13px] text-white"><span>{item.asset} {item.side}</span><span className="text-orange">{formatSignedUsd(item.pnl)}</span></span>
                  <span className="mt-1 block text-[12px] text-zinc-500">{item.size} · {item.duration}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c]">
          <header className="border-b border-white/[0.05] px-4 py-3">
            <h3 className="text-[13px] text-white">AI activity</h3>
          </header>
          <ul>
            {events.map((item) => (
              <li key={item.id} className="border-t border-white/[0.04] px-4 py-2.5 first:border-t-0">
                <p className="text-[12px] text-zinc-500">{item.time}</p>
                <p className="text-[13px] text-zinc-100">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <Modal open={selected != null} title="Position" onClose={() => setSelected(null)}>
        {selected ? (
          <div className="space-y-3 text-[13px]">
            <p className="text-white">{selected.asset} · {selected.side}</p>
            <p className="text-zinc-400">Entry {formatPrice(selected.entry)} · Current {formatPrice(selected.current)}</p>
            <p className="text-zinc-400">Size {selected.size} · Opened {selected.opened}</p>
            <p className={selected.pnl < 0 ? "font-mono text-crimson" : "font-mono text-orange"}>{formatSignedUsd(selected.pnl)} unrealized</p>
            <p className="leading-6 text-zinc-400">{selected.note}</p>
            <p className="text-zinc-500">Risk {strategy.risk} · Stop {strategy.stopLoss} · Max position {strategy.maxPositionPct}%</p>
            <button
              type="button"
              className="desk-action"
              onClick={() => {
                closePosition(selected.id, strategy.id);
                setSelected(null);
              }}
            >
              Close position
            </button>
          </div>
        ) : null}
      </Modal>

      <Modal open={riskOpen} title="Adjust risk" onClose={() => setRiskOpen(false)}>
        <RiskForm
          risk={strategy.risk}
          maxPositionPct={strategy.maxPositionPct}
          maxDailyLoss={strategy.maxDailyLoss}
          maxPositions={strategy.maxPositions}
          volatile={strategy.volatile}
          onSave={(patch) => {
            updateStrategyRisk(strategy.id, patch);
            setRiskOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}

function Stat({ label, value, up }: { label: string; value: string; up?: boolean }) {
  return (
    <article className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] px-3 py-3">
      <p className="text-[10px] tracking-[0.12em] text-zinc-500">{label.toUpperCase()}</p>
      <p className={cn("mt-1 font-mono text-[16px] text-white", up === true && "text-orange", up === false && "text-crimson")}>{value}</p>
    </article>
  );
}

function RiskForm({
  risk,
  maxPositionPct,
  maxDailyLoss,
  maxPositions,
  volatile,
  onSave,
}: {
  risk: AiRisk;
  maxPositionPct: number;
  maxDailyLoss: number;
  maxPositions: number;
  volatile: boolean;
  onSave: (patch: { risk: AiRisk; maxPositionPct: number; maxDailyLoss: number; maxPositions: number; volatile: boolean }) => void;
}) {
  const [nextRisk, setRisk] = useState(risk);
  const [nextSize, setSize] = useState(maxPositionPct);
  const [nextLoss, setLoss] = useState(String(maxDailyLoss));
  const [nextCount, setCount] = useState(maxPositions);
  const [nextVolatile, setVolatile] = useState(volatile);
  return (
    <div className="space-y-3 text-[13px]">
      <div className="flex gap-2">
        {(["Low", "Moderate", "High"] as const).map((item) => (
          <button key={item} type="button" className={cn("rounded-md px-2 py-1", item === nextRisk ? "text-orange" : "text-zinc-400")} onClick={() => setRisk(item)}>{item}</button>
        ))}
      </div>
      <label className="block text-zinc-300">Max position {nextSize}%
        <input className="mt-1 w-full accent-[#e85c24]" type="range" min={5} max={50} value={nextSize} onChange={(event) => setSize(Number(event.target.value))} />
      </label>
      <label className="block text-zinc-300">Max daily loss
        <input className="desk-field mt-1" value={nextLoss} onChange={(event) => setLoss(event.target.value)} />
      </label>
      <label className="block text-zinc-300">Open-position limit
        <input className="desk-field mt-1" value={nextCount} onChange={(event) => setCount(Number(event.target.value) || 1)} />
      </label>
      <label className="flex items-center gap-2 text-zinc-300">
        <input type="checkbox" checked={nextVolatile} onChange={() => setVolatile((current) => !current)} />
        Volatile conditions
      </label>
      <button type="button" className="desk-action desk-action-buy" onClick={() => onSave({ risk: nextRisk, maxPositionPct: nextSize, maxDailyLoss: Number(nextLoss) || 0, maxPositions: nextCount, volatile: nextVolatile })}>
        Save controls
      </button>
    </div>
  );
}
