// Admin file uploads to the public Vercel Blob store. The browser asks
// /api/blob-upload for a short-lived token, sending the Firebase ID token;
// the route only answers the owner. The file then goes straight to Blob.
import {
  buildUploadPathname,
  isStoredBlobUrl,
  UPLOAD_KINDS,
  type UploadKind,
} from "@/content/uploadPolicy";
import { getFirebase } from "./firebase";

export type UploadProblem = "type" | "size" | "name" | "auth" | "failed";

export class UploadError extends Error {
  constructor(readonly problem: UploadProblem, message: string = problem) {
    super(message);
  }
}

export const maxMegabytes = (kind: UploadKind) => UPLOAD_KINDS[kind].maxBytes / (1024 * 1024);

// Images accept any format the browser decodes; imageFit converts them.
export const acceptedTypes = (kind: UploadKind) =>
  kind === "cv" ? Object.keys(UPLOAD_KINDS.cv.types).join(",") : "image/*";

// Same checks as the route, so most mistakes fail before any request.
export const checkFile = (
  kind: UploadKind,
  file: File,
  name: string,
  projectId?: string,
): string => {
  if (!(file.type in UPLOAD_KINDS[kind].types)) throw new UploadError("type");
  if (file.size > UPLOAD_KINDS[kind].maxBytes) throw new UploadError("size");
  const pathname = buildUploadPathname(kind, file.type, name, projectId);
  if (!pathname) throw new UploadError("name");
  return pathname;
};

export const uploadFile = async (
  kind: UploadKind,
  file: File,
  name: string,
  projectId?: string,
  onProgress?: (percentage: number) => void,
): Promise<string> => {
  const pathname = checkFile(kind, file, name, projectId);
  const user = getFirebase().auth.currentUser;
  if (!user) throw new UploadError("auth");
  const idToken = await user.getIdToken();
  try {
    // Loaded on first upload only: the SDK is large for the admin chunk.
    const { upload } = await import("@vercel/blob/client");
    const blob = await upload(pathname, file, {
      access: "public",
      handleUploadUrl: "/api/blob-upload",
      headers: { authorization: `Bearer ${idToken}` },
      contentType: file.type,
      multipart: false,
      onUploadProgress: onProgress ? ({ percentage }) => onProgress(percentage) : undefined,
    });
    if (!isStoredBlobUrl(kind, blob.url)) throw new Error(`Unexpected file URL: ${blob.url}`);
    return blob.url;
  } catch (error) {
    throw new UploadError("failed", error instanceof Error ? error.message : String(error));
  }
};
