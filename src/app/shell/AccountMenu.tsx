import { useEffect, useRef, useState } from "react";
import { ChevronUp, CreditCard, LogOut, Shield, Settings, BadgeCheck, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

const links = [
  { to: "/app/profile", label: "Profile", icon: UserRound },
  { to: "/app/verification", label: "Verification", icon: BadgeCheck },
  { to: "/app/subscription", label: "Subscription", icon: CreditCard },
  { to: "/app/settings", label: "Settings", icon: Settings },
  { to: "/app/security", label: "Security", icon: Shield },
];

export function AccountMenu({
  name,
  email,
  status,
  plan,
  onLogout,
  compact = false,
  placement = "up",
}: {
  name: string;
  email: string;
  status: string;
  plan?: string;
  onLogout: () => void;
  compact?: boolean;
  placement?: "up" | "down";
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const initial = (name || email || "A").slice(0, 1).toUpperCase();

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-md text-left transition-colors hover:bg-white/[0.04]",
          compact ? "px-1 py-1" : "px-1.5 py-1.5",
        )}
        aria-expanded={open}
        aria-label="Account menu"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-orange/30 bg-orange/10 text-[11px] text-orange">
          {initial}
        </span>
        {compact ? null : (
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] text-zinc-100">{name}</span>
            <span className="block truncate text-[11px] text-zinc-500">{email}</span>
            <span className="block text-[10px] tracking-[0.12em] text-zinc-600">{status.toUpperCase()}{plan ? ` · ${plan}` : ""}</span>
          </span>
        )}
        {compact ? null : <ChevronUp size={14} className={cn("text-zinc-500 transition-transform", open && "rotate-180")} />}
      </button>
      {open ? (
        <div
          className={cn(
            "desk-modal absolute z-40 w-52 rounded-md border border-white/10 bg-[#121212] p-1 shadow-[0_18px_50px_rgba(0,0,0,0.45)]",
            placement === "down" ? "right-0 top-[calc(100%+8px)]" : "bottom-[calc(100%+8px)] left-0",
          )}
        >
          <p className="px-2 py-1.5 text-[11px] text-zinc-500">{email}</p>
          {links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-zinc-200 hover:bg-white/[0.04]"
            >
              <item.icon size={14} />
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] text-zinc-200 hover:bg-white/[0.04]"
          >
            <LogOut size={14} />
            Log out
          </button>
        </div>
      ) : null}
    </div>
  );
}
