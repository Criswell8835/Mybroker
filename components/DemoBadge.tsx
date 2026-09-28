import { cn } from "@/lib/cn";

export function DemoBadge({
  children = "DEMO DATA",
  className,
}: {
  children?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium tracking-[0.18em] text-zinc-400",
        className,
      )}
    >
      {children}
    </span>
  );
}
