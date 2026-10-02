import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useActiveSection } from "@/hooks/useActiveSection";
import { CoinMarker, NavDot } from "@/components/brand/CoinMarker";
import { cn } from "@/lib/utils";
import bigBangImage from "@/assets/project-big-bang-duel.webp";
import darcyImage from "@/assets/project-darcy-mcgees.webp";

// Global navigation.
// Desktop (lg+): a floating pill. "Me" shows the Obi-Wan face; every other
// item shows a gold coin when active and a neutral dot otherwise.
// Below lg: a floating bottom pill shows only the current section and opens
// a compact section sheet.

const SECTION_IDS = ["hero", "projects", "experience", "skills", "about", "contact"] as const;
type SectionId = (typeof SECTION_IDS)[number];

const NAV_IDS: SectionId[] = ["hero", "projects", "experience", "about", "contact"];

const sectionLabelKey: Record<SectionId, string> = {
  hero: "nav.me",
  projects: "projectsMenuTitle",
  experience: "experience",
  skills: "nav.skills",
  about: "about",
  contact: "contact",
};

const Marker = ({ id, active }: { id: SectionId; active: boolean }) => (
  <span aria-hidden="true" className="grid h-5 w-5 shrink-0 place-items-center">
    {id === "hero" ? (
      <img src="/obiwan_face.png" alt="" width={22} height={22} className="h-[22px] w-[22px] rounded-full object-cover" />
    ) : active ? (
      <CoinMarker className="animate-coin-in" />
    ) : (
      <NavDot />
    )}
  </span>
);

const itemClass = (active: boolean) =>
  cn(
    "inline-flex h-11 items-center gap-2 rounded-full pl-3 pr-4 text-[15px] font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card xl:pr-4 lg:pr-3",
    active ? "bg-primary-tint font-semibold text-foreground" : "text-ink-2 hover:bg-surface-2 hover:text-foreground",
  );

