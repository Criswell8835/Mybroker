import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PerformanceChart } from "@/src/app/charts/PerformanceChart";
import { copyTraders, formatPct, formatUsd, portfolioSummary } from "@/src/data/dashboardMock";
import { useDeskState } from "@/src/app/state/DeskState";
import { cn } from "@/lib/cn";

export function CopyDesk() {
  const { copies } = useDeskState();
  return (
    <div className="space-y-3">
      <header>
        <h2 className="text-[22px] tracking-[-0.03em] text-white">Copy Trading</h2>
        <p className="mt-1 max-w-xl text-[13px] text-zinc-400">A marketplace of sample trader profiles. Results are desk data, not live performance.</p>
      </header>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {copyTraders.map((trader) => {
          const copying = copies.some((item) => item.traderId === trader.id);
          return (
            <article key={trader.id} className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-orange/30 bg-orange/10 text-[12px] text-orange">
                  {trader.name.slice(0, 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[15px] text-white">{trader.name}</p>
                    <span className="rounded-full border border-orange/30 px-1.5 py-0.5 text-[10px] tracking-[0.12em] text-orange">VERIFIED</span>
                  </div>
                  <p className="text-[12px] text-zinc-500">{trader.handle}</p>
                </div>
                <p className="text-[12px] text-orange">★ {trader.rating.toFixed(1)}</p>
              </div>
              <p className="mt-3 text-[13px] leading-6 text-zinc-400">{trader.style}</p>
              <p className="mt-1 text-[12px] text-zinc-500">{trader.followers} followers</p>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-[12px]">
                <div><dt className="text-zinc-500">30D ROI</dt><dd className="mt-1 font-mono text-orange">{formatPct(trader.roi30)}</dd></div>
                <div><dt className="text-zinc-500">Win rate</dt><dd className="mt-1 text-white">{trader.winRate}%</dd></div>
                <div><dt className="text-zinc-500">Risk</dt><dd className="mt-1 text-white">{trader.risk}</dd></div>
              </dl>
              <p className="mt-2 text-[12px] text-zinc-500">Copied capital {trader.aum}</p>
              <div className="mt-4 flex gap-2">
                <Link to={`/app/copy-trading/${trader.id}`} className="desk-action desk-action-buy">{copying ? "Manage copy" : "Copy trader"}</Link>
                <Link to={`/app/copy-trading/${trader.id}`} className="desk-action">View profile</Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function CopyProfile() {
  const { traderId = "" } = useParams();
  const trader = copyTraders.find((item) => item.id === traderId);
  const { copies, saveCopy } = useDeskState();
  const existing = copies.find((item) => item.traderId === traderId);
  const [amount, setAmount] = useState(existing ? String(existing.amount) : "2500");
  const [risk, setRisk] = useState(existing?.risk ?? "Match trader");
  const [stop, setStop] = useState(existing?.stop ?? "Pause at 8% drawdown");
  const [note, setNote] = useState("");

  if (!trader) {
    return <p className="text-[14px] text-zinc-400">That profile is not in the sample marketplace. <Link className="text-orange" to="/app/copy-trading">Back</Link></p>;
  }

  const series = trader.spark.map((point, index) => 100 + point * (index + 1));

  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-3">
        <header className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
          <p className="text-[12px] text-zinc-500">{trader.handle}</p>
          <h2 className="text-[22px] text-white">{trader.name}</h2>
          <p className="mt-1 text-[13px] text-zinc-400">{trader.style}</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-[12px] sm:grid-cols-4">
            <div><dt className="text-zinc-500">30D ROI</dt><dd className="mt-1 font-mono text-orange">{formatPct(trader.roi30)}</dd></div>
            <div><dt className="text-zinc-500">90D ROI</dt><dd className="mt-1 font-mono text-orange">{formatPct(trader.roi90)}</dd></div>
            <div><dt className="text-zinc-500">Win rate</dt><dd className="mt-1 text-white">{trader.winRate}%</dd></div>
            <div><dt className="text-zinc-500">Followers</dt><dd className="mt-1 text-white">{trader.followers}</dd></div>
          </dl>
          <p className="mt-3 text-[12px] text-zinc-500">Risk {trader.risk} · Sample profile, not a live book.</p>
        </header>
        <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
          <h3 className="text-[13px] text-white">Performance</h3>
          <PerformanceChart points={series} labels={["W1", "W2", "W3", "W4"]} />
        </section>
        <div className="grid gap-3 md:grid-cols-2">
          <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
            <h3 className="text-[13px] text-white">Recent trades</h3>
            <ul className="mt-3 space-y-2">
              {trader.trades.map((item) => (
                <li key={item.time + item.text} className="flex justify-between text-[13px]">
                  <span className="text-zinc-300">{item.time} · {item.text}</span>
                  <span className="text-orange">{item.pnl}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
            <h3 className="text-[13px] text-white">Current positions</h3>
            <ul className="mt-3 space-y-2">
              {trader.positions.map((item) => (
                <li key={item.asset} className="flex justify-between text-[13px]">
                  <span className="text-zinc-300">{item.asset} {item.side}</span>
                  <span className="text-orange">{item.pnl}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
      <aside className="h-fit rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
        <h3 className="text-[15px] text-white">Copy allocation</h3>
        <p className="mt-1 text-[12px] text-zinc-600">Available {formatUsd(portfolioSummary.available)}. Saving a copy does not place orders.</p>
        <label className="mt-3 block text-[12px] text-zinc-500">Amount
          <input className="desk-field mt-1" value={amount} onChange={(event) => setAmount(event.target.value)} />
        </label>
        <label className="mt-3 block text-[12px] text-zinc-500">Risk limit
          <select className="desk-field mt-1" value={risk} onChange={(event) => setRisk(event.target.value)}>
            {["Match trader", "Lower", "Fixed 2%"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="mt-3 block text-[12px] text-zinc-500">Stop-copy
          <select className="desk-field mt-1" value={stop} onChange={(event) => setStop(event.target.value)}>
            {["Pause at 8% drawdown", "Pause at 15% drawdown", "Manual only"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <button
          type="button"
          className="desk-action desk-action-buy mt-4 w-full"
          onClick={() => {
            const value = Number(amount);
            if (!value || value <= 0) return;
            saveCopy({ traderId: trader.id, amount: value, risk, stop });
            setNote("Copy settings saved in this session. No orders were sent.");
          }}
        >
          Copy trader
        </button>
        {note ? <p className="mt-3 text-[12px] text-zinc-400">{note}</p> : null}
        {existing ? <p className={cn("mt-2 text-[12px] text-zinc-500")}>Current session allocation {formatUsd(existing.amount)}.</p> : null}
      </aside>
    </div>
  );
}
