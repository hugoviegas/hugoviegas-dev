import type { StarshipConfig } from "./types";

// GLB models
import XWingGLB from "../../assets/3d-model/Lego-glb-models/X-wing.glb";
import MicroFalconGLB from "../../assets/3d-model/Lego-glb-models/Micro Millennium Falcon.glb";

/**
 * Simplified configurations for basic starship shapes.
 * Using simple geometries instead of complex GLTF models for better performance.
 */
export const DEFAULT_STARSHIP_CONFIGS: StarshipConfig[] = [
  {
    id: "x-wing",
    name: "T-65 X-wing",
    modelPath: XWingGLB,
    scale: [1.4, 1.4, 1.4],
    initialRotation: [0, Math.PI / 4, 0],
    speed: { min: 0.8, max: 1.5, rotationSpeed: 0.22 },
    trajectory: "linear",
    spawnZone: {
      entry: [-5, 2.2, 0.8],
      exit: [4.5, -2, -8],
      variation: 1.6,
    },
  },
  {
    id: "micro-falcon",
    name: "Micro Millennium Falcon",
    modelPath: MicroFalconGLB,
    scale: [1.8, 1.8, 1.8],
    initialRotation: [0, Math.PI / 2, 0],
    speed: { min: 0.6, max: 1.1, rotationSpeed: 0.18 },
    trajectory: "diagonal",
    spawnZone: {
      entry: [-4, 2.5, 1.2],
      exit: [4, -2.8, -7],
      variation: 2.4,
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
  return DEFAULT_STARSHIP_CONFIGS.map((config) => ({
    ...config,
    scale: config.scale.map((value) => value * 0.7) as [number, number, number],
    speed: {
      ...config.speed,
      min: Math.max(config.speed.min * 0.8, 0.3),
      max: Math.max(config.speed.max * 0.85, config.speed.min * 0.9),
    },
    spawnZone: {
      ...config.spawnZone,
      entry: config.spawnZone.entry.map((value) => value * 0.85) as [
        number,
        number,
        number
      ],
      exit: config.spawnZone.exit.map((value) => value * 0.85) as [
        number,
        number,
        number
      ],
      variation: config.spawnZone.variation * 0.75,
    },
  }));
}
