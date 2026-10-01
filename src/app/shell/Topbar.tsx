import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, LifeBuoy, Menu, Search } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { activity, markets, transactions } from "@/src/data/dashboardMock";
import { deskNav, deskTitle } from "@/src/app/nav";
import { AccountMenu } from "@/src/app/shell/AccountMenu";
import { StatusPill } from "@/src/app/ui/StatusPill";
import { useDeskState } from "@/src/app/state/DeskState";

export function Topbar({
  onMenu,
  email,
  name,
  status,
  onLogout,
}: {
  onMenu: () => void;
  email: string;
  name: string;
  status: string;
  onLogout: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const page = deskTitle(location.pathname);
  const { notices } = useDeskState();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const pages = deskNav.flatMap((group) => group.items);
    const books = transactions.filter((item) => `${item.asset} ${item.reference} ${item.type}`.toLowerCase().includes(needle));
    if (!needle) return { pages: pages.slice(0, 5), markets: markets.slice(0, 3), books: transactions.slice(0, 2) };
    return {
      pages: pages.filter((item) => item.label.toLowerCase().includes(needle)),
      markets: markets.filter((item) => item.pair.toLowerCase().includes(needle) || item.asset.toLowerCase().includes(needle)),
      books,
    };
  }, [query]);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!searchRef.current?.contains(event.target as Node)) setSearchOpen(false);
      if (!notesRef.current?.contains(event.target as Node)) setNotesOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        inputRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/[0.06] bg-[#050505]/92 px-3 py-2 backdrop-blur-md sm:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <button type="button" className="grid h-8 w-8 place-items-center rounded-md border border-white/10 text-zinc-300 lg:hidden" onClick={onMenu} aria-label="Open menu">
          <Menu size={16} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-[14px] text-white">{page.title}</h1>
          <p className="hidden truncate text-[11px] text-zinc-600 sm:block">{page.subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div ref={searchRef} className="relative hidden md:block">
          <div className="flex w-64 items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-2 xl:w-80">
            <Search size={13} className="shrink-0 text-zinc-500" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search assets, markets, transactions..."
              aria-label="Search desk"
              className="w-full bg-transparent py-1.5 text-[12px] text-zinc-100 outline-none placeholder:text-zinc-600"
            />
            <kbd className="hidden rounded border border-white/10 px-1 text-[10px] text-zinc-500 xl:inline">Ctrl K</kbd>
          </div>
          {searchOpen ? (
            <div className="desk-modal absolute right-0 mt-2 w-80 rounded-md border border-white/10 bg-[#121212] p-2 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
              <p className="px-2 py-1 text-[10px] tracking-[0.14em] text-zinc-600">PAGES</p>
              {results.pages.map((item) => (
                <button key={item.to} type="button" className="block w-full rounded-md px-2 py-1.5 text-left text-[13px] text-zinc-200 hover:bg-white/[0.04]" onClick={() => { navigate(item.to); setSearchOpen(false); setQuery(""); }}>
                  {item.label}
                </button>
              ))}
              <p className="mt-2 px-2 py-1 text-[10px] tracking-[0.14em] text-zinc-600">MARKETS</p>
              {results.markets.map((item) => (
                <button key={item.id} type="button" className="block w-full rounded-md px-2 py-1.5 text-left text-[13px] text-zinc-200 hover:bg-white/[0.04]" onClick={() => { navigate("/app/markets"); setSearchOpen(false); setQuery(""); }}>
                  {item.pair}
                </button>
              ))}
              <p className="mt-2 px-2 py-1 text-[10px] tracking-[0.14em] text-zinc-600">TRANSACTIONS</p>
              {results.books.map((item) => (
                <button key={item.id} type="button" className="block w-full rounded-md px-2 py-1.5 text-left text-[13px] text-zinc-200 hover:bg-white/[0.04]" onClick={() => { navigate("/app/transactions"); setSearchOpen(false); setQuery(""); }}>
                  {item.reference} · {item.asset}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div ref={notesRef} className="relative">
          <button type="button" aria-label="Notifications" onClick={() => setNotesOpen((current) => !current)} className="grid h-8 w-8 place-items-center rounded-md border border-white/10 text-zinc-300 hover:text-white">
            <Bell size={15} />
          </button>
          {notesOpen && notices ? (
            <div className="desk-modal absolute right-0 mt-2 w-80 rounded-md border border-white/10 bg-[#121212] p-2 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
              {activity.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-3 rounded-md px-2 py-2">
                  <div>
                    <p className="text-[13px] text-zinc-100">{item.text}</p>
                    <p className="text-[11px] text-zinc-500">{item.time}</p>
                  </div>
                  <StatusPill value={item.status} />
                </div>
              ))}
              <Link to="/app/transactions" className="block px-2 py-2 text-[12px] text-orange" onClick={() => setNotesOpen(false)}>Open transactions</Link>
            </div>
          ) : null}
          {notesOpen && !notices ? (
            <div className="desk-modal absolute right-0 mt-2 w-64 rounded-md border border-white/10 bg-[#121212] p-3 text-[12px] text-zinc-400">
              Notices are off in settings.
            </div>
          ) : null}
        </div>
        <Link to="/app/help" className="hidden h-8 w-8 place-items-center rounded-md border border-white/10 text-zinc-300 hover:text-white sm:grid" aria-label="Help">
          <LifeBuoy size={15} />
        </Link>
        <Link to="/app/trade" className="desk-action desk-action-buy lg:hidden">Trade</Link>
        <div className="hidden sm:block">
          <AccountMenu name={name} email={email} status={status} onLogout={onLogout} compact placement="down" />
        </div>
        <Link to="/app/profile" className="grid h-8 w-8 place-items-center rounded-full border border-orange/30 bg-orange/10 text-[11px] text-orange sm:hidden" aria-label="Account">
          {(name || email || "A").slice(0, 1).toUpperCase()}
        </Link>
      </div>
    </header>
  );
}
