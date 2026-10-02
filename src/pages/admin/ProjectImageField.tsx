import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { ImageIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contentImages, resolveContentImage } from "@/content/images";
import { UPLOAD_KINDS } from "@/content/uploadPolicy";
import { cn } from "@/lib/utils";
import type { FieldDef } from "./collectionConfig";
import { listHistory } from "./adminContent";
import { fieldId } from "./editorModel";
import { acceptedTypes, maxMegabytes, uploadFile, UploadError } from "./blobUpload";
import { fitImage, ImageFitError } from "./imageFit";
import CropDialog from "./CropDialog";
import { PROJECT_ASPECTS, type CropChoice } from "./cropModel";
import { fill } from "./format";
import { FieldShell } from "./FieldInputs";
import { useAdminT, type AdminStringKey } from "./adminStrings";
import { focusRing, inputClass, Notice, UploadProgress } from "./ui";

type Step = "idle" | "crop" | "compress" | "upload" | "done";

const STEPS: { key: Exclude<Step, "idle">; label: AdminStringKey }[] = [
  { key: "crop", label: "image.stepCrop" },
  { key: "compress", label: "image.stepCompress" },
  { key: "upload", label: "image.stepUpload" },
  { key: "done", label: "image.stepSave" },
];

const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(bytes < 1024 * 1024 ? 2 : 1)} MB`;

// Project image: pick a bundled image, reuse an earlier upload, or upload a
// new one (choose, crop, compress, upload). The upload fills the image URL and
// its size; saving the project makes it live. Alt text sits beside the image.
const ProjectImageField = ({ def, path }: { def: FieldDef; path: string }) => {
  const t = useAdminT();
  const { register, setValue, watch, getFieldState, formState, getValues } = useFormContext();
  const value = String(watch(path) ?? "");
  const docId = String(watch("id") ?? "");
  const width = Number(watch("imageWidth") ?? 0);
  const height = Number(watch("imageHeight") ?? 0);
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<Step>("idle");
  const [progress, setProgress] = useState(0);
  const [note, setNote] = useState("");
  const [problem, setProblem] = useState<string | null>(null);
  const [earlier, setEarlier] = useState<string[]>([]);
  const id = fieldId(path);
  const preview = resolveContentImage(value);
  const uploaded = value.startsWith("https://");

  // Earlier uploads of this project, taken from its history.
  useEffect(() => {
    if (!docId) return;
    let live = true;
    listHistory("projects", docId)
      .then((entries) => {
        if (!live) return;
        const urls = entries.map((entry) => String(entry.data.image ?? "")).filter((url) => url.startsWith("https://"));
        setEarlier([...new Set(urls)]);
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [docId]);

  const pick = (image: string, size?: { width: number; height: number }) => {
    setValue(path, image, { shouldDirty: true });
    if (size) {
      setValue("imageWidth", size.width, { shouldDirty: true });
      setValue("imageHeight", size.height, { shouldDirty: true });
    }
  };

  const pickBundled = (key: string) => {
    const img = new Image();
    img.onload = () => pick(key, { width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => pick(key);
    img.src = contentImages[key];
  };

  const pickEarlier = (url: string) => {
    const img = new Image();
    img.onload = () => pick(url, { width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => pick(url);
    img.src = url;
  };

  const choose = (next: File | null) => {
    setProblem(null);
    setNote("");
    if (!next) return;
    setFile(next);
    setStep("crop");
  };

  const upload = async (rect?: CropChoice["rect"]) => {
    if (!file) return;
    try {
      setStep("compress");
      const fitted = await fitImage(file, UPLOAD_KINDS.project.maxBytes, { crop: rect });
      setNote(
        fill(t("image.compressed"), {
          w: fitted.width,
          h: fitted.height,
          size: mb(fitted.file.size),
          from: mb(file.size),
        }),
      );
      setStep("upload");
      setProgress(0);
      const url = await uploadFile("project", fitted.file, "cover", docId, setProgress);
      pick(url, { width: fitted.width, height: fitted.height });
      setStep("done");
    } catch (err) {
      const kind = err instanceof UploadError || err instanceof ImageFitError ? err.problem : "failed";
      const detail = kind === "failed" && err instanceof Error ? ` ${err.message}` : "";
      setProblem(`${t(`upload.${kind}` as AdminStringKey)}${detail}`);
      setStep("idle");
    } finally {
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const altCells = (["en", "ptBR"] as const).map((lang) => {
    const altPath = `${lang}.imageAlt`;
    const altId = fieldId(altPath);
    const { error } = getFieldState(altPath, formState);
    const missing = !String(getValues(altPath) ?? "").trim();
    const errorText = error
      ? error.type === "custom"
        ? fill(t("err.requiredIn"), { l: lang === "en" ? t("lang.inEnglish") : t("lang.inPortuguese") })
        : t("err.tooLong")
      : undefined;
    return (
      <FieldShell
        key={lang}
        id={altId}
        label={t(lang === "en" ? "image.altEn" : "image.altPt")}
        required
        missing={missing}
        error={errorText}
      >
        <input
          id={altId}
          lang={lang === "en" ? "en" : "pt-BR"}
          className={inputClass}
          aria-invalid={error ? true : undefined}
          aria-required
          aria-describedby={[`${id}-alt-hint`, errorText && `${altId}-error`].filter(Boolean).join(" ")}
          {...register(altPath)}
        />
      </FieldShell>
    );
  });

  const stepIndex = STEPS.findIndex((item) => item.key === step);
  const busy = step === "compress" || step === "upload";

  return (
    <FieldShell id={id} label={t(def.label)} labelFor={false}>
      <div className="grid gap-5 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-stage">
            {preview ? (
              <img src={preview} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="absolute inset-0 grid place-content-center justify-items-center gap-2 text-sm text-ink-3">
                <ImageIcon className="h-8 w-8" aria-hidden="true" />
                {t("image.none")}
              </span>
            )}
            {preview && (
              <span className="absolute bottom-2 left-2 inline-flex h-[26px] items-center rounded-md bg-foreground px-2 font-mono text-[11px] font-semibold tracking-[0.04em] text-background">
                {uploaded ? t("image.uploaded") : t("image.bundled")}
              </span>
            )}
          </div>
          <p className="mt-2 text-[13px] text-ink-3">
            {preview && width > 0 ? fill(t("image.size"), { w: width, h: height }) : t("image.sizeAuto")}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <input
              ref={fileInput}
              id={`${id}-file`}
              type="file"
              accept={acceptedTypes("project")}
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
              onChange={(event) => choose(event.target.files?.[0] ?? null)}
            />
            <Button
              type="button"
              variant="neutral"
              size="touch"
              disabled={busy}
              aria-describedby={`${id}-limits`}
              onClick={() => fileInput.current?.click()}
            >
              <Upload aria-hidden="true" />
              {t("image.upload")}
            </Button>
            {value && (
              <Button type="button" variant="ghost" size="touch" disabled={busy} onClick={() => pick("", { width: 0, height: 0 })}>
                {t("image.remove")}
              </Button>
            )}
          </div>
          <p id={`${id}-limits`} className="mt-2 text-[13px] text-ink-3">
            {fill(t("image.limits"), { mb: maxMegabytes("project") })}
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          {step !== "idle" && step !== "crop" && (
            <div>
              <ol aria-label={t("image.steps")} className="mb-2.5 flex flex-wrap items-center gap-1.5">
                {STEPS.map((item, index) => (
                  <li
                    key={item.key}
                    aria-current={index === stepIndex ? "step" : undefined}
                    className={cn(
                      "inline-flex min-h-7 items-center gap-1.5 rounded-full py-0 pl-1.5 pr-2.5 text-xs font-semibold",
                      index < stepIndex && "bg-surface-2 text-foreground",
                      index === stepIndex && "bg-primary-tint text-foreground ring-1 ring-primary",
                      index > stepIndex && "bg-surface-2 text-ink-3",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid h-[18px] w-[18px] place-items-center rounded-full font-mono text-[10px] font-bold",
                        index < stepIndex ? "bg-primary text-primary-foreground" : index === stepIndex ? "bg-foreground text-background" : "bg-surface-3 text-ink-2",
                      )}
                    >
                      {index + 1}
                    </span>
                    {t(item.label)}
                  </li>
                ))}
              </ol>
              {step === "upload" && (
                <UploadProgress value={progress} label={t("image.stepUpload")} />
              )}
              <p role="status" className="mt-2 text-[13px] text-ink-2">
                {step === "compress" && t("upload.preparing")}
                {step === "upload" && `${fill(t("image.uploading"), { p: Math.round(progress) })} ${note}`}
                {step === "done" && note}
              </p>
              {step === "done" && (
                <Notice tone="ok" className="mt-2.5" title={t("image.doneTitle")}>
                  {t("image.doneBody")}
                </Notice>
              )}
            </div>
          )}
          {problem && (
            <Notice tone="bad" role="alert">
              {problem}
            </Notice>
          )}

          <div>
            <p className="mb-1.5 text-sm font-semibold">{t("image.bundledTitle")}</p>
            <div role="group" aria-label={t("image.bundledTitle")} className="flex flex-wrap gap-2">
              {Object.entries(contentImages).map(([key, src]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={value === key}
                  aria-label={key}
                  onClick={() => pickBundled(key)}
                  className={cn(
                    "h-14 w-[76px] overflow-hidden rounded-lg border border-border bg-stage",
                    value === key && "ring-2 ring-primary ring-offset-2 ring-offset-card",
                    focusRing,
                  )}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          {earlier.length > 0 && (
            <div>
              <p className="mb-1.5 text-sm font-semibold">{t("image.earlier")}</p>
              <div role="group" aria-label={t("image.earlier")} className="flex flex-wrap gap-2">
                {earlier.map((url, index) => (
                  <button
                    key={url}
                    type="button"
                    aria-pressed={value === url}
                    aria-label={fill(t("image.earlierItem"), { n: earlier.length - index })}
                    onClick={() => pickEarlier(url)}
                    className={cn(
                      "h-14 w-[76px] overflow-hidden rounded-lg border border-border bg-stage",
                      value === url && "ring-2 ring-primary ring-offset-2 ring-offset-card",
                      focusRing,
                    )}
                  >
                    <img src={url} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">{altCells}</div>
          <p id={`${id}-alt-hint`} className="text-[13px] text-ink-3">
            {t("image.altHint")}
          </p>
        </div>
      </div>
      {step === "crop" && file && (
        <CropDialog
          file={file}
          aspects={PROJECT_ASPECTS}
          initial={null}
          onApply={(choice) => void upload(choice.rect)}
          onCancel={() => {
            setStep("idle");
            setFile(null);
            if (fileInput.current) fileInput.current.value = "";
          }}
        />
      )}
    </FieldShell>
  );
};

export default ProjectImageField;
