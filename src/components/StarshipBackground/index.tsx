import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { StarshipModel } from "./StarshipModel";
import { useLoader } from "@react-three/fiber";
// three/examples isn't typed in some environments; silence TS for the loader import
// @ts-expect-error - three/examples types may be missing in this environment
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useStarshipAnimation } from "./useStarshipAnimation";
import { StarshipErrorBoundary } from "./StarshipErrorBoundary";
import {
  DEFAULT_STARSHIP_CONFIGS,
  getMobileOptimizedConfigs,
} from "./starshipConfigs";
import type {
  StarshipBackgroundProps,
  StarshipInstance,
  PerformanceStats,
  StarshipConfig,
  Vector3,
} from "./types";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Inner component that contains R3F-specific logic and must be rendered inside Canvas
 */
const StarshipScene: React.FC<{
  responsiveConfigs: StarshipConfig[];
  responsiveMaxConcurrent: number;
  debugMode: boolean;
  onStarshipClick: (instanceId: string) => void;
  onError: (error: Error) => void;
  onInstancesChange: (instances: StarshipInstance[]) => void;
  onPerformanceStatsChange: (stats: PerformanceStats) => void;
  loadedModels: Record<string, unknown>;
  // Optional external spawn request: when trigger increments, spawnRequest.configId will be (re)spawned
  spawnRequest?: {
    trigger: number;
    configId: string;
    replace?: boolean;
    action?: "center" | "respawn";
    distance?: number;
    scale?: [number, number, number];
  };
  cameraZ?: number;
  manualControls?: boolean;
  objectTransformMap?: Record<
    string,
    {
      active: boolean;
      position: [number, number, number];
      rotation: [number, number, number];
    }
  >;
  rotationEnabled?: boolean;
}> = ({
  responsiveConfigs,
  responsiveMaxConcurrent,
  debugMode,
  onStarshipClick,
  onError,
  onInstancesChange,
  onPerformanceStatsChange,
  loadedModels,
  spawnRequest,
  cameraZ = 8,
  manualControls = false,
  objectTransformMap,
  rotationEnabled = true,
}) => {
  const {
    instances,
    spawnStarship,
    removeStarship,
    updateInstance,
    performanceStats,
  } = useStarshipAnimation(
    responsiveConfigs,
    responsiveMaxConcurrent,
    debugMode,
    rotationEnabled
  );

  const { camera } = useThree();

  // Notify parent component of state changes
  React.useEffect(() => {
    onInstancesChange(instances);
  }, [instances, onInstancesChange]);

  React.useEffect(() => {
    onPerformanceStatsChange(performanceStats);
  }, [performanceStats, onPerformanceStatsChange]);

  React.useEffect(() => {
    if (!spawnRequest) return;

    const { configId: cfgId, action = "respawn", distance = 2 } = spawnRequest;

    const targetConfig = responsiveConfigs.find((c) => c.id === cfgId);
    const matchingInstances = instances.filter(
      (inst) => inst.config.id === cfgId
    );

    if (action === "center" && camera && targetConfig) {
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      const worldPos = camera.position
        .clone()
        .add(dir.multiplyScalar(distance));
      const worldVector: Vector3 = [worldPos.x, worldPos.y, worldPos.z];
      const zeroVelocity: Vector3 = [0, 0, 0];
      const now = performance.now();

      if (matchingInstances.length > 0) {
        matchingInstances.forEach((inst, index) => {
          if (index === 0) {
            updateInstance(inst.id, {
              position: worldVector,
              rotation: targetConfig.initialRotation,
              velocity: zeroVelocity,
              progress: 0,
              lastUpdate: now,
              isVisible: true,
            });
          } else {
            removeStarship(inst.id);
          }
        });
      } else {
        spawnStarship(cfgId, {
          position: worldVector,
          rotation: targetConfig.initialRotation,
          velocity: zeroVelocity,
          progress: 0,
          isVisible: true,
          lastUpdate: now,
        });
      }

      return;
    }

    // Default respawn: remove existing instances and spawn a fresh one
    matchingInstances.forEach((inst) => removeStarship(inst.id));
    spawnStarship(cfgId);
  }, [
    spawnRequest,
    spawnRequest?.trigger,
    responsiveConfigs,
    instances,
    camera,
    removeStarship,
    spawnStarship,
    updateInstance,
  ]);

  // Apply objectTransformMap immediately to existing instances (update their animation state)
  React.useEffect(() => {
    if (!objectTransformMap) return;

    Object.entries(objectTransformMap).forEach(([configId, transform]) => {
      instances.forEach((inst) => {
        if (inst.config.id === configId && transform?.active) {
          updateInstance(inst.id, {
            position: transform.position,
            rotation: transform.rotation,
          });
        }
      });
    });
  }, [objectTransformMap, instances, updateInstance]);

  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.0} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <pointLight position={[0, 0, 5]} intensity={0.8} />

      {/* Camera controls (only in debug mode) */}
      {/* Camera controls (debug or manual) */}
      {(debugMode || manualControls) && (
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      )}

      {/* Apply camera Z (zoom) */}
      <CameraSetter z={cameraZ} />

      {/* Suspense boundary for model loading */}
      <Suspense fallback={null}>
        {instances.map((instance) => (
          <StarshipModel
            key={instance.id}
            config={instance.config}
            animationState={instance.state}
            debugMode={debugMode}
            gltf={loadedModels[instance.config.id]}
            objectTransform={
              objectTransformMap
                ? objectTransformMap[instance.config.id]
                : undefined
            }
            onLoaded={() => {
              // Could track individual model loading here
            }}
            onError={(error) => {
              console.error(
                `Failed to load starship ${instance.config.name}:`,
                error
              );
              onError?.(error);
            }}
            onClick={() => onStarshipClick(instance.id)}
          />
        ))}
      </Suspense>

      {/* Debug overlay information */}
      {debugMode && (
        <DebugOverlay
          instances={instances}
          performanceStats={performanceStats}
          onSpawnStarship={spawnStarship}
          onRemoveStarship={removeStarship}
        />
      )}
    </>
  );
};

