// backend/src/lib/bedrock.ts
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function maybeInvokeBedrock(prompt: string): Promise<string | null> {
  const modelId = process.env.BEDROCK_MODEL_ID || "";
  const region  = process.env.BEDROCK_REGION   || "us-east-1";

  // NEW: read optional tuning knobs (with safe defaults + clamping)
  const MAX_TOKENS = Math.max(
    1,
    Math.min(4096, Number(process.env.BEDROCK_MAX_TOKENS ?? 512))
  );
  const TEMPERATURE = (() => {
    const v = Number(process.env.BEDROCK_TEMPERATURE ?? 0.7);
    return Number.isFinite(v) ? Math.max(0, Math.min(2, v)) : 0.7;
  })();
  const TOP_P = (() => {
    const v = Number(process.env.BEDROCK_TOP_P ?? 0.9);
    return Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 0.9;
  })();

  console.info("[bedrock] modelId:", modelId || "(empty)");
  console.info("[bedrock] region:", region);
  console.info("[bedrock] max_tokens:", MAX_TOKENS, "temp:", TEMPERATURE, "top_p:", TOP_P);

  if (!modelId) {
    console.warn("[bedrock] BEDROCK_MODEL_ID missing → dry run (returning null).");
    return null;
  }

  const client = new BedrockRuntimeClient({ region });

  const isClaudeMessages = /claude-3|anthropic\.claude/i.test(modelId);
  const body = isClaudeMessages
    ? JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: MAX_TOKENS,
        temperature: TEMPERATURE,
        top_p: TOP_P,
        messages: [{ role: "user", content: prompt }],
      })
    : JSON.stringify({
        prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
        max_tokens_to_sample: MAX_TOKENS,
        temperature: TEMPERATURE,
        top_p: TOP_P,
      });

  const cmd = new InvokeModelCommand({
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body,
  });

  const MAX_RETRIES = 5;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await client.send(cmd);
      const txt = res.body ? Buffer.from(res.body as Uint8Array).toString("utf8") : "";
      if (!txt) return null;

      try {
        const parsed = JSON.parse(txt);
        if (parsed?.content && Array.isArray(parsed.content)) {
          const textPart = parsed.content.find((c: any) => c?.type === "text");
          return textPart?.text ?? null;
        }
        if (typeof parsed?.completion === "string") return parsed.completion;
        return txt;
      } catch {
        return txt;
      }
    } catch (e: any) {
      const code = e?.name || e?.$metadata?.httpStatusCode;
      const msg  = e?.message || String(e);
      console.error("[bedrock] invoke error:", code, msg);

      const retryable =
        code === "ThrottlingException" ||
        code === "TooManyRequestsException" ||
        e?.$metadata?.httpStatusCode === 429 ||
        (e?.$metadata?.httpStatusCode && e.$metadata.httpStatusCode >= 500);

      if (retryable && attempt < MAX_RETRIES) {
        const backoff = 200 * Math.pow(2, attempt) + Math.floor(Math.random() * 150);
        console.warn(`[bedrock] retrying in ${backoff}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
        await sleep(backoff);
        continue;
      }
      return null;
    }
  }
  return null;
}

