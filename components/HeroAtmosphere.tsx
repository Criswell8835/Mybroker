const nodes = [
  { cx: 868, cy: 438, r: 2.1, delay: "0s" },
  { cx: 214, cy: 312, r: 1.5, delay: "1.4s" },
  { cx: 612, cy: 868, r: 1.9, delay: "2.2s" },
  { cx: 132, cy: 548, r: 1.3, delay: "0.7s" },
  { cx: 778, cy: 268, r: 1.6, delay: "3.1s" },
  { cx: 448, cy: 118, r: 2.0, delay: "1.8s" },
  { cx: 726, cy: 742, r: 1.2, delay: "4.2s" },
  { cx: 298, cy: 792, r: 1.7, delay: "2.6s" },
];

export function HeroAtmosphere() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="glow-breathe absolute left-[46%] top-[4%] h-[560px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(232,92,36,0.14)_0%,rgba(200,16,46,0.05)_36%,transparent_68%)] blur-3xl" />
      <div className="absolute left-[32%] top-[10%] h-[340px] w-[240px] -rotate-[18deg] rounded-full bg-[radial-gradient(circle,rgba(200,16,46,0.11)_0%,transparent_72%)] blur-3xl" />
      <div className="absolute right-[16%] top-[14%] h-[200px] w-[300px] rotate-[12deg] rounded-full bg-[radial-gradient(circle,rgba(232,92,36,0.09)_0%,transparent_74%)] blur-3xl" />

      <svg
        className="absolute left-1/2 top-[-14%] h-[1220px] w-[1220px] -translate-x-1/2 sm:top-[-18%] sm:h-[1380px] sm:w-[1380px]"
        viewBox="0 0 1000 1000"
        fill="none"
      >
        <defs>
          <linearGradient id="trail-a" x1="0.15" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor="#E85C24" stopOpacity="0" />
            <stop offset="22%" stopColor="#E85C24" stopOpacity="0.9" />
            <stop offset="58%" stopColor="#C8102E" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#E85C24" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="trail-b" x1="1" y1="0.1" x2="0" y2="0.9">
            <stop offset="0%" stopColor="#C8102E" stopOpacity="0" />
            <stop offset="34%" stopColor="#C8102E" stopOpacity="0.72" />
            <stop offset="78%" stopColor="#E85C24" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#C8102E" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="trail-c" x1="0.2" y1="1" x2="0.85" y2="0">
            <stop offset="0%" stopColor="#E85C24" stopOpacity="0" />
            <stop offset="40%" stopColor="#E85C24" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#C8102E" stopOpacity="0" />
          </linearGradient>
          <filter id="bloom-xl" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
          <filter id="bloom-md" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="bloom-sm" x="-12%" y="-12%" width="124%" height="124%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
        </defs>

        <ellipse
          cx="492"
          cy="508"
          rx="478"
          ry="402"
          stroke="url(#trail-a)"
          strokeWidth="22"
          opacity="0.16"
          filter="url(#bloom-xl)"
          transform="rotate(-8 492 508)"
        />
        <ellipse
          cx="518"
          cy="486"
          rx="428"
          ry="376"
          stroke="url(#trail-b)"
          strokeWidth="12"
          opacity="0.22"
          filter="url(#bloom-md)"
          transform="rotate(14 518 486)"
        />

        <g className="orbit-slower">
          <ellipse
            cx="500"
            cy="498"
            rx="404"
            ry="352"
            stroke="#E85C24"
            strokeWidth="0.7"
            opacity="0.18"
            transform="rotate(-4 500 498)"
          />
          <path
            d="M148 430 C 210 210, 790 168, 862 448"
            stroke="url(#trail-a)"
            strokeWidth="2.6"
            strokeLinecap="round"
            opacity="0.85"
            filter="url(#bloom-sm)"
          />
          <path
            d="M120 560 C 280 860, 760 840, 890 520"
            stroke="url(#trail-b)"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.42"
          />
        </g>

        <g className="orbit-slow">
          <ellipse
            cx="508"
            cy="504"
            rx="338"
            ry="304"
            stroke="#C8102E"
            strokeWidth="0.65"
            opacity="0.2"
            strokeDasharray="3 11"
            transform="rotate(11 508 504)"
          />
          <path
            d="M190 470 A 328 292 12 0 1 830 390"
            stroke="url(#trail-c)"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M220 620 A 318 286 8 0 0 780 680"
            stroke="url(#trail-a)"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.35"
          />
        </g>

        <g className="orbit-drift">
          <ellipse
            cx="486"
            cy="512"
            rx="268"
            ry="238"
            stroke="#E85C24"
            strokeWidth="0.55"
            opacity="0.14"
            transform="rotate(-16 486 512)"
          />
          <path
            d="M250 390 C 360 250, 690 240, 780 430"
            stroke="url(#trail-b)"
            strokeWidth="2.1"
            strokeDasharray="70 420"
            strokeLinecap="round"
            opacity="0.55"
          />
        </g>

        <path
          d="M340 268 C 430 210, 610 206, 698 280"
          stroke="url(#trail-a)"
          strokeWidth="0.8"
          opacity="0.28"
        />
        <path
          d="M318 732 C 470 810, 640 798, 742 700"
          stroke="#C8102E"
          strokeWidth="0.6"
          opacity="0.18"
        />

        {nodes.map((node) => (
          <circle
            key={`${node.cx}-${node.cy}`}
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill="#E85C24"
            className="particle-drift"
            style={{ animationDelay: node.delay }}
            opacity="0.55"
          />
        ))}
      </svg>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_18%,rgba(5,5,5,0.72)_0%,rgba(5,5,5,0.28)_30%,rgba(5,5,5,0.55)_54%,#050505_80%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#050505] via-[#050505]/75 to-transparent" />
    </div>
  );
}
