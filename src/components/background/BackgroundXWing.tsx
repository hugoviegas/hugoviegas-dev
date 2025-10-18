import React, {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  Box3,
  Color,
  Group,
  MathUtils,
  PerspectiveCamera,
  Quaternion,
  Vector3,
  WebGLRenderer,
} from "three";
import xwingModelUrl from "@/assets/3d-model/Lego-glb-models/X-wing.glb?url";

const XWING_ASSET_PATH = xwingModelUrl;

if (typeof useGLTF.preload === "function") {
  useGLTF.preload(XWING_ASSET_PATH);
}

const MODEL_FORWARD = new Vector3(-1, 0, 0);
const TMP_VEC_A = new Vector3();
const TMP_VEC_B = new Vector3();
const TMP_QUAT_A = new Quaternion();
const TMP_QUAT_B = new Quaternion();
const TMP_QUAT_RESULT = new Quaternion();

const randomInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const easeInOutQuad = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

type FlightDirection = "left-to-right" | "right-to-left";

export type BackgroundXWingProps = {
  direction?: FlightDirection;
  baseAltitude?: number;
  zDepth?: number;
  speed?: number;
  speedVariance?: number;
  bobAmplitude?: number;
  bobFrequency?: number;
  pauseWhenHidden?: boolean;
};

const applyClearColorFromElement = (
  gl: WebGLRenderer,
  el: HTMLElement | null,
  fallback: Color
) => {
  try {
    const style = el ? window.getComputedStyle(el) : null;
    const bg = style?.backgroundColor || style?.background || "transparent";
    const rgbaMatch = bg.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/i
    );
    if (rgbaMatch) {
      const color = new Color(
        Number(rgbaMatch[1]) / 255,
        Number(rgbaMatch[2]) / 255,
        Number(rgbaMatch[3]) / 255
      );
      gl.setClearColor(color, Number(rgbaMatch[4] ?? 0));
      return;
    }
    const hexMatch = bg.match(/#([0-9a-f]{3,8})/i);
    if (hexMatch) {
      gl.setClearColor(new Color(hexMatch[0]), 0);
      return;
    }
  } catch (error) {
    // ignore parse issues and fall back below
  }
  gl.setClearColor(fallback, 0);
};

const useViewportSizeAtDepth = (depth: number) => {
  const { camera, size } = useThree();
  return useMemo(() => {
    const perspective = camera as PerspectiveCamera;
    const distance = Math.abs(depth - perspective.position.z) || 0.01;
    const verticalFov = MathUtils.degToRad(perspective.fov);
    const height = 2 * Math.tan(verticalFov / 2) * distance;
    const width = height * (size.width / size.height || 1);
    return { width, height };
  }, [camera, size.height, size.width, depth]);
};

type FlightConfig = Required<
  Pick<
    BackgroundXWingProps,
    | "baseAltitude"
    | "zDepth"
    | "speed"
    | "speedVariance"
    | "bobAmplitude"
    | "bobFrequency"
    | "pauseWhenHidden"
  >
> &
  Pick<BackgroundXWingProps, "direction">;
