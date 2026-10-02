import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  EyeOff,
  GripVertical,
  ImageIcon,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BrickLoader from "@/components/brand/BrickLoader";
import IsoBrick from "@/components/brand/IsoBrick";
import { fallbackIcon, skillIcons } from "@/components/skillIconMap";
import { resolveContentImage } from "@/content/images";
import { useContentLang } from "@/content/store";
import type { SkillIconKey } from "@/content/skillIcons";
import { SKILL_GROUPS, type ContentCollection, type DocMeta, type SkillGroup } from "@/content/types";
import { cn } from "@/lib/utils";
import type { DeletedDoc, ExistingSettings } from "./adminContent";
import { collectionDefs, rowTitle } from "./collectionConfig";
import { restoredDoc } from "./editorModel";
import { fill, formatAdminDate } from "./format";
import type { ExistingDoc } from "./storedDoc";
import { useAdminT, type AdminStringKey } from "./adminStrings";
import { cardClass, Chip, focusRing, IconButton, inputClass, Notice, PageHeading, Sheet, StatusBadge } from "./ui";

interface ListData {
  stored: Record<string, ExistingDoc>;
  docs: DocMeta[];
  settings: ExistingSettings | null;
  deleted: DeletedDoc[];
}

type Filter = "all" | "published" | "drafts";

// Skill groups the public Skills section renders. The others stay in the
// admin (and the chatbot's knowledge) but are not shown on the site.
const SHOWN_SKILL_GROUPS = new Set(["programming", "it"]);

const block = (doc: DocMeta, lang: "en" | "ptBR") =>
  ((doc as unknown as Record<string, Record<string, unknown>>)[lang] ?? {}) as Record<string, unknown>;

const previewOf = (doc: DocMeta, lang: "en" | "ptBR") => {
  const text = block(doc, lang);
  const summary = Array.isArray(text.summary) ? text.summary[0] : text.summary;
  return String(text.description || text.label || summary || "").slice(0, 160);
};

export const LoadError = ({
  collection,
  error,
  onReload,
}: {
  collection: ContentCollection;
  error: string;
  onReload: () => void;
}) => {
  const t = useAdminT();
  return (
    <Notice
      tone="bad"
      role="alert"
      title={fill(t("list.loadErrorTitle"), { x: t(collectionDefs[collection].label).toLowerCase() })}
      actions={
        <Button type="button" variant="neutral" size="touch" onClick={() => void onReload()}>
          <RotateCcw aria-hidden="true" />
          {t("reload")}
        </Button>
      }
    >
      {t("list.loadErrorBody")} <span className="font-mono text-xs text-ink-3">({error})</span>
    </Notice>
  );
};

const Skeleton = ({ label }: { label: string }) => (
  <div aria-busy="true" className={cn(cardClass, "overflow-hidden")}>
    <p role="status" className="sr-only">
      {label}
    </p>
    {["w-[46%]", "w-[38%]", "w-[52%]", "w-[30%]"].map((width) => (
      <div key={width} aria-hidden="true" className="flex min-h-[68px] items-center gap-3.5 border-t border-border px-4 py-3 first:border-t-0">
        <span className="h-10 w-14 rounded-lg bg-surface-2" />
        <span className="flex flex-1 flex-col gap-2">
          <span className={cn("h-3 rounded bg-surface-2", width)} />
          <span className="h-2.5 w-24 rounded bg-surface-2" />
        </span>
        <span className="hidden h-6 w-20 rounded bg-surface-2 sm:block" />
        <span className="hidden h-9 w-40 rounded bg-surface-2 md:block" />
      </div>
    ))}
  </div>
);

const Thumb = ({ collection, doc }: { collection: ContentCollection; doc: DocMeta }) => {
  if (collection === "projects") {
    const src = resolveContentImage(String((doc as unknown as { image?: string }).image ?? ""));
    return src ? (
      <img src={src} alt="" width={56} height={40} loading="lazy" className="h-10 w-14 shrink-0 rounded-lg border border-border bg-stage object-cover" />
    ) : (
      <span aria-hidden="true" className="grid h-10 w-14 shrink-0 place-items-center rounded-lg border border-border bg-stage text-ink-3">
        <ImageIcon className="h-4 w-4" />
      </span>
    );
  }
  if (collection === "skills") {
    const key = String((doc as unknown as { iconKey?: string }).iconKey ?? "") as SkillIconKey;
    const Icon = (skillIcons[key] ?? fallbackIcon).icon;
    return (
      <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-surface-2">
        <Icon className="h-5 w-5" />
      </span>
    );
  }
  return null;
};

