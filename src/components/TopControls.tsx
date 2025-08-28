import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useLanguage } from "@/hooks/useLanguage";

const TopControls = memo(() => {
  const { language, toggleLanguage, currentLanguage } = useLanguage();
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    toggleLanguage();
    // Small delay to show the transition
    setTimeout(() => setIsToggling(false), 150);
  };

  return (
    <div className="fixed top-3 left-0 right-0 z-50 flex justify-end items-center px-6 lg:px-8 pointer-events-none md:px-4 sm:px-2">
      <div className="pointer-events-auto flex items-center gap-3 bg-card/60 backdrop-blur-md p-2 rounded-full md:gap-2 sm:gap-1 border border-border/30 shadow-lg">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          disabled={isToggling}
          className={`flex items-center gap-2 rounded-full hover:bg-accent/20 transition-all duration-200 md:gap-1 sm:gap-0.5 px-3 py-2 ${
            isToggling ? "opacity-70 scale-95" : "hover:scale-105"
          }`}
          aria-label={`Switch to ${
            language === "EN" ? "Portuguese" : "English"
          }`}
        >
          <span
            className={`text-lg md:text-base sm:text-sm transition-transform duration-200 ${
              isToggling ? "rotate-12" : ""
            }`}
            role="img"
            aria-label={currentLanguage.name}
          >
            {currentLanguage.flag}
          </span>
          <span className="text-sm font-medium md:text-xs sm:text-[10px] min-w-[20px]">
            {language}
          </span>
        </Button>
      </div>
    </div>
  );
});

TopControls.displayName = "TopControls";

export default TopControls;
