# Component Contracts: StarshipBackground

## StarshipBackground Component Contract

### Purpose

Main background component that renders animated Star Wars starships using 3D models.

### Interface

```typescript
interface StarshipBackgroundProps {
  configs?: StarshipConfig[]; // Custom starship configurations
  maxConcurrent?: number; // Maximum concurrent animations (default: 6)
  debugMode?: boolean; // Enable debug controls (default: false)
  backgroundOpacity?: number; // Background transparency (0-1, default: 0.3)
  className?: string; // Additional CSS classes
  onStarshipClick?: (id: string) => void; // Click handler for debug mode
  onLoadingChange?: (loading: boolean) => void; // Loading state callback
  onError?: (error: Error) => void; // Error callback
}
```

### Behavior Contract

- **Rendering**: Must render as full viewport background overlay
- **Performance**: Must maintain >30fps with up to 6 concurrent models
- **Loading**: Must show loading state while models are being fetched
- **Error Handling**: Must gracefully handle model loading failures
- **Responsiveness**: Must adapt model count based on screen size
- **Cleanup**: Must properly dispose Three.js resources on unmount

### State Management

- Manages internal animation loop using `useFrame`
- Tracks active starship instances and their positions
- Handles spawning and despawning based on visibility
- Maintains performance metrics in debug mode

## StarshipModel Component Contract

### Purpose

Individual starship 3D model with animation state management.

### Interface

```typescript
interface StarshipModelProps {
  config: StarshipConfig; // Starship configuration
  animationState: AnimationState; // Current animation state
  onLoaded?: () => void; // Model loaded callback
  onError?: (error: Error) => void; // Error callback
  debugMode?: boolean; // Show debug helpers
  onClick?: () => void; // Click handler
}
```

### Behavior Contract

- **Model Loading**: Must load GLB model using `useGLTF`
- **Animation**: Must update position/rotation based on animationState
- **Debug Mode**: Must show bounding boxes and trajectory paths when enabled
- **Click Detection**: Must support raycasting for click interactions
- **Performance**: Must implement frustum culling for off-screen models

## useStarshipAnimation Hook Contract

### Purpose

Custom hook for managing starship animation logic and state.

### Interface

```typescript
function useStarshipAnimation(
  configs: StarshipConfig[],
  maxConcurrent: number,
  debugMode: boolean
): {
  instances: StarshipInstance[];
  spawnStarship: (configId: string) => void;
  removeStarship: (instanceId: string) => void;
  updateInstance: (
    instanceId: string,
    updates: Partial<AnimationState>
  ) => void;
  performanceStats: PerformanceStats;
};
```

### Behavior Contract

- **Instance Management**: Must create/destroy starship instances
- **Animation Updates**: Must update positions using requestAnimationFrame
- **Spawn Logic**: Must randomly spawn new starships based on timing
- **Cleanup**: Must remove off-screen starships
- **Performance**: Must track FPS and memory usage

## Debug Controls Component Contract

### Purpose

Developer interface for configuring starship positions and animations.

### Interface

```typescript
interface DebugControlsProps {
  instances: StarshipInstance[];
  onConfigChange: (instanceId: string, config: Partial<StarshipConfig>) => void;
  onExportConfig: () => void;
  onToggleTrajectories: () => void;
  onToggleStats: () => void;
}
```

### Behavior Contract

- **Configuration**: Must provide controls for position, rotation, scale
- **Real-time Updates**: Must update models as user adjusts values
- **Export**: Must generate copyable configuration JSON
- **Visual Aids**: Must show/hide trajectories and bounding boxes

## Model Configuration Contract

### Purpose

Standardized configuration format for different starship models.

### Schema Validation

```typescript
const StarshipConfigSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  modelPath: z.string().regex(/\.glb$/),
  scale: z.tuple([
    z.number().positive(),
    z.number().positive(),
    z.number().positive(),
  ]),
  initialRotation: z.tuple([z.number(), z.number(), z.number()]),
  speed: z
    .object({
      min: z.number().positive(),
      max: z.number().positive(),
      rotationSpeed: z.number().optional(),
    })
    .refine((data) => data.min < data.max),
  trajectory: z.enum(["linear", "curved", "spiral", "diagonal"]),
  spawnZone: z.object({
    entry: z.tuple([z.number(), z.number(), z.number()]),
    exit: z.tuple([z.number(), z.number(), z.number()]),
    variation: z.number().nonnegative(),
  }),
});
```

### Behavior Contract

- **Validation**: Must validate all configurations on load
- **Defaults**: Must provide sensible defaults for missing values
- **Persistence**: Must support saving/loading custom configurations

## Error Handling Contract

### Loading Errors

- Model file not found → Show fallback message, continue with other models
- Invalid GLB format → Log error, skip model, show debug info if enabled
- Network timeout → Retry once, then fallback

### Runtime Errors

- Animation loop errors → Pause animations, show error state
- Memory issues → Reduce concurrent models, log warning
- Performance drops → Automatically reduce quality/count

### Debug Error States

- Invalid configuration → Highlight errors in debug panel
- Animation conflicts → Show warning indicators
- Performance warnings → Display FPS/memory alerts

## Testing Contract

### Unit Tests Required

- StarshipConfig validation
- Animation state updates
- Model loading error handling
- Performance metric calculation

### Integration Tests Required

- Full background rendering
- Model spawning/despawning
- Debug controls functionality
- Responsive behavior

### Performance Tests Required

- Frame rate under maximum load
- Memory usage with all models
- Loading time benchmarks
- Mobile device compatibility
