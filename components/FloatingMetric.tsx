"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

export function FloatingMetric({
  label,
  value,
  detail,
  delay = 0,
  className,
  floatClassName = "float-slow",
}: {
  label: string;
  value: string;
  detail?: string;
  delay?: number;
  className?: string;
  floatClassName?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn(
        "glass-strong pointer-events-none absolute z-20 min-w-[168px] rounded-2xl px-4 py-3.5",
        !reduce && floatClassName,
        className,
      )}
      initial={reduce ? false : { opacity: 0.96, y: 10 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="text-[10px] font-medium tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className="mt-1.5 text-[15px] font-medium tracking-tight text-white">
        {value}
      </p>
      {detail ? (
        <p className="mt-1 text-[12px] text-zinc-500">{detail}</p>
      ) : null}
    </motion.div>
  );
}
