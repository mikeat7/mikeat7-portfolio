import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

const region =
  process.env.BEDROCK_REGION ||
  process.env.AWS_REGION ||
  "us-east-1";

type CredsChoice = {
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
  source: string;
};

function chooseCreds(): CredsChoice {
  const candidates = [
    {
      ak: process.env.CLARITY_AWS_ACCESS_KEY_ID,
      sk: process.env.CLARITY_AWS_SECRET_ACCESS_KEY,
      st: process.env.CLARITY_AWS_SESSION_TOKEN,
      src: "CLARITY_*",
    },
    {
      ak: process.env.BEDROCK_ACCESS_KEY_ID,
      sk: process.env.BEDROCK_SECRET_ACCESS_KEY,
      st: process.env.BEDROCK_SESSION_TOKEN,
      src: "BEDROCK_*",
    },
    {
      ak: process.env.AWS_ACCESS_KEY_ID,
      sk: process.env.AWS_SECRET_ACCESS_KEY,
      st: process.env.AWS_SESSION_TOKEN,
      src: "AWS_*",
    },
  ];
  for (const c of candidates) {
    if (c.ak && c.sk) {
      return {
        accessKeyId: c.ak,
        secretAccessKey: c.sk,
        sessionToken: c.st,
        source: c.src,
      };
    }
  }
  return { source: "default-provider-chain" };
}

const creds = chooseCreds();

export const bedrock = new BedrockRuntimeClient(
  creds.accessKeyId && creds.secretAccessKey
    ? { region, credentials: creds }
    : { region }
);

export const modelId =
  process.env.BEDROCK_MODEL_ID ||
  "anthropic.claude-3-5-sonnet-20240620-v1:0";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
};

if (process.env.DEBUG_BEDROCK) {
  const mask = (s?: string) => (s ? `${s.slice(0, 4)}…${s.slice(-4)}` : "(none)");
  console.log("[bedrock:init]", {
    region,
    modelId,
    credSource: creds.source,
    hasAK: Boolean(creds.accessKeyId),
    hasSK: Boolean(creds.secretAccessKey),
    akPreview: mask(creds.accessKeyId),
  });
}

