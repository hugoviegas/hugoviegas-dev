import React, { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import type { Group } from "three";

type Props = {
  modelPath: string;
  containerHeight?: number;
  autoRotate?: boolean;
  desiredSize?: number;
};

const GenericModel: React.FC<{ modelPath: string; desiredSize: number }> = ({
  modelPath,
  desiredSize,
}) => {
  const { scene } = useGLTF(modelPath);
  const rotationGroupRef = useRef<Group | null>(null);
  const pivotRef = useRef<Group | null>(null);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useFrame((_, delta) => {
    if (rotationGroupRef.current)
      rotationGroupRef.current.rotation.y += delta * 0.35;
  });

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

  return (
    <group ref={rotationGroupRef}>
      <group ref={pivotRef}>
        <primitive object={clonedScene} dispose={null} />
      </group>
    </group>
  );
};

const ModelViewer: React.FC<Props> = ({
  modelPath,
  containerHeight = 320,
  autoRotate = true,
  desiredSize = 2.8,
}) => {
  useGLTF.preload(modelPath);

  return (
    <div
      className="w-full rounded-3xl overflow-hidden"
      style={{ height: containerHeight }}
    >
      <Canvas
        camera={{ position: [0, 1.4, 4.2], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <color attach="background" args={["#00000000"]} />
        <ambientLight intensity={0.85} />
        <directionalLight position={[3, 6, 4]} intensity={1.1} />
        <directionalLight position={[-4, -3, -4]} intensity={0.5} />

        <Suspense fallback={null}>
          <GenericModel modelPath={modelPath} desiredSize={desiredSize} />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={0.35}
          enableDamping
          dampingFactor={0.08}
          minDistance={3}
          maxDistance={6}
        />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
