import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { buildBreadcrumbJsonLd, resolveRouteHead } from "@/config/seo";

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
    const head = resolveRouteHead(pathname, t);

    document.title = head.title;
    setMeta("name", "description", head.description);
    setMeta("property", "og:title", head.title);
    setMeta("property", "og:description", head.description);
    setMeta("property", "og:url", head.url);
    setMeta("name", "twitter:title", head.title);
    setMeta("name", "twitter:description", head.description);

    if (head.noindex) {
      setMeta("name", "robots", "noindex, nofollow");
    } else {
      removeElement('meta[name="robots"]');
    }
    setCanonical(head.canonical);

    removeElement(`#${BREADCRUMB_SCRIPT_ID}`);
    const breadcrumbs = buildBreadcrumbJsonLd(head.breadcrumbs);
    if (breadcrumbs) {
      const script = document.createElement("script");
      script.id = BREADCRUMB_SCRIPT_ID;
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(breadcrumbs);
      document.head.appendChild(script);
    }
  }, [pathname, t]);

  return null;
};

export default RouteSeo;
