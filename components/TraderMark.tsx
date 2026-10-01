type TraderMarkId = "orbit" | "signal" | "lattice";

export function TraderMark({ mark }: { mark: TraderMarkId }) {
  return (
    <span className={`trader-mark trader-mark-${mark}`} aria-hidden="true">
      {mark === "orbit" ? <Orbit /> : null}
      {mark === "signal" ? <Signal /> : null}
      {mark === "lattice" ? <Lattice /> : null}
    </span>
  );
}

function Orbit() {
  return (
    <svg viewBox="0 0 48 48">
      <g className="trader-spin">
        <ellipse cx="24" cy="24" rx="14" ry="6.5" />
        <ellipse cx="24" cy="24" rx="14" ry="6.5" transform="rotate(60 24 24)" />
        <ellipse cx="24" cy="24" rx="14" ry="6.5" transform="rotate(120 24 24)" />
        <circle cx="38" cy="24" r="2.1" className="trader-core" />
      </g>
      <circle cx="24" cy="24" r="3.2" className="trader-core" />
    </svg>
  );
}

function Signal() {
  return (
    <svg viewBox="0 0 48 48">
      <rect className="trader-bar trader-bar-1" x="12" y="18" width="3.2" height="12" rx="1.6" />
      <rect className="trader-bar trader-bar-2" x="18.4" y="13" width="3.2" height="22" rx="1.6" />
      <rect className="trader-bar trader-bar-3" x="24.8" y="16" width="3.2" height="16" rx="1.6" />
      <rect className="trader-bar trader-bar-4" x="31.2" y="11" width="3.2" height="26" rx="1.6" />
    </svg>
  );
}

function Lattice() {
  return (
    <svg viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="12" className="trader-ring" />
      <g className="trader-spin trader-spin-slow">
        <circle cx="24" cy="12" r="2" className="trader-core" />
        <circle cx="34.4" cy="30" r="2" className="trader-core" />
        <circle cx="13.6" cy="30" r="2" className="trader-core" />
        <path d="M24 12 L34.4 30 L13.6 30 Z" />
      </g>
    </svg>
  );
}
