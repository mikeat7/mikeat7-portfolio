// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import App from "./App";
import { VXProvider } from "@/context/VXProvider";

import codexJson from "@/data/front-end-codex.v0.9.json";
import {
  validateCodex,
  buildHandshake,
  emitTelemetry,
  type Codex,
} from "@/lib/codex-runtime";

// --- Codex validation + lightweight runtime init ---
const codex = codexJson as unknown as Codex;
const validation = validateCodex(codex);

if (!validation.ok) {
  console.error("[Codex] invalid:", validation.errors);
} else {
  console.info("[Codex] v%s validated.", codex.codex_version);
}

// Build a default handshake (you can later swap via a UI control)
const defaultHandshake = buildHandshake(codex, {
  mode: "--careful",
  stakes: "medium",
});

// Expose for quick inspection in the browser console
// (e.g., window.__clarityArmorCodex.handshake)
(window as any).__clarityArmorCodex = {
  codex_version: codex.codex_version,
  handshake: defaultHandshake,
};

// Log Agent base for awareness (frontend → AWS)
const AGENT_BASE = (import.meta as any).env?.VITE_AGENT_API_BASE;
if (!AGENT_BASE) {
  console.warn(
    "[startup] VITE_AGENT_API_BASE is not set — AWS agent calls will be disabled until you set it (e.g., in .env.local)."
  );
} else {
  console.info("[startup] AWS Agent base:", AGENT_BASE);
}

// Telemetry ping (console publisher for now)
emitTelemetry(
  codex,
  {
    name: "app.boot",
    data: {
      codex_version: codex.codex_version,
      mode: defaultHandshake.mode,
      stakes: defaultHandshake.stakes,
    },
  },
  (e) => console.log("[telemetry]", e)
);
if (import.meta.env.DEV) {
  console.info("Dev runbook: /docs/HANDOFF.md (repo) — start here.");
}

// --- Render app (always render; we only fail-fast in console) ---
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <VXProvider>
      <App />
    </VXProvider>
  </React.StrictMode>
);
