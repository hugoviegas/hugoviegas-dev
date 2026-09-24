import * as THREE from "three";

// Vector3 type alias for Three.js Vector3
export type Vector3 = [number, number, number];

// StarshipConfig defines configuration for individual starship models
export interface StarshipConfig {
  id: string; // Unique identifier for the starship
  name: string; // Display name (e.g., "X-wing", "Star Destroyer")
  modelPath: string; // Path to GLB model file
  scale: Vector3; // [x, y, z] scale factors
  initialRotation: Vector3; // [x, y, z] rotation in radians
  speed: SpeedConfig; // Movement speed configuration
  trajectory: TrajectoryType; // Type of movement pattern
  spawnZone: SpawnZone; // Where the starship can appear
  materialOverrides?: MaterialConfig; // Optional material customizations
}

// SpeedConfig defines random speed variations for dynamic movement
export interface SpeedConfig {
  min: number; // Minimum movement speed
  max: number; // Maximum movement speed
  rotationSpeed?: number; // Optional rotation while moving
}

// SpawnZone defines the area where starships can appear and their movement boundaries
export interface SpawnZone {
  entry: Vector3; // Where starship enters the scene
  exit: Vector3; // Where starship exits the scene
  variation: number; // Random variation in spawn position
}

// TrajectoryType enum defining available movement patterns
export type TrajectoryType = "linear" | "curved" | "spiral" | "diagonal";

// AnimationState runtime state for individual starship animations
export interface AnimationState {
  position: Vector3; // Current position
  rotation: Vector3; // Current rotation
  velocity: Vector3; // Current movement vector
  progress: number; // Animation progress (0-1)
  isVisible: boolean; // Whether starship is in view
  lastUpdate: number; // Timestamp of last update
}

// StarshipInstance runtime instance combining configuration and state
export interface StarshipInstance {
  id: string; // Unique instance ID
  config: StarshipConfig; // Configuration reference
  state: AnimationState; // Current animation state
  mesh?: THREE.Group; // Three.js mesh reference
}

// Component Props

// StarshipBackgroundProps main component props for customization
export interface StarshipBackgroundProps {
  /**
   * Custom starship configurations. If not provided, uses DEFAULT_STARSHIP_CONFIGS.
   * Each config defines a starship model, scale, speed, and flight pattern.
   *
   * @performance Consider the number of configs vs maxConcurrent for optimal performance
   * @memory Each config requires preloading its GLTF model
   */
  configs?: StarshipConfig[];

  /**
   * Maximum number of starships to animate simultaneously.
   * Automatically reduced on mobile devices and high memory usage.
   *
   * @default 6
   * @performance Lower values improve performance on slower devices
   * @memory Higher values increase memory usage linearly
   * @responsive Automatically reduced to 3 on screens <768px wide
   */
  maxConcurrent?: number;

  /**
   * Enable debug mode with performance stats and development controls.
   * Shows FPS, frame time, active ships, and spawn/remove buttons.
   *
   * @default false
   * @development Only enable in development environment
   */
  debugMode?: boolean;

  /**
   * Background transparency level (0 = fully transparent, 1 = fully opaque).
   * Affects the black background overlay behind the 3D scene.
   *
   * @default 0.3
   * @performance Lower opacity may improve rendering performance slightly
   */
  backgroundOpacity?: number;

  /** Additional CSS classes to apply to the component container. */
  className?: string;

  /**
   * Callback fired when a starship is clicked (only works in debug mode).
   * Receives the instance ID of the clicked starship.
   *
   * @param instanceId - Unique identifier of the clicked starship instance
   */
  onStarshipClick?: (instanceId: string) => void;

  /**
   * Callback fired when loading state changes.
   * Useful for showing loading indicators or disabling interactions.
   *
   * @param isLoading - True when models are loading, false when ready
   */
  onLoadingChange?: (isLoading: boolean) => void;

  /**
   * Callback fired when errors occur during model loading or animation.
   * Use for error reporting and fallback UI.
   *
   * @param error - The error that occurred
   */
  onError?: (error: Error) => void;
}

// StarshipModelProps individual starship component props
export interface StarshipModelProps {
  config: StarshipConfig; // Starship configuration
  animationState: AnimationState; // Current animation state
  onLoaded?: () => void; // Model loaded callback
  onError?: (error: Error) => void; // Error callback
  debugMode?: boolean; // Show debug helpers
  onClick?: () => void; // Click handler
  // Optional preloaded glTF object (if available)
  gltf?: unknown;
  // Optional manual transform override (applied while active)
  objectTransform?: {
    active: boolean;
    position: Vector3;
    rotation: Vector3;
  };
}

// Hook interfaces

// useStarshipAnimation hook return type
export interface UseStarshipAnimationReturn {
  instances: StarshipInstance[];
  spawnStarship: (
    configId: string,
    overrides?: Partial<AnimationState>
  ) => string | undefined;
  removeStarship: (instanceId: string) => void;
  updateInstance: (
    instanceId: string,
    updates: Partial<AnimationState>
  ) => void;
  performanceStats: PerformanceStats;
}

// Performance monitoring types
export interface PerformanceStats {
  fps: number;
  frameTime: number;
  activeInstances: number;
  memoryUsage?: number;
}

// Material configuration for custom materials
export interface MaterialConfig {
  color?: string;
  metalness?: number;
  roughness?: number;
  emissive?: string;
}

// Debug and development types

// DebugControls component props
export interface DebugControlsProps {
  instances: StarshipInstance[];
  onConfigChange: (instanceId: string, config: Partial<StarshipConfig>) => void;
  onExportConfig: () => void;
  onToggleTrajectories: () => void;
  onToggleStats: () => void;
}

// DebugOverlay component props
export interface DebugOverlayProps {
  instances: StarshipInstance[];
  showTrajectories: boolean;
  showStats: boolean;
  performanceStats: PerformanceStats;
}

// Configuration utilities types

// ConfigValidator interface
export interface ConfigValidator {
  validateStarshipConfig(config: StarshipConfig): ValidationResult;
  validateSpawnZone(zone: SpawnZone): ValidationResult;
  validateSpeedConfig(speed: SpeedConfig): ValidationResult;
  validateModelPath(path: string): Promise<ValidationResult>;
}

// Validation result types
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: "error" | "warning";
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// Configuration export/import types
export interface ConfigExport {
  timestamp: number;
  configs: StarshipConfig[];
  version: string;
}

export interface DebugSession {
  timestamp: number;
  configurations: StarshipConfig[];
  activeInstances: StarshipInstance[];
  performanceMetrics: PerformanceStats;
  userNotes?: string;
}

// Error types
export type StarshipError =
  | ModelLoadError
  | AnimationError
  | ConfigurationError
  | PerformanceError;

export interface ModelLoadError {
  type: "model_load_error";
  modelPath: string;
  cause: "not_found" | "invalid_format" | "network_error";
  message: string;
  retryable: boolean;
}

export interface AnimationError {
  type: "animation_error";
  instanceId: string;
  phase: "initialization" | "update" | "cleanup";
  message: string;
  recoverable: boolean;
}

export interface ConfigurationError {
  type: "configuration_error";
  field: string;
  value: unknown;
  constraint: string;
  suggestion?: string;
}

export interface PerformanceError {
  type: "performance_error";
  metric: string;
  value: number;
  threshold: number;
  message: string;
}

// Event system types
export interface StarshipEventEmitter {
  on<T>(event: string, callback: (data: T) => void): void;
  off(event: string, callback?: (...args: unknown[]) => void): void;
  once<T>(event: string, callback: (data: T) => void): void;
  emit(event: string, data: unknown): void;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
