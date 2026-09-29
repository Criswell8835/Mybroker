import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "@/src/pages/HomePage";
import { ReservedRoute } from "@/src/pages/ReservedRoute";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<ReservedRoute label="Sign up" />} />
        <Route path="/login" element={<ReservedRoute label="Log in" />} />
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
