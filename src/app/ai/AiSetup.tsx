import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MiniSpark } from "@/components/MiniSpark";
import { aiCatalog, formatPct, formatPrice, formatUsd, markets, portfolioSummary, type AiRisk } from "@/src/data/dashboardMock";
import { useDeskState } from "@/src/app/state/DeskState";
import { cn } from "@/lib/cn";

const steps = ["Strategy", "Asset", "Allocation", "Risk", "Review"];
const risks: AiRisk[] = ["Low", "Moderate", "High"];

export function AiSetup() {
  const navigate = useNavigate();
  const { activateStrategy } = useDeskState();
  const [step, setStep] = useState(0);
  const [catalogId, setCatalogId] = useState(aiCatalog[0].id);
  const [asset, setAsset] = useState("BTC/USDT");
  const [amount, setAmount] = useState("10000");
  const [risk, setRisk] = useState<AiRisk>("Moderate");
  const [maxPosition, setMaxPosition] = useState(20);
  const [stopLoss, setStopLoss] = useState("2.5%");
  const [maxDaily, setMaxDaily] = useState("500");
  const [maxPositions, setMaxPositions] = useState(3);
  const [volatile, setVolatile] = useState(false);
  const catalog = aiCatalog.find((item) => item.id === catalogId) ?? aiCatalog[0];
  const allocation = Number(amount) || 0;
  const remaining = portfolioSummary.available - allocation;
  const market = useMemo(() => markets.find((item) => item.pair === asset) ?? markets[0], [asset]);

  function activate() {
    if (allocation <= 0 || allocation > portfolioSummary.available) return;
    const id = activateStrategy({
      name: catalog.name,
      style: catalog.style,
      asset,
      allocated: allocation,
      risk,
      maxPositionPct: maxPosition,
      stopLoss,
      maxDailyLoss: Number(maxDaily) || 0,
      maxPositions,
      volatile,
    });
    navigate(`/app/ai-trading/${id}`);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div>
        <p className="text-[11px] tracking-[0.16em] text-zinc-500">START AI TRADING</p>
        <h2 className="mt-1 text-[22px] text-white">Set the strategy, capital, and risk limits</h2>
        <p className="mt-1 text-[12px] text-zinc-600">This arms a session strategy. It does not send orders.</p>
      </div>
      <ol className="flex gap-2 overflow-x-auto text-[12px]">
        {steps.map((label, index) => (
          <li key={label} className={cn("rounded-md border px-3 py-1.5", index === step ? "border-orange/40 text-orange" : "border-white/10 text-zinc-500")}>
            {index + 1}. {label}
          </li>
        ))}
      </ol>

      {step === 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {aiCatalog.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCatalogId(item.id)}
              className={cn("rounded-lg border p-4 text-left", item.id === catalogId ? "border-orange/40 bg-orange/[0.06]" : "border-white/[0.06] bg-[#0c0c0c]")}
            >
              <p className="text-[15px] text-white">{item.name}</p>
              <p className="mt-1 text-[13px] leading-6 text-zinc-400">{item.style}</p>
              <p className="mt-3 text-[12px] text-zinc-500">Risk {item.risk} · {item.frequency}</p>
              <p className="mt-1 text-[12px] text-zinc-500">{item.assets.join(" · ")}</p>
            </button>
          ))}
        </div>
      ) : null}

      {step === 1 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {markets.slice(0, 5).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setAsset(item.pair)}
              className={cn("rounded-lg border p-4 text-left", item.pair === asset ? "border-orange/40 bg-orange/[0.06]" : "border-white/[0.06] bg-[#0c0c0c]")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[14px] text-white">{item.pair}</p>
                  <p className="font-mono text-[18px] text-zinc-100">{formatPrice(item.price)}</p>
                  <p className={item.change24h < 0 ? "text-[12px] text-crimson" : "text-[12px] text-orange"}>{formatPct(item.change24h)} · Spot</p>
                </div>
                <div className="h-10 w-16">
                  <MiniSpark values={item.spark} width={64} height={40} tone={item.change24h < 0 ? "crimson" : "orange"} />
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : null}

      {step === 2 ? (
        <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
          <label className="text-[12px] text-zinc-500" htmlFor="ai-amount">Amount to allocate</label>
          <input id="ai-amount" className="desk-field mt-2 max-w-xs" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} />
          <dl className="mt-4 grid gap-3 sm:grid-cols-3 text-[13px]">
            <div><dt className="text-zinc-500">Available</dt><dd className="mt-1 font-mono text-white">{formatUsd(portfolioSummary.available)}</dd></div>
            <div><dt className="text-zinc-500">Allocation</dt><dd className="mt-1 font-mono text-white">{formatUsd(allocation)}</dd></div>
            <div><dt className="text-zinc-500">Remaining</dt><dd className={cn("mt-1 font-mono", remaining < 0 ? "text-crimson" : "text-white")}>{formatUsd(remaining)}</dd></div>
          </dl>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="grid gap-4 rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
          <div>
            <p className="text-[12px] text-zinc-500">Risk level</p>
            <div className="mt-2 flex gap-2">
              {risks.map((item) => (
                <button key={item} type="button" onClick={() => setRisk(item)} className={cn("rounded-md px-3 py-1.5 text-[13px]", item === risk ? "bg-orange/15 text-orange" : "text-zinc-400")}>{item}</button>
              ))}
            </div>
          </div>
          <label className="text-[13px] text-zinc-300">Maximum position size {maxPosition}%
            <input className="mt-2 w-full accent-[#e85c24]" type="range" min={5} max={50} value={maxPosition} onChange={(event) => setMaxPosition(Number(event.target.value))} />
          </label>
          <label className="text-[13px] text-zinc-300">Stop-loss preference
            <select className="desk-field mt-2" value={stopLoss} onChange={(event) => setStopLoss(event.target.value)}>
              {["1.5%", "2.5%", "3%", "5%"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="text-[13px] text-zinc-300">Maximum daily loss
            <input className="desk-field mt-2 max-w-xs" inputMode="decimal" value={maxDaily} onChange={(event) => setMaxDaily(event.target.value)} />
          </label>
          <label className="text-[13px] text-zinc-300">Maximum open positions
            <input className="desk-field mt-2 max-w-xs" inputMode="numeric" value={maxPositions} onChange={(event) => setMaxPositions(Number(event.target.value) || 1)} />
          </label>
          <label className="flex items-center gap-2 text-[13px] text-zinc-300">
            <input type="checkbox" checked={volatile} onChange={() => setVolatile((current) => !current)} />
            Allow trading during volatile conditions
          </label>
        </section>
      ) : null}

      {step === 4 ? (
        <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4 text-[13px]">
          <dl className="grid gap-3 sm:grid-cols-2">
            <Row label="Strategy" value={catalog.name} />
            <Row label="Asset" value={asset} />
            <Row label="Allocation" value={formatUsd(allocation)} />
            <Row label="Risk" value={risk} />
            <Row label="Maximum position size" value={`${maxPosition}%`} />
            <Row label="Maximum daily loss" value={formatUsd(Number(maxDaily) || 0)} />
            <Row label="Open-position limit" value={String(maxPositions)} />
          </dl>
          <button type="button" className="desk-action desk-action-buy mt-4" disabled={allocation <= 0 || remaining < 0} onClick={activate}>Activate AI Trading</button>
        </section>
      ) : null}

      <div className="flex justify-between">
        <button type="button" className="desk-action" disabled={step === 0} onClick={() => setStep((current) => current - 1)}>Back</button>
        {step < 4 ? <button type="button" className="desk-action desk-action-buy" onClick={() => setStep((current) => current + 1)}>Continue</button> : <span />}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-zinc-500">{label}</dt>
      <dd className="mt-1 text-white">{value}</dd>
    </div>
  );
}
