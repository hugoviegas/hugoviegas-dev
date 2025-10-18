import {
  Suspense,
  useLayoutEffect,
  useMemo,
  useRef,
  useEffect,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Box3, Vector3, Color, WebGLRenderer, Euler, Quaternion } from "three";
import type { Group } from "three";
import microFalconModel from "@/assets/3d-model/Lego-glb-models/Micro Millennium Falcon.glb";

useGLTF.preload(microFalconModel);

const FalconModel = ({ playArrival }: { playArrival: boolean }) => {
  const { scene } = useGLTF(microFalconModel);
  const arrivalGroupRef = useRef<Group | null>(null);
  const rotationGroupRef = useRef<Group | null>(null);
  const pivotRef = useRef<Group | null>(null);

  // Clone the scene so multiple viewers can coexist without mutating the original graph
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  const startPosition = useMemo(() => new Vector3(3.4, -1.2, -12.5), []);
  const endPosition = useMemo(() => new Vector3(0, 0, 0), []);
  const startRotation = useMemo(() => new Euler(0.48, -0.9, 0.18), []);
  const endRotation = useMemo(() => new Euler(0, 0, 0), []);
  const startQuaternion = useMemo(
    () => new Quaternion().setFromEuler(startRotation),
    [startRotation]
  );
  const endQuaternion = useMemo(
    () => new Quaternion().setFromEuler(endRotation),
    [endRotation]
  );
  const tempQuaternion = useRef(new Quaternion());
  const animationState = useRef<"idle" | "running" | "done">("idle");
  const progressRef = useRef(0);
  const arrivalDuration = 2.8; // seconds
  const startScale = 0.55;
  const endScale = 1;

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  useLayoutEffect(() => {
    if (!arrivalGroupRef.current) return;
    arrivalGroupRef.current.position.copy(startPosition);
    arrivalGroupRef.current.quaternion.copy(startQuaternion);
    arrivalGroupRef.current.scale.setScalar(startScale);
  }, [startPosition, startQuaternion]);

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

  useEffect(() => {
    if (!playArrival || animationState.current !== "idle") return;
    animationState.current = "running";
    progressRef.current = 0;
    if (arrivalGroupRef.current) {
      arrivalGroupRef.current.position.copy(startPosition);
      arrivalGroupRef.current.quaternion.copy(startQuaternion);
      arrivalGroupRef.current.scale.setScalar(startScale);
    }
  }, [playArrival, startPosition, startQuaternion]);

  useFrame((_, delta) => {
    if (animationState.current !== "running" || !arrivalGroupRef.current)
      return;

    progressRef.current = Math.min(
      progressRef.current + delta / arrivalDuration,
      1
    );

    const easedTranslation = easeOutCubic(progressRef.current);
    const easedScale = easeOutExpo(progressRef.current);
    arrivalGroupRef.current.position.lerpVectors(
      startPosition,
      endPosition,
      easedTranslation
    );

    const currentQuat = tempQuaternion.current;
    currentQuat.copy(startQuaternion).slerp(endQuaternion, easedTranslation);
    arrivalGroupRef.current.quaternion.copy(currentQuat);

    const scaleValue =
      startScale + (endScale - startScale) * Math.min(easedScale, 1);
    arrivalGroupRef.current.scale.setScalar(scaleValue);

    if (progressRef.current >= 1) {
      animationState.current = "done";
      arrivalGroupRef.current.position.copy(endPosition);
      arrivalGroupRef.current.quaternion.copy(endQuaternion);
      arrivalGroupRef.current.scale.setScalar(endScale);
    }
  });

  return (
    <group ref={arrivalGroupRef}>
      <group ref={rotationGroupRef}>
        <group ref={pivotRef}>
          <primitive object={clonedScene} dispose={null} />
        </group>
      </group>
    </group>
  );
};

const MicroFalconViewer = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [playArrival, setPlayArrival] = useState(false);
  const hasTriggeredRef = useRef(false);

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

  useEffect(() => {
    const node = containerRef.current;
    if (!node || hasTriggeredRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            requestAnimationFrame(() => setPlayArrival(true));
          }
        });
      },
      {
        threshold: 0.35,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
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
          <FalconModel playArrival={playArrival} />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enablePan={false}
          autoRotate={false}
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
