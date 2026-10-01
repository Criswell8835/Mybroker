import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { countries, matchesCountry } from "@/lib/countries";
import { cn } from "@/lib/cn";

export function CountryField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const visible = countries.filter((name) => matchesCountry(name, query));

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    searchRef.current?.focus();
  }, [open]);

  return (
    <div ref={rootRef} className="relative mt-2">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex w-full items-center justify-between rounded-full border bg-white/[0.03] px-4 py-3 text-left outline-none transition-colors",
          open ? "border-orange/50" : "border-white/10 hover:border-orange/35",
        )}
      >
        <span className={value ? "text-zinc-100" : "text-zinc-500"}>{value || "Select a country"}</span>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={cn("shrink-0 transition-transform duration-200", open ? "rotate-180 text-orange" : "text-zinc-500")}
        />
      </button>
      {open ? (
        <div className="absolute z-30 mt-2 w-full rounded-2xl border border-white/10 bg-[#101010] p-1.5 shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.preventDefault();
            }}
            placeholder="Search countries"
            aria-label="Search countries"
            className="mb-1.5 w-full rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-orange/50"
          />
          <ul role="listbox" aria-label="Country" className="country-menu max-h-56 overflow-auto">
            {visible.length === 0 ? (
              <li className="px-3 py-3 text-sm text-zinc-500">No matching country.</li>
            ) : (
              visible.map((name) => {
                const selected = name === value;
                return (
                  <li key={name}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        onChange(name);
                        setOpen(false);
                      }}
                      className={cn(
                        "w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                        selected
                          ? "bg-orange/15 text-orange"
                          : "text-zinc-300 hover:bg-white/[0.04] hover:text-white",
                      )}
                    >
                      {name}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
