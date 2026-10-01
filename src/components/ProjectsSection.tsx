import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";
import LegoButton from "./LegoButton";
import { contentImages } from "@/content/images";
import { useContentLang, useCoreContent } from "@/content/store";
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
  const { t } = useLanguage();

  const lang = useContentLang();
  const { projects } = useCoreContent();

  // Published projects only (the snapshot and the refresh drop drafts). Optional
  // links and images are omitted, never "#".
  interface Project {
    id: string;
    title: string;
    description: string;
    image?: string;
    imageAlt: string;
    // Intrinsic image size, used to reserve space and avoid layout shift.
    imageWidth?: number;
    imageHeight?: number;
    technologies: string[];
    liveUrl?: string;
    githubUrl?: string;
    detailUrl?: string;
  }

  const publishedProjects: Project[] = projects.map((doc) => ({
    id: doc.id,
    title: doc[lang].title,
    description: doc[lang].description,
    image: contentImages[doc.image],
    imageAlt: doc[lang].imageAlt,
    imageWidth: doc.imageWidth || undefined,
    imageHeight: doc.imageHeight || undefined,
    technologies: doc.technologies,
    liveUrl: doc.liveUrl || undefined,
    githubUrl: doc.githubUrl || undefined,
    detailUrl: doc.detailPath || undefined,
  }));

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
              <Link to={project.detailUrl} aria-label={project.title}>
                <img
                  src={project.image}
                  alt={project.imageAlt}
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
                alt={project.imageAlt}
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
                  {project.title}
                </h3>
              </Link>
            ) : (
              <h3 className="text-lg font-bold mb-1 text-foreground">
                {project.title}
              </h3>
            )}
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
              {project.description}
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
                    aria-label={`${project.title}: ${t("viewProject")}`}
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
                    aria-label={`${project.title}: ${t("viewCode")}`}
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
