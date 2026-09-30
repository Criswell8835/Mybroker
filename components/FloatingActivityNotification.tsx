
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { activityEvents, type ActivityKind } from "@/lib/activity";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;
const FIRST_DELAY_MS = 6800;
const VISIBLE_MS = 5600;
const GAP_MS = 11000;
const AFTER_DISMISS_MS = 15000;

const indicatorClass: Record<ActivityKind, string> = {
  trade: "bg-orange",
  position: "bg-orange",
  deposit: "bg-[#7d9a78]",
  withdrawal: "bg-crimson",
  copy: "bg-orange",
  follow: "bg-orange",
};

export function FloatingActivityNotification() {
  const prefersReducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;

    let showId = 0;
    let hideId = 0;
    let gapId = 0;
    let cancelled = false;

    const show = (advance: boolean) => {
      if (cancelled) return;
      if (advance) {
        setIndex((current) => (current + 1) % activityEvents.length);
      }
      setOpen(true);
      hideId = window.setTimeout(() => {
        if (cancelled) return;
        setOpen(false);
        gapId = window.setTimeout(() => show(true), GAP_MS);
      }, VISIBLE_MS);
    };

    showId = window.setTimeout(
      () => show(session > 0),
      session === 0 ? FIRST_DELAY_MS : AFTER_DISMISS_MS,
    );

    return () => {
      cancelled = true;
      window.clearTimeout(showId);
      window.clearTimeout(hideId);
      window.clearTimeout(gapId);
    };
  }, [ready, session]);

  if (!ready) return null;

  const event = activityEvents[index];
  if (!event) return null;

  const reduce = prefersReducedMotion === true;
  const duration = reduce ? 0.12 : 0.22;

  return (
    <div className="pointer-events-none fixed bottom-5 left-4 right-4 z-30 sm:bottom-8 sm:left-8 sm:right-auto sm:w-[480px] lg:w-[520px]">
      <AnimatePresence mode="wait">
        {open ? (
          <motion.aside
            key={event.id}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration, ease }}
            className="pointer-events-auto w-full rounded-[20px] border border-white/[0.08] bg-[#0b0b0b]/92 px-5 py-4 shadow-[0_22px_50px_rgba(0,0,0,0.48)] sm:px-6 sm:py-5"
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className={cn(
                  "mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full sm:mt-[9px]",
                  indicatorClass[event.kind],
                )}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[14px] leading-6 tracking-[-0.015em] text-zinc-100 sm:text-[15px]">
                    {event.message}
                  </p>
                  <button
                    type="button"
                    aria-label="Dismiss notification"
                    onClick={() => {
                      setOpen(false);
                      setSession((current) => current + 1);
                    }}
                    className="-mr-1 -mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 transition-colors duration-300 hover:text-zinc-200"
                  >
                    <X size={14} strokeWidth={1.6} />
                  </button>
                </div>
                {event.detail ? (
                  <p className="mt-1 text-[13px] leading-5 text-zinc-400">
                    {event.detail}
                  </p>
                ) : null}
                <p className="mt-2.5 text-[12px] tracking-[0.01em] text-zinc-500">
                  {event.timeAgo}
                </p>
              </div>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
