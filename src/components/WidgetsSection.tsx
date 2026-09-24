import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import WorldClocks from "@/components/WorldClocks";
import FastTransparentCube from "@/components/FastTransparentCube";

const MicroFalconViewer = lazy(() => import("@/components/MicroFalconViewer"));
const HeroLightsaber = lazy(() => import("@/components/HeroLightsaber"));

const ViewerSkeleton = ({ height }: { height: number }) => (
  <div
    className="w-full rounded-3xl border border-muted/20 bg-muted/10 flex items-center justify-center animate-pulse"
    style={{ minHeight: height }}
  >
    <span className="text-sm text-muted-foreground/70">
      Loading 3D experience...
    </span>
  </div>
);

const WidgetsSection = () => {
  const { t } = useLanguage();

  // Intersection observer for MicroFalconViewer
  const falconContainerRef = useRef<HTMLDivElement | null>(null);
  const [showFalconViewer, setShowFalconViewer] = useState(false);

  // Intersection observer for HeroLightsaber
  const lightsaberContainerRef = useRef<HTMLDivElement | null>(null);
  const [showLightsaber, setShowLightsaber] = useState(false);

  useEffect(() => {
    if (showFalconViewer) return;
    const node = falconContainerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowFalconViewer(true);
            obs.disconnect();
          }
        });
      },
      {
        rootMargin: "200px 0px",
        threshold: 0.2,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [showFalconViewer]);

  useEffect(() => {
    if (showLightsaber) return;
    const node = lightsaberContainerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowLightsaber(true);
            obs.disconnect();
          }
        });
      },
      {
        rootMargin: "200px 0px",
        threshold: 0.2,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [showLightsaber]);

  return (
    <section className="py-20 w-full">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 fade-in">
          <h2 className="heading-section mb-6">{t("funStuffTitle")}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("funStuffDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Card 1: World Clocks */}
          <div className="glass-strong rounded-2xl p-6">
            <WorldClocks />
          </div>

          {/* Card 2: Rubik's Cube */}
          <div className="glass-strong rounded-2xl p-6 flex justify-center">
            <FastTransparentCube width={240} height={240} enableExpand />
          </div>

          {/* Card 3: Millennium Falcon */}
          <div
            ref={falconContainerRef}
            className="glass-strong rounded-2xl p-6"
          >
            <Suspense fallback={<ViewerSkeleton height={360} />}>
              {showFalconViewer ? (
                <MicroFalconViewer />
              ) : (
                <ViewerSkeleton height={360} />
              )}
            </Suspense>
          </div>

          {/* Card 4: Lightsaber */}
          <div
            ref={lightsaberContainerRef}
            className="glass-strong rounded-2xl p-6"
            style={{ minHeight: 200 }}
          >
            <Suspense fallback={<ViewerSkeleton height={200} />}>
              {showLightsaber ? (
                <HeroLightsaber />
              ) : (
                <ViewerSkeleton height={200} />
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WidgetsSection;