type FlightRuntime = {
  start: Vector3;
  delta: Vector3;
  position: Vector3;
  direction: Vector3;
  distance: number;
  progress: number;
  speedScalar: number;
  phase: number;
  bank: number;
  spinAngle: number;
  boost: number;
  spin: {
    active: boolean;
    used: boolean;
    trigger: number;
    duration: number;
    elapsed: number;
    rotations: number;
  };
};
const XWingFlight: React.FC<FlightConfig> = ({
  direction,
  baseAltitude,
  zDepth,
  speed,
  speedVariance,
  bobAmplitude,
  bobFrequency,
  pauseWhenHidden,
}) => {
  const { scene } = useGLTF(XWING_ASSET_PATH);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);
  const viewport = useViewportSizeAtDepth(zDepth);
  const preferredDirection = useMemo(() => {
    if (direction === "left-to-right") return 1;
    if (direction === "right-to-left") return -1;
    return null;
  }, [direction]);
  const wrapperRef = useRef<Group | null>(null);
  const flightRef = useRef<FlightRuntime>({
    start: new Vector3(),
    delta: new Vector3(),
    position: new Vector3(),
    direction: new Vector3(1, 0, 0),
    distance: 1,
    progress: 0,
    speedScalar: Math.max(0.65, speed),
    phase: Math.random() * Math.PI * 2,
    bank: 0,
    spinAngle: 0,
    boost: 1,
    spin: {
      active: false,
      used: false,
      trigger: 0.5,
      duration: 1.4,
      elapsed: 0,
      rotations: 2,
    },
  });
  const margin = 2.1;

  const resetFlight = useCallback(() => {
    const horizontalReach = (viewport.width || 16) / 2 + margin;
    const verticalReach = Math.max((viewport.height || 9) / 2 - 0.4, 1.5);
    const overshoot = randomInRange(1.2, 2.6);
    const randomSign = Math.random() > 0.5 ? 1 : -1;
    const dirSign =
      preferredDirection !== null && Math.random() > 0.4
        ? preferredDirection
        : randomSign;

    const startX = -dirSign * (horizontalReach + overshoot);
    const endX = dirSign * (horizontalReach + overshoot);

    const startYOffset = randomInRange(-0.45, 0.45) * verticalReach;
    const diagonalSwing = randomInRange(-0.9, 0.9) * verticalReach;
    const startY = MathUtils.clamp(
      baseAltitude + startYOffset,
      -verticalReach,
      verticalReach
    );
    const endY = MathUtils.clamp(
      startY + diagonalSwing,
      -verticalReach,
      verticalReach
    );

    const baseZ = zDepth + randomInRange(-1.2, 0.8);
    const endZ = baseZ + randomInRange(-0.6, 0.6);

    const flight = flightRef.current;
    flight.start.set(startX, startY, baseZ);
    flight.delta.set(endX - startX, endY - startY, endZ - baseZ);
    flight.distance = Math.max(flight.delta.length(), 0.5);
    flight.direction.copy(flight.delta).normalize();
    flight.position.copy(flight.start);
    flight.progress = 0;
    flight.speedScalar = Math.max(
      0.6,
      speed + randomInRange(-speedVariance, speedVariance)
    );
    flight.phase = Math.random() * Math.PI * 2;
    flight.bank = 0;
    flight.spinAngle = 0;
    flight.boost = 1 + (Math.random() < 0.5 ? randomInRange(0.08, 0.22) : 0);
    flight.spin = {
      active: false,
      used: false,
      trigger: randomInRange(0.35, 0.6),
      duration: randomInRange(1.2, 1.8),
      elapsed: 0,
      rotations: 2 + (Math.random() < 0.45 ? 0.5 : 0),
    };

    if (wrapperRef.current) {
      wrapperRef.current.position.copy(flight.start);
      wrapperRef.current.quaternion.identity();
    }
  }, [
    baseAltitude,
    margin,
    preferredDirection,
    speed,
    speedVariance,
    viewport.height,
    viewport.width,
    zDepth,
  ]);

  useLayoutEffect(() => {
    const bounds = new Box3().setFromObject(clonedScene);
    const size = TMP_VEC_A;
    bounds.getSize(size);
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    const scale = 1.05 / maxAxis;
    clonedScene.scale.setScalar(scale);
    const center = TMP_VEC_B.set(0, 0, 0);
    bounds.getCenter(center);
    clonedScene.position.sub(center.multiplyScalar(scale));
  }, [clonedScene]);

  useEffect(() => {
    resetFlight();
  }, [resetFlight]);

  useFrame((state, delta) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    if (pauseWhenHidden && typeof document !== "undefined" && document.hidden) {
      return;
    }

    const flight = flightRef.current;

    if (flight.distance <= 0.01) {
      resetFlight();
      return;
    }

    if (flight.boost > 1) {
      flight.boost = MathUtils.damp(flight.boost, 1, 1.5, delta);
    }

    const speedFactor = (flight.spin.active ? 1.35 : 1) * flight.boost;
    flight.progress +=
      delta * ((flight.speedScalar * speedFactor) / flight.distance);

    if (flight.progress >= 1.05) {
      resetFlight();
      return;
    }

    flight.position
      .copy(flight.start)
      .addScaledVector(flight.delta, flight.progress);

    const bobOffset =
      Math.sin(state.clock.elapsedTime * bobFrequency + flight.phase) *
      bobAmplitude;

    wrapper.position.set(
      flight.position.x,
      flight.position.y + bobOffset,
      flight.position.z
    );

    if (!flight.spin.used && flight.progress >= flight.spin.trigger) {
      flight.spin.active = true;
      flight.spin.used = true;
      flight.spin.elapsed = 0;
    }

    if (flight.spin.active) {
      flight.spin.elapsed += delta;
      const t = Math.min(flight.spin.elapsed / flight.spin.duration, 1);
      const eased = easeInOutQuad(MathUtils.clamp(t, 0, 1));
      flight.spinAngle = MathUtils.lerp(
        0,
        flight.spin.rotations * Math.PI * 2,
        eased
      );
      if (t >= 1) {
        flight.spin.active = false;
      }
    } else {
      flight.spinAngle = MathUtils.damp(flight.spinAngle, 0, 6, delta);
    }

    const wobble =
      Math.sin(state.clock.elapsedTime * 0.8 + flight.phase) * 0.05;
    const targetBank =
      -flight.direction.x * 0.35 + flight.direction.y * 0.2 + wobble;
    flight.bank = MathUtils.damp(flight.bank, targetBank, 4.5, delta);

    TMP_QUAT_A.setFromUnitVectors(MODEL_FORWARD, flight.direction);
    TMP_QUAT_B.setFromAxisAngle(
      flight.direction,
      flight.bank + flight.spinAngle
    );
    TMP_QUAT_RESULT.copy(TMP_QUAT_A).multiply(TMP_QUAT_B);

    wrapper.quaternion.slerp(TMP_QUAT_RESULT, 1 - Math.exp(-delta * 10));
  });

  return (
    <group ref={wrapperRef}>
      <primitive object={clonedScene} />
    </group>
  );
};

