import { AssetAllocation } from "@/src/app/overview/AssetAllocation";
import { HoldingsTable } from "@/src/app/overview/HoldingsTable";
import { PortfolioPerformance } from "@/src/app/overview/PortfolioPerformance";
import { SummaryCards } from "@/src/app/overview/SummaryCards";
import { Workspace } from "@/src/app/trade/Workspace";

export function PortfolioDesk() {
  return (
    <div className="space-y-3">
      <SummaryCards />
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <PortfolioPerformance />
        <AssetAllocation />
      </div>
      <HoldingsTable />
    </div>
  );
}

export function TradeDesk() {
  return <Workspace />;
}
