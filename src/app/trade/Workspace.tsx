import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TradingChart } from "@/src/app/charts/TradingChart";
import { TradePanel } from "@/src/app/trade/TradePanel";

export function Workspace({ initial = "BTC" }: { initial?: string }) {
  const [params] = useSearchParams();
  const requested = params.get("pair");
  const [symbol, setSymbol] = useState(requested || initial);

  return (
    <section className="overflow-hidden rounded-lg border border-white/[0.06] bg-[#0c0c0c] xl:grid xl:grid-cols-[minmax(0,1fr)_300px]">
      <TradingChart symbol={symbol} onSymbol={setSymbol} />
      <TradePanel key={symbol} symbol={symbol} />
    </section>
  );
}
