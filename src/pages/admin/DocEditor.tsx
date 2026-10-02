import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Check, Clock, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrickLoader from "@/components/brand/BrickLoader";
import { FlagBR, FlagGB } from "@/components/brand/Flags";
import { useLanguage } from "@/hooks/useLanguage";
import { schemaByCollection } from "@/content/schema";
import { useContentLang } from "@/content/store";
import type { ContentCollection, DocMeta } from "@/content/types";
import { cn } from "@/lib/utils";
import { collectionDefs, rowTitle } from "./collectionConfig";
import { cleanDoc, fieldId, publishProblems } from "./editorModel";
import { FieldInput, FieldShell, MissingTag } from "./FieldInputs";
import { fill, formatAdminDate } from "./format";
import { problemLabel } from "./problemLabels";
import { useAdminT } from "./adminStrings";
import { BrickSwitch, cardClass, focusRing, inputClass, Notice, PageHeading } from "./ui";

interface DocEditorProps {
  collection: ContentCollection;
  initial: DocMeta;
  isNew: boolean;
  existingIds: Set<string>;
  onSave: (value: DocMeta) => Promise<boolean | void>;
  onCancel: () => void;
  onHistory?: () => void;
  /** Show the publish summary on open (Publish was pressed in the list). */
  startWithSummary?: boolean;
  onDirtyChange?: (dirty: boolean) => void;
  registerSave?: (save: (() => Promise<boolean>) | null) => void;
}

type FormValues = DocMeta & Record<string, unknown>;
type Lang = "en" | "ptBR";
type SaveState = "idle" | "saving" | "saved" | "failed";

const LANGS: Lang[] = ["en", "ptBR"];

