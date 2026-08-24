import { useGLTF } from "@react-three/drei";

/**
 * Preload all starship models for better performance.
 * This function should be called early in the application lifecycle.
 */
export const preloadStarshipModels = (
  configs: Array<{ modelPath: string }>
) => {
  configs.forEach((config) => {
    useGLTF.preload(config.modelPath);
  });
};
