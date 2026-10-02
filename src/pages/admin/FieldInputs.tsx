import { useState, type ReactNode } from "react";
import { Controller, useFieldArray, useFormContext, type FieldError as RhfError } from "react-hook-form";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AlertCircle, ArrowDown, ArrowUp, ChevronDown, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fallbackIcon, skillIcons } from "@/components/skillIconMap";
import type { SkillIconKey } from "@/content/skillIcons";
import { cn } from "@/lib/utils";
import type { FieldDef } from "./collectionConfig";
import { dialogContentClass } from "./ConfirmDialog";
import { fieldId } from "./editorModel";
import { fill } from "./format";
import { useAdminT, type AdminStringKey } from "./adminStrings";
import ProjectImageField from "./ProjectImageField";
import { focusRing, IconButton, inputClass } from "./ui";

const errorText = (t: (key: AdminStringKey) => string, error: RhfError, path: string) => {
  switch (error.type) {
    case "custom": {
      const lang = path.startsWith("ptBR.") ? t("lang.inPortuguese") : t("lang.inEnglish");
      return fill(t("err.requiredIn"), { l: lang });
    }
    case "too_big":
      return t("err.tooLong");
    case "invalid_string":
      return t("err.format");
    case "idTaken":
      return t("err.idTaken");
    default:
      return t("err.invalid");
  }
};

export const RequiredTag = () => {
  const t = useAdminT();
  return (
    <span aria-hidden="true" className="font-mono text-[11px] font-semibold tracking-[0.04em] text-ink-3">
      {t("editor.required")}
    </span>
  );
};

export const MissingTag = () => {
  const t = useAdminT();
  return (
    <span aria-hidden="true" className="inline-flex h-5 items-center rounded bg-error-tint px-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.04em] text-destructive">
      {t("editor.missing")}
    </span>
  );
};

