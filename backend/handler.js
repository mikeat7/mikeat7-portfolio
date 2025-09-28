// backend/handler.js

// --- simple CORS helper (defense-in-depth even with httpApi.cors) ---
const ALLOWED = (process.env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
function cors(origin) {
  const allowed = ALLOWED.length === 0 || ALLOWED.includes(origin) ? origin : (ALLOWED[0] || "*");
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
  };
}
function ok(origin, bodyObj) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json", ...cors(origin) },
    body: JSON.stringify(bodyObj ?? {}),
  };
}
function bad(origin, msg, code = 400) {
  return {
    statusCode: code,
    headers: { "Content-Type": "application/json", ...cors(origin) },
    body: JSON.stringify({ error: msg }),
  };
}

// --- utilities ---
function parseBody(event) {
  try {
    return typeof event.body === "string" ? JSON.parse(event.body) : (event.body || {});
  } catch {
    return {};
  }
}

// --- existing analyze (mock VX run; your FE already merges with local) ---
module.exports.analyze = async (event) => {
  const origin = event.headers?.origin || "";
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 204, headers: cors(origin), body: "" };
  }

  const body = parseBody(event);
  const text = body?.input?.text || "";
  // trivial heuristic detections as a scaffold
  const frames = [];

  if (/experts say|authorities claim|scientists agree/i.test(text)) {
    frames.push({
      reflexId: "vx-so01",
      reflexLabel: "Vague Authority",
      confidence: 0.68,
      rationale: "Appeal to unnamed or vague authority.",
    });
  }
  if (/now or never|last chance|act immediately/i.test(text)) {
    frames.push({
      reflexId: "vx-fo01",
      reflexLabel: "False Urgency",
      confidence: 0.62,
      rationale: "Time pressure used as a persuasion device.",
    });
  }

  return ok(origin, { frames });
};

// --- summarize: compose a short narrative from frames ---
module.exports.summarize = async (event) => {
  const origin = event.headers?.origin || "";
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 204, headers: cors(origin), body: "" };
  }
  const body = parseBody(event);
  const text = String(body?.input?.text ?? "");
  const frames = Array.isArray(body?.frames) ? body.frames : [];
  const hs = body?.handshake || {};

  const countsByLabel = {};
  for (const f of frames) {
    const key = f.reflexLabel || f.reflexId || "unknown";
    countsByLabel[key] = (countsByLabel[key] || 0) + 1;
  }

  const sorted = Object.entries(countsByLabel).sort((a, b) => b[1] - a[1]);

  const top = sorted.slice(0, 5).map(([k, v]) => `• ${k} (${v})`).join("\n");
  const hsLine = `mode=${hs.mode ?? "--careful"} · stakes=${hs.stakes ?? "medium"} · min_conf=${hs.min_confidence ?? "—"} · cite=${hs.cite_policy ?? "auto"} · omission=${String(hs.omission_scan ?? "auto")} · profile=${hs.reflex_profile ?? "default"}`;

  const reportText = [
    "### Summary",
    "This document exhibits the following persuasive/reflex patterns:",
    top || "• (no detections)",
    "",
    "### Handshake",
    hsLine,
    "",
    "### Guidance",
    "- If stakes are high, request sources or downgrade conclusions.",
    "- If omissions are likely, ask for context or counter-evidence.",
    "- Prefer precise claims over broad certainty.",
  ].join("\n");

  return ok(origin, { reportText });
};

// --- chat: policy-compliant echo scaffold (no model yet) ---
module.exports.chat = async (event) => {
  const origin = event.headers?.origin || "";
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 204, headers: cors(origin), body: "" };
  }
  const body = parseBody(event);
  const msg = String(body?.message ?? "");
  const hs = body?.handshake || {};

  const reply = [
    `Handshake acknowledged (mode=${hs.mode ?? "--careful"}, stakes=${hs.stakes ?? "medium"}).`,
    "This is a scaffold (no model attached yet). I can route messages, enforce confidence floors, and ask for clarification when claims exceed policy.",
    msg ? `You said: "${msg.slice(0, 160)}"${msg.length > 160 ? "…" : ""}` : "Send a message to continue.",
  ].join(" ");

  return ok(origin, { reply });
};
