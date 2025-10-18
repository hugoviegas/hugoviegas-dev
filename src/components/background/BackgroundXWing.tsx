import React, {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  Box3,
  Color,
  Group,
  MathUtils,
  Matrix4,
  PerspectiveCamera,
  Quaternion,
  Vector3,
  WebGLRenderer,
  AdditiveBlending,
} from "three";
import type { BufferAttribute, Points } from "three";
import xwingModelUrl from "@/assets/3d-model/Lego-glb-models/X-wing.glb?url";

const XWING_ASSET_PATH = xwingModelUrl;

if (typeof useGLTF.preload === "function") {
  useGLTF.preload(XWING_ASSET_PATH);
}

const WORLD_UP = new Vector3(0, 1, 0);
const TMP_VEC_A = new Vector3();
const TMP_VEC_B = new Vector3();
const TMP_VEC_C = new Vector3();
const TMP_QUAT_A = new Quaternion();
const TMP_QUAT_B = new Quaternion();
const TMP_QUAT_RESULT = new Quaternion();
const TMP_MATRIX = new Matrix4();

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

type BackgroundColorInfo = {
  color: Color;
  alpha: number;
  luminance: number;
};

const getBackgroundColorInfo = (
  el: HTMLElement | null,
  fallback: Color
): BackgroundColorInfo => {
  const baseColor = fallback.clone();
  let alpha = 0;
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
      alpha = Number(rgbaMatch[4] ?? 0);
      const luminance = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
      return { color, alpha, luminance };
    }
    const hexMatch = bg.match(/#([0-9a-f]{3,8})/i);
    if (hexMatch) {
      const color = new Color(hexMatch[0]);
      const luminance = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
      return { color, alpha, luminance };
    }
  } catch (error) {
    // ignore parse issues and fall back below
  }
  return {
    color: baseColor,
    alpha,
    luminance:
      0.2126 * baseColor.r + 0.7152 * baseColor.g + 0.0722 * baseColor.b,
  };
};

