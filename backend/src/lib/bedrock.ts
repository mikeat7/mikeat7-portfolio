import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

export async function maybeInvokeBedrock(prompt: string): Promise<string | null> {
  const modelId = process.env.BEDROCK_MODEL_ID || "";
  if (!modelId) return null; // not configured; skip

  const region = process.env.BEDROCK_REGION || "us-east-1";
  const client = new BedrockRuntimeClient({ region });

  // Minimal text-only request; adjust for specific models as needed.
  const body = JSON.stringify({
    inputText: prompt
  });

  const cmd = new InvokeModelCommand({
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body: body
  });

  const res = await client.send(cmd);
  const text = res.body ? Buffer.from(res.body as Uint8Array).toString("utf8") : "";
  return text || null;
}
