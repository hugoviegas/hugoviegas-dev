// POST /api/chat: the portfolio assistant's only backend.
// GEMINI_API_KEY is a server-only Vercel environment variable. It never
// leaves this function and must never be set as a VITE_* variable.
// Relative imports need the .js extension: Vercel runs this file as Node ESM.
import { detectResponseLanguage } from "../src/lib/chatLanguage.js";
import { buildSystemInstruction, focusProject } from "../src/server/chat/knowledge.js";
import { generateReply, type GeminiDeps } from "../src/server/chat/gemini.js";
import { MAX_BODY_BYTES, parseChatRequest } from "../src/server/chat/request.js";
import { clientKey, RateLimiter } from "../src/server/chat/rateLimit.js";
import { inferSources } from "../src/server/chat/sources.js";

const json = (status: number, body: unknown, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store", ...extra },
  });

export interface ChatDeps {
  apiKey: string | undefined;
  allowedOrigins: string[];
  limiter: RateLimiter;
  models?: string[];
  fetchImpl?: GeminiDeps["fetchImpl"];
  now?: () => number;
}

/** Production, the current deployment, and localhost outside production. */
export const allowedOriginsFromEnv = (env: Record<string, string | undefined>): string[] => {
  const origins = ["https://hugoviegas.dev", "https://www.hugoviegas.dev"];
  if (env.VERCEL_URL) origins.push(`https://${env.VERCEL_URL}`);
  if (env.VERCEL_BRANCH_URL) origins.push(`https://${env.VERCEL_BRANCH_URL}`);
  if (env.VERCEL_ENV !== "production") {
    origins.push("http://localhost:5173", "http://localhost:8080", "http://localhost:4173", "http://127.0.0.1:5173");
  }
  return origins;
};

export const handleChat = async (request: Request, deps: ChatDeps): Promise<Response> => {
  if (request.method !== "POST") return json(405, { error: "method_not_allowed" }, { allow: "POST" });

  // Browsers always send Origin on a POST from the site; other callers are refused.
  const origin = request.headers.get("origin");
  if (!origin || !deps.allowedOrigins.includes(origin)) return json(403, { error: "forbidden_origin" });

  if (!deps.apiKey) return json(503, { error: "not_configured" });

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return json(413, { error: "too_large" });
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return json(400, { error: "invalid_request" });
  }
  if (raw.length > MAX_BODY_BYTES) return json(413, { error: "too_large" });

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: "invalid_request" });
  }
  const chat = parseChatRequest(body);
  if (!chat) return json(400, { error: "invalid_request" });

  const limit = deps.limiter.check(clientKey(request.headers), (deps.now ?? Date.now)());
  if (!limit.allowed) {
    return json(429, { error: "rate_limited", retryAfter: limit.retryAfterSeconds }, { "retry-after": String(limit.retryAfterSeconds) });
  }

  const project = focusProject(chat.projectId, chat.message);
  const system = buildSystemInstruction(project, detectResponseLanguage(chat.message, chat.language));
  const reply = await generateReply({ apiKey: deps.apiKey, models: deps.models, fetchImpl: deps.fetchImpl }, system, chat.history, chat.message);
  if (!reply) return json(502, { error: "unavailable" });

  return json(200, { reply, sources: inferSources(chat.message, reply, project) });
};

// One limiter per warm instance (see rateLimit.ts for the limits of this).
const limiter = new RateLimiter();

export function POST(request: Request) {
  return handleChat(request, {
    apiKey: process.env.GEMINI_API_KEY,
    allowedOrigins: allowedOriginsFromEnv(process.env),
    limiter,
    models: process.env.CHAT_MODELS ? process.env.CHAT_MODELS.split(",").map((m) => m.trim()).filter(Boolean) : undefined,
  });
}
