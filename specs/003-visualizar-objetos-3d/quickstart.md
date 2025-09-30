# Quickstart Guide: Star Wars Starship Background

## Overview

This guide walks through implementing and integrating the animated Star Wars starship background component into your React application.

## Prerequisites

- React 18.3.1+ with TypeScript
- @react-three/fiber and @react-three/drei installed
- GLB model files in `src/assets/3d-model/Lego glb models/`

## Installation & Setup

### 1. Install Dependencies

```bash
npm install @react-three/fiber @react-three/drei three
npm install --save-dev @types/three
```

### 2. Verify Model Assets

Ensure the following GLB files exist in your assets folder:

```
src/assets/3d-model/Lego glb models/
├── First Order Star Destroyer.glb
├── Imperial Shuttle.glb
├── Micro Millennium Falcon.glb
├── small venator class star destroyer.glb
├── Star Destroyer.glb
└── X-wing.glb
```

## Quick Implementation

### 1. Basic Usage

```tsx
// In your page component
import React from "react";
import StarshipBackground from "../components/StarshipBackground";

export default function MyPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background layer */}
      <StarshipBackground maxConcurrent={4} backgroundOpacity={0.3} />

      {/* Your page content */}
      <div className="relative z-10">
        <h1>Your content here</h1>
      </div>
    </div>
  );
}
```

### 2. With Debug Mode (Development Only)

```tsx
import React from "react";
import StarshipBackground from "../components/StarshipBackground";

export default function StarshipDemo() {
  return (
    <div className="min-h-screen bg-black">
      <StarshipBackground
        debugMode={process.env.NODE_ENV === "development"}
        maxConcurrent={6}
        onStarshipClick={(id) => console.log("Clicked:", id)}
        onError={(error) => console.error("Starship error:", error)}
      />
    </div>
  );
}
```

### 3. Custom Configuration

```tsx
import React from "react";
import StarshipBackground from "../components/StarshipBackground";
import type { StarshipConfig } from "../components/StarshipBackground/types";

const customConfigs: StarshipConfig[] = [
  {
    id: "custom-xwing",
    name: "Fast X-wing",
    modelPath: "/src/assets/3d-model/Lego glb models/X-wing.glb",
    scale: [1.2, 1.2, 1.2],
    initialRotation: [0, Math.PI / 2, 0],
    speed: { min: 1.0, max: 2.0, rotationSpeed: 0.2 },
    trajectory: "diagonal",
    spawnZone: {
      entry: [-15, 5, 8],
      exit: [15, -5, -8],
      variation: 4,
    },
  },
];

export default function CustomStarshipPage() {
  return <StarshipBackground configs={customConfigs} maxConcurrent={3} />;
}
```

## Development Workflow

### Phase 1: Create Demo Page

1. Create `src/pages/StarshipDemo.tsx`
2. Add route to your router configuration
3. Test basic rendering and model loading

### Phase 2: Debug and Configure

1. Enable debug mode in StarshipDemo
2. Adjust individual starship configurations
3. Test performance with different model counts
4. Export final configurations

### Phase 3: Integration

1. Replace background in main pages
2. Disable debug mode for production
3. Optimize performance settings
4. Add loading states and error handling

## Configuration Guide

### Understanding StarshipConfig

```typescript
interface StarshipConfig {
  id: string; // Unique identifier
  name: string; // Display name for debug
  modelPath: string; // Path to GLB file
  scale: [number, number, number]; // [x, y, z] scale multipliers
  initialRotation: [number, number, number]; // [x, y, z] in radians
  speed: {
    min: number; // Minimum movement speed
    max: number; // Maximum movement speed
    rotationSpeed?: number; // Rotation while moving (optional)
  };
  trajectory: "linear" | "curved" | "spiral" | "diagonal";
  spawnZone: {
    entry: [number, number, number]; // Where starship appears
    exit: [number, number, number]; // Where starship disappears
    variation: number; // Random position variation
  };
}
```

### Common Configuration Patterns

#### Small Fighter (X-wing, TIE Fighter)

