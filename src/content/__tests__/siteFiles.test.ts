import { describe, expect, it } from "vitest";
import { BLOB_STORE_HOST } from "@/content/uploadPolicy";
import { parseSiteFiles, pickSiteFiles } from "@/content/siteFiles";

const photo = (name: string) => ({
  url: `https://${BLOB_STORE_HOST}/profile/${name}-Ab12.webp`,
  width: 512,
  height: 512,
  alt: { en: "Hugo", ptBR: "Hugo" },
  version: 1,
});

describe("parseSiteFiles", () => {
  it("reads the minifigure and the first face", () => {
    const files = parseSiteFiles({ avatarMinifig: photo("hugo-minifig"), avatarFirst: "minifig" });
    expect(files.avatarMinifig?.url).toContain("/profile/hugo-minifig-Ab12.webp");
    expect(files.avatarFirst).toBe("minifig");
  });

  it("falls back to the photo first and no minifigure", () => {
    expect(parseSiteFiles({})).toEqual({ cv: null, profilePhoto: null, avatarMinifig: null, avatarFirst: "photo" });
    const files = parseSiteFiles({ avatarFirst: "lego", avatarMinifig: { ...photo("x"), url: "https://example.com/x.webp" } });
    expect(files.avatarFirst).toBe("photo");
    expect(files.avatarMinifig).toBeNull();
  });
});

describe("pickSiteFiles", () => {
  it("keeps only the file fields, defaulting the new ones", () => {
    const site = { cv: null, profilePhoto: photo("hugo"), useRemote: true } as unknown as Parameters<typeof pickSiteFiles>[0];
    expect(pickSiteFiles(site)).toEqual({ cv: null, profilePhoto: photo("hugo"), avatarMinifig: null, avatarFirst: "photo" });
  });
});
