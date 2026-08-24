import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import type { Object3D } from "three";
// Minimal local type for glTF loaded result to avoid importing types from three examples
type GLTFLike = {
  scene: Object3D;
};

function Controls() {
  const { camera, gl } = useThree();
  const ref = useRef<OrbitControls | null>(null);
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enablePan = false;
    ref.current = controls;
    return () => controls.dispose();
  }, [camera, gl]);
  return null;
}

function LightsaberModel({ position }: { position: [number, number, number] }) {
  const gltf = useLoader(
    GLTFLoader,
    "/src/assets/3d-model/Star Wars - Lightsabers.glb"
  ) as GLTFLike;
  const ref = useRef<Object3D | null>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.4;
  });
  return (
    <primitive ref={ref} object={gltf.scene.clone(true)} position={position} />
  );
}

export default function Viewer() {
  return (
    <div className="w-full h-[75vh]">
      <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 7]} intensity={0.8} />
        <LightsaberModel position={[0, 0, 0]} />
        <Controls />
      </Canvas>
    </div>
  );
}
