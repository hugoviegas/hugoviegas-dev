import { useState, useEffect, useCallback, useMemo } from "react";
import goldCoin2d from "@/assets/lego-bricks/gold-coin-2d.webp";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

interface NavItem {
  id: string;
  label: string;
  isHome?: boolean;
}

interface ProjectLink {
  label: string;
  href: string;
}

interface NavItemButtonProps {
  item: NavItem;
  isActive: boolean;
  variant: "mobile" | "desktop";
  onClick: () => void;
  ariaLabel?: string;
}

const NavItemButton = ({ item, isActive, variant, onClick, ariaLabel }: NavItemButtonProps) => {
  const isHome = item.isHome;

  if (variant === "mobile") {
    return (
      <button
        onClick={onClick}
        aria-current={isActive ? "page" : undefined}
        aria-label={ariaLabel}
        className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-accent/20 ${
          isActive ? "bg-accent/30" : ""
        }`}
      >
        <div className="flex items-center justify-center w-6 h-6">
          {isHome ? (
            <img src="/obiwan_face.png" alt="" aria-hidden="true" className="w-5 h-5 rounded-full object-cover" />
          ) : isActive ? (
            <img src={goldCoin2d} alt="" aria-hidden="true" className="w-5 h-5 object-contain" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-muted-foreground/40 group-hover:bg-primary/60 transition-colors" />
          )}
        </div>
        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {item.label}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      aria-label={ariaLabel}
      className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
        isActive ? "bg-accent/6 ring-1 ring-primary/20" : "hover:bg-accent/4"
      }`}
    >
      <div className="w-6 h-6 flex items-center justify-center">
        {isHome ? (
          <img src="/obiwan_face.png" className="w-5 h-5 rounded-full" alt="" aria-hidden="true" />
        ) : isActive ? (
          <img src={goldCoin2d} className="w-5 h-5" alt="" aria-hidden="true" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
        )}
      </div>
      <span className={`text-sm font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
        {item.label}
      </span>
    </button>
  );
};

interface ProjectsMenuProps {
  variant: "mobile" | "desktop";
  isOpen: boolean;
  isActive: boolean;
  label: string;
  links: ProjectLink[];
  menuId: string;
  onToggle: () => void;
  onSelect: () => void;
}

const ProjectsMenu = ({ variant, isOpen, isActive, label, links, menuId, onToggle, onSelect }: ProjectsMenuProps) => {
  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onToggle}
          aria-haspopup="menu"
          aria-controls={menuId}
          aria-expanded={isOpen}
          aria-current={isActive ? "page" : undefined}
          className={`group flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-accent/20 ${
            isActive ? "bg-accent/30" : ""
          }`}
        >
          <span className="flex items-center gap-3">
            <img src={goldCoin2d} alt="" aria-hidden="true" className="w-5 h-5 object-contain" />
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">{label}</span>
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
        {isOpen && (
          <div id={menuId} role="menu" aria-label={label} className="ml-3 flex flex-col gap-1 border-l border-border pl-3">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                role="menuitem"
                onClick={onSelect}
                className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
          isActive ? "bg-accent/6 ring-1 ring-primary/20" : "hover:bg-accent/4"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label={label}
        aria-current={isActive ? "page" : undefined}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <img src={goldCoin2d} className="w-5 h-5" alt="" aria-hidden="true" />
        </div>
        <span className={`text-sm font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute left-0 top-full mt-3 min-w-[220px] rounded-2xl border border-border bg-card/95 p-2 shadow-xl backdrop-blur-sm"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              role="menuitem"
              onClick={onSelect}
              className="block rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const DynamicSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileProjectsOpen, setIsMobileProjectsOpen] = useState(false);
  const [isDesktopProjectsOpen, setIsDesktopProjectsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentSection, setCurrentSection] = useState("hero");
  const mobileProjectMenuId = "projects-menu-mobile";
  const desktopProjectMenuId = "projects-menu-desktop";

  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileProjectsOpen(false);
        setIsDesktopProjectsOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const projectLinks = useMemo(
    () => [
      { label: t("projectsMenuBigBangDuel"), href: "/projects/big-bang-duel" },
      { label: t("projectsMenuDarcy"), href: "/projects/darcy-mcgees" },
    ],
    [t],
  );

  const navItems = useMemo(
    () => [
      { id: "hero", label: t("nav.me"), isHome: true },
      { id: "experience", label: t("experience") },
      { id: "about", label: t("about") },
      { id: "projects", label: t("projectsMenuTitle") },
      { id: "contact", label: t("contact") },
    ],
    [t],
  );

  // Section-spy: only meaningful on the homepage where these ids exist
  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const sections = ["hero", "experience", "about", "projects", "contact"];
      const sectionElements = sections.map((id) => document.getElementById(id));

      let current = "hero";
      if (window.scrollY < 50) {
        current = "hero";
      } else {
        let closestSection = "hero";
        let closestDistance = Infinity;

        sectionElements.forEach((section, i) => {
          if (section) {
            const rect = section.getBoundingClientRect();
            const distanceFromTop = Math.abs(rect.top - 100);
            if (distanceFromTop < closestDistance && rect.top <= 200) {
              closestDistance = distanceFromTop;
              closestSection = sections[i];
            }
          }
        });
        current = closestSection;
      }

      setCurrentSection((prev) => (prev !== current ? current : prev));
    };

    let ticking = false;
    let rafId: number | null = null;
    const throttledHandleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isHomePage]);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      if (sectionId === "hero") {
        if (isHomePage) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          navigate("/");
        }
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop - 80;
          window.scrollTo({ top: offsetTop, behavior: "smooth" });
        } else {
          navigate(`/#${sectionId}`);
        }
      }
      setIsMobileMenuOpen(false);
    },
    [isHomePage, navigate],
  );

  return (
    <nav aria-label={t("aria.mainNavigation")} className="contents">
      {/* Mobile floating menu button */}
      <div
        className={`fixed left-2 sm:left-4 top-3 sm:top-4 z-50 md:hidden transition-all duration-500 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsMobileMenuOpen((prev) => !prev);
            setIsMobileProjectsOpen(false);
          }}
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full sidebar-glass border border-border/30 shadow-lg transition-all duration-300 ${
            isMobileMenuOpen ? "rotate-90 scale-110" : "rotate-0 scale-100"
          }`}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? t("aria.closeMenu") : t("aria.openMenu")}
        >
          {isMobileMenuOpen ? (
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
          ) : (
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
          )}
        </Button>
      </div>

      {/* Mobile floating menu */}
      <div
        aria-hidden={!isMobileMenuOpen}
        className={`fixed left-2 sm:left-4 top-16 sm:top-20 z-40 md:hidden transition-all duration-500 ease-out ${
          isMobileMenuOpen
            ? "opacity-100 translate-x-0 scale-100"
            : "opacity-0 -translate-x-full scale-95 pointer-events-none"
        }`}
      >
        <div className="w-56 sm:w-64 sidebar-glass rounded-2xl p-3 sm:p-4 shadow-2xl border border-border/30">
          <div className="flex flex-col gap-1.5 sm:gap-2">
            {navItems.map((item) => {
              const isActive = isHomePage && currentSection === item.id;

              if (item.id === "projects") {
                return (
                  <ProjectsMenu
                    key={item.id}
                    variant="mobile"
                    isOpen={isMobileProjectsOpen}
                    isActive={isActive}
                    label={item.label}
                    links={projectLinks}
                    menuId={mobileProjectMenuId}
                    onToggle={() => setIsMobileProjectsOpen((prev) => !prev)}
                    onSelect={() => {
                      setIsMobileMenuOpen(false);
                      setIsMobileProjectsOpen(false);
                    }}
                  />
                );
              }

              return (
                <NavItemButton
                  key={item.id}
                  item={item}
                  isActive={isActive}
                  variant="mobile"
                  onClick={() => scrollToSection(item.id)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop top bar */}
      <div
        className={`hidden md:flex fixed top-3 left-4 right-4 z-50 justify-center transition-all duration-500 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
        }`}
      >
        <div className="sidebar-glass rounded-full px-3 py-2 shadow-lg border border-border/20 flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = isHomePage && currentSection === item.id;

            if (item.id === "projects") {
              return (
                <ProjectsMenu
                  key={item.id}
                  variant="desktop"
                  isOpen={isDesktopProjectsOpen}
                  isActive={isActive}
                  label={item.label}
                  links={projectLinks}
                  menuId={desktopProjectMenuId}
                  onToggle={() => setIsDesktopProjectsOpen((prev) => !prev)}
                  onSelect={() => setIsDesktopProjectsOpen(false)}
                />
              );
            }

            return (
              <NavItemButton
                key={item.id}
                item={item}
                isActive={isActive}
                variant="desktop"
                onClick={() => scrollToSection(item.id)}
                ariaLabel={item.isHome ? `${item.label}: ${t("aria.backToTop")}` : undefined}
              />
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default DynamicSidebar;
