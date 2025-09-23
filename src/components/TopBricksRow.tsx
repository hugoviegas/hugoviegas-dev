import React, { useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

import redFront from "@/assets/lego-bricks/red-front.png";
import whiteFront from "@/assets/lego-bricks/white-front.png";
import yellowFront from "@/assets/lego-bricks/yellow-front.png";
import blueFront from "@/assets/lego-bricks/blue-front.png";

const FRONT_IMAGES = [redFront, whiteFront, yellowFront, blueFront];

const TopBricksRow: React.FC = () => {
  const isMobile = useIsMobile();

  // Choose a target approximate brick size (percent-based will be computed)
  // Reduce approx percent to increase number of bricks (higher density)
  const approxBrickPercent = isMobile ? 8 : 6; // smaller = more bricks

  // Compute how many bricks to evenly fill 100% width, then compute exact percent per brick
  const bricksNeeded = useMemo(() => {
    const count = Math.max(1, Math.ceil(100 / approxBrickPercent));
    return count;
  }, [approxBrickPercent]);

  const brickPercent = useMemo(() => {
    return +(100 / bricksNeeded).toFixed(6); // keep precision to avoid rounding gaps
  }, [bricksNeeded]);

  const bricks = useMemo(() => {
    return Array.from({ length: bricksNeeded }).map((_, i) => ({
      id: i,
      src: FRONT_IMAGES[i % FRONT_IMAGES.length],
      delay: i * 0.12,
    }));
  }, [bricksNeeded]);

  // Inline styles to force zero lateral spacing and exact widths
  const rowStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 0,
    padding: 0,
    margin: 0,
    width: "100%",
    boxSizing: "border-box",
    pointerEvents: "none",
  };

  // Compute padding-bottom in vw to provide vertical space for the falling animation.
  // Using brickPercent (which is percent of viewport width) as an approximation for brick height.
  // Add a safety multiplier so the image isn't clipped when bouncing.
  const paddingBottomVw = +(brickPercent * 1.05).toFixed(4); // small safety margin

  return (
    <div
      className="top-bricks-container"
      aria-hidden="true"
      style={{
        position: "absolute", // force absolute so it's anchored to parent, not viewport
        top: 0,
        left: 0,
        right: 0,
        padding: 0,
        margin: 0,
        paddingBottom: `${paddingBottomVw}vw`,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <div className="top-bricks-row" style={rowStyle}>
        {bricks.map((brick) => (
          <div
            key={brick.id}
            className="top-brick-wrap animate-top-fall"
            style={
              {
                flex: `0 0 ${brickPercent}%`,
                width: `${brickPercent}%`,
                padding: 0,
                margin: 0,
                animationDelay: `${brick.delay}s`,
                boxSizing: "border-box",
                display: "block",
                pointerEvents: "none",
              } as React.CSSProperties
            }
          >
            <img
              src={brick.src}
              className="top-brick"
              alt=""
              aria-hidden
              style={
                {
                  display: "block", // removes inline-gap
                  width: "100%",
                  height: "auto",
                  transform: "rotate(180deg)",
                  margin: 0,
                  padding: 0,
                } as React.CSSProperties
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBricksRow;
