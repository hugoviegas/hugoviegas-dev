// Server-side Gemini call. The API key travels in a request header, never in
// a URL, and never reaches the browser.
import type { ChatTurn } from "./request.js";

export const DEFAULT_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"];
const TIMEOUT_MS = 15_000;

export interface GeminiDeps {
  apiKey: string;
  models?: string[];
  fetchImpl?: typeof fetch;
}

const SAFETY = ["HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_DANGEROUS_CONTENT"].map(
  (category) => ({ category, threshold: "BLOCK_MEDIUM_AND_ABOVE" }),
);

const requestBody = (model: string, system: string, history: ChatTurn[], message: string) => ({
  systemInstruction: { parts: [{ text: system }] },
  contents: [
    ...history.map((turn) => ({ role: turn.role === "user" ? "user" : "model", parts: [{ text: turn.content }] })),
    { role: "user", parts: [{ text: message }] },
  ],
  generationConfig: {
    temperature: 0.3,
    maxOutputTokens: 400,
    // 2.5 models think by default; short factual answers do not need it.
    ...(model.startsWith("gemini-2.5") ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
  },
  safetySettings: SAFETY,
});

/** Tries each model in turn. Returns the reply text, or null if every model failed. */
export async function generateReply(deps: GeminiDeps, system: string, history: ChatTurn[], message: string): Promise<string | null> {
  const doFetch = deps.fetchImpl ?? fetch;
  for (const model of deps.models ?? DEFAULT_MODELS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await doFetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": deps.apiKey },
        body: JSON.stringify(requestBody(model, system, history, message)),
        signal: controller.signal,
      });
      if (!response.ok) {
        // Status only: the body could echo request details.
        console.warn(`chat: ${model} returned ${response.status}`);
        continue;
      }
      const data = (await response.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const text = data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("")
        .trim();
      if (text) return text;
    } catch {
      console.warn(`chat: ${model} request failed`);
    } finally {
      clearTimeout(timer);
    }
  }
  return null;
}
