import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { AlertCircle, ArrowRight, ArrowUp, Clock, RotateCw, SquarePen, X } from "lucide-react";
import IsoBrick from "@/components/brand/IsoBrick";
import FlatBrick from "@/components/brand/FlatBrick";
import { useLanguage } from "@/hooks/useLanguage";
import { ChatError, sendChatMessage, type ChatMessage } from "@/lib/chatbot-service";
import { CHAT_LIMITS, type ChatProjectId, type ChatSource } from "@/lib/chatLanguage";
import { cn } from "@/lib/utils";

// The portfolio assistant's conversation panel, shared by the floating
// panel (desktop), the full-height sheet (phones) and the project embeds.
// It is an AI assistant, not Hugo: the header and every reply say so.

export type AssistantVariant = "floating" | "sheet" | "embedded";

export interface AssistantPanelHandle {
  focusInput: () => void;
}

interface AssistantPanelProps {
  variant: AssistantVariant;
  projectId?: ChatProjectId;
  suggestions: string[];
  initialPrompt?: string;
  onClose?: () => void;
  titleId: string;
  className?: string;
}

type Status = "idle" | "loading" | "error" | "limited";

const SOURCE_LINKS: Record<ChatSource, { href: string; key: string }> = {
  projects: { href: "/#projects", key: "projectsHeading" },
  experience: { href: "/#experience", key: "experienceHeading" },
  skills: { href: "/#skills", key: "skillsHeading" },
  education: { href: "/#experience", key: "educationTitle" },
  about: { href: "/#about", key: "aboutHeading" },
  contact: { href: "/#contact", key: "contactHeading" },
  darcy: { href: "/projects/darcy-mcgees", key: "projectsMenuDarcy" },
  "big-bang-duel": { href: "/projects/big-bang-duel", key: "projectsMenuBigBangDuel" },
};

const PROJECT_NAME_KEY: Record<ChatProjectId, string> = {
  darcy: "projectsMenuDarcy",
  "big-bang-duel": "projectsMenuBigBangDuel",
};

const Suggestion = ({ text, onAsk, disabled }: { text: string; onAsk: (text: string) => void; disabled: boolean }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={() => onAsk(text)}
    className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-[14px] border border-border bg-card px-3.5 py-2.5 text-left text-sm font-medium leading-snug text-foreground shadow-e1 transition-colors duration-fast hover:border-line-strong hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-45"
  >
    <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
    {text}
  </button>
);

