// netlify/functions/_bedrock.ts
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

export function createBedrockClient() {
  const region =
    process.env.BEDROCK_REGION ||
    process.env.AWS_REGION ||
    "us-east-1";

  const accessKeyId =
    process.env.AWS_ACCESS_KEY_ID ||
    process.env.BEDROCK_ACCESS_KEY_ID; // optional aliases

  const secretAccessKey =
    process.env.AWS_SECRET_ACCESS_KEY ||
    process.env.BEDROCK_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    // Make the failure obvious instead of silently using Netlify's Lambda role
    throw new Error(
      "Missing AWS creds for Bedrock. Set AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY in Netlify env."
    );
  }

  return new BedrockRuntimeClient({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });
}
