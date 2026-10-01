import { beforeAll, describe, expect, it, vi } from "vitest";
import legacy from "./__fixtures__/legacy-render.json";
import { renderText, targets } from "./renderTargets";
import { buildSeed } from "../seed";
import { buildSnapshots } from "../snapshotBuild";
import { replaceCoreContent } from "../store";
import { legacyCertifications, legacyFocus, legacyItSkills } from "../legacy";

// Dual-run: the data-driven components, fed from the seed, must render the
// same text as the hard-coded version (captured in legacy-render.json before
// the migration). Seed data is used, not the committed snapshot, so the check
// stays valid after the snapshot starts coming from Firestore.
vi.mock("../snapshot/details.json", async () => {
  const { buildSeed: seed } = await import("../seed");
  const { buildSnapshots: build } = await import("../snapshotBuild");
  return { default: build(seed(), null, "seed").details };
});

beforeAll(() => {
  replaceCoreContent(buildSnapshots(buildSeed(), null, "seed").core, false);
});

// Intended differences: the hard-coded version showed these labels in English
// in PT-BR mode. Everything else must match exactly.
const ptLabelFixes: Record<string, { en: string; ptBR: string }[]> = {
  experience: [...legacyCertifications, ...legacyFocus],
  about: legacyItSkills,
};

const expectedText = (name: string, language: "EN" | "PT") => {
  let text = (legacy as Record<string, Record<string, string>>)[name][language];
  if (language === "PT") {
    const fixes = (ptLabelFixes[name] ?? [])
      .filter((skill) => skill.en !== skill.ptBR)
      // Longer labels first, so a label that contains another is replaced whole.
      .sort((a, b) => b.en.length - a.en.length);
    for (const fix of fixes) text = text.split(fix.en).join(fix.ptBR);
  }
  return text;
};

describe("dual-run: data-driven render matches the hard-coded version", () => {
  for (const name of Object.keys(targets)) {
    for (const language of ["EN", "PT"] as const) {
      it(`${name} (${language})`, async () => {
        expect(await renderText(name, language)).toBe(expectedText(name, language));
      });
    }
  }
});
