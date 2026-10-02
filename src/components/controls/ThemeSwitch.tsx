import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

// A 1x3 plate seen from above. A round 1x1 tile printed with a sun or a moon
// clicks from the first stud to the last. role="switch", checked = dark.
const ThemeSwitch = ({ onAnnounce }: { onAnnounce: (message: string) => void }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useLanguage();
  const isDark = resolvedTheme !== "light";

  const handleClick = () => {
    const next = isDark ? "light" : "dark";
    setTheme(next);
    onAnnounce(next === "dark" ? t("controls.darkOn") : t("controls.lightOn"));
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={t("controls.darkTheme")}
      onClick={handleClick}
      className="group relative grid h-11 w-16 shrink-0 place-items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card max-[359px]:w-14"
    >
      <span
        aria-hidden="true"
        className="relative flex h-[30px] w-[60px] items-center justify-around rounded-[9px] bg-[#d9dcdf] px-1 shadow-[inset_0_-3px_0_#a9aeb3,0_0_0_1px_#a9aeb3] dark:bg-[#2c3238] dark:shadow-[inset_0_-3px_0_#000,0_0_0_1px_#000] max-[359px]:w-[54px]"
      >
        <i className="h-[11px] w-[11px] rounded-full bg-[#e8eaec] shadow-[inset_-2px_-2px_0_#a9aeb3] dark:bg-[#3a4148] dark:shadow-[inset_-2px_-2px_0_#000]" />
        <i className="h-[11px] w-[11px] rounded-full bg-[#e8eaec] shadow-[inset_-2px_-2px_0_#a9aeb3] dark:bg-[#3a4148] dark:shadow-[inset_-2px_-2px_0_#000]" />
        <i className="h-[11px] w-[11px] rounded-full bg-[#e8eaec] shadow-[inset_-2px_-2px_0_#a9aeb3] dark:bg-[#3a4148] dark:shadow-[inset_-2px_-2px_0_#000]" />
        <span
          className={cn(
            "absolute left-1 top-1/2 grid h-[30px] w-[30px] -translate-y-[17px] place-items-center rounded-full bg-white text-[#14191d] shadow-[inset_0_-3px_0_#b9b9b4,0_0_0_1px_#b9b9b4] transition-transform duration-base ease-snap group-hover:-translate-y-[19px] dark:bg-[#596067] dark:text-[#eef1f3] dark:shadow-[inset_0_-3px_0_#2e3236,0_0_0_1px_#2e3236]",
            isDark && "translate-x-[26px] max-[359px]:translate-x-[20px]",
          )}
        >
          {isDark ? (
            <Moon className="h-[18px] w-[18px] -rotate-[30deg] transition-transform duration-slow ease-out" strokeWidth={2} />
          ) : (
            <Sun className="h-[18px] w-[18px] transition-transform duration-slow ease-out" strokeWidth={2} />
          )}
        </span>
      </span>
    </button>
  );
};

export default ThemeSwitch;