const AssistantPanel = forwardRef<AssistantPanelHandle, AssistantPanelProps>(
  ({ variant, projectId, suggestions, initialPrompt, onClose, titleId, className }, ref) => {
    const { t, language } = useLanguage();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [draft, setDraft] = useState("");
    const [status, setStatus] = useState<Status>("idle");
    const [failedPrompt, setFailedPrompt] = useState<string>();
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const logRef = useRef<HTMLDivElement>(null);
    const lastInitialPrompt = useRef<string>();
    const pending = useRef<AbortController>();
    const limitTimer = useRef<number>();

    useImperativeHandle(ref, () => ({ focusInput: () => inputRef.current?.focus() }), []);

    useEffect(
      () => () => {
        pending.current?.abort();
        window.clearTimeout(limitTimer.current);
      },
      [],
    );

    // Keep the newest message in view. Only the log scrolls, never the page,
    // and the welcome view stays at the top.
    useEffect(() => {
      const log = logRef.current;
      if (log && (messages.length > 0 || status !== "idle")) log.scrollTop = log.scrollHeight;
    }, [messages, status]);

    const ask = useCallback(
      async (text: string, history: ChatMessage[] = messages) => {
        const question = text.trim().slice(0, CHAT_LIMITS.messageMax);
        if (!question || status === "loading" || status === "limited") return;
        const asked: ChatMessage = { role: "user", content: question, timestamp: Date.now() };
        setMessages([...history, asked]);
        setDraft("");
        setStatus("loading");
        setFailedPrompt(undefined);
        pending.current?.abort();
        const controller = new AbortController();
        pending.current = controller;
        try {
          const { reply, sources } = await sendChatMessage(question, history, {
            projectId,
            activeLanguage: language,
            signal: controller.signal,
          });
          setMessages((prev) => [...prev, { role: "assistant", content: reply, sources, timestamp: Date.now() }]);
          setStatus("idle");
        } catch (error) {
          if ((error as Error)?.name === "AbortError") return;
          if (error instanceof ChatError && error.kind === "rate_limited") {
            // Drop the unanswered question and pause input until the window resets.
            setMessages(history);
            setStatus("limited");
            window.clearTimeout(limitTimer.current);
            const wait = Math.min(error.retryAfter ?? 60, 3600) * 1000;
            limitTimer.current = window.setTimeout(() => setStatus("idle"), wait);
            return;
          }
          setFailedPrompt(question);
          setMessages(history);
          setStatus("error");
        }
      },
      [language, messages, projectId, status],
    );

    // Suggested questions from the project page arrive as initialPrompt.
    useEffect(() => {
      if (initialPrompt && initialPrompt !== lastInitialPrompt.current) {
        lastInitialPrompt.current = initialPrompt;
        void ask(initialPrompt);
      }
    }, [initialPrompt, ask]);

    const newChat = () => {
      pending.current?.abort();
      setMessages([]);
      setDraft("");
      setFailedPrompt(undefined);
      if (status !== "limited") setStatus("idle");
      inputRef.current?.focus();
    };

    const onSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      void ask(draft);
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
        event.preventDefault();
        void ask(draft);
      }
    };

    const isProject = Boolean(projectId);
    const limited = status === "limited";
    const loading = status === "loading";
    const empty = messages.length === 0 && status !== "error";
    const sendDisabled = loading || limited || !draft.trim();

    return (
      <section
        role={variant === "embedded" ? "region" : "dialog"}
        aria-modal={variant === "sheet" ? true : undefined}
        aria-labelledby={titleId}
        className={cn(
          "flex flex-col overflow-hidden border border-border bg-card text-foreground",
          variant === "floating" && "h-[min(620px,calc(100vh-120px))] w-[384px] rounded-3xl shadow-e3 animate-sheet-in",
          variant === "sheet" && "h-full w-full rounded-t-3xl border-b-0 animate-sheet-in",
          variant === "embedded" && "h-[560px] w-full rounded-lg",
          className,
        )}
      >
        {variant === "sheet" && <span aria-hidden="true" className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-surface-3" />}
        <header className="flex shrink-0 items-center gap-3 border-b border-border py-3 pl-4 pr-3">
          <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2">
            <IsoBrick shape="1x1" color="green" className="w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-[15px] font-bold leading-tight">
              {isProject ? t("assistant.projectTitle") : t("assistant.title")}
            </h2>
            <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-3">
              <span className="inline-flex h-[18px] items-center rounded border border-line-strong px-1.5 text-[10px] font-bold text-ink-2">
                {t("assistant.ai")}
              </span>
              <span className="truncate">{t("assistant.notHugo")}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={newChat}
            disabled={messages.length === 0}
            aria-label={t("assistant.newChat")}
            title={t("assistant.newChat")}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <SquarePen className="h-5 w-5" aria-hidden="true" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label={t("assistant.close")}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </header>

        {projectId && variant !== "embedded" && (
          <p className="flex shrink-0 items-center gap-2 border-b border-border bg-background px-4 py-2 text-[13px] text-ink-2">
            <FlatBrick studs={1} pitch={12} color="green" />
            {t("assistant.context")}: <b className="font-semibold text-foreground">{t(PROJECT_NAME_KEY[projectId])}</b>
          </p>
        )}

        <div ref={logRef} role="log" aria-live="polite" aria-label={t("assistant.conversation")} className="flex flex-1 flex-col gap-3.5 overflow-y-auto p-4">
          {empty && (
            <div className="flex flex-col items-start gap-2.5 px-1 pb-1 pt-2">
              <IsoBrick shape="2x2" color="green" className="mb-1 w-16" />
              <h3 className="text-xl font-extrabold tracking-[-0.01em]">{t("assistant.welcomeTitle")}</h3>
              <p className="text-sm text-ink-2">{isProject ? t("assistant.projectWelcomeText") : t("assistant.welcomeText")}</p>
              <div className="mt-1.5 flex w-full flex-col items-start gap-2">
                {suggestions.map((text) => (
                  <Suggestion key={text} text={text} onAsk={(q) => void ask(q)} disabled={loading || limited} />
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) =>
            message.role === "user" ? (
              <div key={`${message.timestamp}-${index}`} className="flex max-w-[88%] flex-col items-end self-end">
                <span className="sr-only">{t("assistant.you")}:</span>
                <p className="whitespace-pre-wrap break-words rounded-2xl rounded-tr-[4px] bg-primary px-3.5 py-2.5 text-[15px] leading-normal text-primary-foreground">
                  {message.content}
                </p>
              </div>
            ) : (
              <div key={`${message.timestamp}-${index}`} className="flex max-w-[88%] flex-col gap-1.5 self-start">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-3">{t("assistant.who")}</span>
                <p className="whitespace-pre-wrap break-words rounded-2xl rounded-tl-[4px] bg-surface-2 px-3.5 py-2.5 text-[15px] leading-normal">
                  {message.content}
                </p>
                {message.sources && message.sources.length > 0 && (
                  <p className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-3">{t("assistant.from")}</span>
                    {message.sources.map((source) => (
                      <a
                        key={source}
                        href={SOURCE_LINKS[source].href}
                        className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-border bg-card px-2.5 text-xs font-semibold text-ink-2 hover:border-line-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-[2px] bg-brand-decor" />
                        {t(SOURCE_LINKS[source].key)}
                      </a>
                    ))}
                  </p>
                )}
              </div>
            ),
          )}

          {loading && (
            <div className="flex max-w-[88%] flex-col gap-1.5 self-start">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-3">{t("assistant.who")}</span>
              <p className="inline-flex items-center gap-2.5 rounded-2xl rounded-tl-[4px] bg-surface-2 px-3.5 py-2.5 text-[13px] text-ink-3">
                <span aria-hidden="true" className="inline-flex h-3.5 items-end gap-0.5">
                  <span className="h-[5px] w-[7px] animate-brick-stack rounded-[1px] bg-brand-decor" />
                  <span className="h-[5px] w-[7px] animate-brick-stack rounded-[1px] bg-brand-decor [animation-delay:150ms]" />
                  <span className="h-[5px] w-[7px] animate-brick-stack rounded-[1px] bg-brand-decor [animation-delay:300ms]" />
                </span>
                {t("assistant.answering")}
              </p>
            </div>
          )}

          {status === "error" && (
            <div role="alert" className="flex max-w-[88%] flex-col gap-1.5 self-start">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-3">{t("assistant.who")}</span>
              <div className="rounded-2xl rounded-tl-[4px] border border-destructive bg-error-tint px-3.5 py-2.5 text-[15px]">
                <p className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0 text-destructive" aria-hidden="true" />
                  {t("assistant.error")}
                </p>
                {failedPrompt && (
                  <button
                    type="button"
                    onClick={() => void ask(failedPrompt)}
                    className="mt-2 inline-flex min-h-9 items-center gap-1.5 rounded-md border border-line-strong bg-card px-3 text-[13px] font-semibold hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                    {t("assistant.retry")}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="flex shrink-0 flex-col gap-2 border-t border-border bg-card px-3 pb-[calc(10px+env(safe-area-inset-bottom))] pt-3">
          {limited && (
            <p role="status" className="flex items-start gap-2.5 rounded-[10px] bg-surface-2 px-3 py-2.5 text-[13px] leading-snug text-ink-2">
              <Clock className="mt-px h-[18px] w-[18px] shrink-0 text-ink-3" aria-hidden="true" />
              {t("assistant.limit")}
            </p>
          )}
          <label htmlFor={`${titleId}-input`} className="sr-only">
            {t("assistant.inputLabel")}
          </label>
          <div
            className={cn(
              "flex items-end gap-2 rounded-2xl border py-1.5 pl-3.5 pr-1.5 transition-[border-color,box-shadow] duration-fast focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary-tint-2",
              limited ? "border-border bg-surface-2" : "border-line-strong bg-card",
            )}
          >
            <textarea
              id={`${titleId}-input`}
              ref={inputRef}
              rows={1}
              value={draft}
              maxLength={CHAT_LIMITS.messageMax}
              disabled={limited}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder={limited ? t("assistant.limitPlaceholder") : isProject ? t("assistant.projectPlaceholder") : t("assistant.placeholder")}
              className="max-h-[120px] min-h-11 flex-1 resize-none bg-transparent py-[11px] text-base leading-[1.4] text-foreground outline-none [field-sizing:content] placeholder:text-ink-3 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={sendDisabled}
              aria-label={t("assistant.send")}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-btn hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:bg-surface-3 disabled:text-ink-3 disabled:shadow-none"
            >
              <ArrowUp className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <p className="flex justify-between gap-3 px-1 text-xs leading-snug text-ink-3">
            <span>{t("assistant.disclaimer")}</span>
            <span className="whitespace-nowrap font-mono" aria-hidden="true">
              {draft.length} / {CHAT_LIMITS.messageMax}
            </span>
          </p>
        </form>
      </section>
    );
  },
);

AssistantPanel.displayName = "AssistantPanel";

export default AssistantPanel;
