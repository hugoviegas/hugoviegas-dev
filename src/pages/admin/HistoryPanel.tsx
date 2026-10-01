import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { schemaByCollection } from "@/content/schema";
import { useLanguage } from "@/hooks/useLanguage";
import type { ContentCollection, DocMeta } from "@/content/types";
import { listHistory, type HistoryEntry } from "./adminContent";
import { restoredDoc } from "./editorModel";
import ConfirmDialog from "./ConfirmDialog";
import { useAdminT } from "./adminStrings";

interface HistoryPanelProps {
  collection: ContentCollection;
  docId: string;
  onRestore: (value: DocMeta) => Promise<void>;
  onBack: () => void;
}

// Earlier versions of one doc, newest first, each restorable.
const HistoryPanel = ({ collection, docId, onRestore, onBack }: HistoryPanelProps) => {
  const t = useAdminT();
  const { language } = useLanguage();
  const [entries, setEntries] = useState<HistoryEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<HistoryEntry | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setEntries(await listHistory(collection, docId));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [collection, docId]);

  useEffect(() => {
    void load();
  }, [load]);

  const restore = async (entry: HistoryEntry) => {
    setPending(null);
    // Old versions may predate a schema change; they must still be valid.
    const parsed = schemaByCollection[collection].safeParse(restoredDoc(docId, entry.data));
    if (!parsed.success) {
      setError(t("restoreInvalid"));
      return;
    }
    await onRestore(parsed.data as DocMeta);
  };

  const formatDate = (iso: string | null) =>
    iso ? new Date(iso).toLocaleString(language === "PT" ? "pt-BR" : "en-IE") : "—";

  return (
    <section aria-labelledby="history-title" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id="history-title" className="heading-card">
          {t("historyTitle")} · <code>{docId}</code>
        </h3>
        <Button type="button" variant="outline" onClick={onBack}>
          {t("back")}
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {entries === null && !error && <p role="status">{t("loadingContent")}</p>}
      {entries?.length === 0 && <p>{t("historyEmpty")}</p>}
      {entries && entries.length > 0 && (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {entries.map((entry) => (
            <li key={entry.entryId} className="flex flex-wrap items-center justify-between gap-3 p-3">
              <span className="text-sm">
                {t("historyVersion")} {entry.version} · {formatDate(entry.savedAt)}
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setPending(entry)}
                aria-label={`${t("restore")} ${t("historyVersion")} ${entry.version}`}
              >
                {t("restore")}
              </Button>
            </li>
          ))}
        </ul>
      )}
      <ConfirmDialog
        open={pending !== null}
        title="confirmRestoreTitle"
        body="confirmRestoreBody"
        onConfirm={() => pending && void restore(pending)}
        onCancel={() => setPending(null)}
      />
    </section>
  );
};

export default HistoryPanel;
