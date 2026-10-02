// Dates in the admin follow the site language.
export const formatAdminDate = (iso: string | null | undefined, language: "EN" | "PT") =>
  iso
    ? new Date(iso).toLocaleString(language === "PT" ? "pt-BR" : "en-IE", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

// Fills {name} placeholders in an admin string.
export const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
