import { useMemo, useState, type PointerEvent } from "react";
import { Maximize2, SlidersHorizontal } from "lucide-react";
import { buildCandles, formatPrice, markets, type ChartRange, type Candle } from "@/src/data/dashboardMock";
import { cn } from "@/lib/cn";

const ranges: ChartRange[] = ["1H", "4H", "1D", "1W", "1M", "1Y"];

export function TradingChart({
  symbol,
  onSymbol,
  marks = [],
}: {
  symbol: string;
  onSymbol: (symbol: string) => void;
  marks?: { index: number; label: string }[];
}) {
  const [range, setRange] = useState<ChartRange>("1D");
  const [hover, setHover] = useState<number | null>(null);
  const [grid, setGrid] = useState(true);
  const [average, setAverage] = useState(false);
  const [tools, setTools] = useState(false);
  const market = markets.find((item) => item.pair.startsWith(`${symbol}/`)) ?? markets[0];
  const candles = useMemo(() => buildCandles(market.price, range), [market.price, range]);
  const last = candles[candles.length - 1];
  const change = last ? ((last.c - candles[0].o) / candles[0].o) * 100 : 0;

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/[0.05] px-4 py-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-[11px] tracking-[0.14em] text-zinc-500" htmlFor="chart-asset">
              PAIR
            </label>
            <select
              id="chart-asset"
              className="desk-field h-8 w-auto pr-8"
              value={market.pair}
              onChange={(event) => onSymbol(event.target.value.split("/")[0])}
            >
              {markets.map((item) => (
                <option key={item.id} value={item.pair}>
                  {item.pair}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-2 font-mono text-[22px] tracking-[-0.04em] text-white">{formatPrice(last?.c ?? market.price)}</p>
          <p className={cn("text-[12px]", change < 0 ? "text-crimson" : "text-orange")}>
            {change >= 0 ? "+" : ""}
            {change.toFixed(2)}% this view
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {ranges.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRange(item)}
              className={cn("rounded-md px-2 py-1 text-[11px]", item === range ? "bg-orange/15 text-orange" : "text-zinc-500 hover:text-zinc-200")}
            >
              {item}
            </button>
          ))}
          <button type="button" className={cn("rounded-md px-2 py-1 text-[11px]", average ? "text-orange" : "text-zinc-500")} onClick={() => setAverage((current) => !current)}>
            MA
          </button>
          <div className="relative">
            <button type="button" className="grid h-7 w-7 place-items-center text-zinc-500 hover:text-zinc-200" aria-label="Chart settings" onClick={() => setTools((current) => !current)}>
              <SlidersHorizontal size={14} />
            </button>
            {tools ? (
              <div className="absolute right-0 z-20 mt-1 w-36 rounded-md border border-white/10 bg-[#121212] p-2 text-[12px] text-zinc-300">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={grid} onChange={() => setGrid((current) => !current)} />
                  Grid
                </label>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="grid h-7 w-7 place-items-center text-zinc-500 hover:text-zinc-200"
            aria-label="Full screen chart"
            onClick={(event) => {
              const node = event.currentTarget.closest("[data-chart-frame]");
              if (node instanceof HTMLElement) void node.requestFullscreen?.();
            }}
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>
      <div data-chart-frame className="bg-[#090909]">
        <CandlePlot candles={candles} hover={hover} setHover={setHover} grid={grid} average={average} marks={marks} />
        <p className="px-4 pb-3 text-[11px] text-zinc-600">Prototype chart. Not a live feed.</p>
      </div>
    </div>
  );
}

function CandlePlot({
  candles,
  hover,
  setHover,
  grid,
  average,
  marks,
}: {
  candles: Candle[];
  hover: number | null;
  setHover: (index: number | null) => void;
  grid: boolean;
  average: boolean;
  marks: { index: number; label: string }[];
}) {
  const width = 760;
  const height = 320;
  const pad = { top: 16, right: 72, bottom: 48, left: 12 };
  const plotH = 220;
  const volumeTop = pad.top + plotH + 16;
  const highs = candles.map((item) => item.h);
  const lows = candles.map((item) => item.l);
  const max = Math.max(...highs);
  const min = Math.min(...lows);
  const span = max - min || 1;
  const innerW = width - pad.left - pad.right;
  const slot = innerW / candles.length;
  const y = (value: number) => pad.top + (1 - (value - min) / span) * plotH;
  const maxVol = Math.max(...candles.map((item) => item.v));
  const active = hover == null ? null : candles[hover];

  const averagePath = candles
    .map((_, index) => {
      const slice = candles.slice(Math.max(0, index - 3), index + 1);
      const mean = slice.reduce((sum, item) => sum + item.c, 0) / slice.length;
      const x = pad.left + slot * index + slot / 2;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y(mean).toFixed(1)}`;
    })
    .join(" ");

  function onMove(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * width;
    const index = Math.min(candles.length - 1, Math.max(0, Math.floor((x - pad.left) / slot)));
    setHover(index);
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-[280px] w-full sm:h-[360px]"
      role="img"
      aria-label="Market chart"
      onPointerMove={onMove}
      onPointerLeave={() => setHover(null)}
    >
      {grid
        ? [0, 0.5, 1].map((step) => {
            const gy = pad.top + plotH * step;
            return <line key={step} x1={pad.left} x2={width - pad.right} y1={gy} y2={gy} stroke="rgba(255,255,255,0.06)" />;
          })
        : null}
      {[0, 0.5, 1].map((step) => {
        const value = max - span * step;
        return (
          <text key={step} x={width - 8} y={pad.top + plotH * step + 4} textAnchor="end" fill="#71717a" fontSize="11">
            {formatPrice(value).replace(".00", "")}
          </text>
        );
      })}
      {candles.map((candle, index) => {
        const x = pad.left + slot * index + slot / 2;
        const up = candle.c >= candle.o;
        const color = up ? "#E85C24" : "#C8102E";
        const body = Math.max(Math.abs(y(candle.o) - y(candle.c)), 1.5);
        const top = Math.min(y(candle.o), y(candle.c));
        return (
          <g key={candle.t + index}>
            <line x1={x} x2={x} y1={y(candle.h)} y2={y(candle.l)} stroke={color} strokeWidth="1" />
            <rect x={x - Math.min(slot * 0.28, 6)} y={top} width={Math.min(slot * 0.56, 12)} height={body} fill={color} />
            <rect
              x={x - Math.min(slot * 0.28, 6)}
              y={volumeTop + 36 - (candle.v / maxVol) * 32}
              width={Math.min(slot * 0.56, 12)}
              height={(candle.v / maxVol) * 32}
              fill={up ? "rgba(232,92,36,0.35)" : "rgba(200,16,46,0.35)"}
            />
          </g>
        );
      })}
      {average ? <path d={averagePath} fill="none" stroke="rgba(244,244,245,0.55)" strokeWidth="1.25" /> : null}
      {marks.map((mark) => {
        const index = Math.min(candles.length - 1, Math.max(0, mark.index));
        const x = pad.left + slot * index + slot / 2;
        const candle = candles[index];
        if (!candle) return null;
        return (
          <g key={mark.label + index}>
            <circle cx={x} cy={y(candle.h) - 8} r="3" fill="#E85C24" />
            <text x={x + 6} y={y(candle.h) - 5} fill="#E85C24" fontSize="9">
              {mark.label}
            </text>
          </g>
        );
      })}
      {candles.map((candle, index) => {
        if (index % Math.ceil(candles.length / 4) !== 0 && index !== candles.length - 1) return null;
        const x = pad.left + slot * index + slot / 2;
        return (
          <text key={candle.t} x={x} y={height - 8} textAnchor="middle" fill="#71717a" fontSize="11">
            {candle.t}
          </text>
        );
      })}
      {active && hover != null ? (
        <g>
          <line x1={pad.left + slot * hover + slot / 2} x2={pad.left + slot * hover + slot / 2} y1={pad.top} y2={pad.top + plotH} stroke="rgba(255,255,255,0.2)" />
          <rect x={pad.left} y={8} width="430" height="22" rx="4" fill="#141414" stroke="rgba(255,255,255,0.08)" />
          <text x={pad.left + 8} y={23} fill="#e4e4e7" fontSize="11">
            {`${active.t}  O ${formatPrice(active.o)}  H ${formatPrice(active.h)}  L ${formatPrice(active.l)}  C ${formatPrice(active.c)}`}
          </text>
        </g>
      ) : null}
    </svg>
  );
}
