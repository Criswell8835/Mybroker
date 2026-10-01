import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/cn";

const productLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/markets", label: "Markets" },
  { to: "/ai-trading", label: "AI Trading" },
  { to: "/copy-trading", label: "Copy Trading" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/faq", label: "FAQ" },
];

function navClass(active: boolean) {
  return cn(
    "text-[12px] tracking-[0.08em] transition-colors duration-150",
    active ? "text-white" : "text-zinc-500 hover:text-white",
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

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
    setOpen(false);
  }, [pathname]);

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
            "mx-auto flex h-[52px] max-w-[1180px] items-center justify-between rounded-xl px-4 sm:px-5",
            scrolled || open
              ? "border border-white/[0.07] bg-black/78 shadow-[0_8px_28px_rgba(0,0,0,0.35)] backdrop-blur-md"
              : "border border-transparent bg-transparent",
          )}
        >
          <Link to="/" className="relative z-10 shrink-0 text-white">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-5 xl:flex xl:gap-7">
            {productLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => navClass(isActive)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-1 xl:flex">
            <NavLink
              to="/login"
              className={({ isActive }) => cn("px-3.5 py-2", navClass(isActive))}
            >
              Log In
            </NavLink>
            <Link to="/signup" className="btn-primary btn-compact ml-1">
              Create Account
            </Link>
          </div>

          <button
            type="button"
            className="relative z-10 flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-white xl:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-40 xl:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="nav-panel absolute inset-0 bg-black/55"
            onClick={() => setOpen(false)}
          />
          <div className="nav-panel absolute inset-x-3 top-[4.6rem] rounded-[18px] border border-white/[0.08] bg-[#0c0c0c]/95 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-md sm:inset-x-5">
            <p className="px-3 pb-2 pt-1 text-[10px] tracking-[0.2em] text-zinc-500">
              EXPLORE
            </p>
            <nav className="flex flex-col">
              {productLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    cn(
                      "rounded-lg px-3 py-3 text-[15px] tracking-[-0.01em]",
                      isActive ? "bg-white/[0.04] text-white" : "text-zinc-300",
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-2 flex flex-col gap-2 border-t border-white/[0.06] pt-3">
              <Link
                to="/login"
                className="rounded-lg px-3 py-3 text-[14px] text-zinc-300"
              >
                Log In
              </Link>
              <Link to="/signup" className="btn-primary w-full">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
