import { useState } from "react";
import { Code, Globe, Users, Zap, BookOpen } from "lucide-react";
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

const AboutSection = () => {
  const { t } = useLanguage();
  const highlights = [
    {
      icon: Zap,
      title: "90% Process Reduction",
      description: "JavaScript + Google Workspace automation solution",
    },
    {
      icon: Globe,
      title: "International Experience",
      description:
        "Working in Dublin while maintaining Brazilian roots and perspectives",
    },
    {
      icon: Users,
      title: "Structured Training",
      description:
        "Improved first-contact resolution through clear documentation",
    },
    {
      icon: Code,
      title: "Continuous Learning",
      description:
        "Currently pursuing Computer Science degree at CCT College Dublin",
    },
  ];

  const [startSolved, setStartSolved] = useState(false);

  const widgetSrc = `https://ruwix.com/widget/3d/?flags=showalg${
    startSolved ? "%20startsolved" : ""
  }`;

  return (
    <section id="about" className="py-20 bg-muted/5">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mb-16 fade-in">
          <h2 className="heading-section mb-6 text-center lg:text-left">
            {t("aboutTitle")}
          </h2>

          {/* Two-column intro: text + cube (only this first text block) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                {t("aboutSummary")}
              </p>
            </div>

            <div className="flex justify-center lg:justify-end">
              {/* Cube: smaller on mobile, with expand button inside the component */}
              <FastTransparentCube width={300} height={300} enableExpand />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20">
          <StatsSection />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Story Column */}
          <div className="space-y-8 slide-up">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gradient">
                {t("myJourney")}
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t("journeySummary1")}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t("journeySummary2")}
              </p>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="mt-4">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {t("readFullStory")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gradient">
                      {t("fullStoryTitle")}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                    {t("fullStory")
                      .split("\n\n")
                      .map((paragraph, index) => (
                        <p key={index} className="text-base">
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {highlights.map((highlight, index) => (
                <div key={index} className="card-skill">
                  <highlight.icon className="w-8 h-8 text-primary mb-4 mx-auto" />
                  <h4 className="font-semibold text-lg mb-2">
                    {t(`highlight${index + 1}Title`) || highlight.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t(`highlight${index + 1}Desc`) || highlight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Column */}
          <div className="space-y-8 slide-up delay-300">
            <h3 className="text-3xl font-bold text-gradient">
              Technical Skills
            </h3>

            <SkillsSection />

            {/* Languages */}
            <div className="glass p-6 rounded-xl">
              <h4 className="text-xl font-semibold text-primary mb-4">
                Languages
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Portuguese</span>
                  <Badge variant="secondary">Native</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>English</span>
                  <Badge variant="secondary">C1 Proficiency</Badge>
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
