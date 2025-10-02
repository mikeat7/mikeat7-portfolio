import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

export const modelId =
  process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-5-sonnet-20240620-v1:0";

const region =
  process.env.BEDROCK_REGION ||
  process.env.AWS_REGION ||
  "us-east-1";

// Use custom env var names because Netlify reserves AWS_* creds in UI
const accessKeyId = process.env.CLARITY_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLARITY_AWS_SECRET_ACCESS_KEY;
const sessionToken = process.env.CLARITY_AWS_SESSION_TOKEN; // optional

export const bedrock = new BedrockRuntimeClient({
  region,
  ...(accessKeyId && secretAccessKey
    ? {
        credentials: {
          accessKeyId,
          secretAccessKey,
          sessionToken,
        },
      }
    : {}),
});

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
