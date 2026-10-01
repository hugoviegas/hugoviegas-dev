import { beforeEach, describe, expect, it, vi } from "vitest";
import { BLOB_STORE_HOST } from "@/content/uploadPolicy";

const sdk = vi.hoisted(() => ({ upload: vi.fn() }));
vi.mock("@vercel/blob/client", () => sdk);
const auth = vi.hoisted(() => ({ currentUser: null as null | { getIdToken: () => Promise<string> } }));
vi.mock("../firebase", () => ({ getFirebase: () => ({ auth }) }));

import { checkFile, uploadFile, UploadError } from "../blobUpload";

const pdf = (size = 10) => new File([new Uint8Array(size)], "cv.pdf", { type: "application/pdf" });

beforeEach(() => {
  sdk.upload.mockReset();
  auth.currentUser = { getIdToken: async () => "id-token" };
});

const problemOf = (fn: () => unknown) => {
  try {
    fn();
  } catch (error) {
    return error instanceof UploadError ? error.problem : "other";
  }
  return null;
};

describe("admin uploads", () => {
  it("checks type, size and name before any request", () => {
    expect(problemOf(() => checkFile("cv", new File(["x"], "a.png", { type: "image/png" }), "cv"))).toBe("type");
    expect(problemOf(() => checkFile("cv", pdf(5 * 1024 * 1024 + 1), "cv"))).toBe("size");
    expect(problemOf(() => checkFile("project", new File(["x"], "a.webp", { type: "image/webp" }), "cover", ""))).toBe(
      "name",
    );
    expect(checkFile("cv", pdf(), "hugo-viegas-cv")).toBe("cv/hugo-viegas-cv.pdf");
  });

  it("sends the Firebase ID token to the route and returns the stored URL", async () => {
    const url = `https://${BLOB_STORE_HOST}/cv/hugo-viegas-cv-Ab12.pdf`;
    sdk.upload.mockResolvedValue({ url });
    const file = pdf();
    await expect(uploadFile("cv", file, "hugo-viegas-cv")).resolves.toBe(url);
    expect(sdk.upload).toHaveBeenCalledWith("cv/hugo-viegas-cv.pdf", file, {
      access: "public",
      handleUploadUrl: "/api/blob-upload",
      headers: { authorization: "Bearer id-token" },
      contentType: "application/pdf",
      multipart: false,
    });
  });

  it("refuses a URL outside the expected store and folder", async () => {
    sdk.upload.mockResolvedValue({ url: "https://evil.example.com/cv/x.pdf" });
    await expect(uploadFile("cv", pdf(), "hugo-viegas-cv")).rejects.toMatchObject({ problem: "failed" });
  });

  it("needs a signed-in user", async () => {
    auth.currentUser = null;
    await expect(uploadFile("cv", pdf(), "hugo-viegas-cv")).rejects.toMatchObject({ problem: "auth" });
    expect(sdk.upload).not.toHaveBeenCalled();
  });
});
