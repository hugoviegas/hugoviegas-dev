import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { contentImages, resolveContentImage } from "@/content/images";
import type { FieldDef } from "./collectionConfig";
import { fieldId } from "./editorModel";
import { UPLOAD_KINDS } from "@/content/uploadPolicy";
import { acceptedTypes, maxMegabytes, uploadFile, UploadError } from "./blobUpload";
import { fitImage, fitNote, ImageFitError } from "./imageFit";
import CropField from "./CropField";
import { PROJECT_ASPECTS, type CropChoice } from "./cropModel";
import { useAdminT } from "./adminStrings";

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

// Project image: a bundled image, or a file uploaded to Blob for this project.
// An upload fills the image URL and its width and height; Save stores them.
const ProjectImageField = ({ def, path }: { def: FieldDef; path: string }) => {
  const t = useAdminT();
  const { register, setValue, watch, getFieldState, formState } = useFormContext();
  const value = (watch(path) as string) ?? "";
  const docId = (watch("id") as string) ?? "";
  const { error } = getFieldState(path, formState);
  const [file, setFile] = useState<File | null>(null);
  const [crop, setCrop] = useState<CropChoice | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ kind: "status" | "alert"; text: string } | null>(null);

  const id = fieldId(path);
  const fileId = `${id}-file`;
  const preview = resolveContentImage(value);
  const uploaded = value.startsWith("https://");

  const upload = async () => {
    if (!file) {
      setNotice({ kind: "alert", text: t("upload.chooseFile") });
      return;
    }
    setBusy(true);
    setNotice({ kind: "status", text: t("upload.preparing") });
    try {
      const fitted = await fitImage(file, UPLOAD_KINDS.project.maxBytes, { crop: crop?.rect });
      const note = fitNote(t("upload.compressedFrom"), fitted);
      setNotice({ kind: "status", text: `${t("upload.uploading")}${note}` });
      const url = await uploadFile("project", fitted.file, "cover", docId);
      setValue(path, url, { shouldDirty: true });
      setValue("imageWidth", fitted.width, { shouldDirty: true });
      setValue("imageHeight", fitted.height, { shouldDirty: true });
      setNotice({ kind: "status", text: `${t("upload.readyToSave")}${note}` });
    } catch (err) {
      const problem = err instanceof UploadError || err instanceof ImageFitError ? err.problem : "failed";
      const detail = problem === "failed" && err instanceof Error ? ` ${err.message}` : "";
      setNotice({ kind: "alert", text: `${t(`upload.${problem}`)}${detail}` });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor={id}>{t(def.label)}</Label>
        <select
          id={id}
          className={selectClass}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...register(path)}
        >
          {["", ...Object.keys(contentImages)].map((option) => (
            <option key={option} value={option}>
              {option || t("noneOption")}
            </option>
          ))}
          {uploaded && <option value={value}>{t("files.uploadedImage")}</option>}
        </select>
        {error && (
          <p id={`${id}-error`} className="text-sm text-destructive">
            {t("err.invalid")}
          </p>
        )}
      </div>
      {preview && (
        <img
          src={preview}
          alt=""
          width={160}
          height={90}
          className="h-[90px] w-40 rounded-md border border-border object-cover"
        />
      )}
      <div className="space-y-1.5">
        <Label htmlFor={fileId}>{t("files.projectFile")}</Label>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            id={fileId}
            type="file"
            accept={acceptedTypes("project")}
            aria-describedby={`${fileId}-hint`}
            className="max-w-sm"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          <Button type="button" variant="outline" onClick={() => void upload()} disabled={busy}>
            {busy ? t("upload.uploading") : t("files.upload")}
          </Button>
        </div>
        <p id={`${fileId}-hint`} className="text-xs text-muted-foreground">
          {t("files.imageLimit")} {maxMegabytes("project")} MB. {t("files.autoCompress")} {t("files.projectHint")}
        </p>
        <CropField file={file} aspects={PROJECT_ASPECTS} value={crop} onChange={setCrop} />
        <div aria-live="polite">
          {notice && (
            <p role={notice.kind} className={notice.kind === "alert" ? "text-sm text-destructive" : "text-sm"}>
              {notice.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectImageField;
