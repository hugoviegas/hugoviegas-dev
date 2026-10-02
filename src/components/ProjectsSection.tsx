import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Code2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import FlatBrick from "@/components/brand/FlatBrick";
import { SectionHeading, sectionContainer } from "@/components/sections/Section";
import { useLanguage } from "@/hooks/useLanguage";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { resolveContentImage } from "@/content/images";
import { useContentLang, useCoreContent } from "@/content/store";
import { cn } from "@/lib/utils";

// Layout follows the number of published projects:
// 2 -> two large cards, 3 -> three in a row, 4+ -> three visible plus a
// carousel (arrows, dots, arrow keys; never auto-rotates). On phones every
// layout becomes a swipeable row with the next card peeking in.

interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
  liveUrl?: string;
  githubUrl?: string;
  detailUrl?: string;
}

type Mode = "two" | "three" | "carousel";

const railClass: Record<Mode, string> = {
  two: "sm:mr-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pr-0",
  three: "lg:mr-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pr-0",
  carousel: "lg:gap-6",
};

const cardBasis: Record<Mode, string> = {
  two: "sm:basis-auto",
  three: "sm:basis-[calc((100%-16px)/2.15)] lg:basis-auto",
  carousel: "sm:basis-[calc((100%-16px)/2.15)] lg:basis-[calc((100%-48px)/3)]",
};

const ProjectCard = ({ project, mode }: { project: Project; mode: Mode }) => {
  const { t } = useLanguage();
  return (
    <article
      aria-label={project.title}
      className={cn(
        "flex shrink-0 basis-[86%] snap-start flex-col overflow-hidden rounded-lg border border-border bg-card shadow-e2 transition-[transform,box-shadow] duration-base ease-out hover:-translate-y-[3px] hover:shadow-e3",
        cardBasis[mode],
      )}
    >
      <div className="relative mx-2 mt-2 aspect-[4/3] overflow-hidden rounded-xl bg-stage">
        {project.image && (
          <img
            src={project.image}
            alt={project.imageAlt}
            width={project.imageWidth}
            height={project.imageHeight}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        )}
        <FlatBrick studs={2} pitch={12} color="green" className="absolute left-2.5 top-2.5" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-5 pb-5 pt-4">
        <h3 className="text-xl font-bold leading-tight text-foreground">
          {project.detailUrl ? (
            <Link
              to={project.detailUrl}
              className="rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </h3>
        <p className="line-clamp-2 text-[15px] text-ink-3">{project.description}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-3">
          {project.detailUrl && (
            <Button asChild variant="primary" size="touch">
              <Link to={project.detailUrl} aria-label={`${project.title}: ${t("projectPage")}`}>
                {t("projectPage")}
              </Link>
            </Button>
          )}
          {project.liveUrl && (
            <Button asChild variant="neutral" size="touch">
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title}: ${t("projectLive")}`}>
                <ExternalLink aria-hidden="true" />
                {t("projectLive")}
              </a>
            </Button>
          )}
          {project.githubUrl && (
            <Button asChild variant="ghost" size="touch">
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title}: ${t("projectCode")}`}>
                <Code2 aria-hidden="true" />
                {t("projectCode")}
              </a>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};

const ProjectsSection = () => {
  const { t } = useLanguage();
  const lang = useContentLang();
  const { projects } = useCoreContent();
  const reduced = usePrefersReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(3);

  // Published projects only; optional links and images are omitted, never "#".
  const items: Project[] = projects.map((doc) => ({
    id: doc.id,
    title: doc[lang].title,
    description: doc[lang].description,
    image: resolveContentImage(doc.image),
    imageAlt: doc[lang].imageAlt,
    imageWidth: doc.imageWidth || undefined,
    imageHeight: doc.imageHeight || undefined,
    liveUrl: doc.liveUrl || undefined,
    githubUrl: doc.githubUrl || undefined,
    detailUrl: doc.detailPath || undefined,
  }));

  const count = items.length;
  const mode: Mode = count >= 4 ? "carousel" : count === 3 ? "three" : "two";
  const isCarousel = mode === "carousel";
  const maxIndex = Math.max(0, count - visible);

  const step = useCallback(() => {
    const rail = railRef.current;
    const first = rail?.firstElementChild as HTMLElement | null;
    if (!rail || !first) return 1;
    const gap = parseFloat(getComputedStyle(rail).columnGap || "0") || 0;
    return first.offsetWidth + gap;
  }, []);

  // Track how many cards fit and which one leads the row.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !isCarousel) return;
    const measure = () => setVisible(Math.max(1, Math.round(rail.clientWidth / step())));
    const onScroll = () => setIndex(Math.round(rail.scrollLeft / step()));
    measure();
    rail.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      rail.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [isCarousel, step, count]);

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(maxIndex, next));
    railRef.current?.scrollTo({ left: clamped * step(), behavior: reduced ? "auto" : "smooth" });
    setIndex(clamped);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!isCarousel) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    }
  };

  if (count === 0) return null;

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative z-10 pt-[72px] lg:pt-24">
      <div className={sectionContainer}>
        <SectionHeading
          id="projects-title"
          index="01"
          title={t("projectsHeading")}
          lead={t("projectsLead")}
          aside={
            isCarousel ? (
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-3" aria-hidden="true">
                {Math.min(index + 1, count)}–{Math.min(index + visible, count)} / {count}
              </p>
            ) : undefined
          }
        />
        <div
          role={isCarousel ? "region" : undefined}
          aria-roledescription={isCarousel ? t("projectsCarousel") : undefined}
          aria-label={isCarousel ? t("projectsHeading") : undefined}
          tabIndex={isCarousel ? 0 : undefined}
          onKeyDown={onKeyDown}
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          <div
            ref={railRef}
            className={cn(
              "-mr-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 pr-5 pt-1 [scrollbar-width:none] sm:-mr-10 sm:pr-10 lg:-mr-12 lg:pr-12 xl:-mr-[72px] xl:pr-[72px] [&::-webkit-scrollbar]:hidden",
              railClass[mode],
              isCarousel && "lg:mr-0 lg:pr-0 xl:mr-0 xl:pr-0",
            )}
          >
            {items.map((project) => (
              <ProjectCard key={project.id} project={project} mode={mode} />
            ))}
          </div>
          {isCarousel && (
            <div className="mt-5 flex items-center gap-3">
              <div className="mr-auto flex">
                {Array.from({ length: maxIndex + 1 }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`${t("projectsPage")} ${i + 1}`}
                    aria-current={i === index ? "true" : undefined}
                    className="grid h-11 w-11 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span
                      className={cn(
                        "block h-2 rounded-full transition-[width] duration-base ease-out",
                        i === index ? "w-[22px] bg-primary" : "w-2 bg-dot",
                      )}
                    />
                  </button>
                ))}
              </div>
              <div className="hidden gap-2 sm:flex">
                <button
                  type="button"
                  onClick={() => goTo(index - 1)}
                  disabled={index === 0}
                  aria-label={t("projectsPrev")}
                  className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card shadow-e2 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(index + 1)}
                  disabled={index >= maxIndex}
                  aria-label={t("projectsNext")}
                  className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card shadow-e2 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
