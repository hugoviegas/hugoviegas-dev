import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { SITE_URL, getRouteSeo, normalizePath } from "@/config/seo";

const BREADCRUMB_SCRIPT_ID = "route-breadcrumbs";

const setMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
};

const removeElement = (selector: string) => {
  document.head.querySelector(selector)?.remove();
};

const setCanonical = (href: string | null) => {
  if (!href) {
    removeElement('link[rel="canonical"]');
    return;
  }
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
};

// Keeps title, description, canonical, Open Graph, robots, and breadcrumb
// structured data in sync with the current route and language.
const RouteSeo = () => {
  const { pathname } = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const path = normalizePath(pathname);
    const seo = getRouteSeo(path);
    const title = t(seo.titleKey);
    const description = t(seo.descriptionKey);
    const url = `${SITE_URL}${path === "/" ? "/" : path}`;

    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    if (seo.noindex) {
      setMeta("name", "robots", "noindex, nofollow");
      setCanonical(null);
    } else {
      removeElement('meta[name="robots"]');
      setCanonical(url);
    }

    removeElement(`#${BREADCRUMB_SCRIPT_ID}`);
    if (seo.breadcrumbs && !seo.noindex) {
      const script = document.createElement("script");
      script.id = BREADCRUMB_SCRIPT_ID;
      script.type = "application/ld+json";
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: seo.breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: t(crumb.nameKey),
          item: `${SITE_URL}${crumb.path}`,
        })),
      });
      document.head.appendChild(script);
    }
  }, [pathname, t]);

  return null;
};

export default RouteSeo;
