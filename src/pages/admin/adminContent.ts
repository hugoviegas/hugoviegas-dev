// Owner-side Firestore reads and writes for the admin. Every write runs under
// Hugo's Google sign-in and is checked by firestore.rules. Each write batch:
//   - copies the previous version of a changed doc to contentHistory,
//   - writes the doc with updatedAt = server time and version + 1,
//   - bumps settings/site.updatedAt so the public refresh notices.
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
  writeBatch,
  type WriteBatch,
} from "firebase/firestore/lite";
import { parseSiteFiles } from "@/content/siteFiles";
import {
  CONTENT_COLLECTIONS,
  type ContentCollection,
  type DocMeta,
  type SiteFiles,
} from "@/content/types";
import { getFirebase } from "./firebase";
import { storedFields, type ExistingDoc, type ExistingDocs } from "./storedDoc";

export interface ExistingSettings extends SiteFiles {
  useRemote: boolean;
  version: number;
  updatedAt: string | null;
  data: Record<string, unknown>;
}

// Firestore allows 500 writes per batch; history entries count too.
const MAX_BATCH_WRITES = 500;

const isoOrNull = (value: unknown) =>
  value instanceof Timestamp ? value.toDate().toISOString() : null;

// A stored doc as the app sees it: fields plus id, version, and ISO updatedAt.
export const toAppDoc = (id: string, data: Record<string, unknown>) => ({
  ...storedFields(data),
  id,
  version: Number(data.version ?? 0),
  updatedAt: isoOrNull(data.updatedAt),
});

export const loadCollection = async (name: ContentCollection) => {
  const snapshot = await getDocs(collection(getFirebase().db, name));
  return Object.fromEntries(
    snapshot.docs.map((item): [string, ExistingDoc] => {
      const data = item.data();
      return [item.id, { version: Number(data.version ?? 0), data }];
    }),
  );
};

export const loadSettings = async (): Promise<ExistingSettings | null> => {
  const site = await getDoc(doc(getFirebase().db, "settings", "site"));
  const data = site.data();
  return data
    ? {
        useRemote: Boolean(data.useRemote),
        version: Number(data.version ?? 0),
        updatedAt: isoOrNull(data.updatedAt),
        ...parseSiteFiles(data),
        data,
      }
    : null;
};

export const loadExistingContent = async (): Promise<{
  docs: ExistingDocs;
  settings: ExistingSettings | null;
}> => {
  const docs: ExistingDocs = {};
  await Promise.all(
    CONTENT_COLLECTIONS.map(async (name) => {
      docs[name] = await loadCollection(name);
    }),
  );
  return { docs, settings: await loadSettings() };
};

const addHistory = (
  batch: WriteBatch,
  name: ContentCollection | "settings",
  id: string,
  current: ExistingDoc,
) => {
  batch.set(doc(collection(getFirebase().db, "contentHistory")), {
    collection: name,
    docId: id,
    version: current.version,
    data: current.data,
    savedAt: serverTimestamp(),
  });
};

const writeDoc = (
  batch: WriteBatch,
  name: ContentCollection,
  id: string,
  fields: Record<string, unknown>,
  current: ExistingDoc | null,
) => {
  if (current) addHistory(batch, name, id, current);
  batch.set(doc(getFirebase().db, name, id), {
    ...storedFields(fields),
    updatedAt: serverTimestamp(),
    version: (current?.version ?? 0) + 1,
  });
};

// Absent file fields mean "use the bundled fallback", so null is not stored.
const filesToStore = (files: SiteFiles) =>
  Object.fromEntries(Object.entries(files).filter(([, value]) => value !== null));

// Rewrites settings/site, keeping the uploaded files unless `files` replaces them.
const bumpSettings = (
  batch: WriteBatch,
  settings: ExistingSettings | null,
  useRemote = settings ? settings.useRemote : true,
  files: SiteFiles = {
    cv: settings?.cv ?? null,
    profilePhoto: settings?.profilePhoto ?? null,
  },
) => {
  batch.set(doc(getFirebase().db, "settings", "site"), {
    useRemote,
    updatedAt: serverTimestamp(),
    version: (settings?.version ?? 0) + 1,
    ...filesToStore(files),
  });
};

