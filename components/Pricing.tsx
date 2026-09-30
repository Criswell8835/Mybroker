import { useState } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/Reveal";
import { APP_ROUTE } from "@/lib/brand";
import { cn } from "@/lib/cn";
import {
  comparisonGroups,
  formatPlanPrice,
  pricingPlans,
  type BillingCycle,
  type ComparisonValue,
  type PricingPlan,
} from "@/lib/pricing";

export function Pricing() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  return (
    <section
      id="pricing"
      className="scroll-mt-24 overflow-x-hidden px-5 py-28 sm:px-8 lg:px-12 lg:py-36"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="max-w-2xl">
          <p className="text-[11px] tracking-[0.26em] text-zinc-500">PRICING</p>
          <h2 className="mt-5 text-[34px] font-normal leading-[1.06] tracking-[-0.045em] text-white sm:text-[46px]">
            Choose your level of intelligence.
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-7 text-zinc-400">
            Start with the essentials. Upgrade when you need deeper market
            intelligence, analytics, and control.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <BillingToggle cycle={cycle} onChange={setCycle} />
            <p className="text-[12px] tracking-[0.02em] text-zinc-500">
              Save with annual billing
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <Reveal key={plan.id} delay={0.08 + index * 0.08} className="h-full">
              <PlanCard plan={plan} cycle={cycle} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12} className="mt-20">
          <ComparisonTable />
        </Reveal>
      </div>
    </section>
  );
}

function BillingToggle({
  cycle,
  onChange,
}: {
  cycle: BillingCycle;
  onChange: (next: BillingCycle) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Billing period"
      className="relative inline-grid w-fit grid-cols-2 rounded-lg border border-white/[0.08] bg-[#0c0c0c] p-0.5"
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-md bg-white/[0.08] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          cycle === "yearly" && "translate-x-[calc(100%+2px)]",
        )}
      />
      {(["monthly", "yearly"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={cycle === option}
          className={cn(
            "relative z-[1] rounded-md px-4 py-1.5 text-[12px] tracking-[0.08em] transition-colors duration-300",
            cycle === option ? "text-white" : "text-zinc-500 hover:text-zinc-300",
          )}
        >
          {option === "monthly" ? "Monthly" : "Yearly"}
        </button>
      ))}
    </div>
  );
}

function PlanCard({
  plan,
  cycle,
}: {
  plan: PricingPlan;
  cycle: BillingCycle;
}) {
  const amount = cycle === "monthly" ? plan.monthly : plan.yearly;
  const period = cycle === "monthly" ? "month" : "year";

  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-[18px] border p-6 transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-7",
        plan.id === "free" &&
          "border-white/[0.06] bg-[#0b0b0b] hover:-translate-y-[3px] hover:border-white/13 hover:shadow-[0_24px_50px_rgba(0,0,0,0.38)]",
        plan.id === "pro" &&
          "border-orange/30 bg-[linear-gradient(180deg,rgba(232,92,36,0.1)_0%,rgba(17,17,17,0.97)_28%)] shadow-[0_24px_70px_rgba(0,0,0,0.4),0_0_36px_rgba(232,92,36,0.07)] hover:-translate-y-[4px] hover:border-orange/45 hover:shadow-[0_28px_72px_rgba(0,0,0,0.45),0_0_42px_rgba(232,92,36,0.1)]",
        plan.id === "advanced" &&
          "border-white/[0.08] bg-[#070707] shadow-[inset_0_1px_0_rgba(232,92,36,0.08)] hover:-translate-y-[3px] hover:border-white/14 hover:shadow-[inset_0_1px_0_rgba(200,16,46,0.18),0_24px_50px_rgba(0,0,0,0.42)]",
      )}
    >
      {plan.id === "pro" ? (
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-orange/50 to-transparent" />
      ) : null}
      {plan.id === "advanced" ? (
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-crimson/40 to-transparent" />
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[13px] tracking-[0.18em] text-zinc-300">
            {plan.name}
          </h3>
          <p
            className={cn(
              "mt-2 text-[11px] tracking-[0.16em]",
              plan.id === "pro"
                ? "text-orange"
                : plan.id === "advanced"
                  ? "text-zinc-400"
                  : "text-zinc-500",
            )}
          >
            {plan.positioning}
          </p>
        </div>
        {plan.highlighted ? (
          <span className="rounded-md border border-orange/25 bg-orange/10 px-2 py-0.5 text-[9px] tracking-[0.16em] text-orange">
            Most Popular
          </span>
        ) : null}
      </div>

      <p className="mt-5 text-[13px] leading-6 text-zinc-400">
        {plan.description}
      </p>

      <p className="mt-7 flex items-end gap-1.5">
        <span className="text-[36px] font-normal tracking-[-0.04em] text-white sm:text-[40px]">
          {formatPlanPrice(amount)}
        </span>
        <span className="mb-1.5 text-[13px] text-zinc-500">/{period}</span>
      </p>

      <Link
        to={APP_ROUTE}
        className={cn(
          "mt-7 w-full",
          plan.id === "pro" ? "btn-primary" : "btn-secondary",
        )}
      >
        {plan.cta}
      </Link>

      <ul className="mt-8 flex-1 space-y-1 border-t border-white/[0.06] pt-5 text-[13px] leading-6 text-zinc-400">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="-mx-1 flex gap-2.5 rounded-md px-1 py-0.5 transition-colors duration-300 hover:text-zinc-200"
          >
            <span
              className={cn(
                "mt-2.5 h-1 w-1 shrink-0 rounded-full",
                plan.id === "pro" ? "bg-orange/80" : "bg-white/30",
              )}
            />
            {feature}
          </li>
        ))}
      </ul>
    </article>
  );
}

