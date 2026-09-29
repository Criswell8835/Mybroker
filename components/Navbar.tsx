import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { APP_ROUTE } from "@/lib/brand";
import { cn } from "@/lib/cn";

const links = [
  { href: "#markets", label: "Markets" },
  { href: "#ai-trading", label: "AI Trading" },
  { href: "#copy-trading", label: "Copy Trading" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 18;
      setScrolled((current) => (current === next ? current : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-3.5">
        <div
          className={cn(
            "mx-auto flex h-[52px] max-w-[1180px] items-center justify-between rounded-xl px-4 transition-all duration-500 sm:px-5",
            scrolled
              ? "border border-white/[0.07] bg-black/72 shadow-[0_8px_28px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
              : "border border-transparent bg-transparent",
          )}
        >
          <a href="#top" className="relative z-10 shrink-0 text-white">
            <Logo />
          </a>

          <nav className="hidden items-center gap-9 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[12px] tracking-[0.08em] text-zinc-500 transition-colors duration-300 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-1 lg:flex">
            <a
              href="#cta"
              className="px-3.5 py-2 text-[12px] tracking-[0.08em] text-zinc-500 transition-colors duration-300 hover:text-white"
            >
              Log In
            </a>
            <Link to={APP_ROUTE} className="btn-primary btn-compact ml-1">
              Start Trading
            </Link>
          </div>

          <button
            type="button"
            className="relative z-10 flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-white lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-40 bg-[#050505]/96 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex h-full flex-col px-6 pb-10 pt-24">
              <nav className="flex flex-col gap-1">
                {links.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index, duration: 0.4 }}
                    className="border-b border-white/5 py-4 text-[28px] font-normal tracking-[-0.03em] text-white"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3">
                <a
                  href="#cta"
                  onClick={() => setOpen(false)}
                  className="btn-secondary w-full"
                >
                  Log In
                </a>
                <Link
                  to={APP_ROUTE}
                  onClick={() => setOpen(false)}
                  className="btn-primary w-full"
                >
                  Start Trading
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
