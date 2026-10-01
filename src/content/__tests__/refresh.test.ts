import { beforeEach, describe, expect, it, vi } from "vitest";
import { decodeDocument } from "../rest";
import { buildSeed } from "../seed";
import { buildSnapshots, mergeCore } from "../snapshotBuild";
import type { CoreSnapshot } from "../types";
import { BLOB_STORE_HOST } from "../uploadPolicy";

const rest = vi.hoisted(() => ({
  getPublicDocument: vi.fn(),
  listPublished: vi.fn(),
}));
vi.mock("../rest", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../rest")>()),
  getPublicDocument: rest.getPublicDocument,
  listPublished: rest.listPublished,
}));

import { refreshCore } from "../refresh";
import { fetchSiteSettings, isNewer, shouldRefresh } from "../remoteCheck";

const seedCore = (): CoreSnapshot => buildSnapshots(buildSeed(), null, "seed").core;
const site = (updatedAt: string, useRemote = true) => ({
  useRemote,
  updatedAt,
  version: 1,
  cv: null,
  profilePhoto: null,
});
const cvUrl = `https://${BLOB_STORE_HOST}/cv/hugo-viegas-cv-Ab12Cd34.pdf`;
const photo = {
  url: `https://${BLOB_STORE_HOST}/profile/hugo-viegas-Ab12Cd34.webp`,
  width: 800,
  height: 800,
  alt: { en: "Hugo Viegas", ptBR: "Hugo Viegas" },
  version: 2,
};

beforeEach(() => {
  rest.getPublicDocument.mockReset();
  rest.listPublished.mockReset();
});

describe("decodeDocument", () => {
  it("decodes Firestore REST values and takes the id from the name", () => {
    expect(
      decodeDocument({
        name: "projects/p/databases/(default)/documents/skills/programming-react",
        fields: {
          published: { booleanValue: true },
          order: { integerValue: "80" },
          updatedAt: { timestampValue: "2026-10-01T12:00:00.123456Z" },
          en: { mapValue: { fields: { label: { stringValue: "React" } } } },
          tags: { arrayValue: { values: [{ stringValue: "a" }] } },
          empty: { arrayValue: {} },
          gone: { nullValue: null },
        },
      }),
    ).toEqual({
      id: "programming-react",
      published: true,
      order: 80,
      updatedAt: "2026-10-01T12:00:00.123Z",
      en: { label: "React" },
      tags: ["a"],
      empty: [],
      gone: null,
    });
  });
});

describe("remote check", () => {
  it("compares timestamps, treating a seed snapshot as oldest", () => {
    expect(isNewer("2026-10-02T00:00:00Z", null)).toBe(true);
    expect(isNewer("2026-10-02T00:00:00Z", "2026-10-01T00:00:00Z")).toBe(true);
    expect(isNewer("2026-10-01T00:00:00Z", "2026-10-01T00:00:00Z")).toBe(false);
    expect(isNewer(null, null)).toBe(false);
  });

  it("refreshes only when useRemote is on and settings are newer", () => {
    expect(shouldRefresh(null, null)).toBe(false);
    expect(shouldRefresh(site("2026-10-02T00:00:00.000Z", false), null)).toBe(false);
    expect(shouldRefresh(site("2026-10-02T00:00:00.000Z"), "2026-10-02T00:00:00.000Z")).toBe(false);
    expect(shouldRefresh(site("2026-10-02T00:00:00.000Z"), null)).toBe(true);
  });

  it("treats a missing or malformed settings doc as no remote content", async () => {
    rest.getPublicDocument.mockResolvedValueOnce(null);
    expect(await fetchSiteSettings()).toBeNull();
    rest.getPublicDocument.mockResolvedValueOnce({ id: "site", useRemote: "yes", version: 1 });
    expect(await fetchSiteSettings()).toBeNull();
    rest.getPublicDocument.mockResolvedValueOnce({ id: "site", ...site("2026-10-02T00:00:00.000Z") });
    expect(await fetchSiteSettings()).toEqual(site("2026-10-02T00:00:00.000Z"));
  });

  it("reads uploaded files and drops ones that are not from the Blob store", async () => {
    rest.getPublicDocument.mockResolvedValueOnce({
      ...site("2026-10-02T00:00:00.000Z"),
      cv: { url: cvUrl, version: 1 },
      profilePhoto: photo,
    });
    expect(await fetchSiteSettings()).toMatchObject({ cv: { url: cvUrl, version: 1 }, profilePhoto: photo });
    rest.getPublicDocument.mockResolvedValueOnce({
      ...site("2026-10-02T00:00:00.000Z"),
      cv: { url: "https://evil.example.com/cv/x.pdf", version: 1 },
      profilePhoto: { ...photo, alt: { en: "Hugo", ptBR: " " } },
    });
    expect(await fetchSiteSettings()).toMatchObject({ cv: null, profilePhoto: null });
  });

  it("propagates network errors so the caller keeps the snapshot", async () => {
    rest.getPublicDocument.mockRejectedValue(new Error("offline"));
    await expect(fetchSiteSettings()).rejects.toThrow("offline");
  });
});

describe("refreshCore", () => {
  it("swaps in newer docs, drops invalid ones, and keeps a collection that comes back empty", async () => {
    const current = seedCore();
    const edited = {
      ...current.experience[0],
      en: { ...current.experience[0].en, title: "Edited title" },
    };
    rest.listPublished.mockImplementation(async (collection: string) => {
      if (collection === "experience") return [edited, { id: "broken", published: true }];
      if (collection === "projects") return [];
      return current[collection as keyof CoreSnapshot] as unknown[];
    });
    const next = await refreshCore(current, site("2026-10-02T00:00:00.000Z"));
    expect(next.siteUpdatedAt).toBe("2026-10-02T00:00:00.000Z");
    expect(next.source).toBe("firestore");
    expect(next.experience.map((doc) => doc.id)).toEqual(["erin-college"]);
    expect(next.experience[0].en.title).toBe("Edited title");
    expect(next.projects).toEqual(current.projects);
  });

  it("takes the uploaded files from settings/site", async () => {
    rest.listPublished.mockResolvedValue([]);
    const current = seedCore();
    expect(current.files).toEqual({ cv: null, profilePhoto: null });
    const next = await refreshCore(current, {
      ...site("2026-10-02T00:00:00.000Z"),
      cv: { url: cvUrl, version: 3 },
      profilePhoto: photo,
    });
    expect(next.files).toEqual({ cv: { url: cvUrl, version: 3 }, profilePhoto: photo });
  });
});

describe("mergeCore", () => {
  it("sorts by order and drops drafts", () => {
    const current = seedCore();
    const [a, b] = current.education;
    const merged = mergeCore(
      current,
      { education: [{ ...a, order: 50 }, { ...b, published: false }, current.education[2]] },
      null,
      current.files,
    );
    expect(merged.education.map((doc) => doc.id)).toEqual(["unicnec", "cct-college"]);
  });
});
