// Pure helpers shared by the browser and the /api/chat function.
// No path aliases here: the Vercel function imports this file directly.

export type ChatLanguageCode = "EN" | "PT";
export type ResponseLanguage = "en" | "pt";

const ENGLISH_MARKERS = ["the", "what", "why", "how", "was", "does", "did", "this", "about", "please"];
const PORTUGUESE_MARKERS = ["o", "a", "os", "as", "que", "por", "como", "foi", "sobre", "pode", "não", "nao", "uma"];

/** Answer in the language of the question; fall back to the site language. */
export function detectResponseLanguage(message: string, activeLanguage: ChatLanguageCode = "EN"): ResponseLanguage {
  const words =
    message
      .toLocaleLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .match(/[a-z]+/g) ?? [];
  const english = words.filter((word) => ENGLISH_MARKERS.includes(word)).length;
  const portuguese = words.filter((word) => PORTUGUESE_MARKERS.includes(word)).length;
  if (english > portuguese) return "en";
  if (portuguese > english) return "pt";
  return activeLanguage === "PT" ? "pt" : "en";
}

// Shared request limits (the server enforces them; the UI mirrors them).
export const CHAT_LIMITS = {
  messageMax: 500,
  historyTurns: 8,
  historyItemMax: 1500,
} as const;

export const CHAT_PROJECT_IDS = ["darcy", "big-bang-duel"] as const;
export type ChatProjectId = (typeof CHAT_PROJECT_IDS)[number];

// Where an answer's facts live on the site. The UI turns these into links.
export const CHAT_SOURCES = ["projects", "experience", "skills", "education", "about", "contact", "darcy", "big-bang-duel"] as const;
export type ChatSource = (typeof CHAT_SOURCES)[number];
