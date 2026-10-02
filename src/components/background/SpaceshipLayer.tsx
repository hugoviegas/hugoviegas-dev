import { lazy, Suspense } from "react";
import { useTheme } from "next-themes";
import { useSpaceship } from "@/hooks/useSpaceship";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

// The WebGL X-wing is a dark-theme visual that only mounts after the visitor
// switches it on. three.js stays out of the entry chunk until then.
const BackgroundXWing = lazy(() => import("./BackgroundXWing"));

const SpaceshipLayer = () => {
  const { enabled } = useSpaceship();
  const { resolvedTheme } = useTheme();
  const reduced = usePrefersReducedMotion();
  if (!enabled || reduced || resolvedTheme === "light") return null;
  return (
    <Suspense fallback={null}>
      <BackgroundXWing />
    </Suspense>
  );
};

export default SpaceshipLayer;
