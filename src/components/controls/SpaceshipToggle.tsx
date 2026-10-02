import { useId } from "react";
import { Rocket } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/hooks/useLanguage";
import { useSpaceship } from "@/hooks/useSpaceship";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

// Turns the background WebGL X-wing on or off. Off by default; disabled when
// the visitor prefers reduced motion. The ship only flies in the dark theme.
const SpaceshipToggle = ({ onAnnounce }: { onAnnounce: (message: string) => void }) => {
  const { t } = useLanguage();
  const { enabled, toggle } = useSpaceship();
  const { resolvedTheme } = useTheme();
  const reduced = usePrefersReducedMotion();
  const tipId = useId();
  const on = enabled && !reduced;

  const tip = reduced
    ? t("controls.spaceshipReduced")
    : on
      ? t("controls.spaceshipHide")
      : resolvedTheme === "light"
        ? t("controls.spaceshipDarkOnly")
        : t("controls.spaceshipShow");

  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={t("controls.spaceship")}
        aria-describedby={tipId}
        disabled={reduced}
        onClick={() => {
          toggle();
          onAnnounce(on ? t("controls.spaceshipOffMsg") : t("controls.spaceshipOnMsg"));
        }}
        className={cn(
          "relative grid h-11 w-11 place-items-center rounded-full border border-transparent text-foreground transition-colors duration-fast hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent",
          on && "border-primary bg-primary-tint text-primary hover:bg-primary-tint",
        )}
      >
        <Rocket className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        <span
          aria-hidden="true"
          className={cn("absolute right-[7px] top-[7px] h-[7px] w-[7px] rounded-[2px]", on ? "bg-brand-decor" : "bg-dot")}
        />
      </button>
      <span
        id={tipId}
        role="tooltip"
        className="pointer-events-none invisible absolute right-0 top-[calc(100%+10px)] z-10 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background opacity-0 transition-opacity duration-fast group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
      >
        {tip}
      </span>
    </span>
  );
};

export default SpaceshipToggle;
