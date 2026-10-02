import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Crop, ExternalLink, RefreshCw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hugo-hero.webp";
import minifigImage from "@/assets/brand/hugo-minifig.webp";
import { getTranslation } from "@/config/translations";
import { FALLBACK_CV_URL } from "@/content/siteFiles";
import { UPLOAD_KINDS } from "@/content/uploadPolicy";
import type { AvatarFace, ProfilePhoto, SiteFiles } from "@/content/types";
import { cn } from "@/lib/utils";
import { loadSettings, saveSiteFiles, type ExistingSettings } from "./adminContent";
import { useAdminSummary } from "./AdminSummary";
import { useToast } from "./AdminToasts";
import { acceptedTypes, maxMegabytes, uploadFile, UploadError } from "./blobUpload";
import ConfirmDialog from "./ConfirmDialog";
import CropDialog from "./CropDialog";
import { PROFILE_ASPECTS, type CropRect } from "./cropModel";
import { fill } from "./format";
import { fitImage, ImageFitError, MAX_SOURCE_BYTES } from "./imageFit";
import { useAdminT, type AdminStringKey } from "./adminStrings";
import { cardClass, Chip, focusRing, inputClass, monoLabel, Notice, PageHeading, UploadProgress } from "./ui";

type Translate = (key: AdminStringKey) => string;

type Phase =
  | { step: "idle" }
  | { step: "compress" }
  | { step: "upload"; progress: number; note: string }
  | { step: "done"; note: string };

