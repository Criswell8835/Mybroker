import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/cn";
import { deskNav } from "@/src/app/nav";

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-4">
      {deskNav.map((group) => (
        <div key={group.label}>
          <p className="px-2 text-[10px] tracking-[0.18em] text-zinc-600">{group.label.toUpperCase()}</p>
          <ul className="mt-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  {item.to.includes("#") ? (
                    <Link
                      to={item.to}
                      onClick={onNavigate}
                      className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] text-zinc-400 transition-colors hover:bg-white/[0.03] hover:text-zinc-100"
                    >
                      <Icon size={15} strokeWidth={1.6} />
                      {item.label}
                    </Link>
                  ) : (
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors",
                          isActive
                            ? "bg-white/[0.045] text-zinc-50 shadow-[inset_2px_0_0_#e85c24]"
                            : "text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-100",
                        )
                      }
                    >
                      <Icon size={15} strokeWidth={1.6} />
                      {item.label}
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
