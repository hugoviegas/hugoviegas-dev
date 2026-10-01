// Dry-run diff between the hard-coded seed and what is in Firestore. Pure, so
// the plan shown to Hugo is exactly what the write step applies.
import type { SeedEntry } from "@/content/seed";
import type { ContentCollection } from "@/content/types";

export interface ExistingDoc {
  version: number;
  // All stored fields, including meta (updatedAt as stored).
  data: Record<string, unknown>;
}

export type ExistingDocs = Partial<Record<ContentCollection, Record<string, ExistingDoc>>>;

export type PlanStatus = "new" | "changed" | "unchanged";

export interface PlanItem {
  collection: ContentCollection;
  id: string;
  status: PlanStatus;
  // Top-level fields that differ (empty for new and unchanged docs).
  changedFields: string[];
  // Fields to store, without meta (id, updatedAt, version).
  fields: Record<string, unknown>;
  // Version to write: 1 for new docs, current + 1 for changed docs.
  nextVersion: number;
}

export interface ImportPlan {
  items: PlanItem[];
  // Docs in Firestore that the seed does not contain. The import leaves them alone.
  untouched: { collection: ContentCollection; id: string }[];
}

const META = new Set(["id", "updatedAt", "version"]);

export const storedFields = (doc: object): Record<string, unknown> =>
  Object.fromEntries(Object.entries(doc).filter(([key]) => !META.has(key)));

// Key-order-independent comparison of JSON-like values.
const stable = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, stable((value as Record<string, unknown>)[key])]),
    );
  }
  return value;
};
const same = (a: unknown, b: unknown) => JSON.stringify(stable(a)) === JSON.stringify(stable(b));

export const buildImportPlan = (seed: SeedEntry[], existing: ExistingDocs): ImportPlan => {
  const items = seed.map(({ collection, doc }): PlanItem => {
    const fields = storedFields(doc);
    const current = existing[collection]?.[doc.id];
    if (!current) {
      return { collection, id: doc.id, status: "new", changedFields: [], fields, nextVersion: 1 };
    }
    const stored = storedFields(current.data);
    const keys = new Set([...Object.keys(fields), ...Object.keys(stored)]);
    const changedFields = [...keys].filter((key) => !same(fields[key], stored[key])).sort();
    return {
      collection,
      id: doc.id,
      status: changedFields.length > 0 ? "changed" : "unchanged",
      changedFields,
      fields,
      nextVersion: current.version + 1,
    };
  });

  const seeded = new Set(seed.map(({ collection, doc }) => `${collection}/${doc.id}`));
  const untouched = (Object.keys(existing) as ContentCollection[]).flatMap((collection) =>
    Object.keys(existing[collection] ?? {})
      .filter((id) => !seeded.has(`${collection}/${id}`))
      .map((id) => ({ collection, id })),
  );

  return { items, untouched };
};

export const pendingItems = (plan: ImportPlan) =>
  plan.items.filter((item) => item.status !== "unchanged");
