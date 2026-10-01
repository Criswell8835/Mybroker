import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function AccountCta({
  title,
  text,
  label,
  to = "/signup",
}: {
  title: string;
  text: string;
  label: string;
  to?: string;
}) {
  return (
    <section className="px-5 pb-28 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-6 rounded-[18px] border border-white/[0.07] bg-[#0c0c0c] px-6 py-8 sm:flex-row sm:items-center sm:px-8">
        <div className="max-w-xl">
          <h2 className="text-[28px] font-normal tracking-[-0.04em] text-white sm:text-[34px]">
            {title}
          </h2>
          <p className="mt-3 text-[14px] leading-6 text-zinc-400">{text}</p>
        </div>
        <Link to={to} className="btn-primary w-full sm:w-auto">
          {label}
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
