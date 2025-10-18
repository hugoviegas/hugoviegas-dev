import { Euler, Quaternion, Vector3 } from "three";
import AnimatedStarshipViewer from "./starships/AnimatedStarshipViewer";
import {
  AnimationConfig,
  IDENTITY_QUATERNION,
  ORIGIN,
  easeOutCubic,
  easeOutExpo,
} from "./starships/animationUtils";
import microFalconModel from "@/assets/3d-model/Lego-glb-models/Micro Millennium Falcon.glb";

const createFrontApproachAnimation = (): AnimationConfig => {
  const startPos = new Vector3(3.4, -1.2, -12.5);
  const endPos = ORIGIN.clone();
  const startQuat = new Quaternion().setFromEuler(new Euler(0.48, -0.9, 0.18));
  const endQuat = IDENTITY_QUATERNION.clone();
  const tempPos = new Vector3();
  const tempQuat = new Quaternion();
  const startScale = 0.55;
  return {
    duration: 2.8,
    setup: (group) => {
      group.position.copy(startPos);
      group.quaternion.copy(startQuat);
      group.scale.setScalar(startScale);
    },
    update: (group, progress) => {
      const easedPos = easeOutCubic(progress);
      tempPos.copy(startPos).lerp(endPos, easedPos);
      group.position.copy(tempPos);
      tempQuat.copy(startQuat).slerp(endQuat, easedPos);
      group.quaternion.copy(tempQuat);
      const easedScale = easeOutExpo(progress);
      const scaleVal = startScale + (1 - startScale) * easedScale;
      group.scale.setScalar(scaleVal);
    },
    finalize: (group) => {
      group.position.copy(endPos);
      group.quaternion.copy(endQuat);
      group.scale.setScalar(1);
    },
  };
};

const createBehindLeftSweepAnimation = (): AnimationConfig => {
  const startPos = new Vector3(-6.8, 0.45, 7.4);
  const endPos = ORIGIN.clone();
  const startQuat = new Quaternion().setFromEuler(
    new Euler(-0.2, Math.PI * 0.78, -0.22),
  );
  const endQuat = IDENTITY_QUATERNION.clone();
  const tempPos = new Vector3();
  const tempQuat = new Quaternion();
  const startScale = 0.6;
  return {
    duration: 3.1,
    setup: (group) => {
      group.position.copy(startPos);
      group.quaternion.copy(startQuat);
      group.scale.setScalar(startScale);
    },
    update: (group, progress) => {
      const eased = easeOutCubic(progress);
      tempPos.copy(startPos).lerp(endPos, eased);
      const arc = Math.sin(progress * Math.PI);
      tempPos.y += 0.65 * arc;
      tempPos.x -= 0.4 * (1 - Math.cos(progress * Math.PI * 0.7));
      group.position.copy(tempPos);

      tempQuat.copy(startQuat).slerp(endQuat, easeOutExpo(progress));
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

const createRightToLeftReturnAnimation = (): AnimationConfig => {
  const startPos = new Vector3(4.6, 0.25, 1.3);
  const midPos = new Vector3(-4.4, 0.55, -0.7);
  const endPos = ORIGIN.clone();
  const startQuat = new Quaternion().setFromEuler(new Euler(0.12, -0.35, 0.26));
  const midQuat = new Quaternion().setFromEuler(new Euler(0.18, -1.32, -0.28));
  const endQuat = IDENTITY_QUATERNION.clone();
  const tempPos = new Vector3();
  const tempQuat = new Quaternion();
  const startScale = 0.88;
  return {
    duration: 3.4,
    setup: (group) => {
      group.position.copy(startPos);
      group.quaternion.copy(startQuat);
      group.scale.setScalar(startScale);
    },
    update: (group, progress) => {
      if (progress < 0.55) {
        const localT = easeOutCubic(Math.min(progress / 0.55, 1));
        tempPos.copy(startPos).lerp(midPos, localT);
        tempQuat.copy(startQuat).slerp(midQuat, localT);
      } else {
        const localT = easeOutExpo(Math.min((progress - 0.55) / 0.45, 1));
        tempPos.copy(midPos).lerp(endPos, localT);
        tempQuat.copy(midQuat).slerp(endQuat, localT);
      }
      group.position.copy(tempPos);
      group.quaternion.copy(tempQuat);

      const pulse = startScale + (1 - startScale) * Math.min(progress * 1.1, 1);
      const bob = 0.015 * Math.sin(progress * Math.PI * 3);
      group.scale.setScalar(pulse + bob);
    },
    finalize: (group) => {
      group.position.copy(endPos);
      group.quaternion.copy(endQuat);
      group.scale.setScalar(1);
    },
  };
};

const FALCON_ANIMATIONS: AnimationConfig[] = [
  createFrontApproachAnimation(),
  createBehindLeftSweepAnimation(),
  createRightToLeftReturnAnimation(),
];

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