const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(bytes < 1024 * 1024 ? 2 : 1)} MB`;

const describeError = (t: Translate, error: unknown) => {
  const problem = error instanceof UploadError || error instanceof ImageFitError ? error.problem : "failed";
  const detail = problem === "failed" && error instanceof Error && error.message ? ` ${error.message}` : "";
  return `${t(`upload.${problem}` as AdminStringKey)}${detail}`;
};

const errorText = (error: unknown) => (error instanceof Error ? error.message : String(error));

const busy = (phase: Phase) => phase.step === "compress" || phase.step === "upload";

// Progress, then the saved note, for one upload. Errors are shown separately.
const PhaseNotice = ({ phase }: { phase: Phase }) => {
  const t = useAdminT();
  if (phase.step === "idle") return null;
  if (phase.step === "done") {
    return (
      <Notice tone="ok" role="status" title={t("files.doneTitle")}>
        {t("files.doneBody")} {phase.note}
      </Notice>
    );
  }
  return (
    <Notice tone="info" role="status" title={phase.step === "compress" ? t("upload.preparing") : fill(t("image.uploading"), { p: Math.round(phase.progress) })}>
      {phase.step === "upload" && (
        <>
          {phase.note}
          <span className="mt-2.5 block">
            <UploadProgress value={phase.progress} label={t("image.stepUpload")} />
          </span>
        </>
      )}
    </Notice>
  );
};

// ---------------------------------------------------------------- CV

const CvCard = ({ cv, save }: { cv: SiteFiles["cv"]; save: (value: SiteFiles["cv"]) => Promise<void> }) => {
  const t = useAdminT();
  const toast = useToast();
  const fileInput = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>({ step: "idle" });
  const [problem, setProblem] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const name = cv ? decodeURIComponent(cv.url.split("/").pop() ?? "") : t("files.bundled");

  const upload = async (file: File | null) => {
    if (!file) return;
    setProblem(null);
    const note = `${file.name} · ${mb(file.size)}`;
    try {
      setPhase({ step: "upload", progress: 0, note });
      const url = await uploadFile("cv", file, "hugo-viegas-cv", undefined, (progress) =>
        setPhase({ step: "upload", progress, note }),
      );
      await save({ url, version: (cv?.version ?? 0) + 1 });
      setPhase({ step: "done", note: "" });
    } catch (error) {
      setProblem(describeError(t, error));
      setPhase({ step: "idle" });
    } finally {
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const reset = async () => {
    setConfirmReset(false);
    setPhase({ step: "idle" });
    try {
      await save(null);
      toast("ok", t("files.resetDone"));
    } catch (error) {
      toast("bad", `${t("saveError")} ${errorText(error)}`);
    }
  };

  return (
    <section aria-labelledby="files-cv" className={cn(cardClass, "p-5 sm:p-6")}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h2 id="files-cv" className="flex-1 text-xl font-extrabold tracking-[-0.01em]">
          {t("files.cv")}
        </h2>
        <Chip>{fill(t("files.cvLimit"), { mb: maxMegabytes("cv") })}</Chip>
      </div>
      <div className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[56px_minmax(0,1fr)_auto]">
        <span aria-hidden="true" className="grid h-[68px] w-14 place-items-center rounded-lg border border-line-strong bg-surface-2 font-mono text-xs font-bold text-ink-2 shadow-e1">
          PDF
        </span>
        <div className="min-w-0">
          <p className="break-words font-semibold">{name}</p>
          <p className={cn(monoLabel, "mt-1 normal-case tracking-normal")}>
            {cv ? fill(t("files.cvMeta"), { n: cv.version }) : t("files.cvDefault")}
          </p>
          <a
            href={cv?.url ?? FALLBACK_CV_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("inline-flex min-h-11 items-center gap-1.5 rounded-sm font-semibold text-primary underline-offset-4 hover:underline", focusRing)}
          >
            {t("files.openPdf")}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">{t("files.newTab")}</span>
          </a>
        </div>
        <div className="col-span-2 flex flex-wrap gap-2 sm:col-span-1">
          <input
            ref={fileInput}
            type="file"
            accept={acceptedTypes("cv")}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            data-testid="cv-file"
            onChange={(event) => void upload(event.target.files?.[0] ?? null)}
          />
          <Button type="button" variant="neutral" size="touch" disabled={busy(phase)} onClick={() => fileInput.current?.click()}>
            <Upload aria-hidden="true" />
            {t("files.replace")}
          </Button>
          {cv && (
            <Button type="button" variant="ghost" size="touch" disabled={busy(phase)} onClick={() => setConfirmReset(true)}>
              {t("files.resetDefault")}
            </Button>
          )}
        </div>
      </div>
      <div className="mt-4 space-y-3 empty:hidden">
        <PhaseNotice phase={phase} />
        {problem && (
          <Notice tone="bad" role="alert">
            {problem}
          </Notice>
        )}
      </div>
      <ConfirmDialog
        open={confirmReset}
        tone="calm"
        title={fill(t("files.resetTitle"), { x: t("files.cv") })}
        body={t("files.resetBody")}
        confirmLabel={t("files.resetDefault")}
        onConfirm={() => void reset()}
        onCancel={() => setConfirmReset(false)}
      />
    </section>
  );
};

// ---------------------------------------------------------------- Avatars

type SlotKey = "profilePhoto" | "avatarMinifig";

interface SlotDef {
  key: SlotKey;
  face: AvatarFace;
  title: AdminStringKey;
  uploadName: string;
  bundled: string;
  defaultAlt: { en: string; ptBR: string };
}

const SLOTS: SlotDef[] = [
  {
    key: "profilePhoto",
    face: "photo",
    title: "files.photo",
    uploadName: "hugo-viegas",
    bundled: heroImage,
    defaultAlt: { en: getTranslation("heroImageAlt", "EN"), ptBR: getTranslation("heroImageAlt", "PT") },
  },
  {
    key: "avatarMinifig",
    face: "minifig",
    title: "files.minifig",
    uploadName: "hugo-minifig",
    bundled: minifigImage,
    defaultAlt: { en: "Hugo as a LEGO minifigure", ptBR: "Hugo como uma minifigura LEGO" },
  },
];

const AvatarSlot = ({
  slot,
  current,
  save,
}: {
  slot: SlotDef;
  current: ProfilePhoto | null;
  save: (value: ProfilePhoto | null) => Promise<void>;
}) => {
  const t = useAdminT();
  const toast = useToast();
  const ids = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState(current?.alt ?? slot.defaultAlt);
  const [altError, setAltError] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<Phase>({ step: "idle" });
  const [problem, setProblem] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [saving, setSaving] = useState(false);
  const title = t(slot.title);
  const headingId = `${ids}-title`;
  const src = current?.url ?? slot.bundled;
  const working = busy(phase) || saving;

  // A new stored version (upload, reset, restore) resets the alt fields.
  useEffect(() => {
    setAlt(current?.alt ?? slot.defaultAlt);
    setAltError(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when the stored text changes
  }, [current?.version, current?.alt.en, current?.alt.ptBR]);

  const cleanAlt = () => {
    const clean = { en: alt.en.trim(), ptBR: alt.ptBR.trim() };
    if (!clean.en || !clean.ptBR) {
      setAltError(true);
      document.getElementById(`${ids}-alt-${clean.en ? "pt" : "en"}`)?.focus();
      return null;
    }
    setAltError(false);
    return clean;
  };

  const choose = () => {
    if (!cleanAlt()) return;
    setProblem(null);
    fileInput.current?.click();
  };

  // Crop the image in use again (uploaded or bundled), then upload the result.
  const recrop = async () => {
    if (!cleanAlt()) return;
    setProblem(null);
    try {
      const response = await fetch(src);
      if (!response.ok) throw new Error(String(response.status));
      const blob = await response.blob();
      setCropFile(new File([blob], `${slot.uploadName}.${blob.type.split("/")[1] ?? "webp"}`, { type: blob.type }));
    } catch {
      setProblem(t("files.cropLoadFailed"));
    }
  };

  const upload = async (rect: CropRect) => {
    const file = cropFile;
    setCropFile(null);
    const clean = cleanAlt();
    if (!file || !clean) return;
    try {
      setPhase({ step: "compress" });
      const fitted = await fitImage(file, UPLOAD_KINDS.profile.maxBytes, { crop: rect });
      const size = mb(fitted.file.size);
      const note =
        fitted.originalBytes === undefined
          ? fill(t("files.sizeNote"), { w: fitted.width, h: fitted.height, size })
          : fill(t("image.compressed"), { w: fitted.width, h: fitted.height, size, from: mb(fitted.originalBytes) });
      setPhase({ step: "upload", progress: 0, note });
      const url = await uploadFile("profile", fitted.file, slot.uploadName, undefined, (progress) =>
        setPhase({ step: "upload", progress, note }),
      );
      await save({ url, width: fitted.width, height: fitted.height, alt: clean, version: (current?.version ?? 0) + 1 });
      setPhase({ step: "done", note });
    } catch (error) {
      setProblem(describeError(t, error));
      setPhase({ step: "idle" });
    } finally {
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const saveAlt = async () => {
    const clean = cleanAlt();
    if (!clean || !current) return;
    setSaving(true);
    try {
      await save({ ...current, alt: clean, version: current.version + 1 });
      toast("ok", t("files.altSaved"));
    } catch (error) {
      toast("bad", `${t("saveError")} ${errorText(error)}`);
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    setConfirmReset(false);
    setPhase({ step: "idle" });
    setSaving(true);
    try {
      await save(null);
      toast("ok", t("files.resetDone"));
    } catch (error) {
      toast("bad", `${t("saveError")} ${errorText(error)}`);
    } finally {
      setSaving(false);
    }
  };

  const altChanged = current !== null && (alt.en.trim() !== current.alt.en || alt.ptBR.trim() !== current.alt.ptBR);
  const errorId = `${ids}-alt-error`;
  const hintId = `${ids}-alt-hint`;

  return (
    <div role="group" aria-labelledby={headingId} className="flex min-w-0 flex-col gap-4 rounded-xl border border-border bg-background p-4">
      <h3 id={headingId} className="text-base font-bold">
        {title}
      </h3>
      <div className="flex items-center gap-4">
        <img
          src={src}
          alt={current?.alt.en ?? slot.defaultAlt.en}
          width={112}
          height={112}
          className="h-28 w-28 shrink-0 rounded-full border border-border bg-surface-2 object-cover shadow-[0_0_0_4px_hsl(var(--card))]"
        />
        <div className="flex min-w-0 flex-col items-start gap-2">
          {current ? <Chip tone="solid">{fill(t("files.uploadedV"), { n: current.version })}</Chip> : <Chip>{t("files.bundled")}</Chip>}
          {current && <p className="text-[13px] text-ink-3">{fill(t("files.pixels"), { w: current.width, h: current.height })}</p>}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          ref={fileInput}
          type="file"
          accept={acceptedTypes("profile")}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          data-testid={`${slot.key}-file`}
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            if (file) setCropFile(file);
          }}
        />
        <Button type="button" variant="neutral" size="touch" disabled={working} onClick={choose}>
          <Upload aria-hidden="true" />
          {t("files.replace")}
        </Button>
        <Button type="button" variant="ghost" size="touch" disabled={working} onClick={() => void recrop()}>
          <Crop aria-hidden="true" />
          {t("files.crop")}
        </Button>
        {current && (
          <Button type="button" variant="ghost" size="touch" disabled={working} onClick={() => setConfirmReset(true)}>
            {t("files.resetDefault")}
          </Button>
        )}
      </div>
      <PhaseNotice phase={phase} />
      {problem && (
        <Notice tone="bad" role="alert">
          {problem}
        </Notice>
      )}
      {(
        [
          ["en", "image.altEn"],
          ["ptBR", "image.altPt"],
        ] as const
      ).map(([lang, label]) => {
        const id = `${ids}-alt-${lang === "en" ? "en" : "pt"}`;
        const invalid = altError && !alt[lang].trim();
        return (
          <div key={lang} className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-semibold">
              {t(label)}
            </label>
            <input
              id={id}
              lang={lang === "en" ? "en" : "pt-BR"}
              className={inputClass}
              value={alt[lang]}
              maxLength={200}
              aria-invalid={invalid ? true : undefined}
              aria-describedby={[current ? null : hintId, invalid ? errorId : null].filter(Boolean).join(" ") || undefined}
              onChange={(event) => setAlt((value) => ({ ...value, [lang]: event.target.value }))}
            />
          </div>
        );
      })}
      {altError && (
        <p id={errorId} className="text-[13px] font-semibold text-destructive">
          {t("files.altRequired")}
        </p>
      )}
      {current ? (
        <div>
          <Button type="button" variant="neutral" size="touch" disabled={!altChanged || working} onClick={() => void saveAlt()}>
            {saving ? t("saving") : t("files.altSave")}
          </Button>
        </div>
      ) : (
        <p id={hintId} className="text-[13px] text-ink-3">
          {t("files.altDefaultHint")}
        </p>
      )}
      {cropFile && (
        <CropDialog
          file={cropFile}
          aspects={PROFILE_ASPECTS}
          initial={null}
          onApply={(choice) => void upload(choice.rect)}
          onCancel={() => {
            setCropFile(null);
            if (fileInput.current) fileInput.current.value = "";
          }}
        />
      )}
      <ConfirmDialog
        open={confirmReset}
        tone="calm"
        title={fill(t("files.resetTitle"), { x: title })}
        body={t("files.resetBody")}
        confirmLabel={t("files.resetDefault")}
        onConfirm={() => void reset()}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
};

// Which face the hero shows first, with a preview that flips like the site.
const AvatarPreview = ({
  sources,
  first,
  onFirst,
  disabled,
}: {
  sources: Record<AvatarFace, string>;
  first: AvatarFace;
  onFirst: (face: AvatarFace) => void;
  disabled: boolean;
}) => {
  const t = useAdminT();
  const ids = useId();
  const [flipped, setFlipped] = useState(false);
  const back: AvatarFace = first === "photo" ? "minifig" : "photo";
  const faceClass =
    "absolute inset-0 overflow-hidden rounded-full shadow-[0_0_0_4px_hsl(var(--card)),0_0_0_5px_hsl(var(--border))] [backface-visibility:hidden]";

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface-2 p-4">
      <fieldset className="w-full" disabled={disabled}>
        <legend className="mb-2 text-sm font-semibold">{t("files.shownFirst")}</legend>
        <div className="grid grid-cols-2 gap-1 rounded-lg border border-line-strong bg-card p-1">
          {(["photo", "minifig"] as const).map((face) => (
            <label
              key={face}
              className="relative flex min-h-11 cursor-pointer items-center justify-center rounded-md px-3 text-sm font-semibold text-ink-2 has-[:checked]:bg-primary-tint has-[:checked]:text-foreground has-[:checked]:shadow-[inset_0_0_0_1px_hsl(var(--primary))] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:disabled]:cursor-not-allowed"
            >
              <input
                type="radio"
                name={`${ids}-first`}
                value={face}
                checked={first === face}
                onChange={() => {
                  setFlipped(false);
                  onFirst(face);
                }}
                className="sr-only"
              />
              {t(face === "photo" ? "files.photo" : "files.minifig")}
            </label>
          ))}
        </div>
      </fieldset>
      <button
        type="button"
        aria-pressed={flipped}
        aria-label={t("files.flipLabel")}
        onClick={() => setFlipped((value) => !value)}
        className={cn("group relative h-40 w-40 shrink-0 rounded-full [perspective:800px]", focusRing, "focus-visible:ring-offset-8 focus-visible:ring-offset-surface-2")}
      >
        <span
          className={cn(
            "absolute inset-0 transition-transform duration-flip ease-inout [transform-style:preserve-3d] motion-reduce:transition-none",
            flipped && "[transform:rotateY(180deg)]",
          )}
        >
          <span className={faceClass}>
            <img src={sources[first]} alt="" className="h-full w-full object-cover" />
          </span>
          <span className={cn(faceClass, "[transform:rotateY(180deg)]")}>
            <img src={sources[back]} alt="" className="h-full w-full object-cover" />
          </span>
        </span>
        <span
          aria-hidden="true"
          className="absolute bottom-1 right-0 z-10 grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_0_3px_hsl(var(--surface-2))]"
        >
          <RefreshCw className="h-4 w-4" strokeWidth={2.2} />
        </span>
      </button>
      <p className="max-w-[30ch] text-center text-[13px] text-ink-3">{t("files.flipHint")}</p>
    </div>
  );
};

// ---------------------------------------------------------------- Panel

// CV and avatar images: uploaded to Vercel Blob, referenced from settings/site.
const FilesPanel = () => {
  const t = useAdminT();
  const toast = useToast();
  const { reportSettings } = useAdminSummary();
  const [settings, setSettings] = useState<ExistingSettings | null | undefined>(undefined);
  const [loadError, setLoadError] = useState<string | null>(null);
  // The chosen face shows at once; it reverts if the save fails.
  const [pendingFirst, setPendingFirst] = useState<AvatarFace | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const next = await loadSettings();
      setSettings(next);
      reportSettings(next);
    } catch (error) {
      setLoadError(errorText(error));
    }
  }, [reportSettings]);

  useEffect(() => {
    void load();
  }, [load]);

  // Every change writes the whole settings doc (the previous one goes to history).
  const write = async (changes: Partial<SiteFiles>) => {
    await saveSiteFiles(changes, settings ?? null);
    await load();
  };

  const setFirst = async (face: AvatarFace) => {
    setPendingFirst(face);
    try {
      await write({ avatarFirst: face });
      toast("ok", fill(t("files.firstSaved"), { x: t(face === "photo" ? "files.photo" : "files.minifig") }));
    } catch (error) {
      toast("bad", `${t("saveError")} ${errorText(error)}`);
    } finally {
      setPendingFirst(null);
    }
  };

  const heading = <PageHeading id="files-title" title={t("tab.files")} sub={t("files.sub")} />;

  if (loadError) {
    return (
      <section aria-labelledby="files-title">
        {heading}
        <Notice
          tone="bad"
          role="alert"
          title={t("loadError")}
          actions={
            <Button type="button" variant="neutral" size="touch" onClick={() => void load()}>
              {t("reload")}
            </Button>
          }
        >
          {loadError}
        </Notice>
      </section>
    );
  }
  if (settings === undefined) {
    return (
      <section aria-labelledby="files-title">
        {heading}
        <p role="status">{t("loadingContent")}</p>
      </section>
    );
  }

  const sources: Record<AvatarFace, string> = {
    photo: settings?.profilePhoto?.url ?? heroImage,
    minifig: settings?.avatarMinifig?.url ?? minifigImage,
  };
  const limits: [string, AdminStringKey][] = [
    [`${maxMegabytes("cv")} MB`, "files.limCv"],
    [`${maxMegabytes("profile")} MB`, "files.limProfile"],
    [`${maxMegabytes("project")} MB`, "files.limProject"],
    [`${MAX_SOURCE_BYTES / 1024 / 1024} MB`, "files.limInput"],
  ];

  return (
    <section aria-labelledby="files-title">
      {heading}
      <div className="grid gap-5">
        <CvCard cv={settings?.cv ?? null} save={(cv) => write({ cv })} />

        <section aria-labelledby="files-avatars" className={cn(cardClass, "p-5 sm:p-6")}>
          <div className="mb-4 flex flex-wrap items-start gap-2">
            <div className="flex-1">
              <h2 id="files-avatars" className="text-xl font-extrabold tracking-[-0.01em]">
                {t("files.avTitle")}
              </h2>
              <p className="mt-1 text-sm text-ink-2">{t("files.avSub")}</p>
            </div>
            <Chip>{fill(t("files.avLimit"), { mb: maxMegabytes("profile") })}</Chip>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_260px]">
            {SLOTS.map((slot) => (
              <AvatarSlot key={slot.key} slot={slot} current={settings?.[slot.key] ?? null} save={(value) => write({ [slot.key]: value })} />
            ))}
            <div className="md:col-span-2 xl:col-span-1">
              <AvatarPreview
                sources={sources}
                first={pendingFirst ?? settings?.avatarFirst ?? "photo"}
                onFirst={(face) => void setFirst(face)}
                disabled={pendingFirst !== null}
              />
            </div>
          </div>
        </section>

        <section aria-labelledby="files-limits" className={cn(cardClass, "p-5 sm:p-6")}>
          <h2 id="files-limits" className="text-xl font-extrabold tracking-[-0.01em]">
            {t("files.limitsTitle")}
          </h2>
          <p className="mb-4 mt-1 text-sm text-ink-2">{t("files.limitsSub")}</p>
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {limits.map(([value, label]) => (
              <div key={label} className="flex flex-col-reverse justify-end gap-1 rounded-xl border border-border bg-surface-2 p-4">
                <dt className="text-[13px] text-ink-2">{t(label)}</dt>
                <dd className="text-2xl font-extrabold tracking-[-0.02em]">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </section>
  );
};

export default FilesPanel;
