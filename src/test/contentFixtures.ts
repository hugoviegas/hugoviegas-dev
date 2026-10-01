// Test-only content: a frozen copy of the docs first imported to Firestore
// (published docs and CV drafts). Tests use it instead of the committed
// snapshot, which changes whenever content is edited in the admin.
import entries from "./fixtures/content-docs.json";
import { publishedSorted } from "@/content/snapshotBuild";
import {
  CORE_COLLECTIONS,
  type ContentCollection,
  type CoreSnapshot,
  type DocByCollection,
  type DocMeta,
} from "@/content/types";

export const fixtureEntries = entries as { collection: ContentCollection; doc: DocMeta }[];

export const fixtureDocs = <C extends ContentCollection>(collection: C): DocByCollection[C][] =>
  structuredClone(
    fixtureEntries.filter((entry) => entry.collection === collection).map((entry) => entry.doc),
  ) as DocByCollection[C][];

// A snapshot as the build would write it from these docs.
export const fixtureCore = (): CoreSnapshot => {
  const core = { siteUpdatedAt: null, source: "seed", files: { cv: null, profilePhoto: null } } as CoreSnapshot;
  for (const collection of CORE_COLLECTIONS) {
    (core as unknown as Record<string, DocMeta[]>)[collection] = publishedSorted(fixtureDocs(collection));
  }
  return core;
};
