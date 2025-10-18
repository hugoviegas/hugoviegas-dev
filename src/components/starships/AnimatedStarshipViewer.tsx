import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Box3, Color, Vector3, WebGLRenderer } from "three";
import type { Group } from "three";
import type { AnimationConfig } from "./animationUtils";

const DEFAULT_CAMERA_POSITION: [number, number, number] = [0, 1.4, 4.2];

const AnimatedModel = ({
  modelPath,
  animationConfig,
  trigger,
  desiredSize,
  verticalOffset,
}: {
  modelPath: string;
  animationConfig: AnimationConfig;
  trigger: number;
  desiredSize: number;
  verticalOffset: number;
}) => {
  const { scene } = useGLTF(modelPath);
  const outerGroupRef = useRef<Group | null>(null);
  const rotationGroupRef = useRef<Group | null>(null);
  const pivotRef = useRef<Group | null>(null);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);
  const progressRef = useRef(0);
  const stateRef = useRef<"idle" | "running" | "waiting">("idle");
  const loopTimerRef = useRef(0);

  useLayoutEffect(() => {
    if (!outerGroupRef.current) return;
    outerGroupRef.current.position.set(0, 0, 0);
    outerGroupRef.current.quaternion.identity();
    outerGroupRef.current.scale.setScalar(1);
  }, []);

  useLayoutEffect(() => {
    if (!pivotRef.current || !rotationGroupRef.current) return;

    const bounds = new Box3().setFromObject(pivotRef.current);
    const center = bounds.getCenter(new Vector3());
    const size = bounds.getSize(new Vector3());

    pivotRef.current.position.set(-center.x, -center.y, -center.z);

    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    const scale = desiredSize / maxAxis;
    rotationGroupRef.current.scale.setScalar(scale);
    rotationGroupRef.current.position.set(0, verticalOffset, 0);
  }, [clonedScene, desiredSize, verticalOffset]);

  useEffect(() => {
    if (!outerGroupRef.current) return;
    progressRef.current = 0;
    stateRef.current = "running";
    loopTimerRef.current = 0;
    animationConfig.setup(outerGroupRef.current);
  }, [animationConfig, trigger]);

  useGLTF.preload(modelPath);

  useFrame((_, delta) => {
    if (!outerGroupRef.current) return;

    if (stateRef.current === "running") {
      const duration = Math.max(animationConfig.duration, 0.1);
      progressRef.current = Math.min(
        progressRef.current + delta / duration,
        1,
      );

      animationConfig.update(outerGroupRef.current, progressRef.current);

      if (progressRef.current >= 1) {
        animationConfig.finalize?.(outerGroupRef.current);
        if (animationConfig.autoLoop) {
          stateRef.current = "waiting";
          loopTimerRef.current = 0;
        } else {
          stateRef.current = "idle";
        }
      }
      return;
    }

    if (
      stateRef.current === "waiting" &&
      animationConfig.autoLoop &&
      outerGroupRef.current
    ) {
      loopTimerRef.current += delta;
      const delay = Math.max(animationConfig.loopDelay ?? 0, 0);
      if (loopTimerRef.current >= delay) {
        progressRef.current = 0;
        loopTimerRef.current = 0;
        stateRef.current = "running";
        animationConfig.setup(outerGroupRef.current);
      }
    }
  });

  return (
    <group ref={outerGroupRef}>
      <group ref={rotationGroupRef}>
        <group ref={pivotRef}>
          <primitive object={clonedScene} dispose={null} />
        </group>
      </group>
    </group>
  );
};

export type AnimatedStarshipViewerProps = {
  modelPath: string;
  animationConfigs: AnimationConfig[];
  containerHeight?: number;
  desiredSize?: number;
  className?: string;
  eventNamespace?: string;
  cameraPosition?: [number, number, number];
  environmentPreset?: "city" | "sunset" | "studio" | "warehouse" | "forest";
  enableShadows?: boolean;
  dpr?: [number, number];
  verticalOffset?: number;
  intersectionThreshold?: number;
  preloadBufferPx?: number;
};

