import React, { useEffect, useRef, useState, useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import {
  createFormatters,
  getTimeIn,
  parseOffsetFromParts,
  TimeResult,
  FormatterSet,
} from "@/lib/worldClocks";

const WorldClocks: React.FC = () => {
  // Prefer page lang attribute per requirement; fallback to app language
  const pageLang =
    typeof document !== "undefined" ? document.documentElement.lang : undefined;
  const { language, t } = useLanguage();
  const isPt = (pageLang && pageLang.startsWith("pt")) || language === "PT";

  const locale = isPt ? "pt-BR" : "en-GB";

  // Zones (memoized so identity is stable for effect deps)
  const zones = useMemo(
    () => [
      { id: "Europe/Dublin", label: "Dublin", flag: "🇮🇪" },
      { id: "America/Sao_Paulo", label: "São Paulo", flag: "🇧🇷" },
    ],
    []
  );

  // Keep formatted strings in state; update only those strings each tick
  const [times, setTimes] = useState<Record<string, TimeResult>>(() => {
    const initial: Record<string, TimeResult> = {};
    zones.forEach((z) => {
      initial[z.id] = getTimeIn(z.id, locale);
    });
    return initial;
  });

  // Keep formatters in ref to avoid recreating them
  const formattersRef = useRef<Record<string, FormatterSet>>({});

  useEffect(() => {
    // populate formatters once for each zone
    zones.forEach((z) => {
      formattersRef.current[z.id] = createFormatters(z.id, locale);
    });

    const tick = () => {
      setTimes((prev) => {
        const next: Record<string, TimeResult> = { ...prev };
        const now = new Date();
        zones.forEach((z) => {
          const fmts = formattersRef.current[z.id];
          if (fmts && fmts.timeFormatter && fmts.dateFormatter) {
            try {
              const timeStr = fmts.timeFormatter!.format(now);
              const dateStr = fmts.dateFormatter!.format(now);
              const offset =
                parseOffsetFromParts(fmts.tzNameFormatter, now) || "";
              next[z.id] = {
                display: `${timeStr} (${dateStr})`,
                iso: now.toISOString(),
                offsetLabel: offset,
              };
              return;
            } catch {
              // fallthrough to fallback below
            }
          }

          // fallback
          const timeStr = now.toLocaleTimeString(locale, { hour12: false });
          const dateStr = now.toLocaleDateString(locale, {
            weekday: "short",
            day: "2-digit",
            month: "short",
          });
          next[z.id] = {
            display: `${timeStr} (${dateStr})`,
            iso: now.toISOString(),
            offsetLabel: "",
          };
        });
        return next;
      });
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
    // zones is stable in this component so it's safe to omit it from deps
    // locale intentionally in deps so formatters will rebuild when language changes
  }, [locale, zones]);

  // Build offset badge text
  const offsetBadge = zones
    .map((z) => times[z.id]?.offsetLabel || "")
    .join(" / ");

  return (
    <div aria-live="off" className="w-full">
      <div className="w-full overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary shadow-lg">
        <div className="p-5 text-white md:p-6">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">{t("clocks.currentTime")}</h3>
            {offsetBadge && (
              <span className="rounded bg-white/20 px-2 py-1 text-xs" aria-hidden>
                {t("clocks.offsetNow")} {offsetBadge}
              </span>
            )}
          </div>

          <div className="flex items-stretch gap-2 text-center sm:gap-4">
            {zones.map((z) => (
              <div
                key={z.id}
                className="flex min-w-0 flex-1 flex-col items-center justify-center px-1 py-4 sm:px-3"
              >
                <time
                  dateTime={times[z.id]?.iso}
                  aria-label={`${z.label} ${times[z.id]?.display}`}
                  className="block font-mono text-base leading-tight md:text-lg lg:text-xl"
                >
                  {times[z.id]?.display || "--:--:--"}
                </time>

                <div className="mt-2 flex items-center gap-2 text-xs text-white/80">
                  <span aria-hidden className="text-base">
                    {z.flag}
                  </span>
                  <span className="truncate font-medium">{z.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldClocks;
