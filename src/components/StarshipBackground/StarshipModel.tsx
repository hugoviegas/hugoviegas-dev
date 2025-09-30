import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { StarshipModelProps } from "./types";

/**
 * Simple starship model using basic Three.js geometries.
 * Much more memory-efficient than loading complex GLTF models.
 */
export const StarshipModel: React.FC<StarshipModelProps> = ({
  config,
  animationState,
  onLoaded,
  onError,
  debugMode = false,
  onClick,
  gltf,
  objectTransform,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Create a simple starship geometry - just a basic shape (reliable fallback)
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 2), []);

  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color:
        config.id === "fighter"
          ? 0xff4444
          : config.id === "cruiser"
          ? 0x4444ff
          : 0x44ff44,
      transparent: true,
      opacity: 0.9,
    });
  }, [config.id]);

  // Simple rotation animation
  useFrame(() => {
    if (groupRef.current) {
      if (objectTransform && objectTransform.active) {
        groupRef.current.position.set(...objectTransform.position);
        groupRef.current.rotation.set(...objectTransform.rotation);
      } else {
        groupRef.current.position.set(...animationState.position);
        groupRef.current.rotation.set(...animationState.rotation);
      }
      groupRef.current.scale.set(...config.scale);
    }
  });

  // Call onLoaded immediately since we don't need to load external models
  React.useEffect(() => {
    onLoaded?.();
  }, [onLoaded]);

  // Render fallback box model (keeps behavior consistent and visible)
  return (
    <group ref={groupRef} onClick={onClick}>
      {gltf &&
      typeof gltf === "object" &&
      (gltf as unknown as { scene?: THREE.Object3D }).scene ? (
        // Render a cloned scene to avoid shared-state issues between instances
        <primitive
          object={(
            gltf as unknown as { scene?: THREE.Object3D }
          ).scene!.clone()}
        />
      ) : (
        <mesh geometry={geometry} material={material} />
      )}
    </group>
  );
};
