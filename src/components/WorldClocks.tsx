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
  const { language } = useLanguage();
  const isPt = (pageLang && pageLang.startsWith("pt")) || language === "PT";

  const locale = isPt ? "pt-BR" : "en-GB";

  // Zones (memoized so identity is stable for effect deps)
  const zones = useMemo(
    () => [
      { id: "Europe/Dublin", label: isPt ? "Dublin" : "Dublin", flag: "🇮🇪" },
      {
        id: "America/Sao_Paulo",
        label: isPt ? "São Paulo" : "São Paulo",
        flag: "🇧🇷",
      },
    ],
    [isPt]
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

  // Styles using CSS variables for high-contrast tokens
  const containerStyle: React.CSSProperties = {
    // CSS custom props for high-contrast tokens
    // TS requires a cast when using custom property names
    ...(Object.fromEntries([
      ["--wc-accent-start", "#06b6d4"],
      ["--wc-accent-end", "#7c3aed"],
      ["--wc-text", "#0f172a"],
      ["--wc-bg", "var(--card)"],
    ]) as React.CSSProperties),
  };

  return (
    <div aria-live="off" style={containerStyle} className="w-full">
      <div
        className="rounded-xl overflow-hidden w-full"
        style={{
          background:
            "linear-gradient(90deg,var(--wc-accent-start),var(--wc-accent-end))",
        }}
      >
        <div className="p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">
              {isPt ? "Hora atual" : "Current time"}
            </h3>
            {offsetBadge && (
              <span
                className="text-xs bg-white/20 px-2 py-1 rounded"
                aria-hidden
              >
                {isPt ? "Fuso agora:" : "Offset now:"} {offsetBadge}
              </span>
            )}
          </div>

          <div className="text-center" style={{ color: "#e6f7ff" }}>
            <div className="flex gap-4 items-stretch">
              {zones.map((z) => (
                <div
                  key={z.id}
                  className="flex-1 min-w-0 px-3 py-4 flex flex-col items-center justify-center"
                >
                  <time
                    dateTime={times[z.id]?.iso}
                    aria-label={`${z.label} ${times[z.id]?.display}`}
                    className="block text-lg md:text-xl lg:text-2xl font-mono leading-tight"
                  >
                    {times[z.id]?.display || "--:--:--"}
                  </time>

                  <div className="mt-2 text-xs text-white/80 flex items-center gap-2">
                    <span aria-hidden className="text-base">
                      {z.flag}
                    </span>
                    <span className="font-medium truncate">{z.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldClocks;
