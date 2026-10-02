import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { MessageCircle, X } from "lucide-react";
import AssistantPanel, { type AssistantPanelHandle } from "@/components/assistant/AssistantPanel";
import type { ChatProjectId } from "@/lib/chatLanguage";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

// Global portfolio assistant: a small launcher with two studs, a non-modal
// floating panel on desktop and a modal full-height sheet on phones.
// No ping, pulse or autoplay. Escape closes and focus returns to the launcher.

interface ChatBotProps {
  projectId?: ChatProjectId;
  initialPrompt?: string;
  embedded?: boolean;
  onClose?: () => void;
}

const DESKTOP_QUERY = "(min-width: 1024px)";
const HOME_SUGGESTIONS = ["assistant.suggest1", "assistant.suggest2", "assistant.suggest3", "assistant.suggest4"];
const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" && typeof window.matchMedia === "function" ? window.matchMedia(DESKTOP_QUERY).matches : true,
  );
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);
  return isDesktop;
};

const ChatBot = ({ projectId, initialPrompt, embedded = false, onClose }: ChatBotProps) => {
  const { t } = useLanguage();
  const titleId = useId();
  const panelId = `${titleId}-panel`;
  const isDesktop = useIsDesktop();
  const [open, setOpen] = useState(false);
  // The panel stays mounted after the first open so the conversation survives closing.
  const [mounted, setMounted] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<AssistantPanelHandle>(null);
  const suggestions = HOME_SUGGESTIONS.map((key) => t(key));
  const isSheet = open && !isDesktop;

  const close = useCallback(() => {
    setOpen(false);
    onClose?.();
    launcherRef.current?.focus();
  }, [onClose]);

  const toggle = () => {
    if (open) {
      close();
      return;
    }
    setMounted(true);
    setOpen(true);
  };

  // Desktop: focus the question field. Phone: focus the sheet itself so the
  // on-screen keyboard does not cover the conversation straight away.
  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => {
      if (isDesktop) panelRef.current?.focusInput();
      else wrapRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, isDesktop]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Phone sheet: lock page scroll and keep the composer above the on-screen
  // keyboard. The keyboard inset is a CSS variable set on the sheet element.
  useEffect(() => {
    if (!isSheet) return;
    const root = document.documentElement;
    root.classList.add("overflow-hidden");
    const viewport = window.visualViewport;
    const wrap = wrapRef.current;
    const syncKeyboard = () => {
      if (!viewport || !wrap) return;
      const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      wrap.style.setProperty("--kb", `${Math.round(inset)}px`);
    };
    syncKeyboard();
    viewport?.addEventListener("resize", syncKeyboard);
    viewport?.addEventListener("scroll", syncKeyboard);
    return () => {
      root.classList.remove("overflow-hidden");
      viewport?.removeEventListener("resize", syncKeyboard);
      viewport?.removeEventListener("scroll", syncKeyboard);
      wrap?.style.removeProperty("--kb");
    };
  }, [isSheet]);

  // Simple focus trap for the modal sheet.
  const trapFocus = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!isSheet || event.key !== "Tab" || !wrapRef.current) return;
    const items = Array.from(wrapRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === wrapRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (embedded) {
    return <AssistantPanel variant="embedded" projectId={projectId} suggestions={[]} initialPrompt={initialPrompt} onClose={onClose} titleId={titleId} />;
  }

  return (
    <>
      {isSheet && <div aria-hidden="true" className="fixed inset-0 z-[80] bg-black/50" onClick={close} />}
      {mounted && (
        <div
          ref={wrapRef}
          id={panelId}
          hidden={!open}
          tabIndex={-1}
          onKeyDown={trapFocus}
          className={cn(
            "focus:outline-none",
            isDesktop
              ? "fixed bottom-[96px] right-6 z-50 max-w-[calc(100vw-48px)]"
              : "fixed inset-x-0 bottom-[var(--kb,0px)] top-3 z-[80]",
          )}
        >
          <AssistantPanel
            ref={panelRef}
            variant={isDesktop ? "floating" : "sheet"}
            projectId={projectId}
            suggestions={suggestions}
            initialPrompt={initialPrompt}
            onClose={close}
            titleId={titleId}
          />
        </div>
      )}
      <button
        ref={launcherRef}
        type="button"
        onClick={toggle}
        aria-label={open ? t("assistant.close") : t("assistant.open")}
        aria-expanded={open}
        aria-controls={mounted ? panelId : undefined}
        className={cn(
          "group fixed bottom-[calc(20px+env(safe-area-inset-bottom))] right-4 z-50 grid h-14 w-14 place-items-center rounded-full border shadow-e3 transition-[background-color,transform,box-shadow] duration-fast ease-out",
          "before:absolute before:-top-1 before:left-[17px] before:h-1 before:w-[9px] before:rounded-t-[2px] before:content-['']",
          "after:absolute after:-top-1 after:left-[30px] after:h-1 after:w-[9px] after:rounded-t-[2px] after:content-['']",
          "active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "lg:bottom-6 lg:right-6 [@media(max-height:500px)]:bottom-3",
          open
            ? "border-foreground bg-foreground text-background before:bg-foreground after:bg-foreground"
            : "border-border bg-card text-foreground before:bg-brand-decor after:bg-brand-decor hover:bg-surface-2",
        )}
      >
        {open ? <X className="h-6 w-6" aria-hidden="true" /> : <MessageCircle className="h-6 w-6" aria-hidden="true" />}
        {!open && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-[calc(100%+12px)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-md bg-foreground px-3 py-2 text-[13px] font-semibold leading-tight text-background lg:group-hover:block lg:group-focus-visible:block"
          >
            {t("assistant.tooltip")}
          </span>
        )}
      </button>
    </>
  );
};

export default ChatBot;
