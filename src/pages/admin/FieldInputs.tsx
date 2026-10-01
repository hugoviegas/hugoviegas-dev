import { Controller, useFieldArray, useFormContext, type FieldError as RhfError } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FieldDef } from "./collectionConfig";
import { fieldId } from "./editorModel";
import { useAdminT, type AdminStringKey } from "./adminStrings";

const errorKey = (error: RhfError): AdminStringKey => {
  switch (error.type) {
    case "custom":
      return "err.publishBoth";
    case "too_big":
      return "err.tooLong";
    case "invalid_string":
      return "err.format";
    case "idTaken":
      return "err.idTaken";
    default:
      return "err.invalid";
  }
};

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

// Label, input, hint, and error for one field, wired for screen readers.
export const FieldInput = ({ def, path }: { def: FieldDef; path: string }) => {
  const t = useAdminT();
  const { register, control, getFieldState, formState } = useFormContext();
  const { error } = getFieldState(path, formState);
  const id = fieldId(path);
  const describedBy = [def.hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  const common = { id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy };

  if (def.kind === "objects") return <ObjectList def={def} path={path} />;

  let input: JSX.Element;
  switch (def.kind) {
    case "textarea":
      input = <Textarea {...common} rows={def.rows ?? 3} {...register(path)} />;
      break;
    case "number":
      input = <Input {...common} type="number" inputMode="numeric" {...register(path, { valueAsNumber: true })} />;
      break;
    case "select":
      input = (
        <select {...common} className={selectClass} {...register(path)}>
          {(def.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option || t("noneOption")}
            </option>
          ))}
        </select>
      );
      break;
    case "lines":
      // Blank lines are kept while typing and dropped before validation.
      input = (
        <Controller
          control={control}
          name={path}
          render={({ field }) => (
            <Textarea
              {...common}
              rows={def.rows ?? 4}
              value={Array.isArray(field.value) ? field.value.join("\n") : ""}
              onChange={(event) => field.onChange(event.target.value.split("\n"))}
              onBlur={field.onBlur}
              ref={field.ref}
            />
          )}
        />
      );
      break;
    default:
      input = <Input {...common} {...register(path)} />;
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{t(def.label)}</Label>
      {input}
      {def.hint && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {t(def.hint)}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {t(errorKey(error))}
        </p>
      )}
    </div>
  );
};

const emptyItem = (fields: FieldDef[]) =>
  Object.fromEntries(fields.map((field) => [field.name, field.kind === "lines" ? [] : ""]));

// A repeatable group (FAQ items, highlights, sections) inside one language.
const ObjectList = ({ def, path }: { def: FieldDef; path: string }) => {
  const t = useAdminT();
  const { control } = useFormContext();
  // keyName avoids clashing with the items' own `id` field (sections).
  const { fields, append, remove } = useFieldArray({ control, name: path, keyName: "_key" });
  const fieldsOf = def.fields ?? [];

  return (
    <fieldset className="space-y-3 rounded-lg border border-border p-3">
      <legend className="px-1 text-sm font-medium">{t(def.label)}</legend>
      {fields.map((item, index) => (
        <div key={item._key} className="space-y-3 rounded-md border border-border/60 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">
              {t("itemLabel")} {index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(index)}
              aria-label={`${t("removeItem")} ${index + 1}: ${t(def.label)}`}
            >
              {t("removeItem")}
            </Button>
          </div>
          {fieldsOf.map((sub) => (
            <FieldInput key={sub.name} def={sub} path={`${path}.${index}.${sub.name}`} />
          ))}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => append(emptyItem(fieldsOf))}>
        {t("addItem")}
      </Button>
    </fieldset>
  );
};
