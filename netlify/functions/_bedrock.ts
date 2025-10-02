// netlify/functions/_bedrock.ts
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

export function makeBedrockClient() {
  const region = process.env.BEDROCK_REGION || "us-east-1";

  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const sessionToken = process.env.AWS_SESSION_TOKEN; // only if you use temp creds; otherwise undefined

  // Only attach credentials when you provided them (so local dev keeps working either way)
  const credentials =
    accessKeyId && secretAccessKey
      ? { accessKeyId, secretAccessKey, sessionToken }
      : undefined;

  return new BedrockRuntimeClient({
    region,
    ...(credentials ? { credentials } : {}),
  });
}
