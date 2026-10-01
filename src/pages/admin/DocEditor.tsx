import { useState } from "react";
import { Controller, FormProvider, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { schemaByCollection } from "@/content/schema";
import type { ContentCollection, DocMeta } from "@/content/types";
import { collectionDefs } from "./collectionConfig";
import { cleanDoc, fieldId } from "./editorModel";
import { FieldInput } from "./FieldInputs";
import { useAdminT } from "./adminStrings";

interface DocEditorProps {
  collection: ContentCollection;
  initial: DocMeta;
  isNew: boolean;
  existingIds: Set<string>;
  onSave: (value: DocMeta) => Promise<void>;
  onCancel: () => void;
}

type FormValues = DocMeta & Record<string, unknown>;

// Side-by-side EN / PT-BR editor. Validation is the same Zod schema the public
// refresh uses, so a doc that saves here also renders there; publishing with
// an empty language fails it.
const DocEditor = ({ collection, initial, isNew, existingIds, onSave, onCancel }: DocEditorProps) => {
  const t = useAdminT();
  const def = collectionDefs[collection];
  const [saving, setSaving] = useState(false);
  const zod = zodResolver(schemaByCollection[collection]) as unknown as Resolver<FormValues>;
  const resolver: Resolver<FormValues> = (values, context, options) =>
    zod(cleanDoc(collection, values), context, options);
  const form = useForm<FormValues>({
    defaultValues: initial as FormValues,
    resolver,
    shouldFocusError: true,
  });
  const { handleSubmit, register, control, setError, formState } = form;

  const submit = handleSubmit(async (value) => {
    if (isNew && existingIds.has(value.id)) {
      setError("id", { type: "idTaken" }, { shouldFocus: true });
      return;
    }
    setSaving(true);
    try {
      await onSave(value);
    } finally {
      setSaving(false);
    }
  });

  const idError = formState.errors.id;

  return (
    <FormProvider {...form}>
      <form onSubmit={submit} noValidate className="space-y-6" aria-labelledby="doc-editor-title">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 id="doc-editor-title" className="heading-card">
            {t(isNew ? "editorNew" : "editorEdit")} · {t(def.label)}
          </h3>
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("back")}
          </Button>
        </div>

        {def.hint && <p className="text-sm text-muted-foreground">{t(def.hint)}</p>}

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor={fieldId("id")}>{t("field.id")}</Label>
            <Input
              id={fieldId("id")}
              readOnly={!isNew}
              aria-invalid={idError ? true : undefined}
              aria-describedby={idError ? `${fieldId("id")}-error` : undefined}
              {...register("id")}
            />
            {idError && (
              <p id={`${fieldId("id")}-error`} className="text-sm text-destructive">
                {t(idError.type === "idTaken" ? "err.idTaken" : "err.format")}
              </p>
            )}
          </div>
          <FieldInput def={{ name: "order", label: "field.order", kind: "number" }} path="order" />
          <div className="flex items-center gap-3 pt-6">
            <Controller
              control={control}
              name="published"
              render={({ field }) => (
                <Switch
                  id={fieldId("published")}
                  checked={Boolean(field.value)}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor={fieldId("published")}>{t("field.published")}</Label>
          </div>
        </div>

        {def.shared.length > 0 && (
          <fieldset className="space-y-4 rounded-lg border border-border p-4">
            <legend className="px-1 text-sm font-semibold">{t("sharedFields")}</legend>
            {def.shared.map((field) => (
              <FieldInput key={field.name} def={field} path={field.name} />
            ))}
          </fieldset>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          {(["en", "ptBR"] as const).map((lang) => (
            <fieldset
              key={lang}
              lang={lang === "en" ? "en" : "pt-BR"}
              className="space-y-4 rounded-lg border border-border p-4"
            >
              <legend className="px-1 text-sm font-semibold">
                {t(lang === "en" ? "english" : "portuguese")}
              </legend>
              {def.localized.map((field) => (
                <FieldInput key={field.name} def={field} path={`${lang}.${field.name}`} />
              ))}
            </fieldset>
          ))}
        </div>

        {formState.submitCount > 0 && Object.keys(formState.errors).length > 0 && (
          <p role="alert" className="text-sm text-destructive">
            {t("formHasErrors")}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? t("saving") : t("save")}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("cancel")}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default DocEditor;
