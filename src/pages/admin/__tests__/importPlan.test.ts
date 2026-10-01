import { describe, expect, it } from "vitest";
import { buildSeed } from "@/content/seed";
import { buildImportPlan, pendingItems, storedFields, type ExistingDocs } from "../importPlan";

const seed = buildSeed();

describe("buildImportPlan", () => {
  it("marks every doc new against an empty Firestore", () => {
    const plan = buildImportPlan(seed, {});
    expect(plan.items.every((item) => item.status === "new" && item.nextVersion === 1)).toBe(true);
    expect(pendingItems(plan)).toHaveLength(seed.length);
    // Meta fields are set by the write, never copied from the seed.
    for (const item of plan.items) {
      expect(item.fields).not.toHaveProperty("id");
      expect(item.fields).not.toHaveProperty("updatedAt");
      expect(item.fields).not.toHaveProperty("version");
    }
  });

  it("reports unchanged docs, changed fields, and docs only in Firestore", () => {
    const [first, second] = seed;
    const existing: ExistingDocs = {
      [first.collection]: {
        [first.doc.id]: {
          version: 3,
          data: { ...storedFields(first.doc), updatedAt: "x", version: 3 },
        },
        "extra-doc": { version: 1, data: { published: true } },
      },
    };
    if (second.collection === first.collection) {
      existing[first.collection][second.doc.id] = {
        version: 2,
        data: { ...storedFields(second.doc), published: !second.doc.published, version: 2 },
      };
    }
    const plan = buildImportPlan(seed, existing);
    const byId = Object.fromEntries(plan.items.map((item) => [item.id, item]));
    expect(byId[first.doc.id].status).toBe("unchanged");
    expect(byId[second.doc.id].status).toBe("changed");
    expect(byId[second.doc.id].changedFields).toEqual(["published"]);
    expect(byId[second.doc.id].nextVersion).toBe(3);
    expect(plan.untouched).toEqual([{ collection: first.collection, id: "extra-doc" }]);
  });
});
