import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

export function makeBedrock() {
  const region =
    process.env.BEDROCK_REGION ||
    process.env.AWS_REGION ||
    "us-east-1";

  const modelId = process.env.BEDROCK_MODEL_ID!;
  if (!modelId) throw new Error("BEDROCK_MODEL_ID not set");

  const ak = process.env.CLARITY_AWS_ACCESS_KEY_ID;
  const sk = process.env.CLARITY_AWS_SECRET_ACCESS_KEY;

  const usingClarity = Boolean(ak && sk);

  const client = new BedrockRuntimeClient(
    usingClarity
      ? { region, credentials: { accessKeyId: ak!, secretAccessKey: sk! } }
      : { region } // falls back to Netlify’s IAM role
  );

  return { client, modelId, region, usingClarity };
}

export async function bedrockChat(opts: {
  client: BedrockRuntimeClient;
  modelId: string;
  messages: Array<{ role: "user" | "assistant"; content: { type: "text"; text: string }[] }>;
  maxTokens?: number;
  temperature?: number;
}) {
  const { client, modelId, messages, maxTokens = 1400, temperature = 0.2 } = opts;

  const res = await client.send(
    new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        messages,
        max_tokens: maxTokens,
        temperature
      }),
    })
  );

  const out = JSON.parse(new TextDecoder().decode(res.body));
  const text = out?.content?.[0]?.text ?? "";
  return text;
}
