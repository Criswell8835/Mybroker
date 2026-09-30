import { Link } from "react-router-dom";

export function ReservedRoute({ label }: { label: string }) {
  return (
    <main className="grid min-h-full place-items-center px-6 py-24 text-center">
      <div>
        <p className="text-[11px] tracking-[0.26em] text-zinc-500">{label}</p>
        <Link to="/" className="btn-secondary mt-8">
          Return home
        </Link>
      </div>
    </main>
  );
}
