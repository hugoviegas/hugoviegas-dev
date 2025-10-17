import { Suspense, useLayoutEffect, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Box3, Vector3, Color, WebGLRenderer } from "three";
import type { Group } from "three";
import microFalconModel from "@/assets/3d-model/Lego-glb-models/Micro Millennium Falcon.glb";

useGLTF.preload(microFalconModel);

const FalconModel = () => {
  const { scene } = useGLTF(microFalconModel);
  const rotationGroupRef = useRef<Group | null>(null);
  const pivotRef = useRef<Group | null>(null);

  // Clone the scene so multiple viewers can coexist without mutating the original graph
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useFrame((_, delta) => {
    if (rotationGroupRef.current) {
      rotationGroupRef.current.rotation.y += delta * 0.4;
    }
  });

  useLayoutEffect(() => {
    if (!pivotRef.current || !rotationGroupRef.current) return;

    const box = new Box3().setFromObject(pivotRef.current);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());

    // Reposition so the model sits at the origin for clean rotation
    pivotRef.current.position.set(-center.x, -center.y, -center.z);

    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    const desiredSize = 3.0; // tweak to keep model comfortably inside frame
    const scale = desiredSize / maxAxis;
    rotationGroupRef.current.scale.setScalar(scale);
    rotationGroupRef.current.position.set(0, -0.15, 0);
  }, [clonedScene]);

  return (
    <group ref={rotationGroupRef}>
      <group ref={pivotRef}>
        <primitive object={clonedScene} dispose={null} />
      </group>
    </group>
  );
};

const MicroFalconViewer = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Compute and apply container background to the GL clear color
  const applyContainerBgToGL = (gl: WebGLRenderer) => {
    try {
      const el = containerRef.current;
      if (!el || !gl) return;
      const style = window.getComputedStyle(el);
      const bg = style.backgroundColor || style.background || "rgba(0,0,0,0)";

      // parse rgba/hex into components
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

      // fallback: try hex
      const hexMatch = bg.match(/#([0-9a-f]{3,8})/i);
      if (hexMatch) {
        gl.setClearColor(new Color(hexMatch[0]), 1);
        return;
      }

      // final fallback: transparent
      gl.setClearColor(new Color(0, 0, 0), 0);
    } catch (e) {
      // noop
    }
  };

  useEffect(() => {
    // Observe theme/class changes on <html> to reapply background when user toggles theme
    const root = document.documentElement;
    const mo = new MutationObserver(() => {
      // find the renderer on next tick by dispatching a custom event that Canvas onCreated can pick up
      const evt = new CustomEvent("microfalcon-reapply-bg");
      window.dispatchEvent(evt);
    });
    mo.observe(root, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const mqHandler = () =>
      window.dispatchEvent(new CustomEvent("microfalcon-reapply-bg"));
    mq.addEventListener?.("change", mqHandler);
    return () => {
      mo.disconnect();
      mq.removeEventListener?.("change", mqHandler);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[360px] rounded-3xl overflow-hidden"
    >
      <Canvas
        camera={{ position: [0, 1.4, 4.2], fov: 45 }}
        shadows
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => {
          applyContainerBgToGL(gl);
          // listen for theme reapply events
          const handler = () => applyContainerBgToGL(gl);
          window.addEventListener("microfalcon-reapply-bg", handler);
          // cleanup when canvas unmounts
          (
            gl as unknown as WebGLRenderer & {
              __microfalcon_cleanup?: () => void;
            }
          ).__microfalcon_cleanup = () => {
            window.removeEventListener("microfalcon-reapply-bg", handler);
          };
        }}
      >
        {/* background color will be set from container style on canvas creation */}
        <ambientLight intensity={0.85} />
        <directionalLight position={[3, 6, 4]} intensity={1.1} />
        <directionalLight position={[-4, -3, -4]} intensity={0.5} />

        <Suspense fallback={null}>
          <FalconModel />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.4}
          enableDamping
          dampingFactor={0.08}
          minDistance={3}
          maxDistance={6}
        />
      </Canvas>
    </div>
  );
};

export default MicroFalconViewer;
