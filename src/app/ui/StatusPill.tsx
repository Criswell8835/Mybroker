import { cn } from "@/lib/cn";

const tones: Record<string, string> = {
  Completed: "text-orange border-orange/30",
  Armed: "text-orange border-orange/30",
  Active: "text-orange border-orange/30",
  Verified: "text-orange border-orange/30",
  Preview: "text-zinc-400 border-white/10",
  Open: "text-orange border-orange/30",
  Pending: "text-zinc-300 border-white/15",
  Processing: "text-zinc-300 border-white/15",
  Paused: "text-zinc-400 border-white/10",
  Stopped: "text-zinc-500 border-white/10",
  Limited: "text-zinc-400 border-white/10",
  Failed: "text-crimson border-crimson/40",
  Rejected: "text-crimson border-crimson/40",
};

export function StatusPill({ value }: { value: string }) {
  return (
    <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-[10px] tracking-[0.12em]", tones[value] ?? "text-zinc-400 border-white/10")}>
      {value.toUpperCase()}
    </span>
  );
}
