// First step of the runtime refresh: one public read of settings/site. Kept
// free of Zod so a visit with nothing new downloads almost nothing.
import { getPublicDocument } from "./rest";
import { parseSiteFiles } from "./siteFiles";
import type { SiteSettings } from "./types";

export const parseSiteSettings = (doc: unknown): SiteSettings | null => {
  if (!doc || typeof doc !== "object") return null;
  const { useRemote, updatedAt, version } = doc as Record<string, unknown>;
  if (typeof useRemote !== "boolean" || typeof version !== "number") return null;
  const stamp = typeof updatedAt === "string" ? updatedAt : updatedAt === null ? null : undefined;
  if (stamp === undefined) return null;
  return { useRemote, updatedAt: stamp, version, ...parseSiteFiles(doc) };
};

export const fetchSiteSettings = async (): Promise<SiteSettings | null> =>
  parseSiteSettings(await getPublicDocument("settings/site"));

export const isNewer = (remote: string | null, current: string | null) =>
  remote !== null && (current === null || Date.parse(remote) > Date.parse(current));

// True when Firestore holds newer content the site is allowed to use.
export const shouldRefresh = (site: SiteSettings | null, current: string | null) =>
  Boolean(site?.useRemote) && isNewer(site?.updatedAt ?? null, current);
