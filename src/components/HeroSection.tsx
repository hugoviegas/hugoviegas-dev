import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  Github,
  Linkedin,
  Mail,
  FileText,
  Download,
} from "lucide-react";
import { LazyImage } from "@/components/LazyImage";
import LegoButton from "./LegoButton";
import { useLanguage } from "@/hooks/useLanguage";
import redFront from "@/assets/lego-bricks/red-front.png";
import yellowFront from "@/assets/lego-bricks/yellow-front.png";
import blueFront from "@/assets/lego-bricks/blue-front.png";
import whiteFront from "@/assets/lego-bricks/white-front.png";
import goldCoin2d from "@/assets/lego-bricks/gold-coin-2d.png";
import goldCoinFront from "@/assets/lego-bricks/gold-coin-front.png";
import goldCoinTop from "@/assets/lego-bricks/gold-coin-top.png";
import redTop from "@/assets/lego-bricks/red-top.png";
import whiteTop from "@/assets/lego-bricks/white-top.png";
import whiteTopSingle from "@/assets/lego-bricks/white-top-single.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getCurrentGreeting } from "@/lib/time-utils";
import heroImage from "@/assets/hugo-hero.jpg";

const HERO_BRICK_IMAGES = [
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

// Resume hosted on Vercel Blob storage
const RESUME_URL =
  "https://sb7cb98htp9acpqo.public.blob.vercel-storage.com/Files%20to%20Download/Hugo%20Viegas%20CV%202025.pdf";

/** Decorative bricks that fly outwards on hover (CSS-driven, see index.css). */
const HeroBrickExplosion = () => {
  const bricks = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        img: HERO_BRICK_IMAGES[
          Math.floor(Math.random() * HERO_BRICK_IMAGES.length)
        ],
        size: 16 + Math.floor(Math.random() * 24), // 16-40px
        left: Math.random() * 100,
        top: Math.random() * 100,
        rotate: -30 + Math.random() * 60,
        delay: Math.random() * 300,
        moveX: Math.round(-80 + Math.random() * 160),
        moveY: Math.round(-100 + Math.random() * 60), // prefer upward
      })),
    []
  );

  return (
    <>
      {bricks.map((brick) => (
        <img
          key={brick.id}
          src={brick.img}
          alt=""
          aria-hidden="true"
          className="hero-brick-explosion-item"
          style={
            {
              width: `${brick.size}px`,
              height: "auto",
              left: `${brick.left}%`,
              top: `${brick.top}%`,
              "--hero-delay": `${brick.delay}ms`,
              "--hero-rand-rot": `${brick.rotate}deg`,
              "--hero-move-x": `${brick.moveX}px`,
              "--hero-move-y": `${brick.moveY}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  );
};

const HeroSection = () => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentGreeting, setCurrentGreeting] = useState("");
  const { t, language } = useLanguage();
  const fullText = t("role");

  // Update greeting when component mounts or language changes
  useEffect(() => {
    const greeting = getCurrentGreeting();
    setCurrentGreeting(greeting.text[language]);
  }, [language]);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 20);
      return () => clearTimeout(timeout);
    } else {
      const blink = document.querySelector(".type-cursor");
      if (blink) {
        blink.classList.add("blink-after");
      }
    }
  }, [currentIndex, fullText]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  // Suppress noisy console errors originating from the Spotify embed while mounted
  useEffect(() => {
    const origConsoleError = console.error as (...args: unknown[]) => void;
    console.error = (...args: unknown[]) => {
      try {
        const msg = String(args[0] || "");
        if (
          msg.includes("Refused to display") ||
          msg.includes("Blocked a frame with origin")
        ) {
          return;
        }
      } catch (e) {
        // ignore
      }
      origConsoleError(...args);
    };
    return () => {
      console.error = origConsoleError as Console["error"];
    };
  }, []);

  const socials = [
    {
      href: "https://github.com/hugoviegas/",
      label: "GitHub",
      Icon: Github,
    },
    {
      href: "https://www.linkedin.com/in/hviegas/",
      label: "LinkedIn",
      Icon: Linkedin,
    },
    {
      href: "mailto:hugoviegas3.1@gmail.com",
      label: "Email",
      Icon: Mail,
    },
  ];

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-28 pb-16 md:pt-32 lg:py-24"
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 opacity-20" aria-hidden="true">
        <div className="subtle-pulse absolute left-8 top-20 h-28 w-28 rounded-full bg-primary blur-3xl md:left-20 md:h-40 md:w-40" />
        <div className="subtle-pulse absolute bottom-40 right-8 h-20 w-20 rounded-full bg-secondary blur-2xl md:right-32 md:h-28 md:w-28" />
        <div className="subtle-pulse absolute left-1/3 top-1/2 h-16 w-16 rounded-full bg-brand-accent blur-xl md:h-20 md:w-20" />
      </div>

      <div className="section-wrapper-wide relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content column */}
          <div className="fade-in space-y-8">
            <div className="space-y-4">
              <p className="font-mono text-base text-primary md:text-lg">
                {currentGreeting}
              </p>
              <h1 className="heading-hero">Hugo Viegas</h1>
              <div className="flex min-h-[3.5rem] items-center md:min-h-[4.5rem]">
                <h2 className="font-mono text-xl font-semibold text-muted-foreground sm:text-2xl md:text-3xl">
                  {displayText}
                  <span className="type-cursor ml-2 inline-block h-6 w-1 bg-primary align-middle md:h-8" />
                </h2>
              </div>
              <p className="body-text max-w-2xl">{t("description")}</p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <LegoButton onClick={() => scrollTo("projects")}>
                {t("viewProjects")}
              </LegoButton>
              <LegoButton
                onClick={() => scrollTo("contact")}
                brickColor="yellow"
              >
                {t("getInTouch")}
              </LegoButton>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap items-center gap-4">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="icon-button"
                >
                  <Icon className="h-6 w-6 text-primary" />
                </a>
              ))}

              {/* Resume dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    className="icon-button flex items-center gap-2 px-4"
                    aria-label={t("seeResume")}
                    title={t("seeResume")}
                  >
                    <FileText className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium text-primary sm:text-base">
                      {t("seeResume")}
                    </span>
                  </button>
                </DialogTrigger>
                <DialogContent className="flex h-[90vh] w-[95vw] max-w-[min(1400px,95vw)] flex-col gap-0 p-0">
                  <DialogHeader className="p-4 pb-0 md:p-6">
                    <DialogTitle className="flex flex-col items-start gap-3 pr-8 text-left sm:flex-row sm:items-center sm:justify-between">
                      <span>Hugo Viegas — CV 2025</span>
                      <Button asChild variant="outline" size="sm">
                        <a
                          href={RESUME_URL}
                          download="Hugo_Viegas_CV_2025.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          {t("downloadResume")}
                        </a>
                      </Button>
                    </DialogTitle>
                  </DialogHeader>

                  <div className="min-h-0 flex-1 p-4 pt-4 md:p-6">
                    <iframe
                      src={`${RESUME_URL}#toolbar=1&navpanes=0&scrollbar=1`}
                      className="h-full min-h-[60vh] w-full rounded-lg border border-border"
                      title="Hugo Viegas CV 2025"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Image column */}
          <div className="fade-in relative delay-300 lg:justify-self-end">
            <div className="relative mx-auto">
              <div className="hero-image-wrapper relative">
                {/* Brick explosion layer sits behind the image */}
                <div
                  className="hero-brick-explosion-layer pointer-events-none"
                  aria-hidden="true"
                >
                  <HeroBrickExplosion />
                </div>

                {/* Glass frame the image fills */}
                <div className="glass-strong relative mx-auto aspect-square w-11/12 max-w-[420px] overflow-hidden rounded-3xl transition-all duration-300 sm:w-80 md:w-96">
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"
                    aria-hidden="true"
                  />
                  <div className="relative z-10 h-full w-full">
                    <LazyImage
                      src={heroImage}
                      alt="Hugo Viegas - IT Support Specialist transitioning to Full-Stack Developer"
                      className="h-full w-full object-cover"
                      placeholder={t("loadingProfile")}
                    />
                  </div>
                </div>
              </div>

              {/* Compact Spotify embed under the profile image */}
              <div className="mt-6 flex justify-center">
                <div className="w-11/12 max-w-[396px] sm:w-80 md:w-96">
                  <iframe
                    data-testid="embed-iframe"
                    title="Spotify Playlist Compact"
                    className="w-full rounded-xl"
                    src="https://open.spotify.com/embed/playlist/1Xi9HL4NA9vFhDUY9wjJtB?utm_source=generator&theme=0"
                    height="152"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => scrollTo("about")}
            aria-label={t("scrollToAbout")}
            className="icon-button animate-bounce"
          >
            <ArrowDown className="h-6 w-6 text-primary" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
