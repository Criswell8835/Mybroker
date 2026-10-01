import { comparisonGroups, formatPlanPrice, pricingPlans, type ComparisonValue } from "@/lib/pricing";
import { subscriptionPreview } from "@/src/data/dashboardMock";
import { useDeskState } from "@/src/app/state/DeskState";
import { cn } from "@/lib/cn";

export function SubscriptionDesk() {
  const { planId, setPlanId } = useDeskState();
  const current = pricingPlans.find((plan) => plan.id === planId) ?? pricingPlans[0];

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-[22px] tracking-[-0.03em] text-white">Subscription</h2>
        <p className="mt-1 text-[13px] text-zinc-400">Manage your trading plan and platform access.</p>
      </header>
      <section className="rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-4">
        <p className="text-[11px] tracking-[0.16em] text-zinc-500">CURRENT PLAN</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-[28px] tracking-[-0.04em] text-white">{current.name.toUpperCase()}</h3>
            <p className="mt-1 font-mono text-[18px] text-zinc-200">{formatPlanPrice(current.monthly)} / month</p>
            <p className="mt-2 text-[13px] text-orange">Status {subscriptionPreview.status}</p>
            <p className="text-[13px] text-zinc-400">Next billing {subscriptionPreview.nextBilling}</p>
          </div>
          <a href="#plans" className="desk-action">Manage subscription</a>
        </div>
        <p className="mt-3 text-[12px] text-zinc-600">Plan changes on this screen stay in the session. Nothing is charged.</p>
      </section>

      <section id="plans">
        <h3 className="text-[13px] tracking-[0.14em] text-zinc-500">COMPARE PLANS</h3>
        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          {pricingPlans.map((plan) => {
            const active = plan.id === planId;
            const rank = { free: 0, pro: 1, advanced: 2 };
            const higher = rank[plan.id] > rank[planId];
            return (
              <article key={plan.id} className={cn("rounded-lg border p-4", active ? "border-orange/40 bg-orange/[0.05]" : "border-white/[0.06] bg-[#0c0c0c]")}>
                <p className="text-[12px] tracking-[0.14em] text-zinc-500">{plan.positioning.toUpperCase()}</p>
                <h4 className="mt-2 text-[22px] text-white">{plan.name}</h4>
                <p className="mt-2 font-mono text-[20px] text-white">{formatPlanPrice(plan.monthly)}<span className="text-[13px] text-zinc-500"> / month</span></p>
                <p className="mt-2 text-[13px] leading-6 text-zinc-400">{plan.description}</p>
                <ul className="mt-4 space-y-1.5 text-[12px] text-zinc-300">
                  {plan.features.slice(0, 6).map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                {active ? (
                  <p className="mt-4 text-[13px] text-orange">Current plan</p>
                ) : higher ? (
                  <button type="button" className="desk-action desk-action-buy mt-4" onClick={() => setPlanId(plan.id)}>
                    Upgrade to {plan.name}
                  </button>
                ) : (
                  <button type="button" className="desk-action mt-4" onClick={() => setPlanId(plan.id)}>
                    Switch to {plan.name}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="overflow-x-auto rounded-lg border border-white/[0.06] bg-[#0c0c0c]">
        <table className="w-full min-w-[640px] text-left text-[12px]">
          <thead>
            <tr className="text-[11px] tracking-[0.12em] text-zinc-500">
              <th className="px-4 py-3 font-normal">FEATURE</th>
              {pricingPlans.map((plan) => (
                <th key={plan.id} className={cn("px-4 py-3 font-normal", plan.id === planId && "text-orange")}>{plan.name.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonGroups.flatMap((group) => {
              const title = group.title === "AI Tools" ? "AI Trading" : group.title;
              return [
                <tr key={group.title} className="border-t border-white/[0.05]">
                  <td colSpan={4} className="px-4 py-2 text-[11px] tracking-[0.14em] text-zinc-500">{title.toUpperCase()}</td>
                </tr>,
                ...group.rows.map((row) => (
                  <tr key={group.title + row.label} className="border-t border-white/[0.04]">
                    <td className="px-4 py-2 text-zinc-300">{row.label}</td>
                    <td className="px-4 py-2 text-zinc-400">{cell(row.free)}</td>
                    <td className="px-4 py-2 text-zinc-400">{cell(row.pro)}</td>
                    <td className="px-4 py-2 text-zinc-400">{cell(row.advanced)}</td>
                  </tr>
                )),
              ];
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function cell(value: ComparisonValue) {
  if (value === true) return "Included";
  if (value === false) return "—";
  return value;
}
