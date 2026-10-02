import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AlertCircle, CheckCircle2, Info, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Small building blocks shared by the admin screens. Flat colours, hard
// offset shadows, 44 px targets. Admin-only: this file lives in the lazy chunk.

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const cardClass = "rounded-2xl border border-border bg-card shadow-e2";

export const inputClass =
  "min-h-11 w-full rounded-lg border border-line-strong bg-card px-3.5 py-2.5 text-[15px] text-foreground transition-[border-color,box-shadow] duration-fast placeholder:text-ink-3 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary-tint-2 disabled:border-border disabled:bg-surface-2 disabled:text-ink-3 read-only:border-border read-only:bg-surface-2 read-only:font-mono read-only:text-sm read-only:text-ink-2 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-destructive";

export const monoLabel = "font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-3";

type NoticeTone = "ok" | "bad" | "warn" | "info";

const noticeTone: Record<NoticeTone, string> = {
  ok: "border-primary-tint-2 bg-primary-tint [&>svg]:text-primary",
  bad: "border-destructive bg-error-tint [&>svg]:text-destructive",
  warn: "border-line-strong bg-surface-2 [&>svg]:text-ink-2",
  info: "border-border bg-surface-2 [&>svg]:text-ink-2",
};

const noticeIcon: Record<NoticeTone, typeof Info> = {
  ok: CheckCircle2,
  bad: AlertCircle,
  warn: RefreshCw,
  info: Info,
};

