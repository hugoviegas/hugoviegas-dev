import { Suspense, lazy, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import FlatBrick from "@/components/brand/FlatBrick";
import { sectionContainer } from "@/components/sections/Section";
import { useLanguage } from "@/hooks/useLanguage";

// Fun Stuff: collapsed by default and kept off the recruiter path. Nothing
// below loads until the visitor presses "Show experiments".
const WorldClocks = lazy(() => import("@/components/WorldClocks"));
const FastTransparentCube = lazy(() => import("@/components/FastTransparentCube"));
const MicroFalconViewer = lazy(() => import("@/components/MicroFalconViewer"));
const HeroLightsaber = lazy(() => import("@/components/HeroLightsaber"));

const TileSkeleton = ({ label, tall = false }: { label: string; tall?: boolean }) => (
  <div
    role="status"
    className={`flex w-full flex-col items-center justify-center gap-3 rounded-xl bg-surface-2 ${tall ? "min-h-[360px]" : "min-h-[220px]"}`}
  >
    <span className="flex flex-col-reverse items-center" aria-hidden="true">
      <FlatBrick studs={2} pitch={16} color="green" className="animate-brick-stack" />
      <FlatBrick studs={2} pitch={16} color="lightGray" className="animate-brick-stack [animation-delay:200ms]" />
      <FlatBrick studs={2} pitch={16} color="white" className="animate-brick-stack [animation-delay:400ms]" />
    </span>
    <span className="text-sm text-ink-3">{label}</span>
  </div>
);

const tileClass = "rounded-lg border border-border bg-card p-5 shadow-e2";

const WidgetsSection = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <section id="fun-stuff" aria-labelledby="fun-stuff-title" className="relative z-10 pt-[72px] lg:pt-24">
      <div className={sectionContainer}>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <h2 id="fun-stuff-title" className="text-2xl font-extrabold tracking-[-0.02em] text-foreground sm:text-[28px]">
              {t("funStuffTitle")}
            </h2>
            <p className="mt-1.5 text-ink-2">{t("funStuffDescription")}</p>
          </div>
          <Button
            type="button"
            variant={open ? "neutral" : "primary"}
            size="lg"
            aria-expanded={open}
            aria-controls="fun-stuff-panel"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <Minus aria-hidden="true" /> : <Plus aria-hidden="true" />}
            {open ? t("funStuffHide") : t("funStuffShow")}
          </Button>
        </div>

        {!open && (
          <p className="mt-6 rounded-lg border border-dashed border-line-strong px-5 py-4 text-[15px] text-ink-3">
            {t("funStuffCollapsed")}
          </p>
        )}

        <div id="fun-stuff-panel" hidden={!open}>
          {open && (
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className={tileClass}>
                <Suspense fallback={<TileSkeleton label={t("funStuffLoading")} />}>
                  <WorldClocks />
                </Suspense>
              </div>
              <div className={`${tileClass} flex justify-center`}>
                <Suspense fallback={<TileSkeleton label={t("funStuffLoading")} />}>
                  <FastTransparentCube width={240} height={240} enableExpand />
                </Suspense>
              </div>
              <div className={tileClass}>
                <Suspense fallback={<TileSkeleton label={t("funStuffLoading")} tall />}>
                  <MicroFalconViewer />
                </Suspense>
              </div>
              <div className={tileClass}>
                <Suspense fallback={<TileSkeleton label={t("funStuffLoading")} />}>
                  <HeroLightsaber />
                </Suspense>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WidgetsSection;
