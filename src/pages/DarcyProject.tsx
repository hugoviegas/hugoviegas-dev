import { useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

const DEMO_URL =
  import.meta.env.VITE_DEMO_DARCY_URL || "https://demo-darcy.hugoviegas.dev";

const STACK = [
  "React",
  "TypeScript",
  "Vite",
  "Tailwind",
  "shadcn/ui",
  "Supabase (real) / localStorage (demo)",
];

const DarcyProject = () => {
  const { t } = useLanguage();
  const [iframeFailed, setIframeFailed] = useState(false);
  const [isContextChatOpen, setIsContextChatOpen] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<string>();

  const suggestedQuestions = [
    "darcyQuestionProblem",
    "darcyQuestionAdmin",
    "darcyQuestionAi",
    "darcyQuestionReservations",
    "darcyQuestionData",
    "darcyQuestionImpact",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="section-wrapper py-24">
        <div className="mx-auto max-w-6xl">
          <header className="mb-10 max-w-3xl">
            <p className="caption-text mb-3 uppercase tracking-[0.2em]">
              {t("darcyDemoButton")}
            </p>
            <h1 className="heading-section mb-4">{t("darcyTitle")}</h1>
            <p className="body-text">{t("darcySummary")}</p>
          </header>

          <section className="mb-8" aria-labelledby="darcy-stack">
            <h2 id="darcy-stack" className="heading-card mb-4">
              {t("darcyStack")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {STACK.map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary"
                >
                  {technology}
                </span>
              ))}
            </div>
          </section>

          <section aria-labelledby="darcy-demo">
            <h2 id="darcy-demo" className="sr-only">
              {t("darcyDemoButton")}
            </h2>
            <div className="overflow-hidden rounded-btn border border-border bg-card shadow-lg">
              <div className="aspect-video w-full bg-muted">
                {!iframeFailed ? (
                  <iframe
                    src={DEMO_URL}
                    title="Darcy McGee demo (EN/PT)"
                    className="h-full w-full border-0"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation-by-user-activation"
                    onError={() => setIframeFailed(true)}
                  />
                ) : (
                  <div
                    role="alert"
                    className="flex h-full items-center justify-center p-6 text-center text-muted-foreground"
                  >
                    {t("darcyIframeFallback")}
                  </div>
                )}
              </div>
            </div>
            <p className="caption-text mt-3">{t("darcyDemoNote")}</p>
          </section>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink aria-hidden="true" />
                {t("darcyOpenFull")}
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link to="/#projects">
                <ArrowLeft aria-hidden="true" />
                {t("darcyBack")}
              </Link>
            </Button>
          </div>

          <section
            className="mt-12 rounded-2xl border border-primary/30 bg-primary/5 p-6"
            aria-labelledby="darcy-chat-title"
          >
            <div className="flex flex-col gap-4">
              <div>
                <h2 id="darcy-chat-title" className="heading-card">
                  {t("darcyAskTitle")}
                </h2>
                <p className="body-text mt-2">{t("darcyChatDescription")}</p>
              </div>
              {!isContextChatOpen && (
                <Button
                  type="button"
                  onClick={() => setIsContextChatOpen(true)}
                  aria-controls="darcy-context-chat"
                >
                  {t("darcyAskTitle")}
                </Button>
              )}
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-foreground">
                  {t("darcySuggestedQuestions")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((questionKey) => (
                    <button
                      key={questionKey}
                      type="button"
                      onClick={() => {
                        setInitialPrompt(t(questionKey));
                        setIsContextChatOpen(true);
                      }}
                      className="rounded-full border border-primary/30 bg-background px-3 py-2 text-left text-sm text-foreground transition-colors hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {t(questionKey)}
                    </button>
                  ))}
                </div>
              </div>
              <p className="caption-text">{t("darcySafetyNote")}</p>
              {isContextChatOpen && (
                <div id="darcy-context-chat" className="rounded-2xl bg-neutral-950/10 p-1">
                  <ChatBot
                    projectId="darcy"
                    initialPrompt={initialPrompt}
                    embedded
                    onClose={() => setIsContextChatOpen(false)}
                  />
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DarcyProject;
