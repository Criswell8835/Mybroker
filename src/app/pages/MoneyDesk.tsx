import { useMemo, useState } from "react";
import { depositAssets, formatUsd, formatWhen, portfolioSummary, previewAddress, transactions } from "@/src/data/dashboardMock";
import { StatusPill } from "@/src/app/ui/StatusPill";

export function DepositDesk() {
  const [symbol, setSymbol] = useState(depositAssets[0].symbol);
  const asset = depositAssets.find((item) => item.symbol === symbol) ?? depositAssets[0];
  const [network, setNetwork] = useState(asset.networks[0]);
  const [amount, setAmount] = useState("");
  const [hash, setHash] = useState("");
  const [note, setNote] = useState("");
  const history = transactions.filter((item) => item.type === "Deposit");

  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
        <h2 className="text-[15px] text-white">Deposit</h2>
        <p className="mt-1 text-[12px] leading-5 text-zinc-500">Frontend architecture only. This screen does not receive funds or create a blockchain transfer.</p>
        <label className="mt-4 block text-[12px] text-zinc-500">
          Asset
          <select className="desk-field mt-1" value={symbol} onChange={(event) => {
            const next = depositAssets.find((item) => item.symbol === event.target.value) ?? depositAssets[0];
            setSymbol(next.symbol);
            setNetwork(next.networks[0]);
          }}>
            {depositAssets.map((item) => <option key={item.symbol} value={item.symbol}>{item.name}</option>)}
          </select>
        </label>
        <label className="mt-3 block text-[12px] text-zinc-500">
          Network
          <select className="desk-field mt-1" value={network} onChange={(event) => setNetwork(event.target.value)}>
            {asset.networks.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <p className="mt-4 text-[11px] tracking-[0.14em] text-zinc-500">PREVIEW ADDRESS</p>
        <div className="mt-2 flex items-center justify-between gap-3 rounded-md border border-white/10 bg-black/30 px-3 py-2">
          <code className="text-[12px] text-zinc-200">{previewAddress}</code>
          <button type="button" className="text-[12px] text-orange" onClick={() => void navigator.clipboard.writeText(previewAddress)}>Copy</button>
        </div>
        <div className="mt-4">
          <PreviewMark />
          <p className="mt-2 text-[11px] text-zinc-600">Preview mark. Not a deposit code.</p>
        </div>
        <label className="mt-4 block text-[12px] text-zinc-500">
          Amount
          <input className="desk-field mt-1" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" />
        </label>
        <label className="mt-3 block text-[12px] text-zinc-500">
          Transaction hash
          <input className="desk-field mt-1" value={hash} onChange={(event) => setHash(event.target.value)} placeholder="Not submitted" />
        </label>
        <button
          type="button"
          className="desk-action desk-action-buy mt-4"
          onClick={() => setNote("Kept on this screen only. No deposit was created.")}
        >
          Review deposit
        </button>
        {note ? <p className="mt-3 text-[12px] text-zinc-400">{note}</p> : null}
      </section>
      <History title="Deposit history" rows={history} />
    </div>
  );
}

export function WithdrawalDesk() {
  const [symbol, setSymbol] = useState(depositAssets[0].symbol);
  const asset = depositAssets.find((item) => item.symbol === symbol) ?? depositAssets[0];
  const [network, setNetwork] = useState(asset.networks[0]);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [review, setReview] = useState(false);
  const history = transactions.filter((item) => item.type === "Withdrawal");
  const fee = 1.25;

  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
        <h2 className="text-[15px] text-white">Withdrawal</h2>
        <p className="mt-1 text-[12px] leading-5 text-zinc-500">Frontend architecture only. Submitting does not send cryptocurrency.</p>
        <label className="mt-4 block text-[12px] text-zinc-500">
          Asset
          <select className="desk-field mt-1" value={symbol} onChange={(event) => {
            const next = depositAssets.find((item) => item.symbol === event.target.value) ?? depositAssets[0];
            setSymbol(next.symbol);
            setNetwork(next.networks[0]);
          }}>
            {depositAssets.map((item) => <option key={item.symbol} value={item.symbol}>{item.name}</option>)}
          </select>
        </label>
        <label className="mt-3 block text-[12px] text-zinc-500">
          Network
          <select className="desk-field mt-1" value={network} onChange={(event) => setNetwork(event.target.value)}>
            {asset.networks.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="mt-3 block text-[12px] text-zinc-500">
          Destination address
          <input className="desk-field mt-1" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Address" />
        </label>
        <label className="mt-3 block text-[12px] text-zinc-500">
          Amount
          <input className="desk-field mt-1" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" />
        </label>
        <dl className="mt-4 space-y-2 text-[12px]">
          <div className="flex justify-between"><dt className="text-zinc-500">Available balance</dt><dd className="font-mono text-zinc-200">{formatUsd(portfolioSummary.available)}</dd></div>
          <div className="flex justify-between"><dt className="text-zinc-500">Estimated network fee</dt><dd className="font-mono text-zinc-200">{formatUsd(fee)}</dd></div>
          <div className="flex justify-between"><dt className="text-zinc-500">Total</dt><dd className="font-mono text-zinc-200">{amount || "0.00"} {symbol}</dd></div>
        </dl>
        {review ? (
          <div className="mt-4 rounded-md border border-white/10 p-3 text-[12px] text-zinc-300">
            <p>Review {amount || "0"} {symbol} on {network}.</p>
            <p className="mt-1 text-zinc-500">Destination stays on this screen. Nothing is broadcast.</p>
            <div className="mt-3 flex gap-2">
              <button type="button" className="desk-action desk-action-sell" onClick={() => { setNote("Kept on this screen only. No withdrawal was sent."); setReview(false); }}>Confirm</button>
              <button type="button" className="desk-action" onClick={() => setReview(false)}>Back</button>
            </div>
          </div>
        ) : (
          <button type="button" className="desk-action desk-action-sell mt-4" onClick={() => setReview(true)}>
            Review withdrawal
          </button>
        )}
        {note ? <p className="mt-3 text-[12px] text-zinc-400">{note}</p> : null}
      </section>
      <History title="Withdrawal history" rows={history} />
    </div>
  );
}

