import { useCallback, useEffect, useMemo, useState } from "react";
import { FirebaseError } from "firebase/app";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { schemaByCollection } from "@/content/schema";
import { useContentLang } from "@/content/store";
import type { ContentCollection, DocMeta } from "@/content/types";
import {
  deleteContentDoc,
  listDeleted,
  loadCollection,
  loadSettings,
  saveContentDoc,
  saveContentDocs,
  toAppDoc,
  type DeletedDoc,
  type ExistingSettings,
} from "./adminContent";
import { collectionDefs, rowTitle } from "./collectionConfig";
import {
  moveToChanges,
  newDoc,
  publishProblems,
  reorderChanges,
  restoredDoc,
  sortByOrder,
  type DocChange,
  type PublishProblem,
} from "./editorModel";
import type { ExistingDoc } from "./storedDoc";
import ConfirmDialog from "./ConfirmDialog";
import DocEditor from "./DocEditor";
import HistoryPanel from "./HistoryPanel";
import CollectionList, { LoadError } from "./CollectionList";
import { useAdminNav } from "./AdminNavigation";
import { useAdminSummary } from "./AdminSummary";
import { useToast } from "./AdminToasts";
import { ABOUT_DOC_ID, type CollectionView } from "./adminRoutes";
import { useAdminT, type AdminStringKey } from "./adminStrings";
import { problemLabel } from "./problemLabels";
import { fill } from "./format";
import { Notice } from "./ui";

interface Loaded {
  stored: Record<string, ExistingDoc>;
  docs: DocMeta[];
  settings: ExistingSettings | null;
  deleted: DeletedDoc[];
}

type Pending =
  | { kind: "delete"; doc: DocMeta }
  | { kind: "publish" | "unpublish"; doc: DocMeta }
  | { kind: "restoreDeleted"; item: DeletedDoc };

