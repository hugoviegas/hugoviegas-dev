import { ADMIN_PATH } from "@/config/admin";
import type { ContentCollection } from "@/content/types";

// Every admin view has its own address under the private slug, so a reload or
// a bookmark returns to the same section and item. Pure helpers, no React.

export type AdminSection = "overview" | ContentCollection | "files" | "settings";

export type CollectionView =
  | { view: "list" }
  | { view: "new" }
  | { view: "edit"; id: string }
  | { view: "history"; id: string };

export type AdminLocation =
  | { section: "overview" | "files" | "settings" | "notFound" }
  | ({ section: ContentCollection } & CollectionView);

// URL segment per collection. "projectDetails" reads better as "project-pages".
export const COLLECTION_SLUGS: Record<ContentCollection, string> = {
  experience: "experience",
  education: "education",
  projects: "projects",
  projectDetails: "project-pages",
  skills: "skills",
  about: "about",
};

const bySlug = Object.fromEntries(
  Object.entries(COLLECTION_SLUGS).map(([name, slug]) => [slug, name as ContentCollection]),
) as Record<string, ContentCollection>;

// The single About doc. Only the first about doc is rendered on the site.
export const ABOUT_DOC_ID = "main";

const ID_PATTERN = /^[a-z0-9-]{1,100}$/;

export const isAdminPath = (pathname: string) =>
  pathname === ADMIN_PATH || pathname.startsWith(`${ADMIN_PATH}/`);

export const parseAdminPath = (pathname: string): AdminLocation => {
  if (!isAdminPath(pathname)) return { section: "notFound" };
  const parts = pathname
    .slice(ADMIN_PATH.length)
    .split("/")
    .filter(Boolean)
    .map((part) => decodeURIComponent(part));
  if (parts.length === 0) return { section: "overview" };
  const [first, second, third, ...rest] = parts;
  if (rest.length > 0) return { section: "notFound" };
  if (first === "files" || first === "settings") {
    return second ? { section: "notFound" } : { section: first };
  }
  const collection = bySlug[first];
  if (!collection) return { section: "notFound" };
  if (collection === "about") {
    if (!second) return { section: "about", view: "edit", id: ABOUT_DOC_ID };
    if (second === "history" && !third) return { section: "about", view: "history", id: ABOUT_DOC_ID };
    return { section: "notFound" };
  }
  if (!second) return { section: collection, view: "list" };
  if (second === "new" && !third) return { section: collection, view: "new" };
  if (!ID_PATTERN.test(second)) return { section: "notFound" };
  if (!third) return { section: collection, view: "edit", id: second };
  if (third === "history") return { section: collection, view: "history", id: second };
  return { section: "notFound" };
};

export const adminHref = (location: AdminLocation): string => {
  switch (location.section) {
    case "overview":
    case "notFound":
      return ADMIN_PATH;
    case "files":
    case "settings":
      return `${ADMIN_PATH}/${location.section}`;
    default: {
      const base = `${ADMIN_PATH}/${COLLECTION_SLUGS[location.section]}`;
      if (location.section === "about") {
        return location.view === "history" ? `${base}/history` : base;
      }
      switch (location.view) {
        case "list":
          return base;
        case "new":
          return `${base}/new`;
        case "edit":
          return `${base}/${encodeURIComponent(location.id)}`;
        case "history":
          return `${base}/${encodeURIComponent(location.id)}/history`;
      }
    }
  }
};

export const sectionOf = (location: AdminLocation): AdminSection | "notFound" => location.section;
