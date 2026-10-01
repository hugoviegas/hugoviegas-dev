import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  resolveRouteHead,
  staticHeadFile,
  staticHeadRoutes,
} from "@/config/seo";
import { heroPreloadTag, injectRouteHead, stripHomeOnly } from "@/config/seoHtml";
import { getTranslation } from "@/config/translations";

const root = process.cwd();
const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf-8");
const vercel = JSON.parse(
  fs.readFileSync(path.join(root, "vercel.json"), "utf-8"),
) as { rewrites: { source: string; destination: string }[] };

const t = (key: string) => getTranslation(key, "EN");
const count = (html: string, pattern: RegExp) =>
  (html.match(pattern) ?? []).length;

describe("per-route static head", () => {
  it("covers every public route except the home page", () => {
    expect(staticHeadRoutes()).toEqual([
      "/projects/darcy-mcgees",
      "/projects/big-bang-duel",
      "/projects/big-bang-duel/story",
    ]);
  });

  it.each(staticHeadRoutes())("writes the route head for %s", (route) => {
    const head = resolveRouteHead(route, t);
    const html = injectRouteHead(indexHtml, head);

    expect(html).toContain(`<title>${head.title.replace(/&/g, "&amp;")}</title>`);
    expect(html).toContain(`<link rel="canonical" href="${head.url}" />`);
    expect(html).toContain(`<meta property="og:url" content="${head.url}" />`);
    expect(count(html, /<title>/g)).toBe(1);
    expect(count(html, /rel="canonical"/g)).toBe(1);
    expect(count(html, /name="description"/g)).toBe(1);
    expect(count(html, /property="og:title"/g)).toBe(1);
    expect(count(html, /property="og:url"/g)).toBe(1);

    const match = html.match(
      /<script id="route-breadcrumbs" type="application\/ld\+json">([\s\S]*?)<\/script>/,
    );
    const data = JSON.parse(match?.[1] ?? "{}");
    expect(data["@type"]).toBe("BreadcrumbList");
    expect(data.itemListElement.at(-1).item).toBe(head.url);
    // The SPA shell is untouched.
    expect(html).toContain('<div id="root">');
  });

  it("gives every route a distinct title, description, and canonical", () => {
    const heads = staticHeadRoutes().map((route) =>
      resolveRouteHead(route, t),
    );
    for (const field of ["title", "description", "canonical"] as const) {
      expect(new Set(heads.map((head) => head[field])).size).toBe(heads.length);
    }
  });

  it("points each route's rewrite at its generated file", () => {
    for (const route of staticHeadRoutes()) {
      const rewrite = vercel.rewrites.find((item) => item.source === route);
      expect(rewrite?.destination).toBe(`/${staticHeadFile(route).replace(/^\//, "")}`);
    }
  });

  it("keeps the handwritten home head in index.html in sync", () => {
    const home = resolveRouteHead("/", t);
    expect(indexHtml).toContain(`<title>${home.title}</title>`);
    expect(indexHtml).toContain(`content="${home.description}"`);
  });

  it("fails loudly when a head tag is missing", () => {
    const head = resolveRouteHead("/projects/darcy-mcgees", t);
    expect(() => injectRouteHead("<html><head></head></html>", head)).toThrow();
  });
});

describe("hero photo preload", () => {
  const url = "https://sb7cb98htp9acpqo.public.blob.vercel-storage.com/profile/hugo-viegas-Ab12.webp";
  const withPreload = indexHtml.replace("</head>", `  ${heroPreloadTag(url)}
  </head>`);

  it("is a high-priority image preload", () => {
    expect(heroPreloadTag(url)).toBe(
      `<link rel="preload" as="image" href="${url}" fetchpriority="high" data-home-only />`,
    );
    expect(heroPreloadTag('https://x/"><script>')).not.toContain("<script>");
  });

  it("stays on the home page only", () => {
    expect(stripHomeOnly(withPreload)).toBe(indexHtml);
    for (const route of staticHeadRoutes()) {
      const html = injectRouteHead(withPreload, resolveRouteHead(route, t));
      expect(html).not.toContain("data-home-only");
    }
  });
});