// List, create, edit, publish, reorder, delete, and restore for one collection.
// The view (list, new, edit, history) comes from the address.
const CollectionPanel = ({ collection, route }: { collection: ContentCollection; route: CollectionView }) => {
  const t = useAdminT();
  const { language } = useLanguage();
  const lang = useContentLang();
  const { go, setDirty, registerSave } = useAdminNav();
  const { reportCounts } = useAdminSummary();
  const toast = useToast();
  const def = collectionDefs[collection];
  const [data, setData] = useState<Loaded | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [stale, setStale] = useState(false);
  const [writeError, setWriteError] = useState<string | null>(null);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<Pending | null>(null);
  const [blocked, setBlocked] = useState<{ doc: DocMeta; problems: PublishProblem[] } | null>(null);
  // Set when "Open the editor" follows a blocked publish: the editor opens with its summary.
  const [summaryFor, setSummaryFor] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const [stored, settings] = await Promise.all([loadCollection(collection), loadSettings()]);
      const docs = sortByOrder(
        Object.entries(stored).map(([id, item]) => toAppDoc(id, item.data) as unknown as DocMeta),
      );
      const deleted = await listDeleted(collection, new Set(Object.keys(stored)));
      setData({ stored, docs, settings, deleted });
      setStale(false);
      reportCounts(collection, docs.map((doc) => doc.published));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : String(error));
    }
  }, [collection, reportCounts]);

  useEffect(() => {
    void load();
  }, [load]);

  const titleOf = useCallback((doc: DocMeta) => rowTitle(collection, doc, lang) || doc.id, [collection, lang]);

  // Runs a write, reloads, and reports the outcome. The owner passed the
  // access check, so a rules rejection almost always means the data changed
  // since it was loaded (version mismatch): that becomes the stale notice.
  const run = async (ids: string[], write: () => Promise<void>, success: string) => {
    setBusyIds(new Set(ids));
    setWriteError(null);
    try {
      await write();
      await load();
      toast("ok", success);
      return true;
    } catch (error) {
      if (error instanceof FirebaseError && error.code === "permission-denied") setStale(true);
      else setWriteError(error instanceof Error ? error.message : String(error));
      toast("bad", t("list.writeFailed"));
      return false;
    } finally {
      setBusyIds(new Set());
    }
  };

  const current = (id: string) => data?.stored[id] ?? null;
  const listRoute = () =>
    collection === "about" ? ({ section: "overview" } as const) : ({ section: collection, view: "list" } as const);

  const save = async (value: DocMeta) => {
    const ok = await run(
      [value.id],
      () => saveContentDoc(collection, value, current(value.id), data?.settings ?? null),
      t("toast.saved"),
    );
    if (ok) go(listRoute(), { force: true });
    return ok;
  };

  const askPublish = (doc: DocMeta) => {
    if (doc.published) {
      setPending({ kind: "unpublish", doc });
      return;
    }
    const problems = publishProblems(collection, doc);
    if (problems.length > 0) {
      setBlocked({ doc, problems });
      return;
    }
    setBlocked(null);
    setPending({ kind: "publish", doc });
  };

  const setPublished = (doc: DocMeta, published: boolean) =>
    void run(
      [doc.id],
      () => saveContentDoc(collection, { ...doc, published }, current(doc.id), data?.settings ?? null),
      fill(t(published ? "toast.published" : "toast.unpublished"), { x: titleOf(doc) }),
    );

  const writeOrder = (changes: DocChange[]) => {
    if (!data || changes.length === 0) return;
    void run(
      changes.map((change) => change.value.id),
      () => saveContentDocs(collection, changes, data.settings),
      t("toast.order"),
    );
  };

  const move = (doc: DocMeta, direction: -1 | 1) =>
    data && writeOrder(reorderChanges(data.docs, doc.id, direction, data.stored, def.scope));
  const moveTo = (id: string, targetId: string) =>
    data && writeOrder(moveToChanges(data.docs, id, targetId, data.stored, def.scope));

  const remove = (doc: DocMeta) => {
    const stored = current(doc.id);
    if (!stored) return;
    void run(
      [doc.id],
      () => deleteContentDoc(collection, doc.id, stored, data?.settings ?? null),
      fill(t("toast.deleted"), { x: titleOf(doc) }),
    );
  };

  // A deleted doc comes back as a draft, so it never goes live by surprise.
  const restoreDeleted = (item: DeletedDoc) => {
    const parsed = schemaByCollection[collection].safeParse({ ...restoredDoc(item.id, item.data), published: false });
    if (!parsed.success) {
      setWriteError(t("restoreInvalid"));
      return;
    }
    const value = parsed.data as DocMeta;
    void run([item.id], () => saveContentDoc(collection, value, null, data?.settings ?? null), fill(t("toast.restoredDraft"), { x: titleOf(value) }));
  };

  // A version from history becomes the current doc (with a new version number).
  const restoreVersion = async (value: DocMeta) => {
    const ok = await run(
      [value.id],
      () => saveContentDoc(collection, value, current(value.id), data?.settings ?? null),
      t("restored"),
    );
    if (ok) go({ section: collection, view: "edit", id: value.id }, { force: true });
  };

  const confirmPending = () => {
    if (!pending) return;
    setPending(null);
    if (pending.kind === "delete") remove(pending.doc);
    else if (pending.kind === "restoreDeleted") restoreDeleted(pending.item);
    else setPublished(pending.doc, pending.kind === "publish");
  };

  const busyDocs = useMemo(() => busyIds, [busyIds]);

  const notices = (
    <div aria-live="polite" className="space-y-3 empty:hidden [&>*]:mb-4">
      {stale && (
        <Notice
          tone="warn"
          role="alert"
          title={t("list.staleTitle")}
          actions={
            <Button type="button" variant="primary" size="touch" onClick={() => void load()}>
              {t("reload")}
            </Button>
          }
        >
          {t("staleError")}
        </Notice>
      )}
      {writeError && (
        <Notice tone="bad" role="alert" title={t("saveError")}>
          {writeError}
        </Notice>
      )}
    </div>
  );

  if (route.view === "edit" || route.view === "new") {
    if (loadError) return <LoadError collection={collection} error={loadError} onReload={load} />;
    if (!data) return <p role="status">{t("loadingContent")}</p>;
    const existing = route.view === "edit" ? data.docs.find((doc) => doc.id === route.id) : undefined;
    // The About doc is created on first save if it does not exist yet.
    const startsNew = route.view === "new" || (!existing && collection === "about");
    if (route.view === "edit" && !existing && !startsNew) {
      return (
        <div className="space-y-4">
          <h1 className="text-[26px] font-extrabold">{t("notFound")}</h1>
          <p role="alert">{t("notFoundBody")}</p>
          <Button type="button" variant="neutral" onClick={() => go(listRoute())}>
            {t("back")}
          </Button>
        </div>
      );
    }
    const initial = existing ?? { ...newDoc(collection, data.docs), ...(collection === "about" ? { id: ABOUT_DOC_ID } : {}) };
    return (
      <div className="space-y-4">
        {notices}
        <DocEditor
          key={existing?.id ?? "new"}
          collection={collection}
          initial={initial}
          isNew={startsNew}
          existingIds={new Set(Object.keys(data.stored))}
          onSave={save}
          onCancel={() => go(listRoute())}
          onHistory={existing ? () => go({ section: collection, view: "history", id: existing.id }) : undefined}
          startWithSummary={summaryFor === existing?.id}
          onDirtyChange={(dirty) => setDirty(dirty, titleOf(initial))}
          registerSave={registerSave}
        />
      </div>
    );
  }

  if (route.view === "history") {
    return (
      <div className="space-y-4">
        {notices}
        <HistoryPanel
          collection={collection}
          docId={route.id}
          current={data?.docs.find((doc) => doc.id === route.id) ?? null}
          onRestore={restoreVersion}
          onBack={() =>
            go(collection === "about" || data?.stored[route.id] ? { section: collection, view: "edit", id: route.id } : listRoute())
          }
        />
      </div>
    );
  }

  const pendingTitle =
    pending?.kind === "restoreDeleted"
      ? rowTitle(collection, restoredDoc(pending.item.id, pending.item.data), lang) || pending.item.id
      : pending
        ? titleOf(pending.doc)
        : "";
  const pendingId = pending?.kind === "restoreDeleted" ? pending.item.id : pending?.doc.id ?? "";
  const dialogText: Record<Pending["kind"], { title: AdminStringKey; body: AdminStringKey; confirm: AdminStringKey }> = {
    delete: { title: "dlg.deleteTitle", body: "dlg.deleteBody", confirm: "delete" },
    publish: { title: "dlg.publishTitle", body: "dlg.publishBody", confirm: "publish" },
    unpublish: { title: "dlg.unpublishTitle", body: "dlg.unpublishBody", confirm: "unpublish" },
    restoreDeleted: { title: "dlg.restoreDeletedTitle", body: "dlg.restoreDeletedBody", confirm: "restore" },
  };
  const text = pending ? dialogText[pending.kind] : null;

  return (
    <>
      <CollectionList
        collection={collection}
        data={data}
        loadError={loadError}
        busyIds={busyDocs}
        notices={
          <>
            {notices}
            {blocked && (
              <Notice
                tone="bad"
                role="alert"
                className="mb-4"
                title={fill(t("list.blockedTitle"), { x: titleOf(blocked.doc) })}
                actions={
                  <>
                    <Button
                      type="button"
                      variant="primary"
                      size="touch"
                      onClick={() => {
                        setSummaryFor(blocked.doc.id);
                        setBlocked(null);
                        go({ section: collection, view: "edit", id: blocked.doc.id });
                      }}
                    >
                      {t("list.openEditor")}
                    </Button>
                    <Button type="button" variant="ghost" size="touch" onClick={() => setBlocked(null)}>
                      {t("dismiss")}
                    </Button>
                  </>
                }
              >
                <ul className="mt-1 list-disc pl-5">
                  {blocked.problems.map((problem) => (
                    <li key={`${problem.lang}-${problem.field}-${problem.kind}`}>{problemLabel(t, collection, problem)}</li>
                  ))}
                </ul>
              </Notice>
            )}
          </>
        }
        onReload={load}
        onNew={() => go({ section: collection, view: "new" })}
        onEdit={(doc) => go({ section: collection, view: "edit", id: doc.id })}
        onHistory={(id) => go({ section: collection, view: "history", id })}
        onTogglePublish={askPublish}
        onMove={move}
        onMoveTo={moveTo}
        onDelete={(doc) => setPending({ kind: "delete", doc })}
        onRestoreDeleted={(item) => setPending({ kind: "restoreDeleted", item })}
        language={language}
      />
      <ConfirmDialog
        open={pending !== null}
        tone={pending?.kind === "delete" ? "danger" : "calm"}
        title={text ? fill(t(text.title), { x: pendingTitle }) : ""}
        body={text ? t(text.body) : ""}
        confirmLabel={text ? t(text.confirm) : ""}
        item={pending ? { title: pendingTitle, meta: `${t(def.label)} · ${pendingId}` } : undefined}
        onConfirm={confirmPending}
        onCancel={() => setPending(null)}
      />
    </>
  );
};

export default CollectionPanel;
