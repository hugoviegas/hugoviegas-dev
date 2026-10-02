import { memo } from "react";
import { cn } from "@/lib/utils";
import { brickColorClass, type BrickColor } from "./brickColors";

// Isometric LEGO brick drawn as flat-shaded SVG.
// Geometry follows real LEGO proportions in units (u): stud pitch 8,
// brick height 9.6, plate height 3.2, stud diameter 4.8, stud height 1.7.
// Projection: screenX = (x - y)·cos30°, screenY = (x + y)/2 - z.
// Size the brick with a width class only; the viewBox keeps proportions.

export type BrickShape = "1x1" | "1x2" | "2x2" | "2x4" | "plate-2x4";

const SHAPES: Record<BrickShape, { nx: number; ny: number; h: number }> = {
  "1x1": { nx: 1, ny: 1, h: 9.6 },
  "1x2": { nx: 2, ny: 1, h: 9.6 },
  "2x2": { nx: 2, ny: 2, h: 9.6 },
  "2x4": { nx: 4, ny: 2, h: 9.6 },
  "plate-2x4": { nx: 4, ny: 2, h: 3.2 },
};

const COS30 = Math.cos(Math.PI / 6);
const STUD_R = 2.4;
const STUD_H = 1.7;
const RX = COS30 * STUD_R * Math.SQRT2;
const RY = (STUD_R * Math.SQRT2) / 2;

const r2 = (v: number) => Math.round(v * 100) / 100;
const project = (x: number, y: number, z: number): [number, number] => [
  r2((x - y) * COS30),
  r2((x + y) / 2 - z),
];
const points = (list: [number, number][]) => list.map((p) => p.join(",")).join(" ");

interface Geometry {
  viewBox: string;
  top: string;
  left: string;
  right: string;
  edge: string;
  outline: string;
  vertical: [number, number, number, number];
  studs: { cx: number; top: number; bottom: number }[];
}

const cache = new Map<BrickShape, Geometry>();

const geometry = (shape: BrickShape): Geometry => {
  const hit = cache.get(shape);
  if (hit) return hit;
  const { nx, ny, h } = SHAPES[shape];
  const w = nx * 8;
  const d = ny * 8;
  const top: [number, number][] = [project(0, 0, h), project(w, 0, h), project(w, d, h), project(0, d, h)];
  const left: [number, number][] = [project(0, d, 0), project(w, d, 0), project(w, d, h), project(0, d, h)];
  const right: [number, number][] = [project(w, 0, 0), project(w, d, 0), project(w, d, h), project(w, 0, h)];
  const all = [...top, ...left, ...right];
  const xs = all.map((p) => p[0]);
  const ys = all.map((p) => p[1]);
  const minX = Math.min(...xs) - 0.6;
  const maxX = Math.max(...xs) + 0.6;
  const minY = Math.min(...ys) - STUD_H - RY - 0.6;
  const maxY = Math.max(...ys) + 0.6;

  const studs: Geometry["studs"] = [];
  const cells: [number, number][] = [];
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) cells.push([(i + 0.5) * 8, (j + 0.5) * 8]);
  cells
    .sort((a, b) => a[0] + a[1] - (b[0] + b[1]))
    .forEach(([sx, sy]) => {
      const [cx, cyTop] = project(sx, sy, h + STUD_H);
      const [, cyBottom] = project(sx, sy, h);
      studs.push({ cx, top: cyTop, bottom: cyBottom });
    });

  const [fx, fy] = project(w, d, h);
  const [, fyb] = project(w, d, 0);
  const g: Geometry = {
    viewBox: `${r2(minX)} ${r2(minY)} ${r2(maxX - minX)} ${r2(maxY - minY)}`,
    top: points(top),
    left: points(left),
    right: points(right),
    edge: points([project(0, d, h), project(w, d, h), project(w, 0, h)]),
    outline: points([project(0, 0, h), project(w, 0, h), project(w, 0, 0), project(w, d, 0), project(0, d, 0), project(0, d, h)]),
    vertical: [fx, fy, fx, fyb],
    studs,
  };
  cache.set(shape, g);
  return g;
};

interface IsoBrickProps {
  shape?: BrickShape;
  color?: BrickColor;
  className?: string;
}

const IsoBrick = memo(({ shape = "2x4", color = "green", className }: IsoBrickProps) => {
  const g = geometry(shape);
  const rx = r2(RX);
  const ry = r2(RY);
  return (
    <svg
      viewBox={g.viewBox}
      aria-hidden="true"
      focusable="false"
      className={cn("block h-auto overflow-visible", brickColorClass[color], className)}
    >
      <polygon points={g.left} className="fill-[var(--bl)]" />
      <polygon points={g.right} className="fill-[var(--br)]" />
      <polygon points={g.top} className="fill-[var(--bt)]" />
      <polyline points={g.edge} fill="none" strokeWidth={0.45} strokeLinejoin="round" className="stroke-[color:var(--be)]" />
      <line
        x1={g.vertical[0]}
        y1={g.vertical[1]}
        x2={g.vertical[2]}
        y2={g.vertical[3]}
        strokeWidth={0.3}
        opacity={0.7}
        className="stroke-[color:var(--be)]"
      />
      {g.studs.map((s) => (
        <g key={`${s.cx}-${s.top}`}>
          <path
            d={`M${r2(s.cx - rx)} ${s.top}V${s.bottom}A${rx} ${ry} 0 0 0 ${r2(s.cx + rx)} ${s.bottom}V${s.top}Z`}
            className="fill-[var(--bl)]"
          />
          <path
            d={`M${s.cx} ${s.top}V${r2(s.bottom + ry)}A${rx} ${ry} 0 0 0 ${r2(s.cx + rx)} ${s.bottom}V${s.top}Z`}
            className="fill-[var(--br)]"
          />
          <ellipse cx={s.cx} cy={s.top} rx={rx} ry={ry} strokeWidth={0.3} className="fill-[var(--bs)] stroke-[color:var(--be)]" />
        </g>
      ))}
      <polygon points={g.outline} fill="none" strokeWidth={0.35} strokeLinejoin="round" className="stroke-[color:var(--bo)]" />
    </svg>
  );
});

IsoBrick.displayName = "IsoBrick";

export default IsoBrick;
