import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { VXProvider } from "@/context/VXProvider";
import codex from "@/data/front-end-codex.v0.9.json";
import { validateCodex, initCodexRuntime, emitTelemetry } from "@/lib/codex-runtime";
import "./index.css";

// Validate contract (fail-fast in console, continue rendering for now)
const result = validateCodex(codex as any);
if (!result.ok) {
  console.error("[Codex] invalid:", result.errors);
}

// Initialize runtime (sets defaults + window.__clarityArmorCodex for debug)
initCodexRuntime(codex as any);

// Optional: initial telemetry ping
emitTelemetry("app.boot", {
  codex_version: (codex as any).codex_version,
  mode: (window as any).__clarityArmorCodex?.handshake?.mode,
  stakes: (window as any).__clarityArmorCodex?.handshake?.stakes,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <VXProvider>
      <App />
    </VXProvider>
  </React.StrictMode>
);
