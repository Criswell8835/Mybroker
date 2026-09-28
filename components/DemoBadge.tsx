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
        "inline-flex items-center rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[9px] tracking-[0.16em] text-zinc-500",
        className,
      )}
    >
      {children}
    </span>
  );
}
