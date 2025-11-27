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

  const projects = [
    {
      id: 1,
      title: "D'Arcy McGee's Irish Pub Website",
      description:
        "Professional restaurant website for D'Arcy McGee's Irish Pub featuring modern responsive design, interactive menu system, event listings, and seamless user experience.",
      image: darcyMcgeesProject,
      technologies: ["HTML5", "CSS3", "ReactJs", "Responsive Design"],
      category: "Web Development",
      featured: true,
      liveUrl: "https://www.darcymcgeespub.com/",
      githubUrl: "https://github.com/hugoviegas/mcgees-irish-pub-online",
      metrics: "Live Client Website",
    },
    {
      id: 2,
      title: "Business Process Automation System",
      description:
        "Custom JavaScript solution integrated with Google Sheets and AppSheet that reduced critical business processes by 90%.",
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
      metrics: "90% time reduction",
    },
    {
      id: 3,
      title: "Modern E-Commerce Platform",
      description:
        "Full-stack e-commerce solution built with React and Node.js. Features include user authentication, payment processing, inventory management, and admin dashboard.",
      image: ecommerceProject,
      technologies: ["React", "Node.js", "Express", "SQL", "Stripe"],
      category: "Web Development",
      featured: false,
      liveUrl: "#",
      githubUrl: "#",
      metrics: "Full-stack solution",
    },
    {
      id: 4,
      title: "Project Management Dashboard",
      description:
        "Collaborative task management application with real-time updates, team collaboration features, and project analytics.",
      image: taskManagerProject,
      technologies: ["React", "TypeScript", "Tailwind CSS", "Supabase"],
      category: "Web Development",
      featured: false,
      liveUrl: "#",
      githubUrl: "#",
      metrics: "Team collaboration",
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
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content below image */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-1 text-foreground">
              {project.title}
            </h3>
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
    <section
      id="projects"
      className="py-20 relative w-full"
    >
      <div className="container mx-auto px-6 lg:px-8 wide-container">
        <div className="text-center mb-12 fade-in">
          <h2 className="heading-section mb-4">{t("projectsTitle")}</h2>
          <p className="text-lg text-muted-foreground max-w-[min(900px,92vw)] mx-auto leading-relaxed">
            {t("projectsIntro")}
          </p>
        </div>

        {/* Uniform square tiles layout: show three specific projects (restore missing one) */}
        <div className="grid md:grid-cols-3 gap-6">
          {([projects[0], projects[1], projects[3]] as Project[]).map(
            (p, i) => (
              <ProjectTile key={p.id} project={p} index={i} />
            )
          )}
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
