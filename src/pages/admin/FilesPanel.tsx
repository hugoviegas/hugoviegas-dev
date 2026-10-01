import { useCallback, useEffect, useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import heroImage from "@/assets/hugo-hero.webp";
import { getTranslation } from "@/config/translations";
import { loadSettings, saveSiteFiles, type ExistingSettings } from "./adminContent";
import { acceptedTypes, imageSize, maxMegabytes, uploadFile, UploadError } from "./blobUpload";
import { useAdminT, type AdminStringKey } from "./adminStrings";

type Notice = { kind: "status" | "alert"; text: string } | null;

const problemKey = (error: unknown): AdminStringKey =>
  error instanceof UploadError ? `upload.${error.problem}` : "upload.failed";

const describeError = (t: (key: AdminStringKey) => string, error: unknown) => {
  const detail = error instanceof UploadError && error.problem === "failed" ? ` ${error.message}` : "";
  return `${t(problemKey(error))}${detail}`;
};

// One labelled file input with its limits as a hint.
const FileField = ({
  id,
  label,
  hint,
  accept,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  accept: string;
  onChange: (file: File | null) => void;
}) => (
  <div className="space-y-1.5">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      type="file"
      accept={accept}
      aria-describedby={`${id}-hint`}
      onChange={(event) => onChange(event.target.files?.[0] ?? null)}
    />
    <p id={`${id}-hint`} className="text-xs text-muted-foreground">
      {hint}
    </p>
  </div>
);

const NoticeLine = ({ notice }: { notice: Notice }) => (
  <div aria-live="polite">
    {notice && (
      <p role={notice.kind} className={notice.kind === "alert" ? "text-sm text-destructive" : "text-sm"}>
        {notice.text}
      </p>
    )}
  </div>
);

// CV and profile photo: uploaded to Vercel Blob, referenced from settings/site.
const FilesPanel = () => {
  const t = useAdminT();
  const ids = useId();
  const [settings, setSettings] = useState<ExistingSettings | null | undefined>(undefined);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvNotice, setCvNotice] = useState<Notice>(null);
  const [cvBusy, setCvBusy] = useState(false);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [altEn, setAltEn] = useState("");
  const [altPt, setAltPt] = useState("");
  const [altError, setAltError] = useState(false);
  const [photoNotice, setPhotoNotice] = useState<Notice>(null);
  const [photoBusy, setPhotoBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const next = await loadSettings();
      setSettings(next);
      setAltEn(next?.profilePhoto?.alt.en ?? getTranslation("heroImageAlt", "EN"));
      setAltPt(next?.profilePhoto?.alt.ptBR ?? getTranslation("heroImageAlt", "PT"));
    } catch (error) {
      setLoadError(String(error));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const saveCv = async (event: FormEvent) => {
    event.preventDefault();
    if (!cvFile) {
      setCvNotice({ kind: "alert", text: t("upload.chooseFile") });
      return;
    }
    setCvBusy(true);
    setCvNotice({ kind: "status", text: t("upload.uploading") });
    try {
      const url = await uploadFile("cv", cvFile, "hugo-viegas-cv");
      await saveSiteFiles({ cv: { url, version: (settings?.cv?.version ?? 0) + 1 } }, settings ?? null);
      await load();
      setCvNotice({ kind: "status", text: t("upload.saved") });
    } catch (error) {
      setCvNotice({ kind: "alert", text: describeError(t, error) });
    } finally {
      setCvBusy(false);
    }
  };

  const savePhoto = async (event: FormEvent) => {
    event.preventDefault();
    const current = settings?.profilePhoto ?? null;
    const alt = { en: altEn.trim(), ptBR: altPt.trim() };
    if (!alt.en || !alt.ptBR) {
      setAltError(true);
      document.getElementById(`${ids}-alt-${alt.en ? "pt" : "en"}`)?.focus();
      return;
    }
    setAltError(false);
    if (!photoFile && !current) {
      setPhotoNotice({ kind: "alert", text: t("upload.chooseFile") });
      return;
    }
    setPhotoBusy(true);
    setPhotoNotice(photoFile ? { kind: "status", text: t("upload.uploading") } : null);
    try {
      let file = current ? { url: current.url, width: current.width, height: current.height } : null;
      if (photoFile) {
        const size = await imageSize(photoFile);
        file = { url: await uploadFile("profile", photoFile, "hugo-viegas"), ...size };
      }
      await saveSiteFiles(
        { profilePhoto: { ...file!, alt, version: (current?.version ?? 0) + 1 } },
        settings ?? null,
      );
      await load();
      setPhotoNotice({ kind: "status", text: t("upload.saved") });
    } catch (error) {
      setPhotoNotice({ kind: "alert", text: describeError(t, error) });
    } finally {
      setPhotoBusy(false);
    }
  };

  if (loadError) {
    return (
      <p role="alert" className="text-destructive">
        {t("loadError")} {loadError}
      </p>
    );
  }
  if (settings === undefined) return <p role="status">{t("loadingContent")}</p>;

  const photo = settings?.profilePhoto ?? null;
  const altErrorId = `${ids}-alt-error`;

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">{t("files.intro")}</p>

      <form onSubmit={saveCv} noValidate aria-labelledby={`${ids}-cv-title`} className="space-y-4 rounded-lg border border-border p-4">
        <h3 id={`${ids}-cv-title`} className="heading-card">
          {t("files.cvTitle")}
        </h3>
        <p className="text-sm">
          {settings?.cv ? (
            <a href={settings.cv.url} target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4">
              {t("files.cvCurrent")} (v{settings.cv.version})
            </a>
          ) : (
            t("files.cvFallback")
          )}
        </p>
        <FileField
          id={`${ids}-cv`}
          label={t("files.cvFile")}
          hint={`${t("files.pdfLimit")} ${maxMegabytes("cv")} MB. ${t("files.publicHint")}`}
          accept={acceptedTypes("cv")}
          onChange={setCvFile}
        />
        <NoticeLine notice={cvNotice} />
        <Button type="submit" disabled={cvBusy}>
          {cvBusy ? t("saving") : t("files.uploadSave")}
        </Button>
      </form>

      <form onSubmit={savePhoto} noValidate aria-labelledby={`${ids}-photo-title`} className="space-y-4 rounded-lg border border-border p-4">
        <h3 id={`${ids}-photo-title`} className="heading-card">
          {t("files.photoTitle")}
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <img
            src={photo?.url ?? heroImage}
            alt={photo?.alt.en ?? getTranslation("heroImageAlt", "EN")}
            width={96}
            height={96}
            className="h-24 w-24 rounded-lg border border-border object-cover"
          />
          <p className="text-sm text-muted-foreground">
            {photo ? `${t("files.photoCurrent")} ${photo.width} × ${photo.height} px (v${photo.version})` : t("files.photoFallback")}
          </p>
        </div>
        <FileField
          id={`${ids}-photo`}
          label={t("files.photoFile")}
          hint={`${t("files.imageLimit")} ${maxMegabytes("profile")} MB. ${t("files.publicHint")}`}
          accept={acceptedTypes("profile")}
          onChange={setPhotoFile}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {(
            [
              ["en", altEn, setAltEn, "english"],
              ["pt", altPt, setAltPt, "portuguese"],
            ] as const
          ).map(([key, value, setValue, langLabel]) => {
            const id = `${ids}-alt-${key}`;
            const invalid = altError && !value.trim();
            return (
              <div key={key} className="space-y-1.5" lang={key === "en" ? "en" : "pt-BR"}>
                <Label htmlFor={id}>
                  {t("field.imageAlt")} · {t(langLabel)}
                </Label>
                <Input
                  id={id}
                  value={value}
                  maxLength={200}
                  aria-invalid={invalid ? true : undefined}
                  aria-describedby={invalid ? altErrorId : undefined}
                  onChange={(event) => setValue(event.target.value)}
                />
              </div>
            );
          })}
        </div>
        {altError && (
          <p id={altErrorId} className="text-sm text-destructive">
            {t("files.altRequired")}
          </p>
        )}
        <NoticeLine notice={photoNotice} />
        <Button type="submit" disabled={photoBusy}>
          {photoBusy ? t("saving") : t("files.savePhoto")}
        </Button>
      </form>
    </div>
  );
};

export default FilesPanel;
