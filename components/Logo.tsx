import { cn } from "@/lib/cn";

export function Logo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 28 28"
        className={cn("h-[18px] w-[18px]", markClassName)}
        aria-hidden="true"
      >
        <rect
          x="2.2"
          y="2.2"
          width="23.6"
          height="23.6"
          rx="7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <rect
          x="8"
          y="8"
          width="12"
          height="12"
          rx="3.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          opacity="0.38"
        />
        <circle cx="14" cy="14" r="2.15" fill="#C8102E" />
      </svg>
      <span className="text-[13px] font-medium tracking-[0.28em]">KAIVO</span>
    </span>
  );
}