/**
 * Debug overlay component for development controls.
 */
const DebugOverlay: React.FC<{
  instances: StarshipInstance[];
  performanceStats: PerformanceStats;
  onSpawnStarship: (configId: string) => void;
  onRemoveStarship: (instanceId: string) => void;
}> = ({ instances, performanceStats, onSpawnStarship, onRemoveStarship }) => {
  return (
    <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded text-sm z-30 pointer-events-auto max-w-xs">
      <h3 className="font-bold mb-2">Debug Controls</h3>
      <div className="space-y-1">
        <button
          onClick={() => onSpawnStarship(DEFAULT_STARSHIP_CONFIGS[0].id)}
          className="w-full bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        >
          Spawn X-wing
        </button>
        <button
          onClick={() => onSpawnStarship(DEFAULT_STARSHIP_CONFIGS[1].id)}
          className="w-full bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
        >
          Spawn Destroyer
        </button>
        {instances.length > 0 && (
          <button
            onClick={() => onRemoveStarship(instances[0].id)}
            className="w-full bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
          >
            Remove Ship
          </button>
        )}
      </div>
      <div className="mt-2 text-xs text-gray-300">
        Total: {instances.length} ships
      </div>
    </div>
  );
};

// Small helper to set camera Z position from props
const CameraSetter: React.FC<{ z?: number }> = ({ z = 8 }) => {
  const { camera } = useThree();
  React.useEffect(() => {
    if (camera) camera.position.z = z;
  }, [camera, z]);
  return null;
};

/**
 * StarshipBackground - A React component that renders an animated 3D Star Wars starship background.
 *
 * Features:
 * - Memory leak prevention with automatic Three.js resource cleanup
 * - Adaptive performance optimization based on FPS and memory usage
 * - Responsive design with mobile optimization
 * - Comprehensive error handling with fallback UI
 * - Debug mode for development and performance monitoring
 *
 * @example
 * ```tsx
 * // Basic usage
 * <StarshipBackground />
 *
 * // Advanced usage with custom configuration
 * <StarshipBackground
 *   maxConcurrent={4}
 *   debugMode={true}
 *   onError={(error) => console.error(error)}
 * />
 * ```
 *
 * @performance
 * - Automatically reduces quality when memory usage exceeds 80MB
 * - Limits concurrent starships on mobile devices (<768px width)
 * - Monitors FPS and adjusts animation complexity
 * - Preloads all GLTF models to prevent runtime stalls
 *
 * @memory
 * - Disposes all Three.js geometries, materials, and textures on unmount
 * - Clones scenes to prevent shared resource conflicts
 * - Clears all intervals and timeouts in cleanup
 * - Tracks heap usage with performance.memory API
 */