interface ListProps {
  collection: ContentCollection;
  data: ListData | null;
  loadError: string | null;
  busyIds: Set<string>;
  notices: ReactNode;
  language: "EN" | "PT";
  onReload: () => Promise<void>;
  onNew: () => void;
  onEdit: (doc: DocMeta) => void;
  onHistory: (id: string) => void;
  onTogglePublish: (doc: DocMeta) => void;
  onMove: (doc: DocMeta, direction: -1 | 1) => void;
  onMoveTo: (id: string, targetId: string) => void;
  onDelete: (doc: DocMeta) => void;
  onRestoreDeleted: (item: DeletedDoc) => void;
}

// The collection list: search and status filter, rows (cards below 1280 px),
// drag-and-drop reorder with Move up / Move down as the keyboard path, and
// the recovery area for deleted docs.
const CollectionList = ({
  collection,
  data,
  loadError,
  busyIds,
  notices,
  language,
  onReload,
  onNew,
  onEdit,
  onHistory,
  onTogglePublish,
  onMove,
  onMoveTo,
  onDelete,
  onRestoreDeleted,
}: ListProps) => {
  const t = useAdminT();
  const lang = useContentLang();
  const def = collectionDefs[collection];
  const label = t(def.label);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [armed, setArmed] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [moreFor, setMoreFor] = useState<DocMeta | null>(null);

  const docs = useMemo(() => data?.docs ?? [], [data]);
  const titleOf = (doc: DocMeta) => rowTitle(collection, doc, lang) || doc.id;
  const q = query.trim().toLowerCase();
  const filtering = q !== "" || filter !== "all";
  const visible = docs.filter(
    (doc) =>
      (filter === "all" || (filter === "published" ? doc.published : !doc.published)) &&
      (!q || titleOf(doc).toLowerCase().includes(q) || doc.id.includes(q)),
  );
  const published = docs.filter((doc) => doc.published).length;

  const scopeOf = (doc: DocMeta) => def.scope?.(doc) ?? "";
  // Skill groups follow the site's order; any unknown group goes last.
  const groupKeys = def.scope
    ? [...new Set(docs.map(scopeOf))].sort(
        (a, b) => (SKILL_GROUPS.indexOf(a as SkillGroup) + 1 || 99) - (SKILL_GROUPS.indexOf(b as SkillGroup) + 1 || 99),
      )
    : [""];
  const groups = groupKeys
    .map((key) => ({
      key,
      all: docs.filter((doc) => scopeOf(doc) === key),
      rows: visible.filter((doc) => scopeOf(doc) === key),
    }))
    .filter((group) => !def.scope || group.rows.length > 0);

  const endDrag = () => {
    setArmed(null);
    setDragId(null);
    setOverId(null);
  };

  const filterButton = (value: Filter, text: string, count: number) => (
    <button
      type="button"
      aria-pressed={filter === value}
      onClick={() => setFilter(value)}
      className={cn(
        "inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-[9px] px-3 text-sm font-semibold sm:flex-none",
        filter === value ? "bg-card text-foreground shadow-[0_2px_0_hsl(var(--shadow-hard)),0_0_0_1px_hsl(var(--border))]" : "text-ink-2 hover:text-foreground",
        focusRing,
      )}
    >
      {text}
      <span className="font-mono text-xs text-ink-3 max-[359px]:hidden">{count}</span>
    </button>
  );

  const row = (doc: DocMeta, scope: DocMeta[]) => {
    const title = titleOf(doc);
    const index = scope.findIndex((item) => item.id === doc.id);
    const busy = busyIds.has(doc.id);
    const dragFrom = dragId ? scope.findIndex((item) => item.id === dragId) : -1;
    const showDrop = dragId !== null && overId === doc.id && dragId !== doc.id && dragFrom !== -1;
    const dropBelow = showDrop && dragFrom < index;
    const text = block(doc, lang);
    const sub =
      collection === "experience" || collection === "education"
        ? [doc.id, String(text.period ?? "")].filter(Boolean).join(" · ")
        : doc.id;
    return (
      <li
        key={doc.id}
        draggable={armed === doc.id && !busy}
        onDragStart={(event) => {
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/plain", doc.id);
          setDragId(doc.id);
        }}
        onDragOver={(event) => {
          if (!dragId || dragFrom === -1) return;
          event.preventDefault();
          if (overId !== doc.id) setOverId(doc.id);
        }}
        onDrop={(event) => {
          event.preventDefault();
          if (dragId && dragId !== doc.id) onMoveTo(dragId, doc.id);
          endDrag();
        }}
        onDragEnd={endDrag}
        aria-busy={busy || undefined}
        className={cn(
          "relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2.5 rounded-2xl border border-border bg-card p-3.5 pb-2.5 shadow-e2 [grid-template-areas:'ti_badge'_'meta_meta'_'acts_acts']",
          "xl:min-h-[68px] xl:grid-cols-[44px_minmax(0,1fr)_56px_112px_416px] xl:rounded-none xl:border-0 xl:border-t xl:py-2 xl:pl-1.5 xl:pr-3 xl:shadow-none xl:[grid-template-areas:'handle_ti_meta_badge_acts'] xl:first:border-t-0",
          busy && "opacity-60",
          dragId === doc.id && "z-[2] rounded-xl opacity-70 ring-2 ring-primary",
        )}
      >
        {showDrop && (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute left-3 right-3 h-[3px] bg-primary before:absolute before:-left-1 before:-top-[5px] before:h-[13px] before:w-3 before:rounded-[3px] before:bg-primary",
              dropBelow ? "-bottom-[2px]" : "-top-[2px]",
            )}
          />
        )}
        <span
          aria-hidden="true"
          title={filtering ? undefined : t("list.dragHint")}
          onPointerDown={() => !filtering && setArmed(doc.id)}
          onPointerUp={() => !dragId && setArmed(null)}
          className={cn(
            "hidden h-[52px] w-11 place-items-center rounded-[10px] text-ink-3 [grid-area:handle] xl:grid",
            filtering ? "opacity-30" : "cursor-grab hover:bg-surface-2 hover:text-foreground active:cursor-grabbing",
          )}
        >
          <GripVertical className="h-[18px] w-[18px]" />
        </span>
        <div className="flex min-w-0 items-center gap-3 [grid-area:ti]">
          <Thumb collection={collection} doc={doc} />
          <div className="min-w-0">
            <b className="block truncate text-[15px] font-semibold leading-snug">{title}</b>
            <span className="mt-0.5 block truncate font-mono text-xs text-ink-3">{sub}</span>
          </div>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[13px] font-semibold text-ink-2 [grid-area:meta] xl:font-semibold">
          <span className="font-medium text-ink-3 xl:sr-only">{t("field.order")}</span>
          {doc.order}
        </span>
        <span className="self-start [grid-area:badge] xl:self-center">
          {busy ? (
            <Chip>
              <BrickLoader />
              {t("saving")}
            </Chip>
          ) : (
            <StatusBadge published={doc.published} label={t(doc.published ? "statusPublished" : "statusDraft")} />
          )}
        </span>
        <div
          role="group"
          aria-label={fill(t("list.actionsFor"), { x: title })}
          className="flex flex-wrap items-center gap-1 border-t border-border pt-2 [grid-area:acts] xl:flex-nowrap xl:justify-end xl:border-0 xl:pt-0"
        >
          <Button type="button" variant="neutral" size="touch" className="max-sm:px-3" disabled={busy} aria-label={fill(t("list.aria.edit"), { x: title })} onClick={() => onEdit(doc)}>
            <Pencil aria-hidden="true" />
            {t("edit")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="touch"
            className="max-sm:px-2.5 xl:min-w-[112px]"
            disabled={busy}
            aria-label={fill(t(doc.published ? "list.aria.unpublish" : "list.aria.publish"), { x: title })}
            onClick={() => onTogglePublish(doc)}
          >
            {t(doc.published ? "unpublish" : "publish")}
          </Button>
          <span aria-hidden="true" className="mx-1 hidden h-7 w-px bg-border xl:block" />
          <IconButton label={fill(t("list.aria.up"), { x: title })} tip={t("moveUp")} disabled={busy || index <= 0} onClick={() => onMove(doc, -1)}>
            <ArrowUp aria-hidden="true" />
          </IconButton>
          <IconButton
            label={fill(t("list.aria.down"), { x: title })}
            tip={t("moveDown")}
            disabled={busy || index === scope.length - 1}
            onClick={() => onMove(doc, 1)}
          >
            <ArrowDown aria-hidden="true" />
          </IconButton>
          <IconButton className="max-sm:hidden" label={fill(t("list.aria.history"), { x: title })} tip={t("history")} disabled={busy} onClick={() => onHistory(doc.id)}>
            <Clock aria-hidden="true" />
          </IconButton>
          <IconButton className="max-sm:hidden" danger label={fill(t("list.aria.delete"), { x: title })} tip={t("delete")} disabled={busy} onClick={() => onDelete(doc)}>
            <Trash2 aria-hidden="true" />
          </IconButton>
          <IconButton
            className="ml-auto sm:hidden"
            label={fill(t("list.aria.more"), { x: title })}
            aria-haspopup="dialog"
            disabled={busy}
            onClick={() => setMoreFor(doc)}
          >
            <MoreHorizontal aria-hidden="true" />
          </IconButton>
        </div>
      </li>
    );
  };

  let body: ReactNode;
  if (loadError) body = <LoadError collection={collection} error={loadError} onReload={onReload} />;
  else if (!data) body = <Skeleton label={fill(t("list.loading"), { x: label.toLowerCase() })} />;
  else if (docs.length === 0) {
    body = (
      <div className={cn(cardClass, "flex flex-col items-center gap-3 px-6 py-14 text-center")}>
        <IsoBrick shape="2x2" color="lightGray" className="mb-1.5 w-24" />
        <h2 className="text-xl font-extrabold">{fill(t("list.emptyTitle"), { x: label.toLowerCase() })}</h2>
        <p className="max-w-[44ch] text-ink-2">{t("list.emptyBody")}</p>
        <Button type="button" variant="primary" size="lg" onClick={onNew}>
          <Plus aria-hidden="true" />
          {t(`list.new.${collection}` as AdminStringKey)}
        </Button>
      </div>
    );
  } else {
    body = (
      <>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-[1_1_100%] sm:max-w-[380px] sm:flex-[1_1_260px]">
            <label htmlFor="admin-list-search" className="sr-only">
              {fill(t("list.searchLabel"), { x: label.toLowerCase() })}
            </label>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-3" aria-hidden="true" />
            <input
              id="admin-list-search"
              type="search"
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("list.searchPh")}
              className={cn(inputClass, "pl-[42px]")}
            />
          </div>
          <div role="group" aria-label={t("list.status")} className="flex flex-1 gap-0.5 rounded-xl bg-surface-2 p-[3px] sm:flex-none">
            {filterButton("all", t("list.all"), docs.length)}
            {filterButton("published", t("publishedLabel"), published)}
            {filterButton("drafts", t("draftsLabel"), docs.length - published)}
          </div>
          <p role="status" className="text-[13px] text-ink-3 sm:ml-auto">
            {fill(t("list.showing"), { a: visible.length, b: docs.length })}
          </p>
        </div>
        <p id="admin-reorder-help" className="sr-only">
          {t("list.reorderHelp")}
        </p>
        {visible.length === 0 ? (
          <div className={cn(cardClass, "flex flex-col items-center gap-3 px-6 py-10 text-center")}>
            <h2 className="text-base font-bold">{fill(t("list.noMatch"), { q: query.trim() || t(filter === "published" ? "publishedLabel" : "draftsLabel") })}</h2>
            <p className="text-ink-2">{t("list.noMatchBody")}</p>
            <Button
              type="button"
              variant="neutral"
              size="touch"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              {t("list.clearSearch")}
            </Button>
          </div>
        ) : (
          groups.map((group) => (
            <section key={group.key || "all"} aria-labelledby={`grp-${group.key || collection}`} className="mb-7 last:mb-0">
              {def.scope ? (
                <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
                  <h2 id={`grp-${group.key}`} className="text-xl font-extrabold tracking-[-0.01em]">
                    {t(`group.${group.key}` as AdminStringKey)}
                  </h2>
                  <span className="font-mono text-xs text-ink-3">{fill(t("list.count"), { n: group.rows.length })}</span>
                  {SHOWN_SKILL_GROUPS.has(group.key) ? (
                    <Chip>
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      {t("list.shown")}
                    </Chip>
                  ) : (
                    <span className="inline-flex min-h-6 items-center gap-1.5 rounded-md border border-dashed border-line-strong px-2 text-xs font-semibold text-ink-2">
                      <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                      {t("list.notShown")}
                    </span>
                  )}
                </div>
              ) : (
                <h2 id={`grp-${collection}`} className="sr-only">
                  {label}
                </h2>
              )}
              <ul
                aria-describedby="admin-reorder-help"
                className="flex flex-col gap-3 xl:gap-0 xl:overflow-hidden xl:rounded-2xl xl:border xl:border-border xl:bg-card xl:shadow-e2"
              >
                {group.rows.map((doc) => row(doc, group.all))}
              </ul>
            </section>
          ))
        )}
      </>
    );
  }

  const deleted = data?.deleted ?? [];

  return (
    <>
      <PageHeading
        title={label}
        sub={t(`list.sub.${collection}` as AdminStringKey)}
        actions={
          <Button type="button" variant="primary" size="lg" onClick={onNew}>
            <Plus aria-hidden="true" />
            {t(`list.new.${collection}` as AdminStringKey)}
          </Button>
        }
      />
      {def.hint && <p className="mb-4 text-sm text-ink-2">{t(def.hint)}</p>}
      {notices}
      {body}
      {data && (
        <section aria-labelledby="recovery-title" className="mt-7 rounded-2xl border border-dashed border-line-strong">
          <button
            type="button"
            aria-expanded={recoveryOpen}
            aria-controls="recovery-list"
            onClick={() => setRecoveryOpen((open) => !open)}
            className={cn("flex min-h-14 w-full items-center gap-2.5 rounded-2xl px-4 text-left text-[15px] font-bold", focusRing)}
          >
            <Trash2 className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="flex-1">
              <span id="recovery-title">{t("list.recoveryTitle")}</span> <span className="font-mono text-xs font-medium text-ink-3">({deleted.length})</span>
            </span>
            <span className="hidden text-[13px] font-normal text-ink-3 md:inline">{t("list.recoveryHint")}</span>
            {recoveryOpen ? <ChevronUp className="h-5 w-5" aria-hidden="true" /> : <ChevronDown className="h-5 w-5" aria-hidden="true" />}
          </button>
          {recoveryOpen && (
            <ul id="recovery-list" className="border-t border-dashed border-line-strong">
              {deleted.length === 0 && <li className="px-4 py-3 text-sm text-ink-2">{t("list.recoveryEmpty")}</li>}
              {deleted.map((item) => {
                const doc = restoredDoc(item.id, item.data);
                const title = rowTitle(collection, doc, lang) || item.id;
                const preview = previewOf(doc, lang);
                return (
                  <li key={item.id} className="grid grid-cols-[minmax(0,1fr)] items-center gap-3 border-t border-border px-4 py-3 first:border-t-0 sm:grid-cols-[minmax(0,1fr)_auto]">
                    <div className="min-w-0">
                      <b className="block break-words text-[15px]">{title}</b>
                      <span className="font-mono text-xs text-ink-3">
                        {item.id} · {fill(t("list.deletedOn"), { d: formatAdminDate(item.deletedAt, language) })}
                      </span>
                      {preview && <p className="mt-0.5 line-clamp-2 text-[13px] text-ink-2">{preview}</p>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="neutral" size="touch" onClick={() => onRestoreDeleted(item)} aria-label={fill(t("list.aria.restore"), { x: title })}>
                        <RotateCcw aria-hidden="true" />
                        {t("restore")}
                      </Button>
                      <Button type="button" variant="ghost" size="touch" onClick={() => onHistory(item.id)} aria-label={fill(t("list.aria.history"), { x: title })}>
                        {t("history")}
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
      <Sheet
        open={moreFor !== null}
        onOpenChange={(open) => !open && setMoreFor(null)}
        title={moreFor ? titleOf(moreFor) : ""}
        closeLabel={t("shell.close")}
      >
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="neutral"
            size="lg"
            onClick={() => {
              const doc = moreFor;
              setMoreFor(null);
              if (doc) onHistory(doc.id);
            }}
          >
            <Clock aria-hidden="true" />
            {t("history")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="text-destructive"
            onClick={() => {
              const doc = moreFor;
              setMoreFor(null);
              if (doc) onDelete(doc);
            }}
          >
            <Trash2 aria-hidden="true" />
            {t("delete")}
          </Button>
        </div>
      </Sheet>
    </>
  );
};

export default CollectionList;
