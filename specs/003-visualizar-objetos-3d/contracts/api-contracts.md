# API Contracts: StarshipBackground Configuration

## Configuration API

### Default Configurations Endpoint

Provides predefined configurations for all available starship models.

```typescript
// Static configuration export
export const getDefaultStarshipConfigs = (): StarshipConfig[] => {
  return [
    {
      id: "xwing",
      name: "X-wing Fighter",
      modelPath: "/src/assets/3d-model/Lego glb models/X-wing.glb",
      scale: [0.8, 0.8, 0.8],
      initialRotation: [0, Math.PI / 4, 0],
      speed: { min: 0.5, max: 1.2, rotationSpeed: 0.1 },
      trajectory: "linear",
      spawnZone: {
        entry: [-10, 2, 5],
        exit: [10, -2, -5],
        variation: 3,
      },
    },
    // ... other starship configurations
  ];
};
```

### Custom Configuration API

Allows runtime modification of starship configurations.

```typescript
// Configuration management interface
interface ConfigurationManager {
  loadConfig(id: string): Promise<StarshipConfig>;
  saveConfig(config: StarshipConfig): Promise<void>;
  validateConfig(config: Partial<StarshipConfig>): ValidationResult;
  getAvailableModels(): Promise<string[]>;
  exportConfiguration(): string;
  importConfiguration(json: string): Promise<StarshipConfig[]>;
}
```

## Animation Control API

### Animation State Management

Interface for controlling individual starship animations.

```typescript
interface AnimationController {
  // Instance management
  createInstance(configId: string): Promise<StarshipInstance>;
  destroyInstance(instanceId: string): Promise<void>;
  getAllInstances(): StarshipInstance[];

  // Animation controls
  pauseAnimation(instanceId?: string): void;
  resumeAnimation(instanceId?: string): void;
  resetAnimation(instanceId: string): void;

  // State updates
  updatePosition(instanceId: string, position: Vector3): void;
  updateRotation(instanceId: string, rotation: Vector3): void;
  updateSpeed(instanceId: string, speed: SpeedConfig): void;

  // Event listeners
  onInstanceCreated(callback: (instance: StarshipInstance) => void): void;
  onInstanceDestroyed(callback: (instanceId: string) => void): void;
  onAnimationUpdate(callback: (instances: StarshipInstance[]) => void): void;
}
```

### Performance Monitoring API

Interface for tracking system performance and optimization.

```typescript
interface PerformanceMonitor {
  getCurrentFPS(): number;
  getAverageFrameTime(): number;
  getMemoryUsage(): MemoryInfo;
  getActiveInstanceCount(): number;

  // Performance events
  onPerformanceDrop(callback: (metrics: PerformanceMetrics) => void): void;
  onMemoryWarning(callback: (usage: MemoryInfo) => void): void;

  // Optimization controls
  enableAdaptiveQuality(enabled: boolean): void;
  setPerformanceMode(mode: "high" | "medium" | "low"): void;
  getOptimizationSuggestions(): OptimizationSuggestion[];
}
```

## Debug API

### Debug Controls Interface

API for development-time configuration and testing.

```typescript
interface DebugController {
  // Visual debugging
  showBoundingBoxes(enabled: boolean): void;
  showTrajectories(enabled: boolean): void;
  showPerformanceOverlay(enabled: boolean): void;

  // Configuration testing
  previewConfiguration(config: StarshipConfig): Promise<void>;
  testTrajectory(instanceId: string, trajectory: TrajectoryType): void;

  // Data export/import
  exportCurrentSession(): DebugSession;
  loadDebugSession(session: DebugSession): Promise<void>;

  // Real-time manipulation
  selectInstance(instanceId: string): void;
  updateInstanceProperty(
    instanceId: string,
    property: string,
    value: any
  ): void;
  duplicateInstance(instanceId: string): Promise<StarshipInstance>;
}
```

### Debug Data Types

Supporting types for debug functionality.

```typescript
interface DebugSession {
  timestamp: number;
  configurations: StarshipConfig[];
  activeInstances: StarshipInstance[];
  performanceMetrics: PerformanceMetrics;
  userNotes?: string;
}

interface OptimizationSuggestion {
  type: "reduce_instances" | "lower_quality" | "adjust_spawn_rate";
  severity: "low" | "medium" | "high";
  description: string;
  impact: string;
  implementation?: () => void;
}

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  textureMemory?: number;
  geometryMemory?: number;
}
```

## Error Handling API

### Error Types and Handlers

Standardized error handling for all starship operations.

```typescript
// Error type definitions
type StarshipError =
  | ModelLoadError
  | AnimationError
  | ConfigurationError
  | PerformanceError;

interface ErrorHandler {
  onModelLoadError(error: ModelLoadError): void;
  onAnimationError(error: AnimationError): void;
  onConfigurationError(error: ConfigurationError): void;
  onPerformanceError(error: PerformanceError): void;
}

// Specific error types
interface ModelLoadError {
  type: "model_load_error";
  modelPath: string;
  cause: "not_found" | "invalid_format" | "network_error";
  message: string;
  retryable: boolean;
}

interface AnimationError {
  type: "animation_error";
  instanceId: string;
  phase: "initialization" | "update" | "cleanup";
  message: string;
  recoverable: boolean;
}

interface ConfigurationError {
  type: "configuration_error";
  field: string;
  value: any;
  constraint: string;
  suggestion?: string;
}
```

## Event System API

### Event Emission and Handling

Event-driven communication between components.

```typescript
interface StarshipEventEmitter {
  // Model events
  emit(event: "model:loaded", data: { instanceId: string; model: GLTF }): void;
  emit(event: "model:error", data: { instanceId: string; error: Error }): void;

  // Animation events
  emit(event: "animation:start", data: { instanceId: string }): void;
  emit(event: "animation:complete", data: { instanceId: string }): void;
  emit(event: "animation:reset", data: { instanceId: string }): void;

  // Performance events
  emit(event: "performance:warning", data: PerformanceMetrics): void;
  emit(event: "performance:critical", data: PerformanceMetrics): void;

  // Debug events
  emit(event: "debug:selection", data: { instanceId: string }): void;
  emit(
    event: "debug:config_change",
    data: { instanceId: string; config: StarshipConfig }
  ): void;

  // Event listeners
  on<T>(event: string, callback: (data: T) => void): void;
  off(event: string, callback?: Function): void;
  once<T>(event: string, callback: (data: T) => void): void;
}
```

## Validation API

### Configuration Validation

Comprehensive validation for all configuration objects.

```typescript
interface ConfigValidator {
  validateStarshipConfig(config: StarshipConfig): ValidationResult;
  validateSpawnZone(zone: SpawnZone): ValidationResult;
  validateSpeedConfig(speed: SpeedConfig): ValidationResult;
  validateModelPath(path: string): Promise<ValidationResult>;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions?: string[];
}

interface ValidationError {
  field: string;
  message: string;
  severity: "error" | "warning";
  code: string;
}
```

## Response Formats

### Success Response

```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  timestamp: number;
  metadata?: Record<string, any>;
}
```

### Error Response

```typescript
interface ErrorResponse {
  success: false;
  error: {
    type: string;
    message: string;
    code?: string;
    details?: any;
  };
  timestamp: number;
}
```

These contracts define the complete API surface for the StarshipBackground system, ensuring consistent interfaces between all components and clear expectations for implementation.
