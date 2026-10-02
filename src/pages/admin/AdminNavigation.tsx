import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { AlertCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { adminHref, parseAdminPath, type AdminLocation } from "./adminRoutes";
import { dangerButtonClass, dialogActionsClass, dialogContentClass } from "./ConfirmDialog";
import { useAdminT } from "./adminStrings";

// Routing for the admin with an unsaved-changes guard. The view follows the
// address, but while an editor reports unsaved changes any move away (links,
// Back, Cancel, the browser's back button) is held until the owner chooses
// Keep editing, Save and leave, or Discard. Reload and closing the tab use the
// browser's own beforeunload prompt.

type SaveHandler = () => Promise<boolean>;

interface AdminNavValue {
  location: AdminLocation;
  /** Guarded navigation. `force` skips the guard (after a successful save). */
  go: (to: AdminLocation, options?: { force?: boolean; replace?: boolean }) => void;
  setDirty: (dirty: boolean, label?: string) => void;
  registerSave: (save: SaveHandler | null) => void;
}

const AdminNavContext = createContext<AdminNavValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components -- hook beside its provider
export const useAdminNav = () => {
  const value = useContext(AdminNavContext);
  if (!value) throw new Error("useAdminNav must be used inside AdminNavProvider");
  return value;
};

export const AdminNavProvider = ({ children }: { children: ReactNode }) => {
  const t = useAdminT();
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const [shownPath, setShownPath] = useState(routerLocation.pathname);
  const [pending, setPending] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const dirty = useRef(false);
  const dirtyLabel = useRef("");
  const save = useRef<SaveHandler | null>(null);
  const bypass = useRef(false);

  const show = useCallback((path: string) => {
    setShownPath(path);
    // New view: start at the top and move focus to the page.
    window.scrollTo(0, 0);
    window.setTimeout(() => document.getElementById(MAIN_CONTENT_ID)?.focus({ preventScroll: true }), 0);
  }, []);

  // Address changed (our navigate, or the browser's back/forward).
  useEffect(() => {
    const path = routerLocation.pathname;
    if (path === shownPath) return;
    if (bypass.current || !dirty.current) {
      bypass.current = false;
      show(path);
      return;
    }
    setPending(path);
  }, [routerLocation.pathname, shownPath, show]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty.current) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  const go = useCallback<AdminNavValue["go"]>(
    (to, options) => {
      const path = adminHref(to);
      if (path === shownPath && path === routerLocation.pathname) return;
      if (dirty.current && !options?.force) {
        setPending(path);
        return;
      }
      if (options?.force) dirty.current = false;
      bypass.current = true;
      navigate(path, { replace: options?.replace });
    },
    [navigate, routerLocation.pathname, shownPath],
  );

  const leave = useCallback(
    (path: string) => {
      dirty.current = false;
      setPending(null);
      if (routerLocation.pathname === path) {
        show(path);
      } else {
        bypass.current = true;
        navigate(path);
      }
    },
    [navigate, routerLocation.pathname, show],
  );

  const keepEditing = () => {
    setPending(null);
    // The browser already moved (back/forward): put the address back.
    if (routerLocation.pathname !== shownPath) navigate(shownPath, { replace: true });
  };

  const saveAndLeave = async () => {
    if (!pending) return;
    const target = pending;
    setSaving(true);
    const ok = (await save.current?.()) ?? false;
    setSaving(false);
    if (ok) leave(target);
    else setPending(null);
  };

  const value = useMemo<AdminNavValue>(
    () => ({
      location: parseAdminPath(shownPath),
      go,
      setDirty: (next, label) => {
        dirty.current = next;
        if (label !== undefined) dirtyLabel.current = label;
      },
      registerSave: (handler) => {
        save.current = handler;
      },
    }),
    [go, shownPath],
  );

  return (
    <AdminNavContext.Provider value={value}>
      {children}
      <AlertDialogPrimitive.Root open={pending !== null} onOpenChange={(open) => !open && keepEditing()}>
        <AlertDialogPrimitive.Portal>
          <AlertDialogPrimitive.Overlay className="fixed inset-0 z-[80] bg-black/50" />
          <AlertDialogPrimitive.Content className={dialogContentClass}>
            <div className="flex items-start gap-3.5">
              <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-2">
                <AlertCircle className="h-[22px] w-[22px]" />
              </span>
              <div className="min-w-0 flex-1">
                <AlertDialogPrimitive.Title className="text-xl font-extrabold leading-snug">
                  {t("unsaved.title")}
                </AlertDialogPrimitive.Title>
                <AlertDialogPrimitive.Description className="mt-1.5 text-[15px] text-ink-2">
                  {t("unsaved.body").replace("{x}", dirtyLabel.current || t("unsaved.thisItem"))}
                </AlertDialogPrimitive.Description>
              </div>
            </div>
            <div className={dialogActionsClass}>
              <Button type="button" size="lg" className={dangerButtonClass} onClick={() => pending && leave(pending)}>
                {t("unsaved.discard")}
              </Button>
              <Button type="button" size="lg" variant="neutral" disabled={saving || !save.current} onClick={() => void saveAndLeave()}>
                {saving ? t("saving") : t("unsaved.saveLeave")}
              </Button>
              <AlertDialogPrimitive.Cancel asChild>
                <Button type="button" size="lg" variant="primary">
                  {t("unsaved.keep")}
                </Button>
              </AlertDialogPrimitive.Cancel>
            </div>
          </AlertDialogPrimitive.Content>
        </AlertDialogPrimitive.Portal>
      </AlertDialogPrimitive.Root>
    </AdminNavContext.Provider>
  );
};

/** Anchor that goes through the guarded navigation but stays a real link. */
export const AdminLink = ({
  to,
  className,
  children,
  onClick,
  ...props
}: { to: AdminLocation; className?: string; children: ReactNode } & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
>) => {
  const { go } = useAdminNav();
  return (
    <a
      href={adminHref(to)}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        go(to);
      }}
      {...props}
    >
      {children}
    </a>
  );
};
