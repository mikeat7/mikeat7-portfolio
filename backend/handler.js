// Simple, Bedrock-free agent stub with a slot to add Bedrock later.
// Accepts { input: {text?, url?}, handshake, clientMeta } and returns { frames, decisions, meta }.

const DEFAULTS = {
  mode: "--careful",
  stakes: "medium",
  min_conf_map: { "--direct": 0.55, "--recap": 0.60, "--careful": 0.70 },
  stakes_floor: { low: 0.45, medium: 0.60, high: 0.75 },
  cite_policy: "auto",
  omission_scan: "auto",
  reflex_profile: "default",
  codex_version: "0.9.0"
};

export const analyze = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { input = {}, handshake = {}, clientMeta = {} } = body;

    // 1) Handshake normalize (mirrors your codex v0.9 rules at a minimal level)
    const hs = normalizeHandshake(handshake);

    // 2) Fetch/clean text if URL provided
    let text = (input.text || "").trim();
    let meta = {};
    if (!text && input.url) {
      const fetched = await fetchArticle(input.url);
      text = fetched.text;
      meta = fetched.meta;
    }
    if (!text) {
      return ok({ frames: [], decisions: { note: "empty-input" }, meta: { ...meta, length: 0 } });
    }

    // 3) Minimal heuristic analysis (no Bedrock yet)
    const frames = heuristicVX(text, hs);

    // 4) Decide policies (very small demo — your UI already enforces)
    const decisions = decidePolicies(hs, /*modelConfidence*/ 0.8, /*isExternal*/ !!input.url);

    // TODO (optional soon): call Bedrock and merge results
    // const bedrockOut = await invokeBedrock({ text, hs, meta });
    // const frames = postprocess(bedrockOut, hs);

    return ok({ frames, decisions, meta: { ...meta, length: text.length } });
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: cors(),
      body: JSON.stringify({ error: "server_error" })
    };
  }
};

/* ---------- helpers ---------- */

function normalizeHandshake(h) {
  const mode = h.mode ?? "--careful";
  const stakes = h.stakes ?? "medium";
  const floor = DEFAULTS.stakes_floor[stakes] ?? 0.6;
  const modeDefault = DEFAULTS.min_conf_map[mode] ?? 0.7;
  const min_confidence = Math.max(floor, h.min_confidence ?? modeDefault);
  return {
    mode,
    stakes,
    min_confidence,
    cite_policy: h.cite_policy ?? DEFAULTS.cite_policy,
    omission_scan: h.omission_scan ?? DEFAULTS.omission_scan,
    reflex_profile: h.reflex_profile ?? DEFAULTS.reflex_profile,
    codex_version: DEFAULTS.codex_version
  };
}

function decidePolicies(hs, modelConfidence, isExternal) {
  // Citation rule (compact): force OR (auto && (stakes!=low && conf<0.85 || isExternal))
  const needCite =
    hs.cite_policy === "force" ||
    (hs.cite_policy === "auto" &&
      ((hs.stakes === "medium" || hs.stakes === "high") && modelConfidence < 0.85 || isExternal));

  // Omission rule: "auto" -> true for medium/high
  const runOmissions =
    hs.omission_scan === true ||
    (hs.omission_scan === "auto" && (hs.stakes === "medium" || hs.stakes === "high"));

  return { needCite, runOmissions, mode: hs.mode, stakes: hs.stakes, min_confidence: hs.min_confidence };
}

async function fetchArticle(url) {
  // Node 20 has global fetch. Super simple HTML stripper; replace with a proper extractor later.
  const res = await fetch(url, { redirect: "follow" });
  const html = await res.text();
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return { text, meta: { url, status: res.status } };
}

// Tiny heuristic: look for absolute words, “experts say”, and urgency language.
// Returns VX-like frames (reflexId, reflexLabel, confidence, rationale).
function heuristicVX(text, hs) {
  const t = text.toLowerCase();
  const frames = [];

  if (/\b(always|never|everyone|no one|entirely|completely)\b/.test(t)) {
    frames.push({
      reflexId: "false-precision",
      reflexLabel: "Absolute Quantifiers",
      confidence: 0.62,
      rationale: "Detected absolute language that removes nuance."
    });
  }

  if (/\bexperts say|scientists claim|doctors agree|studies show\b/.test(t)) {
    frames.push({
      reflexId: "speculative_authority",
      reflexLabel: "Vague Authority",
      confidence: 0.68,
      rationale: "Appeal to unnamed or vague authorities."
    });
  }

  if (/\bnow|immediately|urgent|act fast|last chance\b/.test(t)) {
    frames.push({
      reflexId: "tone_urgency",
      reflexLabel: "False Urgency",
      confidence: 0.60,
      rationale: "Detected urgency language that pressures action."
    });
  }

  // Sort by confidence
  frames.sort((a, b) => b.confidence - a.confidence);
  return frames;
}

function ok(payload) {
  return { statusCode: 200, headers: cors(), body: JSON.stringify(payload) };
}

function cors() {
  return {
    "Access-Control-Allow-Origin": "https://clarityarmor.com",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };
}
