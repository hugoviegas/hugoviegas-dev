import { useRef, type ReactNode } from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAdminT } from "./adminStrings";

export type ConfirmTone = "danger" | "calm";

export const dangerButtonClass =
  "bg-destructive font-semibold text-white shadow-[0_3px_0_#7a1810] hover:bg-[#9a1d13] dark:text-[#2a1512] dark:shadow-[0_3px_0_#b5574a] dark:hover:bg-[#ffa497] active:translate-y-[3px] active:shadow-none";

// Shared dialog frame: centred card on wide screens, bottom sheet on phones.
export const dialogContentClass =
  "fixed z-[90] w-full overflow-y-auto border border-border bg-card p-6 text-foreground focus:outline-none motion-safe:animate-sheet-in left-1/2 top-1/2 max-h-[calc(100vh-48px)] max-w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-[20px] shadow-[0_6px_0_hsl(var(--shadow-hard))] max-sm:inset-x-0 max-sm:bottom-0 max-sm:left-0 max-sm:top-auto max-sm:max-h-[calc(100vh-24px)] max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-3xl max-sm:px-4 max-sm:pb-[calc(16px+env(safe-area-inset-bottom))] max-sm:shadow-[0_-4px_0_hsl(var(--shadow-hard))]";

export const dialogActionsClass = "mt-6 flex flex-wrap justify-end gap-2 max-sm:flex-col-reverse max-sm:[&>button]:w-full";

// Accessible confirmation (focus trap, Escape cancels, focus returns).
// Destructive actions are red alertdialogs that focus Cancel; calm ones
// (publish, restore, reset) use the primary button and focus it.
const ConfirmDialog = ({
  open,
  tone = "calm",
  title,
  body,
  confirmLabel,
  item,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  tone?: ConfirmTone;
  title: string;
  body: ReactNode;
  confirmLabel: string;
  item?: { title: string; meta?: string };
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const t = useAdminT();
  const confirmRef = useRef<HTMLButtonElement>(null);
  const danger = tone === "danger";
  const Icon = danger ? Trash2 : RotateCcw;
  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={(next) => !next && onCancel()}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-[80] bg-black/50" />
        <AlertDialogPrimitive.Content
          className={dialogContentClass}
          onOpenAutoFocus={(event) => {
            if (danger) return;
            event.preventDefault();
            confirmRef.current?.focus();
          }}
        >
          <div className="flex items-start gap-3.5">
            <span
              aria-hidden="true"
              className={cn(
                "grid h-11 w-11 shrink-0 place-items-center rounded-xl",
                danger ? "bg-error-tint text-destructive" : "bg-primary-tint text-primary",
              )}
            >
              <Icon className="h-[22px] w-[22px]" />
            </span>
            <div className="min-w-0 flex-1">
              <AlertDialogPrimitive.Title className="text-xl font-extrabold leading-snug tracking-[-0.01em]">
                {title}
              </AlertDialogPrimitive.Title>
              <AlertDialogPrimitive.Description className="mt-1.5 text-[15px] text-ink-2">
                {body}
              </AlertDialogPrimitive.Description>
            </div>
          </div>
          {item && (
            <div className="mt-4 rounded-[10px] bg-surface-2 px-3.5 py-3 text-sm">
              <b className="block break-words">{item.title}</b>
              {item.meta && <span className="font-mono text-xs text-ink-3">{item.meta}</span>}
            </div>
          )}
          <div className={dialogActionsClass}>
            <AlertDialogPrimitive.Cancel asChild>
              <Button type="button" variant="ghost" size="lg">
                {t("cancel")}
              </Button>
            </AlertDialogPrimitive.Cancel>
            <AlertDialogPrimitive.Action asChild>
              <Button
                ref={confirmRef}
                type="button"
                size="lg"
                variant={danger ? "default" : "primary"}
                className={danger ? dangerButtonClass : undefined}
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            </AlertDialogPrimitive.Action>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
};

export default ConfirmDialog;
