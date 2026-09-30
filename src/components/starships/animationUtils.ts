import type { Group } from "three";
import { Quaternion, Vector3 } from "three";

export type AnimationConfig = {
  duration: number;
  setup: (group: Group) => void;
  update: (group: Group, progress: number) => void;
  finalize?: (group: Group) => void;
  autoLoop?: boolean;
  loopDelay?: number;
  /** Progress (0-1) of the static pose shown when reduced motion is requested. */
  staticProgress?: number;
};

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeOutExpo = (t: number) =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

export const ORIGIN = new Vector3(0, 0, 0);
export const IDENTITY_QUATERNION = new Quaternion();

export const resetGroupTransform = (group: Group) => {
  group.position.set(0, 0, 0);
  group.quaternion.identity();
  group.scale.setScalar(1);
};
