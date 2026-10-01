const tones = ["#E85C24", "#C8102E", "#F07832", "#A1A1AA", "#71717A"];

export function AssetMark({ symbol, size = 28 }: { symbol: string; size?: number }) {
  const letter = symbol.slice(0, 1);
  const tone = tones[symbol.charCodeAt(0) % tones.length];
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full border border-white/10 font-mono text-[11px] text-white"
      style={{ width: size, height: size, background: `${tone}22`, color: tone }}
    >
      {letter}
    </span>
  );
}