// In-page message. Anything that needs a decision is a notice, not a toast.
export const Notice = ({
  tone,
  title,
  children,
  actions,
  role,
  className,
  id,
  tabIndex,
}: {
  tone: NoticeTone;
  title?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  role?: "alert" | "status";
  className?: string;
  id?: string;
  tabIndex?: number;
}) => {
  const Icon = noticeIcon[tone];
  return (
    <div
      id={id}
      tabIndex={tabIndex}
      role={role}
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3.5 text-sm leading-relaxed text-foreground focus:outline-none",
        noticeTone[tone],
        className,
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {title && <p className="mb-0.5 text-[15px] font-bold">{title}</p>}
        {children}
        {actions && <div className="mt-2.5 flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
};

// Published / draft chips: shape and fill differ, not only colour.
export const StatusBadge = ({ published, label }: { published: boolean; label: string }) =>
  published ? (
    <span className="inline-flex min-h-6 items-center gap-1.5 whitespace-nowrap rounded-md border border-primary-tint-2 bg-primary-tint px-2 text-xs font-semibold text-foreground">
      <span aria-hidden="true" className="h-2 w-2 rounded-[2px] bg-brand-decor" />
      {label}
    </span>
  ) : (
    <span className="inline-flex min-h-6 items-center gap-1.5 whitespace-nowrap rounded-md border border-dashed border-line-strong px-2 text-xs font-semibold text-ink-2">
      <span aria-hidden="true" className="h-2 w-2 rounded-[2px] border-[1.5px] border-ink-3" />
      {label}
    </span>
  );

export const Chip = ({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "warn" | "solid" }) => (
  <span
    className={cn(
      "inline-flex min-h-6 items-center gap-1.5 whitespace-nowrap rounded-md border px-2 text-xs font-semibold",
      tone === "muted" && "border-transparent bg-surface-2 text-ink-2",
      tone === "warn" && "border-destructive bg-error-tint text-foreground",
      tone === "solid" && "border-transparent bg-primary text-primary-foreground",
    )}
  >
    {children}
  </span>
);

// 44 x 44 icon button. `label` is the accessible name; the tooltip shows the short verb.
export const IconButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { label: string; tip?: string; danger?: boolean }
>(({ label, tip, danger, className, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label={label}
    title={tip ?? label}
    className={cn(
      "inline-grid h-11 w-11 shrink-0 place-items-center rounded-[10px] border border-transparent text-foreground transition-colors duration-fast hover:border-border hover:bg-surface-2 disabled:cursor-not-allowed disabled:border-transparent disabled:bg-transparent disabled:text-ink-3 disabled:opacity-50 [&>svg]:h-[19px] [&>svg]:w-[19px]",
      danger && "text-destructive hover:border-destructive hover:bg-error-tint",
      focusRing,
      className,
    )}
    {...props}
  >
    {children}
  </button>
));
IconButton.displayName = "IconButton";

// Studded marker used for the active rail item and section headings.
export const Stud = ({ active }: { active?: boolean }) => (
  <span
    aria-hidden="true"
    className={cn(
      "h-2.5 w-2.5 shrink-0 rounded-[3px]",
      active ? "bg-brand-decor shadow-[0_2px_0_hsl(var(--primary-pressed))]" : "bg-surface-3",
    )}
  />
);

// Bottom sheet on phones and tablets (Radix Dialog: focus trap, Escape, focus return).
export const Sheet = ({
  open,
  onOpenChange,
  title,
  children,
  closeLabel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  closeLabel: string;
}) => (
  <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-[80] bg-black/50" />
      <DialogPrimitive.Content
        aria-describedby={undefined}
        className="fixed inset-x-0 bottom-0 z-[90] max-h-[calc(100vh-48px)] overflow-y-auto rounded-t-3xl bg-card px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-2 text-foreground shadow-[0_-4px_0_hsl(var(--shadow-hard))] focus:outline-none motion-safe:animate-sheet-in"
      >
        <span aria-hidden="true" className="mx-auto mb-2 mt-1 block h-1 w-10 rounded-full bg-surface-3" />
        <div className="flex items-center gap-2 pb-2">
          <DialogPrimitive.Title className="flex-1 text-lg font-extrabold">{title}</DialogPrimitive.Title>
          <DialogPrimitive.Close asChild>
            <IconButton label={closeLabel}>
              <X aria-hidden="true" />
            </IconButton>
          </DialogPrimitive.Close>
        </div>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>
);

export const PageHeading = ({
  title,
  sub,
  actions,
  id = "admin-page-title",
}: {
  title: ReactNode;
  sub?: ReactNode;
  actions?: ReactNode;
  id?: string;
}) => (
  <div className="mb-6 mt-2 flex flex-wrap items-end justify-between gap-4 max-sm:gap-3">
    <div className="min-w-0">
      <h1 id={id} className="break-words text-[26px] font-extrabold leading-tight tracking-[-0.02em] sm:text-[32px]">
        {title}
      </h1>
      {sub && <p className="mt-1.5 max-w-[68ch] text-[15px] text-ink-2">{sub}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2 max-sm:w-full">{actions}</div>}
  </div>
);

// On/off switch drawn as a brick. Labelled by a heading or label plus the
// visible value, so screen readers hear "Published, On".
export const BrickSwitch = ({
  checked,
  onClick,
  labelledBy,
  valueId,
  valueText,
  disabled,
}: {
  checked: boolean;
  onClick: () => void;
  labelledBy: string;
  valueId: string;
  valueText: string;
  disabled?: boolean;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-labelledby={`${labelledBy} ${valueId}`}
    disabled={disabled}
    onClick={onClick}
    className={cn("group flex min-h-11 items-center gap-3 rounded-lg text-left text-sm font-semibold disabled:opacity-60", focusRing)}
  >
    <span
      aria-hidden="true"
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-lg transition-colors duration-fast",
        checked ? "bg-primary shadow-[inset_0_-3px_0_hsl(var(--primary-pressed))]" : "bg-surface-3 shadow-[inset_0_-3px_0_hsl(var(--line-strong))]",
      )}
    >
      <span
        className={cn(
          "absolute left-[3px] top-[3px] h-[19px] w-[22px] rounded-[5px] bg-card shadow-[0_0_0_1px_hsl(var(--line-strong))] transition-transform duration-base ease-out before:absolute before:-top-[3px] before:left-1.5 before:h-[3px] before:w-2.5 before:rounded-t-[2px] before:bg-card before:shadow-[0_0_0_1px_hsl(var(--line-strong))]",
          checked && "translate-x-5",
        )}
      />
    </span>
    <span id={valueId}>{valueText}</span>
  </button>
);

// Native progress bar, styled without inline widths.
export const UploadProgress = ({ value, label }: { value: number; label: string }) => (
  <progress
    aria-label={label}
    max={100}
    value={Math.round(value)}
    className="block h-2 w-full appearance-none overflow-hidden rounded bg-surface-2 [&::-moz-progress-bar]:bg-primary [&::-webkit-progress-bar]:bg-surface-2 [&::-webkit-progress-value]:bg-primary"
  />
);
