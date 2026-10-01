import { useState, type PointerEvent } from "react";
import { formatUsd } from "@/src/data/dashboardMock";

export function PerformanceChart({
  points,
  labels,
}: {
  points: number[];
  labels: string[];
}) {
  const [hover, setHover] = useState<number | null>(null);
  const width = 640;
  const height = 240;
  const pad = { top: 16, right: 64, bottom: 28, left: 8 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;

  const coords = points.map((point, index) => {
    const x = pad.left + (index / Math.max(points.length - 1, 1)) * innerW;
    const y = pad.top + (1 - (point - min) / span) * innerH;
    return { x, y, point };
  });
  const line = coords.map((coord, index) => `${index === 0 ? "M" : "L"} ${coord.x.toFixed(1)} ${coord.y.toFixed(1)}`).join(" ");
  const area = `${line} L ${coords[coords.length - 1].x.toFixed(1)} ${(pad.top + innerH).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(pad.top + innerH).toFixed(1)} Z`;
  const grid = [0, 0.33, 0.66, 1];
  const active = hover == null ? null : coords[hover];

  function onMove(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * width;
    let nearest = 0;
    let best = Number.POSITIVE_INFINITY;
    coords.forEach((coord, index) => {
      const distance = Math.abs(coord.x - x);
      if (distance < best) {
        best = distance;
        nearest = index;
      }
    });
    setHover(nearest);
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-[220px] w-full sm:h-[260px]"
      onPointerMove={onMove}
      onPointerLeave={() => setHover(null)}
      role="img"
      aria-label="Portfolio performance chart"
    >
      {grid.map((step) => {
        const y = pad.top + innerH * step;
        const value = max - span * step;
        return (
          <g key={step}>
            <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="rgba(255,255,255,0.06)" />
            <text x={width - 8} y={y + 4} textAnchor="end" fill="#71717a" fontSize="11">
              {formatUsd(value).replace(".00", "")}
            </text>
          </g>
        );
      })}
      <path d={area} fill="rgba(232,92,36,0.14)" />
      <path d={line} fill="none" stroke="#E85C24" strokeWidth="2" />
      {labels.map((label, index) => {
        const slot = Math.round((index / Math.max(labels.length - 1, 1)) * (coords.length - 1));
        const coord = coords[slot];
        return (
          <text key={label} x={coord.x} y={height - 8} textAnchor="middle" fill="#71717a" fontSize="11">
            {label}
          </text>
        );
      })}
      {active ? (
        <g>
          <line x1={active.x} x2={active.x} y1={pad.top} y2={pad.top + innerH} stroke="rgba(232,92,36,0.45)" />
          <circle cx={active.x} cy={active.y} r="4" fill="#E85C24" />
          <rect x={Math.min(active.x + 8, width - 132)} y={Math.max(active.y - 28, 8)} width="112" height="28" rx="8" fill="#141414" stroke="rgba(255,255,255,0.1)" />
          <text x={Math.min(active.x + 16, width - 124)} y={Math.max(active.y - 10, 26)} fill="#f4f4f5" fontSize="12">
            {formatUsd(active.point)}
          </text>
        </g>
      ) : null}
    </svg>
  );
}
