import React, {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Box3, Vector3, Color, WebGLRenderer } from "three";
import type { Group } from "three";

type Props = {
  modelPaths: string[];
  containerHeight?: number;
  desiredSize?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  autoRotate?: boolean;
};

const ModelInstance: React.FC<{
  modelPath: string;
  desiredSize: number;
  autoRotate?: boolean;
}> = ({ modelPath, desiredSize, autoRotate = false }) => {
  const { scene } = useGLTF(modelPath);
  const rotationGroupRef = useRef<Group | null>(null);
  const pivotRef = useRef<Group | null>(null);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useLayoutEffect(() => {
    if (!pivotRef.current || !rotationGroupRef.current) return;
    const box = new Box3().setFromObject(pivotRef.current);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    pivotRef.current.position.set(-center.x, -center.y, -center.z);
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    const scale = desiredSize / maxAxis;
    rotationGroupRef.current.scale.setScalar(scale);
    rotationGroupRef.current.position.set(0, -0.15, 0);
  }, [clonedScene, desiredSize]);

  useEffect(() => {
    if (!autoRotate) return;
    let raf = 0;
    const tick = () => {
      if (rotationGroupRef.current)
        rotationGroupRef.current.rotation.y += 0.0035;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoRotate]);

  return (
    <group ref={rotationGroupRef}>
      <group ref={pivotRef}>
        <primitive object={clonedScene} dispose={null} />
      </group>
    </group>
  );
};

const ModelCarousel: React.FC<Props> = ({
  modelPaths,
  containerHeight = 360,
  desiredSize = 2.8,
  autoPlay = true,
  autoPlayInterval = 4000,
}) => {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Preload all
  useEffect(() => {
    modelPaths.forEach((p) => useGLTF.preload(p));
  }, [modelPaths]);

  // autoplay
  useEffect(() => {
    if (!autoPlay) return;
    const iv = setInterval(
      () => setIndex((i) => (i + 1) % modelPaths.length),
      autoPlayInterval
    );
    return () => clearInterval(iv);
  }, [autoPlay, autoPlayInterval, modelPaths.length]);

  // helper to set GL clear color to match container
  const applyContainerBgToGL = (gl: WebGLRenderer) => {
    try {
      const el = containerRef.current;
      if (!el || !gl) return;
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
      gl.setClearColor(new Color(0, 0, 0), 0);
    } catch (e) {
      // noop
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full rounded-3xl overflow-hidden"
      style={{ height: containerHeight }}
    >
      <Canvas
        camera={{ position: [0, 1.4, 4.2], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => {
          applyContainerBgToGL(gl as WebGLRenderer);
          const handler = () => applyContainerBgToGL(gl as WebGLRenderer);
          window.addEventListener("microfalcon-reapply-bg", handler);
          (
            gl as unknown as WebGLRenderer & {
              __microfalcon_cleanup?: () => void;
            }
          ).__microfalcon_cleanup = () =>
            window.removeEventListener("microfalcon-reapply-bg", handler);
        }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[3, 6, 4]} intensity={1.1} />
        <directionalLight position={[-4, -3, -4]} intensity={0.5} />

        <Suspense fallback={null}>
          <ModelInstance
            modelPath={modelPaths[index]}
            desiredSize={desiredSize}
          />
          <Environment preset="city" />
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

      {/* Controls */}
      <div className="flex items-center justify-between mt-3 px-2">
        <button
          className="px-3 py-2 rounded bg-muted/20 hover:bg-muted/30"
          onClick={() =>
            setIndex((i) => (i - 1 + modelPaths.length) % modelPaths.length)
          }
        >
          Prev
        </button>
        <div className="flex gap-2 items-center">
          {modelPaths.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full ${
                i === index ? "bg-primary" : "bg-muted/40"
              }`}
              aria-label={`Show model ${i + 1}`}
            />
          ))}
        </div>
        <button
          className="px-3 py-2 rounded bg-muted/20 hover:bg-muted/30"
          onClick={() => setIndex((i) => (i + 1) % modelPaths.length)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ModelCarousel;
