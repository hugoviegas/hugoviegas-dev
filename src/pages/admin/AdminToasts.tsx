import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AlertCircle, Check, X } from "lucide-react";
import { useAdminT } from "./adminStrings";

// Short confirmations for quick actions ("Saved", "Order saved"). They
// dismiss after five seconds; anything needing a decision is an in-page notice.

type ToastKind = "ok" | "bad";
interface Toast {
  id: number;
  kind: ToastKind;
  text: string;
}

const ToastContext = createContext<(kind: ToastKind, text: string) => void>(() => undefined);

// eslint-disable-next-line react-refresh/only-export-components -- hook beside its provider
export const useToast = () => useContext(ToastContext);

export const TOAST_MS = 5000;

export const AdminToastProvider = ({ children }: { children: ReactNode }) => {
  const t = useAdminT();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, number>());

  const dismiss = useCallback((id: number) => {
    window.clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (kind: ToastKind, text: string) => {
      const id = nextId.current++;
      // Keep at most three on screen.
      setToasts((current) => [...current.slice(-2), { id, kind, text }]);
      timers.current.set(id, window.setTimeout(() => dismiss(id), TOAST_MS));
    },
    [dismiss],
  );

  useEffect(() => {
    const active = timers.current;
    return () => active.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const value = useMemo(() => push, [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-24 left-3 right-3 z-[70] flex flex-col gap-2 sm:bottom-6 sm:left-auto sm:right-6 sm:w-[380px]"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="relative flex items-center gap-3 overflow-hidden rounded-[14px] bg-foreground py-2.5 pl-4 pr-1.5 text-sm font-medium text-background shadow-[0_4px_0_hsl(var(--shadow-hard))]"
          >
            {toast.kind === "ok" ? (
              <Check className="h-5 w-5 shrink-0 text-brand-decor" aria-hidden="true" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-[#ff8a7a]" aria-hidden="true" />
            )}
            <span className="min-w-0 flex-1">{toast.text}</span>
            <button
              type="button"
              aria-label={t("dismiss")}
              onClick={() => dismiss(toast.id)}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] text-background hover:bg-background/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background"
            >
              <X className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-[3px] w-full origin-left bg-brand-decor motion-safe:animate-admin-toast motion-reduce:hidden"
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
