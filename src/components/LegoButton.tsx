import React from "react";
import { Button } from "@/components/ui/button";
import { ButtonProps } from "@/components/ui/button";

// Import LEGO brick images for explosion effect and main background
import redFront from "@/assets/lego-bricks/red-front.png";
import yellowFront from "@/assets/lego-bricks/yellow-front.png";
import blueFront from "@/assets/lego-bricks/blue-front.png";
import whiteFront from "@/assets/lego-bricks/white-front.png";
import goldCoin2d from "@/assets/lego-bricks/gold-coin-2d.png";

const BRICK_IMAGES = [redFront, yellowFront, blueFront, whiteFront, goldCoin2d];

interface LegoButtonProps extends ButtonProps {
  children: React.ReactNode;
  brickColor?: "blue" | "yellow";
}

const LegoButton: React.FC<LegoButtonProps> = ({
  children,
  className = "",
  brickColor = "blue",
  ...props
}) => {
  // Generate explosion effect bricks
  const explosionBricks = Array.from({ length: 12 }).map((_, i) => {
    const img = BRICK_IMAGES[Math.floor(Math.random() * BRICK_IMAGES.length)];
    const moveX = -60 + Math.random() * 120; // -60 to +60px
    const moveY = -80 + Math.random() * 60; // -80 to -20px (prefer upward)
    const rotate = -45 + Math.random() * 90; // -45 to +45 degrees
    const delay = Math.random() * 150; // 0-150ms stagger

    return {
      id: i,
      img,
      moveX,
      moveY,
      rotate,
      delay,
    };
  });

  // Select the brick image based on color
  const brickImage = brickColor === "yellow" ? yellowFront : blueFront;
  // Inline CSS custom properties to override background from index.css
  const cssVars = {
    "--lego-bg": `url(${brickImage})`,
    "--lego-bg-size": "100% 100%",
    "--lego-bg-repeat": "no-repeat",
    "--lego-bg-position": "center",
  } as React.CSSProperties;

  return (
    <div className="btn-lego-wrapper">
      <Button className={`btn-lego ${className}`} style={cssVars} {...props}>
        {children}
      </Button>

      {/* Explosion effect */}
      <div className="btn-lego-explosion">
        {explosionBricks.map((brick) => (
          <img
            key={brick.id}
            src={brick.img}
            alt=""
            className="btn-lego-explosion-item"
            style={
              {
                left: `${-8 + Math.random() * 16}px`, // small random initial offset
                top: `${-8 + Math.random() * 16}px`,
                "--btn-move-x": `${brick.moveX}px`,
                "--btn-move-y": `${brick.moveY}px`,
                "--btn-rot": `${brick.rotate}deg`,
                "--btn-delay": `${brick.delay}ms`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
};

export default LegoButton;
