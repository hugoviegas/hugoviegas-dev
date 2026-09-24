import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface NavbarProps {
  show: boolean;
}

const Navbar = ({ show }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // language hook + nav items (memoized so effects can depend on stable ref)
  const { t } = useLanguage();

  const navItems = useMemo(
    () => [
      { id: "about", label: t("about") },
      { id: "projects", label: t("projects") },
      { id: "experience", label: t("experience") },
      { id: "contact", label: t("contact") },
    ],
    [t]
  );

  useEffect(() => {
    // trigger entrance animation once on mount
    setMounted(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  // track active section for nav highlighting (desktop + mobile)
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

  // ...existing code...

  // always render the navbar; entrance animation will run on mount

  return (
    <>
      {/* Mobile hamburger fixed to the left with the same pill style as TopControls */}
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
            aria-label={
              isMobileMenuOpen ? t("aria.closeMenu") : t("aria.openMenu")
            }
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

      {/* Mobile dropdown panel (left-aligned under the hamburger) */}
      {isMobileMenuOpen && (
        <div className="fixed top-20 left-4 z-40 md:hidden">
          <div className="glass-card w-[90vw] max-w-[min(420px,92vw)] p-3">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
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
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Centered rounded rectangle similar to TopControls (desktop only) */}
      <div
        className={`hidden md:flex fixed left-0 right-0 top-16 z-50 justify-center pointer-events-none transition-transform transition-opacity duration-500 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
        }`}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="pill-glass pointer-events-auto flex items-center gap-6 rounded-2xl px-4 py-2">
          {/* Desktop nav */}
          <div className="flex items-center gap-6 lg:gap-8 xl:gap-10">
            {navItems.map((item) =>
              item.id === "about" ? (
                <div key={item.id} className="flex items-center gap-3">
                  {/* clickable icon that scrolls to top */}
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
