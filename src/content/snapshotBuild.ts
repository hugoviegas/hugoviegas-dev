// Turns content docs into the public snapshot: published docs only, sorted by
// `order`. Pure, so the script, the admin, and tests share it.
import type { SeedEntry } from "./seed";
import {
  CORE_COLLECTIONS,
  type CoreSnapshot,
  type DetailsSnapshot,
  type DocMeta,
} from "./types";

export const publishedSorted = <T extends DocMeta>(docs: T[]): T[] =>
  docs
    .filter((doc) => doc.published)
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));

// Remote docs replace the current ones per collection. A collection that comes
// back empty keeps its current docs: an empty homepage section is more likely
// a half-finished import than an intent, and unpublishing a single doc still works.
export const mergeCore = (
  current: CoreSnapshot,
  remote: Partial<Record<(typeof CORE_COLLECTIONS)[number], DocMeta[]>>,
  siteUpdatedAt: string | null,
): CoreSnapshot => {
  const next = { ...current, siteUpdatedAt, source: "firestore" } as CoreSnapshot;
  for (const collection of CORE_COLLECTIONS) {
    const docs = remote[collection];
    if (docs && docs.length > 0) {
      (next as unknown as Record<string, DocMeta[]>)[collection] = publishedSorted(docs);
    }
  }
  return next;
};

export const buildSnapshots = (
  entries: SeedEntry[],
  siteUpdatedAt: string | null,
  source: CoreSnapshot["source"],
): { core: CoreSnapshot; details: DetailsSnapshot } => {
  const docsOf = (collection: string) =>
    entries.filter((entry) => entry.collection === collection).map((entry) => entry.doc);

  const core = { siteUpdatedAt, source } as CoreSnapshot;
  for (const collection of CORE_COLLECTIONS) {
    (core as unknown as Record<string, DocMeta[]>)[collection] = publishedSorted(
      docsOf(collection),
    );
  }
  return {
    core,
    details: {
      projectDetails: publishedSorted(
        docsOf("projectDetails") as DetailsSnapshot["projectDetails"],
      ),
    },
  };
};
