import { memo } from "react";
import { cn } from "@/lib/utils";
import { brickColorClass, type BrickColor } from "./brickColors";

// Front-view brick for small UI details (dividers, timeline nodes, card
// badges, loaders). Studs are 0.6p wide and 0.22p tall; the body is 1.2p
// (brick) or 0.4p (plate). Face bands are inset hard shadows, never gradients.

export type BrickPitch = 12 | 14 | 16 | 18 | 20 | 24;

const pitchClass: Record<BrickPitch, string> = {
  12: "[--p:12px]",
  14: "[--p:14px]",
  16: "[--p:16px]",
  18: "[--p:18px]",
  20: "[--p:20px]",
  24: "[--p:24px]",
};

interface FlatBrickProps {
  studs?: number;
  pitch?: BrickPitch;
  plate?: boolean;
  color?: BrickColor;
  className?: string;
}

const FlatBrick = memo(({ studs = 2, pitch = 14, plate = false, color = "green", className }: FlatBrickProps) => (
  <span
    aria-hidden="true"
    className={cn("inline-flex flex-col align-bottom", pitchClass[pitch], brickColorClass[color], className)}
  >
    <span className="flex h-[calc(var(--p)*0.22)]">
      {Array.from({ length: studs }, (_, i) => (
        <span key={i} className="flex w-[var(--p)] justify-center">
          <span className="h-full w-[60%] rounded-t-[2px] bg-[var(--bs)] shadow-[inset_calc(var(--p)*-0.16)_0_0_var(--br)]" />
        </span>
      ))}
    </span>
    <span
      className={cn(
        "block rounded-[2px] bg-[var(--bl)]",
        plate
          ? "h-[calc(var(--p)*0.4)] shadow-[inset_0_1px_0_var(--be),inset_0_calc(var(--p)*-0.08)_0_var(--br),0_0_0_0.5px_var(--bo)]"
          : "h-[calc(var(--p)*1.2)] shadow-[inset_0_1px_0_var(--be),inset_0_calc(var(--p)*-0.18)_0_var(--br),0_0_0_0.5px_var(--bo)]",
      )}
    />
  </span>
));

FlatBrick.displayName = "FlatBrick";

export default FlatBrick;
