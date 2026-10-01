import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicShell } from "@/components/PublicShell";
import { Reveal } from "@/components/Reveal";
import { services } from "@/lib/platform-content";

export function ServicesPage() {
  return (
    <PublicShell>
      <section className="px-5 pb-8 pt-32 sm:px-8 lg:px-12 lg:pt-40">
        <Reveal className="mx-auto max-w-[1200px]">
          <p className="text-[11px] tracking-[0.26em] text-zinc-500">SERVICES</p>
          <h1 className="mt-5 max-w-3xl text-[40px] font-normal leading-[1.02] tracking-[-0.045em] text-white sm:text-[60px]">
            What the platform is built to do.
          </h1>
        </Reveal>
      </section>
      <div className="mx-auto max-w-[1200px] space-y-6 px-5 pb-28 sm:px-8 lg:px-12">
        {services.map((service) => (
          <Reveal key={service.id}>
            <article className="grid gap-6 rounded-[18px] border border-white/[0.07] bg-[#0c0c0c] px-6 py-7 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
              <div>
                <h2 className="text-[28px] tracking-[-0.04em] text-white">{service.title}</h2>
                <p className="mt-3 max-w-xl text-[15px] leading-7 text-zinc-400">{service.text}</p>
                <Link to={service.to} className="mt-6 inline-flex items-center gap-2 text-[13px] text-white">
                  {service.cta}
                  <ArrowRight size={14} />
                </Link>
              </div>
              <ul className="grid content-center gap-2 sm:grid-cols-2">
                {service.points.map((point) => (
                  <li key={point} className="rounded-xl border border-white/[0.06] px-3 py-3 text-[13px] text-zinc-300">
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </PublicShell>
  );
}
