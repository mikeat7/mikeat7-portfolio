import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { cors } from "../lib/cors.js";
import { stripTags } from "../lib/cleanHtml.js";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    if (event.requestContext.http.method === "OPTIONS") {
      return { statusCode: 200, headers: cors(), body: "" };
    }

    const payload = event.body ? JSON.parse(event.body) : null;
    const url = payload?.url as string | undefined;
    if (!url || !/^https?:\/\//i.test(url)) {
      return {
        statusCode: 400,
        headers: cors(),
        body: JSON.stringify({ ok: false, message: "Missing or invalid 'url'." })
      };
    }

    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) {
      return {
        statusCode: res.status,
        headers: cors(),
        body: JSON.stringify({ ok: false, message: `Fetch failed (${res.status}).` })
      };
    }

    const contentType = res.headers.get("content-type") || "";
    const raw = await res.text();

    let text = raw;
    if (contentType.includes("html")) {
      text = stripTags(raw);
    }

    return {
      statusCode: 200,
      headers: cors(),
      body: JSON.stringify({
        ok: true,
        url,
        contentType,
        text,
        length: text.length
      })
    };
  } catch (err: any) {
    console.error(err);
    return {
      statusCode: 500,
      headers: cors(),
      body: JSON.stringify({ ok: false, message: "Internal error" })
    };
  }
};
