import { useCallback, useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { schemaByCollection } from "@/content/schema";
import { useContentLang } from "@/content/store";
import type { ContentCollection, DocMeta } from "@/content/types";
import { cn } from "@/lib/utils";
import { listHistory, type HistoryEntry } from "./adminContent";
import { collectionDefs, rowTitle } from "./collectionConfig";
import { restoredDoc } from "./editorModel";
import ConfirmDialog from "./ConfirmDialog";
import { fill, formatAdminDate } from "./format";
import { problemLabel } from "./problemLabels";
import { storedFields } from "./storedDoc";
import { useAdminT } from "./adminStrings";
import { cardClass, Chip, Notice, PageHeading, StatusBadge } from "./ui";

interface HistoryPanelProps {
  collection: ContentCollection;
  docId: string;
  current: DocMeta | null;
  onRestore: (value: DocMeta) => Promise<void>;
  onBack: () => void;
}

type Restorable = { value: DocMeta; asDraft: boolean } | null;

// What changed between two stored versions, as field labels ("Title · PT-BR").
const changedFields = (collection: ContentCollection, older: Record<string, unknown>, newer: Record<string, unknown>) => {
  const def = collectionDefs[collection];
  const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
  const out: { lang: "en" | "ptBR" | null; field: string }[] = [];
  if (!same(older.published, newer.published)) out.push({ lang: null, field: "published" });
  for (const field of def.shared) if (!same(older[field.name], newer[field.name])) out.push({ lang: null, field: field.name });
  for (const lang of ["en", "ptBR"] as const) {
    const a = (older[lang] ?? {}) as Record<string, unknown>;
    const b = (newer[lang] ?? {}) as Record<string, unknown>;
    for (const field of def.localized) if (!same(a[field.name], b[field.name])) out.push({ lang, field: field.name });
  }
  return out;
};

// An entry restores as is when it still passes the schema; a published entry
// that no longer passes (for example missing Portuguese text) can still come
// back as a draft.
const restorable = (collection: ContentCollection, id: string, data: Record<string, unknown>): Restorable => {
  const schema = schemaByCollection[collection];
  const doc = restoredDoc(id, data);
  const asIs = schema.safeParse(doc);
  if (asIs.success) return { value: asIs.data as DocMeta, asDraft: false };
  const draft = schema.safeParse({ ...doc, published: false });
  return draft.success ? { value: draft.data as DocMeta, asDraft: true } : null;
};

// Earlier versions of one doc, newest first, with what changed in each and
// a restore that keeps the current version in history.
const HistoryPanel = ({ collection, docId, current, onRestore, onBack }: HistoryPanelProps) => {
  const t = useAdminT();
  const { language } = useLanguage();
  const lang = useContentLang();
  const [entries, setEntries] = useState<HistoryEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<{ entry: HistoryEntry; target: NonNullable<Restorable> } | null>(null);

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

  const label = (data: Record<string, unknown>) => rowTitle(collection, restoredDoc(docId, data), lang) || docId;
  const title = current ? rowTitle(collection, current, lang) || docId : entries?.[0] ? label(entries[0].data) : docId;
  const preview = (data: Record<string, unknown>) => {
    const text = (data[lang] ?? {}) as Record<string, unknown>;
    const summary = Array.isArray(text.summary) ? text.summary[0] : text.summary;
    return String(text.description || summary || text.label || text.title || "").slice(0, 180);
  };

  const currentData = current ? (storedFields(current) as Record<string, unknown>) : null;

  return (
    <section aria-labelledby="history-title">
      <PageHeading
        id="history-title"
        title={fill(t("history.title"), { x: collection === "about" ? t("col.about") : title })}
        sub={t("history.sub")}
        actions={
          <Button type="button" variant="neutral" size="touch" onClick={onBack}>
            <ArrowLeft aria-hidden="true" />
            {current ? t("history.backToEditor") : t("back")}
          </Button>
        }
      />
      {error && (
        <Notice
          tone="bad"
          role="alert"
          className="mb-4"
          actions={
            <Button type="button" variant="neutral" size="touch" onClick={() => void load()}>
              {t("reload")}
            </Button>
          }
        >
          {error}
        </Notice>
      )}
      {entries === null && !error && <p role="status">{t("loadingContent")}</p>}
      {entries && (
        <ul className={cn(cardClass, "overflow-hidden")}>
          {current && currentData && (
            <li className="grid gap-4 border-t border-border bg-primary-tint/50 p-4 first:border-t-0 sm:grid-cols-[64px_minmax(0,1fr)] sm:px-5">
              <span className="grid h-9 w-[52px] place-items-center rounded-lg bg-surface-2 font-mono text-sm font-bold">v{current.version}</span>
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 font-semibold">
                  {formatAdminDate(current.updatedAt, language)}
                  <Chip tone="solid">{t("history.current")}</Chip>
                  <StatusBadge published={current.published} label={t(current.published ? "statusPublished" : "statusDraft")} />
                </p>
                {entries[0] && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-ink-3">{t("history.changed")}</span>
                    {changedFields(collection, entries[0].data, currentData)
                      .slice(0, 8)
                      .map((change) => (
                        <span key={`${change.lang}-${change.field}`} className="inline-flex min-h-6 items-center rounded-md bg-surface-2 px-2 font-mono text-xs text-ink-2">
                          {change.field === "published" ? t("field.published") : problemLabel(t, collection, { ...change, kind: "missing" })}
                        </span>
                      ))}
                  </div>
                )}
                {preview(currentData) && <p className="mt-2 line-clamp-2 text-sm text-ink-2">{preview(currentData)}</p>}
              </div>
            </li>
          )}
          {entries.length === 0 && <li className="p-5 text-ink-2">{t("historyEmpty")}</li>}
          {entries.map((entry, index) => {
            // What this version changed compared with the one before it.
            const older = entries[index + 1]?.data;
            const changes = older ? changedFields(collection, older, entry.data) : [];
            const target = restorable(collection, docId, entry.data);
            const wasPublished = entry.data.published === true;
            return (
              <li key={entry.entryId} className="grid gap-4 border-t border-border p-4 first:border-t-0 sm:grid-cols-[64px_minmax(0,1fr)_auto] sm:items-start sm:px-5">
                <span className="grid h-9 w-[52px] place-items-center rounded-lg bg-surface-2 font-mono text-sm font-bold">v{entry.version}</span>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-semibold">
                    {formatAdminDate(entry.savedAt, language)}
                    <StatusBadge published={wasPublished} label={t(wasPublished ? "statusPublished" : "statusDraft")} />
                    {target?.asDraft && (
                      <Chip tone="warn">
                        <AlertCircle className="h-3.5 w-3.5 text-destructive" aria-hidden="true" />
                        {t("history.failsValidation")}
                      </Chip>
                    )}
                  </p>
                  {changes.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-ink-3">{t("history.changed")}</span>
                      {changes.slice(0, 8).map((change) => (
                        <span key={`${change.lang}-${change.field}`} className="inline-flex min-h-6 items-center rounded-md bg-surface-2 px-2 font-mono text-xs text-ink-2">
                          {change.field === "published" ? t("field.published") : problemLabel(t, collection, { ...change, kind: "missing" })}
                        </span>
                      ))}
                      {changes.length > 8 && <span className="text-xs text-ink-3">+{changes.length - 8}</span>}
                    </div>
                  )}
                  {preview(entry.data) && <p className="mt-2 line-clamp-2 text-sm text-ink-2">{preview(entry.data)}</p>}
                  {target?.asDraft && <p className="mt-2 text-[13px] text-destructive">{t("history.draftOnly")}</p>}
                  {!target && <p className="mt-2 text-[13px] text-destructive">{t("restoreInvalid")}</p>}
                </div>
                <div>
                  {target && (
                    <Button
                      type="button"
                      variant="neutral"
                      size="touch"
                      aria-label={fill(t("history.restoreAria"), { n: entry.version })}
                      onClick={() => setPending({ entry, target })}
                    >
                      <RotateCcw aria-hidden="true" />
                      {target.asDraft ? t("history.restoreDraft") : t("restore")}
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <ConfirmDialog
        open={pending !== null}
        title={pending ? fill(t("history.confirmTitle"), { n: pending.entry.version }) : ""}
        body={pending?.target.asDraft ? `${t("confirmRestoreBody")} ${t("history.asDraftNote")}` : t("confirmRestoreBody")}
        confirmLabel={pending?.target.asDraft ? t("history.restoreDraft") : t("restore")}
        item={pending ? { title: label(pending.entry.data), meta: `${t(collectionDefs[collection].label)} · ${docId}` } : undefined}
        onConfirm={() => {
          const target = pending?.target;
          setPending(null);
          if (target) void onRestore(target.value);
        }}
        onCancel={() => setPending(null)}
      />
    </section>
  );
};

export default HistoryPanel;
