// backend/src/lib/bedrock.ts
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

export async function maybeInvokeBedrock(prompt: string): Promise<string | null> {
  const modelId = process.env.BEDROCK_MODEL_ID || "";
  const region  = process.env.BEDROCK_REGION || "us-east-1";

  // Minimal diagnostics (visible in CloudWatch)
  console.log("[bedrock] modelId:", modelId ? modelId : "(empty)");
  console.log("[bedrock] region:", region);

  if (!modelId) {
    console.warn("[bedrock] BEDROCK_MODEL_ID missing → dry run (returning null).");
    return null;
  }

  const client = new BedrockRuntimeClient({ region });

  // Treat any Anthropic Claude 3.x/3.5 model ID as Messages API
  const isAnthropicMessages =
    modelId.includes("anthropic.") || modelId.includes("claude-3");

  // Build request body
  let body: any;
  if (isAnthropicMessages) {
    // Claude 3.x / 3.5 Messages API format
    body = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 512,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          // Bedrock Anthropic expects content as an array of blocks
          content: [{ type: "text", text: prompt }],
        },
      ],
    };
  } else {
    // Fallback for any legacy text-completion style models
    body = {
      prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
      max_tokens_to_sample: 512,
      temperature: 0.7,
      top_p: 0.9,
    };
  }

  try {
    const cmd = new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: Buffer.from(JSON.stringify(body)),
    });

    const out = await client.send(cmd);

    const decoded =
      out.body instanceof Uint8Array
        ? new TextDecoder().decode(out.body)
        : (out.body as any)?.toString?.("utf8") ?? "";

    console.log("[bedrock] invoke ok; bytes:", (out.body as Uint8Array)?.byteLength ?? 0);

    if (!decoded) return null;

    // Try to parse; support both Messages API and legacy completion shapes
    try {
      const parsed = JSON.parse(decoded);

      // Anthropic Messages API shape
      // { id, type:"message", role:"assistant", content:[{type:"text", text:"..."}], ... }
      if (Array.isArray(parsed?.content)) {
        const block = parsed.content.find((c: any) => c?.type === "text");
        return (block && typeof block.text === "string") ? block.text : decoded;
      }

      // Legacy completion shape
      if (typeof parsed?.completion === "string") {
        return parsed.completion;
      }

      // Unknown but valid JSON — return raw JSON text
      return decoded;
    } catch {
      // Non-JSON response; return raw text
      return decoded;
    }
  } catch (err: any) {
    console.error("[bedrock] invoke error:", err?.name || err, err?.message || "");
    return null; // soft-fail → caller may emit “dry run” message
  }
}
