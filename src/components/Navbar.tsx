import { useState, useEffect, useMemo } from "react";
import { ChevronDown, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

interface NavbarProps {
  show: boolean;
}

const Navbar = ({ show }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);

  const { t } = useLanguage();

  const projectLinks = useMemo(
    () => [
      { label: t("projectsMenuBigBangDuel"), href: "/projects/big-bang-duel" },
      { label: t("projectsMenuDarcy"), href: "/projects/darcy-mcgees" },
    ],
    [t],
  );

  const navItems = useMemo(() => {
    const orderedIds = ["about", "experience", "projects", "contact"];
    return orderedIds.map((id) => ({
      id,
      label: id === "projects" ? t("projects") : t(id),
    }));
  }, [t]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!show) {
    return null;
  }

  const scrollToSection = (sectionId: string) => {
    if (sectionId === "projects") {
      const projectsSection = document.getElementById("projects");
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = "/#projects";
      }
      setIsMobileMenuOpen(false);
      setIsProjectsOpen(false);
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const ids = navItems.map((n) => n.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { root: null, rootMargin: "-40% 0px -40% 0px", threshold: 0.1 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [navItems]);

  return (
    <>
      <div
        className={`fixed left-4 top-4 z-50 md:hidden transition-transform transition-opacity duration-500 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
        }`}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="pill-glass pointer-events-auto flex items-center gap-2 rounded-full p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-full"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? t("aria.closeMenu") : t("aria.openMenu")}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <img
                src="/obiwan_face.png"
                alt=""
                aria-hidden="true"
                className="h-5 w-5 rounded-full object-cover"
              />
            )}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed top-20 left-4 z-40 md:hidden">
          <div className="glass-card w-[90vw] max-w-[min(420px,92vw)] p-3">
            <div className="flex flex-col gap-2">
              {navItems.map((item) =>
                item.id === "projects" ? (
                  <div key={item.id} className="flex flex-col gap-2">
                    <button
                      onClick={() => setIsProjectsOpen((prev) => !prev)}
                      className={`nav-item w-full rounded-lg px-4 py-3 text-left text-muted-foreground transition-colors hover:bg-accent hover:text-primary ${
                        activeSection === item.id ? "active" : ""
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isProjectsOpen ? "rotate-180" : ""}`}
                        />
                      </span>
                    </button>
                    {isProjectsOpen && (
                      <div className="ml-3 flex flex-col gap-1 border-l border-border pl-3">
                        {projectLinks.map((link) => (
                          <Link
                            key={link.href}
                            to={link.href}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setIsProjectsOpen(false);
                            }}
                            className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-primary"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`nav-item w-full rounded-lg px-4 py-3 text-left text-muted-foreground transition-colors hover:bg-accent hover:text-primary ${
                      activeSection === item.id ? "active" : ""
                    }`}
                    aria-current={activeSection === item.id ? "page" : undefined}
                  >
                    {item.label}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      <div
        className={`hidden md:flex fixed left-0 right-0 top-16 z-50 justify-center pointer-events-none transition-transform transition-opacity duration-500 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
        }`}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="pill-glass pointer-events-auto flex items-center gap-6 rounded-2xl px-4 py-2">
          <div className="flex items-center gap-6 lg:gap-8 xl:gap-10">
            {navItems.map((item) =>
              item.id === "about" ? (
                <div key={item.id} className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-0"
                    aria-label={t("aria.backToTop")}
                  >
                    <img
                      src="/obiwan_face.png"
                      alt=""
                      aria-hidden="true"
                      className="h-4 w-4 rounded-full object-cover"
                    />
                  </button>

                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`nav-item min-w-[64px] px-3 py-2 text-muted-foreground transition-colors hover:text-primary lg:min-w-[84px] ${
                      activeSection === item.id ? "active" : ""
                    }`}
                    aria-current={activeSection === item.id ? "true" : undefined}
                  >
                    {item.label}
                  </button>
                </div>
              ) : item.id === "projects" ? (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => setIsProjectsOpen((prev) => !prev)}
                    className={`nav-item flex min-w-[60px] items-center gap-2 px-3 py-2 text-muted-foreground transition-colors hover:text-primary lg:min-w-[76px] lg:px-4 ${
                      activeSection === item.id ? "active" : ""
                    }`}
                    aria-expanded={isProjectsOpen}
                    aria-label={t("projectsMenuTitle")}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isProjectsOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isProjectsOpen && (
                    <div className="absolute left-0 top-full mt-3 min-w-[220px] rounded-2xl border border-border bg-card/95 p-2 shadow-xl backdrop-blur-sm">
                      {projectLinks.map((link) => (
                        <Link
                          key={link.href}
                          to={link.href}
                          onClick={() => setIsProjectsOpen(false)}
                          className="block rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`nav-item min-w-[60px] px-3 py-2 text-muted-foreground transition-colors hover:text-primary lg:min-w-[76px] lg:px-4 ${
                    activeSection === item.id ? "active" : ""
                  }`}
                  aria-current={activeSection === item.id ? "true" : undefined}
                >
                  {item.label}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
