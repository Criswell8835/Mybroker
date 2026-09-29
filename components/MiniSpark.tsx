export function MiniSpark({
  values,
  width = 120,
  height = 36,
  tone = "orange",
}: {
  values: number[];
  width?: number;
  height?: number;
  tone?: "orange" | "white" | "crimson";
}) {
  if (!values.length) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const d = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / span) * (height - 4) - 2;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
  const area = `${d} L ${width} ${height} L 0 ${height} Z`;
  const stroke =
    tone === "crimson"
      ? "#C8102E"
      : tone === "white"
        ? "rgba(244,244,245,0.72)"
        : "#E85C24";
  const fill =
    tone === "crimson"
      ? "rgba(200,16,46,0.12)"
      : tone === "white"
        ? "rgba(255,255,255,0.06)"
        : "rgba(232,92,36,0.14)";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      <path d={area} fill={fill} />
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.25" />
    </svg>
  );
}
