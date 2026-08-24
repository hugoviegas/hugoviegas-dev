import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  const handleClick = () => {
    const targetTheme = theme === "light" ? "dark" : "light";
    setTheme(targetTheme);
  };

  const isDark = theme === "dark";

  return (
    // keep the Button wrapper and sizing for parity with TopControls
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      aria-label={t("toggleTheme")}
      className="h-11 w-11 rounded-full hover:bg-accent/10 transition-colors"
    >
      <span className="sr-only">{t("toggleTheme")}</span>

      {/* Animated toggle built from CSS (scoped with tp- prefix to avoid collisions) */}
      <div className={`tp-toggle ${isDark ? "tp-dark" : "tp-light"}`}>
        <div className="tp-slider">
          <div className="tp-sun">
            <div className="tp-sun-rays">
              <div className="tp-ray" />
              <div className="tp-ray" />
              <div className="tp-ray" />
              <div className="tp-ray" />
              <div className="tp-ray" />
              <div className="tp-ray" />
              <div className="tp-ray" />
              <div className="tp-ray" />
            </div>
            <div className="tp-sun-circle" />
          </div>

          <div className="tp-moon">
            <div className="tp-moon-crater tp-crater1" />
            <div className="tp-moon-crater tp-crater2" />
            <div className="tp-moon-crater tp-crater3" />
          </div>
        </div>
      </div>
    </Button>
  );
}
