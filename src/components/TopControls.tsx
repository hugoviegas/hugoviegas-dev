import { memo, useCallback, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageControl from "./controls/LanguageControl";
import ThemeSwitch from "./controls/ThemeSwitch";
import SpaceshipToggle from "./controls/SpaceshipToggle";

// Top-right cluster on every breakpoint: language, theme, spaceship.
// One polite live region announces each change.
const TopControls = memo(() => {
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const announce = useCallback((next: string) => setMessage(next), []);

  return (
    <div className="pointer-events-none fixed right-3 top-3 z-[60] lg:right-6 lg:top-4">
      <div
        role="group"
        aria-label={t("controls.settings")}
        className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-border bg-card p-[5px] shadow-e3 max-sm:gap-0.5 max-sm:p-[3px]"
      >
        <LanguageControl onAnnounce={announce} />
        <ThemeSwitch onAnnounce={announce} />
        <SpaceshipToggle onAnnounce={announce} />
      </div>
      <p className="sr-only" aria-live="polite">
        {message}
      </p>
    </div>
  );
});

TopControls.displayName = "TopControls";

export default TopControls;
