# StarshipBackground Component

A React component that renders an animated 3D Star Wars starship background using Three.js and React Three Fiber. Features memory leak prevention, adaptive performance optimization, and comprehensive error handling.

## Features

- 🚀 **3D Starship Animations**: Multiple Star Wars starships with realistic flight patterns
- 📱 **Responsive Design**: Automatically adapts to mobile devices with reduced complexity
- 🧠 **Memory Management**: Automatic cleanup of Three.js resources to prevent memory leaks
- ⚡ **Performance Optimization**: Adaptive quality adjustment based on FPS and memory usage
- 🛡️ **Error Boundaries**: Comprehensive error handling with fallback UI
- 🔧 **Debug Mode**: Development tools for performance monitoring and controls
- 🎯 **TypeScript Support**: Full TypeScript definitions included

## Installation

```bash
npm install @react-three/fiber @react-three/drei three
```

## Basic Usage

```tsx
import React from "react";
import StarshipBackground from "./components/StarshipBackground";

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <StarshipBackground />
    </div>
  );
}
```

## Advanced Usage

```tsx
import React from "react";
import StarshipBackground from "./components/StarshipBackground";
import { DEFAULT_STARSHIP_CONFIGS } from "./components/StarshipBackground/starshipConfigs";

function AdvancedExample() {
  const handleStarshipClick = (instanceId: string) => {
    console.log("Starship clicked:", instanceId);
  };

  const handleLoadingChange = (isLoading: boolean) => {
    console.log("Loading state changed:", isLoading);
  };

  const handleError = (error: Error) => {
    console.error("Starship background error:", error);
  };

  return (
    <StarshipBackground
      configs={DEFAULT_STARSHIP_CONFIGS}
      maxConcurrent={4}
      debugMode={process.env.NODE_ENV === "development"}
      backgroundOpacity={0.2}
      className="custom-background"
      onStarshipClick={handleStarshipClick}
      onLoadingChange={handleLoadingChange}
      onError={handleError}
    />
  );
}
```

## Props API

| Prop                | Type                           | Default                    | Description                                              |
| ------------------- | ------------------------------ | -------------------------- | -------------------------------------------------------- |
| `configs`           | `StarshipConfig[]`             | `DEFAULT_STARSHIP_CONFIGS` | Array of starship configurations to use                  |
| `maxConcurrent`     | `number`                       | `6`                        | Maximum number of starships to render simultaneously     |
| `debugMode`         | `boolean`                      | `false`                    | Enable debug overlay with performance stats and controls |
| `backgroundOpacity` | `number`                       | `0.3`                      | Background opacity (0-1)                                 |
| `className`         | `string`                       | `""`                       | Additional CSS classes                                   |
| `onStarshipClick`   | `(instanceId: string) => void` | `undefined`                | Callback when a starship is clicked (debug mode only)    |
| `onLoadingChange`   | `(isLoading: boolean) => void` | `undefined`                | Callback when loading state changes                      |
| `onError`           | `(error: Error) => void`       | `undefined`                | Callback when an error occurs                            |

## Performance Guidelines

### Memory Management

The component automatically manages memory usage to prevent leaks:

- **Three.js Resource Cleanup**: All geometries, materials, and textures are properly disposed on unmount
- **Memory Monitoring**: Tracks heap usage and adjusts quality automatically
- **Adaptive Quality**: Reduces concurrent starships when memory usage exceeds thresholds:
  - Warning: >80MB used heap
  - Critical: >100MB used heap
  - Emergency: >120MB used heap (reduces to 1 concurrent ship)

### Performance Optimization

- **Mobile Optimization**: Automatically reduces complexity on screens <768px wide
- **FPS Monitoring**: Maintains target 60 FPS with automatic quality adjustment
- **Model Preloading**: All GLTF models are preloaded to prevent runtime stalls
- **Efficient Rendering**: Uses instanced rendering where possible

### Recommended Settings

```tsx
// Production settings
<StarshipBackground
  maxConcurrent={6}        // Default for desktop
  backgroundOpacity={0.3}  // Subtle background
  debugMode={false}        // Disable in production
/>

// Mobile settings (handled automatically)
<StarshipBackground
  maxConcurrent={3}        // Reduced for mobile
/>

// Low-end devices
<StarshipBackground
  maxConcurrent={2}        // Minimal for performance
  backgroundOpacity={0.1}  // More transparent
/>
```

## Configuration

### Starship Configs

Each starship is configured with:

```typescript
interface StarshipConfig {
  id: string;
  name: string;
  modelPath: string;
  scale: number;
  speed: number;
  rotationSpeed: number;
  spawnRate: number;
  flightPattern: "patrol" | "random" | "formation";
}
```

### Default Configurations

The component includes several pre-configured starships:

- **X-Wing Fighter**: Fast, agile fighter craft
- **TIE Fighter**: Imperial fighter with patrol patterns
- **Star Destroyer**: Large capital ship with slow, majestic movement
- **Millennium Falcon**: Iconic smuggler ship with unique flight patterns

## Error Handling

The component includes comprehensive error boundaries:

- **Model Loading Errors**: Graceful fallback when GLTF models fail to load
- **WebGL Errors**: Detection of WebGL context loss and recovery
- **Memory Errors**: Automatic quality reduction when memory limits are reached
- **Animation Errors**: Safe cleanup when animation loops fail

## Debug Mode

Enable debug mode to access development features:

```tsx
<StarshipBackground debugMode={true} />
```

Debug features include:

- **Performance Stats**: Real-time FPS, frame time, and active ship count
- **Spawn Controls**: Manually spawn specific starship types
- **Instance Management**: Remove individual starships
- **Error Logging**: Detailed error information in console

## Browser Support

- **Modern Browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **WebGL Required**: Browsers must support WebGL 2.0
- **Mobile**: iOS Safari 14+, Chrome Mobile 88+

## Troubleshooting

### Common Issues

**Black screen on load:**

- Check browser WebGL support
- Ensure Three.js dependencies are installed
- Verify GLTF model paths are correct

**Poor performance:**

- Reduce `maxConcurrent` prop
- Check browser developer tools for memory leaks
- Ensure adequate GPU memory

**Memory warnings:**

- Component automatically reduces quality
- Check for other memory-intensive components on the page
- Consider reducing `backgroundOpacity`

### Performance Monitoring

Use the debug overlay to monitor:

- FPS (target: 60+)
- Frame time (<16.67ms for 60 FPS)
- Active instances (keep below maxConcurrent)
- Memory usage (monitor heap growth)

## Testing

The component includes comprehensive tests for:

- Memory leak prevention
- Resource cleanup verification
- Performance monitoring
- Error boundary functionality
- Responsive behavior

Run tests with:

```bash
npm test src/components/StarshipBackground/__tests__/
```

## Dependencies

- `react`: ^18.0.0
- `@react-three/fiber`: ^8.0.0
- `@react-three/drei`: ^9.0.0
- `three`: ^0.150.0

## License

This component is part of the evolution-path project.
