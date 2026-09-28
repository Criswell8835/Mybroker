import { Logo } from "@/components/Logo";

const columns = [
  {
    title: "Platform",
    links: [
      { href: "#markets", label: "Markets" },
      { href: "#ai-trading", label: "AI Trading" },
      { href: "#copy-trading", label: "Copy Trading" },
      { href: "#features", label: "Features" },
      { href: "#pricing", label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#cta", label: "About" },
      { href: "#cta", label: "Contact" },
      { href: "#security", label: "Security" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "#cta", label: "Help Center" },
      { href: "#cta", label: "Documentation" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "#cta", label: "Privacy" },
      { href: "#cta", label: "Terms" },
      { href: "#cta", label: "Risk Disclosure" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/8 px-5 py-14 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col justify-between gap-12 lg:flex-row">
          <div className="max-w-xs">
            <Logo className="text-white" />
            <p className="mt-4 text-[13px] leading-6 text-zinc-500">
              AI-powered crypto trading and copy trading. Demonstration market
              data is labeled throughout this site.
            </p>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="text-[11px] tracking-[0.18em] text-zinc-500">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[13px] text-zinc-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/8 pt-6 text-[12px] text-zinc-600 sm:flex-row">
          <p>© {new Date().getFullYear()} KAIVO. All rights reserved.</p>
          <p className="max-w-xl sm:text-right">
            Crypto assets are volatile. You can lose money. Nothing on this
            homepage is an offer, solicitation, or performance guarantee.
          </p>
        </div>
      </div>
    </footer>
  );
}
