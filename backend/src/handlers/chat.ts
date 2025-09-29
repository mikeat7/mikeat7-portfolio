import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { cors } from "../lib/cors.js";
import { maybeInvokeBedrock } from "../lib/bedrock.js";
import type { ChatRequestBody, ChatResponse } from "../lib/types.js";

function validateHandshake(h: any): h is ChatRequestBody["handshake"] {
  if (!h) return false;
  if (!["--direct", "--careful", "--recap"].includes(h.mode)) return false;
  if (!["low", "medium", "high"].includes(h.stakes)) return false;
  if (typeof h.min_confidence !== "number") return false;
  if (!["auto", "force", "off"].includes(h.cite_policy)) return false;
  if (!(h.omission_scan === "auto" || typeof h.omission_scan === "boolean")) return false;
  if (!["default", "strict", "lenient"].includes(h.reflex_profile)) return false;
  if (typeof h.codex_version !== "string") return false;
  return true;
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    if (event.requestContext.http.method === "OPTIONS") {
      return { statusCode: 200, headers: cors(), body: "" };
    }

    const body = event.body ? JSON.parse(event.body) as ChatRequestBody : null;
    if (!body?.input || !validateHandshake(body.handshake)) {
      return {
        statusCode: 400,
        headers: cors(),
        body: JSON.stringify({ ok: false, message: "Invalid payload or handshake." })
      };
    }

    const text = body.input.text || body.input.query || "";
    if (!text.trim()) {
      return {
        statusCode: 200,
        headers: cors(),
        body: JSON.stringify(<ChatResponse>{
          ok: true,
          message: "No text provided. Returning empty frames.",
          frames: [],
          handshake: body.handshake
        })
      };
    }

    // Optional Bedrock call, if configured. This demonstrates agentic “reasoning” capability.
    let bedrockNote: string | null = null;
    try {
      bedrockNote = await maybeInvokeBedrock(
        `You are a policy-gated analyzer. Follow codex v0.9 ethics. Summarize concerns and questions about:\n${text}`
      );
    } catch (err) {
      // swallow Bedrock errors so endpoint always returns 200
      bedrockNote = null;
    }

    const response: ChatResponse = {
      ok: true,
      message: bedrockNote ?? "Agent response generated without Bedrock (dry run).",
      frames: [], // server currently defers to frontend VX for frames
      tools: [],
      handshake: body.handshake
    };

    return { statusCode: 200, headers: cors(), body: JSON.stringify(response) };
  } catch (err: any) {
    console.error(err);
    return {
      statusCode: 500,
      headers: cors(),
      body: JSON.stringify({ ok: false, message: "Internal error" })
    };
  }
};
