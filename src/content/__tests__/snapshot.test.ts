import { describe, expect, it } from "vitest";
import core from "../snapshot/core.json";
import details from "../snapshot/details.json";
import { coreSnapshotSchema, detailsSnapshotSchema } from "../schema";
import { CORE_COLLECTIONS, type DocMeta } from "../types";

describe("committed snapshot", () => {
  it("is valid", () => {
    expect(coreSnapshotSchema.safeParse(core).success).toBe(true);
    expect(detailsSnapshotSchema.safeParse(details).success).toBe(true);
  });

  it("contains published docs only (it ships in the public bundle)", () => {
    for (const collection of CORE_COLLECTIONS) {
      for (const doc of core[collection] as DocMeta[]) {
        expect(doc.published, `${collection}/${doc.id}`).toBe(true);
      }
    }
    for (const doc of details.projectDetails) expect(doc.published).toBe(true);
  });
});
