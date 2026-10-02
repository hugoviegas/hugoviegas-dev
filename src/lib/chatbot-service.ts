// Browser client for the portfolio assistant. It only talks to our own
// /api/chat function: no API key, prompt, or model details live here.
import type { LanguageCode } from "@/config/languages";
import { CHAT_LIMITS, type ChatProjectId, type ChatSource } from "./chatLanguage";

export { detectResponseLanguage, type ResponseLanguage } from "./chatLanguage";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  sources?: ChatSource[];
}

export interface ChatRequestOptions {
  activeLanguage?: LanguageCode;
  projectId?: ChatProjectId;
  signal?: AbortSignal;
}

export interface ChatReply {
  reply: string;
  sources: ChatSource[];
}

export type ChatErrorKind = "rate_limited" | "unavailable" | "network" | "invalid";

export class ChatError extends Error {
  constructor(
    readonly kind: ChatErrorKind,
    readonly retryAfter?: number,
  ) {
    super(kind);
    this.name = "ChatError";
  }
}

export const CHAT_ENDPOINT = "/api/chat";

export async function sendChatMessage(
  message: string,
  history: ChatMessage[] = [],
  options: ChatRequestOptions = {},
): Promise<ChatReply> {
  const body = {
    message: message.trim().slice(0, CHAT_LIMITS.messageMax),
    history: history.slice(-CHAT_LIMITS.historyTurns).map(({ role, content }) => ({
      role,
      content: content.slice(0, CHAT_LIMITS.historyItemMax),
    })),
    language: options.activeLanguage === "PT" ? "PT" : "EN",
    ...(options.projectId ? { projectId: options.projectId } : {}),
  };

  let response: Response;
  try {
    response = await fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: options.signal,
    });
  } catch (error) {
    if ((error as Error)?.name === "AbortError") throw error;
    throw new ChatError("network");
  }

  const data = (await response.json().catch(() => ({}))) as {
    reply?: unknown;
    sources?: unknown;
    retryAfter?: unknown;
  };

  if (response.status === 429) {
    throw new ChatError("rate_limited", typeof data.retryAfter === "number" ? data.retryAfter : undefined);
  }
  if (response.status === 400 || response.status === 413) throw new ChatError("invalid");
  if (!response.ok || typeof data.reply !== "string") throw new ChatError("unavailable");

  return {
    reply: data.reply,
    sources: Array.isArray(data.sources) ? (data.sources.filter((s) => typeof s === "string") as ChatSource[]) : [],
  };
}
