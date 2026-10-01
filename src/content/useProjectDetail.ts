// Project detail content for the lazy project pages. The details snapshot is
// imported here, so it lands in the project-page chunk, not the homepage entry.
import { useEffect, useState } from "react";
import details from "./snapshot/details.json";
import { useRemoteNewer } from "./store";
import type { DetailsSnapshot, ProjectDetailDoc } from "./types";

const snapshotDetails = (details as DetailsSnapshot).projectDetails;

export const getSnapshotDetail = (id: string) =>
  snapshotDetails.find((doc) => doc.id === id) ?? null;

export const useProjectDetail = (id: string): ProjectDetailDoc | null => {
  const [doc, setDoc] = useState(() => getSnapshotDetail(id));
  const remoteNewer = useRemoteNewer();

  useEffect(() => {
    setDoc(getSnapshotDetail(id));
    if (!remoteNewer) return;
    let cancelled = false;
    import("./refresh")
      .then(({ fetchProjectDetail }) => fetchProjectDetail(id))
      .then((remote) => {
        if (remote?.published && !cancelled) setDoc(remote);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [id, remoteNewer]);

  return doc;
};
