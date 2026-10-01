import { describe, expect, it } from "vitest";
import { buildSeed } from "@/content/seed";
import { schemaByCollection } from "@/content/schema";
import type { DocMeta, ProjectDetailDoc, SkillDoc } from "@/content/types";
import { ADMIN_COLLECTIONS } from "../collectionConfig";
import { cleanDoc, newDoc, reorderChanges, restoredDoc } from "../editorModel";

const seedDocs = (collection: string) =>
  buildSeed()
    .filter((entry) => entry.collection === collection)
    .map((entry) => entry.doc);

describe("editor model", () => {
  it("creates empty drafts that pass the schema once given an id", () => {
    for (const name of ADMIN_COLLECTIONS) {
      const draft = { ...newDoc(name, []), id: "new-doc" };
      expect(schemaByCollection[name].safeParse(draft).success, name).toBe(true);
    }
  });

  it("places a new doc after the last one", () => {
    const docs = seedDocs("experience");
    expect(newDoc("experience", docs).order).toBe(40);
  });

  it("drops blank lines, including inside repeatable items", () => {
    const detail = seedDocs("projectDetails")[1] as ProjectDetailDoc;
    const dirty = {
      ...detail,
      stack: ["React", "", "  "],
      en: {
        ...detail.en,
        sections: [{ ...detail.en.sections[0], items: ["a", "", "b"] }],
      },
    };
    const clean = cleanDoc("projectDetails", dirty);
    expect(clean.stack).toEqual(["React"]);
    expect(clean.en.sections[0].items).toEqual(["a", "b"]);
  });

  it("swaps neighbours, renumbers in steps of 10, and returns only changed docs", () => {
    const docs: DocMeta[] = ["a", "b", "c"].map((id, i) => ({
      id,
      published: true,
      order: i * 10,
      updatedAt: null,
      version: 1,
    }));
    const changes = reorderChanges(docs, "c", -1, {});
    expect(changes.map((c) => [c.value.id, c.value.order])).toEqual([
      ["c", 10],
      ["b", 20],
    ]);
    expect(reorderChanges(docs, "a", -1, {})).toEqual([]);
    expect(reorderChanges(docs, "c", 1, {})).toEqual([]);
  });

  it("reorders skills within their group only", () => {
    const skills = seedDocs("skills") as SkillDoc[];
    const it = skills.filter((s) => s.group === "it");
    const changes = reorderChanges(skills, it[1].id, -1, {}, (doc) => (doc as SkillDoc).group);
    expect(changes.every((c) => (c.value as SkillDoc).group === "it")).toBe(true);
    expect(changes.map((c) => c.value.id)).toEqual([it[1].id, it[0].id]);
  });

  it("turns a history entry back into a doc without stale meta", () => {
    const restored = restoredDoc("etal", { published: true, order: 20, version: 4, updatedAt: "x" });
    expect(restored).toEqual({ id: "etal", published: true, order: 20, version: 0, updatedAt: null });
  });
});
