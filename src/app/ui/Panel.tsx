import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("desk-card rounded-lg border border-white/[0.06] bg-[#0c0c0c]", className)}>
      {title ? (
        <header className="flex items-center justify-between gap-3 border-b border-white/[0.05] px-4 py-3">
          <h2 className="text-[13px] tracking-[-0.02em] text-white">{title}</h2>
          {action}
        </header>
      ) : null}
      <div className={title ? "p-4" : ""}>{children}</div>
    </section>
  );
}
