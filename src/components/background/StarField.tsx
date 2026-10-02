import { memo } from "react";

// Dark-theme star field: three depth tiers (a few bright, a medium layer, a
// fine dim layer) and a small twinkling subset. No planets, no colour.
// Drawn as one SVG with percentage coordinates so it needs no inline styles.

interface Star {
  x: string;
  y: string;
  r: number;
  o: number;
  twinkle: 0 | 1 | 2 | 3;
}

const TWINKLE_DELAY = ["", "[animation-delay:1s]", "[animation-delay:2s]", "[animation-delay:3s]"];

const buildStars = (): Star[] => {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const tiers: [number, number, number][] = [
    [10, 1.3, 0.95],
    [40, 0.8, 0.7],
    [130, 0.5, 0.45],
  ];
  const stars: Star[] = [];
  tiers.forEach(([count, r, o], tier) => {
    for (let i = 0; i < count; i += 1) {
      const twinkles = tier < 2 && i % 6 === 0;
      stars.push({
        x: `${(rnd() * 100).toFixed(2)}%`,
        y: `${(rnd() * 100).toFixed(2)}%`,
        r,
        o,
        twinkle: twinkles ? (((i / 6) % 3) + 1) as 1 | 2 | 3 : 0,
      });
    }
  });
  return stars;
};

const STARS = buildStars();

const StarField = memo(() => (
  <svg aria-hidden="true" focusable="false" className="pointer-events-none fixed inset-0 z-0 hidden h-full w-full dark:block">
    {STARS.map((s, i) => (
      <circle
        key={i}
        cx={s.x}
        cy={s.y}
        r={s.r}
        fill="#ffffff"
        opacity={s.o}
        className={s.twinkle ? `animate-twinkle ${TWINKLE_DELAY[s.twinkle]}` : undefined}
      />
    ))}
  </svg>
));

StarField.displayName = "StarField";

export default StarField;
