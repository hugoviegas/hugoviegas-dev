import { useCallback, useEffect, useMemo, useState } from "react";
import { FirebaseError } from "firebase/app";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { schemaByCollection } from "@/content/schema";
import { useContentLang } from "@/content/store";
import type { ContentCollection, DocMeta } from "@/content/types";
import {
  deleteContentDoc,
  listDeletedIds,
  loadCollection,
  loadSettings,
  saveContentDoc,
  saveContentDocs,
  toAppDoc,
  type ExistingSettings,
} from "./adminContent";
import { collectionDefs, rowTitle } from "./collectionConfig";
import { newDoc, reorderChanges, sortByOrder } from "./editorModel";
import type { ExistingDoc } from "./storedDoc";
import ConfirmDialog from "./ConfirmDialog";
import DocEditor from "./DocEditor";
import HistoryPanel from "./HistoryPanel";
import { useAdminT, type AdminStringKey } from "./adminStrings";

type Mode =
  | { view: "list" }
  | { view: "edit"; doc: DocMeta; isNew: boolean }
  | { view: "history"; id: string };

interface Loaded {
  stored: Record<string, ExistingDoc>;
  docs: DocMeta[];
  settings: ExistingSettings | null;
  deletedIds: string[];
}

// List, create, edit, publish, reorder, delete, and restore for one collection.
const CollectionPanel = ({ collection }: { collection: ContentCollection }) => {
  const t = useAdminT();
  const lang = useContentLang();
  const def = collectionDefs[collection];
  const [data, setData] = useState<Loaded | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>({ view: "list" });
  const [notice, setNotice] = useState<{ kind: "status" | "alert"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [toDelete, setToDelete] = useState<DocMeta | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const [stored, settings] = await Promise.all([loadCollection(collection), loadSettings()]);
      const docs = sortByOrder(
        Object.entries(stored).map(([id, item]) => toAppDoc(id, item.data) as unknown as DocMeta),
      );
      const deletedIds = await listDeletedIds(collection, new Set(Object.keys(stored)));
      setData({ stored, docs, settings, deletedIds });
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : String(error));
    }
  }, [collection]);

  useEffect(() => {
    void load();
  }, [load]);

  // Runs a write, reloads, and reports the outcome.
  const run = async (write: () => Promise<void>, success: AdminStringKey) => {
    setBusy(true);
    setNotice(null);
    try {
      await write();
      await load();
      setNotice({ kind: "status", text: t(success) });
      return true;
    } catch (error) {
      // The owner passed the access check, so a rules rejection here almost
      // always means the doc changed since it was loaded (version mismatch).
      const text =
        error instanceof FirebaseError && error.code === "permission-denied"
          ? t("staleError")
          : `${t("saveError")} ${error instanceof Error ? error.message : String(error)}`;
      setNotice({ kind: "alert", text });
      return false;
    } finally {
      setBusy(false);
    }
  };

  const current = (id: string) => data?.stored[id] ?? null;

  const save = async (value: DocMeta) => {
    const ok = await run(
      () => saveContentDoc(collection, value, current(value.id), data?.settings ?? null),
      "saved",
    );
    if (ok) setMode({ view: "list" });
  };

  const togglePublish = (doc: DocMeta) => {
    const next = { ...doc, published: !doc.published };
    if (!schemaByCollection[collection].safeParse(next).success) {
      setNotice({ kind: "alert", text: t("publishBlocked") });
      return;
    }
    void run(() => saveContentDoc(collection, next, current(doc.id), data?.settings ?? null), "saved");
  };

  const move = (doc: DocMeta, direction: -1 | 1) => {
    if (!data) return;
    const changes = reorderChanges(data.docs, doc.id, direction, data.stored, def.scope);
    if (changes.length === 0) return;
    void run(() => saveContentDocs(collection, changes, data.settings), "saved");
  };

  const remove = (doc: DocMeta) => {
    setToDelete(null);
    const stored = current(doc.id);
    if (!stored) return;
    void run(() => deleteContentDoc(collection, doc.id, stored, data?.settings ?? null), "deleted");
  };

  const restore = async (value: DocMeta) => {
    const ok = await run(
      () => saveContentDoc(collection, value, current(value.id), data?.settings ?? null),
      "restored",
    );
    if (ok) setMode({ view: "list" });
  };

  // Skills are listed (and reordered) per group.
  const groups = useMemo(() => {
    const docs = data?.docs ?? [];
    if (!def.scope) return [{ key: "", docs }];
    const keys = [...new Set(docs.map(def.scope))];
    return keys.map((key) => ({ key, docs: docs.filter((doc) => def.scope?.(doc) === key) }));
  }, [data, def]);

  if (loadError) {
    return (
      <div className="space-y-3">
        <p role="alert" className="text-destructive">
          {t("loadError")} {loadError}
        </p>
        <Button type="button" variant="outline" onClick={() => void load()}>
          {t("reload")}
        </Button>
      </div>
    );
  }
  if (!data) return <p role="status">{t("loadingContent")}</p>;

  const noticeEl = notice && (
    <p
      role={notice.kind}
      className={notice.kind === "alert" ? "text-sm text-destructive" : "text-sm text-muted-foreground"}
    >
      {notice.text}
    </p>
  );

  if (mode.view === "edit") {
    return (
      <div className="space-y-4">
        {noticeEl}
        <DocEditor
          key={mode.doc.id || "new"}
          collection={collection}
          initial={mode.doc}
          isNew={mode.isNew}
          existingIds={new Set(Object.keys(data.stored))}
          onSave={save}
          onCancel={() => setMode({ view: "list" })}
        />
      </div>
    );
  }

  if (mode.view === "history") {
    return (
      <div className="space-y-4">
        {noticeEl}
        <HistoryPanel
          collection={collection}
          docId={mode.id}
          onRestore={restore}
          onBack={() => setMode({ view: "list" })}
        />
      </div>
    );
  }

  return (
    <section aria-labelledby={`${collection}-title`} className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id={`${collection}-title`} className="heading-card">
          {t(def.label)}
        </h3>
        <Button
          type="button"
          disabled={busy}
          onClick={() => setMode({ view: "edit", doc: newDoc(collection, data.docs), isNew: true })}
        >
          {t("newDoc")}
        </Button>
      </div>
      {def.hint && <p className="text-sm text-muted-foreground">{t(def.hint)}</p>}
      <div aria-live="polite">{noticeEl}</div>

      {data.docs.length === 0 && <p>{t("emptyList")}</p>}
      {groups.map((group) => (
        <div key={group.key} className="space-y-2">
          {group.key && (
            <h4 className="text-sm font-semibold">{t(`group.${group.key}` as AdminStringKey)}</h4>
          )}
          <ul className="divide-y divide-border rounded-lg border border-border">
            {group.docs.map((doc, index) => {
              const title = rowTitle(collection, doc, lang);
              return (
                <li key={doc.id} className="flex flex-col gap-3 p-3 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0 space-y-1">
                    <p className="truncate font-medium">{title}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant={doc.published ? "default" : "outline"}>
                        {t(doc.published ? "statusPublished" : "statusDraft")}
                      </Badge>
                      <code>{doc.id}</code>
                      <span>
                        {t("field.order")} {doc.order}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setMode({ view: "edit", doc, isNew: false })}
                      aria-label={`${t("edit")}: ${title}`}
                      disabled={busy}
                    >
                      {t("edit")}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => togglePublish(doc)}
                      aria-label={`${t(doc.published ? "unpublish" : "publish")}: ${title}`}
                      disabled={busy}
                    >
                      {t(doc.published ? "unpublish" : "publish")}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => move(doc, -1)}
                      aria-label={`${t("moveUp")}: ${title}`}
                      disabled={busy || index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => move(doc, 1)}
                      aria-label={`${t("moveDown")}: ${title}`}
                      disabled={busy || index === group.docs.length - 1}
                    >
                      ↓
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setMode({ view: "history", id: doc.id })}
                      aria-label={`${t("history")}: ${title}`}
                      disabled={busy}
                    >
                      {t("history")}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      // Outline + destructive text keeps AA contrast in both themes.
                      className="text-destructive"
                      onClick={() => setToDelete(doc)}
                      aria-label={`${t("delete")}: ${title}`}
                      disabled={busy}
                    >
                      {t("delete")}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {data.deletedIds.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">{t("deletedTitle")}</h4>
          <ul className="flex flex-wrap gap-2">
            {data.deletedIds.map((id) => (
              <li key={id}>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setMode({ view: "history", id })}
                  aria-label={`${t("history")}: ${id}`}
                >
                  <code>{id}</code>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="confirmDeleteTitle"
        body="confirmDeleteBody"
        onConfirm={() => toDelete && remove(toDelete)}
        onCancel={() => setToDelete(null)}
      />
    </section>
  );
};

export default CollectionPanel;
