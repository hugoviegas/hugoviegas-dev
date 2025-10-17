import { useState, useEffect, useCallback } from "react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { getCurrentGreeting } from "@/lib/time-utils";
import heroImage from "@/assets/hugo-hero.jpg";
import HeroLightsaber from "./HeroLightsaber";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentGreeting, setCurrentGreeting] = useState("");
  const { t, language } = useLanguage();
  const navigate = useNavigate();
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

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const goToProposal = useCallback(() => {
    navigate("/proposta-etal");
  }, [navigate]);

  // Resume URL from Vercel Storage
  const resumeUrl =
    "https://sb7cb98htp9acpqo.public.blob.vercel-storage.com/Files%20to%20Download/Hugo%20Viegas%20-%20Software%20Engineer%20CV.pdf";

  // Hero Brick Explosion component
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

  const HeroBrickExplosion = () => {
    // Reduce the number of bricks for both mobile and desktop
    const count = 10; // Adjusted from 20 to 10
    return (
      <>
        {Array.from({ length: count }).map((_, i) => {
          const img =
            HERO_BRICK_IMAGES[
              Math.floor(Math.random() * HERO_BRICK_IMAGES.length)
            ];
          const size = 12 + Math.floor(Math.random() * 20); // Adjusted size range
          const left = Math.random() * 100; // percent
          const top = Math.random() * 100; // percent
          const rotate = -30 + Math.random() * 60; // degrees
          const delay = Math.random() * 300; // ms stagger
          const moveX = Math.round(-60 + Math.random() * 120); // Adjusted movement range
          const moveY = Math.round(-80 + Math.random() * 40); // Adjusted movement range

          return (
            <img
              key={i}
              src={img}
              alt=""
              className="hero-brick-explosion-item"
              style={{
                width: `${size}px`,
                height: "auto",
                left: `${left}%`,
                top: `${top}%`,
                // initial rotation and per-item CSS vars used by hover animation
                ...({
                  ["--hero-delay"]: `${delay}ms`,
                  ["--hero-rand-rot"]: `${rotate}deg`,
                  ["--hero-move-x"]: `${moveX}px`,
                  ["--hero-move-y"]: `${moveY}px`,
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
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24 md:pt-24 lg:pt-0"
      style={{ minWidth: "480px" }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20" aria-hidden="true">
        <div className="absolute top-20 left-20 w-40 h-40 bg-primary rounded-full blur-3xl subtle-pulse"></div>
        <div className="absolute bottom-40 right-32 w-28 h-28 bg-secondary rounded-full blur-2xl subtle-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-accent rounded-full blur-xl subtle-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10 wide-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Column */}
          <div className="space-y-8 fade-in">
            <div className="space-y-4">
              <div className="text-primary font-mono text-lg">
                {currentGreeting}
              </div>
              <h1 className="heading-hero leading-tight mb-2">Hugo Viegas</h1>
              <div className="h-24 flex items-center">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-muted-foreground font-mono">
                  {displayText}
                  <span className="type-cursor inline-block w-1 h-8 bg-primary ml-2"></span>
                </h2>
              </div>
              <p className="text-xl text-muted-foreground max-w-[min(960px,92vw)] leading-relaxed mt-4">
                {t("description")}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <LegoButton onClick={scrollToProjects}>
                {t("viewProjects")}
              </LegoButton>
              <LegoButton onClick={scrollToContact} brickColor="yellow">
                {t("getInTouch")}
              </LegoButton>
            </div>

            {/* Social Links */}
            <div className="flex space-x-6">
              <a
                href="https://github.com/hugoviegas/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 glass rounded-full hover:scale-110 hover:neon-glow transition-all duration-300"
              >
                <Github className="w-6 h-6 text-primary" />
              </a>
              <a
                href="https://www.linkedin.com/in/hviegas/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 glass rounded-full hover:scale-110 hover:neon-glow transition-all duration-300"
              >
                <Linkedin className="w-6 h-6 text-primary" />
              </a>
              <a
                href="mailto:hugoviegas3.1@gmail.com"
                className="p-3 glass rounded-full hover:scale-110 hover:neon-glow transition-all duration-300"
              >
                <Mail className="w-6 h-6 text-primary" />
              </a>

              {/* Resume Dialog Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    className="flex items-center gap-2 px-4 py-3 glass rounded-full hover:scale-110 hover:neon-glow transition-all duration-300"
                    aria-label={t("seeResume")}
                    title={t("seeResume")}
                  >
                    <FileText className="w-6 h-6 text-primary" />
                    <span className="text-primary font-medium">
                      {t("seeResume")}
                    </span>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-[min(1400px,92vw)] w-full h-[90vh] p-0">
                  <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="flex items-center justify-between">
                      <span>Hugo Viegas - CV 2025</span>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="ml-4"
                      >
                        <a
                          href={resumeUrl}
                          download="Hugo_Viegas_CV_2025.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          {t("downloadResume")}
                        </a>
                      </Button>
                    </DialogTitle>
                  </DialogHeader>

                  {/* PDF Viewer */}
                  <div className="flex-1 p-6 pt-0">
                    <iframe
                      src={`${resumeUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                      className="w-full h-full rounded-lg border"
                      title="Hugo Viegas CV 2025"
                      style={{ minHeight: "600px" }}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative lg:justify-self-end fade-in delay-300">
            <div className="relative mx-auto">
              {/* Hero image wrapper with brick explosion effect */}
              <div className="hero-image-wrapper relative">
                {/* Brick explosion layer sits behind the image */}
                <div className="hero-brick-explosion-layer pointer-events-none">
                  <HeroBrickExplosion />
                </div>

                {/* Glassmorphism Frame - single rounded square that the image fills */}
                <div className="glass-strong rounded-3xl relative overflow-hidden lg:flex-shrink-0 aspect-square w-11/12 max-w-[420px] sm:w-80 md:w-96 lg:w-96 mx-auto transition-all duration-300">
                  {/* subtle gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 pointer-events-none"></div>

                  {/* image fills the frame (no smaller inner square) */}
                  <div className="relative z-10 w-full h-full">
                    <LazyImage
                      src={heroImage}
                      alt="Hugo Viegas - IT Support Specialist transitioning to Full-Stack Developer"
                      className="object-cover w-full h-full shadow-2xl"
                      placeholder="Loading profile..."
                    />
                  </div>
                </div>
              </div>

              {/* Interactive Lightsaber under profile image (bigger, no box) */}
              <div className="mt-6 flex justify-center">
                <div className="w-full lg:max-w-[680px] h-[200px] rounded-none overflow-visible">
                  <HeroLightsaber />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section footer: scroll indicator placed here to avoid overlapping mobile content */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={scrollToAbout}
            aria-label="Scroll to about section"
            className="animate-bounce p-2 rounded-full glass hover:scale-110 transition-transform"
          >
            <ArrowDown className="w-6 h-6 text-primary" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
