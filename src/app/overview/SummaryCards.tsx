import { Link } from "react-router-dom";
import { MiniSpark } from "@/components/MiniSpark";
import { formatPct, formatSignedUsd, formatUsd, performanceSeries, portfolioSummary } from "@/src/data/dashboardMock";

const cards = [
  { label: "Total Portfolio", value: formatUsd(portfolioSummary.total), detail: formatPct(12.84), spark: performanceSeries["1M"].points, tone: "orange" as const },
  { label: "Available Balance", value: formatUsd(portfolioSummary.available), detail: "Unallocated", spark: [40, 41, 39, 42, 42, 43], tone: "white" as const },
  { label: "Invested", value: formatUsd(portfolioSummary.invested), detail: formatPct(4.16), spark: [60, 62, 61, 64, 66, 68], tone: "orange" as const },
  { label: "Today's P&L", value: formatSignedUsd(portfolioSummary.todayPnl), detail: formatPct(portfolioSummary.todayPnlPct), spark: performanceSeries["1D"].points, tone: "orange" as const },
  { label: "Total P&L", value: formatSignedUsd(portfolioSummary.totalPnl), detail: formatPct(portfolioSummary.totalPnlPct), spark: performanceSeries["1Y"].points, tone: "orange" as const },
];

export function SummaryCards() {
  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[13px] tracking-[0.16em] text-zinc-500">PORTFOLIO SUMMARY</h2>
        <div className="flex flex-wrap gap-2">
          <Link to="/app/deposit" className="desk-action">Deposit</Link>
          <Link to="/app/withdrawal" className="desk-action">Withdraw</Link>
          <Link to="/app/trade" className="desk-action desk-action-buy">Trade</Link>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <article key={card.label} className="desk-card rounded-lg border border-white/[0.06] bg-[#0c0c0c] px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[11px] tracking-[0.14em] text-zinc-500">{card.label.toUpperCase()}</p>
              <div className="h-7 w-14">
                <MiniSpark values={card.spark} width={56} height={28} tone={card.tone} />
              </div>
            </div>
            <p className="mt-2 font-mono text-[22px] tracking-[-0.04em] text-white">{card.value}</p>
            <p className={card.detail.startsWith("+") ? "mt-1 text-[12px] text-orange" : "mt-1 text-[12px] text-zinc-500"}>{card.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
