import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import {
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

const DEMO_URL = import.meta.env.VITE_DEMO_DARCY_URL || "https://demo-darcy.hugoviegas.dev";

const DarcyProject = () => {
  const { t } = useLanguage();
  const lang = useContentLang();
  const detail = useProjectDetail("darcy-mcgees");
  const text = detail?.[lang];
  const { projects } = useCoreContent();
  const card = projects.find((p) => p.id === "darcy-mcgees");
  const next = projects.find((p) => p.id === "big-bang-duel");
  const image = card ? resolveContentImage(card.image) : undefined;
  const stack = detail?.stack ?? [];

  return (
    <div className="relative min-h-screen text-foreground">
      <main id="main-content" tabIndex={-1} className={`${pageContainer} focus:outline-none`}>
        <ProjectHero
          kind={t("nav.projectTypeDarcy")}
          title={text?.title ?? t("projectsMenuDarcy")}
          summary={text?.summary}
          image={image}
          imageAlt={card?.[lang].imageAlt ?? ""}
          actions={
            <Button asChild variant="primary" size="lg">
              <a href={DEMO_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink aria-hidden="true" />
                {t("darcyOpenFull")}
              </a>
            </Button>
          }
        />

        <KeyFacts
          facts={[
            { label: t("factType"), value: t("nav.projectTypeDarcy") },
            { label: t("factStack"), value: stack.slice(0, 3).join(", ") },
            { label: t("factDemo"), value: t("factDemoValue") },
          ]}
        />

        <PageSection id="try" eyebrow={t("projectTryIt")} title={t("darcyDemoButton")}>
          <DemoFrame
            url={DEMO_URL}
            title="D'Arcy McGee's demo (EN/PT)"
            poster={image}
            frameClass="aspect-video w-full max-sm:aspect-[3/4]"
            openLabel={t("darcyOpenFull")}
            fallback={t("darcyIframeFallback")}
            note={t("darcyDemoNote")}
          />
        </PageSection>

        <ProjectAssistant
          projectId="darcy"
          titleKey="darcyAskTitle"
          descriptionKey="darcyChatDescription"
          suggestionsKey="darcySuggestedQuestions"
          safetyKey="darcySafetyNote"
          questionKeys={[
            "darcyQuestionProblem",
            "darcyQuestionAdmin",
            "darcyQuestionAi",
            "darcyQuestionReservations",
            "darcyQuestionData",
            "darcyQuestionImpact",
          ]}
        />

        {next && next.detailPath && (
          <NextProject to={next.detailPath} title={next[lang].title} line={next[lang].description} image={resolveContentImage(next.image)} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DarcyProject;