function ComparisonTable() {
  return (
    <div>
      <p className="text-[11px] tracking-[0.26em] text-zinc-500">COMPARE PLANS</p>
      <h3 className="mt-4 text-[26px] font-normal tracking-[-0.03em] text-white sm:text-[32px]">
        Compare plans
      </h3>

      <div className="mt-8 overflow-x-auto rounded-[18px] border border-white/[0.07] bg-[#0b0b0b]">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,0.8fr))] border-b border-white/[0.06] px-4 py-3.5 text-[10px] tracking-[0.16em] text-zinc-500 sm:px-6">
            <span className="pr-3">Capability</span>
            {pricingPlans.map((plan) => (
              <span
                key={plan.id}
                className={cn(
                  "text-center",
                  plan.highlighted ? "text-orange" : "text-zinc-500",
                )}
              >
                {plan.name}
              </span>
            ))}
          </div>

          {comparisonGroups.map((group) => (
            <div
              key={group.title}
              className="border-b border-white/[0.06] last:border-b-0"
            >
              <div className="bg-white/[0.015] px-4 py-3 text-[10px] tracking-[0.18em] text-zinc-500 sm:px-6">
                {group.title}
              </div>
              <ul>
                {group.rows.map((row) => (
                  <li
                    key={row.label}
                    className="grid grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,0.8fr))] items-center px-4 py-3 text-[12px] transition-colors duration-300 hover:bg-white/[0.02] sm:px-6 sm:text-[13px]"
                  >
                    <span className="pr-3 leading-5 text-zinc-400">
                      {row.label}
                    </span>
                    <ComparisonCell value={row.free} />
                    <ComparisonCell value={row.pro} emphasized />
                    <ComparisonCell value={row.advanced} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComparisonCell({
  value,
  emphasized = false,
}: {
  value: ComparisonValue;
  emphasized?: boolean;
}) {
  if (value === true) {
    return (
      <span className="flex justify-center text-zinc-200" aria-label="Included">
        <span
          className={cn(
            "h-[5px] w-[5px] rounded-full",
            emphasized ? "bg-orange" : "bg-white/55",
          )}
        />
      </span>
    );
  }

  if (value === false) {
    return (
      <span className="text-center text-zinc-700" aria-label="Not included">
        —
      </span>
    );
  }

  return (
    <span
      className={cn(
        "text-center leading-4",
        emphasized ? "text-zinc-200" : "text-zinc-400",
      )}
    >
      {value}
    </span>
  );
}
