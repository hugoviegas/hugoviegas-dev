import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, ExternalLink, Gamepad2, ShieldCheck, Sparkles, TimerReset } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import TopControls from "@/components/TopControls";
import ChatBot from "@/components/ChatBot";

const DEMO_URL =
  import.meta.env.VITE_DEMO_BIG_BANG_DUEL_URL || "https://duel.hugoviegas.dev";
const GAME_PREVIEW_RATIO = 390 / 844;

const BigBangDuelProject = () => {
  const { t } = useLanguage();
  const [iframeFailed, setIframeFailed] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);
  const [isContextChatOpen, setIsContextChatOpen] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<string>();

  const techStack = useMemo(
    () => [
      t("bigBangTechReact"),
      t("bigBangTechTypeScript"),
      t("bigBangTechVite"),
      t("bigBangTechTailwind"),
      t("bigBangTechZustand"),
      t("bigBangTechFirebaseAuth"),
      t("bigBangTechFirestore"),
      t("bigBangTechRealtime"),
    ],
    [t],
  );

  const tryItems = useMemo(
    () => [
      t("bigBangTryItemGuest"),
      t("bigBangTryItemGoogle"),
      t("bigBangTryItemJourney"),
      t("bigBangTryItemAccess"),
    ],
    [t],
  );

  const builtItems = useMemo(
    () => [
      t("bigBangBuiltItemExperience"),
      t("bigBangBuiltItemProduct"),
      t("bigBangBuiltItemFlow"),
    ],
    [t],
  );

  const challengeItems = useMemo(
    () => [
      t("bigBangChallengeResponsive"),
      t("bigBangChallengeGuest"),
      t("bigBangChallengeSystems"),
      t("bigBangChallengeFriction"),
    ],
    [t],
  );

  const faqItems = useMemo(
    () => [
      { question: t("bigBangFaq.q1"), answer: t("bigBangFaq.a1") },
      { question: t("bigBangFaq.q2"), answer: t("bigBangFaq.a2") },
      { question: t("bigBangFaq.q3"), answer: t("bigBangFaq.a3") },
      { question: t("bigBangFaq.q4"), answer: t("bigBangFaq.a4") },
      { question: t("bigBangFaq.q5"), answer: t("bigBangFaq.a5") },
      { question: t("bigBangFaq.q6"), answer: t("bigBangFaq.a6") },
      { question: t("bigBangFaq.q7"), answer: t("bigBangFaq.a7") },
      { question: t("bigBangFaq.q8"), answer: t("bigBangFaq.a8") },
      { question: t("bigBangFaq.q9"), answer: t("bigBangFaq.a9") },
      { question: t("bigBangFaq.q10"), answer: t("bigBangFaq.a10") },
    ],
    [t],
  );

  const suggestedQuestions = [
    "bigBangQuestionGuest",
    "bigBangQuestionGoogle",
    "bigBangQuestionJourney",
    "bigBangQuestionAvailable",
    "bigBangQuestionBuilt",
    "bigBangQuestionChallenges",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopControls />

      <main className="section-wrapper py-24">
        <div className="mx-auto max-w-6xl">
          <header className="mb-10 max-w-3xl">
            <p className="caption-text mb-3 uppercase tracking-[0.2em]">
              {t("bigBangDemoButton")}
            </p>
            <h1 className="heading-section mb-4">{t("bigBangTitle")}</h1>
            <p className="body-text">{t("bigBangSummary")}</p>
          </header>

          <section className="mb-8" aria-labelledby="big-bang-stack">
            <h2 id="big-bang-stack" className="heading-card mb-4">
              {t("bigBangStack")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {techStack.map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary"
                >
                  {technology}
                </span>
              ))}
            </div>
          </section>

          <section className="mb-10 grid gap-6 lg:grid-cols-2" aria-label="Project overview">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3 text-primary">
                <Gamepad2 className="h-5 w-5" aria-hidden="true" />
                <h2 className="heading-card">{t("bigBangTryTitle")}</h2>
              </div>
              <p className="body-text mb-4">{t("bigBangTryBody")}</p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {tryItems.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3 text-primary">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
                <h2 className="heading-card">{t("bigBangBuiltTitle")}</h2>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {builtItems.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3 text-primary">
              <TimerReset className="h-5 w-5" aria-hidden="true" />
              <h2 className="heading-card">{t("bigBangChallengesTitle")}</h2>
            </div>
            <ul className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
              {challengeItems.map((item) => (
                <li key={item} className="flex gap-3 rounded-xl border border-border bg-background/40 p-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="big-bang-demo" className="mb-10">
            <h2 id="big-bang-demo" className="sr-only">
              {t("bigBangDemoButton")}
            </h2>
            <div className="mx-auto max-w-[390px]">
              <div className="overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
                <div
                  className="relative w-full bg-muted"
                  style={{ aspectRatio: `${GAME_PREVIEW_RATIO}` }}
                >
                  {!iframeFailed ? (
                    <>
                      {isPreviewLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted/90 text-center text-sm text-muted-foreground">
                          <span>{t("bigBangPreviewLoading")}</span>
                        </div>
                      )}
                      <iframe
                        src={DEMO_URL}
                        title="Big Bang Duel live preview"
                        className="h-full w-full border-0"
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation-by-user-activation"
                        onLoad={() => setIsPreviewLoading(false)}
                        onError={() => {
                          setIsPreviewLoading(false);
                          setIframeFailed(true);
                        }}
                      />
                    </>
                  ) : (
                    <div
                      role="alert"
                      className="flex h-full items-center justify-center p-6 text-center text-muted-foreground"
                    >
                      <div className="max-w-lg">
                        <p className="mb-4">{t("bigBangPreviewFallback")}</p>
                        <Button asChild>
                          <a href={DEMO_URL} target="_blank" rel="noopener noreferrer">
                            <ExternalLink aria-hidden="true" className="mr-2 h-4 w-4" />
                            {t("bigBangOpenFull")}
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <p className="caption-text mt-3 text-center">{t("bigBangPreviewCaption")}</p>
            </div>
          </section>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <a href={DEMO_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink aria-hidden="true" className="mr-2 h-4 w-4" />
                {t("bigBangOpenFull")}
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link to="/#projects">
                <ArrowLeft aria-hidden="true" className="mr-2 h-4 w-4" />
                {t("bigBangBack")}
              </Link>
            </Button>
          </div>

          <section
            className="mt-12 rounded-2xl border border-primary/30 bg-primary/5 p-6"
            aria-labelledby="big-bang-chat-title"
          >
            <div className="flex flex-col gap-4">
              <div>
                <h2 id="big-bang-chat-title" className="heading-card">
                  {t("bigBangAskTitle")}
                </h2>
                <p className="body-text mt-2">{t("bigBangChatDescription")}</p>
              </div>

              {!isContextChatOpen && (
                <Button
                  type="button"
                  onClick={() => setIsContextChatOpen(true)}
                  aria-controls="big-bang-context-chat"
                >
                  {t("bigBangAskTitle")}
                </Button>
              )}

              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-foreground">
                  {t("bigBangSuggestedQuestions")}
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

              <p className="caption-text">{t("bigBangSafetyNote")}</p>

              {isContextChatOpen && (
                <div id="big-bang-context-chat" className="rounded-2xl bg-neutral-950/10 p-1">
                  <ChatBot
                    projectId="big-bang-duel"
                    initialPrompt={initialPrompt}
                    embedded
                    onClose={() => setIsContextChatOpen(false)}
                  />
                </div>
              )}
            </div>
          </section>

          <section className="mt-10" aria-labelledby="big-bang-faq-title">
            <div className="mb-4 flex items-center gap-3 text-primary">
              <Gamepad2 className="h-5 w-5" aria-hidden="true" />
              <h2 id="big-bang-faq-title" className="heading-card">
                {t("bigBangFaqTitle")}
              </h2>
            </div>
            <p className="body-text mb-5 max-w-3xl">{t("bigBangFaqIntro")}</p>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={item.question}
                  value={`faq-${index}`}
                  className="rounded-2xl border border-border bg-card px-4 shadow-sm"
                >
                  <AccordionTrigger className="text-left text-base font-medium text-foreground">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pt-3 text-sm leading-7 text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section className="mt-10" aria-labelledby="big-bang-tech">
            <h2 id="big-bang-tech" className="heading-card mb-4">
              {t("bigBangTechTitle")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {techStack.map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-border bg-background px-3 py-1 text-sm text-foreground"
                >
                  {technology}
                </span>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BigBangDuelProject;
