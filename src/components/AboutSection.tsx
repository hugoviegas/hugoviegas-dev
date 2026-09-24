import { useMemo } from "react";
import { Code, Globe, BookOpen, TrendingUp, Target, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import StatsSection from "@/components/StatsSection";
import SkillsSection from "@/components/SkillsSection";
import FastTransparentCube from "@/components/FastTransparentCube";
import redFront from "@/assets/lego-bricks/red-front.png";
import yellowFront from "@/assets/lego-bricks/yellow-front.png";
import blueFront from "@/assets/lego-bricks/blue-front.png";
import whiteFront from "@/assets/lego-bricks/white-front.png";

const HIGHLIGHTS = [
  {
    icon: TrendingUp,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: Globe,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Target,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Brain,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-500/10",
  },
];

const DECO_BRICKS = [
  { img: redFront, size: 24, top: "10%", left: "5%", rotation: -15 },
  { img: yellowFront, size: 28, top: "25%", right: "8%", rotation: 20 },
  { img: blueFront, size: 20, top: "60%", left: "3%", rotation: -10 },
  { img: whiteFront, size: 32, top: "80%", right: "5%", rotation: 25 },
];

/** Static decorative bricks scattered behind the section. */
const DecoLegoBricks = () => (
  <div
    className="pointer-events-none absolute inset-0 overflow-hidden"
    aria-hidden="true"
  >
    {DECO_BRICKS.map((brick, i) => (
      <img
        key={i}
        src={brick.img}
        alt=""
        className="absolute opacity-20 drop-shadow-md transition-opacity duration-700"
        style={{
          width: `${brick.size}px`,
          height: "auto",
          top: brick.top,
          left: brick.left,
          right: brick.right,
          transform: `rotate(${brick.rotation}deg)`,
        }}
      />
    ))}
  </div>
);

const AboutSection = () => {
  const { t } = useLanguage();

  const highlights = useMemo(
    () =>
      HIGHLIGHTS.map((h, i) => ({
        ...h,
        title: t(`highlight${i + 1}Title`),
        description: t(`highlight${i + 1}Desc`),
      })),
    [t]
  );

  return (
    <section id="about" className="section-shell bg-muted/20">
      <DecoLegoBricks />

      <div className="section-wrapper relative z-10">
        <h2 className="heading-section fade-in mb-8 text-center md:mb-12">
          {t("aboutTitle")}
        </h2>

        {/* Intro */}
        <div className="glass-card fade-in mb-12 p-6 md:p-8 lg:p-12">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6">
              <p className="body-text text-foreground/90">{t("aboutSummary")}</p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <Code className="mr-2 h-4 w-4" />
                  {t("badge.fullStack")}
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <Globe className="mr-2 h-4 w-4" />
                  {t("badge.location")}
                </Badge>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <FastTransparentCube width={280} height={280} enableExpand />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-12 md:mb-16">
          <StatsSection />
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Journey column */}
          <div className="slide-up space-y-8">
            <div className="glass-card space-y-6 p-6 md:p-8 lg:p-10">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary">
                  <BookOpen className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="heading-card text-primary">{t("myJourney")}</h3>
              </div>

              <div className="space-y-4">
                <p className="body-text">{t("journeySummary1")}</p>
                <p className="body-text">{t("journeySummary2")}</p>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/5"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    {t("readFullStory")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[85vh] max-w-[min(900px,95vw)] overflow-y-auto rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="heading-card pr-8 text-left text-primary">
                      {t("fullStoryTitle")}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-6">
                    {t("fullStory")
                      .split("\n\n")
                      .map((paragraph, index) => (
                        <p
                          key={index}
                          className="text-base leading-relaxed text-foreground/90"
                        >
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Highlights grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="glass-card group p-6 transition-transform duration-300 hover:scale-[1.03]"
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${highlight.bgColor}`}
                  >
                    <highlight.icon className={`h-6 w-6 ${highlight.color}`} />
                  </div>
                  <h4 className="mb-2 text-lg font-semibold text-foreground">
                    {highlight.title}
                  </h4>
                  <p className="caption-text">{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills column */}
          <div className="slide-up space-y-8 delay-300">
            <div className="glass-card p-6 md:p-8 lg:p-10">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Code className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="heading-card text-primary">
                  {t("technicalSkills")}
                </h3>
              </div>

              <SkillsSection />
            </div>

            {/* Languages card */}
            <div className="glass-card p-6 md:p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary">
                  <Globe className="h-5 w-5 text-primary-foreground" />
                </div>
                <h4 className="heading-card">{t("languagesTitle")}</h4>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 p-4">
                  <span className="font-medium text-foreground">
                    {t("language.portuguese")}
                  </span>
                  <Badge
                    variant="secondary"
                    className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  >
                    {t("native")}
                  </Badge>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 p-4">
                  <span className="font-medium text-foreground">
                    {t("language.english")}
                  </span>
                  <Badge
                    variant="secondary"
                    className="border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400"
                  >
                    {t("c1Proficiency")}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