// EN / PT-BR editor. Wide screens show both languages side by side, one row
// per field; narrower screens use language tabs. Validation is the same Zod
// schema the public refresh uses. Publishing with missing text is blocked and
// a summary names each missing field and language.
const DocEditor = ({
  collection,
  initial,
  isNew,
  existingIds,
  onSave,
  onCancel,
  onHistory,
  startWithSummary = false,
  onDirtyChange,
  registerSave,
}: DocEditorProps) => {
  const t = useAdminT();
  const { language } = useLanguage();
  const contentLang = useContentLang();
  const def = collectionDefs[collection];
  const [saveState, setSaveState] = useState<SaveState>("idle");
  // Save was pressed (shows field errors) / Publish was tried (shows the summary).
  const [attempted, setAttempted] = useState(false);
  const [publishAttempt, setPublishAttempt] = useState(startWithSummary);
  const [tab, setTab] = useState<Lang>("en");
  const summaryRef = useRef<HTMLDivElement>(null);
  const zod = zodResolver(schemaByCollection[collection]) as unknown as Resolver<FormValues>;
  const resolver: Resolver<FormValues> = (values, context, options) =>
    zod(cleanDoc(collection, values), context, options);
  const form = useForm<FormValues>({
    defaultValues: initial as FormValues,
    resolver,
    shouldFocusError: false,
  });
  const { handleSubmit, register, setError, formState, watch, setValue, setFocus } = form;
  const values = watch();
  const published = Boolean(values.published);

  // Required text still empty, per language (live, whatever the status).
  const problems = useMemo(() => publishProblems(collection, values as DocMeta), [collection, values]);
  const missing = problems.filter((problem) => problem.kind === "missing");
  const isMissing = (lang: Lang, name: string) => missing.some((problem) => problem.lang === lang && problem.field === name);
  const missingIn = (lang: Lang) => missing.filter((problem) => problem.lang === lang).length;
  const required = useMemo(() => {
    // A field is required when it shows up as missing for an empty doc.
    const empty = { ...initial, ...def.empty() } as unknown as DocMeta;
    return new Set(publishProblems(collection, empty).filter((p) => p.kind === "missing").map((p) => p.field));
  }, [collection, def, initial]);

  const focusSummary = () => window.setTimeout(() => summaryRef.current?.focus(), 0);
  useEffect(() => {
    if (startWithSummary) focusSummary();
  }, [startWithSummary]);

  const saveValue = async (value: FormValues) => {
    if (isNew && existingIds.has(value.id)) {
      setError("id", { type: "idTaken" }, { shouldFocus: true });
      return false;
    }
    setSaveState("saving");
    try {
      const ok = (await onSave(value)) !== false;
      setSaveState(ok ? "saved" : "failed");
      return ok;
    } catch {
      setSaveState("failed");
      return false;
    }
  };

  const onInvalid = () => {
    setAttempted(true);
    if (published && missing.length > 0) {
      focusSummary();
      return;
    }
    const first = Object.keys(formState.errors)[0];
    if (first) setFocus(first as never);
  };

  const submit = handleSubmit(async (value) => {
    await saveValue(value);
  }, onInvalid);

  // A new doc always counts as unsaved; an existing one once a field changes.
  const dirty = isNew || formState.isDirty;
  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);
  useEffect(() => () => onDirtyChange?.(false), [onDirtyChange]);
  useEffect(() => {
    if (dirty && saveState === "saved") setSaveState("idle");
  }, [dirty, saveState]);

  // Lets the unsaved-changes dialog run "Save and leave".
  useEffect(() => {
    if (!registerSave) return;
    registerSave(
      () =>
        new Promise<boolean>((resolve) => {
          void handleSubmit(
            async (value) => resolve(await saveValue(value)),
            () => {
              onInvalid();
              resolve(false);
            },
          )();
        }),
    );
    return () => registerSave(null);
  });

  // Turning Published on checks both languages first.
  const togglePublished = () => {
    if (!published && missing.length > 0) {
      setPublishAttempt(true);
      focusSummary();
      return;
    }
    setValue("published", !published, { shouldDirty: true });
  };

  const goToProblem = (lang: Lang | null, field: string) => {
    if (lang) setTab(lang);
    window.setTimeout(() => {
      const el = document.getElementById(fieldId(lang ? `${lang}.${field}` : field));
      el?.scrollIntoView?.({ block: "center" });
      el?.focus();
    }, 0);
  };

  const title = isNew
    ? fill(t("editor.newTitle"), { x: t(`list.new.${collection}` as never) })
    : collection === "about"
      ? t("col.about")
      : rowTitle(collection, initial, contentLang) || initial.id;
  const sub = isNew
    ? fill(t("editor.subNew"), { c: t(def.label) })
    : fill(t("editor.sub"), { c: t(def.label), v: initial.version, d: formatAdminDate(initial.updatedAt, language) });
  const idError = formState.errors.id;
  const showSummary = missing.length > 0 && (publishAttempt || (attempted && published));
  const sharedFields = def.shared;
  const textFields = def.localized.filter((field) => !field.inImage);
  const langName = (lang: Lang) => t(lang === "en" ? "english" : "portuguese");

  const flag = (lang: Lang) => (
    <span aria-hidden="true" className="relative h-4 w-6 shrink-0 overflow-hidden rounded-[3px] shadow-[0_0_0_1px_hsl(var(--border))]">
      {lang === "en" ? <FlagGB /> : <FlagBR />}
    </span>
  );

  return (
    <FormProvider {...form}>
      <form onSubmit={submit} noValidate aria-labelledby="doc-editor-title">
        <PageHeading
          id="doc-editor-title"
          title={title}
          sub={sub}
          actions={
            <>
              {dirty && !isNew && (
                <span className="inline-flex min-h-7 items-center gap-2 rounded-full bg-surface-2 px-2.5 text-[13px] font-semibold">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-foreground" />
                  {t("editor.unsaved")}
                </span>
              )}
              {onHistory && !isNew && (
                <Button type="button" variant="ghost" size="touch" onClick={onHistory}>
                  <Clock aria-hidden="true" />
                  {t("history")}
                </Button>
              )}
            </>
          }
        />
        {def.hint && <p className="mb-4 text-sm text-ink-2">{t(def.hint)}</p>}

        {showSummary && (
          <div ref={summaryRef} tabIndex={-1} className="mb-5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Notice
              tone="bad"
              role="alert"
              title={missing.length === 1 ? t("editor.summaryOne") : fill(t("editor.summaryMany"), { n: missing.length })}
            >
              {t("editor.summaryBody")}
              <ul className="mt-2 flex flex-col gap-0.5">
                {missing.map((problem) => (
                  <li key={`${problem.lang}-${problem.field}`}>
                    <a
                      href={`#${fieldId(problem.lang ? `${problem.lang}.${problem.field}` : problem.field)}`}
                      onClick={(event) => {
                        event.preventDefault();
                        goToProblem(problem.lang, problem.field);
                      }}
                      className={cn("inline-flex min-h-9 items-center gap-2 font-semibold text-foreground underline underline-offset-[3px]", focusRing)}
                    >
                      {problemLabel(t, collection, problem)}
                    </a>
                  </li>
                ))}
              </ul>
            </Notice>
          </div>
        )}

        {/* Meta row */}
        <div className={cn(cardClass, "grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.4fr)] lg:items-end")}>
          <FieldShell
            id={fieldId("id")}
            label={t("field.idShort")}
            extra={!isNew ? <Lock className="h-4 w-4 text-ink-3" aria-hidden="true" /> : null}
            hint={t(isNew ? "editor.idNew" : "editor.idLocked")}
            error={idError ? t(idError.type === "idTaken" ? "err.idTaken" : "err.format") : undefined}
          >
            <input
              id={fieldId("id")}
              readOnly={!isNew}
              spellCheck={false}
              autoComplete="off"
              className={inputClass}
              aria-invalid={idError ? true : undefined}
              aria-describedby={[`${fieldId("id")}-hint`, idError && `${fieldId("id")}-error`].filter(Boolean).join(" ")}
              {...register("id")}
            />
          </FieldShell>
          <FieldInput def={{ name: "order", label: "field.order", kind: "number", hint: "editor.orderHint" }} path="order" />
          <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
            <span id="doc-status-label" className="text-sm font-semibold">
              {t("list.status")}
            </span>
            <BrickSwitch
              checked={published}
              onClick={togglePublished}
              labelledBy="doc-status-label"
              valueId="doc-status-value"
              valueText={t(published ? "editor.pubOn" : "editor.pubOff")}
            />
          </div>
        </div>

        {sharedFields.length > 0 && (
          <section aria-labelledby="doc-shared" className="mt-6">
            <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 id="doc-shared" className="text-xl font-extrabold tracking-[-0.01em]">
                {t("editor.bothLangs")}
              </h2>
              <p className="text-[13px] text-ink-3">{t("editor.bothHint")}</p>
            </div>
            <div className={cn(cardClass, "grid gap-5 p-4 sm:p-5 md:grid-cols-2")}>
              {sharedFields.map((field) => (
                <div key={field.name} className={cn("min-w-0", (field.wide || field.kind === "image") && "md:col-span-2")}>
                  <FieldInput def={field} path={field.name} />
                </div>
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="doc-text" className="mt-6">
          <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 id="doc-text" className="text-xl font-extrabold tracking-[-0.01em]">
              {t("editor.textEach")}
            </h2>
            <p className="text-[13px] text-ink-3">{t("editor.textEachHint")}</p>
          </div>
          <div className={cn(cardClass, "overflow-hidden")}>
            {/* Tabs below 1024 px */}
            <div role="tablist" aria-label={t("editor.language")} className="flex gap-1 border-b border-border bg-surface-2 p-1.5 lg:hidden">
              {LANGS.map((lang) => (
                <button
                  key={lang}
                  id={`doc-tab-${lang}`}
                  type="button"
                  role="tab"
                  aria-selected={tab === lang}
                  aria-controls="doc-text-panel"
                  onClick={() => setTab(lang)}
                  className={cn(
                    "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[10px] px-2.5 text-sm font-semibold",
                    tab === lang ? "bg-card text-foreground shadow-[0_2px_0_hsl(var(--shadow-hard)),0_0_0_1px_hsl(var(--border))]" : "text-ink-2",
                    focusRing,
                  )}
                >
                  {flag(lang)}
                  {lang === "en" ? t("english") : t("editor.portugueseShort")}
                  {missingIn(lang) > 0 && <MissingTag />}
                </button>
              ))}
            </div>
            {/* Column heads from 1024 px */}
            <div className="hidden grid-cols-2 border-b border-border bg-surface-2 lg:grid">
              {LANGS.map((lang) => (
                <div key={lang} className="flex min-h-14 items-center gap-2.5 px-5 py-3 [&+&]:border-l [&+&]:border-border">
                  {flag(lang)}
                  <b className="text-[15px]">{langName(lang)}</b>
                  <span className="ml-auto">
                    {missingIn(lang) === 0 ? (
                      <span className="inline-flex min-h-6 items-center gap-1.5 rounded-md border border-primary-tint-2 bg-primary-tint px-2 text-xs font-semibold">
                        <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        {t("editor.complete")}
                      </span>
                    ) : (
                      <span className="inline-flex min-h-6 items-center gap-1.5 rounded-md border border-destructive bg-error-tint px-2 text-xs font-semibold">
                        <AlertCircle className="h-3.5 w-3.5 text-destructive" aria-hidden="true" />
                        {fill(t("editor.nMissing"), { n: missingIn(lang) })}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div id="doc-text-panel" role="tabpanel" aria-labelledby={`doc-tab-${tab}`} >
              {textFields.map((field) => (
                <div key={field.name} className="grid border-t border-border first:border-t-0 lg:grid-cols-2">
                  {LANGS.map((lang) => (
                    <div
                      key={lang}
                      lang={lang === "en" ? "en" : "pt-BR"}
                      className={cn(
                        "min-w-0 p-4 sm:px-5 lg:[&+&]:border-l lg:[&+&]:border-border",
                        tab !== lang && "max-lg:hidden",
                        showSummary && isMissing(lang, field.name) && "bg-error-tint/50",
                      )}
                    >
                      <FieldInput
                        def={field}
                        path={`${lang}.${field.name}`}
                        required={required.has(field.name)}
                        missing={isMissing(lang, field.name)}
                        langName={langName(lang)}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sticky save bar */}
        <div
          role="region"
          aria-label={t("editor.saveBar")}
          className="sticky bottom-0 z-30 -mx-4 mt-8 flex items-center gap-3 border-t border-border bg-card px-4 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-3px_0_hsl(var(--shadow-hard))] sm:-mx-6 sm:px-6 lg:-mx-7 lg:px-7 xl:-mx-10 xl:px-10"
        >
          <p role="status" className={cn("flex min-w-0 flex-1 items-center gap-2 text-sm text-ink-2", saveState === "failed" && "text-destructive")}>
            {saveState === "saving" ? (
              <>
                <BrickLoader className="text-primary" />
                {t("saving")}
              </>
            ) : saveState === "failed" ? (
              <>
                <AlertCircle className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                <span className="truncate">{t("editor.saveFailed")}</span>
              </>
            ) : dirty ? (
              <>
                <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-foreground" />
                <span className="truncate">{t("editor.unsaved")}</span>
              </>
            ) : saveState === "saved" ? (
              <>
                <Check className="h-[18px] w-[18px] shrink-0 text-primary" aria-hidden="true" />
                <span className="truncate">{t("editor.saved")}</span>
              </>
            ) : (
              <span className="truncate max-[359px]:hidden">{t("editor.noChanges")}</span>
            )}
          </p>
          {attempted && Object.keys(formState.errors).length > 0 && !showSummary && (
            <p role="alert" className="sr-only">
              {t("formHasErrors")}
            </p>
          )}
          <Button type="button" variant="ghost" size="lg" onClick={onCancel}>
            {t("cancel")}
          </Button>
          <Button type="submit" variant="primary" size="lg" disabled={saveState === "saving" || (!dirty && saveState !== "failed")}>
            {saveState === "saving" ? t("saving") : saveState === "failed" ? t("retry") : t("save")}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default DocEditor;