// Label row, control, hint and error for one field, wired for screen readers.
export const FieldShell = ({
  id,
  label,
  labelFor = true,
  required,
  missing,
  hint,
  error,
  extra,
  children,
  langName,
}: {
  id: string;
  label: string;
  labelFor?: boolean;
  required?: boolean;
  missing?: boolean;
  hint?: string;
  error?: string;
  extra?: ReactNode;
  children: ReactNode;
  langName?: string;
}) => {
  const labelContent = (
    <>
      {label}
      {langName && <span className="sr-only"> ({langName})</span>}
      {required && <RequiredTag />}
      {missing && <MissingTag />}
      {extra}
    </>
  );
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      {labelFor ? (
        <label htmlFor={id} className="flex flex-wrap items-center gap-2 text-sm font-semibold">
          {labelContent}
        </label>
      ) : (
        <span id={`${id}-label`} className="flex flex-wrap items-center gap-2 text-sm font-semibold">
          {labelContent}
        </span>
      )}
      {children}
      {hint && (
        <p id={`${id}-hint`} className="text-[13px] leading-snug text-ink-3">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-[13px] font-medium leading-snug text-destructive">
          <AlertCircle className="mt-0.5 h-[15px] w-[15px] shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
};

// One field of the form. `missing` marks required text that is still empty.
export const FieldInput = ({
  def,
  path,
  required,
  missing,
  langName,
}: {
  def: FieldDef;
  path: string;
  required?: boolean;
  missing?: boolean;
  langName?: string;
}) => {
  const t = useAdminT();
  const { register, control, getFieldState, formState, watch } = useFormContext();
  const { error } = getFieldState(path, formState);
  const id = fieldId(path);
  const hint = def.hint ? t(def.hint) : undefined;
  const lineCount =
    def.kind === "lines"
      ? ((watch(path) as unknown[] | undefined) ?? []).filter((line) => String(line).trim() !== "").length
      : 0;
  const errorMessage = error ? errorText(t, error, path) : undefined;
  const describedBy = [hint && `${id}-hint`, errorMessage && `${id}-error`].filter(Boolean).join(" ") || undefined;
  const common = { id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, "aria-required": required || undefined };
  const label = t(def.label);

  if (def.kind === "objects") return <ObjectList def={def} path={path} langName={langName} />;
  if (def.kind === "image") return <ProjectImageField def={def} path={path} />;
  if (def.kind === "icon") return <IconField def={def} path={path} />;

  let input: JSX.Element;
  const extra: ReactNode =
    def.kind === "lines" ? <span className="font-mono text-xs font-medium text-ink-3">{fill(t("editor.items"), { n: lineCount })}</span> : null;
  switch (def.kind) {
    case "textarea":
      input = <textarea {...common} rows={def.rows ?? 3} className={cn(inputClass, "min-h-24 resize-y leading-relaxed")} {...register(path)} />;
      break;
    case "number":
      input = <input {...common} type="number" inputMode="numeric" className={inputClass} {...register(path, { valueAsNumber: true })} />;
      break;
    case "select":
      input = (
        <div className="relative">
          <select {...common} className={cn(inputClass, "cursor-pointer appearance-none pr-10")} {...register(path)}>
            {(def.options ?? []).map((option) => (
              <option key={option} value={option}>
                {option ? t(`group.${option}` as AdminStringKey) : t("noneOption")}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-2" aria-hidden="true" />
        </div>
      );
      break;
    case "lines":
      // Blank lines are kept while typing and dropped before validation.
      input = (
        <Controller
          control={control}
          name={path}
          render={({ field }) => {
            const lines = Array.isArray(field.value) ? field.value : [];
            return (
              <textarea
                {...common}
                rows={def.rows ?? 4}
                className={cn(inputClass, "min-h-24 resize-y leading-relaxed")}
                value={lines.join("\n")}
                onChange={(event) => field.onChange(event.target.value.split("\n"))}
                onBlur={field.onBlur}
                ref={field.ref}
              />
            );
          }}
        />
      );
      break;
    case "markdown":
      input = <MarkdownInput path={path} common={common} rows={def.rows ?? 10} label={label} />;
      break;
    default:
      input = <input {...common} className={inputClass} placeholder={def.placeholder} {...register(path)} />;
  }

  return (
    <FieldShell id={id} label={label} required={required} missing={missing} hint={hint} error={errorMessage} extra={extra} langName={langName}>
      {input}
    </FieldShell>
  );
};

// Small, safe Markdown preview: headings, lists, quotes, bold and italic.
// Built as React elements; nothing is injected as HTML.
const inline = (text: string): ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={index}>{part.slice(1, -1)}</em>;
    return part;
  });

export const MarkdownPreview = ({ text }: { text: string }) => {
  const blocks = text.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
  return (
    <div className="space-y-2 text-[15px] leading-relaxed text-ink-2">
      {blocks.map((block, index) => {
        if (/^#\s/.test(block)) return <p key={index} className="text-xl font-extrabold text-foreground">{inline(block.replace(/^#\s*/, ""))}</p>;
        if (/^#{2,}\s/.test(block)) return <p key={index} className="pt-1 text-base font-bold text-foreground">{inline(block.replace(/^#+\s*/, ""))}</p>;
        if (/^[-*]\s/.test(block))
          return (
            <ul key={index} className="list-disc space-y-1 pl-5">
              {block.split("\n").map((line, item) => (
                <li key={item}>{inline(line.replace(/^[-*]\s*/, ""))}</li>
              ))}
            </ul>
          );
        if (/^>\s?/.test(block)) return <blockquote key={index} className="border-l-0 bg-surface-2 px-3 py-2 italic">{inline(block.replace(/^>\s?/gm, ""))}</blockquote>;
        return <p key={index}>{inline(block)}</p>;
      })}
    </div>
  );
};

const MarkdownInput = ({
  path,
  common,
  rows,
  label,
}: {
  path: string;
  common: { id: string; "aria-invalid"?: boolean; "aria-describedby"?: string; "aria-required"?: boolean };
  rows: number;
  label: string;
}) => {
  const t = useAdminT();
  const { register, watch } = useFormContext();
  const [tab, setTab] = useState<"write" | "preview">("write");
  const value = String(watch(path) ?? "");
  const tabClass = (active: boolean) =>
    cn(
      "min-h-9 rounded-[7px] px-3 text-[13px] font-semibold",
      active ? "bg-card text-foreground shadow-[0_0_0_1px_hsl(var(--border))]" : "text-ink-2 hover:text-foreground",
      focusRing,
    );
  return (
    <div className="overflow-hidden rounded-lg border border-line-strong bg-card">
      <div role="tablist" aria-label={label} className="flex items-center gap-0.5 border-b border-border bg-surface-2 p-1">
        <button type="button" role="tab" aria-selected={tab === "write"} className={tabClass(tab === "write")} onClick={() => setTab("write")}>
          {t("editor.write")}
        </button>
        <button type="button" role="tab" aria-selected={tab === "preview"} className={tabClass(tab === "preview")} onClick={() => setTab("preview")}>
          {t("editor.preview")}
        </button>
        <span className="flex-1" />
        <span className="pr-2 font-mono text-xs text-ink-3">MARKDOWN · {value.length} / 20000</span>
      </div>
      {tab === "write" ? (
        <textarea
          {...common}
          rows={rows}
          className="block min-h-[220px] w-full resize-y border-0 bg-card px-3.5 py-3 font-mono text-sm leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
          {...register(path)}
        />
      ) : (
        <div className="max-h-[360px] overflow-auto px-4 py-3">
          {value.trim() ? <MarkdownPreview text={value} /> : <p className="text-sm text-ink-3">{t("editor.previewEmpty")}</p>}
        </div>
      )}
    </div>
  );
};

// Skill icon: a visual picker over the bundled icons, plus None (generic icon).
const IconField = ({ def, path }: { def: FieldDef; path: string }) => {
  const t = useAdminT();
  const { setValue, watch } = useFormContext();
  const [open, setOpen] = useState(false);
  const value = String(watch(path) ?? "");
  const id = fieldId(path);
  const Icon = (skillIcons[value as SkillIconKey] ?? fallbackIcon).icon;
  const options = def.options ?? [];
  const nameOf = (key: string) => (key ? t(`icon.${key}` as AdminStringKey) : t("noneOption"));
  return (
    <FieldShell id={id} label={t(def.label)} labelFor={false}>
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-[10px] bg-surface-2">
          <Icon className="h-6 w-6" />
        </span>
        <span className="min-w-0 flex-1">
          <b className="block text-[15px]">{nameOf(value)}</b>
          <span className="font-mono text-xs text-ink-3">{value || "none"}</span>
        </span>
        <Button type="button" variant="neutral" size="touch" aria-describedby={`${id}-label`} aria-haspopup="dialog" onClick={() => setOpen(true)}>
          {t("editor.changeIcon")}
        </Button>
      </div>
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[80] bg-black/50" />
          <DialogPrimitive.Content className={cn(dialogContentClass, "max-w-[820px]")}>
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <DialogPrimitive.Title className="text-xl font-extrabold">{t("editor.iconsTitle")}</DialogPrimitive.Title>
                <DialogPrimitive.Description className="mt-1.5 text-[15px] text-ink-2">{t("editor.iconsBody")}</DialogPrimitive.Description>
              </div>
              <DialogPrimitive.Close asChild>
                <IconButton label={t("shell.close")}>
                  <X aria-hidden="true" />
                </IconButton>
              </DialogPrimitive.Close>
            </div>
            <div role="radiogroup" aria-label={t("editor.iconsTitle")} className="mt-5 grid grid-cols-3 gap-2 min-[400px]:grid-cols-4 sm:grid-cols-6">
              {options.map((key) => {
                const OptionIcon = (skillIcons[key as SkillIconKey] ?? fallbackIcon).icon;
                const checked = key === value;
                return (
                  <button
                    key={key || "none"}
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    onClick={() => {
                      setValue(path, key, { shouldDirty: true });
                      setOpen(false);
                    }}
                    className={cn(
                      "flex min-h-[84px] flex-col items-center gap-1.5 rounded-xl border px-1 pb-2 pt-2.5 text-center text-xs font-medium",
                      checked ? "border-primary bg-primary-tint text-foreground ring-1 ring-primary" : "border-border bg-card text-ink-2 hover:bg-surface-2",
                      focusRing,
                    )}
                  >
                    <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-[9px] bg-surface-2">
                      <OptionIcon className="h-5 w-5" />
                    </span>
                    {nameOf(key)}
                  </button>
                );
              })}
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </FieldShell>
  );
};

const emptyItem = (fields: FieldDef[]) =>
  Object.fromEntries(fields.map((field) => [field.name, field.kind === "lines" ? [] : ""]));

// A repeatable group (sections, FAQ, highlights) inside one language, with
// add, remove and move up / move down for each item.
const ObjectList = ({ def, path, langName }: { def: FieldDef; path: string; langName?: string }) => {
  const t = useAdminT();
  const { control, watch } = useFormContext();
  // keyName avoids clashing with the items' own `id` field (sections).
  const { fields, append, remove, move } = useFieldArray({ control, name: path, keyName: "_key" });
  const fieldsOf = def.fields ?? [];
  const id = fieldId(path);
  const itemName = (index: number) => `${t(def.itemLabel ?? "itemLabel")} ${index + 1}`;

  return (
    <FieldShell id={id} label={t(def.label)} labelFor={false} langName={langName}>
      <div role="group" aria-labelledby={`${id}-label`} className="flex flex-col gap-2.5">
        {fields.length === 0 && <p className="text-[13px] text-ink-3">{t("editor.noItems")}</p>}
        {fields.map((item, index) => {
          const value = (watch(`${path}.${index}`) ?? {}) as Record<string, unknown>;
          const name = String(value.title ?? value.question ?? "").trim();
          return (
            <div key={item._key} className="rounded-xl border border-border bg-background">
              <div className="flex items-center gap-0.5 border-b border-border py-1 pl-3 pr-1">
                <b className="min-w-0 flex-1 truncate text-sm font-semibold">
                  {itemName(index)}
                  {name && <span className="font-normal text-ink-2"> · {name}</span>}
                </b>
                <IconButton label={fill(t("editor.moveItemUp"), { x: itemName(index) })} disabled={index === 0} onClick={() => move(index, index - 1)}>
                  <ArrowUp aria-hidden="true" />
                </IconButton>
                <IconButton
                  label={fill(t("editor.moveItemDown"), { x: itemName(index) })}
                  disabled={index === fields.length - 1}
                  onClick={() => move(index, index + 1)}
                >
                  <ArrowDown aria-hidden="true" />
                </IconButton>
                <IconButton danger label={fill(t("editor.removeItem"), { x: itemName(index) })} onClick={() => remove(index)}>
                  <Trash2 aria-hidden="true" />
                </IconButton>
              </div>
              <div className="flex flex-col gap-3 p-3">
                {fieldsOf.map((sub) => (
                  <FieldInput key={sub.name} def={sub} path={`${path}.${index}.${sub.name}`} />
                ))}
              </div>
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => append(emptyItem(fieldsOf))}
          className={cn(
            "flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line-strong text-sm font-semibold hover:bg-surface-2",
            focusRing,
          )}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {t(def.addLabel ?? "addItem")}
        </button>
      </div>
    </FieldShell>
  );
};
