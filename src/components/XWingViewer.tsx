import { Euler, Quaternion, Vector3 } from "three";
import AnimatedStarshipViewer from "./starships/AnimatedStarshipViewer";
import {
  AnimationConfig,
  IDENTITY_QUATERNION,
  ORIGIN,
  easeOutCubic,
  easeOutExpo,
} from "./starships/animationUtils";
import xWingModel from "@/assets/3d-model/Lego-glb-models/X-wing.glb";

const createAtmosphericEntry = (): AnimationConfig => {
  const startPos = new Vector3(-5.5, 2.6, -9.2);
  const endPos = ORIGIN.clone();
  const startQuat = new Quaternion().setFromEuler(new Euler(0.22, 1.2, -0.4));
  const endQuat = IDENTITY_QUATERNION.clone();
  const tempPos = new Vector3();
  const tempQuat = new Quaternion();
  const startScale = 0.72;
  return {
    duration: 3,
    setup: (group) => {
      group.position.copy(startPos);
      group.quaternion.copy(startQuat);
      group.scale.setScalar(startScale);
    },
    update: (group, progress) => {
      const eased = easeOutExpo(progress);
      tempPos.copy(startPos).lerp(endPos, eased);
      tempPos.z += 0.5 * Math.sin(progress * Math.PI * 0.9);
      tempPos.y += 0.35 * Math.sin(progress * Math.PI * 0.6);
      group.position.copy(tempPos);

      tempQuat.copy(startQuat).slerp(endQuat, easeOutCubic(progress));
      group.quaternion.copy(tempQuat);

      const scaleVal = startScale + (1 - startScale) * eased;
      group.scale.setScalar(scaleVal);
    },
    finalize: (group) => {
      group.position.copy(endPos);
      group.quaternion.copy(endQuat);
      group.scale.setScalar(1);
    },
  };
};

const createBarrelRollStrafe = (): AnimationConfig => {
  const startPos = new Vector3(6.2, 0.45, 2.4);
  const midPos = new Vector3(-3.1, -0.4, -1.6);
  const endPos = ORIGIN.clone();
  const startQuat = new Quaternion().setFromEuler(new Euler(0.08, -0.3, -0.12));
  const rollQuat = new Quaternion().setFromEuler(
    new Euler(0.1, Math.PI, Math.PI * 1.2)
  );
  const endQuat = IDENTITY_QUATERNION.clone();
  const tempPos = new Vector3();
  const tempQuat = new Quaternion();
  const startScale = 0.82;
  return {
    duration: 3.3,
    setup: (group) => {
      group.position.copy(startPos);
      group.quaternion.copy(startQuat);
      group.scale.setScalar(startScale);
    },
    update: (group, progress) => {
      if (progress < 0.45) {
        const t = easeOutCubic(progress / 0.45);
        tempPos.copy(startPos).lerp(midPos, t);
        tempPos.y += 0.25 * Math.sin(t * Math.PI);
        tempQuat.copy(startQuat).slerp(rollQuat, t);
      } else {
        const t = easeOutExpo((progress - 0.45) / 0.55);
        tempPos.copy(midPos).lerp(endPos, t);
        tempQuat.copy(rollQuat).slerp(endQuat, t);
      }
      group.position.copy(tempPos);
      group.quaternion.copy(tempQuat);

      const pulse =
        startScale + (1 - startScale) * Math.min(progress * 1.05, 1);
      const shimmy = 0.02 * Math.sin(progress * Math.PI * 4);
      group.scale.setScalar(pulse + shimmy);
    },
    finalize: (group) => {
      group.position.copy(endPos);
      group.quaternion.copy(endQuat);
      group.scale.setScalar(1);
    },
  };
};

const createVerticalLoopReturn = (): AnimationConfig => {
  const startPos = new Vector3(0.4, -3.2, 8.4);
  const peakPos = new Vector3(0.1, 3.1, -1.8);
  const endPos = ORIGIN.clone();
  const startQuat = new Quaternion().setFromEuler(new Euler(-0.32, 0.08, 0.05));
  const peakQuat = new Quaternion().setFromEuler(new Euler(0.4, 0.58, 0.0));
  const endQuat = IDENTITY_QUATERNION.clone();
  const tempPos = new Vector3();
  const tempQuat = new Quaternion();
  const startScale = 0.68;
  return {
    duration: 3.6,
    setup: (group) => {
      group.position.copy(startPos);
      group.quaternion.copy(startQuat);
      group.scale.setScalar(startScale);
    },
    update: (group, progress) => {
      if (progress < 0.55) {
        const t = easeOutExpo(progress / 0.55);
        tempPos.copy(startPos).lerp(peakPos, t);
        tempQuat.copy(startQuat).slerp(peakQuat, t);
      } else {
        const t = easeOutCubic((progress - 0.55) / 0.45);
        tempPos.copy(peakPos).lerp(endPos, t);
        tempQuat.copy(peakQuat).slerp(endQuat, t);
      }
      tempPos.x += 0.3 * Math.sin(progress * Math.PI * 1.8);
      group.position.copy(tempPos);
      group.quaternion.copy(tempQuat);

      const scaleVal = startScale + (1 - startScale) * easeOutExpo(progress);
      group.scale.setScalar(scaleVal);
    },
    finalize: (group) => {
      group.position.copy(endPos);
      group.quaternion.copy(endQuat);
      group.scale.setScalar(1);
    },
  };
};

const XWING_ANIMATIONS: AnimationConfig[] = [
  createAtmosphericEntry(),
  createBarrelRollStrafe(),
  createVerticalLoopReturn(),
];

const XWingViewer = () => (
  <AnimatedStarshipViewer
    modelPath={xWingModel}
    animationConfigs={XWING_ANIMATIONS}
    desiredSize={2.6}
    containerHeight={340}
    eventNamespace="xwing"
    className="w-full h-[340px] rounded-3xl overflow-hidden"
    verticalOffset={-0.12}
    environmentPreset="city"
    enableShadows
  />
);

export default XWingViewer;
