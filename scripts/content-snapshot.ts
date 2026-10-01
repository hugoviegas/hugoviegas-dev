// Writes the public content snapshot (src/content/snapshot/*.json).
//
//   npm run content:snapshot   Firestore -> snapshot. Keeps the committed files
//                              if Firestore is unreachable, invalid, or
//                              settings/site.useRemote is off.
//
// Firestore is the content source of truth; the committed snapshot is the
// fallback and first-paint copy.
// Runs before every production build. Uses public REST reads only: no service
// account, no secrets.
import fs from "node:fs";
import path from "node:path";
import { mergeCore, publishedSorted } from "../src/content/snapshotBuild";
import { listPublished } from "../src/content/rest";
import {
  coreSnapshotSchema,
  detailsSnapshotSchema,
  schemaByCollection,
} from "../src/content/schema";
import { fetchSiteSettings } from "../src/content/remoteCheck";
import {
  CORE_COLLECTIONS,
  type CoreSnapshot,
  type DetailsSnapshot,
  type DocMeta,
  type ProjectDetailDoc,
} from "../src/content/types";

const dir = path.resolve(__dirname, "../src/content/snapshot");
const corePath = path.join(dir, "core.json");
const detailsPath = path.join(dir, "details.json");

const write = (core: CoreSnapshot, details: DetailsSnapshot) => {
  coreSnapshotSchema.parse(core);
  detailsSnapshotSchema.parse(details);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(corePath, `${JSON.stringify(core, null, 2)}\n`);
  fs.writeFileSync(detailsPath, `${JSON.stringify(details, null, 2)}\n`);
};

const readCurrent = (): CoreSnapshot =>
  JSON.parse(fs.readFileSync(corePath, "utf-8")) as CoreSnapshot;

// Any invalid remote doc aborts the snapshot: the committed files stay.
const strictDocs = (collection: keyof typeof schemaByCollection, docs: unknown[]) =>
  docs.map((doc) => schemaByCollection[collection].parse(doc) as DocMeta);

const fromFirestore = async () => {
  const site = await fetchSiteSettings();
  if (!site) {
    console.log("content:snapshot: settings/site not found; keeping the committed snapshot.");
    return;
  }
  if (!site.useRemote) {
    console.log("content:snapshot: useRemote is off; keeping the committed snapshot.");
    return;
  }
  const lists = await Promise.all(
    CORE_COLLECTIONS.map(
      async (collection) =>
        [collection, strictDocs(collection, await listPublished(collection, 15000))] as const,
    ),
  );
  const details = strictDocs("projectDetails", await listPublished("projectDetails", 15000));
  const core = mergeCore(readCurrent(), Object.fromEntries(lists), site.updatedAt, {
    cv: site.cv,
    profilePhoto: site.profilePhoto,
  });
  const currentDetails = JSON.parse(fs.readFileSync(detailsPath, "utf-8")) as DetailsSnapshot;
  write(core, {
    projectDetails:
      details.length > 0
        ? publishedSorted(details as ProjectDetailDoc[])
        : currentDetails.projectDetails,
  });
  console.log(`content:snapshot: written from Firestore (settings updated ${site.updatedAt}).`);
};

const main = async () => {
  try {
    await fromFirestore();
  } catch (error) {
    // Never fail the build over content: the committed snapshot is the fallback.
    console.warn("content:snapshot: Firestore unavailable or invalid; keeping the committed snapshot.");
    console.warn(error instanceof Error ? error.message : error);
  }
};

void main();