export function TransactionsDesk() {
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [span, setSpan] = useState("All");
  const tabs = ["All", "Deposits", "Withdrawals", "Manual Trades", "AI Trading", "Copy Trading"];
  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const cutoff = span === "7D" ? Date.now() - 7 * 86400000 : span === "30D" ? Date.now() - 30 * 86400000 : 0;
    const tabType: Record<string, string | null> = {
      All: null,
      Deposits: "Deposit",
      Withdrawals: "Withdrawal",
      "Manual Trades": "Trade",
      "AI Trading": "AI Trading",
      "Copy Trading": "Copy Trading",
    };
    return transactions.filter((item) => {
      const typeOk = !tabType[tab] || item.type === tabType[tab];
      const statusOk = status === "All" || item.status === status;
      const text = `${item.asset} ${item.reference} ${item.type}`.toLowerCase();
      const dateOk = new Date(item.date).getTime() >= cutoff;
      return typeOk && statusOk && dateOk && (!needle || text.includes(needle));
    });
  }, [query, span, status, tab]);

  return (
    <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c]">
      <header className="space-y-3 border-b border-white/[0.05] px-4 py-3">
        <h2 className="text-[15px] text-white">Transactions</h2>
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((item) => (
            <button key={item} type="button" onClick={() => setTab(item)} className={item === tab ? "desk-action desk-action-buy" : "desk-action"}>
              {item}
            </button>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          <input className="desk-field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reference or asset" aria-label="Search transactions" />
          <select className="desk-field" value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Status">
            {["All", "Pending", "Processing", "Completed", "Rejected", "Failed"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="desk-field" value={span} onChange={(event) => setSpan(event.target.value)} aria-label="Date range">
            {["All", "7D", "30D"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </header>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-[12px]">
          <thead className="text-[10px] tracking-[0.14em] text-zinc-600">
            <tr>
              {["Date", "Type", "Asset", "Amount", "Status", "Reference"].map((label) => (
                <th key={label} className="px-4 py-2 font-normal">{label.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className="border-t border-white/[0.04]">
                <td className="px-4 py-2.5 text-zinc-400">{formatWhen(item.date)}</td>
                <td className="px-4 py-2.5 text-zinc-200">{item.type}</td>
                <td className="px-4 py-2.5 text-zinc-300">{item.asset}</td>
                <td className="px-4 py-2.5 font-mono text-zinc-200">{item.amount}</td>
                <td className="px-4 py-2.5"><StatusPill value={item.status} /></td>
                <td className="px-4 py-2.5 font-mono text-zinc-500">{item.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="divide-y divide-white/[0.04] md:hidden">
        {rows.map((item) => (
          <li key={item.id} className="px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[13px] text-white">{item.type}</p>
              <StatusPill value={item.status} />
            </div>
            <p className="mt-1 font-mono text-[12px] text-zinc-300">{item.amount} · {item.asset}</p>
            <p className="text-[11px] text-zinc-600">{formatWhen(item.date)} · {item.reference}</p>
          </li>
        ))}
      </ul>
      {rows.length === 0 ? <p className="px-4 py-6 text-[13px] text-zinc-500">No matching records.</p> : null}
      <p className="border-t border-white/[0.04] px-4 py-2 text-[11px] text-zinc-600">Sample ledger rows. Nothing here was posted to an account.</p>
    </section>
  );
}

function History({ title, rows }: { title: string; rows: typeof transactions }) {
  return (
    <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c]">
      <header className="border-b border-white/[0.05] px-4 py-3">
        <h2 className="text-[13px] text-white">{title}</h2>
      </header>
      <ul>
        {rows.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 border-t border-white/[0.04] px-4 py-3">
            <div>
              <p className="text-[13px] text-zinc-100">{item.amount}</p>
              <p className="text-[11px] text-zinc-600">{formatWhen(item.date)} · {item.reference}</p>
            </div>
            <StatusPill value={item.status} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function PreviewMark() {
  const cells = Array.from({ length: 49 }, (_, index) => (index * 7 + 3) % 5 > 1);
  return (
    <svg viewBox="0 0 7 7" className="h-28 w-28 rounded-md bg-white p-1" aria-hidden="true">
      {cells.map((on, index) => (on ? <rect key={index} x={index % 7} y={Math.floor(index / 7)} width="0.85" height="0.85" fill="#111" /> : null))}
    </svg>
  );
}
