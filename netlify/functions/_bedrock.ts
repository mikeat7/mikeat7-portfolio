import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

// ---- config
export const region =
  process.env.BEDROCK_REGION ||
  process.env.AWS_REGION ||
  "us-east-1";

export const modelId =
  process.env.BEDROCK_MODEL_ID ||
  "anthropic.claude-3-5-sonnet-20240620-v1:0";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Prefer your custom creds. Fall back to BEDROCK_* or AWS_* if present.
function resolveCreds() {
  const accessKeyId =
    process.env.CLARITY_AWS_ACCESS_KEY_ID ||
    process.env.BEDROCK_ACCESS_KEY_ID ||
    process.env.AWS_ACCESS_KEY_ID;

  const secretAccessKey =
    process.env.CLARITY_AWS_SECRET_ACCESS_KEY ||
    process.env.BEDROCK_SECRET_ACCESS_KEY ||
    process.env.AWS_SECRET_ACCESS_KEY;

  const sessionToken =
    process.env.CLARITY_AWS_SESSION_TOKEN ||
    process.env.AWS_SESSION_TOKEN;

  if (accessKeyId && secretAccessKey) {
    return { accessKeyId, secretAccessKey, sessionToken };
  }
  return undefined; // allow default provider chain if it exists
}

// ---- singleton client
export const bedrock = new BedrockRuntimeClient({
  region,
  credentials: resolveCreds(),
});

// Re-export command for callers
export { InvokeModelCommand };
