"use client";

import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";
import { pricingPlans } from "@/lib/pricing";

export function Pricing() {
  return (
    <section
      id="pricing"
      className="scroll-mt-24 px-5 py-28 sm:px-8 lg:px-12 lg:py-36"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="max-w-xl">
          <p className="text-[11px] tracking-[0.28em] text-zinc-500">
            PRICING
          </p>
          <h2 className="mt-5 text-[34px] font-normal tracking-[-0.04em] text-white sm:text-[46px]">
            Access scaled to how you trade.
          </h2>
          <p className="mt-5 text-[15px] leading-7 text-zinc-400">
            Plans describe product access. They do not imply performance or
            financial return.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <Reveal key={plan.id} delay={index * 0.08}>
              <article
                className={cn(
                  "flex h-full flex-col rounded-xl border p-6 sm:p-8",
                  plan.highlighted
                    ? "border-crimson/30 bg-[linear-gradient(180deg,rgba(200,16,46,0.08),rgba(255,255,255,0.02))]"
                    : "border-white/[0.07] bg-white/[0.02]",
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm tracking-[0.16em] text-zinc-300">
                    {plan.name}
                  </h3>
                  {plan.highlighted ? (
                    <span className="text-[10px] tracking-[0.16em] text-crimson">
                      MOST USED
                    </span>
                  ) : null}
                </div>
                <p className="mt-6 flex items-end gap-1">
                  <span className="text-4xl font-normal tracking-[-0.04em] text-white">
                    {plan.price === 0 ? "Free" : `$${plan.price}`}
                  </span>
                  {plan.price !== 0 ? (
                    <span className="mb-1 text-sm text-zinc-500">
                      /{plan.period}
                    </span>
                  ) : null}
                </p>
                <p className="mt-3 min-h-[48px] text-[13px] leading-6 text-zinc-400">
                  {plan.description}
                </p>
                <ul className="mt-6 flex-1 space-y-2.5 text-[13px] text-zinc-300">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-crimson" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#cta"
                  className={cn(
                    "mt-8 flex h-11 items-center justify-center rounded-md text-[13px] transition-colors",
                    plan.highlighted
                      ? "bg-crimson text-white hover:bg-crimson-soft"
                      : "border border-white/12 text-white hover:bg-white/[0.04]",
                  )}
                >
                  {plan.cta}
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
