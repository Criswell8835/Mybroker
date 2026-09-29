"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";
import { faqItems } from "@/lib/faq";

const ease = [0.22, 1, 0.36, 1] as const;

export function Faq() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section
      id="faq"
      className="relative scroll-mt-24 overflow-x-hidden px-5 py-28 sm:px-8 lg:px-12 lg:py-36"
    >
      <div className="ambient left-[-90px] top-24 hidden h-[240px] w-[240px] bg-[rgba(232,92,36,0.06)] lg:block" />
      <div className="ambient bottom-10 right-[-70px] hidden h-[200px] w-[200px] bg-[rgba(200,16,46,0.05)] lg:block" />

      <div className="relative mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start lg:gap-24">
        <Reveal className="max-w-md">
          <p className="text-[11px] tracking-[0.26em] text-zinc-500">FAQ</p>
          <h2 className="mt-5 text-[34px] font-normal leading-[1.06] tracking-[-0.045em] text-white sm:text-[46px]">
            Questions, answered.
          </h2>
          <p className="mt-5 text-[15px] leading-7 text-zinc-400">
            Everything you need to know about the platform, AI Trading, Copy
            Trading, funding, and withdrawals.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="min-w-0">
          <div className="border-t border-white/[0.07]">
            {faqItems.map((item) => (
              <FaqRow
                key={item.id}
                item={item}
                open={openId === item.id}
                onToggle={() =>
                  setOpenId((current) => (current === item.id ? null : item.id))
                }
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FaqRow({
  item,
  open,
  onToggle,
}: {
  item: (typeof faqItems)[number];
  open: boolean;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();
  const reactId = useId();
  const panelId = `${reactId}-panel`;
  const buttonId = `${reactId}-button`;

  return (
    <div
      className={cn(
        "border-b transition-colors duration-300",
        open ? "border-orange/20" : "border-white/[0.07]",
      )}
    >
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className={cn(
            "flex w-full items-start justify-between gap-6 py-6 text-left transition-colors duration-300 sm:py-7",
            "hover:text-white",
            open ? "text-white" : "text-zinc-300",
          )}
        >
          <span className="max-w-[38rem] text-[15px] leading-6 tracking-[-0.01em] sm:text-[16px] sm:leading-7">
            {item.question}
          </span>
          <PlusMinus open={open} />
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: reduce ? 0.01 : 0.42,
              ease,
            }}
            className="overflow-hidden"
          >
            <p className="max-w-[38rem] pb-6 text-[14px] leading-7 text-zinc-400 sm:pb-7 sm:text-[15px]">
              {item.answer}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function PlusMinus({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative mt-1.5 h-3.5 w-3.5 shrink-0 transition-colors duration-300",
        open ? "text-orange" : "text-zinc-500",
      )}
    >
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
      <span
        className={cn(
          "absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open && "scale-y-0",
        )}
      />
    </span>
  );
}
