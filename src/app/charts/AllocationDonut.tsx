const tones = ["#E85C24", "#F07832", "#C8102E", "#A1A1AA", "#3F3F46"];

export function AllocationDonut({
  slices,
}: {
  slices: { symbol: string; pct: number }[];
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let cursor = 0;

  return (
    <svg viewBox="0 0 120 120" className="h-36 w-36" role="img" aria-label="Asset allocation">
      <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
      {slices.map((slice, index) => {
        const length = (slice.pct / 100) * circumference;
        const dash = `${length} ${circumference - length}`;
        const rotation = (cursor / 100) * 360 - 90;
        cursor += slice.pct;
        return (
          <circle
            key={slice.symbol}
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={tones[index] ?? "#71717a"}
            strokeWidth="12"
            strokeDasharray={dash}
            strokeLinecap="butt"
            transform={`rotate(${rotation} 60 60)`}
          />
        );
      })}
      <circle cx="60" cy="60" r="28" fill="#0c0c0c" />
    </svg>
  );
}
