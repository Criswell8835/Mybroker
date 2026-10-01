import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { pricingPlans } from "@/lib/pricing";
import { AccountMenu } from "@/src/app/shell/AccountMenu";
import { BottomNav } from "@/src/app/shell/BottomNav";
import { SidebarNav } from "@/src/app/shell/SidebarNav";
import { Topbar } from "@/src/app/shell/Topbar";
import { useDeskState } from "@/src/app/state/DeskState";

export function DashboardShell({
  children,
  email,
  name,
  status,
  onLogout,
}: {
  children: ReactNode;
  email: string;
  name: string;
  status: string;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { planId } = useDeskState();
  const planName = pricingPlans.find((plan) => plan.id === planId)?.name ?? "Free";

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[220px] flex-col border-r border-white/[0.06] bg-[#070707] px-2 py-3 lg:flex">
        <Link to="/app" className="px-2 py-1 text-white">
          <Logo />
        </Link>
        <div className="mt-4 flex-1 overflow-auto">
          <SidebarNav />
        </div>
        <div className="border-t border-white/[0.05] pt-2">
          <AccountMenu name={name} email={shortEmail(email)} status={status} plan={planName} onLogout={onLogout} />
          <button type="button" onClick={onLogout} className="desk-action mt-1 w-full">Log out</button>
        </div>
      </aside>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/60" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="desk-drawer absolute inset-y-0 left-0 flex w-[280px] max-w-[86vw] flex-col border-r border-white/[0.06] bg-[#070707] px-3 py-4">
            <Logo className="px-1 text-white" />
            <div className="mt-4 flex-1 overflow-auto">
              <SidebarNav onNavigate={() => setOpen(false)} />
            </div>
            <div className="border-t border-white/[0.05] pt-2">
              <AccountMenu name={name} email={shortEmail(email)} status={status} plan={planName} onLogout={onLogout} />
              <button type="button" onClick={onLogout} className="desk-action mt-1 w-full">Log out</button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="lg:pl-[220px]">
        <Topbar onMenu={() => setOpen(true)} email={shortEmail(email)} name={name} status={status} onLogout={onLogout} />
        <main className="px-3 py-4 pb-24 sm:px-5 lg:px-6 lg:pb-6">{children}</main>
        <BottomNav onAccount={() => setOpen(true)} />
      </div>
    </div>
  );
}

function shortEmail(email: string) {
  if (email.length <= 28) return email;
  const [local, domain] = email.split("@");
  if (!domain) return email;
  return `${local.slice(0, 10)}…@${domain}`;
}
