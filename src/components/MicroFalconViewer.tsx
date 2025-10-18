import { Euler, Quaternion, Vector3 } from "three";
import AnimatedStarshipViewer from "./starships/AnimatedStarshipViewer";
import {
  AnimationConfig,
  easeOutCubic,
  easeOutExpo,
} from "./starships/animationUtils";
import microFalconModel from "@/assets/3d-model/Lego-glb-models/Micro Millennium Falcon.glb";

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const quadraticBezier = (
  out: Vector3,
  p0: Vector3,
  cp: Vector3,
  p1: Vector3,
  t: number
) => {
  const u = 1 - t;
  out.set(0, 0, 0);
  out.addScaledVector(p0, u * u);
  out.addScaledVector(cp, 2 * u * t);
  out.addScaledVector(p1, t * t);
  return out;
};

const createCinematicLoopAnimation = (): AnimationConfig => {
  const sweepStartPos = new Vector3(-6.6, 0.5, 6.6);
  const restPos = new Vector3(0, -0.05, 0);
  const frontAnchorPos = new Vector3(3.4, -1.15, -12.2);
  const exitTargetPos = new Vector3(-8.2, 1.1, 5.1);
  const returnControl = new Vector3(0.85, -0.2, -6.4);
  const exitControl = new Vector3(-3.4, 1.6, 1.5);

  const sweepStartQuat = new Quaternion().setFromEuler(
    new Euler(-0.16, Math.PI * 0.8, -0.18)
  );
  const backFacingQuat = new Quaternion().setFromEuler(
    new Euler(0, Math.PI, 0)
  );
  const frontIdleQuat = new Quaternion().setFromEuler(new Euler(0.08, 0.08, 0));
  const frontEntryQuat = new Quaternion().setFromEuler(
    new Euler(0.4, -0.95, 0.14)
  );
  const exitQuat = new Quaternion().setFromEuler(
    new Euler(-0.08, Math.PI * 0.65, 0.22)
  );

  const sweepDuration = 3.2;
  const transitDuration = 1.8;
  const returnDuration = 2.6;
  const holdDuration = 6.0;
  const exitDuration = 3.1;
  const totalDuration =
    sweepDuration +
    transitDuration +
    returnDuration +
    holdDuration +
    exitDuration;

  const tempPos = new Vector3();
  const tempQuat = new Quaternion();

  const startScale = 0.64;

  return {
    duration: totalDuration,
    autoLoop: true,
    setup: (group) => {
      group.position.copy(sweepStartPos);
      group.quaternion.copy(sweepStartQuat);
      group.scale.setScalar(startScale);
    },
    update: (group, progress) => {
      const time = progress * totalDuration;

      if (time <= sweepDuration) {
        const localT = Math.min(time / sweepDuration, 1);
        const eased = easeOutCubic(localT);
        tempPos.copy(sweepStartPos).lerp(restPos, eased);
        const arc = Math.sin(localT * Math.PI);
        tempPos.y += 0.6 * arc;
        tempPos.x -= 0.3 * (1 - Math.cos(localT * Math.PI * 0.55));
        group.position.copy(tempPos);

        tempQuat
          .copy(sweepStartQuat)
          .slerp(backFacingQuat, easeOutExpo(localT));
        group.quaternion.copy(tempQuat);

        const scaleVal = startScale + (1.02 - startScale) * easeOutExpo(localT);
        group.scale.setScalar(scaleVal);
        return;
      }

      if (time <= sweepDuration + transitDuration) {
        const localTime = time - sweepDuration;
        const localT = Math.min(localTime / transitDuration, 1);
        const eased = easeInOutCubic(localT);
        tempPos.copy(restPos).lerp(frontAnchorPos, eased);
        tempPos.y += 0.35 * Math.sin(localT * Math.PI);
        group.position.copy(tempPos);

        const rotationT = Math.min(1, Math.pow(localT, 0.35));
        tempQuat.copy(backFacingQuat).slerp(frontEntryQuat, rotationT);
        group.quaternion.copy(tempQuat);
        group.scale.setScalar(1.02);
        return;
      }

      if (time <= sweepDuration + transitDuration + returnDuration) {
        const localTime = time - sweepDuration - transitDuration;
        const localT = Math.min(localTime / returnDuration, 1);
        const eased = easeOutExpo(localT);
        quadraticBezier(tempPos, frontAnchorPos, returnControl, restPos, eased);
        tempPos.y += 0.08 * Math.sin(localT * Math.PI * 2);
        group.position.copy(tempPos);

        tempQuat.copy(frontEntryQuat).slerp(frontIdleQuat, eased);
        group.quaternion.copy(tempQuat);
        group.scale.setScalar(1);
        return;
      }

      if (
        time <=
        sweepDuration + transitDuration + returnDuration + holdDuration
      ) {
        const holdProgress = Math.min(
          (time - sweepDuration - transitDuration - returnDuration) /
            holdDuration,
          1
        );
        const hover = 0.05 * Math.sin(holdProgress * Math.PI * 2);
        tempPos.copy(restPos);
        tempPos.y += hover;
        group.position.copy(tempPos);
        group.quaternion.copy(frontIdleQuat);
        group.scale.setScalar(1);
        return;
      }

      const localTime =
        time - sweepDuration - transitDuration - returnDuration - holdDuration;
      const localT = Math.min(localTime / exitDuration, 1);
      const eased = easeInOutCubic(localT);
      quadraticBezier(tempPos, restPos, exitControl, exitTargetPos, eased);
      const lift = 0.4 * Math.sin(Math.min(localT * 1.2, 1) * Math.PI * 0.5);
      tempPos.y += lift;
      group.position.copy(tempPos);

      tempQuat.copy(frontIdleQuat).slerp(exitQuat, easeOutCubic(localT));
      group.quaternion.copy(tempQuat);

      const scaleVal = 1 - 0.4 * easeOutExpo(localT);
      group.scale.setScalar(scaleVal);
    },
    finalize: (group) => {
      group.position.copy(sweepStartPos);
      group.quaternion.copy(sweepStartQuat);
      group.scale.setScalar(startScale);
    },
  };
};

const FALCON_ANIMATIONS: AnimationConfig[] = [createCinematicLoopAnimation()];

const MicroFalconViewer = () => (
  <AnimatedStarshipViewer
    modelPath={microFalconModel}
    animationConfigs={FALCON_ANIMATIONS}
    desiredSize={3.0}
    containerHeight={360}
    eventNamespace="microfalcon"
    className="w-full h-[360px] rounded-3xl overflow-hidden"
    verticalOffset={-0.15}
    environmentPreset="city"
    enableShadows
  />
);

export default MicroFalconViewer;
