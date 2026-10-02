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
