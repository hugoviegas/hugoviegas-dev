import { useRef, useState, useCallback, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type {
  StarshipConfig,
  StarshipInstance,
  AnimationState,
  UseStarshipAnimationReturn,
  PerformanceStats,
  Vector3,
  SpawnZone,
} from "./types";

/**
 * Custom hook for managing starship animation logic and state.
 * Handles spawning, animation updates, and performance monitoring.
 */
export function useStarshipAnimation(
  configs: StarshipConfig[],
  maxConcurrent: number,
  debugMode: boolean = false,
  rotationEnabled: boolean = true
): UseStarshipAnimationReturn {
  const [instances, setInstances] = useState<StarshipInstance[]>([]);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats>({
    fps: 60,
    frameTime: 16.67,
    activeInstances: 0,
    memoryUsage: 0,
  });
  const [adaptiveMaxConcurrent, setAdaptiveMaxConcurrent] =
    useState(maxConcurrent);

  // Refs for performance tracking and animation state
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);
  const qualityAdjustmentRef = useRef(0); // Tracks quality adjustments
  const instancesRef = useRef<StarshipInstance[]>([]); // Ref to store current instances for animation

  // Adaptive quality adjustment based on performance and memory
  const adjustQualityBasedOnPerformance = useCallback(
    (currentFps: number, memoryUsage: number) => {
      const targetFps = 30; // Minimum acceptable FPS
      const excellentFps = 50; // FPS threshold for high quality
      const memoryLimit = 80 * 1024 * 1024; // 80MB memory limit
      const criticalMemoryLimit = 100 * 1024 * 1024; // 100MB critical limit

      let shouldReduceQuality = false;
      let reason = "";

      // Check FPS performance
      if (currentFps < targetFps && adaptiveMaxConcurrent > 1) {
        shouldReduceQuality = true;
        reason = `low FPS (${currentFps})`;
      }
      // Check memory usage
      else if (memoryUsage > criticalMemoryLimit && adaptiveMaxConcurrent > 1) {
        shouldReduceQuality = true;
        reason = `critical memory usage (${Math.round(
          memoryUsage / 1024 / 1024
        )}MB)`;
      } else if (memoryUsage > memoryLimit && adaptiveMaxConcurrent > 2) {
        shouldReduceQuality = true;
        reason = `high memory usage (${Math.round(
          memoryUsage / 1024 / 1024
        )}MB)`;
      }

      if (shouldReduceQuality) {
        // Reduce quality when performance or memory is poor
        const newMax = Math.max(1, adaptiveMaxConcurrent - 1);
        setAdaptiveMaxConcurrent(newMax);
        qualityAdjustmentRef.current = Math.max(
          0,
          qualityAdjustmentRef.current + 1
        );
        console.log(
          `Performance: Reduced max concurrent ships to ${newMax} due to ${reason}`
        );
      } else if (
        currentFps > excellentFps &&
        memoryUsage < memoryLimit * 0.6 && // Only increase if memory usage is reasonable
        adaptiveMaxConcurrent < maxConcurrent &&
        qualityAdjustmentRef.current > 0
      ) {
        // Increase quality when FPS is excellent, memory is low, and we previously reduced it
        const newMax = Math.min(maxConcurrent, adaptiveMaxConcurrent + 1);
        setAdaptiveMaxConcurrent(newMax);
        qualityAdjustmentRef.current = Math.max(
          0,
          qualityAdjustmentRef.current - 1
        );
        console.log(
          `Performance: Increased max concurrent ships to ${newMax} (FPS: ${currentFps}, Memory: ${Math.round(
            memoryUsage / 1024 / 1024
          )}MB)`
        );
      }
    },
    [adaptiveMaxConcurrent, maxConcurrent]
  );

  // Calculate initial velocity based on trajectory type
  const calculateInitialVelocity = useCallback(
    (config: StarshipConfig, position: Vector3): Vector3 => {
      const speed =
        config.speed.min +
        Math.random() * (config.speed.max - config.speed.min);
      const direction = new THREE.Vector3();

      switch (config.trajectory) {
        case "linear":
          // Move from entry to exit
          direction
            .set(
              config.spawnZone.exit[0] - position[0],
              config.spawnZone.exit[1] - position[1],
              config.spawnZone.exit[2] - position[2]
            )
            .normalize();
          break;
        case "curved":
          // Slight curve with some Y variation
          direction
            .set(
              config.spawnZone.exit[0] - position[0],
              config.spawnZone.exit[1] -
                position[1] +
                (Math.random() - 0.5) * 2,
              config.spawnZone.exit[2] - position[2]
            )
            .normalize();
          break;
        case "diagonal":
          // Diagonal movement with crossing pattern
          direction
            .set(
              config.spawnZone.exit[0] - position[0],
              config.spawnZone.exit[1] - position[1] + 2,
              config.spawnZone.exit[2] - position[2]
            )
            .normalize();
          break;
        case "spiral": {
          // Spiral pattern
          const angle = Math.random() * Math.PI * 2;
          direction.set(Math.cos(angle), 0.5, Math.sin(angle)).normalize();
          break;
        }
        default:
          direction.set(1, 0, 0); // Default to right
      }

      return [direction.x * speed, direction.y * speed, direction.z * speed];
    },
    []
  );

  // Create initial animation state for a starship
  const createAnimationState = useCallback(
    (config: StarshipConfig): AnimationState => {
      const variation = config.spawnZone.variation;
      const entryPos = config.spawnZone.entry;

      // Add random variation to spawn position
      const position: Vector3 = [
        entryPos[0] + (Math.random() - 0.5) * variation,
        entryPos[1] + (Math.random() - 0.5) * variation,
        entryPos[2] + (Math.random() - 0.5) * variation,
      ];

      // Calculate velocity based on trajectory
      const velocity = calculateInitialVelocity(config, position);

      return {
        position,
        rotation: [...config.initialRotation],
        velocity,
        progress: 0,
        isVisible: true,
        lastUpdate: performance.now(),
      };
    },
    [calculateInitialVelocity]
  );

  // Remove a starship instance
  const removeStarship = useCallback((instanceId: string) => {
    setInstances((prev) => {
      const newInstances = prev.filter(
        (instance) => instance.id !== instanceId
      );
      instancesRef.current = newInstances;
      return newInstances;
    });
  }, []);

  // Spawn a new starship instance
  const spawnStarship = useCallback(
    (configId: string, overrides?: Partial<AnimationState>) => {
      const config = configs.find((c) => c.id === configId);
      if (!config) {
        console.warn(`Starship config "${configId}" not found`);
        return undefined;
      }

      let createdInstanceId: string | undefined;
      setInstances((prev) => {
        // Check if we're at the limit before adding
        if (prev.length >= adaptiveMaxConcurrent) {
          // Remove oldest instance if at limit
          const oldestInstance = prev.reduce((oldest, current) =>
            current.state.lastUpdate < oldest.state.lastUpdate
              ? current
              : oldest
          );
          const filteredInstances = prev.filter(
            (instance) => instance.id !== oldestInstance.id
          );
          instancesRef.current = filteredInstances;
          // Continue with filtered instances
          prev = filteredInstances;
        }

        const instanceId = `${configId}-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const animationState = createAnimationState(config);

        if (overrides) {
          if (overrides.position) {
            animationState.position = [...overrides.position] as Vector3;
          }
          if (overrides.rotation) {
            animationState.rotation = [...overrides.rotation] as Vector3;
          }
          if (overrides.velocity) {
            animationState.velocity = [...overrides.velocity] as Vector3;
          }
          if (typeof overrides.progress === "number") {
            animationState.progress = overrides.progress;
          }
          if (typeof overrides.isVisible === "boolean") {
            animationState.isVisible = overrides.isVisible;
          }
          if (typeof overrides.lastUpdate === "number") {
            animationState.lastUpdate = overrides.lastUpdate;
          }
        }

        const newInstance: StarshipInstance = {
          id: instanceId,
          config,
          state: animationState,
        };

        const newInstances = [...prev, newInstance];
        instancesRef.current = newInstances;
        createdInstanceId = instanceId;
        return newInstances;
      });
      return createdInstanceId;
    },
    [configs, adaptiveMaxConcurrent, createAnimationState]
  );

  // Update instance animation state
  const updateInstance = useCallback(
    (instanceId: string, updates: Partial<AnimationState>) => {
      setInstances((prev) =>
        prev.map((instance) =>
          instance.id === instanceId
            ? { ...instance, state: { ...instance.state, ...updates } }
            : instance
        )
      );
    },
    []
  );

  // Update animation frame
  useFrame((state, delta) => {
    const currentTime = performance.now();

    // Update performance stats
    frameCountRef.current++;
    const timeDiff = currentTime - lastTimeRef.current;

    if (timeDiff >= 1000) {
      // Update FPS every second
      const fps = (frameCountRef.current / timeDiff) * 1000;
      fpsHistoryRef.current.push(fps);
      if (fpsHistoryRef.current.length > 10) {
        fpsHistoryRef.current.shift();
      }

      const avgFps =
        fpsHistoryRef.current.reduce((a, b) => a + b, 0) /
        fpsHistoryRef.current.length;

      setPerformanceStats({
        fps: Math.round(avgFps),
        frameTime: delta * 1000,
        activeInstances: instancesRef.current.length,
        memoryUsage:
          (performance as { memory?: { usedJSHeapSize: number } }).memory
            ?.usedJSHeapSize || 0,
      });

      // Adjust quality based on performance
      adjustQualityBasedOnPerformance(avgFps, performanceStats.memoryUsage);

      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
    }

    // Update animation state in ref (not React state to avoid re-renders)
    instancesRef.current = instancesRef.current
      .map((instance) => {
        const newState = { ...instance.state };

        // Update position
        newState.position = [
          newState.position[0] + newState.velocity[0] * delta,
          newState.position[1] + newState.velocity[1] * delta,
          newState.position[2] + newState.velocity[2] * delta,
        ];

        // Update rotation if rotation speed is set and rotation is enabled
        if (rotationEnabled && instance.config.speed.rotationSpeed) {
          newState.rotation = [
            newState.rotation[0],
            newState.rotation[1] + instance.config.speed.rotationSpeed * delta,
            newState.rotation[2],
          ];
        }

        // Update progress (0-1 based on distance traveled)
        const startPos = new THREE.Vector3(...instance.config.spawnZone.entry);
        const endPos = new THREE.Vector3(...instance.config.spawnZone.exit);
        const currentPos = new THREE.Vector3(...newState.position);
        const totalDistance = startPos.distanceTo(endPos);
        const currentDistance = startPos.distanceTo(currentPos);
        newState.progress = Math.min(currentDistance / totalDistance, 1);

        // Check if starship should be removed (off-screen)
        const isOffScreen = checkIfOffScreen(
          newState.position,
          instance.config.spawnZone
        );
        if (isOffScreen) {
          // Mark for removal - will be filtered out
          return null;
        }

        newState.lastUpdate = currentTime;
        return { ...instance, state: newState };
      })
      .filter(Boolean) as StarshipInstance[];

    // Sync React state with ref after animation updates
    setInstances(instancesRef.current);
  });

  // Check if position is off-screen
  const checkIfOffScreen = useCallback(
    (position: Vector3, spawnZone: SpawnZone): boolean => {
      const exitPos = spawnZone.exit;
      const distanceFromExit = Math.sqrt(
        Math.pow(position[0] - exitPos[0], 2) +
          Math.pow(position[1] - exitPos[1], 2) +
          Math.pow(position[2] - exitPos[2], 2)
      );

      // Remove if significantly past the exit point (increased from 10 to 20)
      return distanceFromExit > 20;
    },
    []
  );

  // Sync ref with state when instances change
  useEffect(() => {
    instancesRef.current = instances;
  }, [instances]);

  // Auto-spawn starships periodically
  useEffect(() => {
    if (configs.length === 0 || instances.length >= adaptiveMaxConcurrent)
      return;

    const spawnInterval = setInterval(() => {
      if (instances.length < adaptiveMaxConcurrent) {
        const randomConfig =
          configs[Math.floor(Math.random() * configs.length)];
        spawnStarship(randomConfig.id);
      }
    }, 3000 + Math.random() * 2000); // 3-5 second intervals

    return () => clearInterval(spawnInterval);
  }, [configs, instances.length, adaptiveMaxConcurrent, spawnStarship]);

  return {
    instances,
    spawnStarship,
    removeStarship,
    updateInstance,
    performanceStats,
  };
}
