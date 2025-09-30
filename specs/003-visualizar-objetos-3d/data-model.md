# Data Model: Star Wars Starship Background

## Core Entities

### StarshipConfig

Defines configuration for individual starship models, including positioning, scaling, and animation behavior.

```typescript
interface StarshipConfig {
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
```

### SpeedConfig

Defines random speed variations for dynamic movement.

```typescript
interface SpeedConfig {
  min: number; // Minimum movement speed
  max: number; // Maximum movement speed
  rotationSpeed?: number; // Optional rotation while moving
}
```

### SpawnZone

Defines the area where starships can appear and their movement boundaries.

```typescript
interface SpawnZone {
  entry: Vector3; // Where starship enters the scene
  exit: Vector3; // Where starship exits the scene
  variation: number; // Random variation in spawn position
}
```

### TrajectoryType

Enum defining available movement patterns.

```typescript
type TrajectoryType = "linear" | "curved" | "spiral" | "diagonal";
```

### AnimationState

Runtime state for individual starship animations.

```typescript
interface AnimationState {
  position: Vector3; // Current position
  rotation: Vector3; // Current rotation
  velocity: Vector3; // Current movement vector
  progress: number; // Animation progress (0-1)
  isVisible: boolean; // Whether starship is in view
  lastUpdate: number; // Timestamp of last update
}
```

### StarshipInstance

Runtime instance combining configuration and state.

```typescript
interface StarshipInstance {
  id: string; // Unique instance ID
  config: StarshipConfig; // Configuration reference
  state: AnimationState; // Current animation state
  mesh?: THREE.Group; // Three.js mesh reference
}
```

## Component Props

### StarshipBackgroundProps

Main component props for customization.

```typescript
interface StarshipBackgroundProps {
  configs?: StarshipConfig[]; // Custom starship configurations
  maxConcurrent?: number; // Maximum concurrent animations
  debugMode?: boolean; // Enable debug controls
  backgroundOpacity?: number; // Background transparency
  className?: string; // CSS class name
  onStarshipClick?: (id: string) => void; // Click handler for debug mode
}
```

### StarshipModelProps

Individual starship component props.

```typescript
interface StarshipModelProps {
  config: StarshipConfig; // Starship configuration
  animationState: AnimationState; // Current animation state
  onLoaded?: () => void; // Model loaded callback
  onError?: (error: Error) => void; // Error callback
  debugMode?: boolean; // Show debug helpers
}
```

## Default Configurations

### Starship Model Mappings

Default configurations for the 6 available GLB models.

```typescript
const DEFAULT_STARSHIP_CONFIGS: StarshipConfig[] = [
  {
    id: "xwing",
    name: "X-wing Fighter",
    modelPath: "/src/assets/3d-model/Lego glb models/X-wing.glb",
    scale: [0.8, 0.8, 0.8],
    initialRotation: [0, Math.PI / 4, 0],
    speed: { min: 0.5, max: 1.2 },
    trajectory: "linear",
    spawnZone: {
      entry: [-10, 2, 5],
      exit: [10, -2, -5],
      variation: 3,
    },
  },
  {
    id: "star-destroyer",
    name: "Star Destroyer",
    modelPath: "/src/assets/3d-model/Lego glb models/Star Destroyer.glb",
    scale: [1.5, 1.5, 1.5],
    initialRotation: [0, 0, 0],
    speed: { min: 0.2, max: 0.6 },
    trajectory: "linear",
    spawnZone: {
      entry: [12, 0, 8],
      exit: [-12, 0, -8],
      variation: 2,
    },
  },
  // Additional configs for other models...
];
```

## State Management

### Animation Loop State

Global state for managing the animation system.

```typescript
interface AnimationLoopState {
  instances: StarshipInstance[]; // Active starship instances
  lastSpawn: number; // Last spawn timestamp
  frameRate: number; // Current FPS
  isRunning: boolean; // Animation loop active
  performanceMode: "high" | "medium" | "low"; // Performance level
}
```

### Debug State

State for debug mode controls.

```typescript
interface DebugState {
  selectedStarship?: string; // Currently selected starship ID
  showBoundingBoxes: boolean; // Show collision boxes
  showTrajectories: boolean; // Show movement paths
  showPerformanceStats: boolean; // Show FPS and memory usage
  configOverrides: Partial<StarshipConfig>[]; // Runtime config changes
}
```

## Validation Rules

### StarshipConfig Validation

- `scale` values must be positive numbers
- `modelPath` must be a valid file path
- `speed.min` must be less than `speed.max`
- `spawnZone.variation` must be non-negative

### Performance Constraints

- Maximum 8 concurrent starship instances on desktop
- Maximum 4 concurrent starship instances on mobile
- Model file size should not exceed 2MB per GLB
- Animation frame rate maintained above 30fps

## Integration Points

### React Three Fiber Integration

- Uses `useGLTF` for model loading
- Integrates with `useFrame` for animation updates
- Supports `Suspense` boundaries for loading states

### Theme Integration

- Respects current theme for debug UI
- Background opacity adapts to light/dark mode
- Debug controls use existing UI components

### Responsive Behavior

- Model count reduces on smaller screens
- Touch controls for debug mode on mobile
- Adaptive quality based on device performance
