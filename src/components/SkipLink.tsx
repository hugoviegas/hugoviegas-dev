import type { MouseEvent } from "react";
import { useLanguage } from "@/hooks/useLanguage";

export const MAIN_CONTENT_ID = "main-content";

// First focusable element on every page; moves focus past the navigation.
const SkipLink = () => {
  const { t } = useLanguage();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(MAIN_CONTENT_ID);
    if (!target) return;
    event.preventDefault();
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: "start" });
  };

  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1000] focus:rounded-md focus:bg-background focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-foreground focus:shadow-lg focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-ring"
    >
      {t("a11y.skipToContent")}
    </a>
  );
};

export default SkipLink;
