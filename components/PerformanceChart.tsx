"use client";

import { useMemo } from "react";
import { cn } from "@/lib/cn";

export function PerformanceChart({
  values,
  idPrefix = "equity",
}: {
  values: number[];
  idPrefix?: string;
}) {
  const layout = useMemo(() => {
    const width = 760;
    const height = 220;
    const pad = { top: 16, right: 16, bottom: 18, left: 8 };
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;
    const x = (index: number) =>
      pad.left + (index / Math.max(values.length - 1, 1)) * plotW;
    const y = (value: number) => pad.top + ((max - value) / span) * plotH;
    const line = values
      .map((value, index) => `${index === 0 ? "M" : "L"} ${x(index).toFixed(2)} ${y(value).toFixed(2)}`)
      .join(" ");
    const area = `${line} L ${x(values.length - 1)} ${pad.top + plotH} L ${x(0)} ${pad.top + plotH} Z`;
    const ticks = [max, min + span * 0.5, min];

    return { width, height, pad, plotH, line, area, ticks, y };
  }, [values]);

  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      className="h-full w-full"
      role="img"
      aria-label="Demonstration portfolio performance"
    >
      <defs>
        <linearGradient id={`${idPrefix}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E85C24" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#E85C24" stopOpacity="0" />
        </linearGradient>
      </defs>
      {layout.ticks.map((tick) => (
        <line
          key={tick}
          x1={layout.pad.left}
          x2={layout.width - layout.pad.right}
          y1={layout.y(tick)}
          y2={layout.y(tick)}
          stroke="rgba(255,255,255,0.045)"
        />
      ))}
      <path d={layout.area} fill={`url(#${idPrefix}-fill)`} />
      <path
        d={layout.line}
        fill="none"
        stroke="rgba(232,92,36,0.78)"
        strokeWidth="1.4"
        className="chart-line"
        pathLength={1}
      />
    </svg>
  );
}

export function AllocationRing({
  segments,
}: {
  segments: Array<{ name: string; pct: number; tone: string }>;
}) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <svg viewBox="0 0 100 100" className="h-[132px] w-[132px]">
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="8"
      />
      {segments.map((segment) => {
        const length = (segment.pct / 100) * circumference * 0.92;
        const dash = `${length} ${circumference - length}`;
        const current = offset;
        offset += (segment.pct / 100) * circumference;
        return (
          <circle
            key={segment.name}
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={segment.tone}
            strokeWidth="8"
            strokeDasharray={dash}
            strokeDashoffset={-current}
            strokeLinecap="butt"
            transform="rotate(-90 50 50)"
          />
        );
      })}
    </svg>
  );
}

export function RangeTabs({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (next: string) => void;
  options: readonly string[];
}) {
  return (
    <div className="flex items-center gap-0.5 rounded-md border border-white/[0.07] p-0.5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "rounded-[5px] px-2.5 py-1 text-[11px] tracking-[0.08em] transition-colors",
            option === value
              ? "bg-white/[0.08] text-white"
              : "text-zinc-500 hover:text-zinc-300",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