const DynamicSidebar = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const spied = useActiveSection(SECTION_IDS, isHomePage) as SectionId;
  const active: SectionId = isHomePage ? spied : location.pathname.startsWith("/projects") ? "projects" : "hero";
  const navActive: SectionId = active === "skills" ? "experience" : active;

  const [projectsOpen, setProjectsOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const projectsTrigger = useRef<HTMLButtonElement>(null);
  const projectsWrap = useRef<HTMLDivElement>(null);
  const sheetTrigger = useRef<HTMLButtonElement>(null);
  const sheetPanel = useRef<HTMLDivElement>(null);

  const projectLinks = useMemo(
    () => [
      { label: t("projectsMenuBigBangDuel"), kind: t("nav.projectTypeBigBang"), href: "/projects/big-bang-duel", image: bigBangImage },
      { label: t("projectsMenuDarcy"), kind: t("nav.projectTypeDarcy"), href: "/projects/darcy-mcgees", image: darcyImage },
    ],
    [t],
  );

  // Escape closes whichever menu is open and returns focus to its trigger.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setProjectsOpen((open) => {
        if (open) projectsTrigger.current?.focus();
        return false;
      });
      setSheetOpen((open) => {
        if (open) sheetTrigger.current?.focus();
        return false;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close the desktop submenu on an outside click.
  useEffect(() => {
    if (!projectsOpen) return;
    const onPointer = (event: PointerEvent) => {
      if (!projectsWrap.current?.contains(event.target as Node)) setProjectsOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [projectsOpen]);

  // Move focus into the sheet when it opens.
  useEffect(() => {
    if (sheetOpen) sheetPanel.current?.querySelector<HTMLElement>("a,button")?.focus();
  }, [sheetOpen]);

  const goToSection = useCallback(
    (event: React.MouseEvent, id: SectionId) => {
      event.preventDefault();
      setSheetOpen(false);
      setProjectsOpen(false);
      if (!isHomePage) {
        navigate(id === "hero" ? "/" : `/#${id}`);
        return;
      }
      if (id === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: "smooth" });
    },
    [isHomePage, navigate],
  );

  const href = (id: SectionId) => (id === "hero" ? "/" : `/#${id}`);
  const currentLabel = t(sectionLabelKey[active]);

  return (
    <>
      <nav
        aria-label={t("aria.mainNavigation")}
        className="pointer-events-none fixed inset-x-0 top-4 z-50 hidden justify-center px-6 lg:flex"
      >
        <ul className="pointer-events-auto flex items-center gap-0.5 rounded-full border border-border bg-card p-1.5 shadow-e3">
          {NAV_IDS.map((id) => {
            const isActive = navActive === id;
            if (id === "projects") {
              return (
                <li key={id} className="relative">
                  <div ref={projectsWrap}>
                    <button
                      ref={projectsTrigger}
                      type="button"
                      onClick={() => setProjectsOpen((open) => !open)}
                      aria-haspopup="menu"
                      aria-expanded={projectsOpen}
                      aria-controls="projects-menu"
                      aria-label={t(sectionLabelKey.projects)}
                      aria-current={isActive ? "location" : undefined}
                      className={itemClass(isActive)}
                    >
                      <Marker id={id} active={isActive} />
                      <span>{t(sectionLabelKey.projects)}</span>
                      <ChevronDown
                        aria-hidden="true"
                        className={cn("-ml-0.5 h-3.5 w-3.5 text-ink-3 transition-transform duration-base", projectsOpen && "rotate-180")}
                      />
                    </button>
                    {projectsOpen && (
                      <div
                        id="projects-menu"
                        role="menu"
                        aria-label={t(sectionLabelKey.projects)}
                        className="absolute left-[-8px] top-[calc(100%+10px)] w-[300px] rounded-lg border border-border bg-card p-2 shadow-e3 animate-sheet-in"
                      >
                        {projectLinks.map((link) => (
                          <Link
                            key={link.href}
                            to={link.href}
                            role="menuitem"
                            aria-label={link.label}
                            onClick={() => setProjectsOpen(false)}
                            className="flex min-h-14 items-center gap-3 rounded-md p-2 text-foreground hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <img src={link.image} alt="" width={56} height={42} loading="lazy" className="h-[42px] w-14 rounded-md bg-stage object-cover" />
                            <span>
                              <span className="block text-sm font-semibold">{link.label}</span>
                              <span className="block text-xs text-ink-3">{link.kind}</span>
                            </span>
                          </Link>
                        ))}
                        <a
                          href="/#projects"
                          role="menuitem"
                          onClick={(event) => goToSection(event, "projects")}
                          className="mt-1.5 block rounded-md border-t border-border px-2 pb-1 pt-2.5 text-sm font-semibold text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {t("nav.allProjects")}
                        </a>
                      </div>
                    )}
                  </div>
                </li>
              );
            }
            return (
              <li key={id}>
                <a
                  href={href(id)}
                  onClick={(event) => goToSection(event, id)}
                  aria-current={isActive ? "location" : undefined}
                  aria-label={id === "hero" ? `${t("nav.me")}: ${t("aria.backToTop")}` : undefined}
                  className={itemClass(isActive)}
                >
                  <Marker id={id} active={isActive} />
                  <span>{t(sectionLabelKey[id])}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile and tablet: bottom pill with the current section only */}
      <button
        ref={sheetTrigger}
        type="button"
        onClick={() => setSheetOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={sheetOpen}
        aria-label={`${t("nav.currentSection")}: ${currentLabel}. ${t("nav.openSections")}`}
        className="fixed bottom-[calc(20px+env(safe-area-inset-bottom))] left-4 right-[84px] z-40 flex h-14 items-center gap-2.5 rounded-full border border-border bg-card pl-4 pr-2.5 text-base font-semibold text-foreground shadow-e3 transition-transform duration-fast active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:left-1/2 sm:right-auto sm:min-w-[240px] sm:-translate-x-1/2 lg:hidden [@media(max-height:500px)]:bottom-3"
      >
        <span aria-hidden="true" className="grid h-5 w-5 place-items-center">
          {active === "hero" ? (
            <img src="/obiwan_face.png" alt="" width={22} height={22} className="h-[22px] w-[22px] rounded-full object-cover" />
          ) : (
            <CoinMarker className="h-[18px] w-[18px]" />
          )}
        </span>
        <span aria-hidden="true" className="h-5 flex-1 overflow-hidden text-left leading-5">
          <span key={active} className="block animate-label-up">
            {currentLabel}
          </span>
        </span>
        <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-surface-2">
          <ChevronUp className="h-4 w-4" />
        </span>
      </button>

      {sheetOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-labelledby="section-sheet-title">
          <div aria-hidden="true" className="absolute inset-0 bg-black/50" onClick={() => setSheetOpen(false)} />
          <div
            ref={sheetPanel}
            className="absolute inset-x-3 bottom-[calc(88px+env(safe-area-inset-bottom))] mx-auto max-h-[calc(100vh-110px)] max-w-[420px] overflow-auto rounded-[28px] border border-border bg-card p-2 shadow-e3 animate-sheet-in [@media(max-height:500px)]:bottom-20"
          >
            <div className="flex items-center justify-between py-1.5 pl-3.5 pr-1.5">
              <h2 id="section-sheet-title" className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-3">
                {t("nav.sections")}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setSheetOpen(false);
                  sheetTrigger.current?.focus();
                }}
                aria-label={t("aria.closeMenu")}
                className="grid h-11 w-11 place-items-center rounded-full hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <ul>
              {SECTION_IDS.map((id) => {
                const isActive = active === id;
                return (
                  <li key={id}>
                    <a
                      href={href(id)}
                      onClick={(event) => goToSection(event, id)}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "flex min-h-[52px] items-center gap-3 rounded-[20px] px-3.5 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isActive ? "bg-primary-tint font-bold" : "font-medium hover:bg-surface-2",
                      )}
                    >
                      <Marker id={id} active={isActive} />
                      <span>{t(sectionLabelKey[id])}</span>
                    </a>
                    {id === "projects" && (
                      <ul className="mb-1 ml-[46px] border-l border-border pl-3">
                        {projectLinks.map((link) => (
                          <li key={link.href}>
                            <Link
                              to={link.href}
                              onClick={() => setSheetOpen(false)}
                              className="flex min-h-11 items-center rounded-xl px-2 text-sm text-ink-2 hover:bg-surface-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default DynamicSidebar;
