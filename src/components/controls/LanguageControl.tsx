import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { FlagBR, FlagGB, FlagIE } from "@/components/brand/Flags";
import { cn } from "@/lib/utils";

type Flag = "GB" | "IE" | "BR";
type Phase = "idle" | "hold" | "shake" | "out" | "in";

// Switching to English: GB appears, holds 2s, shakes, scales up while fading
// out, then the Irish flag settles in. Switching to Portuguese swaps to BR
// with no animation. The EN/PT label changes on the first frame, so meaning
// never depends on motion. Reduced motion swaps straight to IE.
const LanguageControl = ({ onAnnounce }: { onAnnounce: (message: string) => void }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const reduced = usePrefersReducedMotion();
  const [flag, setFlag] = useState<Flag>(language === "PT" ? "BR" : "IE");
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };
  useEffect(() => clear, []);

  // Keep the flag in step when the language changes elsewhere.
  useEffect(() => {
    if (language === "PT") {
      clear();
      setFlag("BR");
      setPhase("idle");
    }
  }, [language]);

  const handleClick = () => {
    clear();
    if (language === "EN") {
      toggleLanguage();
      setFlag("BR");
      setPhase("idle");
      onAnnounce("Idioma: português");
      return;
    }
    toggleLanguage();
    onAnnounce("Language: English");
    if (reduced) {
      setFlag("IE");
      setPhase("idle");
      return;
    }
    setFlag("GB");
    setPhase("hold");
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
    at(2000, () => setPhase("shake"));
    at(2450, () => setPhase("out"));
    at(2800, () => {
      setFlag("IE");
      setPhase("in");
    });
    at(3050, () => setPhase("idle"));
  };

  const label = language === "EN" ? t("controls.languageLabelEn") : t("controls.languageLabelPt");

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      className="inline-flex h-11 items-center gap-2 rounded-full pl-2.5 pr-3 font-mono text-[13px] font-semibold tracking-wider text-foreground transition-colors duration-fast hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card max-[359px]:gap-1.5 max-[359px]:px-1.5"
    >
      <span aria-hidden="true" className="relative h-[18px] w-[26px] shrink-0">
        <span
          className={cn(
            "absolute inset-0 overflow-hidden rounded ring-1 ring-border",
            phase === "shake" && "animate-flag-shake",
            phase === "out" && "animate-flag-out",
            phase === "in" && "animate-flag-in",
          )}
        >
          {flag === "GB" && <FlagGB />}
          {flag === "IE" && <FlagIE />}
          {flag === "BR" && <FlagBR />}
        </span>
      </span>
      <span>{language === "PT" ? "PT" : "EN"}</span>
    </button>
  );
};

export default LanguageControl;