```typescript
{
  scale: [0.8, 0.8, 0.8],
  speed: { min: 0.8, max: 1.5, rotationSpeed: 0.15 },
  trajectory: 'linear',
  spawnZone: { variation: 3 }
}
```

#### Large Capital Ship (Star Destroyer)

```typescript
{
  scale: [1.5, 1.5, 1.5],
  speed: { min: 0.3, max: 0.7, rotationSpeed: 0.05 },
  trajectory: 'linear',
  spawnZone: { variation: 2 }
}
```

#### Transport (Imperial Shuttle)

```typescript
{
  scale: [1.0, 1.0, 1.0],
  speed: { min: 0.5, max: 1.0, rotationSpeed: 0.1 },
  trajectory: 'curved',
  spawnZone: { variation: 4 }
}
```

## Performance Optimization

### Recommended Settings by Device

```typescript
// Desktop
<StarshipBackground
  maxConcurrent={6}
  backgroundOpacity={0.4}
/>

// Mobile
<StarshipBackground
  maxConcurrent={3}
  backgroundOpacity={0.2}
/>

// Low-end devices
<StarshipBackground
  maxConcurrent={2}
  backgroundOpacity={0.1}
/>
```

### Performance Monitoring

```tsx
function PerformanceAwareBackground() {
  const [maxConcurrent, setMaxConcurrent] = useState(6);

  const handlePerformanceDrop = useCallback(
    (fps: number) => {
      if (fps < 30 && maxConcurrent > 2) {
        setMaxConcurrent((prev) => Math.max(2, prev - 1));
      }
    },
    [maxConcurrent]
  );

  return (
    <StarshipBackground
      maxConcurrent={maxConcurrent}
      onPerformanceChange={handlePerformanceDrop}
    />
  );
}
```

## Troubleshooting

### Common Issues

#### Models Not Loading

```bash
# Check file paths are correct
ls src/assets/3d-model/Lego\ glb\ models/
```

#### Performance Issues

- Reduce `maxConcurrent` prop
- Lower `backgroundOpacity`
- Check browser console for WebGL warnings

#### Animation Stuttering

- Verify 60fps in debug mode
- Reduce model complexity or count
- Check for memory leaks in dev tools

### Debug Mode Controls

#### Enable Debug Overlay

```tsx
<StarshipBackground debugMode={true} />
```

Debug overlay provides:

- Real-time FPS and memory usage
- Individual starship selection and configuration
- Trajectory visualization
- Performance warnings
- Configuration export functionality

#### Export Configuration

1. Enable debug mode
2. Adjust starship positions/rotations
3. Click "Export Config" button
4. Copy generated JSON to your configuration file

## Testing

### Basic Functionality Test

```tsx
// src/components/StarshipBackground/__tests__/StarshipBackground.test.tsx
import { render, screen } from "@testing-library/react";
import StarshipBackground from "../StarshipBackground";

test("renders without crashing", () => {
  render(<StarshipBackground />);
  expect(screen.getByRole("canvas")).toBeInTheDocument();
});

test("respects maxConcurrent prop", () => {
  const { rerender } = render(<StarshipBackground maxConcurrent={2} />);
  // Test that only 2 models are rendered simultaneously
});
```

### Integration Test

```tsx
test("integrates with existing page layout", () => {
  render(
    <div className="relative">
      <StarshipBackground />
      <div className="relative z-10">Content</div>
    </div>
  );

  expect(screen.getByText("Content")).toBeVisible();
});
```

## Next Steps

1. **Create Demo Page**: Implement StarshipDemo.tsx for testing
2. **Configure Models**: Use debug mode to set up each starship
3. **Performance Testing**: Test on various devices and browsers
4. **Integration**: Replace existing backgrounds
5. **Production**: Disable debug mode and optimize settings

## Support

For issues or questions:

1. Check browser console for WebGL errors
2. Verify model file integrity
3. Test with reduced `maxConcurrent` values
4. Enable debug mode to inspect configurations

The component is designed to gracefully handle errors and performance limitations, automatically adapting to device capabilities while maintaining a smooth user experience.