const StarshipBackground: React.FC<StarshipBackgroundProps> = ({
  configs = DEFAULT_STARSHIP_CONFIGS,
  maxConcurrent = 3, // Reduced from 6 to prevent memory issues
  debugMode = false,
  backgroundOpacity = 0.3,
  className = "",
  onStarshipClick,
  onLoadingChange,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [responsiveMaxConcurrent, setResponsiveMaxConcurrent] =
    useState(maxConcurrent);
  const [responsiveConfigs, setResponsiveConfigs] = useState(configs);
  // Editor UI state: which model to edit, local edits for scale and position
  const [selectedModelId, setSelectedModelId] = useState<string>(
    configs.length > 0 ? configs[0].id : ""
  );
  const [localScale, setLocalScale] = useState<[number, number, number]>(
    configs.length > 0 ? configs[0].scale : [1, 1, 1]
  );
  const [localPosition, setLocalPosition] = useState<[number, number, number]>(
    configs.length > 0 ? configs[0].spawnZone.entry : [0, 0, 0]
  );
  const [spawnRequest, setSpawnRequest] = useState<
    | ({ trigger: number; configId: string; replace?: boolean } & {
        action?: "center" | "respawn";
        distance?: number;
        scale?: [number, number, number];
      })
    | undefined
  >(undefined);
  const [cameraZ, setCameraZ] = useState<number>(8);
  const [manualControls, setManualControls] = useState<boolean>(false);
  const [lockTransform, setLockTransform] = useState<boolean>(false);
  const [objectRotation, setObjectRotation] = useState<
    [number, number, number]
  >([0, 0, 0]);
  const [rotationEnabled, setRotationEnabled] = useState<boolean>(true);

  // Mock instances and performance stats for the outer component
  // These will be managed by the StarshipScene component inside Canvas
  const [instances, setInstances] = useState<StarshipInstance[]>([]);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats>({
    fps: 60,
    frameTime: 16.67,
    activeInstances: 0,
    memoryUsage: 0,
  });

  // Clear spawnRequest on the next tick after it's handled to avoid repeated triggers
  React.useEffect(() => {
    if (!spawnRequest) return;
    const timeout = setTimeout(() => setSpawnRequest(undefined), 0);
    return () => clearTimeout(timeout);
  }, [spawnRequest, spawnRequest?.trigger]);

  // Detect screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);

      // Adjust max concurrent ships based on screen size
      if (mobile) {
        setResponsiveMaxConcurrent(Math.min(maxConcurrent, 3)); // Max 3 ships on mobile
        setResponsiveConfigs(getMobileOptimizedConfigs());
      } else {
        setResponsiveMaxConcurrent(maxConcurrent);
        setResponsiveConfigs(configs);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [maxConcurrent, configs]);

  // Preload models on mount (simplified - no actual loading needed for geometries)
  useEffect(() => {
    setIsLoading(true);
    setLoadingProgress(0);
    onLoadingChange?.(true);

    // Simple loading simulation for geometries
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newProgress = prev + 0.2;
        if (newProgress >= 1) {
          setIsLoading(false);
          clearInterval(progressInterval);
          onLoadingChange?.(false);
          return 1;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [onLoadingChange]);

  // Build a list of unique model paths to load with a single hook call
  const modelPaths = React.useMemo(() => {
    return Array.from(
      new Set(responsiveConfigs.map((c) => c.modelPath).filter(Boolean))
    );
  }, [responsiveConfigs]);

  // Load GLTFs for unique paths using a single useLoader hook (returns array)
  const loadedArray = useLoader(GLTFLoader, modelPaths as string[]);

  // Map loaded GLTFs back to config ids for quick lookup
  const loadedModels: Record<string, unknown> = React.useMemo(() => {
    const map: Record<string, unknown> = {};
    responsiveConfigs.forEach((c) => {
      if (c.modelPath) {
        const idx = modelPaths.indexOf(c.modelPath);
        map[c.id] = idx >= 0 ? loadedArray[idx] ?? null : null;
      } else {
        map[c.id] = null;
      }
    });
    return map;
  }, [responsiveConfigs, modelPaths, loadedArray]);

  // Handle starship click in debug mode
  const handleStarshipClick = (instanceId: string) => {
    if (debugMode && onStarshipClick) {
      onStarshipClick(instanceId);
    }
  };

  // When user selects a different model, update local inputs
  React.useEffect(() => {
    const cfg = responsiveConfigs.find((c) => c.id === selectedModelId);
    if (cfg) {
      setLocalScale(cfg.scale);
      setLocalPosition(cfg.spawnZone.entry);
    }
  }, [selectedModelId, responsiveConfigs]);

  // Approve handler: update config, emit spawnRequest, and log details
  const handleApprove = () => {
    if (!selectedModelId) return;
    const prev = responsiveConfigs.find((c) => c.id === selectedModelId);
    if (!prev) return;

    const updatedConfigs = responsiveConfigs.map((c) =>
      c.id === selectedModelId
        ? {
            ...c,
            scale: localScale,
            spawnZone: { ...c.spawnZone, entry: localPosition },
          }
        : c
    );
    setResponsiveConfigs(updatedConfigs);

    // Log details as requested
    console.log("Starship size/position approved:", {
      id: selectedModelId,
      previous: prev,
      updated: updatedConfigs.find((c) => c.id === selectedModelId),
    });

    // Trigger spawn request to refresh instance
    setSpawnRequest({
      trigger: Date.now(),
      configId: selectedModelId,
      replace: true,
    });
  };

  // Loading fallback component
  const LoadingFallback = () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading starships...</p>
        <div className="w-64 bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${loadingProgress * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <StarshipErrorBoundary
        onError={(error, errorInfo) => {
          console.error(
            "StarshipBackground error boundary caught error:",
            error
          );
          onError?.(error);
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          style={{
            background: "transparent",
            pointerEvents: manualControls || debugMode ? "auto" : "none",
            zIndex: -1,
          }}
          data-testid="canvas"
        >
          <StarshipScene
            responsiveConfigs={responsiveConfigs}
            responsiveMaxConcurrent={responsiveMaxConcurrent}
            debugMode={debugMode}
            onStarshipClick={handleStarshipClick}
            onError={onError}
            onInstancesChange={setInstances}
            onPerformanceStatsChange={setPerformanceStats}
            loadedModels={loadedModels}
            spawnRequest={spawnRequest}
            cameraZ={cameraZ}
            manualControls={manualControls}
            rotationEnabled={rotationEnabled}
            objectTransformMap={
              lockTransform
                ? {
                    [selectedModelId]: {
                      active: true,
                      position: localPosition,
                      rotation: objectRotation,
                    },
                  }
                : {}
            }
          />
        </Canvas>
      </StarshipErrorBoundary>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[-1]">
          <LoadingFallback />
        </div>
      )}

      {/* Performance stats overlay (debug mode) */}
      {debugMode && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded font-mono text-sm z-20 pointer-events-auto">
          <div>FPS: {performanceStats.fps}</div>
          <div>Frame Time: {performanceStats.frameTime.toFixed(2)}ms</div>
          <div>Active Ships: {performanceStats.activeInstances}</div>
        </div>
      )}

      {/* Editor controls: select model, adjust scale/position, approve */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 text-black p-3 rounded shadow z-30 pointer-events-auto max-w-sm">
        <h4 className="font-bold mb-2">Model Editor</h4>
        <div className="mb-2">
          <label className="block text-xs text-gray-600">Model</label>
          <select
            className="w-full border px-2 py-1 rounded"
            value={selectedModelId}
            onChange={(e) => setSelectedModelId(e.target.value)}
          >
            {responsiveConfigs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <label className="block text-xs text-gray-600">Camera Zoom</label>
          <input
            type="range"
            min={2}
            max={20}
            step={0.1}
            value={cameraZ}
            onChange={(e) => setCameraZ(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mb-2 flex items-center gap-2">
          <input
            id="manual-controls"
            type="checkbox"
            checked={manualControls}
            onChange={(e) => setManualControls(e.target.checked)}
          />
          <label htmlFor="manual-controls" className="text-xs">
            Enable Manual Controls
          </label>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-2">
          <label className="text-xs col-span-3">Scale (x y z)</label>
          <input
            className="border px-1 py-1 rounded text-xs"
            value={localScale[0]}
            onChange={(e) =>
              setLocalScale([
                Number(e.target.value) || 0,
                localScale[1],
                localScale[2],
              ])
            }
          />
          <input
            className="border px-1 py-1 rounded text-xs"
            value={localScale[1]}
            onChange={(e) =>
              setLocalScale([
                localScale[0],
                Number(e.target.value) || 0,
                localScale[2],
              ])
            }
          />
          <input
            className="border px-1 py-1 rounded text-xs"
            value={localScale[2]}
            onChange={(e) =>
              setLocalScale([
                localScale[0],
                localScale[1],
                Number(e.target.value) || 0,
              ])
            }
          />
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <label className="text-xs col-span-3">Position (x y z)</label>
          <input
            className="border px-1 py-1 rounded text-xs"
            value={localPosition[0]}
            onChange={(e) =>
              setLocalPosition([
                Number(e.target.value) || 0,
                localPosition[1],
                localPosition[2],
              ])
            }
          />
          <input
            className="border px-1 py-1 rounded text-xs"
            value={localPosition[1]}
            onChange={(e) =>
              setLocalPosition([
                localPosition[0],
                Number(e.target.value) || 0,
                localPosition[2],
              ])
            }
          />
          <input
            className="border px-1 py-1 rounded text-xs"
            value={localPosition[2]}
            onChange={(e) =>
              setLocalPosition([
                localPosition[0],
                localPosition[1],
                Number(e.target.value) || 0,
              ])
            }
          />
        </div>

        <div className="mb-2 flex items-center gap-2">
          <input
            id="rotation-enabled"
            type="checkbox"
            checked={rotationEnabled}
            onChange={(e) => setRotationEnabled(e.target.checked)}
          />
          <label htmlFor="rotation-enabled" className="text-xs">
            Rotate Ships
          </label>
        </div>

        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            onClick={handleApprove}
          >
            Approve Size
          </button>
          <button
            className="bg-yellow-600 text-black px-3 py-1 rounded text-sm"
            onClick={() => {
              const inst = instances.find(
                (i) => i.config.id === selectedModelId
              );
              if (inst) {
                console.log("Pegar Coordenadas -> instance:", {
                  id: inst.id,
                  position: inst.state.position,
                  rotation: inst.state.rotation,
                  scale: inst.config.scale,
                });
              } else {
                const cfg = responsiveConfigs.find(
                  (c) => c.id === selectedModelId
                );
                console.log(
                  "Pegar Coordenadas -> config (no active instance):",
                  {
                    id: selectedModelId,
                    position: localPosition,
                    scale: cfg ? cfg.scale : localScale,
                  }
                );
              }
            }}
          >
            Pegar Coordenadas
          </button>
          <button
            className="bg-green-600 text-white px-3 py-1 rounded text-sm"
            onClick={() => {
              const newScale: [number, number, number] = [0.2, 0.2, 0.2];
              const approxZ = cameraZ - 2;
              setLocalScale(newScale);
              setLocalPosition([0, 0, approxZ]);
              setResponsiveConfigs((prev) =>
                prev.map((c) =>
                  c.id === selectedModelId ? { ...c, scale: newScale } : c
                )
              );
              setSpawnRequest({
                trigger: Date.now(),
                configId: selectedModelId,
                action: "center",
                distance: 2,
                scale: newScale,
              });
            }}
          >
            Center to Camera + Small
          </button>
          <button
            className="bg-gray-200 px-3 py-1 rounded text-sm"
            onClick={() => {
              const cfg = configs.find((c) => c.id === selectedModelId);
              if (cfg) {
                setLocalScale(cfg.scale);
                setLocalPosition(cfg.spawnZone.entry);
              }
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
};

export default StarshipBackground;
