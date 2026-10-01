// POST /api/blob-upload: issues a short-lived Vercel Blob client token for
// one admin upload. Only Hugo's Firebase ID token gets one, and the token is
// limited to one pathname, one content type, and a size cap.
//
// BLOB_READ_WRITE_TOKEN is a server-only Vercel environment variable. It never
// leaves this function and must never be set as a VITE_* variable.
// Relative imports need the .js extension: Vercel runs this file as Node ESM.
import { generateClientTokenFromReadWriteToken } from "@vercel/blob/client";
import type { JWTVerifyGetKey } from "jose";
import { parseUploadPathname, UPLOAD_TOKEN_TTL_MS } from "../src/content/uploadPolicy.js";
import { bearerToken, isOwnerToken } from "../src/server/ownerToken.js";

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

interface Deps {
  blobToken: string | undefined;
  keys?: JWTVerifyGetKey;
  now?: () => number;
  issueToken?: typeof generateClientTokenFromReadWriteToken;
}

export const handleBlobUpload = async (request: Request, deps: Deps): Promise<Response> => {
  // Authenticate before reading the body.
  if (!(await isOwnerToken(bearerToken(request.headers.get("authorization")), deps.keys))) {
    return json(401, { error: "Unauthorized" });
  }
  if (!deps.blobToken) {
    return json(500, { error: "Uploads are not configured" });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid body" });
  }
  // Only token requests. Upload-completed callbacks are not used: the admin
  // writes the result to Firestore itself.
  const event = body as { type?: unknown; payload?: { pathname?: unknown; multipart?: unknown } };
  if (event?.type !== "blob.generate-client-token" || event.payload?.multipart === true) {
    return json(400, { error: "Unsupported request" });
  }
  const pathname = event.payload?.pathname;
  const target = parseUploadPathname(pathname);
  if (!target) {
    return json(400, { error: "Path or file type not allowed" });
  }

  const issue = deps.issueToken ?? generateClientTokenFromReadWriteToken;
  try {
    const clientToken = await issue({
      token: deps.blobToken,
      pathname: pathname as string,
      allowedContentTypes: [target.contentType],
      maximumSizeInBytes: target.maxBytes,
      validUntil: (deps.now ?? Date.now)() + UPLOAD_TOKEN_TTL_MS,
      addRandomSuffix: true,
      allowOverwrite: false,
    });
    return json(200, { type: "blob.generate-client-token", clientToken });
  } catch {
    // No details: the SDK error could describe the store token.
    return json(500, { error: "Could not issue an upload token" });
  }
};

export function POST(request: Request) {
  return handleBlobUpload(request, { blobToken: process.env.BLOB_READ_WRITE_TOKEN });
}
