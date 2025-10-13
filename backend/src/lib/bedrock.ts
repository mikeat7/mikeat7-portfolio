// backend/src/lib/bedrock.ts
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function maybeInvokeBedrock(prompt: string): Promise<string | null> {
  const modelId = process.env.BEDROCK_MODEL_ID || "";
  const region  = process.env.BEDROCK_REGION   || "us-east-1";

  console.info("[bedrock] modelId:", modelId || "(empty)");
  console.info("[bedrock] region:", region);

  if (!modelId) {
    console.warn("[bedrock] BEDROCK_MODEL_ID missing → dry run (returning null).");
    return null;
  }

  const client = new BedrockRuntimeClient({ region });

  // Use smaller tokens to lower TPS/compute pressure
  const MAX_TOKENS = 512;

  // Claude 3.x Messages API
  const isClaudeMessages = /claude-3|anthropic\.claude/i.test(modelId);
  const body = isClaudeMessages
    ? JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: MAX_TOKENS,
        temperature: 0.7,
        messages: [{ role: "user", content: prompt }],
      })
    : JSON.stringify({
        prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
        max_tokens_to_sample: MAX_TOKENS,
        temperature: 0.7,
        top_p: 0.9,
      });

  const cmd = new InvokeModelCommand({
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body,
  });

  // Exponential backoff + jitter on throttling
  const MAX_RETRIES = 5;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await client.send(cmd);
      const txt = res.body ? Buffer.from(res.body as Uint8Array).toString("utf8") : "";
      if (!txt) return null;

      try {
        const parsed = JSON.parse(txt);
        // Claude Messages format
        if (parsed?.content && Array.isArray(parsed.content)) {
          const textPart = parsed.content.find((c: any) => c?.type === "text");
          return textPart?.text ?? null;
        }
        // Legacy completion format
        if (typeof parsed?.completion === "string") return parsed.completion;

        // Fallback: raw JSON as string
        return txt;
      } catch {
        // Not JSON? Return raw string so caller can attempt parsing
        return txt;
      }
    } catch (e: any) {
      const code = e?.name || e?.$metadata?.httpStatusCode;
      const msg  = e?.message || String(e);
      console.error("[bedrock] invoke error:", code, msg);

      // Retry on throttling / 429 / 5xx
      const retryable =
        code === "ThrottlingException" ||
        code === "TooManyRequestsException" ||
        e?.$metadata?.httpStatusCode === 429 ||
        (e?.$metadata?.httpStatusCode && e.$metadata.httpStatusCode >= 500);

      if (retryable && attempt < MAX_RETRIES) {
        // backoff: 200ms * 2^attempt + jitter(0..150ms)
        const backoff = 200 * Math.pow(2, attempt) + Math.floor(Math.random() * 150);
        console.warn(`[bedrock] retrying in ${backoff}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
        await sleep(backoff);
        continue;
      }

      // Non-retryable or out of retries → surface as null so handlers can fallback
      return null;
    }
  }

  // Should not reach here
  return null;
}
