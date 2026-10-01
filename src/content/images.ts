// Bundled images that content docs reference by key. A doc may instead store
// the URL of an image uploaded through the admin (validated by the schema and
// firestore.rules to come from the Blob store).
import darcyMcgees from "@/assets/project-darcy-mcgees.webp";
import bigBangDuel from "@/assets/project-big-bang-duel.webp";

export const contentImages: Record<string, string> = {
  "darcy-mcgees": darcyMcgees,
  "big-bang-duel": bigBangDuel,
};

// Image URL for a doc's image field: an uploaded URL, or a bundled key.
export const resolveContentImage = (image: string): string | undefined =>
  image.startsWith("https://") ? image : contentImages[image];
