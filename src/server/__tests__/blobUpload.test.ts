// @vitest-environment node
import { beforeAll, describe, expect, it, vi } from "vitest";
import {
  createLocalJWKSet,
  exportJWK,
  generateKeyPair,
  SignJWT,
  type JWTPayload,
  type JWTVerifyGetKey,
} from "jose";
import { handleBlobUpload } from "../../../api/blob-upload";
import { FIREBASE_PROJECT_ID, OWNER_UID } from "../ownerToken";

type Key = Awaited<ReturnType<typeof generateKeyPair>>["privateKey"];

let googleKey: Key;
let otherKey: Key;
let keys: JWTVerifyGetKey;

beforeAll(async () => {
  const google = await generateKeyPair("RS256");
  googleKey = google.privateKey;
  otherKey = (await generateKeyPair("RS256")).privateKey;
  const jwk = { ...(await exportJWK(google.publicKey)), kid: "google-1", alg: "RS256" };
  keys = createLocalJWKSet({ keys: [jwk] });
});

const now = () => Math.floor(Date.now() / 1000);

const ownerClaims = (): JWTPayload => ({
  email_verified: true,
  auth_time: now() - 60,
  firebase: { sign_in_provider: "google.com" },
});

const sign = (
  claims: JWTPayload = ownerClaims(),
  { key = googleKey, sub = OWNER_UID, aud = FIREBASE_PROJECT_ID, exp = now() + 3600 } = {},
) =>
  new SignJWT(claims)
    .setProtectedHeader({ alg: "RS256", kid: "google-1" })
    .setIssuer(`https://securetoken.google.com/${FIREBASE_PROJECT_ID}`)
    .setAudience(aud)
    .setSubject(sub)
    .setIssuedAt(now() - 60)
    .setExpirationTime(exp)
    .sign(key);

const tokenRequest = (pathname: string, extra: Record<string, unknown> = {}) => ({
  type: "blob.generate-client-token",
  payload: { pathname, clientPayload: null, multipart: false, ...extra },
});

const call = async (
  authorization: string | null,
  body: unknown = tokenRequest("cv/hugo-viegas-cv.pdf"),
  blobToken: string | undefined = "fake-store-token",
) => {
  const issueToken = vi.fn().mockResolvedValue("client-token");
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (authorization) headers.authorization = authorization;
  const response = await handleBlobUpload(
    new Request("https://hugoviegas.dev/api/blob-upload", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    }),
    { blobToken, keys, issueToken, now: () => 1_000_000 },
  );
  return { response, issueToken, json: await response.json() };
};

describe("POST /api/blob-upload", () => {
  it("issues a narrow, short-lived client token for the owner", async () => {
    const { response, issueToken, json } = await call(`Bearer ${await sign()}`);
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(json).toEqual({ type: "blob.generate-client-token", clientToken: "client-token" });
    expect(issueToken).toHaveBeenCalledWith({
      token: "fake-store-token",
      pathname: "cv/hugo-viegas-cv.pdf",
      allowedContentTypes: ["application/pdf"],
      maximumSizeInBytes: 5 * 1024 * 1024,
      validUntil: 1_000_000 + 5 * 60 * 1000,
      addRandomSuffix: true,
      allowOverwrite: false,
    });
  });

  it("limits images by kind", async () => {
    const auth = `Bearer ${await sign()}`;
    const profile = await call(auth, tokenRequest("profile/hugo-viegas.webp"));
    expect(profile.issueToken.mock.calls[0][0]).toMatchObject({
      allowedContentTypes: ["image/webp"],
      maximumSizeInBytes: 2 * 1024 * 1024,
    });
    const project = await call(auth, tokenRequest("projects/big-bang-duel/cover.jpg"));
    expect(project.issueToken.mock.calls[0][0]).toMatchObject({
      allowedContentTypes: ["image/jpeg"],
      maximumSizeInBytes: 3 * 1024 * 1024,
    });
  });

  it.each([
    ["no header", async () => null],
    ["not a bearer token", async () => `Basic ${await sign()}`],
    ["another user", async () => `Bearer ${await sign(ownerClaims(), { sub: "someone-else" })}`],
    ["another project", async () => `Bearer ${await sign(ownerClaims(), { aud: "other-project" })}`],
    ["expired", async () => `Bearer ${await sign(ownerClaims(), { exp: now() - 120 })}`],
    ["signed by another key", async () => `Bearer ${await sign(ownerClaims(), { key: otherKey })}`],
    ["unverified email", async () => `Bearer ${await sign({ ...ownerClaims(), email_verified: false })}`],
    [
      "password sign-in",
      async () =>
        `Bearer ${await sign({ ...ownerClaims(), firebase: { sign_in_provider: "password" } })}`,
    ],
    ["missing auth_time", async () => `Bearer ${await sign({ ...ownerClaims(), auth_time: undefined })}`],
    [
      "unsigned token",
      async () => {
        const [, body] = (await sign()).split(".");
        const header = Buffer.from(JSON.stringify({ alg: "none", kid: "google-1" })).toString("base64url");
        return `Bearer ${header}.${body}.`;
      },
    ],
  ])("rejects %s with 401 and no token", async (_name, header) => {
    const { response, issueToken } = await call(await header());
    expect(response.status).toBe(401);
    expect(issueToken).not.toHaveBeenCalled();
  });

  it.each([
    ["an svg", tokenRequest("profile/hugo.svg")],
    ["an html file", tokenRequest("cv/cv.html")],
    ["a pdf outside cv/", tokenRequest("profile/cv.pdf")],
    ["path traversal", tokenRequest("projects/../cv/x.pdf")],
    ["an unknown folder", tokenRequest("other/file.webp")],
    ["uppercase names", tokenRequest("cv/Hugo CV.pdf")],
    ["multipart uploads", tokenRequest("cv/hugo-viegas-cv.pdf", { multipart: true })],
    ["upload-completed callbacks", { type: "blob.upload-completed", payload: {} }],
    ["a missing pathname", { type: "blob.generate-client-token", payload: {} }],
  ])("rejects %s with 400", async (_name, body) => {
    const { response, issueToken } = await call(`Bearer ${await sign()}`, body);
    expect(response.status).toBe(400);
    expect(issueToken).not.toHaveBeenCalled();
  });

  it("answers 500 without revealing anything when the store token is missing", async () => {
    const { response, issueToken, json } = await call(`Bearer ${await sign()}`, undefined, "");
    expect(response.status).toBe(500);
    expect(JSON.stringify(json)).not.toMatch(/BLOB_READ_WRITE_TOKEN/);
    expect(issueToken).not.toHaveBeenCalled();
  });

  it("answers a generic 500 when the store rejects the token request", async () => {
    const issueToken = vi.fn().mockRejectedValue(new Error("Invalid token fake-store-token"));
    const response = await handleBlobUpload(
      new Request("https://hugoviegas.dev/api/blob-upload", {
        method: "POST",
        headers: { authorization: `Bearer ${await sign()}` },
        body: JSON.stringify(tokenRequest("cv/hugo-viegas-cv.pdf")),
      }),
      { blobToken: "fake-store-token", keys, issueToken },
    );
    expect(response.status).toBe(500);
    expect(await response.text()).not.toContain("fake-store-token");
  });

  it("checks the token before the store configuration", async () => {
    const { response } = await call(null, undefined, "");
    expect(response.status).toBe(401);
  });
});
