import { useEffect, useState } from "react";

// Homepage section spy. Reports the section crossing the middle band of the
// viewport; falls back to the first id near the top of the page.
export function useActiveSection(ids: readonly string[], enabled = true) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join("|");

  useEffect(() => {
    if (!enabled) return;
    const list = key.split("|");
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    // Sections can mount after the nav (lazy content), so retry briefly.
    const observed = new Set<string>();
    const attach = () => {
      list.forEach((id) => {
        if (observed.has(id)) return;
        const el = document.getElementById(id);
        if (el) {
          observer.observe(el);
          observed.add(id);
        }
      });
    };
    attach();
    let attempts = 0;
    const retry = window.setInterval(() => {
      attach();
      attempts += 1;
      if (observed.size === list.length || attempts > 20) window.clearInterval(retry);
    }, 500);

    const onTop = () => {
      if (window.scrollY < 40) setActive(list[0]);
    };
    window.addEventListener("scroll", onTop, { passive: true });

    return () => {
      observer.disconnect();
      window.clearInterval(retry);
      window.removeEventListener("scroll", onTop);
    };
  }, [key, enabled]);

  return active;
}
