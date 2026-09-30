// Per-route head metadata. Titles and descriptions are translation keys.
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
};

export const notFoundSeo: RouteSeoConfig = {
  titleKey: "seo.notFound.title",
  descriptionKey: "notFound.description",
  noindex: true,
};

export const normalizePath = (pathname: string) =>
  pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

export const getRouteSeo = (pathname: string): RouteSeoConfig =>
  routeSeo[normalizePath(pathname)] ?? notFoundSeo;
