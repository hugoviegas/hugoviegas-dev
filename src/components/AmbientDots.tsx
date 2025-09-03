import React, { useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

import redFront from "@/assets/lego-bricks/red-front.png";
import redTop from "@/assets/lego-bricks/red-top.png";
import whiteFront from "@/assets/lego-bricks/white-front.png";
import whiteTop from "@/assets/lego-bricks/white-top.png";
import yellowFront from "@/assets/lego-bricks/yellow-front.png";

type Brick = {
  src: string;
  left: number;
  top: number;
  sizeVw: number;
  rot: number; // degrees
  delay: number;
  duration: number;
};

const IMAGES = [redFront, redTop, whiteFront, whiteTop, yellowFront];

const AmbientDots: React.FC<{
  count?: number;
  minSizeVw?: number;
  maxSizeVw?: number;
}> = ({ count = 60, minSizeVw = 2.5, maxSizeVw = 10 }) => {
  const isMobile = useIsMobile();

  const bricks: Brick[] = useMemo(() => {
    const mobileMultiplier = isMobile ? 1.6 : 1;
    const rotations = [0, 90, 180, 270];
    return Array.from({ length: count }).map(() => {
      const size =
        (minSizeVw + Math.random() * (maxSizeVw - minSizeVw)) *
        mobileMultiplier;
      // Randomize entrance type: either top-like fall or the existing fall-bounce
      const entranceType = Math.random() < 0.6 ? "top-fall" : "fall-bounce";
      // Random small variation in rotation and layering
      const rot = rotations[Math.floor(Math.random() * rotations.length)];
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 2.5; // stagger
      const duration = 0.8 + Math.random() * 1.6; // entrance duration

      return {
        src: IMAGES[Math.floor(Math.random() * IMAGES.length)],
        left,
        top,
        sizeVw: Math.round(size * 10) / 10,
        rot,
        delay,
        duration,
        // store chosen entrance type for rendering
        // reuse Brick type fields by overloading 'duration' and 'delay' for timing
      } as Brick;
    });
  }, [count, isMobile, minSizeVw, maxSizeVw]);

  return (
    <div className="ambient-container" aria-hidden="true">
      {bricks.map((b, i) => {
        // choose entrance class per brick for randomness while preserving movement
        const entranceClass =
          Math.random() < 0.6 ? "animate-top-fall" : "animate-fall-bounce";
        // additional random small horizontal drift after landing
        const driftDelay = +(b.delay + b.duration + Math.random() * 1).toFixed(
          2
        );

        return (
          <div
            key={i}
            className={`ambient-brick-wrap ${entranceClass}`}
            style={
              {
                left: `${b.left}%`,
                top: `${b.top}%`,
                width: `${b.sizeVw}vw`,
                // entrance timing
                animationDelay: `${b.delay}s`,
                animationDuration: `${b.duration}s`,
                // layering variation
                zIndex: Math.random() > 0.6 ? 1 : 0,
                boxSizing: "border-box",
              } as React.CSSProperties
            }
          >
            <img
              src={b.src}
              className="ambient-brick idle-sway"
              alt=""
              aria-hidden
              style={
                {
                  width: "100%",
                  height: "auto",
                  transform: `rotate(${b.rot}deg)`,
                  // start idle animation after the entrance completes
                  animationDelay: `${driftDelay}s`,
                } as React.CSSProperties
              }
            />
          </div>
        );
      })}
    </div>
  );
};

export default AmbientDots;
