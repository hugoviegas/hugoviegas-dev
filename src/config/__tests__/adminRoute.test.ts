import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ADMIN_PATH } from "@/config/admin";
import { getRouteSeo, staticHeadRoutes } from "@/config/seo";

const root = process.cwd();
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf-8");
const vercel = JSON.parse(read("vercel.json")) as {
  rewrites: { source: string; destination: string }[];
  headers: { source: string; headers: { key: string; value: string }[] }[];
};

describe("hidden admin route", () => {
  it("uses an unguessable slug", () => {
    expect(ADMIN_PATH).toMatch(/^\/admin-[0-9a-f]{16}$/);
  });

  it("is rewritten to the SPA shell on Vercel", () => {
    expect(vercel.rewrites).toContainEqual({
      source: ADMIN_PATH,
      destination: "/index.html",
    });
  });

  it("sends X-Robots-Tag noindex, nofollow", () => {
    const entry = vercel.headers.find((h) => h.source === ADMIN_PATH);
    expect(entry?.headers).toContainEqual({
      key: "X-Robots-Tag",
      value: "noindex, nofollow",
    });
  });

  it("is noindex and gets no static head page", () => {
    expect(getRouteSeo(ADMIN_PATH).noindex).toBe(true);
    expect(staticHeadRoutes()).not.toContain(ADMIN_PATH);
  });

  it("is absent from the sitemap, robots.txt, and index.html", () => {
    for (const file of ["public/sitemap.xml", "public/robots.txt", "index.html"]) {
      expect(read(file)).not.toContain("admin");
    }
  });
});
