import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, TransformControls } from "@react-three/drei";
import type {
  OrbitControls as OrbitControlsImpl,
  TransformControls as TransformControlsImpl,
} from "three-stdlib";
// @ts-expect-error - three/examples types may be missing in this environment
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Box3, Matrix4, Vector3 } from "three";
import type { Object3D } from "three";

type GLTFLike = {
  scene: Object3D;
};

type FalconModelProps = {
  orbitRef: React.MutableRefObject<OrbitControlsImpl | null>;
  modelRef: React.MutableRefObject<Object3D | null>;
  controlMode: "translate" | "rotate";
  onToggleMode: () => void;
};

const FalconModel: React.FC<FalconModelProps> = ({
  orbitRef,
  modelRef,
  controlMode,
  onToggleMode,
}) => {
  const gltf = useLoader(
    GLTFLoader,
    "/src/assets/3d-model/Lego-glb-models/Micro Millennium Falcon.glb"
  ) as GLTFLike;

  const model = useMemo(() => gltf.scene.clone(true), [gltf]);
  const transformRef = useRef<TransformControlsImpl | null>(null);

  useEffect(() => {
    const controls = transformRef.current;
    const object = modelRef.current;
    if (!controls || !object) return;
    controls.attach(object);
    return () => {
      controls.detach();
    };
  }, [modelRef, controlMode]);

  useFrame(() => {
    transformRef.current?.updateMatrixWorld();
  });

  return (
    <>
      <TransformControls
        ref={transformRef}
        mode={controlMode}
        onMouseDown={() => {
          if (orbitRef.current) {
            orbitRef.current.enabled = false;
          }
        }}
        onMouseUp={() => {
          if (orbitRef.current) {
            orbitRef.current.enabled = true;
          }
        }}
        showX
        showY
        showZ
      />
      <primitive ref={modelRef} object={model} onDoubleClick={onToggleMode} />
    </>
  );
};

const MicroFalcon: React.FC = () => {
  const orbitRef = useRef<OrbitControlsImpl | null>(null);
  const modelRef = useRef<Object3D | null>(null);
  const [controlMode, setControlMode] = useState<"translate" | "rotate">(
    "translate"
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "t" || event.key === "T") {
        setControlMode("translate");
      }
      if (event.key === "r" || event.key === "R") {
        setControlMode("rotate");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleMode = () => {
    setControlMode((current) =>
      current === "translate" ? "rotate" : "translate"
    );
  };

  const formatArray = (values: ArrayLike<number>, digits = 3) =>
    Array.from(values, (value) => {
      const numeric = typeof value === "number" ? value : Number(value);
      return Number(numeric.toFixed(digits));
    });

  const handleLogTransform = () => {
    const object = modelRef.current;
    if (!object) {
      console.warn("MicroFalcon: modelo ainda não carregado.");
      return;
    }

    object.updateMatrixWorld(true);

    const worldPosition = object.getWorldPosition(new Vector3()).toArray();
    const localPosition = object.position.toArray();
    const rotationRad = [
      object.rotation.x,
      object.rotation.y,
      object.rotation.z,
    ];
    const rotationDeg = rotationRad.map((value) =>
      Number(((value * 180) / Math.PI).toFixed(3))
    );
    const quaternion = formatArray(object.quaternion.toArray(), 6);
    const localScale = object.scale.toArray();
    const worldScale = object.getWorldScale(new Vector3()).toArray();
    const boundingBox = new Box3().setFromObject(object);
    const pivot = formatArray(worldPosition);
    const boundingCenterWorldVector = boundingBox.getCenter(new Vector3());
    const boundingCenterWorld = formatArray(
      boundingCenterWorldVector.toArray()
    );
    const boundingSizeWorld = formatArray(
      boundingBox.getSize(new Vector3()).toArray()
    );

    // Calculate center relative to object's local space
    const inverseMatrix = new Matrix4().copy(object.matrixWorld).invert();
    const centerLocalVector = boundingCenterWorldVector
      .clone()
      .applyMatrix4(inverseMatrix);
    const boundingCenterLocal = formatArray(centerLocalVector.toArray());

    console.group("Micro Millennium Falcon - Coordenadas atuais");
    console.log("Modo de controle:", controlMode);
    console.log("Posição local:", formatArray(localPosition));
    console.log("Posição mundial:", formatArray(worldPosition));
    console.log("Rotação (rad):", formatArray(rotationRad));
    console.log("Rotação (deg):", rotationDeg);
    console.log("Quaternion:", quaternion);
    console.log("Escala local:", formatArray(localScale));
    console.log("Escala mundial:", formatArray(worldScale));
    console.log("Pivot mundial:", pivot);
    console.log("Centro da bounding box (mundial):", boundingCenterWorld);
    console.log("Centro da bounding box (local):", boundingCenterLocal);
    console.log("Dimensões da bounding box:", boundingSizeWorld);
    console.groupEnd();
  };

  return (
    <div className="relative w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }}>
        <color attach="background" args={["#050505"]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 8, 6]} intensity={0.9} />
        <pointLight position={[-6, -4, 8]} intensity={0.5} />

        <OrbitControls
          ref={orbitRef}
          enablePan
          enableZoom
          enableRotate
          makeDefault
        />

        <Suspense fallback={null}>
          <group position={[0, -0.5, 0]}>
            <FalconModel
              orbitRef={orbitRef}
              modelRef={modelRef}
              controlMode={controlMode}
              onToggleMode={toggleMode}
            />
          </group>
        </Suspense>
      </Canvas>

      <div className="absolute left-4 bottom-4 z-10">
        <button
          type="button"
          onClick={handleLogTransform}
          className="rounded bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900 shadow hover:bg-white"
        >
          Pegar coordenadas
        </button>
      </div>
    </div>
  );
};

export default MicroFalcon;
