import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/src/App";
import "@/app/globals.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element #root is missing.");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
