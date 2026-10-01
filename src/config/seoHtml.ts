// Build-time head rewriting for per-route static HTML. No DOM or Node APIs, so
// it runs from vite.config.ts and from tests.
import { buildBreadcrumbJsonLd, type ResolvedRouteHead } from "./seo";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const replaceOnce = (html: string, pattern: RegExp, replacement: string) => {
  if (!pattern.test(html)) {
    throw new Error(`Static head: tag not found in index.html (${pattern})`);
  }
  // A function replacer keeps "$" in titles and descriptions literal.
  return html.replace(pattern, () => replacement);
};

const metaPattern = (attr: "name" | "property", key: string) =>
  new RegExp(`<meta\\s+${attr}="${key}"[\\s\\S]*?/>`);

const metaTag = (attr: "name" | "property", key: string, content: string) =>
  `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`;

// Head tags only the homepage needs (the hero photo preload). Pages built
// from index.html for other routes drop them.
const HOME_ONLY = /\n?[ \t]*<link [^>]*data-home-only[^>]*>/g;

export const stripHomeOnly = (html: string) => html.replace(HOME_ONLY, "");

export const heroPreloadTag = (url: string) =>
  `<link rel="preload" as="image" href="${escapeHtml(url)}" fetchpriority="high" data-home-only />`;

// Rewrites the head of the built index.html for one route. The body is left
// untouched so the SPA boots as usual.
export const injectRouteHead = (html: string, head: ResolvedRouteHead) => {
  let out = stripHomeOnly(html);
  out = replaceOnce(
    out,
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtml(head.title)}</title>`,
  );
  out = replaceOnce(
    out,
    metaPattern("name", "description"),
    metaTag("name", "description", head.description),
  );
  out = replaceOnce(
    out,
    metaPattern("property", "og:title"),
    metaTag("property", "og:title", head.title),
  );
  out = replaceOnce(
    out,
    metaPattern("property", "og:description"),
    metaTag("property", "og:description", head.description),
  );
  out = replaceOnce(
    out,
    metaPattern("property", "og:url"),
    metaTag("property", "og:url", head.url),
  );
  out = replaceOnce(
    out,
    metaPattern("name", "twitter:title"),
    metaTag("name", "twitter:title", head.title),
  );
  out = replaceOnce(
    out,
    metaPattern("name", "twitter:description"),
    metaTag("name", "twitter:description", head.description),
  );

  const extras: string[] = [];
  if (head.canonical) {
    extras.push(`<link rel="canonical" href="${escapeHtml(head.canonical)}" />`);
  }
  const breadcrumbs = buildBreadcrumbJsonLd(head.breadcrumbs);
  if (breadcrumbs) {
    // "<" is escaped so a title can never close the script element.
    const json = JSON.stringify(breadcrumbs).replace(/</g, "\\u003c");
    extras.push(
      `<script id="route-breadcrumbs" type="application/ld+json">${json}</script>`,
    );
  }
  return replaceOnce(out, /<\/head>/, `${extras.join("\n    ")}\n  </head>`);
};
