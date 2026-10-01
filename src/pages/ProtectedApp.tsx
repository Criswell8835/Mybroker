import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { DashboardShell } from "@/src/app/shell/DashboardShell";
import { DashboardSkeleton } from "@/src/app/shell/DashboardSkeleton";
import { OverviewPage } from "@/src/app/overview/OverviewPage";
import { AlertsDesk } from "@/src/app/pages/AlertsDesk";
import { HelpDesk, ProfileDesk, SecurityDesk, SettingsDesk, SupportDesk, VerificationDesk } from "@/src/app/pages/AccountDesk";
import { DepositDesk, TransactionsDesk, WithdrawalDesk } from "@/src/app/pages/MoneyDesk";
import { MarketDetail, MarketsDesk } from "@/src/app/pages/MarketsDesk";
import { PortfolioDesk, TradeDesk } from "@/src/app/pages/ProductDesk";
import { SubscriptionDesk } from "@/src/app/pages/SubscriptionDesk";
import { AiDesk } from "@/src/app/ai/AiDesk";
import { AiSetup } from "@/src/app/ai/AiSetup";
import { AiTerminal } from "@/src/app/ai/AiTerminal";
import { CopyDesk, CopyProfile } from "@/src/app/copy/CopyDesk";
import { WatchlistDesk } from "@/src/app/pages/WatchlistDesk";
import { SectionPage } from "@/src/app/SectionPage";
import { DeskStateProvider } from "@/src/app/state/DeskState";
import { supabase } from "@/src/lib/supabase";
import { useSession } from "@/src/lib/session";

type KycStatus = "not_started" | "pending" | "verified" | "rejected" | "resubmission_required";

export function ProtectedApp() {
  const location = useLocation();
  const session = useSession();
  const [name, setName] = useState<string | null>(null);
  const [kycStatus, setKycStatus] = useState<KycStatus>("not_started");
  const [accountStatus, setAccountStatus] = useState("Active");

  useEffect(() => {
    const userId = session?.user.id;
    if (!userId) return;
    let cancelled = false;
    supabase
      .from("profiles")
      .select("display_name, kyc_status, status")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data) return;
        setName(data.display_name);
        setKycStatus(data.kyc_status);
        setAccountStatus(data.status === "active" ? "Active" : data.status);
      });
    return () => {
      cancelled = true;
    };
  }, [session?.user.id]);

  if (session === undefined) return <DashboardSkeleton />;
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  const email = session.user.email ?? "";
  const displayName = name || email.split("@")[0] || "Account";
  const countryValue = session.user.user_metadata?.country;
  const country = typeof countryValue === "string" && countryValue ? countryValue : "Not on file";

  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <DeskStateProvider>
      <DashboardShell email={email} name={displayName} status={accountStatus} onLogout={logout}>
        <Routes>
          <Route path="/" element={<OverviewPage accountStatus={accountStatus} kycStatus={kycStatus} />} />
          <Route path="ai-trading" element={<AiDesk />} />
          <Route path="ai-trading/start" element={<AiSetup />} />
          <Route path="ai-trading/:strategyId" element={<AiTerminal />} />
          <Route path="copy-trading" element={<CopyDesk />} />
          <Route path="copy-trading/:traderId" element={<CopyProfile />} />
          <Route path="markets" element={<MarketsDesk />} />
          <Route path="markets/:marketId" element={<MarketDetail />} />
          <Route path="subscription" element={<SubscriptionDesk />} />
          <Route path="portfolio" element={<PortfolioDesk />} />
          <Route path="trade" element={<TradeDesk />} />
          <Route path="deposit" element={<DepositDesk />} />
          <Route path="withdrawal" element={<WithdrawalDesk />} />
          <Route path="transactions" element={<TransactionsDesk />} />
          <Route path="watchlist" element={<WatchlistDesk />} />
          <Route path="alerts" element={<AlertsDesk />} />
          <Route path="profile" element={<ProfileDesk name={displayName} email={email} country={country} userId={session.user.id} onSaved={setName} />} />
          <Route path="verification" element={<VerificationDesk kycStatus={kycStatus} />} />
          <Route path="security" element={<SecurityDesk />} />
          <Route path="settings" element={<SettingsDesk />} />
          <Route path="help" element={<HelpDesk />} />
          <Route path="support" element={<SupportDesk email={email} />} />
          <Route path="*" element={<SectionPage title="Not found" text="That desk page is not part of this account." />} />
        </Routes>
      </DashboardShell>
    </DeskStateProvider>
  );
}