const applyContainerBgToGL = (
  gl: WebGLRenderer,
  el: HTMLElement | null,
  fallbackColor: Color
) => {
  try {
    if (!el) {
      gl.setClearColor(fallbackColor, 0);
      return;
    }
    const style = window.getComputedStyle(el);
    const bg = style.backgroundColor || style.background || "rgba(0,0,0,0)";
    const rgbaMatch = bg.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/i
    );
    if (rgbaMatch) {
      const r = Number(rgbaMatch[1]) / 255;
      const g = Number(rgbaMatch[2]) / 255;
      const b = Number(rgbaMatch[3]) / 255;
      const a = rgbaMatch[4] !== undefined ? Number(rgbaMatch[4]) : 1;
      gl.setClearColor(new Color(r, g, b), a);
      return;
    }
    const hexMatch = bg.match(/#([0-9a-f]{3,8})/i);
    if (hexMatch) {
      gl.setClearColor(new Color(hexMatch[0]), 1);
      return;
    }
    gl.setClearColor(fallbackColor, 0);
  } catch (error) {
    gl.setClearColor(fallbackColor, 0);
  }
};

const AnimatedStarshipViewer = ({
  modelPath,
  animationConfigs,
  containerHeight = 360,
  desiredSize = 2.8,
  className,
  eventNamespace = "starship-viewer",
  cameraPosition = DEFAULT_CAMERA_POSITION,
  environmentPreset = "city",
  enableShadows = true,
  dpr = [1, 1.5],
  verticalOffset = -0.15,
  intersectionThreshold = 0.3,
  preloadBufferPx = 200,
}: AnimatedStarshipViewerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [trigger, setTrigger] = useState(0);
  const inViewRef = useRef(false);
  const animationCounterRef = useRef(0);
  const bgFallback = useMemo(() => new Color(0, 0, 0), []);

  useGLTF.preload(modelPath);

  useEffect(() => {
    const root = document.documentElement;
    const handlerName = `${eventNamespace}-reapply-bg`;

    const mo = new MutationObserver(() => {
      window.dispatchEvent(new CustomEvent(handlerName));
    });
    mo.observe(root, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const mqHandler = () => window.dispatchEvent(new CustomEvent(handlerName));
    mq.addEventListener?.("change", mqHandler);

    return () => {
      mo.disconnect();
      mq.removeEventListener?.("change", mqHandler);
    };
  }, [eventNamespace]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const handlerName = `${eventNamespace}-reapply-bg`;

    const triggerNext = () => {
      const next = animationCounterRef.current % animationConfigs.length;
      animationCounterRef.current =
        (animationCounterRef.current + 1) % animationConfigs.length;
      setAnimationIndex(next);
      setTrigger((prev) => prev + 1);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target !== node) return;
          if (entry.isIntersecting) {
            if (!inViewRef.current) {
              inViewRef.current = true;
              requestAnimationFrame(triggerNext);
            }
          } else {
            inViewRef.current = false;
          }
        });
      },
      {
        threshold: intersectionThreshold,
        rootMargin: `${preloadBufferPx}px 0px`,
      }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [
    animationConfigs.length,
    eventNamespace,
    intersectionThreshold,
    preloadBufferPx,
  ]);

  return (
    <div
      ref={containerRef}
      className={className ?? "w-full h-[360px] rounded-3xl overflow-hidden"}
      style={!className ? { height: containerHeight } : undefined}
    >
      <Canvas
        camera={{ position: cameraPosition, fov: 45 }}
        shadows={enableShadows}
        dpr={dpr}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => {
          applyContainerBgToGL(
            gl as WebGLRenderer,
            containerRef.current,
            bgFallback
          );
          const handlerName = `${eventNamespace}-reapply-bg`;
          const handler = () =>
            applyContainerBgToGL(
              gl as WebGLRenderer,
              containerRef.current,
              bgFallback
            );
          window.addEventListener(handlerName, handler);
          (
            gl as unknown as WebGLRenderer & {
              __animated_starship_cleanup__?: () => void;
            }
          ).__animated_starship_cleanup__ = () =>
            window.removeEventListener(handlerName, handler);
        }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[3, 6, 4]} intensity={1.05} />
        <directionalLight position={[-4, -3, -4]} intensity={0.45} />

        <Suspense fallback={null}>
          <AnimatedModel
            modelPath={modelPath}
            animationConfig={animationConfigs[animationIndex]}
            trigger={trigger}
            desiredSize={desiredSize}
            verticalOffset={verticalOffset}
          />
          <Environment preset={environmentPreset} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          autoRotate={false}
          enableDamping
          dampingFactor={0.08}
          minDistance={3}
          maxDistance={6}
        />
      </Canvas>
    </div>
  );
};

export default AnimatedStarshipViewer;
