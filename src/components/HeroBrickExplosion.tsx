import React from "react";

// Import LEGO brick images for explosion effect
import redFront from "@/assets/lego-bricks/red-front.png";
import yellowFront from "@/assets/lego-bricks/yellow-front.png";
import blueFront from "@/assets/lego-bricks/blue-front.png";
import whiteFront from "@/assets/lego-bricks/white-front.png";
import whiteTop from "@/assets/lego-bricks/white-top.png";
import whiteTopSingle from "@/assets/lego-bricks/white-top-single.png";
import redTop from "@/assets/lego-bricks/red-top.png";
import goldCoin2d from "@/assets/lego-bricks/gold-coin-2d.png";
import goldCoinFront from "@/assets/lego-bricks/gold-coin-front.png";
import goldCoinTop from "@/assets/lego-bricks/gold-coin-top.png";

const BRICK_IMAGES = [
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

const HeroBrickExplosion: React.FC = () => {
  // Create 24 bricks with randomized sizes/angles/positions spreading in all directions
  const count = 24;

  const bricks = Array.from({ length: count }).map((_, i) => {
    const img = BRICK_IMAGES[Math.floor(Math.random() * BRICK_IMAGES.length)];
    const size = 14 + Math.floor(Math.random() * 24); // 14-38px

    // Random starting position within the explosion area
    const left = Math.random() * 100; // percent
    const top = Math.random() * 100; // percent
    const rotate = -45 + Math.random() * 90; // degrees
    const delay = Math.random() * 250; // ms stagger

    // Movement vector for explosion (all directions instead of just upward)
    const moveX = Math.round(-150 + Math.random() * 300); // -150 to +150px
    const moveY = Math.round(-150 + Math.random() * 300); // -150 to +150px (all directions)

    return {
      id: i,
      img,
      size,
      left,
      top,
      rotate,
      delay,
      moveX,
      moveY,
    };
  });

  return (
    <>
      {bricks.map((brick) => (
        <img
          key={brick.id}
          src={brick.img}
          alt=""
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

export default HeroBrickExplosion;
