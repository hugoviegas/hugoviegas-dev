import {
  Code,
  Globe,
  BookOpen,
  TrendingUp,
  Target,
  Brain,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import SkillsSection from "@/components/SkillsSection";
import redFront from "@/assets/lego-bricks/red-front.png";
import yellowFront from "@/assets/lego-bricks/yellow-front.png";
import blueFront from "@/assets/lego-bricks/blue-front.png";
import whiteFront from "@/assets/lego-bricks/white-front.png";
import StarWarsCrawlOverlay from "@/components/StarWarsCrawl";

const AboutSection = () => {
  const { t, language } = useLanguage();
  const [isCrawlOpen, setIsCrawlOpen] = useState(false);
  const episodeLabel = language === "PT" ? "Episódio I" : "Episode I";
  const introText =
    language === "PT"
      ? "Há muito tempo, em uma galáxia não muito distante..."
      : "A long time ago in a galaxy far, far away....";
  const highlights = [
    {
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Globe,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Target,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
    {
      icon: Brain,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ];

  // Decorative LEGO bricks component
  const DecoLegoBricks = () => {
    const bricks = [
      { img: redFront, size: 24, top: "10%", left: "5%", rotation: -15 },
      { img: yellowFront, size: 28, top: "25%", right: "8%", rotation: 20 },
      { img: blueFront, size: 20, top: "60%", left: "3%", rotation: -10 },
      { img: whiteFront, size: 32, top: "80%", right: "5%", rotation: 25 },
    ];

    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {bricks.map((brick, i) => (
          <img
            key={i}
            src={brick.img}
            alt=""
            className="absolute opacity-20 transition-all duration-700 hover:opacity-30"
            style={{
              width: `${brick.size}px`,
              height: "auto",
              top: brick.top,
              left: brick.left,
              right: brick.right,
              transform: `rotate(${brick.rotation}deg)`,
              filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <section id="about" className="section-y relative w-full bg-muted/20">
      <DecoLegoBricks />

      <div className="section-wrapper relative z-10">
        <div className="section-header fade-in">
          <h2 className="heading-section">{t("aboutTitle")}</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Journey Column */}
          <div className="space-y-8 slide-up">
            <div className="glass-card card-padding space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 shrink-0 rounded-full bg-primary flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="heading-card">{t("myJourney")}</h3>
              </div>

              <div className="space-y-4">
                <p className="body-text">{t("journeySummary1")}</p>
                <p className="body-text">{t("journeySummary2")}</p>
              </div>

              <Button
                variant="outline"
                className="border-primary/40 hover:bg-primary/10"
                onClick={() => setIsCrawlOpen(true)}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {t("readFullStory")}
              </Button>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="glass-card glass-card-hover p-6 group"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${highlight.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <highlight.icon className={`w-6 h-6 ${highlight.color}`} />
                  </div>
                  <h4 className="mb-2 text-lg font-semibold text-foreground">
                    {t(`highlight${index + 1}Title`)}
                  </h4>
                  <p className="caption-text">
                    {t(`highlight${index + 1}Desc`)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Column */}
          <div className="space-y-8 slide-up delay-300">
            <div className="glass-card card-padding">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 shrink-0 rounded-full bg-primary flex items-center justify-center">
                  <Code className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="heading-card">{t("technicalSkills")}</h3>
              </div>

              <SkillsSection />
            </div>

            {/* Languages Card */}
            <div className="glass-card card-padding">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="heading-card">{t("languagesTitle")}</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center gap-4 p-4 rounded-xl bg-muted/40">
                  <span className="font-medium text-foreground">
                    {t("portuguese")}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-accent/15 text-accent border border-accent/30"
                  >
                    {t("native")}
                  </Badge>
                </div>
                <div className="flex justify-between items-center gap-4 p-4 rounded-xl bg-muted/40">
                  <span className="font-medium text-foreground">
                    {t("english")}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-primary/15 text-primary border border-primary/30"
                  >
                    {t("c1Proficiency")}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StarWarsCrawlOverlay
        open={isCrawlOpen}
        onClose={() => setIsCrawlOpen(false)}
        title={t("fullStoryTitle")}
        story={t("fullStory")}
        episodeLabel={episodeLabel}
        introText={introText}
      />
    </section>
  );
};

export default AboutSection;
