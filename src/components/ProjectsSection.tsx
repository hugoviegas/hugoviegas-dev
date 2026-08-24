import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import LegoButton from "./LegoButton";
import automationProject from "@/assets/project-automation.jpg";
import ecommerceProject from "@/assets/project-ecommerce.jpg";
import taskManagerProject from "@/assets/project-taskmanager.jpg";
import darcyMcgeesProject from "@/assets/project-darcy-mcgees.jpg";
import redFront from "@/assets/lego-bricks/red-front.png";
import yellowFront from "@/assets/lego-bricks/yellow-front.png";
import blueFront from "@/assets/lego-bricks/blue-front.png";
import goldCoin2d from "@/assets/lego-bricks/gold-coin-2d.png";
import goldCoinFront from "@/assets/lego-bricks/gold-coin-front.png";
import goldCoinTop from "@/assets/lego-bricks/gold-coin-top.png";
import redTop from "@/assets/lego-bricks/red-top.png";
import whiteFront from "@/assets/lego-bricks/white-front.png";
import whiteTop from "@/assets/lego-bricks/white-top.png";
import whiteTopSingle from "@/assets/lego-bricks/white-top-single.png";

const ProjectsSection = () => {
  const [selectedFilter] = useState("All");
  const { t } = useLanguage();

  // TODO: Future plans for this section:
  // - Social media post-inspired card design
  // - Backend integration with MongoDB or Supabase for project management
  // - CRUD admin interface for adding/editing projects

  const projects = [
    {
      id: 1,
      titleKey: "project.1.title",
      descriptionKey: "project.1.description",
      image: darcyMcgeesProject,
      technologies: ["HTML5", "CSS3", "ReactJs", "Responsive Design"],
      category: "Web Development",
      featured: true,
      liveUrl: "https://www.darcymcgeespub.com/",
      githubUrl: "https://github.com/hugoviegas/mcgees-irish-pub-online",
      metricsKey: "project.1.metrics",
    },
    {
      id: 2,
      titleKey: "project.2.title",
      descriptionKey: "project.2.description",
      image: automationProject,
      technologies: [
        "JavaScript",
        "Google Apps Script",
        "AppSheet",
        "Google Sheets",
      ],
      category: "Automation",
      featured: true,
      liveUrl: "#",
      githubUrl: "#",
      metricsKey: "project.2.metrics",
    },
    {
      id: 3,
      titleKey: "project.3.title",
      descriptionKey: "project.3.description",
      image: ecommerceProject,
      technologies: ["React", "Node.js", "Express", "SQL", "Stripe"],
      category: "Web Development",
      featured: false,
      liveUrl: "#",
      githubUrl: "#",
      metricsKey: "project.3.metrics",
    },
    {
      id: 4,
      titleKey: "project.4.title",
      descriptionKey: "project.4.description",
      image: taskManagerProject,
      technologies: ["React", "TypeScript", "Tailwind CSS", "Supabase"],
      category: "Web Development",
      featured: false,
      liveUrl: "#",
      githubUrl: "#",
      metricsKey: "project.4.metrics",
    },
  ];

  type Project = (typeof projects)[number];

  // Helper: render the lego 'square tile' project card
  const ProjectTile = ({
    project,
    index,
  }: {
    project: Project;
    index: number;
  }) => (
    <div
      key={project.id}
      className="project-wrapper relative h-full"
      style={{ animationDelay: `${index * 140}ms` }}
    >
      {/* Brick layer sits before the card so it can appear behind (lower z-index) and contains the bricks */}
      <div className="brick-explosion-layer pointer-events-none">
        <BrickExplosion />
      </div>

      <div className="card-project glass-card relative z-10 flex h-full flex-col overflow-hidden">
        {/* Image on top - keep full width and not covered by text */}
        <div className="w-full aspect-[16/10] overflow-hidden">
          <img
            src={project.image}
            alt={t(project.titleKey)}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content below image */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="mb-1 text-lg font-semibold text-foreground">
              {t(project.titleKey)}
            </h3>
            <p className="caption-text line-clamp-4">
              {t(project.descriptionKey)}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech: string, i: number) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="border-primary/40 text-primary"
                >
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                aria-label={`${t(project.titleKey)} - live`}
                onClick={() => window.open(project.liveUrl, "_blank")}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`${t(project.titleKey)} - GitHub`}
                onClick={() => window.open(project.githubUrl, "_blank")}
              >
                <Github className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* decorative bricks to the right side, slightly rotated */}
        <div className="decor-bricks absolute right-[-18px] top-10 pointer-events-none hidden md:flex flex-col gap-2 items-center">
          <img
            src={redFront}
            className="w-10 h-5 lego-rot-1 drop-shadow-lg"
            alt=""
          />
          <img
            src={yellowFront}
            className="w-8 h-4 lego-rot-2 drop-shadow-lg"
            alt=""
          />
        </div>
      </div>

      {/* explosion content is rendered above (in DOM) inside the positioned layer before the card
          so it sits visually behind the card and animates on wrapper hover */}
    </div>
  );

  // BrickExplosion renders a set of decorative bricks using all available assets
  const BRICK_IMAGES = [
    redFront,
    yellowFront,
    blueFront,
    whiteFront,
    whiteTop,
    whiteTopSingle,
    redTop,
    goldCoin2d,
    goldCoinFront,
    goldCoinTop,
  ];

  const BrickExplosion = () => {
    // Create 28 bricks with randomized sizes/angles/positions
    const count = 28;
    return (
      <>
        {Array.from({ length: count }).map((_, i) => {
          const img =
            BRICK_IMAGES[Math.floor(Math.random() * BRICK_IMAGES.length)];
          const size = 12 + Math.floor(Math.random() * 28); // px
          // random starting position within the explosion layer (close to card edges)
          const left = Math.random() * 100; // percent
          const top = Math.random() * 100; // percent
          const rotate = -25 + Math.random() * 50; // degrees
          const delay = Math.random() * 220; // ms stagger
          // movement vector for the hover explosion (px)
          const moveX = Math.round(-120 + Math.random() * 240); // -120 .. +120
          const moveY = Math.round(-120 + Math.random() * -20); // -120 .. -20 (prefer upwards)

          return (
            <img
              key={i}
              src={img}
              alt=""
              className="brick-explosion-item"
              style={{
                width: `${size}px`,
                height: "auto",
                left: `${left}%`,
                top: `${top}%`,
                // initial rotation and per-item CSS vars used by hover animation
                ...({
                  ["--be-delay"]: `${delay}ms`,
                  ["--rand-rot"]: `${rotate}deg`,
                  ["--move-x"]: `${moveX}px`,
                  ["--move-y"]: `${moveY}px`,
                } as React.CSSProperties),
              }}
            />
          );
        })}
      </>
    );
  };

  return (
    <section id="projects" className="section-y relative w-full">
      <div className="section-wrapper">
        <div className="section-header fade-in">
          <h2 className="heading-section mb-4">{t("projectsTitle")}</h2>
          <p className="body-text mx-auto max-w-3xl">{t("projectsIntro")}</p>
        </div>

        {/* Uniform square tiles layout: show three specific projects (restore missing one) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {([projects[0], projects[1], projects[3]] as Project[]).map(
            (p, i) => (
              <ProjectTile key={p.id} project={p} index={i} />
            ),
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 md:mt-16">
          <p className="body-text mb-6">{t("projectsCTA")}</p>
          <LegoButton
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {t("projectsCTABtn")}
          </LegoButton>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
