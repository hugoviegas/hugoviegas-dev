import { Link } from "react-router-dom";
import { BookOpen, ExternalLink } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import {
  CompactList,
  DemoFrame,
  KeyFacts,
  NextProject,
  PageSection,
  ProjectAssistant,
  ProjectHero,
  pageContainer,
} from "@/components/project/ProjectParts";
import { useLanguage } from "@/hooks/useLanguage";
import { resolveContentImage } from "@/content/images";
import { useContentLang, useCoreContent } from "@/content/store";
import { useProjectDetail } from "@/content/useProjectDetail";
import poster from "@/assets/project-big-bang-duel.webp";

const DEMO_URL = import.meta.env.VITE_DEMO_BIG_BANG_DUEL_URL || "https://duel.hugoviegas.dev";

const BigBangDuelProject = () => {
  const { t } = useLanguage();
  const lang = useContentLang();
  const detail = useProjectDetail("big-bang-duel");
  const text = detail?.[lang];
  const { projects } = useCoreContent();
  const card = projects.find((p) => p.id === "big-bang-duel");
  const next = projects.find((p) => p.id === "darcy-mcgees");
  const section = (id: string) => text?.sections.find((item) => item.id === id);
  const trySection = section("try");
  const builtSection = section("built");
  const challenges = section("challenges");
  const stack = detail?.stack ?? [];

  return (
    <div className="relative min-h-screen text-foreground">
      <main id="main-content" tabIndex={-1} className={`${pageContainer} focus:outline-none`}>
        <ProjectHero
          kind={t("nav.projectTypeBigBang")}
          title={text?.title ?? t("projectsMenuBigBangDuel")}
          summary={text?.summary}
          image={card ? resolveContentImage(card.image) : undefined}
          imageAlt={card?.[lang].imageAlt ?? ""}
          actions={
            <>
              <Button asChild variant="primary" size="lg">
                <a href={DEMO_URL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink aria-hidden="true" />
                  {t("bigBangOpenFull")}
                </a>
              </Button>
              {text?.story && (
                <Button asChild variant="neutral" size="lg">
                  <Link to="/projects/big-bang-duel/story">
                    <BookOpen aria-hidden="true" />
                    {t("bigBangReadStory")}
                  </Link>
                </Button>
              )}
            </>
          }
        />

        <KeyFacts
          facts={[
            { label: t("factType"), value: t("nav.projectTypeBigBang") },
            { label: t("factStack"), value: stack.slice(0, 3).join(", ") },
            { label: t("factDemo"), value: t("factDemoValue") },
          ]}
        />

        <PageSection id="try" eyebrow={t("projectTryIt")} title={trySection?.title ?? t("bigBangDemoButton")}>
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
            <div>
              {trySection?.body && <p className="mb-4 max-w-[60ch] text-ink-2">{trySection.body}</p>}
              {trySection && <CompactList items={trySection.items} />}
            </div>
            <DemoFrame
              url={DEMO_URL}
              title="Big Bang Duel live preview"
              poster={poster}
              frameClass="mx-auto aspect-[390/844] w-full max-w-[390px]"
              openLabel={t("bigBangOpenFull")}
              fallback={t("bigBangPreviewFallback")}
            />
          </div>
        </PageSection>

        {builtSection && (
          <PageSection id="built" title={builtSection.title}>
            <CompactList items={builtSection.items} />
          </PageSection>
        )}

        {challenges && (
          <PageSection id="challenges" title={challenges.title}>
            <CompactList items={challenges.items} />
          </PageSection>
        )}

        {text && text.faq.length > 0 && (
          <PageSection id="faq" title={t("bigBangFaqTitle")}>
            <Accordion type="single" collapsible className="grid max-w-[820px] gap-3">
              {text.faq.slice(0, 5).map((item, index) => (
                <AccordionItem key={item.question} value={`faq-${index}`} className="rounded-lg border border-border bg-card px-5 shadow-e2">
                  <AccordionTrigger className="min-h-14 text-left text-base font-semibold text-foreground hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[15px] leading-7 text-ink-2">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </PageSection>
        )}

        <ProjectAssistant
          projectId="big-bang-duel"
          titleKey="bigBangAskTitle"
          descriptionKey="bigBangChatDescription"
          suggestionsKey="bigBangSuggestedQuestions"
          safetyKey="bigBangSafetyNote"
          questionKeys={[
            "bigBangQuestionGuest",
            "bigBangQuestionGoogle",
            "bigBangQuestionJourney",
            "bigBangQuestionAvailable",
            "bigBangQuestionBuilt",
            "bigBangQuestionChallenges",
          ]}
        />

        {next && next.detailPath && (
          <NextProject
            to={next.detailPath}
            title={next[lang].title}
            line={next[lang].description}
            image={resolveContentImage(next.image)}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BigBangDuelProject;