const BackgroundCanvas: React.FC<BackgroundXWingProps> = ({
  direction,
  baseAltitude = 0.35,
  zDepth = -6,
  speed = 2.05,
  speedVariance = 0.85,
  bobAmplitude = 0.28,
  bobFrequency = 1.2,
  pauseWhenHidden = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const fallbackColor = useMemo(() => new Color("#000000"), []);

  useEffect(() => {
    if (!rendererRef.current) return;
    const sync = () =>
      applyClearColorFromElement(
        rendererRef.current as WebGLRenderer,
        containerRef.current,
        fallbackColor
      );

    sync();

    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    const scheme = window.matchMedia?.("(prefers-color-scheme: dark)");
    const schemeHandler = () => sync();
    scheme?.addEventListener?.("change", schemeHandler);

    return () => {
      observer.disconnect();
      scheme?.removeEventListener?.("change", schemeHandler);
    };
  }, [fallbackColor]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[4]"
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 1.5, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.6]}
        onCreated={({ gl, events }) => {
          rendererRef.current = gl as WebGLRenderer;
          events.disconnect?.();
          applyClearColorFromElement(
            rendererRef.current,
            containerRef.current,
            fallbackColor
          );
        }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[6, 8, 4]} intensity={0.85} />
        <Suspense fallback={null}>
          <XWingFlight
            direction={direction}
            baseAltitude={baseAltitude}
            zDepth={zDepth}
            speed={speed}
            speedVariance={speedVariance}
            bobAmplitude={bobAmplitude}
            bobFrequency={bobFrequency}
            pauseWhenHidden={pauseWhenHidden}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

const BackgroundXWing: React.FC<BackgroundXWingProps> = (props) => (
  <React.Suspense fallback={null}>
    <BackgroundCanvas {...props} />
  </React.Suspense>
);

export default BackgroundXWing;
