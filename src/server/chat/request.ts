// Validates the JSON body of POST /api/chat. Anything unexpected is rejected.
import { CHAT_LIMITS, CHAT_PROJECT_IDS, type ChatLanguageCode, type ChatProjectId } from "../../lib/chatLanguage.js";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  history: ChatTurn[];
  projectId?: ChatProjectId;
  language: ChatLanguageCode;
}

export const MAX_BODY_BYTES = 16_000;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export function parseChatRequest(body: unknown): ChatRequest | null {
  if (!isObject(body)) return null;
  const allowed = new Set(["message", "history", "projectId", "language"]);
  if (Object.keys(body).some((key) => !allowed.has(key))) return null;

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > CHAT_LIMITS.messageMax) return null;

  const language = body.language === "PT" ? "PT" : body.language === "EN" || body.language === undefined ? "EN" : null;
  if (!language) return null;

  let projectId: ChatProjectId | undefined;
  if (body.projectId !== undefined) {
    if (!CHAT_PROJECT_IDS.includes(body.projectId as ChatProjectId)) return null;
    projectId = body.projectId as ChatProjectId;
  }

  const rawHistory = body.history ?? [];
  if (!Array.isArray(rawHistory)) return null;
  const history: ChatTurn[] = [];
  for (const item of rawHistory.slice(-CHAT_LIMITS.historyTurns)) {
    if (!isObject(item)) return null;
    if (item.role !== "user" && item.role !== "assistant") return null;
    if (typeof item.content !== "string") return null;
    const content = item.content.trim().slice(0, CHAT_LIMITS.historyItemMax);
    if (content) history.push({ role: item.role, content });
  }

  return { message, history, projectId, language };
}
