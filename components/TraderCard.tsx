"use client";

import { ArrowUpRight } from "lucide-react";
import { DemoBadge } from "@/components/DemoBadge";
import { cn } from "@/lib/cn";
import { formatChange } from "@/lib/market-data";
import type { TraderProfile } from "@/lib/traders";
import { SAMPLE_PROFILE_LABEL } from "@/lib/traders";

export function TraderCard({
  trader,
  featured = false,
}: {
  trader: TraderProfile;
  featured?: boolean;
}) {
  const initials = trader.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <article
      className={cn(
        "card-lift group relative rounded-xl border border-white/[0.07] bg-[#0e0e0e] p-6",
        featured && "sm:p-7",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-[10px] tracking-[0.14em] text-zinc-400">
            {initials}
          </div>
          <div>
            <h3 className="text-[15px] font-normal tracking-[-0.015em] text-white">
              {trader.name}
            </h3>
            <p className="mt-0.5 text-[12px] tracking-[0.01em] text-zinc-500">
              {trader.strategy}
            </p>
          </div>
        </div>
        <DemoBadge>{SAMPLE_PROFILE_LABEL}</DemoBadge>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/[0.06] pt-5 sm:grid-cols-4">
        <div>
          <dt className="text-[10px] tracking-[0.16em] text-zinc-500">
            PERFORMANCE
          </dt>
          <dd className="mt-1.5 text-[13px] text-orange">
            {formatChange(trader.performance)}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] tracking-[0.16em] text-zinc-500">RISK</dt>
          <dd className="mt-1.5 text-[13px] text-white">{trader.risk}</dd>
        </div>
        <div>
          <dt className="text-[10px] tracking-[0.16em] text-zinc-500">
            CONSISTENCY
          </dt>
          <dd className="mt-1.5 text-[13px] text-white">{trader.consistency}</dd>
        </div>
        <div>
          <dt className="text-[10px] tracking-[0.16em] text-zinc-500">
            FOLLOWERS
          </dt>
          <dd className="mt-1.5 text-[13px] text-white">
            {trader.followers.toLocaleString("en-US")}
          </dd>
        </div>
      </dl>

      <p className="mt-5 text-[13px] leading-6 text-zinc-400">{trader.style}</p>
      <p className="mt-3 text-[11px] text-zinc-600">{trader.note}</p>

      <div className="mt-6 flex items-center justify-between text-[12px] text-zinc-500">
        <span>{trader.allocation}</span>
        <span className="inline-flex items-center gap-1 text-zinc-500 transition-colors group-hover:text-white">
          Review
          <ArrowUpRight size={12} />
        </span>
      </div>
    </article>
  );
}
