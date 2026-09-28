"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import type { Candle } from "@/lib/market-data";

type ChartProps = {
  candles: Candle[];
  className?: string;
  height?: number;
  showVolume?: boolean;
  overlay?: boolean;
  idPrefix?: string;
};

export function CandlestickChart({
  candles,
  className,
  height = 280,
  showVolume = true,
  overlay = true,
  idPrefix = "chart",
}: ChartProps) {
  const [hover, setHover] = useState<number | null>(null);

  const layout = useMemo(() => {
    const width = 920;
    const pad = { top: 18, right: 64, bottom: showVolume ? 52 : 22, left: 10 };
    const highs = candles.map((candle) => candle.high);
    const lows = candles.map((candle) => candle.low);
    const max = Math.max(...highs);
    const min = Math.min(...lows);
    const span = max - min || 1;
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;
    const gap = plotW / candles.length;
    const body = Math.max(2.4, gap * 0.58);

    const y = (value: number) => pad.top + ((max - value) / span) * plotH;
    const x = (index: number) => pad.left + gap * index + gap / 2;

    const line = candles
      .map((candle, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${y(candle.close)}`)
      .join(" ");

    const area = `${line} L ${x(candles.length - 1)} ${pad.top + plotH} L ${x(0)} ${pad.top + plotH} Z`;

    const ticks = [max, min + span * 0.66, min + span * 0.33, min];
    const volumes = candles.map((candle) => candle.volume);
    const maxVol = Math.max(...volumes);

    return { width, pad, plotH, plotW, body, y, x, line, area, ticks, max, min, maxVol };
  }, [candles, height, showVolume]);

  const active = hover ?? candles.length - 1;
  const activeCandle = candles[active];

  return (
    <div className={cn("relative h-full w-full", className)}>
      <svg
        viewBox={`0 0 ${layout.width} ${height}`}
        className="h-full w-full"
        onMouseLeave={() => setHover(null)}
        role="img"
        aria-label="Demonstration candlestick chart"
      >
        <defs>
          <linearGradient id={`${idPrefix}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C8102E" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#C8102E" stopOpacity="0" />
          </linearGradient>
          <filter id={`${idPrefix}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {layout.ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={layout.pad.left}
              x2={layout.width - layout.pad.right}
              y1={layout.y(tick)}
              y2={layout.y(tick)}
              stroke="rgba(255,255,255,0.045)"
              strokeWidth="1"
            />
            <text
              x={layout.width - 8}
              y={layout.y(tick) + 3}
              textAnchor="end"
              fill="rgba(255,255,255,0.28)"
              fontSize="10"
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
            >
              {tick >= 1000 ? tick.toFixed(0) : tick.toFixed(2)}
            </text>
          </g>
        ))}

        {overlay ? (
          <path d={layout.area} fill={`url(#${idPrefix}-area)`} opacity="0.9" />
        ) : null}

        {candles.map((candle, index) => {
          const up = candle.close >= candle.open;
          const cx = layout.x(index);
          const y1 = layout.y(Math.max(candle.open, candle.close));
          const y2 = layout.y(Math.min(candle.open, candle.close));
          const bodyH = Math.max(1.5, y2 - y1);

          return (
            <g
              key={index}
              onMouseEnter={() => setHover(index)}
              className="cursor-crosshair"
            >
              <rect
                x={cx - layout.body}
                y={layout.pad.top}
                width={layout.body * 2}
                height={layout.plotH}
                fill="transparent"
              />
              <line
                x1={cx}
                x2={cx}
                y1={layout.y(candle.high)}
                y2={layout.y(candle.low)}
                stroke={up ? "rgba(244,244,245,0.72)" : "#C8102E"}
                strokeWidth="1"
              />
              <rect
                x={cx - layout.body / 2}
                y={y1}
                width={layout.body}
                height={bodyH}
                rx="0.6"
                fill={up ? "rgba(244,244,245,0.88)" : "#C8102E"}
              />
            </g>
          );
        })}

        {overlay ? (
          <path
            d={layout.line}
            fill="none"
            stroke="#C8102E"
            strokeWidth="1.35"
            filter={`url(#${idPrefix}-glow)`}
            className="chart-line"
            pathLength={1}
          />
        ) : null}

        {showVolume
          ? candles.map((candle, index) => {
              const up = candle.close >= candle.open;
              const volH = (candle.volume / layout.maxVol) * 28;
              return (
                <rect
                  key={`v-${index}`}
                  x={layout.x(index) - layout.body / 2}
                  y={height - 8 - volH}
                  width={layout.body}
                  height={volH}
                  fill={up ? "rgba(255,255,255,0.16)" : "rgba(200,16,46,0.38)"}
                />
              );
            })
          : null}

        {hover !== null ? (
          <line
            x1={layout.x(hover)}
            x2={layout.x(hover)}
            y1={layout.pad.top}
            y2={layout.pad.top + layout.plotH}
            stroke="rgba(255,255,255,0.16)"
            strokeDasharray="3 4"
          />
        ) : null}
      </svg>

      {activeCandle ? (
        <div className="pointer-events-none absolute left-3 top-2 hidden rounded-md border border-white/8 bg-black/40 px-2 py-1 font-mono text-[10px] text-zinc-400 sm:block">
          O {activeCandle.open.toFixed(2)} · H {activeCandle.high.toFixed(2)} · L{" "}
          {activeCandle.low.toFixed(2)} · C {activeCandle.close.toFixed(2)}
        </div>
      ) : null}
    </div>
  );
}
