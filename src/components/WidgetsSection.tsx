import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import WorldClocks from "@/components/WorldClocks";
import FastTransparentCube from "@/components/FastTransparentCube";

const MicroFalconViewer = lazy(() => import("@/components/MicroFalconViewer"));
const HeroLightsaber = lazy(() => import("@/components/HeroLightsaber"));

const ViewerSkeleton = ({
  minHeightClass,
  label,
}: {
  minHeightClass: string;
  label: string;
}) => (
  <div
    className={`w-full rounded-2xl border border-border bg-muted/30 flex items-center justify-center animate-pulse ${minHeightClass}`}
  >
    <span className="caption-text">{label}</span>
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
    <section id="fun-stuff" className="section-y w-full">
      <div className="section-wrapper">
        <div className="section-header fade-in">
          <h2 className="heading-section mb-4">{t("funStuffTitle")}</h2>
          <p className="body-text mx-auto max-w-3xl">
            {t("funStuffDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: World Clocks */}
          <div className="glass-card p-6">
            <WorldClocks />
          </div>

          {/* Card 2: Rubik's Cube */}
          <div className="glass-card p-6 flex justify-center">
            <FastTransparentCube width={240} height={240} enableExpand />
          </div>

          {/* Card 3: Millennium Falcon */}
          <div ref={falconContainerRef} className="glass-card p-6">
            <Suspense
              fallback={
                <ViewerSkeleton
                  minHeightClass="min-h-[360px]"
                  label={t("loading3d")}
                />
              }
            >
              {showFalconViewer ? (
                <MicroFalconViewer />
              ) : (
                <ViewerSkeleton
                  minHeightClass="min-h-[360px]"
                  label={t("loading3d")}
                />
              )}
            </Suspense>
          </div>

          {/* Card 4: Lightsaber */}
          <div
            ref={lightsaberContainerRef}
            className="glass-card p-6 min-h-[200px]"
          >
            <Suspense
              fallback={
                <ViewerSkeleton
                  minHeightClass="min-h-[200px]"
                  label={t("loading3d")}
                />
              }
            >
              {showLightsaber ? (
                <HeroLightsaber />
              ) : (
                <ViewerSkeleton
                  minHeightClass="min-h-[200px]"
                  label={t("loading3d")}
                />
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WidgetsSection;
