import { Link } from "react-router-dom";

export function SectionPage({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <section className="max-w-xl rounded-2xl border border-white/[0.07] bg-[#0c0c0c] px-6 py-8">
      <p className="text-[11px] tracking-[0.2em] text-zinc-500">DESK</p>
      <h2 className="mt-3 text-[28px] tracking-[-0.04em] text-white">{title}</h2>
      <p className="mt-4 text-[14px] leading-7 text-zinc-400">{text}</p>
      <Link to="/app" className="mt-6 inline-flex text-[13px] text-orange">
        Back to dashboard
      </Link>
    </section>
  );
}
