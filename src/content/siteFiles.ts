// Reads the uploaded CV and profile photo from settings/site without Zod, so
// the runtime check stays small. Anything malformed becomes null, and the
// site falls back to the bundled photo and the current CV link.
import type { CvFile, ProfilePhoto, SiteFiles } from "./types";
import { isStoredBlobUrl } from "./uploadPolicy";

const record = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

const positiveInt = (value: unknown, max = 10000): value is number =>
  typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= max;

const text = (value: unknown): value is string =>
  typeof value === "string" && value.trim() !== "" && value.length <= 200;

export const parseCvFile = (value: unknown): CvFile | null => {
  const file = record(value);
  if (!file || !isStoredBlobUrl("cv", file.url) || !positiveInt(file.version, Number.MAX_SAFE_INTEGER)) {
    return null;
  }
  return { url: file.url, version: file.version };
};

export const parseProfilePhoto = (value: unknown): ProfilePhoto | null => {
  const file = record(value);
  const alt = record(file?.alt);
  if (
    !file ||
    !alt ||
    !isStoredBlobUrl("profile", file.url) ||
    !positiveInt(file.width) ||
    !positiveInt(file.height) ||
    !text(alt.en) ||
    !text(alt.ptBR) ||
    !positiveInt(file.version, Number.MAX_SAFE_INTEGER)
  ) {
    return null;
  }
  return {
    url: file.url,
    width: file.width,
    height: file.height,
    alt: { en: alt.en, ptBR: alt.ptBR },
    version: file.version,
  };
};

export const parseSiteFiles = (doc: unknown): SiteFiles => {
  const data = record(doc);
  return {
    cv: parseCvFile(data?.cv),
    profilePhoto: parseProfilePhoto(data?.profilePhoto),
  };
};
