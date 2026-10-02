// Maps an answer to the site sections that hold its facts, so the UI can
// show "From: Experience" links. Keyword-based and deliberately conservative.
import type { ChatProjectId, ChatSource } from "../../lib/chatLanguage.js";

const RULES: [ChatSource, RegExp][] = [
  ["experience", /\b(erin college|etal|dabliumusic|freelance|self-employed|role|worked|works|experience|experiência|trabalh)/i],
  ["education", /\b(cct|unicnec|icot|diploma|degree|first class|education|formação|graduação)/i],
  ["skills", /\b(react|typescript|apps script|stack|skills?|habilidades|tecnologias|active directory|linux)\b/i],
  ["contact", /(hugoviegas3\.1@gmail\.com|linkedin|contact form|contato|contact)/i],
  ["darcy", /\bd['’]?arcy\b/i],
  ["big-bang-duel", /\bbig bang duel\b/i],
];

export function inferSources(question: string, answer: string, projectId?: ChatProjectId): ChatSource[] {
  const text = `${question}\n${answer}`;
  const found = new Set<ChatSource>();
  if (projectId) found.add(projectId);
  for (const [source, pattern] of RULES) if (pattern.test(text)) found.add(source);
  if (!found.size && /\bprojects?\b|projetos?/i.test(text)) found.add("projects");
  return [...found].slice(0, 3);
}
