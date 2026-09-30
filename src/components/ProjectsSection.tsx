import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";
import LegoButton from "./LegoButton";
import darcyMcgeesProject from "@/assets/project-darcy-mcgees.webp";
import bigBangDuelProject from "@/assets/project-big-bang-duel.webp";
import redFront from "@/assets/lego-bricks/red-front.webp";
import yellowFront from "@/assets/lego-bricks/yellow-front.webp";
import blueFront from "@/assets/lego-bricks/blue-front.webp";
import goldCoin2d from "@/assets/lego-bricks/gold-coin-2d.webp";
import goldCoinFront from "@/assets/lego-bricks/gold-coin-front.webp";
import goldCoinTop from "@/assets/lego-bricks/gold-coin-top.webp";
import redTop from "@/assets/lego-bricks/red-top.webp";
import whiteFront from "@/assets/lego-bricks/white-front.webp";
import whiteTop from "@/assets/lego-bricks/white-top.webp";
import whiteTopSingle from "@/assets/lego-bricks/white-top-single.webp";

const ProjectsSection = () => {
  const [selectedFilter] = useState("All");
  const { t } = useLanguage();

  // TODO: Future plans for this section:
  // - Social media post-inspired card design
  // - CRUD admin interface for adding/editing projects

  // Only entries with `published: true` render. Optional links/images are
  // omitted (not "#") until a verified destination or real screenshot exists.
  interface Project {
    id: number;
    titleKey: string;
    descriptionKey: string;
    image?: string;
    // Intrinsic image size, used to reserve space and avoid layout shift.
    imageWidth?: number;
    imageHeight?: number;
    technologies: string[];
    category: string;
    featured: boolean;
    published: boolean;
    liveUrl?: string;
    githubUrl?: string;
    detailUrl?: string;
    metricsKey: string;
  }

  const projects: Project[] = [
    {
      id: 1,
      titleKey: "project.1.title",
      descriptionKey: "project.1.description",
      image: darcyMcgeesProject,
      imageWidth: 1280,
      imageHeight: 720,
      technologies: ["HTML5", "CSS3", "ReactJs", "Responsive Design"],
      category: "Web Development",
      featured: true,
      published: true,
      liveUrl: "https://www.darcymcgeespub.com/",
      // GitHub repo is not publicly reachable; hidden until Hugo approves a public URL.
      detailUrl: "/projects/darcy-mcgees",
      metricsKey: "project.1.metrics",
    },
    {
      id: 2,
      titleKey: "project.5.title",
      descriptionKey: "project.5.description",
      // Real screenshot of the live game (character collection screen).
      image: bigBangDuelProject,
      imageWidth: 864,
      imageHeight: 557,
      technologies: [
        "React",
        "TypeScript",
        "Vite",
        "Tailwind CSS",
        "Zustand",
        "Firebase",
      ],
      category: "Game Development",
      featured: true,
      published: true,
      liveUrl: "https://duel.hugoviegas.dev",
      githubUrl: "https://github.com/hugoviegas/Big-bang-Duel",
      detailUrl: "/projects/big-bang-duel",
      metricsKey: "project.5.metrics",
    },
    {
      // ETAL QR Registration / automation: unpublished until Hugo approves public content.
      id: 3,
      titleKey: "project.2.title",
      descriptionKey: "project.2.description",
      technologies: [
        "JavaScript",
        "Google Apps Script",
        "AppSheet",
        "Google Sheets",
      ],
      category: "Automation",
      featured: true,
      published: false,
      metricsKey: "project.2.metrics",
    },
    // Erinhub: add here with `published: false` until approved content exists.
  ];

  const publishedProjects = projects.filter((project) => project.published);

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
      className="project-wrapper relative"
      style={{ animationDelay: `${index * 140}ms` }}
    >
      {/* Brick layer sits before the card so it can appear behind (lower z-index) and contains the bricks */}
      <div className="brick-explosion-layer pointer-events-none">
        <BrickExplosion />
      </div>

      <div className="card-project glass-strong rounded-2xl overflow-hidden relative flex flex-col z-10">
        {/* Image on top - keep full width and not covered by text */}
        {project.image && (
          <div className="w-full h-44 md:h-56 overflow-hidden">
            {project.detailUrl ? (
              <Link to={project.detailUrl} aria-label={t(project.titleKey)}>
                <img
                  src={project.image}
                  alt={t(project.titleKey)}
                  width={project.imageWidth}
                  height={project.imageHeight}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </Link>
            ) : (
              <img
                src={project.image}
                alt={t(project.titleKey)}
                width={project.imageWidth}
                height={project.imageHeight}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )}

        {/* Content below image */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            {project.detailUrl ? (
              <Link to={project.detailUrl} className="block">
                <h3 className="text-lg font-bold mb-1 text-foreground">
                  {t(project.titleKey)}
                </h3>
              </Link>
            ) : (
              <h3 className="text-lg font-bold mb-1 text-foreground">
                {t(project.titleKey)}
              </h3>
            )}
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
              {t(project.descriptionKey)}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech: string, i: number) => (
                <Badge key={i} variant="outline" className="text-primary">
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              {project.liveUrl && (
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t(project.titleKey)}: ${t("viewProject")}`}
                  >
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </a>
                </Button>
              )}
              {project.githubUrl && (
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t(project.titleKey)}: ${t("viewCode")}`}
                  >
                    <Github className="w-4 h-4" aria-hidden="true" />
                  </a>
                </Button>
              )}
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
    <section id="projects" className="py-20 relative w-full">
      <div className="container mx-auto px-6 lg:px-8 wide-container">
        <div className="text-center mb-12 fade-in">
          <h2 className="heading-section mb-4">{t("projectsTitle")}</h2>
          <p className="text-lg text-muted-foreground max-w-[min(900px,92vw)] mx-auto leading-relaxed">
            {t("projectsIntro")}
          </p>
        </div>

        {/* Uniform tiles layout: published projects only */}
        <div className="grid md:grid-cols-2 gap-6">
          {publishedProjects.map((p, i) => (
            <ProjectTile key={p.id} project={p} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground mb-6">
            {t("projectsCTA")}
          </p>
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