const applyClearColorFromElement = (
  gl: WebGLRenderer,
  el: HTMLElement | null,
  fallback: Color
): BackgroundColorInfo => {
  const info = getBackgroundColorInfo(el, fallback);
  gl.setClearColor(info.color, info.alpha);
  return info;
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
  throttle: number;
  throttleTarget: number;
  isRightToLeft: boolean;
  spin: {
    active: boolean;
    used: boolean;
    trigger: number;
    duration: number;
    elapsed: number;
    rotations: number;
    prepDuration: number;
    cooldownDuration: number;
    burstPower: number;
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
  const modelRef = useRef<Group | null>(null);
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
    throttle: 1,
    throttleTarget: 1,
    isRightToLeft: false,
    spin: {
      active: false,
      used: false,
      trigger: 0.5,
      duration: 1.4,
      elapsed: 0,
      rotations: 2,
      prepDuration: 0.25,
      cooldownDuration: 0.6,
      burstPower: 2,
    },
  });
  const margin = 2.1;

  const resetFlight = useCallback(() => {
    const horizontalReach = (viewport.width || 16) / 2 + margin;
    const verticalReach = Math.max((viewport.height || 9) / 2 - 0.4, 1.5);
    const centralReach = Math.max(verticalReach * 0.52, 1);
    const overshoot = randomInRange(1.2, 2.6);
    const randomSign = Math.random() > 0.5 ? 1 : -1;
    const dirSign =
      preferredDirection !== null && Math.random() > 0.4
        ? preferredDirection
        : randomSign;

    const startX = -dirSign * (horizontalReach + overshoot);
    const endX = dirSign * (horizontalReach + overshoot);

    const startYOffset = randomInRange(-0.9, 0.9) * centralReach;
    const diagonalSwing = randomInRange(-0.75, 0.75) * centralReach;
    const startY = MathUtils.clamp(
      baseAltitude + startYOffset,
      -centralReach,
      centralReach
    );
    const endY = MathUtils.clamp(
      startY + diagonalSwing,
      -centralReach,
      centralReach
    );

    const baseZ = zDepth + randomInRange(-1.2, 0.8);
    const endZ = baseZ + randomInRange(-0.6, 0.6);

    const flight = flightRef.current;
    flight.start.set(startX, startY, baseZ);
    flight.delta.set(endX - startX, endY - startY, endZ - baseZ);
    flight.distance = Math.max(flight.delta.length(), 0.5);
    flight.direction.copy(flight.delta).normalize();
    flight.isRightToLeft = flight.direction.x < 0;
    flight.position.copy(flight.start);
    flight.progress = 0;
    flight.speedScalar = Math.max(
      0.6,
      speed + randomInRange(-speedVariance, speedVariance)
    );
    flight.phase = Math.random() * Math.PI * 2;
    flight.bank = 0;
    flight.spinAngle = 0;
    flight.throttle = 1;
    flight.throttleTarget = 1;
    flight.spin = {
      active: false,
      used: false,
      trigger: randomInRange(0.35, 0.6),
      duration: randomInRange(1.2, 1.8),
      elapsed: 0,
      rotations: 2 + (Math.random() < 0.45 ? 0.5 : 0),
      prepDuration: randomInRange(0.22, 0.32),
      cooldownDuration: randomInRange(0.55, 0.75),
      burstPower: randomInRange(1.9, 2.4),
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
    const modelGroup = modelRef.current;
    if (!modelGroup) return;

    const bounds = new Box3().setFromObject(clonedScene);
    const size = TMP_VEC_A;
    bounds.getSize(size);
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    const center = TMP_VEC_B;
    bounds.getCenter(center);
    clonedScene.position.sub(center);
    modelGroup.scale.setScalar(1.4 / maxAxis);
    modelGroup.rotation.set(0, 0, 0);
    clonedScene.updateMatrixWorld(true);
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

    if (!flight.spin.used && flight.progress >= flight.spin.trigger) {
      flight.spin.active = true;
      flight.spin.used = true;
      flight.spin.elapsed = 0;
    }

    if (flight.spin.active) {
      flight.spin.elapsed += delta;
    }

    let targetThrottle = 1;

    if (flight.spin.active) {
      const { prepDuration, duration, cooldownDuration, burstPower } =
        flight.spin;
      const prepEnd = prepDuration;
      const burstEnd = prepEnd + duration;
      const totalEnd = burstEnd + cooldownDuration;

      if (flight.spin.elapsed < prepEnd) {
        const prepT = easeInOutQuad(
          MathUtils.clamp(
            flight.spin.elapsed / Math.max(prepDuration, 0.001),
            0,
            1
          )
        );
        targetThrottle = MathUtils.lerp(1, 0.06, prepT);
        flight.spinAngle = MathUtils.damp(flight.spinAngle, 0, 8, delta);
      } else if (flight.spin.elapsed < burstEnd) {
        const spinT = easeInOutQuad(
          MathUtils.clamp(
            (flight.spin.elapsed - prepEnd) / Math.max(duration, 0.001),
            0,
            1
          )
        );
        targetThrottle = MathUtils.lerp(1.35, burstPower, spinT);
        flight.spinAngle = MathUtils.lerp(
          0,
          flight.spin.rotations * Math.PI * 2,
          spinT
        );
      } else if (flight.spin.elapsed < totalEnd) {
        const coolT = easeInOutQuad(
          MathUtils.clamp(
            (flight.spin.elapsed - burstEnd) /
              Math.max(cooldownDuration, 0.001),
            0,
            1
          )
        );
        targetThrottle = MathUtils.lerp(burstPower, 1, coolT);
        flight.spinAngle = MathUtils.damp(flight.spinAngle, 0, 10, delta);
      } else {
        flight.spin.active = false;
        flight.spinAngle = MathUtils.damp(flight.spinAngle, 0, 10, delta);
      }
    } else {
      targetThrottle = 1;
      flight.spinAngle = MathUtils.damp(flight.spinAngle, 0, 6, delta);
    }

    flight.throttleTarget = targetThrottle;
    const throttleLerp = targetThrottle > flight.throttle ? 8 : 5;
    flight.throttle = MathUtils.damp(
      flight.throttle,
      targetThrottle,
      throttleLerp,
      delta
    );

    flight.progress +=
      delta * ((flight.speedScalar * flight.throttle) / flight.distance);

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

    const wobble =
      Math.sin(state.clock.elapsedTime * 0.8 + flight.phase) * 0.05;
    const verticality = Math.abs(flight.direction.dot(WORLD_UP));
    const bankAttenuation = MathUtils.lerp(1, 0.35, verticality);
    const targetBank =
      (-flight.direction.x * 0.35 + flight.direction.y * 0.2 + wobble) *
      bankAttenuation;
    flight.bank = MathUtils.damp(flight.bank, targetBank, 4.5, delta);

    const forward = TMP_VEC_A.copy(flight.direction).normalize();
    const upVec = TMP_VEC_C.copy(WORLD_UP);
    if (Math.abs(forward.dot(upVec)) > 0.96) {
      upVec.set(0, 0, 1);
    }
    const right = TMP_VEC_B.copy(upVec).cross(forward);
    if (right.lengthSq() < 1e-4) {
      right.set(0, 1, 0);
    } else {
      right.normalize();
    }
    upVec.copy(forward).cross(right).normalize();

    TMP_MATRIX.makeBasis(forward, upVec, right);
    TMP_QUAT_A.setFromRotationMatrix(TMP_MATRIX);
    TMP_QUAT_B.setFromAxisAngle(forward, flight.bank + flight.spinAngle);
    TMP_QUAT_RESULT.copy(TMP_QUAT_A).multiply(TMP_QUAT_B);

    wrapper.quaternion.slerp(TMP_QUAT_RESULT, 1 - Math.exp(-delta * 10));

    if (modelRef.current) {
      modelRef.current.rotation.y = flight.isRightToLeft ? 0 : Math.PI;
    }
  });

  return (
    <group ref={wrapperRef}>
      <group ref={modelRef}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
};

type StarFieldProps = {
  show: boolean;
  depth: number;
  count?: number;
};

const StarField: React.FC<StarFieldProps> = ({ show, depth, count = 220 }) => {
  const pointsRef = useRef<Points | null>(null);
  const viewport = useViewportSizeAtDepth(depth);
  const metaRef = useRef<{
    colors: Float32Array;
    base: Float32Array;
    phases: Float32Array;
    speeds: Float32Array;
    amplitudes: Float32Array;
  } | null>(null);

  const { positions, colors } = useMemo(() => {
    const spreadX = (viewport.width || 18) * 1.55;
    const spreadY = (viewport.height || 10) * 1.45;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const base = new Float32Array(count);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    const amplitudes = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const idx = i * 3;
      positions[idx] = (Math.random() - 0.5) * spreadX;
      positions[idx + 1] = (Math.random() - 0.5) * spreadY;
      positions[idx + 2] = depth + randomInRange(-6, 4);

      base[i] = randomInRange(0.35, 0.85);
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = randomInRange(0.45, 1.4);
      amplitudes[i] = randomInRange(0.18, 0.45);

      const initial = base[i];
      colors[idx] = initial;
      colors[idx + 1] = initial;
      colors[idx + 2] = initial;
    }

    metaRef.current = { colors, base, phases, speeds, amplitudes };
    return { positions, colors };
  }, [count, depth, viewport.height, viewport.width]);

  useFrame(({ clock }) => {
    if (!show) return;
    const points = pointsRef.current;
    const meta = metaRef.current;
    if (!points || !meta) return;
    const { colors, base, phases, speeds, amplitudes } = meta;
    const time = clock.elapsedTime;

    for (let i = 0; i < count; i += 1) {
      const twinkle =
        base[i] +
        Math.sin(time * speeds[i] + phases[i]) * amplitudes[i];
      const intensity = MathUtils.clamp(twinkle, 0.05, 1.0);
      const idx = i * 3;
      colors[idx] = intensity;
      colors[idx + 1] = intensity;
      colors[idx + 2] = intensity;
    }

    const colorAttr = points.geometry.getAttribute("color") as
      | BufferAttribute
      | undefined;
    if (colorAttr) {
      colorAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef} visible={show} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        sizeAttenuation
        transparent
        depthWrite={false}
        vertexColors
        blending={AdditiveBlending}
      />
    </points>
  );
};

type MiniPlanetsProps = {
  show: boolean;
  depth: number;
  count?: number;
};

type PlanetUserData = {
  rotationSpeed: number;
  bobAmplitude: number;
  bobFrequency: number;
  phase: number;
  baseY: number;
};

const MiniPlanets: React.FC<MiniPlanetsProps> = ({
  show,
  depth,
  count = 5,
}) => {
  const groupRef = useRef<Group | null>(null);
  const viewport = useViewportSizeAtDepth(depth);
  const planets = useMemo(() => {
    const spreadX = (viewport.width || 18) * 1.25;
    const spreadY = (viewport.height || 10) * 1.15;

    return Array.from({ length: count }, () => {
      const x = (Math.random() - 0.5) * spreadX;
      const y = (Math.random() - 0.5) * spreadY;
      const z = depth + randomInRange(-3.5, 2.5);
      const scale = randomInRange(0.09, 0.18);
      const hue = randomInRange(0.55, 0.72);
      const saturation = randomInRange(0.35, 0.58);
      const lightness = randomInRange(0.32, 0.52);
      const color = new Color().setHSL(hue, saturation, lightness);
      const emissive = color.clone().multiplyScalar(0.35);
      return {
        position: [x, y, z] as [number, number, number],
        scale,
        color: `#${color.getHexString()}`,
        emissive: `#${emissive.getHexString()}`,
        rotationSpeed: randomInRange(0.12, 0.28),
        bobAmplitude: randomInRange(0.05, 0.11),
        bobFrequency: randomInRange(0.2, 0.45),
        phase: Math.random() * Math.PI * 2,
      };
    });
  }, [count, depth, viewport.height, viewport.width]);

  useFrame(({ clock }) => {
    if (!show) return;
    const group = groupRef.current;
    if (!group) return;
    const t = clock.elapsedTime;
    for (const child of group.children) {
      const data = child.userData as PlanetUserData | undefined;
      if (!data) continue;
      child.rotation.y = t * data.rotationSpeed;
      child.position.y =
        data.baseY +
        Math.sin(t * data.bobFrequency + data.phase) * data.bobAmplitude;
    }
  });

  return (
    <group ref={groupRef} visible={show} frustumCulled={false}>
      {planets.map((planet, index) => (
        <mesh
          key={index}
          position={planet.position}
          scale={planet.scale}
          userData={{
            rotationSpeed: planet.rotationSpeed,
            bobAmplitude: planet.bobAmplitude,
            bobFrequency: planet.bobFrequency,
            phase: planet.phase,
            baseY: planet.position[1],
          }}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color={planet.color}
            emissive={planet.emissive}
            emissiveIntensity={0.8}
            roughness={0.55}
            metalness={0.15}
          />
        </mesh>
      ))}
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
  const [showStars, setShowStars] = useState(true);

  useEffect(() => {
    const sync = () => {
      const gl = rendererRef.current;
      if (!gl) return;
      const info = applyClearColorFromElement(
        gl,
        containerRef.current,
        fallbackColor
      );
      setShowStars(info.luminance < 0.32);
    };

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
          const info = applyClearColorFromElement(
            rendererRef.current,
            containerRef.current,
            fallbackColor
          );
          setShowStars(info.luminance < 0.32);
        }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[6, 8, 4]} intensity={0.85} />
        <Suspense fallback={null}>
          <StarField show={showStars} depth={zDepth - 4} />
          <MiniPlanets show={showStars} depth={zDepth - 5} />
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
