import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useLanguage } from "@/hooks/useLanguage";

const TopControls = memo(() => {
  const { language, toggleLanguage, currentLanguage, t } = useLanguage();
  const [isToggling, setIsToggling] = useState(false);
  // Twemoji flag state + animation control
  const [liveFlag, setLiveFlag] = useState<"BR" | "IE" | "GB">(
    currentLanguage.code === "PT" ? "BR" : "IE"
  );
  const [animateGBtoIE, setAnimateGBtoIE] = useState(false);

  const handleToggle = () => {
    setIsToggling(true);
    // If switching to English, trigger GB->IE animation
    const switchingTo = language === "EN" ? "PT" : "EN";
    toggleLanguage();

    if (switchingTo === "EN") {
      // Immediately show GB flag and start animation sequence
      setLiveFlag("GB");
      // After 2s, animate (shake/explode) and then swap to IE
      setTimeout(() => {
        setAnimateGBtoIE(true);
        // After animation (800ms), swap to IE and reset animation
        setTimeout(() => {
          setLiveFlag("IE");
          setAnimateGBtoIE(false);
        }, 800);
      }, 2000);
    } else {
      // switching to Portuguese: set to BR immediately
      setLiveFlag("BR");
    }
    // Small delay to show the transition
    setTimeout(() => setIsToggling(false), 150);
  };

  return (
<<<<<<< HEAD
    <div className="pointer-events-none fixed left-0 right-0 top-3 z-[60] flex items-center justify-end px-4 md:px-6 lg:px-8">
      <div className="pill-glass pointer-events-auto z-[70] flex items-center gap-1 rounded-full px-2 py-1.5 sm:gap-2 sm:px-3 sm:py-2">
=======
    <div className="fixed top-3 left-0 right-0 z-[60] flex justify-end items-center px-3 sm:px-4 md:px-6 lg:px-8 pointer-events-none">
      <div className="pointer-events-auto sidebar-glass rounded-full px-2 sm:px-3 py-1.5 sm:py-2 shadow-lg border border-border/20 flex items-center gap-1.5 sm:gap-2 md:gap-3 z-[70]">
>>>>>>> 57341ddefe7f3b416527f9e2d2bc41d6daab08c4
        <ThemeToggle />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          disabled={isToggling}
<<<<<<< HEAD
          className={`flex items-center gap-2 rounded-full px-2 py-2 transition-colors duration-200 hover:bg-accent sm:px-3 lg:px-4 ${
=======
          className={`flex items-center gap-1.5 sm:gap-2 rounded-full hover:bg-accent/20 transition-transform duration-200 px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 ${
>>>>>>> 57341ddefe7f3b416527f9e2d2bc41d6daab08c4
            isToggling ? "opacity-85" : ""
          }`}
          aria-label={
            language === "EN" ? t("aria.switchToPt") : t("aria.switchToEn")
          }
        >
          {/* Live flag using Twemoji SVGs for consistent rendering */}
          <span className="inline-flex items-center">
            <img
              className={`tp-twemoji-live ${animateGBtoIE ? "tp-explode" : ""}`}
              src={
                liveFlag === "BR"
                  ? "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1e7-1f1f7.svg"
                  : liveFlag === "IE"
                  ? "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1ee-1f1ea.svg"
                  : "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1ec-1f1e7.svg"
              }
              alt={liveFlag}
              width={22}
              height={16}
            />
          </span>
<<<<<<< HEAD
          <span className="min-w-[24px] text-sm font-medium">{language}</span>
=======
          <span className="text-xs sm:text-sm font-medium lg:text-base min-w-[20px] sm:min-w-[24px]">
            {language}
          </span>
>>>>>>> 57341ddefe7f3b416527f9e2d2bc41d6daab08c4
        </Button>
      </div>
    </div>
  );
});

TopControls.displayName = "TopControls";

export default TopControls;
