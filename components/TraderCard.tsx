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
        "group relative rounded-2xl border border-white/8 bg-white/[0.025] p-5 transition-colors duration-300 hover:border-white/16 hover:bg-white/[0.04]",
        featured && "sm:p-6",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[11px] tracking-[0.12em] text-zinc-300">
            {initials}
          </div>
          <div>
            <h3 className="text-[15px] font-medium text-white">{trader.name}</h3>
            <p className="text-[12px] text-zinc-500">{trader.strategy}</p>
          </div>
        </div>
        <DemoBadge>{SAMPLE_PROFILE_LABEL}</DemoBadge>
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-white/8 pt-5">
        <div>
          <dt className="text-[10px] tracking-[0.16em] text-zinc-500">
            PERFORMANCE
          </dt>
          <dd className="mt-1 text-sm text-white">
            {formatChange(trader.performance)}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] tracking-[0.16em] text-zinc-500">RISK</dt>
          <dd className="mt-1 text-sm text-white">{trader.risk}</dd>
        </div>
        <div>
          <dt className="text-[10px] tracking-[0.16em] text-zinc-500">
            FOLLOWERS
          </dt>
          <dd className="mt-1 text-sm text-white">
            {trader.followers.toLocaleString("en-US")}
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-[13px] leading-6 text-zinc-400">{trader.style}</p>
      <p className="mt-3 text-[11px] text-zinc-600">{trader.note}</p>

      <div className="mt-5 flex items-center justify-between text-[12px] text-zinc-500">
        <span>{trader.allocation}</span>
        <span className="inline-flex items-center gap-1 text-zinc-400 transition-colors group-hover:text-white">
          Review
          <ArrowUpRight size={13} />
        </span>
      </div>
    </article>
  );
}
