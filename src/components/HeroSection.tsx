import { useState } from "react";
import { Briefcase, Download, MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import IsoBrick from "@/components/brand/IsoBrick";
import { useLanguage } from "@/hooks/useLanguage";
import { useContentLang, useSiteFiles } from "@/content/store";
import { FALLBACK_CV_URL } from "@/content/siteFiles";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hugo-hero.webp";
import minifigImage from "@/assets/brand/hugo-minifig.webp";
import sceneImage from "@/assets/brand/desk-scene.webp";
import sceneImageSmall from "@/assets/brand/desk-scene-800.webp";

type Face = "photo" | "minifig";

const linkClass =
  "rounded-sm text-sm font-semibold text-primary underline-offset-4 hover:text-primary-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const HeroSection = () => {
  const { t } = useLanguage();
  const lang = useContentLang();
  const { cv, profilePhoto, avatarMinifig, avatarFirst } = useSiteFiles();
  const [flipped, setFlipped] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [photoFailed, setPhotoFailed] = useState(false);
  const [minifigFailed, setMinifigFailed] = useState(false);

  const resumeUrl = cv?.url ?? FALLBACK_CV_URL;
  // Fall back to the bundled photo if the uploaded one fails to load.
  const photoSrc = !photoFailed && profilePhoto?.url ? profilePhoto.url : heroImage;
  const faces: Record<Face, { src: string; label: string }> = {
    photo: { src: photoSrc, label: profilePhoto?.alt[lang] ?? t("heroFacePhoto") },
    minifig: {
      src: !minifigFailed && avatarMinifig?.url ? avatarMinifig.url : minifigImage,
      label: avatarMinifig?.alt[lang] ?? t("heroFaceMinifig"),
    },
  };
  // Which face is shown first is set in the admin (settings/site.avatarFirst).
  const front: Face = avatarFirst === "minifig" ? "minifig" : "photo";
  const back: Face = front === "photo" ? "minifig" : "photo";
  const showing = flipped ? back : front;

  const flip = () => {
    const next = flipped ? front : back;
    setFlipped(!flipped);
    setAnnouncement(`${t("heroNowShowing")} ${faces[next].label}`);
  };

  const scrollToProjects = (event: React.MouseEvent) => {
    const el = document.getElementById("projects");
    if (!el) return;
    event.preventDefault();
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: "smooth" });
  };

  const faceClass =
    "absolute inset-0 overflow-hidden rounded-full shadow-[0_0_0_4px_hsl(var(--card)),0_0_0_5px_hsl(var(--border))] [backface-visibility:hidden]";

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative z-10 mx-auto grid w-full max-w-[1344px] items-center px-5 pt-[84px] sm:px-10 lg:min-h-[640px] lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-8 lg:px-12 lg:pt-32 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)] xl:px-[72px] [@media(max-height:500px)]:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] [@media(max-height:500px)]:gap-4 [@media(max-height:500px)]:pt-[72px]"
    >
      {/* Profile card: avatar beside the info; on phones the avatar sits centred above the card. */}
      <div className="relative mx-auto mt-24 flex w-full max-w-[680px] flex-col items-center rounded-3xl border border-border bg-card px-5 pb-6 pt-28 text-center shadow-e3 sm:mt-0 sm:flex-row sm:items-center sm:gap-6 sm:p-6 sm:text-left lg:mx-0 xl:gap-8 xl:p-8 max-[359px]:px-4 max-[359px]:pt-[104px] [@media(max-height:500px)]:mt-0 [@media(max-height:500px)]:flex-row [@media(max-height:500px)]:p-6 [@media(max-height:500px)]:text-left">
        <button
          type="button"
          onClick={flip}
          aria-pressed={flipped}
          aria-label={`${t("heroFlipLabel")} ${faces[showing].label}`}
          className="group absolute -top-[92px] left-1/2 h-[184px] w-[184px] -translate-x-1/2 shrink-0 rounded-full [perspective:800px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-8 focus-visible:ring-offset-card sm:relative sm:left-auto sm:top-auto sm:h-[148px] sm:w-[148px] sm:translate-x-0 xl:h-[184px] xl:w-[184px] max-[359px]:-top-[84px] max-[359px]:h-[168px] max-[359px]:w-[168px] [@media(max-height:500px)]:relative [@media(max-height:500px)]:left-auto [@media(max-height:500px)]:top-auto [@media(max-height:500px)]:h-[120px] [@media(max-height:500px)]:w-[120px] [@media(max-height:500px)]:translate-x-0"
        >
          <span
            className={cn(
              "absolute inset-0 transition-transform duration-flip ease-inout [transform-style:preserve-3d]",
              flipped && "[transform:rotateY(180deg)]",
            )}
          >
            <span className={faceClass}>
              <img
                src={faces[front].src}
                alt=""
                width={368}
                height={368}
                fetchPriority="high"
                onError={() => (front === "photo" ? setPhotoFailed(true) : setMinifigFailed(true))}
                className="h-full w-full object-cover"
              />
            </span>
            <span className={cn(faceClass, "[transform:rotateY(180deg)]")}>
              <img
                src={faces[back].src}
                alt=""
                width={368}
                height={368}
                loading="lazy"
                onError={() => (back === "photo" ? setPhotoFailed(true) : setMinifigFailed(true))}
                className="h-full w-full object-cover"
              />
            </span>
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "absolute bottom-1.5 right-0.5 z-10 grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_0_3px_hsl(var(--card))] transition-transform duration-base ease-snap group-hover:-rotate-[25deg] group-hover:scale-105",
              flipped && "rotate-180 group-hover:rotate-[155deg]",
            )}
          >
            <RefreshCw className="h-5 w-5" strokeWidth={2} />
          </span>
          <span
            aria-hidden="true"
            className="absolute -bottom-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-3 lg:block"
          >
            {t("heroFlipHint")}
          </span>
        </button>

        <div className="min-w-0">
          <h1
            id="hero-title"
            className="whitespace-nowrap text-[36px] font-extrabold leading-none tracking-[-0.025em] text-foreground sm:text-[44px] lg:text-[48px] xl:text-[56px] max-[359px]:text-[32px]"
          >
            Hugo Viegas
          </h1>
          <p className="mt-2.5 text-xl font-bold text-primary max-[359px]:text-lg">{t("role")}</p>
          <p className="mx-auto mt-3 max-w-[34ch] text-[17px] text-ink-2 sm:mx-0">{t("heroValue")}</p>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-ink-3 sm:justify-start [@media(max-height:500px)]:justify-start">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {t("heroLocation")}
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap [@media(max-height:500px)]:flex-row">
            <Button asChild variant="primary" size="lg">
              <a href="#projects" onClick={scrollToProjects}>
                <Briefcase aria-hidden="true" className="!size-[18px]" />
                {t("viewProjects")}
              </a>
            </Button>
            <Button asChild variant="neutral" size="lg">
              <a href={resumeUrl} download="Hugo_Viegas_CV.pdf" target="_blank" rel="noopener noreferrer">
                <Download aria-hidden="true" className="!size-[18px]" />
                {t("heroDownloadCv")}
              </a>
            </Button>
          </div>
          <p className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-start [@media(max-height:500px)]:justify-start">
            <a href="https://github.com/hugoviegas/" target="_blank" rel="noopener noreferrer" className={linkClass} aria-label={t("a11y.githubProfile")}>
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/hviegas/" target="_blank" rel="noopener noreferrer" className={linkClass} aria-label={t("a11y.linkedinProfile")}>
              LinkedIn
            </a>
            <a href="mailto:hugoviegas3.1@gmail.com" className={linkClass} aria-label={t("a11y.emailHugo")}>
              hugoviegas3.1@gmail.com
            </a>
          </p>
        </div>

        <IsoBrick shape="1x1" color="green" className="pointer-events-none absolute -top-[22px] right-10 hidden w-[30px] sm:block" />
      </div>

      {/* Desk scene: soft feathered edge (alpha mask) so it blends into either theme. */}
      <div className="relative -mx-5 mt-[-12px] min-h-[260px] self-stretch sm:mx-0 sm:mt-[-8px] sm:min-h-[400px] lg:mt-0 lg:min-h-[520px] [@media(max-height:500px)]:m-0 [@media(max-height:500px)]:min-h-[260px]">
        <img
          src={sceneImage}
          srcSet={`${sceneImageSmall} 800w, ${sceneImage} 1400w`}
          sizes="(min-width: 1024px) 50vw, 100vw"
          alt={t("heroSceneAlt")}
          width={1400}
          height={788}
          decoding="async"
          className="absolute inset-y-[-6%] left-[-2%] h-[112%] w-[104%] max-w-none object-cover [-webkit-mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_58%,transparent_100%)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_58%,transparent_100%)] dark:brightness-[.82] dark:saturate-[.95] lg:left-[-4%] lg:w-[118%]"
        />
        <IsoBrick shape="2x4" color="green" className="pointer-events-none absolute bottom-[10%] left-[4%] hidden w-[104px] sm:block" />
        <IsoBrick shape="1x2" color="white" className="pointer-events-none absolute right-[6%] top-[8%] hidden w-[54px] sm:block" />
      </div>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </section>
  );
};

export default HeroSection;
