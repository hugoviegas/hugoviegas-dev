import { describe, expect, it } from "vitest";
import { buildSeed, cvDuplicates, skillKey } from "../seed";
import { schemaByCollection } from "../schema";
import type { ExperienceDoc, EducationDoc, SkillDoc } from "../types";

const seed = buildSeed();
const docs = (collection: string) =>
  seed.filter((entry) => entry.collection === collection).map((entry) => entry.doc);
const text = JSON.stringify(seed);

describe("seed", () => {
  it("passes the content schema, including both languages for published docs", () => {
    for (const { collection, doc } of seed) {
      const result = schemaByCollection[collection].safeParse(doc);
      expect(result.success, `${collection}/${doc.id}`).toBe(true);
    }
  });

  it("has unique ids per collection", () => {
    const keys = seed.map(({ collection, doc }) => `${collection}/${doc.id}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("includes every role and education entry, in the current order", () => {
    expect(docs("experience").map((doc) => doc.id)).toEqual([
      "erin-college",
      "freelance-web-developer",
      "etal",
      "dabliumusic",
    ]);
    expect(docs("education").map((doc) => doc.id)).toEqual(["cct-college", "icot", "unicnec"]);
  });

  it("keeps the verified facts from CLAUDE.md", () => {
    const byId = Object.fromEntries(
      (docs("experience") as ExperienceDoc[]).map((doc) => [doc.id, doc]),
    );
    expect(byId.dabliumusic.en.organization).toBe("DabliuMusic");
    expect(byId.dabliumusic.en.period).toBe("2020 – 2021");
    expect(byId["freelance-web-developer"].en.title).toBe("Web Developer");
    expect(byId.etal.en.organization).toBe("ETAL Prestação de Serviços LTDA");
    expect(byId.etal.en.bullets[0]).toMatch(/400\+ employees from four days to about one/);
    const icot = (docs("education") as EducationDoc[]).find((doc) => doc.id === "icot");
    expect(icot?.en.title).toMatch(/C1/);
  });

  it("does not seed claims CLAUDE.md rules out for ETAL", () => {
    const etal = JSON.stringify(docs("experience").find((doc) => doc.id === "etal"));
    for (const banned of ["Node.js", "Express", "PHP", "MySQL", "90%", "Google Workspace API"]) {
      expect(etal).not.toContain(banned);
    }
    expect(text).not.toMatch(/Dablium(?!usic)/i);
  });

  it("does not seed unmounted StatsSection content", () => {
    expect(text).not.toContain("Process Time Reduction");
    expect(text).not.toContain("Countries Worked");
  });

  it("seeds skills without case-insensitive duplicates within a group", () => {
    const skills = docs("skills") as SkillDoc[];
    for (const group of ["programming", "it", "certification", "focus"]) {
      const labels = skills.filter((s) => s.group === group).map((s) => skillKey(s.en.label));
      expect(new Set(labels).size, group).toBe(labels.length);
    }
  });

  it("adds CV-only skills as drafts and drops CV skills already on the site", () => {
    const skills = docs("skills") as SkillDoc[];
    const published = new Set(skills.filter((s) => s.published).map((s) => skillKey(s.en.label)));
    const drafts = skills.filter((s) => !s.published);
    expect(drafts.length).toBeGreaterThan(0);
    for (const draft of drafts) {
      expect(published.has(skillKey(draft.en.label))).toBe(false);
    }
    expect(cvDuplicates.map((s) => s.en).sort()).toEqual(
      ["CSS3", "Google Apps Script", "Google Workspace Administration", "HTML5", "Python"].sort(),
    );
  });

  it("includes certifications and keeps the ETAL project as a draft", () => {
    const certifications = (docs("skills") as SkillDoc[]).filter(
      (s) => s.group === "certification",
    );
    expect(certifications).toHaveLength(10);
    const etalProject = docs("projects").find((doc) => doc.id === "etal-automation");
    expect(etalProject?.published).toBe(false);
  });
});
