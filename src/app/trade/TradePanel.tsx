import { useMemo, useState } from "react";
import { formatPrice, formatUsd, markets, portfolioSummary } from "@/src/data/dashboardMock";
import { useDeskState } from "@/src/app/state/DeskState";
import { cn } from "@/lib/cn";

export function TradePanel({ symbol }: { symbol: string }) {
  const market = markets.find((item) => item.pair.startsWith(`${symbol}/`)) ?? markets[0];
  const [type, setType] = useState<"Market" | "Limit">("Market");
  const [amount, setAmount] = useState("");
  const [limit, setLimit] = useState(String(market.price));
  const [protect, setProtect] = useState(false);
  const [note, setNote] = useState("");
  const [pendingSide, setPendingSide] = useState<"Buy" | "Sell" | null>(null);
  const { confirmTicket } = useDeskState();

  const price = type === "Market" ? market.price : Number(limit);
  const qty = Number(amount);
  const total = useMemo(() => (Number.isFinite(qty) && Number.isFinite(price) ? qty * price : 0), [price, qty]);
  const ready = qty > 0 && price > 0;

  function submit(side: "Buy" | "Sell") {
    if (!ready) return;
    if (confirmTicket && pendingSide !== side) {
      setPendingSide(side);
      setNote(`Confirm the ${side.toLowerCase()} preview. No order is sent until you confirm.`);
      return;
    }
    setPendingSide(null);
    setNote(`${side} ${qty} ${symbol} at ${formatPrice(price)} is a preview ticket. No order was sent, and the balance did not change.`);
  }

  return (
    <aside className="border-t border-white/[0.05] p-4 xl:border-l xl:border-t-0">
      <p className="text-[13px] text-white">{market.pair}</p>
      <p className="mt-3 text-[11px] tracking-[0.14em] text-zinc-500">AVAILABLE BALANCE</p>
      <p className="mt-1 font-mono text-[18px] text-white">{formatUsd(portfolioSummary.available)}</p>
      <div className="mt-4 grid grid-cols-2 gap-1 rounded-md bg-white/[0.03] p-1">
        {(["Market", "Limit"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setType(item)}
            className={cn("h-8 rounded text-[12px]", type === item ? "bg-white/[0.07] text-white" : "text-zinc-500")}
          >
            {item}
          </button>
        ))}
      </div>
      <label className="mt-4 block text-[11px] text-zinc-500">
        Amount ({symbol})
        <input className="desk-field mt-1" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" />
      </label>
      <label className="mt-3 block text-[11px] text-zinc-500">
        Price
        <input
          className="desk-field mt-1"
          inputMode="decimal"
          value={type === "Market" ? formatPrice(market.price) : limit}
          disabled={type === "Market"}
          onChange={(event) => setLimit(event.target.value)}
        />
      </label>
      <div className="mt-4 flex items-center justify-between text-[12px]">
        <span className="text-zinc-500">Estimated total</span>
        <span className="font-mono text-zinc-200">{formatUsd(total)}</span>
      </div>
      <label className="mt-3 flex items-center gap-2 text-[12px] text-zinc-400">
        <input type="checkbox" checked={protect} onChange={() => setProtect((current) => !current)} />
        Reduce-only protection
      </label>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" className="desk-action desk-action-buy" disabled={!ready} onClick={() => submit("Buy")}>
          Buy {symbol}
        </button>
        <button type="button" className="desk-action desk-action-sell" disabled={!ready} onClick={() => submit("Sell")}>
          Sell {symbol}
        </button>
      </div>
      <p className="mt-3 text-[11px] leading-5 text-zinc-600">
        {note || "This ticket is a frontend prototype. It does not reach an exchange."}
        {protect ? " Protection is stored only in this form." : ""}
      </p>
    </aside>
  );
}
