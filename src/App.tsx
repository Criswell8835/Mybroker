import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { DashboardSkeleton } from "@/src/app/shell/DashboardSkeleton";
import { HomePage } from "@/src/pages/HomePage";
import { ReservedRoute } from "@/src/pages/ReservedRoute";

const LoginPage = lazy(() =>
  import("@/src/pages/LoginPage").then((module) => ({ default: module.LoginPage })),
);
const SignupPage = lazy(() =>
  import("@/src/pages/SignupPage").then((module) => ({ default: module.SignupPage })),
);
const AiTradingPage = lazy(() =>
  import("@/src/pages/AiTradingPage").then((module) => ({ default: module.AiTradingPage })),
);
const CopyTradingPage = lazy(() =>
  import("@/src/pages/CopyTradingPage").then((module) => ({ default: module.CopyTradingPage })),
);
const MarketsPage = lazy(() =>
  import("@/src/pages/MarketsPage").then((module) => ({ default: module.MarketsPage })),
);
const PricingPage = lazy(() =>
  import("@/src/pages/PricingPage").then((module) => ({ default: module.PricingPage })),
);
const FaqPage = lazy(() =>
  import("@/src/pages/FaqPage").then((module) => ({ default: module.FaqPage })),
);
const ServicesPage = lazy(() =>
  import("@/src/pages/ServicesPage").then((module) => ({ default: module.ServicesPage })),
);
const ReviewsPage = lazy(() =>
  import("@/src/pages/ReviewsPage").then((module) => ({ default: module.ReviewsPage })),
);
const ProtectedApp = lazy(() =>
  import("@/src/pages/ProtectedApp").then((module) => ({
    default: module.ProtectedApp,
  })),
);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Page({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ai-trading" element={<Page><AiTradingPage /></Page>} />
        <Route path="/copy-trading" element={<Page><CopyTradingPage /></Page>} />
        <Route path="/markets" element={<Page><MarketsPage /></Page>} />
        <Route path="/features" element={<Navigate to="/services" replace />} />
        <Route path="/services" element={<Page><ServicesPage /></Page>} />
        <Route path="/pricing" element={<Page><PricingPage /></Page>} />
        <Route path="/reviews" element={<Page><ReviewsPage /></Page>} />
        <Route path="/faq" element={<Page><FaqPage /></Page>} />
        <Route path="/signup" element={<Page><SignupPage /></Page>} />
        <Route path="/login" element={<Page><LoginPage /></Page>} />
        <Route path="/app/*" element={<Page fallback={<DashboardSkeleton />}><ProtectedApp /></Page>} />
        <Route path="*" element={<ReservedRoute label="Page not found" />} />
      </Routes>
    </BrowserRouter>
  );
}
