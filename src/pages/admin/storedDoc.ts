// A content doc as stored in Firestore, and its fields without meta.
import type { ContentCollection } from "@/content/types";

export interface ExistingDoc {
  version: number;
  // All stored fields, including meta (updatedAt as stored).
  data: Record<string, unknown>;
}

export type ExistingDocs = Partial<Record<ContentCollection, Record<string, ExistingDoc>>>;

const META = new Set(["id", "updatedAt", "version"]);

// Fields to store: everything except id, updatedAt, and version.
export const storedFields = (doc: object): Record<string, unknown> =>
  Object.fromEntries(Object.entries(doc).filter(([key]) => !META.has(key)));
