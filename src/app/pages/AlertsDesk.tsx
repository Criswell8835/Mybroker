import { useState } from "react";
import { Modal } from "@/src/app/ui/Modal";
import { StatusPill } from "@/src/app/ui/StatusPill";
import { useDeskState, type DeskAlert } from "@/src/app/state/DeskState";
import { alertKinds, markets } from "@/src/data/dashboardMock";

const empty = { id: "", kind: alertKinds[0], asset: markets[0].pair, trigger: "", status: "Armed" as const };

export function AlertsDesk() {
  const { alerts, saveAlert, removeAlert } = useDeskState();
  const [draft, setDraft] = useState<DeskAlert | null>(null);

  function save() {
    if (!draft || draft.trigger.trim().length < 2) return;
    saveAlert({ ...draft, id: draft.id || `local-${Date.now()}`, trigger: draft.trigger.trim() });
    setDraft(null);
  }

  return (
    <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c]">
      <header className="flex items-center justify-between border-b border-white/[0.05] px-4 py-3">
        <div>
          <h2 className="text-[15px] text-white">Alerts</h2>
          <p className="text-[12px] text-zinc-600">Stored in this browser session only.</p>
        </div>
        <button type="button" className="desk-action desk-action-buy" onClick={() => setDraft({ ...empty })}>
          Create alert
        </button>
      </header>
      {alerts.length === 0 ? <p className="px-4 py-6 text-[13px] text-zinc-500">No alerts.</p> : null}
      <ul>
        {alerts.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center gap-3 border-t border-white/[0.04] px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-white">{item.kind}</p>
              <p className="text-[12px] text-zinc-500">{item.asset} · {item.trigger}</p>
            </div>
            <StatusPill value={item.status} />
            <button type="button" className="text-[12px] text-zinc-400" onClick={() => setDraft(item)}>Edit</button>
            <button type="button" className="text-[12px] text-crimson" onClick={() => removeAlert(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <Modal open={draft != null} title={draft?.id ? "Edit alert" : "Create alert"} onClose={() => setDraft(null)}>
        {draft ? (
          <div className="space-y-3">
            <label className="block text-[12px] text-zinc-500">
              Type
              <select className="desk-field mt-1" value={draft.kind} onChange={(event) => setDraft({ ...draft, kind: event.target.value })}>
                {alertKinds.map((kind) => <option key={kind}>{kind}</option>)}
              </select>
            </label>
            <label className="block text-[12px] text-zinc-500">
              Asset
              <select className="desk-field mt-1" value={draft.asset} onChange={(event) => setDraft({ ...draft, asset: event.target.value })}>
                {markets.map((item) => <option key={item.id}>{item.pair}</option>)}
              </select>
            </label>
            <label className="block text-[12px] text-zinc-500">
              Trigger
              <input className="desk-field mt-1" value={draft.trigger} onChange={(event) => setDraft({ ...draft, trigger: event.target.value })} placeholder="Above 110,000" />
            </label>
            <label className="block text-[12px] text-zinc-500">
              Status
              <select className="desk-field mt-1" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as DeskAlert["status"] })}>
                <option>Armed</option>
                <option>Paused</option>
              </select>
            </label>
            <button type="button" className="desk-action desk-action-buy" onClick={save}>Save alert</button>
          </div>
        ) : null}
      </Modal>
    </section>
  );
}
