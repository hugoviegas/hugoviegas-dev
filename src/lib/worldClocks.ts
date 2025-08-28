export type TimeResult = {
  display: string;
  iso: string;
  offsetLabel: string;
};

export type FormatterSet = {
  timeFormatter: Intl.DateTimeFormat | null;
  dateFormatter: Intl.DateTimeFormat | null;
  tzNameFormatter: Intl.DateTimeFormat | null;
};

export function createFormatters(zone: string, locale: string): FormatterSet {
  try {
    const timeFormatter = new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: zone,
    });

    const dateFormatter = new Intl.DateTimeFormat(locale, {
      weekday: "short",
      day: "2-digit",
      month: "short",
      timeZone: zone,
    });

    const tzNameFormatter = new Intl.DateTimeFormat(locale, {
      timeZone: zone,
      timeZoneName: "short",
    });

    return { timeFormatter, dateFormatter, tzNameFormatter };
  } catch (e) {
    return { timeFormatter: null, dateFormatter: null, tzNameFormatter: null };
  }
}

export function parseOffsetFromParts(
  fmt: Intl.DateTimeFormat | null,
  date: Date
): string {
  if (!fmt || typeof fmt.formatToParts !== "function") return "";

  try {
    const parts = fmt.formatToParts(date);
    const tzPart = parts.find((p) => p.type === "timeZoneName");
    if (!tzPart || !tzPart.value) return "";

    const m = tzPart.value.match(/([+-]?\d{1,2})/);
    if (m) return (m[0].startsWith("+") ? "+" : "") + m[0];
    return tzPart.value;
  } catch {
    return "";
  }
}

export function getTimeIn(
  zone: string,
  locale: string,
  formatters?: Record<string, FormatterSet>
): TimeResult {
  const now = new Date();
  const fmts = formatters?.[zone] || createFormatters(zone, locale);

  let timeStr: string;
  let dateStr: string;
  let offsetLabel = "";

  if (fmts.timeFormatter && fmts.dateFormatter) {
    try {
      timeStr = fmts.timeFormatter.format(now);
      dateStr = fmts.dateFormatter.format(now);
      offsetLabel = parseOffsetFromParts(fmts.tzNameFormatter, now) || "";
    } catch {
      timeStr = now.toLocaleTimeString(locale, { hour12: false });
      dateStr = now.toLocaleDateString(locale, {
        weekday: "short",
        day: "2-digit",
        month: "short",
      });
    }
  } else {
    timeStr = now.toLocaleTimeString(locale, { hour12: false });
    dateStr = now.toLocaleDateString(locale, {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  }

  return {
    display: `${timeStr} (${dateStr})`,
    iso: now.toISOString(),
    offsetLabel,
  };
}
