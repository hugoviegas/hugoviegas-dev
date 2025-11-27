import {
  Code,
  Globe,
  Users,
  Zap,
  BookOpen,
  TrendingUp,
  Award,
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
      title: "90% Process Reduction",
      description: "JavaScript + Google Workspace automation solution",
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      icon: Globe,
      title: "International Experience",
      description:
        "Working in Dublin while maintaining Brazilian roots and perspectives",
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      icon: Target,
      title: "Structured Training",
      description:
        "Improved first-contact resolution through clear documentation",
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
    {
      icon: Brain,
      title: "Continuous Learning",
      description:
        "Currently pursuing Computer Science degree at CCT College Dublin",
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
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
    <section
      id="about"
      className="py-20 bg-muted/3 relative w-full"
    >
      <DecoLegoBricks />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="mb-12 text-center fade-in">
          <h2 className="heading-section">{t("aboutTitle")}</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Journey Column */}
          <div className="space-y-8 slide-up">
            <div className="glass-strong rounded-3xl p-8 lg:p-10 space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-blue-500">
                  {t("myJourney")}
                </h3>
              </div>

              <div className="space-y-4">
                <p className="text-base lg:text-lg text-foreground/80 leading-relaxed">
                  {t("journeySummary1")}
                </p>
                <p className="text-base lg:text-lg text-foreground/80 leading-relaxed">
                  {t("journeySummary2")}
                </p>
              </div>

              <Button
                variant="outline"
                className="glass-strong border-primary/30 hover:bg-primary/5"
                onClick={() => setIsCrawlOpen(true)}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {t("readFullStory")}
              </Button>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="glass-strong rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-lg group"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${highlight.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <highlight.icon className={`w-6 h-6 ${highlight.color}`} />
                  </div>
                  <h4 className="font-semibold text-lg mb-2 text-foreground">
                    {t(`highlight${index + 1}Title`) || highlight.title}
                  </h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    {t(`highlight${index + 1}Desc`) || highlight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Column */}
          <div className="space-y-8 slide-up delay-300">
            <div className="glass-strong rounded-3xl p-8 lg:p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-blue-500">
                  Technical Skills
                </h3>
              </div>

              <SkillsSection />
            </div>

            {/* Languages Card */}
            <div className="glass-strong rounded-3xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-foreground">
                  Languages
                </h4>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-xl bg-muted/30">
                  <span className="font-medium text-foreground">
                    Portuguese
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-green-500/10 text-green-400 border-green-500/30"
                  >
                    Native
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-4 rounded-xl bg-muted/30">
                  <span className="font-medium text-foreground">English</span>
                  <Badge
                    variant="secondary"
                    className="bg-blue-500/10 text-blue-400 border-blue-500/30"
                  >
                    C1 Proficiency
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
