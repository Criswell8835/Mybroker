
import { Reveal } from "@/components/Reveal";
import { BRAND_NAME } from "@/lib/brand";

const principles = [
  {
    title: "Transparent information",
    body: "Market figures and trader profiles on this homepage are labeled as demonstration or sample content. Nothing here is presented as live execution.",
  },
  {
    title: "Clear risk disclosure",
    body: `Crypto trading can result in the loss of capital. ${BRAND_NAME} does not promise returns, and copy trading still requires your own judgment.`,
  },
  {
    title: "Account-first design",
    body: "Authentication, custody and production protections will be documented as those systems ship. This page does not claim licenses, audits or insurance.",
  },
];

export function SecuritySection() {
  return (
    <section id="security" className="scroll-mt-24 px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
        <Reveal>
          <p className="text-[11px] tracking-[0.28em] text-zinc-500">
            TRUST
          </p>
          <h2 className="mt-5 text-[32px] font-normal leading-[1.12] tracking-[-0.04em] text-white sm:text-[40px]">
            Built to be precise with what we claim.
          </h2>
        </Reveal>

        <div className="divide-y divide-white/8 border-t border-white/8">
          {principles.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <div className="grid gap-3 py-7 sm:grid-cols-[200px_1fr] sm:gap-10">
                <h3 className="text-[14px] font-normal text-white">{item.title}</h3>
                <p className="text-[14px] leading-7 text-zinc-400">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
