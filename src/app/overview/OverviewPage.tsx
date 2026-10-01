import { Link } from "react-router-dom";
import { MiniSpark } from "@/components/MiniSpark";
import { AssetAllocation } from "@/src/app/overview/AssetAllocation";
import { MarketOverview } from "@/src/app/overview/MarketOverview";
import { PortfolioPerformance } from "@/src/app/overview/PortfolioPerformance";
import { RecentActivity } from "@/src/app/overview/RecentActivity";
import { SummaryCards } from "@/src/app/overview/SummaryCards";
import { copyTraders, formatPct, formatSignedUsd, formatUsd } from "@/src/data/dashboardMock";
import { useDeskState } from "@/src/app/state/DeskState";
import { StatusPill } from "@/src/app/ui/StatusPill";

const kycLabel: Record<string, string> = {
  not_started: "Not started",
  pending: "In review",
  verified: "Verified",
  rejected: "Not approved",
  resubmission_required: "Needs an update",
};

export function OverviewPage({ kycStatus }: { accountStatus: string; kycStatus: string }) {
  const { strategies } = useDeskState();
  const active = strategies.filter((item) => item.status === "ACTIVE");

  return (
    <div className="space-y-3">
      <p className="text-[12px] text-zinc-600">
        Preview figures for the interface. Not a live balance.
        {kycStatus !== "verified" ? (
          <>
            {" "}Identity verification is {kycLabel[kycStatus] ?? "not started"}.{" "}
            <Link to="/app/verification" className="text-orange">Review status</Link>
          </>
        ) : null}
      </p>
      <SummaryCards />
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <PortfolioPerformance />
        <AssetAllocation />
      </div>
      <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c]">
        <header className="flex items-center justify-between border-b border-white/[0.05] px-4 py-3">
          <h2 className="text-[13px] text-white">AI Trading</h2>
          <Link to="/app/ai-trading" className="text-[12px] text-orange">View AI Trading</Link>
        </header>
        <ul className="divide-y divide-white/[0.04]">
          {active.map((item) => (
            <li key={item.id}>
              <Link to={`/app/ai-trading/${item.id}`} className="grid gap-2 px-4 py-3 sm:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))] sm:items-center">
                <span>
                  <span className="block text-[14px] text-white">{item.name}</span>
                  <span className="text-[12px] text-zinc-500">{item.asset}</span>
                </span>
                <span className="text-[12px] text-zinc-300">{formatUsd(item.allocated)} allocated</span>
                <span className="text-[12px] text-zinc-300">{item.id === "momentum-alpha" ? 3 : item.id === "trend-matrix" ? 2 : 0} open positions</span>
                <span className="font-mono text-[13px] text-orange">{formatSignedUsd(item.todayPnl)} today</span>
                <StatusPill value="Active" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[13px] text-white">Copy Trading</h2>
          <Link to="/app/copy-trading" className="text-[12px] text-orange">Explore marketplace</Link>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {copyTraders.slice(0, 3).map((trader) => (
            <Link key={trader.id} to={`/app/copy-trading/${trader.id}`} className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
              <div className="flex items-center justify-between">
                <p className="text-[14px] text-white">{trader.name}</p>
                <span className="text-[12px] text-orange">{formatPct(trader.roi30)}</span>
              </div>
              <p className="mt-1 text-[12px] text-zinc-500">{trader.handle} · {trader.risk}</p>
              <div className="mt-3 h-8">
                <MiniSpark values={trader.spark} width={160} height={32} />
              </div>
            </Link>
          ))}
        </div>
      </section>
      <MarketOverview />
      <RecentActivity />
    </div>
  );
}
