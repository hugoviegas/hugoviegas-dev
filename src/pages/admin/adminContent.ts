// Owner-side Firestore reads and writes for the admin. Every write runs under
// Hugo's Google sign-in and is checked by firestore.rules.
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore/lite";
import { CONTENT_COLLECTIONS } from "@/content/types";
import { getFirebase } from "./firebase";
import { pendingItems, type ExistingDocs, type ImportPlan } from "./importPlan";

export interface ExistingSettings {
  useRemote: boolean;
  version: number;
  data: Record<string, unknown>;
}

export const loadExistingContent = async (): Promise<{
  docs: ExistingDocs;
  settings: ExistingSettings | null;
}> => {
  const { db } = getFirebase();
  const docs: ExistingDocs = {};
  await Promise.all(
    CONTENT_COLLECTIONS.map(async (name) => {
      const snapshot = await getDocs(collection(db, name));
      docs[name] = Object.fromEntries(
        snapshot.docs.map((item) => {
          const data = item.data();
          return [item.id, { version: Number(data.version ?? 0), data }];
        }),
      );
    }),
  );
  const site = await getDoc(doc(db, "settings", "site"));
  const data = site.data();
  return {
    docs,
    settings: data
      ? { useRemote: Boolean(data.useRemote), version: Number(data.version ?? 0), data }
      : null,
  };
};

// Firestore allows 500 writes per batch; history entries count too.
const MAX_BATCH_WRITES = 500;

// Applies the plan in one atomic batch: the previous version of every changed
// doc goes to contentHistory, then settings/site.updatedAt is bumped so the
// public site picks the change up. A rules rejection fails the whole batch.
export const applyImportPlan = async (
  plan: ImportPlan,
  existing: ExistingDocs,
  settings: ExistingSettings | null,
) => {
  const { db } = getFirebase();
  const items = pendingItems(plan);
  const changed = items.filter((item) => item.status === "changed");
  const writes = items.length + changed.length + (settings ? 2 : 1);
  if (writes > MAX_BATCH_WRITES) {
    throw new Error(`Import needs ${writes} writes; the limit is ${MAX_BATCH_WRITES}.`);
  }

  const batch = writeBatch(db);
  const history = collection(db, "contentHistory");
  for (const item of items) {
    const current = existing[item.collection]?.[item.id];
    if (current) {
      batch.set(doc(history), {
        collection: item.collection,
        docId: item.id,
        version: current.version,
        data: current.data,
        savedAt: serverTimestamp(),
      });
    }
    batch.set(doc(db, item.collection, item.id), {
      ...item.fields,
      updatedAt: serverTimestamp(),
      version: item.nextVersion,
    });
  }
  if (settings) {
    batch.set(doc(history), {
      collection: "settings",
      docId: "site",
      version: settings.version,
      data: settings.data,
      savedAt: serverTimestamp(),
    });
  }
  batch.set(doc(db, "settings", "site"), {
    // A first import turns remote content on; later imports keep the switch.
    useRemote: settings ? settings.useRemote : true,
    updatedAt: serverTimestamp(),
    version: (settings?.version ?? 0) + 1,
  });
  await batch.commit();
  return items.length;
};
