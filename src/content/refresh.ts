// Runtime content refresh, loaded only after remoteCheck found newer content,
// so Zod stays off the critical path and off visits with nothing new.
import { getPublicDocument, listPublished } from "./rest";
import { schemaByCollection } from "./schema";
import { mergeCore } from "./snapshotBuild";
import { pickSiteFiles } from "./siteFiles";
import {
  CORE_COLLECTIONS,
  type ContentCollection,
  type CoreSnapshot,
  type DocMeta,
  type ProjectDetailDoc,
  type SiteSettings,
} from "./types";

// Invalid docs are dropped (and logged) rather than rendered.
const validDocs = (collection: ContentCollection, docs: unknown[]): DocMeta[] =>
  docs.flatMap((doc) => {
    const parsed = schemaByCollection[collection].safeParse(doc);
    if (!parsed.success) {
      console.warn(`Content: skipped invalid ${collection} doc`, parsed.error.issues);
      return [];
    }
    return [parsed.data as DocMeta];
  });

export const refreshCore = async (
  current: CoreSnapshot,
  site: SiteSettings,
): Promise<CoreSnapshot> => {
  const lists = await Promise.all(
    CORE_COLLECTIONS.map(
      async (collection) =>
        [collection, validDocs(collection, await listPublished(collection))] as const,
    ),
  );
  return mergeCore(current, Object.fromEntries(lists), site.updatedAt, pickSiteFiles(site));
};

export const fetchProjectDetail = async (id: string): Promise<ProjectDetailDoc | null> => {
  const doc = await getPublicDocument(`projectDetails/${id}`);
  if (!doc) return null;
  const [valid] = validDocs("projectDetails", [doc]);
  return valid ? (valid as ProjectDetailDoc) : null;
};
