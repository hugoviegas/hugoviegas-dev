// Pure helpers behind the admin editors: defaults, cleanup before validation,
// reorder, and restore. Kept free of React and Firebase so they are easy to test.
import { schemaByCollection } from "@/content/schema";
import type { ContentCollection, DocMeta } from "@/content/types";
import { collectionDefs, type FieldDef } from "./collectionConfig";
import { storedFields, type ExistingDoc } from "./storedDoc";

// DOM id for a form field path ("en.title" -> "field-en-title").
export const fieldId = (path: string) => `field-${path.replace(/\./g, "-")}`;

export const sortByOrder = <T extends DocMeta>(docs: T[]): T[] =>
  [...docs].sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));

// Next order value: after the last doc in the same scope, in steps of 10.
export const nextOrder = (docs: DocMeta[]) =>
  docs.length === 0 ? 0 : Math.min(10000, Math.max(...docs.map((doc) => doc.order)) + 10);

export const newDoc = (name: ContentCollection, docs: DocMeta[]): DocMeta =>
  ({
    id: "",
    published: false,
    order: nextOrder(docs),
    updatedAt: null,
    version: 0,
    ...collectionDefs[name].empty(),
  }) as DocMeta;

// "lines" fields keep blank lines while typing; they are dropped before
// validation and saving.
const cleanLines = (value: unknown) =>
  Array.isArray(value) ? value.map(String).filter((line) => line.trim() !== "") : value;

const cleanFields = (block: Record<string, unknown>, fields: FieldDef[]) => {
  const out = { ...block };
  for (const field of fields) {
    if (field.kind === "lines") out[field.name] = cleanLines(out[field.name]);
    if (field.kind === "objects" && Array.isArray(out[field.name])) {
      out[field.name] = (out[field.name] as Record<string, unknown>[]).map((item) =>
        cleanFields(item, field.fields ?? []),
      );
    }
  }
  return out;
};

export const cleanDoc = <T extends Record<string, unknown>>(name: ContentCollection, value: T): T => {
  const def = collectionDefs[name];
  const out = cleanFields(value, def.shared) as Record<string, unknown>;
  for (const lang of ["en", "ptBR"] as const) {
    if (out[lang] && typeof out[lang] === "object") {
      out[lang] = cleanFields(out[lang] as Record<string, unknown>, def.localized);
    }
  }
  return out as T;
};

export interface DocChange {
  value: DocMeta;
  current: ExistingDoc | null;
}

// Moves one doc up or down within its scope and renumbers that scope in steps
// of 10. Returns only the docs whose order changed.
export const reorderChanges = (
  docs: DocMeta[],
  id: string,
  direction: -1 | 1,
  stored: Record<string, ExistingDoc>,
  scope?: (doc: DocMeta) => string,
): DocChange[] => {
  const target = docs.find((doc) => doc.id === id);
  if (!target) return [];
  const inScope = sortByOrder(
    docs.filter((doc) => !scope || scope(doc) === scope(target)),
  );
  const from = inScope.findIndex((doc) => doc.id === id);
  const to = from + direction;
  if (to < 0 || to >= inScope.length) return [];
  const moved = [...inScope];
  [moved[from], moved[to]] = [moved[to], moved[from]];
  return moved.flatMap((doc, index) => {
    const order = index * 10;
    return doc.order === order
      ? []
      : [{ value: { ...doc, order }, current: stored[doc.id] ?? null }];
  });
};

// A history entry turned back into an app doc, ready to validate and save.
export const restoredDoc = (id: string, data: Record<string, unknown>): DocMeta =>
  ({ ...storedFields(data), id, updatedAt: null, version: 0 }) as DocMeta;

// Moves one doc to the position of another (drag and drop) within its scope,
// renumbering that scope in steps of 10. Returns only changed docs.
export const moveToChanges = (
  docs: DocMeta[],
  id: string,
  targetId: string,
  stored: Record<string, ExistingDoc>,
  scope?: (doc: DocMeta) => string,
): DocChange[] => {
  const moving = docs.find((doc) => doc.id === id);
  const target = docs.find((doc) => doc.id === targetId);
  if (!moving || !target || id === targetId) return [];
  if (scope && scope(moving) !== scope(target)) return [];
  const inScope = sortByOrder(docs.filter((doc) => !scope || scope(doc) === scope(moving)));
  const from = inScope.findIndex((doc) => doc.id === id);
  const to = inScope.findIndex((doc) => doc.id === targetId);
  const moved = [...inScope];
  const [item] = moved.splice(from, 1);
  moved.splice(to, 0, item);
  return moved.flatMap((doc, index) => {
    const order = index * 10;
    return doc.order === order ? [] : [{ value: { ...doc, order }, current: stored[doc.id] ?? null }];
  });
};

export interface PublishProblem {
  lang: "en" | "ptBR" | null;
  field: string;
  kind: "missing" | "invalid";
}

// What stops a doc from being published: the same Zod schema the site uses,
// run as if Published were on. Missing required text is reported per language.
export const publishProblems = (name: ContentCollection, doc: DocMeta): PublishProblem[] => {
  const result = schemaByCollection[name].safeParse(
    cleanDoc(name, { ...doc, published: true } as unknown as Record<string, unknown>),
  );
  if (result.success) return [];
  const seen = new Set<string>();
  return result.error.issues.flatMap((issue): PublishProblem[] => {
    const [first, second] = issue.path.map(String);
    const lang = first === "en" || first === "ptBR" ? first : null;
    const field = lang ? second ?? "" : first ?? "";
    const kind = issue.code === "custom" ? "missing" : "invalid";
    const key = `${lang}.${field}.${kind}`;
    if (seen.has(key)) return [];
    seen.add(key);
    return [{ lang, field, kind }];
  });
};
