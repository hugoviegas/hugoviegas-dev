// Icon keys a skill doc may use. SkillsSection maps each key to an inline SVG;
// the admin offers them as choices. Keep both in sync.
export const SKILL_ICON_KEYS = [
  "html",
  "css",
  "javascript",
  "php",
  "java",
  "python",
  "c",
  "vue",
  "react",
  "shell",
  "sql",
  "active-directory",
  "google-workspace",
  "windows-server",
  "linux",
  "docker",
  "network",
] as const;

export type SkillIconKey = (typeof SKILL_ICON_KEYS)[number];
