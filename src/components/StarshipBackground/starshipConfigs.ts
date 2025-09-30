import type { StarshipConfig } from "./types";

// GLB models
import XWingGLB from "../../assets/3d-model/Lego-glb-models/X-wing.glb";
import StarDestroyerGLB from "../../assets/3d-model/Lego-glb-models/Star Destroyer.glb";
import MicroFalconGLB from "../../assets/3d-model/Lego-glb-models/Micro Millennium Falcon.glb";
import ShuttleGLB from "../../assets/3d-model/Lego-glb-models/Imperial Shuttle.glb";
import FirstOrderSDGLB from "../../assets/3d-model/Lego-glb-models/First Order Star Destroyer.glb";
import SmallVenatorGLB from "../../assets/3d-model/Lego-glb-models/small venator class star destroyer.glb";

/**
 * Simplified configurations for basic starship shapes.
 * Using simple geometries instead of complex GLTF models for better performance.
 */
export const DEFAULT_STARSHIP_CONFIGS: StarshipConfig[] = [
  {
    id: "fighter",
    name: "Starfighter",
    modelPath: XWingGLB,
    scale: [2, 2, 2], // Increased scale
    initialRotation: [0, Math.PI / 4, 0],
    speed: { min: 0.8, max: 1.5, rotationSpeed: 0.2 },
    trajectory: "linear",
    spawnZone: {
      entry: [-5, 2, 0], // Closer to camera view
      exit: [5, -2, -10], // Move toward camera
      variation: 2,
    },
  },
  {
    id: "cruiser",
    name: "Cruiser",
    modelPath: StarDestroyerGLB,
    // Reduce scale so the capital ship isn't gigantic in the foreground
    scale: [0.5, 0.5, 0.5],
    initialRotation: [0, 0, 0],
    speed: { min: 0.3, max: 0.8, rotationSpeed: 0.1 },
    trajectory: "curved",
    spawnZone: {
      // Center the spawn zone so the ship appears in front of the camera by default
      entry: [0, 0, 4],
      exit: [0, 0, -6],
      variation: 0.5,
    },
  },
  {
    id: "transport",
    name: "Transport",
    modelPath: MicroFalconGLB,
    scale: [2.5, 2.5, 2.5], // Increased scale
    initialRotation: [0, Math.PI / 2, 0],
    speed: { min: 0.5, max: 1.0, rotationSpeed: 0.15 },
    trajectory: "diagonal",
    spawnZone: {
      entry: [-4, 3, 1], // Closer to camera view
      exit: [4, -3, -9], // Move toward camera
      variation: 3,
    },
  },
];

/**
 * Get a specific starship configuration by ID.
 */
export function getStarshipConfig(id: string): StarshipConfig | undefined {
  return DEFAULT_STARSHIP_CONFIGS.find((config) => config.id === id);
}

/**
 * Get all available starship configuration IDs.
 */
export function getAvailableStarshipIds(): string[] {
  return DEFAULT_STARSHIP_CONFIGS.map((config) => config.id);
}

/**
 * Get starship configurations filtered by trajectory type.
 */
export function getStarshipsByTrajectory(trajectory: string): StarshipConfig[] {
  return DEFAULT_STARSHIP_CONFIGS.filter(
    (config) => config.trajectory === trajectory
  );
}

/**
 * Get starship configurations suitable for mobile devices (smaller scale, fewer instances).
 */
export function getMobileOptimizedConfigs(): StarshipConfig[] {
  return DEFAULT_STARSHIP_CONFIGS.filter(
    (config) => config.scale[0] <= 1.0 && config.speed.max <= 1.0
  );
}
