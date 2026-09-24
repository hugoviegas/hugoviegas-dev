import { useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";
import LegoButton from "./LegoButton";
import automationProject from "@/assets/project-automation.jpg";
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

interface Project {
  id: number;
  image: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  detailUrl?: string;
}

<<<<<<< HEAD
/** Copy lives in translations (`project.<id>.*`); only assets/links live here. */
const PROJECTS: Project[] = [
  {
    id: 1,
    image: darcyMcgeesProject,
    technologies: ["HTML5", "CSS3", "React", "Responsive Design"],
    liveUrl: "https://www.darcymcgeespub.com/",
    githubUrl: "https://github.com/hugoviegas/mcgees-irish-pub-online",
    detailUrl: "/projects/darcy-mcgees",
  },
  {
    id: 2,
    image: automationProject,
    technologies: [
      "JavaScript",
      "Google Apps Script",
      "AppSheet",
      "Google Sheets",
    ],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 4,
    image: taskManagerProject,
    technologies: ["React", "TypeScript", "Tailwind CSS", "Supabase"],
    liveUrl: "#",
    githubUrl: "#",
  },
];
=======
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
>>>>>>> 57341ddefe7f3b416527f9e2d2bc41d6daab08c4

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

<<<<<<< HEAD
/** Decorative bricks that fly outwards on card hover (CSS-driven, see index.css). */
const BrickExplosion = () => {
  const bricks = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        img: BRICK_IMAGES[Math.floor(Math.random() * BRICK_IMAGES.length)],
        size: 12 + Math.floor(Math.random() * 28),
        left: Math.random() * 100,
        top: Math.random() * 100,
        rotate: -25 + Math.random() * 50,
        delay: Math.random() * 220,
        moveX: Math.round(-120 + Math.random() * 240),
        moveY: Math.round(-120 + Math.random() * -20), // prefer upward
      })),
    []
=======
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
        <div className="w-full h-44 md:h-56 overflow-hidden">
          <img
            src={project.image}
            alt={t(project.titleKey)}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content below image */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-1 text-foreground">
              {t(project.titleKey)}
            </h3>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(project.liveUrl, "_blank")}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
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
>>>>>>> 57341ddefe7f3b416527f9e2d2bc41d6daab08c4
  );

  return (
    <>
      {bricks.map((brick) => (
        <img
          key={brick.id}
          src={brick.img}
          alt=""
          aria-hidden="true"
          className="brick-explosion-item"
          style={
            {
              width: `${brick.size}px`,
              height: "auto",
              left: `${brick.left}%`,
              top: `${brick.top}%`,
              "--be-delay": `${brick.delay}ms`,
              "--rand-rot": `${brick.rotate}deg`,
              "--move-x": `${brick.moveX}px`,
              "--move-y": `${brick.moveY}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  );
};

const ProjectsSection = () => {
  const { t } = useLanguage();

  const openUrl = (url: string) => {
    if (url && url !== "#") window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
<<<<<<< HEAD
    <section id="projects" className="section-shell">
      <div className="section-wrapper-wide">
        <div className="fade-in mb-12 text-center">
=======
    <section id="projects" className="py-20 relative w-full">
      <div className="container mx-auto px-6 lg:px-8 wide-container">
        <div className="text-center mb-12 fade-in">
>>>>>>> 57341ddefe7f3b416527f9e2d2bc41d6daab08c4
          <h2 className="heading-section mb-4">{t("projectsTitle")}</h2>
          <p className="body-text mx-auto max-w-3xl">{t("projectsIntro")}</p>
        </div>

<<<<<<< HEAD
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, index) => {
            const title = t(`project.${project.id}.title`);
            return (
              <div
                key={project.id}
                className="project-wrapper relative"
                style={{ animationDelay: `${index * 140}ms` }}
              >
                {/* Brick layer renders before the card so it sits behind it */}
                <div
                  className="brick-explosion-layer pointer-events-none"
                  aria-hidden="true"
                >
                  <BrickExplosion />
                </div>

                <div className="card-project glass-card relative z-10 flex h-full flex-col overflow-hidden">
                  <div className="h-44 w-full overflow-hidden md:h-56">
                    {project.detailUrl ? (
                      <Link to={project.detailUrl} aria-label={title}>
                        <img
                          src={project.image}
                          alt={title}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </Link>
                    ) : (
                      <img
                        src={project.image}
                        alt={title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-4 p-6">
                    <div>
                      {project.detailUrl ? (
                        <Link to={project.detailUrl} className="block">
                          <h3 className="mb-2 text-lg font-bold text-foreground">
                            {title}
                          </h3>
                        </Link>
                      ) : (
                        <h3 className="mb-2 text-lg font-bold text-foreground">
                          {title}
                        </h3>
                      )}
                      <p className="caption-text line-clamp-4">
                        {t(`project.${project.id}.description`)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="border-primary/30 text-primary"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`${t("liveDemo")} — ${title}`}
                          disabled={project.liveUrl === "#"}
                          onClick={() => openUrl(project.liveUrl)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`${t("viewCode")} — ${title}`}
                          disabled={project.githubUrl === "#"}
                          onClick={() => openUrl(project.githubUrl)}
                        >
                          <Github className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Decorative bricks on the right edge */}
                  <div
                    className="decor-bricks pointer-events-none absolute right-[-18px] top-10 hidden flex-col items-center gap-2 md:flex"
                    aria-hidden="true"
                  >
                    <img
                      src={redFront}
                      className="lego-rot-1 h-5 w-10 drop-shadow-lg"
                      alt=""
                    />
                    <img
                      src={yellowFront}
                      className="lego-rot-2 h-4 w-8 drop-shadow-lg"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            );
          })}
=======
        {/* Uniform square tiles layout: show three specific projects (restore missing one) */}
        <div className="grid md:grid-cols-3 gap-6">
          {([projects[0], projects[1], projects[3]] as Project[]).map(
            (p, i) => (
              <ProjectTile key={p.id} project={p} index={i} />
            ),
          )}
>>>>>>> 57341ddefe7f3b416527f9e2d2bc41d6daab08c4
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
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
