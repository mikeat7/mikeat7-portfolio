import { agentFetchUrl } from "@/lib/agentClient";

export const isLikelyUrl = (s: string) => /^https?:\/\/\S+$/i.test(s.trim());

/** Fetch page text and build a safe, clipped context block for the LLM. */
export async function buildUrlContextBlock(url: string, maxChars = 20000) {
  const { text } = await agentFetchUrl(url);
  if (!text || text.startsWith("(non-text content:")) {
    return { contextBlock: "", meta: { url, charCount: 0, nonText: true, note: text || "" } };
  }
  const clipped = text.slice(0, maxChars);
  const contextBlock =
`Source URL: ${url}

Fetched text (clipped to ${maxChars} chars):
${clipped}`;
  return { contextBlock, meta: { url, charCount: clipped.length, nonText: false } };
}
