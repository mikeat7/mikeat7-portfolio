import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

export async function maybeInvokeBedrock(prompt: string): Promise<string | null> {
  const modelId = process.env.BEDROCK_MODEL_ID || "";
  if (!modelId) return null;

  const region = process.env.BEDROCK_REGION || "us-east-1";
  const client = new BedrockRuntimeClient({ region });

  // Claude 3+ models use Messages API format
  const isClaude3 = modelId.includes("claude-3") || modelId.includes("anthropic.claude");

  let requestBody: string;

  if (isClaude3) {
    // Claude 3.x Messages API format
    requestBody = JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });
  } else {
    // Legacy format for other models
    requestBody = JSON.stringify({
      prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
      max_tokens_to_sample: 4096,
      temperature: 0.7,
      top_p: 0.9,
    });
  }

  const cmd = new InvokeModelCommand({
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body: requestBody
  });

  const res = await client.send(cmd);
  const responseBody = res.body ? Buffer.from(res.body as Uint8Array).toString("utf8") : "";

  if (!responseBody) return null;

  try {
    const parsed = JSON.parse(responseBody);

    // Claude 3+ Messages API response format
    if (parsed.content && Array.isArray(parsed.content)) {
      const textContent = parsed.content.find((c: any) => c.type === "text");
      return textContent?.text || null;
    }

    // Legacy completion format
    if (parsed.completion) {
      return parsed.completion;
    }

    // Fallback
    return responseBody;
  } catch (e) {
    console.error("Failed to parse Bedrock response:", e);
    return responseBody;
  }
}
