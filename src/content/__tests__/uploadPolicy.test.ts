import { describe, expect, it } from "vitest";
import {
  BLOB_STORE_HOST,
  buildUploadPathname,
  isStoredBlobUrl,
  parseUploadPathname,
} from "../uploadPolicy";

const blob = (path: string) => `https://${BLOB_STORE_HOST}/${path}`;

describe("upload policy", () => {
  it("builds pathnames the route accepts", () => {
    expect(buildUploadPathname("cv", "application/pdf", "hugo-viegas-cv")).toBe("cv/hugo-viegas-cv.pdf");
    expect(buildUploadPathname("profile", "image/jpeg", "hugo-viegas")).toBe("profile/hugo-viegas.jpg");
    expect(buildUploadPathname("project", "image/webp", "cover", "big-bang-duel")).toBe(
      "projects/big-bang-duel/cover.webp",
    );
  });

  it("refuses other types and bad names", () => {
    expect(buildUploadPathname("cv", "image/png", "cv")).toBeNull();
    expect(buildUploadPathname("profile", "image/svg+xml", "hugo")).toBeNull();
    expect(buildUploadPathname("profile", "application/pdf", "hugo")).toBeNull();
    expect(buildUploadPathname("project", "image/webp", "cover", "../x")).toBeNull();
    expect(buildUploadPathname("project", "image/webp", "cover", "")).toBeNull();
  });

  it("maps each pathname to one content type", () => {
    expect(parseUploadPathname("profile/a.png")).toMatchObject({ kind: "profile", contentType: "image/png" });
    expect(parseUploadPathname("profile/a.jpeg")).toBeNull();
    expect(parseUploadPathname(42)).toBeNull();
  });

  it("accepts stored URLs only from this store and folder", () => {
    expect(isStoredBlobUrl("cv", blob("cv/hugo-viegas-cv-Ab12Cd34Ef56Gh78Ij90Kl12Mn34Op.pdf"))).toBe(true);
    expect(isStoredBlobUrl("profile", blob("profile/hugo-viegas-Ab12Cd34.webp"))).toBe(true);
    expect(isStoredBlobUrl("project", blob("projects/big-bang-duel/cover-Ab12.webp"))).toBe(true);
    expect(isStoredBlobUrl("cv", blob("profile/hugo-viegas-Ab12.pdf"))).toBe(false);
    expect(isStoredBlobUrl("profile", "https://evil.example.com/profile/a.webp")).toBe(false);
    expect(isStoredBlobUrl("profile", `http://${BLOB_STORE_HOST}/profile/a.webp`)).toBe(false);
    expect(isStoredBlobUrl("profile", blob("profile/a.webp?x=1"))).toBe(false);
    expect(isStoredBlobUrl("project", blob("projects/a/../b.webp"))).toBe(false);
  });
});
