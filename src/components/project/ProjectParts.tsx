import { useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink, Play, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import FlatBrick from "@/components/brand/FlatBrick";
import AssistantPanel from "@/components/assistant/AssistantPanel";
import IsoBrick from "@/components/brand/IsoBrick";
import type { ChatProjectId } from "@/lib/chatLanguage";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

// Building blocks for the redesigned project pages: a clear hero, key
// facts, a load-on-request demo, compact lists, FAQ, the project assistant
// and a next-project link.

export const pageContainer = "relative z-10 mx-auto w-full max-w-[1344px] px-5 sm:px-10 lg:px-12 xl:px-[72px] max-[359px]:px-4";

export const PageSection = ({ id, title, eyebrow, children }: { id: string; title: string; eyebrow?: string; children: ReactNode }) => (
  <section aria-labelledby={`${id}-title`} className="pt-[72px] lg:pt-24">
    {eyebrow && (
      <p aria-hidden="true" className="mb-2.5 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-3">
        {eyebrow}
      </p>
    )}
    <h2 id={`${id}-title`} className="mb-6 text-[26px] font-extrabold tracking-[-0.02em] text-foreground sm:text-[32px] lg:text-4xl">
      {title}
    </h2>
    {children}
  </section>
);

interface ProjectHeroProps {
  kind: string;
  title: string;
  summary?: string;
  image?: string;
  imageAlt: string;
  actions: ReactNode;
}

export const ProjectHero = ({ kind, title, summary, image, imageAlt, actions }: ProjectHeroProps) => {
  const { t } = useLanguage();
  return (
    <header className="grid items-center gap-8 pt-[88px] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12 lg:pt-28">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-stage shadow-e3">
        {image && <img src={image} alt={imageAlt} width={800} height={600} fetchPriority="high" className="h-full w-full object-cover" />}
        <FlatBrick studs={2} pitch={16} color="green" className="absolute left-4 top-4" />
      </div>
      <div>
        <Link
          to="/#projects"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-semibold text-ink-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-[18px] w-[18px]" aria-hidden="true" />
          {t("nav.allProjects")}
        </Link>
        <p className="mt-4 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-3">{kind}</p>
        <h1 className="mt-2 text-[36px] font-extrabold leading-none tracking-[-0.025em] text-foreground sm:text-[44px] xl:text-[56px] max-[359px]:text-[32px]">
          {title}
        </h1>
        {summary && <p className="mt-4 max-w-[44ch] text-lg text-ink-2">{summary}</p>}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap">{actions}</div>
      </div>
    </header>
  );
};

export const KeyFacts = ({ facts }: { facts: { label: string; value: string }[] }) => {
  const { t } = useLanguage();
  return (
    <section aria-label={t("projectFacts")} className="mt-12">
      <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {facts.map((fact) => (
          <div key={fact.label} className="rounded-lg border border-border bg-card px-4 py-3 shadow-e2 sm:px-5 sm:py-4">
            <dt className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">{fact.label}</dt>
            <dd className="mt-2 text-[15px] font-semibold text-foreground sm:text-base">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

interface DemoFrameProps {
  url: string;
  title: string;
  poster?: string;
  frameClass: string;
  openLabel: string;
  fallback: string;
  note?: string;
}

// The demo iframe loads only after an explicit click (no autoplay, nothing
// heavy on first paint). A full-page link is always available.
export const DemoFrame = ({ url, title, poster, frameClass, openLabel, fallback, note }: DemoFrameProps) => {
  const { t } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div>
      <div className={cn("relative overflow-hidden rounded-3xl border border-border bg-[#0b0f12]", frameClass)}>
        {!loaded && (
          <>
            {poster && <img src={poster} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-50" />}
            <div className="absolute inset-0 grid place-content-center justify-items-center gap-3.5 p-6 text-center text-[#eef1f3]">
              <Button type="button" variant="primary" size="lg" onClick={() => setLoaded(true)}>
                <Play aria-hidden="true" />
                {t("projectLoadDemo")}
              </Button>
              <p className="text-sm text-[#c3c9cf]">{t("projectLoadNote")}</p>
            </div>
          </>
        )}
        {loaded && !failed && (
          <iframe
            src={url}
            title={title}
            className="h-full w-full border-0"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation-by-user-activation"
            onError={() => setFailed(true)}
          />
        )}
        {failed && (
          <div role="alert" className="grid h-full place-items-center p-6 text-center text-[#c3c9cf]">
            {fallback}
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Button asChild variant="neutral" size="touch">
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink aria-hidden="true" />
            {openLabel}
          </a>
        </Button>
        {note && <p className="text-sm text-ink-3">{note}</p>}
      </div>
    </div>
  );
};

export const CompactList = ({ items }: { items: string[] }) => (
  <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {items.map((item, i) => (
      <li key={item} className="rounded-lg border border-border bg-card p-5 shadow-e2">
        <FlatBrick studs={1} pitch={18} color={i === 0 ? "green" : i === 1 ? "lightGray" : "darkGray"} />
        <p className="mt-3 text-[15px] text-ink-2">{item}</p>
      </li>
    ))}
  </ol>
);

interface ProjectAssistantProps {
  projectId: ChatProjectId;
  titleKey: string;
  descriptionKey: string;
  suggestionsKey: string;
  safetyKey: string;
  questionKeys: string[];
}

// Project assistant block: intro, suggested questions and the embedded
// assistant panel. The panel loads only after an explicit visitor action.
export const ProjectAssistant = ({ projectId, titleKey, descriptionKey, suggestionsKey, safetyKey, questionKeys }: ProjectAssistantProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<string>();
  const startRef = useRef<HTMLButtonElement>(null);
  const hideRef = useRef<HTMLButtonElement>(null);
  const panelId = `${projectId}-context-chat`;
  const titleId = `${projectId}-chat-title`;
  const questions = questionKeys.map((key) => t(key));

  const start = (prompt?: string) => {
    setInitialPrompt(prompt);
    setOpen(true);
    // Move focus to the conversation controls once the panel exists.
    window.requestAnimationFrame(() => hideRef.current?.focus());
  };
  const hide = () => {
    setOpen(false);
    window.requestAnimationFrame(() => startRef.current?.focus());
  };

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        "mt-10 grid items-start gap-5 rounded-3xl border border-border bg-card p-5 text-foreground shadow-e2 sm:p-8",
        open && "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-10",
      )}
    >
      <div>
        <p className="flex items-center gap-2.5">
          <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-[10px] bg-surface-2">
            <IsoBrick shape="1x1" color="green" className="w-[18px]" />
          </span>
          <span className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-3">
            {t("assistant.projectTitle")} ·
            <span className="inline-flex h-[18px] items-center rounded border border-line-strong px-1.5 text-[10px] font-bold text-ink-2">
              {t("assistant.ai")}
            </span>
          </span>
        </p>
        <h2 id={titleId} className="mt-3 text-2xl font-extrabold tracking-[-0.02em] sm:text-[28px]">
          {t(titleKey)}
        </h2>
        <p className="mt-2 max-w-[52ch] text-base text-ink-2">{t(descriptionKey)}</p>
        {!open && (
          <>
            <ul aria-label={t(suggestionsKey)} className="mt-5 flex flex-col items-start gap-2">
              {questions.map((question) => (
                <li key={question} className="max-w-full">
                  <button
                    type="button"
                    onClick={() => start(question)}
                    className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-[14px] border border-border bg-card px-3.5 py-2.5 text-left text-sm font-medium leading-snug text-foreground shadow-e1 transition-colors duration-fast hover:border-line-strong hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {question}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <Button ref={startRef} type="button" variant="primary" size="lg" onClick={() => start()} aria-controls={panelId} aria-expanded={false}>
                {t("assistant.start")}
              </Button>
            </div>
          </>
        )}
        <p className="mt-5 flex max-w-[52ch] gap-2.5 text-[13px] leading-normal text-ink-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {t(safetyKey)}
        </p>
        {open && (
          <div className="mt-4">
            <Button ref={hideRef} type="button" variant="ghost" size="sm" onClick={hide} aria-controls={panelId} aria-expanded>
              {t("assistant.hide")}
            </Button>
          </div>
        )}
      </div>
      {open && (
        <div id={panelId}>
          <AssistantPanel
            variant="embedded"
            projectId={projectId}
            suggestions={questions}
            initialPrompt={initialPrompt}
            titleId={`${projectId}-assistant-panel-title`}
          />
        </div>
      )}
    </section>
  );
};

export const NextProject = ({ to, title, line, image }: { to: string; title: string; line: string; image?: string }) => {
  const { t } = useLanguage();
  return (
    <section aria-label={t("projectNext")} className="pt-[72px] lg:pt-24">
      <Link
        to={to}
        className="grid items-center gap-4 rounded-lg border border-border bg-card p-3 text-foreground shadow-e2 transition-[transform,box-shadow] duration-base ease-out hover:-translate-y-[3px] hover:shadow-e3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[200px_1fr_auto] sm:gap-6"
      >
        {image ? (
          <img src={image} alt="" loading="lazy" width={200} height={150} className="aspect-[4/3] w-full rounded-xl bg-stage object-cover sm:w-[200px]" />
        ) : (
          <span className="aspect-[4/3] w-full rounded-xl bg-stage sm:w-[200px]" />
        )}
        <span className="px-2 pb-2 sm:p-0">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-3">{t("projectNext")}</span>
          <span className="mt-1 block text-[22px] font-extrabold">{title}</span>
          <span className="block text-[15px] text-ink-3">{line}</span>
        </span>
        <span aria-hidden="true" className="mr-4 hidden h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground sm:grid">
          <ArrowRight className="h-5 w-5" />
        </span>
      </Link>
    </section>
  );
};
