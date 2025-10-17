import { useState, useEffect, useRef, useCallback } from "react";
import goldCoin2d from "@/assets/lego-bricks/gold-coin-2d.png";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface DynamicSidebarProps {
  show: boolean;
}

const DynamicSidebar = ({ show }: DynamicSidebarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentSection, setCurrentSection] = useState("hero");
  const [isHovered, setIsHovered] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  // section label popup removed per user request (no left-corner indicator)
  const sidebarRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [floatingPos, setFloatingPos] = useState({
    left: 0,
    top: 0,
    visible: false,
  });
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // detect tablet/desktop breakpoint (>= md) so we render the top bar instead of left sidebar
  useEffect(() => {
    const mq: MediaQueryList = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsTablet((e as MediaQueryList).matches);
    // initial
    setIsTablet(mq.matches);
    // add listener (cross-browser). Use try/catch to avoid incompatible signature issues
    try {
      // modern browsers
      mq.addEventListener("change", onChange as EventListener);
    } catch (e) {
      try {
        // legacy fallback - typed shim
        const legacy = mq as unknown as {
          addListener?: (cb: (e: MediaQueryListEvent) => void) => void;
        };
        if (legacy.addListener)
          legacy.addListener(onChange as (e: MediaQueryListEvent) => void);
      } catch (err) {
        // ignore
      }
    }

    return () => {
      try {
        mq.removeEventListener("change", onChange as EventListener);
      } catch (e) {
        try {
          const legacy = mq as unknown as {
            removeListener?: (cb: (e: MediaQueryListEvent) => void) => void;
          };
          if (legacy.removeListener)
            legacy.removeListener(onChange as (e: MediaQueryListEvent) => void);
        } catch (err) {
          // ignore
        }
      }
    };
  }, []);

  const { t } = useLanguage();

  // Get the current language to display proper "Me" text
  const getCurrentLanguage = useCallback(() => {
    try {
      const testTranslation = t("about");
      return testTranslation === "Sobre" ? "PT" : "EN";
    } catch {
      return "EN";
    }
  }, [t]);

  const navItems = [
    {
      id: "hero",
      label: getCurrentLanguage() === "PT" ? "Eu" : "Me",
      isHome: true,
    },
    { id: "experience", label: t("experience") },
    { id: "about", label: t("about") },
    { id: "projects", label: t("projects") },
    { id: "contact", label: t("contact") },
  ];

  // Enhanced section detection with better anchor positioning
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      const sections = ["hero", "experience", "about", "projects", "contact"];
      const sectionElements = sections.map((id) => document.getElementById(id));

      let current = "hero";

      // Check if we're at the very top
      if (window.scrollY < 50) {
        current = "hero";
      } else {
        // Find the section that's closest to the top of the viewport
        let closestSection = "hero";
        let closestDistance = Infinity;

        for (let i = 0; i < sectionElements.length; i++) {
          const section = sectionElements[i];
          if (section) {
            const rect = section.getBoundingClientRect();
            // Calculate distance from top of viewport (accounting for navbar height)
            const distanceFromTop = Math.abs(rect.top - 100); // 100px offset for navbar

            if (distanceFromTop < closestDistance && rect.top <= 200) {
              closestDistance = distanceFromTop;
              closestSection = sections[i];
            }
          }
        }
        current = closestSection;
      }

      // Trigger section change animation if section changed
      if (current !== currentSection) {
        setCurrentSection(current);
        // Note: section label popup removed intentionally
      }
    };

    // Use throttled scroll handling for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, [currentSection]);

  // Smooth scroll-based opacity calculation
  const calculateOpacity = useCallback(() => {
    const heroSection = document.getElementById("hero");
    if (!heroSection) return 1;

    const heroHeight = heroSection.offsetHeight;
    const maxScroll = heroHeight * 0.4; // Show earlier
    const fadeInRange = heroHeight * 0.2;

    if (scrollY < maxScroll) {
      return 0;
    } else if (scrollY < maxScroll + fadeInRange) {
      return (scrollY - maxScroll) / fadeInRange;
    } else {
      return 1;
    }
  }, [scrollY]);

  const scrollToSection = useCallback((sectionId: string) => {
    if (sectionId === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const offsetTop = element.offsetTop - 80; // Account for any fixed headers
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  }, []);

  // Compute position for floating icon based on active item
  const updateFloatingPosition = useCallback(() => {
    const container = sidebarRef.current;
    const activeEl = itemRefs.current[currentSection];
    if (!container || !activeEl) {
      setFloatingPos((pos) => ({ ...pos, visible: false }));
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const elRect = activeEl.getBoundingClientRect();
    const iconSize = 20; // px

    const left =
      elRect.left - containerRect.left + elRect.width / 2 - iconSize / 2;
    const top =
      elRect.top - containerRect.top + elRect.height / 2 - iconSize / 2;

    setFloatingPos({ left, top, visible: true });
  }, [currentSection]);

  useEffect(() => {
    // update when currentSection, hover, or layout changes
    updateFloatingPosition();
    const onResize = () => updateFloatingPosition();
    const onScroll = () => updateFloatingPosition();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [updateFloatingPosition, isHovered, isTablet]);

  const getCurrentSectionLabel = () => {
    const activeItem = navItems.find((item) => item.id === currentSection);
    return activeItem?.label || "";
  };

  const getCurrentSectionIcon = () => {
    const activeItem = navItems.find((item) => item.id === currentSection);
    if (!activeItem) return null;

    if (activeItem.isHome) {
      return (
        <img
          src="/obiwan_face.png"
          alt="Current section"
          className="w-5 h-5 rounded-full object-cover"
        />
      );
    } else {
      return (
        <img
          src={goldCoin2d}
          alt="Current section"
          className="w-5 h-5 object-contain"
        />
      );
    }
  };

  return (
    <>
      {/* Mobile floating menu button */}
      <div
        className={`fixed left-4 top-4 z-50 md:hidden transition-all duration-500 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`w-12 h-12 rounded-full sidebar-glass border border-border/30 shadow-lg transition-all duration-300 ${
            isMobileMenuOpen ? "rotate-90 scale-110" : "rotate-0 scale-100"
          }`}
          aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5 text-foreground" />
          ) : (
            <Menu className="w-5 h-5 text-foreground" />
          )}
        </Button>

        {/* Indicator ring when menu is open (non-interactive, no blink) */}
        {isMobileMenuOpen && (
          <div className="absolute inset-0 rounded-full border-2 border-primary/40 pointer-events-none" />
        )}
      </div>

      {/* Mobile floating sidebar */}
      <div
        className={`fixed left-4 top-20 z-40 md:hidden transition-all duration-500 ease-out ${
          isMobileMenuOpen
            ? "opacity-100 translate-x-0 scale-100"
            : "opacity-0 -translate-x-full scale-95"
        }`}
      >
        <div className="w-64 sidebar-glass rounded-2xl p-4 shadow-2xl border border-border/30">
          <div className="flex flex-col gap-2">
            {navItems.map((item, index) => {
              const isActive = currentSection === item.id;
              const isHome = item.isHome;

              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-accent/20 ${
                    isActive ? "bg-accent/30" : ""
                  }`}
                  style={{
                    transitionDelay: isMobileMenuOpen
                      ? `${index * 50}ms`
                      : "0ms",
                  }}
                >
                  <div className="flex items-center justify-center w-6 h-6">
                    {isHome ? (
                      <img
                        src="/obiwan_face.png"
                        alt="Obi-Wan"
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : isActive ? (
                      <img
                        src={goldCoin2d}
                        alt="Current section"
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/40 group-hover:bg-primary/60 transition-colors" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Active indicator for mobile */}
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop minimal sidebar - shows only current section icon by default. On tablet, render a top bar to avoid overlapping content */}
      {isTablet ? (
        <div
          className={`fixed top-3 left-4 right-4 z-50 flex justify-center transition-all duration-500`}
        >
          <div
            ref={sidebarRef}
            className="sidebar-glass rounded-full px-3 py-2 shadow-lg border border-border/20 flex items-center gap-2"
          >
            {navItems.map((item, index) => {
              const isActive = currentSection === item.id;
              const isHome = item.isHome;
              return (
                <button
                  key={item.id}
                  ref={(el) => (itemRefs.current[item.id] = el)}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-accent/6 ring-1 ring-primary/20"
                      : "hover:bg-accent/4"
                  }`}
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    {isHome ? (
                      <img
                        src="/obiwan_face.png"
                        className="w-5 h-5 rounded-full"
                        alt="Obi-Wan"
                      />
                    ) : isActive ? (
                      <img src={goldCoin2d} className="w-5 h-5" alt="coin" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          ref={sidebarRef}
          className={`hidden md:block fixed left-4 top-1/2 -translate-y-1/2 z-50 transition-all duration-700 ease-out ${
            mounted
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-full"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            opacity: show ? 1 : calculateOpacity(),
          }}
        >
          <div
            className={`relative sidebar-glass rounded-2xl shadow-2xl border border-border/20 transition-all duration-500 ease-out ${
              isHovered ? "scale-105 px-3 py-4" : "scale-100 px-3 py-3"
            }`}
          >
            {/* Collapsed state removed: current-section icon hidden by default (user requested) */}

            {/* Expanded state - show all sections with labels */}
            {isHovered && (
              <div className="flex flex-col gap-2">
                {navItems.map((item, index) => {
                  const isActive = currentSection === item.id;
                  const isHome = item.isHome;

                  return (
                    <div
                      key={item.id}
                      className="relative"
                      style={{
                        transitionDelay: `${index * 30}ms`,
                      }}
                    >
                      <button
                        onClick={() => scrollToSection(item.id)}
                        ref={(el) => (itemRefs.current[item.id] = el)}
                        className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-400 hover:bg-accent/20 ${
                          isActive ? "bg-accent/30" : ""
                        } w-full min-w-[120px]`}
                        aria-label={`Navigate to ${item.label}`}
                      >
                        {/* Icon */}
                        <div className="flex items-center justify-center w-6 h-6">
                          {isHome ? (
                            <img
                              src="/obiwan_face.png"
                              alt="Obi-Wan"
                              className="w-5 h-5 rounded-full object-cover transition-all duration-300"
                            />
                          ) : isActive ? (
                            <img
                              src={goldCoin2d}
                              alt="Current section"
                              className="w-5 h-5 object-contain transition-all duration-300"
                            />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-muted-foreground/40 group-hover:bg-primary/60 transition-all duration-300" />
                          )}
                        </div>

                        {/* Label */}
                        <span
                          className={`text-sm font-medium transition-all duration-300 ${
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground group-hover:text-foreground"
                          }`}
                        >
                          {item.label}
                        </span>

                        {/* Active indicator - replaced with subtle outline */}
                        {isActive && (
                          <div className="absolute inset-0 rounded-xl ring-1 ring-primary/30 pointer-events-none transition-all duration-300" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Floating icon removed per request (no current-section indicator in collapsed sidebar) */}

            {/* Decorative elements */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary/8 rounded-full blur-sm" />
            <div
              className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-accent/8 rounded-full blur-sm"
              style={{ opacity: 0.6 }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DynamicSidebar;
