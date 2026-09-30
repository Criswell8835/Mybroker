import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "@/src/pages/HomePage";
import { ReservedRoute } from "@/src/pages/ReservedRoute";

const LoginPage = lazy(() =>
  import("@/src/pages/LoginPage").then((module) => ({ default: module.LoginPage })),
);
const SignupPage = lazy(() =>
  import("@/src/pages/SignupPage").then((module) => ({ default: module.SignupPage })),
);

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/signup"
          element={
            <Suspense fallback={null}>
              <SignupPage />
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={null}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route path="/app" element={<ReservedRoute label="Platform" />} />
        <Route
          path="/app/ai-trading"
          element={<ReservedRoute label="AI Trading" />}
        />
        <Route
          path="/app/copy-trading"
          element={<ReservedRoute label="Copy Trading" />}
        />
        <Route path="/app/markets" element={<ReservedRoute label="Markets" />} />
        <Route
          path="/app/portfolio"
          element={<ReservedRoute label="Portfolio" />}
        />
        <Route path="*" element={<ReservedRoute label="Page not found" />} />
      </Routes>
    </BrowserRouter>
  );
}
