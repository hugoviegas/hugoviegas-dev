// Public content store. The bundled snapshot is the first-paint source; after
// the page is idle, a lazily loaded refresh swaps in newer Firestore content.
// No Firebase SDK and no Zod here: this module is on the homepage critical path.
import { useSyncExternalStore } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import snapshot from "./snapshot/core.json";
import { contentLang, type CoreSnapshot } from "./types";

let core = snapshot as CoreSnapshot;
// True once the refresh found newer content; project pages then fetch theirs.
let remoteNewer = false;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((listener) => listener());
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getCoreContent = () => core;
export const isRemoteNewer = () => remoteNewer;

export const replaceCoreContent = (next: CoreSnapshot, newer = true) => {
  core = next;
  remoteNewer = newer;
  notify();
};

export const useCoreContent = () => useSyncExternalStore(subscribe, getCoreContent);
export const useRemoteNewer = () => useSyncExternalStore(subscribe, isRemoteNewer);

// Uploaded CV and profile photo; null fields mean the bundled fallback.
export const useSiteFiles = () => useCoreContent().files;

// The active language's block of a bilingual doc.
export const useContentLang = () => contentLang(useLanguage().language);

let scheduled = false;

export const scheduleContentRefresh = () => {
  if (scheduled || typeof window === "undefined" || import.meta.env.MODE === "test") {
    return;
  }
  scheduled = true;
  const run = async () => {
    try {
      // One small read; Zod and the collection reads load only if it is newer.
      const { fetchSiteSettings, shouldRefresh } = await import("./remoteCheck");
      const site = await fetchSiteSettings();
      if (!site || !shouldRefresh(site, core.siteUpdatedAt)) return;
      const { refreshCore } = await import("./refresh");
      replaceCoreContent(await refreshCore(core, site));
    } catch {
      // Offline, blocked, or invalid: the snapshot stays.
    }
  };
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(run, { timeout: 5000 });
  } else {
    setTimeout(run, 2000);
  }
};
