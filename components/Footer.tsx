import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { BRAND_NAME } from "@/lib/brand";

const columns = [
  {
    title: "Platform",
    links: [
      { to: "/markets", label: "Markets" },
      { to: "/ai-trading", label: "AI Trading" },
      { to: "/copy-trading", label: "Copy Trading" },
      { to: "/signup", label: "Portfolio" },
      { to: "/services", label: "Services" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/", label: "About" },
      { to: "/reviews", label: "Reviews" },
      { to: "/faq", label: "FAQ" },
      { to: "/faq", label: "Contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { to: "/login", label: "Login" },
      { to: "/signup", label: "Create Account" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/faq", label: "Terms" },
      { to: "/faq", label: "Privacy" },
      { to: "/faq", label: "Risk Disclosure" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_2fr]">
          <div className="max-w-xs">
            <Logo className="text-white" />
            <p className="mt-4 text-[13px] leading-6 text-zinc-500">
              A crypto trading platform for market access, strategy, copy trading,
              and portfolio context.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="text-[11px] tracking-[0.18em] text-zinc-500">{column.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="text-[13px] text-zinc-400 transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-14 border-t border-white/8 pt-6 text-[12px] text-zinc-600">
          © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved. Crypto markets can move against you.
        </p>
      </div>
    </footer>
  );
}
