// Upload rules shared by the admin, the /api/blob-upload route, and the
// content schema. No imports: the serverless route loads this file directly.
// firestore.rules repeats the stored-URL patterns: change both together.

// Public Vercel Blob store that holds the CV and site images.
export const BLOB_STORE_HOST = "sb7cb98htp9acpqo.public.blob.vercel-storage.com";

const MB = 1024 * 1024;

export const IMAGE_TYPES: Record<string, string> = {
  "image/webp": "webp",
  "image/avif": "avif",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const PDF_TYPES: Record<string, string> = { "application/pdf": "pdf" };

export const UPLOAD_KINDS = {
  cv: { folder: "cv", types: PDF_TYPES, maxBytes: 5 * MB },
  profile: { folder: "profile", types: IMAGE_TYPES, maxBytes: 2 * MB },
  project: { folder: "projects", types: IMAGE_TYPES, maxBytes: 3 * MB },
} as const;

export type UploadKind = keyof typeof UPLOAD_KINDS;

// Upload tokens expire quickly; an upload starts right after the request.
export const UPLOAD_TOKEN_TTL_MS = 5 * 60 * 1000;

const NAME = "[a-z0-9-]{1,60}";
const DOC_ID = "[a-z0-9-]{1,100}";
const IMAGE_EXT = "(webp|avif|jpg|png)";

// Pathnames the route accepts. The store appends a random suffix.
const PATHNAMES: Record<UploadKind, RegExp> = {
  cv: new RegExp(`^cv/${NAME}\\.(pdf)$`),
  profile: new RegExp(`^profile/${NAME}\\.${IMAGE_EXT}$`),
  project: new RegExp(`^projects/${DOC_ID}/${NAME}\\.${IMAGE_EXT}$`),
};

export interface UploadTarget {
  kind: UploadKind;
  contentType: string;
  maxBytes: number;
}

// The single content type and size limit for a requested pathname, or null.
export const parseUploadPathname = (pathname: unknown): UploadTarget | null => {
  if (typeof pathname !== "string") return null;
  for (const kind of Object.keys(PATHNAMES) as UploadKind[]) {
    const match = PATHNAMES[kind].exec(pathname);
    if (!match) continue;
    const ext = match[match.length - 1];
    const { types, maxBytes } = UPLOAD_KINDS[kind];
    const contentType = Object.keys(types).find((type) => types[type] === ext);
    return contentType ? { kind, contentType, maxBytes } : null;
  }
  return null;
};

// Pathname the admin requests for a file. Null when the type is not allowed.
export const buildUploadPathname = (
  kind: UploadKind,
  contentType: string,
  name: string,
  projectId = "",
): string | null => {
  const ext = (UPLOAD_KINDS[kind].types as Record<string, string>)[contentType];
  if (!ext) return null;
  const folder = kind === "project" ? `projects/${projectId}` : UPLOAD_KINDS[kind].folder;
  const pathname = `${folder}/${name}.${ext}`;
  return parseUploadPathname(pathname) ? pathname : null;
};

// Stored URL patterns: the pathname plus the store's random suffix.
const host = BLOB_STORE_HOST.replace(/\./g, "\\.");
const STORED = "[A-Za-z0-9-]{1,120}";
const STORED_URLS: Record<UploadKind, RegExp> = {
  cv: new RegExp(`^https://${host}/cv/${STORED}\\.pdf$`),
  profile: new RegExp(`^https://${host}/profile/${STORED}\\.${IMAGE_EXT}$`),
  project: new RegExp(`^https://${host}/projects/${DOC_ID}/${STORED}\\.${IMAGE_EXT}$`),
};

export const isStoredBlobUrl = (kind: UploadKind, url: unknown): url is string =>
  typeof url === "string" && url.length <= 300 && STORED_URLS[kind].test(url);
