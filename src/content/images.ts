// Bundled images that content docs reference by key. Images stay in the repo
// for v1; a doc stores the key, never a file URL.
import darcyMcgees from "@/assets/project-darcy-mcgees.webp";
import bigBangDuel from "@/assets/project-big-bang-duel.webp";

export const contentImages: Record<string, string> = {
  "darcy-mcgees": darcyMcgees,
  "big-bang-duel": bigBangDuel,
};