const commit = async (batch: WriteBatch, writes: number) => {
  if (writes > MAX_BATCH_WRITES) {
    throw new Error(`This change needs ${writes} writes; the limit is ${MAX_BATCH_WRITES}.`);
  }
  await batch.commit();
};

// Create or update one doc. `current` is the stored version the edit started from.
export const saveContentDoc = async (
  name: ContentCollection,
  docValue: DocMeta,
  current: ExistingDoc | null,
  settings: ExistingSettings | null,
) => {
  const batch = writeBatch(getFirebase().db);
  writeDoc(batch, name, docValue.id, docValue as unknown as Record<string, unknown>, current);
  bumpSettings(batch, settings);
  await commit(batch, current ? 3 : 2);
};

// Several docs at once (reorder, restore). Each entry is its new full value.
export const saveContentDocs = async (
  name: ContentCollection,
  changes: { value: DocMeta; current: ExistingDoc | null }[],
  settings: ExistingSettings | null,
) => {
  const batch = writeBatch(getFirebase().db);
  for (const { value, current } of changes) {
    writeDoc(batch, name, value.id, value as unknown as Record<string, unknown>, current);
  }
  bumpSettings(batch, settings);
  await commit(batch, changes.length * 2 + 1);
};

// The deleted doc stays in contentHistory, so it can be restored.
export const deleteContentDoc = async (
  name: ContentCollection,
  id: string,
  current: ExistingDoc,
  settings: ExistingSettings | null,
) => {
  const { db } = getFirebase();
  const batch = writeBatch(db);
  addHistory(batch, name, id, current);
  batch.delete(doc(db, name, id));
  bumpSettings(batch, settings);
  await commit(batch, 3);
};

export const saveSettings = async (useRemote: boolean, settings: ExistingSettings | null) => {
  const batch = writeBatch(getFirebase().db);
  if (settings) addHistory(batch, "settings", "site", settings);
  bumpSettings(batch, settings, useRemote);
  await commit(batch, 2);
};

// Points the site at a newly uploaded CV or photo (or back to the bundled
// file with null). The previous settings go to history.
export const saveSiteFiles = async (
  changes: Partial<SiteFiles>,
  settings: ExistingSettings | null,
) => {
  const batch = writeBatch(getFirebase().db);
  if (settings) addHistory(batch, "settings", "site", settings);
  bumpSettings(batch, settings, settings ? settings.useRemote : true, {
    cv: settings?.cv ?? null,
    profilePhoto: settings?.profilePhoto ?? null,
    ...changes,
  });
  await commit(batch, 2);
};

export interface HistoryEntry {
  entryId: string;
  version: number;
  savedAt: string | null;
  data: Record<string, unknown>;
}

// Newest first. Two equality filters need no composite index.
export const listHistory = async (name: ContentCollection, id: string) => {
  const snapshot = await getDocs(
    query(
      collection(getFirebase().db, "contentHistory"),
      where("collection", "==", name),
      where("docId", "==", id),
    ),
  );
  return snapshot.docs
    .map((item): HistoryEntry => {
      const data = item.data();
      return {
        entryId: item.id,
        version: Number(data.version ?? 0),
        savedAt: isoOrNull(data.savedAt),
        data: (data.data ?? {}) as Record<string, unknown>,
      };
    })
    .sort((a, b) => (b.savedAt ?? "").localeCompare(a.savedAt ?? "") || b.version - a.version);
};

// Ids that have history but no current doc: deleted docs that can be restored.
export const listDeletedIds = async (name: ContentCollection, currentIds: Set<string>) => {
  const snapshot = await getDocs(
    query(collection(getFirebase().db, "contentHistory"), where("collection", "==", name)),
  );
  const ids = new Set(snapshot.docs.map((item) => String(item.data().docId)));
  return [...ids].filter((id) => !currentIds.has(id)).sort();
};
