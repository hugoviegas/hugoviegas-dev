// Per-route head metadata. Titles and descriptions are translation keys.
import { ADMIN_PATH } from "./admin";

export const SITE_URL = "https://hugoviegas.dev";

export interface BreadcrumbEntry {
  nameKey: string;
  path: string;
}

export interface RouteSeoConfig {
  titleKey: string;
  descriptionKey: string;
  // Archived or non-portfolio routes: noindex and no canonical.
  noindex?: boolean;
  breadcrumbs?: BreadcrumbEntry[];
}

const HOME_CRUMB: BreadcrumbEntry = { nameKey: "seo.breadcrumbHome", path: "/" };

export const routeSeo: Record<string, RouteSeoConfig> = {
  "/": {
    titleKey: "seo.home.title",
    descriptionKey: "seo.home.description",
  },
  "/projects/darcy-mcgees": {
    titleKey: "seo.darcy.title",
    descriptionKey: "seo.darcy.description",
    breadcrumbs: [
      HOME_CRUMB,
      { nameKey: "darcyTitle", path: "/projects/darcy-mcgees" },
    ],
  },
  "/projects/big-bang-duel": {
    titleKey: "seo.bigBang.title",
    descriptionKey: "seo.bigBang.description",
    breadcrumbs: [
      HOME_CRUMB,
      { nameKey: "bigBangTitle", path: "/projects/big-bang-duel" },
    ],
  },
  "/projects/big-bang-duel/story": {
    titleKey: "seo.bigBangStory.title",
    descriptionKey: "seo.bigBangStory.description",
    breadcrumbs: [
      HOME_CRUMB,
      { nameKey: "bigBangTitle", path: "/projects/big-bang-duel" },
      { nameKey: "bigBangStoryTitle", path: "/projects/big-bang-duel/story" },
    ],
  },
  "/formula-d": {
    titleKey: "seo.formulaD.title",
    descriptionKey: "seo.archived.description",
    noindex: true,
  },
  "/lightsaber": {
    titleKey: "seo.lightsaber.title",
    descriptionKey: "seo.archived.description",
    noindex: true,
  },
  "/micro-falcon": {
    titleKey: "seo.microFalcon.title",
    descriptionKey: "seo.archived.description",
    noindex: true,
  },
  "/starship-demo": {
    titleKey: "seo.starship.title",
    descriptionKey: "seo.archived.description",
    noindex: true,
  },
  [ADMIN_PATH]: {
    titleKey: "seo.admin.title",
    descriptionKey: "seo.admin.description",
    noindex: true,
  },
};

export const notFoundSeo: RouteSeoConfig = {
  titleKey: "seo.notFound.title",
  descriptionKey: "notFound.description",
  noindex: true,
};

export const normalizePath = (pathname: string) =>
  pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

export const getRouteSeo = (pathname: string): RouteSeoConfig => {
  const path = normalizePath(pathname);
  // Every admin view shares the admin's noindex config.
  if (path.startsWith(`${ADMIN_PATH}/`)) return routeSeo[ADMIN_PATH];
  return routeSeo[path] ?? notFoundSeo;
};

export interface ResolvedBreadcrumb {
  name: string;
  url: string;
}

export interface ResolvedRouteHead {
  title: string;
  description: string;
  url: string;
  noindex: boolean;
  // Null for noindex routes, which carry no canonical.
  canonical: string | null;
  breadcrumbs: ResolvedBreadcrumb[];
}

// Single source for a route's head values. Used by the client (RouteSeo) and
// by the build step that writes per-route static HTML, so both stay in sync.
export const resolveRouteHead = (
  pathname: string,
  t: (key: string) => string,
): ResolvedRouteHead => {
  const path = normalizePath(pathname);
  const seo = getRouteSeo(path);
  const url = `${SITE_URL}${path}`;
  return {
    title: t(seo.titleKey),
    description: t(seo.descriptionKey),
    url,
    noindex: Boolean(seo.noindex),
    canonical: seo.noindex ? null : url,
    breadcrumbs: seo.noindex
      ? []
      : (seo.breadcrumbs ?? []).map((crumb) => ({
          name: t(crumb.nameKey),
          url: `${SITE_URL}${crumb.path}`,
        })),
  };
};

export const buildBreadcrumbJsonLd = (
  breadcrumbs: ResolvedBreadcrumb[],
): Record<string, unknown> | null =>
  breadcrumbs.length === 0
    ? null
    : {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: crumb.url,
        })),
      };

// Public routes other than "/" get a head-only HTML file at build time.
// "/" keeps the handwritten head in index.html.
export const staticHeadRoutes = (): string[] =>
  Object.entries(routeSeo)
    .filter(([path, config]) => path !== "/" && !config.noindex)
    .map(([path]) => path);

// Output path (relative to the build dir) and the rewrite destination.
export const staticHeadFile = (path: string) => `${normalizePath(path)}.html`;
