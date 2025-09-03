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
}> = ({ count = 36, minSizeVw = 3.5, maxSizeVw = 12 }) => {
  const isMobile = useIsMobile();

  const bricks: Brick[] = useMemo(() => {
    const mobileMultiplier = isMobile ? 1.6 : 1;
    const rotations = [0, 90, 180, 270];
    return Array.from({ length: count }).map(() => {
      const size =
        (minSizeVw + Math.random() * (maxSizeVw - minSizeVw)) *
        mobileMultiplier;
      return {
        src: IMAGES[Math.floor(Math.random() * IMAGES.length)],
        left: Math.random() * 100,
        top: Math.random() * 100,
        sizeVw: Math.round(size * 10) / 10,
        rot: rotations[Math.floor(Math.random() * rotations.length)],
        delay: Math.random() * 3, // stagger
        duration: 0.8 + Math.random() * 1.2, // fall duration
      } as Brick;
    });
  }, [count, isMobile, minSizeVw, maxSizeVw]);

  return (
    <div className="ambient-container" aria-hidden="true">
      {bricks.map((b, i) => (
        <div
          key={i}
          className="ambient-brick-wrap animate-fall-bounce"
          style={
            {
              left: `${b.left}%`,
              top: `${b.top}%`,
              width: `${b.sizeVw}vw`,
              // falling animation timing
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
              // slight z layering variation
              zIndex: Math.random() > 0.6 ? 1 : 0,
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
                // start idle animation after the fall completes
                animationDelay: `${b.delay + b.duration}s`,
              } as React.CSSProperties
            }
          />
        </div>
      ))}
    </div>
  );
};

export default AmbientDots;
