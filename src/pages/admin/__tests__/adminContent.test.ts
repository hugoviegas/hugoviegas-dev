import { beforeEach, describe, expect, it, vi } from "vitest";
import { BLOB_STORE_HOST } from "@/content/uploadPolicy";

// Records each batch write; the rules themselves are checked in the Playground.
const fs = vi.hoisted(() => ({
  writes: [] as { op: string; path: string; data?: Record<string, unknown> }[],
}));
vi.mock("firebase/firestore/lite", () => {
  class Timestamp {}
  return {
    Timestamp,
    collection: (_db: unknown, name: string) => ({ path: name }),
    doc: (parent: { path?: string } | unknown, ...segments: string[]) => ({
      path: segments.length
        ? segments.join("/")
        : `${(parent as { path: string }).path}/<auto>`,
    }),
    serverTimestamp: () => "<server time>",
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    writeBatch: () => ({
      set: (ref: { path: string }, data: Record<string, unknown>) =>
        fs.writes.push({ op: "set", path: ref.path, data }),
      delete: (ref: { path: string }) => fs.writes.push({ op: "delete", path: ref.path }),
      commit: async () => undefined,
    }),
  };
});
vi.mock("../firebase", () => ({ getFirebase: () => ({ db: {} }) }));

import { saveContentDoc, saveSettings, saveSiteFiles, type ExistingSettings } from "../adminContent";

const cv = { url: `https://${BLOB_STORE_HOST}/cv/hugo-viegas-cv-Ab12.pdf`, version: 2 };
const profilePhoto = {
  url: `https://${BLOB_STORE_HOST}/profile/hugo-viegas-Ab12.webp`,
  width: 800,
  height: 800,
  alt: { en: "Hugo", ptBR: "Hugo" },
  version: 1,
};
const settings: ExistingSettings = {
  useRemote: true,
  version: 7,
  updatedAt: null,
  cv,
  profilePhoto,
  avatarMinifig: null,
  avatarFirst: "photo",
  data: { useRemote: true, version: 7, cv, profilePhoto },
};
const siteWrite = () => fs.writes.find((write) => write.path === "settings/site")?.data;

beforeEach(() => {
  fs.writes.length = 0;
});

describe("settings/site writes", () => {
  it("keep the uploaded files when a content doc is saved", async () => {
    await saveContentDoc("skills", { id: "x", published: false, order: 0, updatedAt: null, version: 0 }, null, settings);
    expect(siteWrite()).toEqual({ useRemote: true, updatedAt: "<server time>", version: 8, cv, profilePhoto });
  });

  it("keep the uploaded files when useRemote changes", async () => {
    await saveSettings(false, settings);
    expect(siteWrite()).toMatchObject({ useRemote: false, version: 8, cv, profilePhoto });
    expect(fs.writes[0]).toMatchObject({ path: "contentHistory/<auto>", data: { collection: "settings", version: 7 } });
  });

  it("replace one file, and drop a file set to null", async () => {
    const next = { ...cv, url: cv.url.replace("Ab12", "Cd34"), version: 3 };
    await saveSiteFiles({ cv: next }, settings);
    expect(siteWrite()).toMatchObject({ cv: next, profilePhoto });

    fs.writes.length = 0;
    await saveSiteFiles({ profilePhoto: null }, settings);
    expect(siteWrite()).toEqual({ useRemote: true, updatedAt: "<server time>", version: 8, cv });
  });

  it("store no file fields when none were uploaded", async () => {
    await saveSettings(true, { ...settings, cv: null, profilePhoto: null, data: {} });
    expect(Object.keys(siteWrite()!)).toEqual(["useRemote", "updatedAt", "version"]);
  });

  it("store the minifigure and the first face only when set", async () => {
    const minifig = { ...profilePhoto, url: profilePhoto.url.replace("hugo", "minifig") };
    await saveSiteFiles({ avatarMinifig: minifig, avatarFirst: "minifig" }, settings);
    expect(siteWrite()).toMatchObject({ cv, profilePhoto, avatarMinifig: minifig, avatarFirst: "minifig" });

    fs.writes.length = 0;
    await saveSiteFiles({ avatarFirst: "photo" }, { ...settings, avatarMinifig: minifig, avatarFirst: "minifig" });
    expect(siteWrite()).toEqual({ useRemote: true, updatedAt: "<server time>", version: 8, cv, profilePhoto, avatarMinifig: minifig });
  });
});
