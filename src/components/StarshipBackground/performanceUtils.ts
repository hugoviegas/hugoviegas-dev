import type { PerformanceStats, PerformanceError } from "./types";

/**
 * Performance monitoring utilities for StarshipBackground.
 * Tracks FPS, memory usage, and provides optimization recommendations.
 */
export class PerformanceMonitor {
  private fpsHistory: number[] = [];
  private frameTimeHistory: number[] = [];
  private memoryHistory: number[] = [];
  private lastFrameTime = performance.now();
  private frameCount = 0;

  // Performance thresholds
  private readonly TARGET_FPS = 60;
  private readonly MIN_FPS = 30;
  private readonly MAX_FRAME_TIME = 16.67; // ~60fps
  private readonly HISTORY_SIZE = 60; // 1 second at 60fps

  /**
   * Update performance metrics with current frame data
   */
  update(currentTime: number): PerformanceStats {
    this.frameCount++;

    // Calculate FPS
    const timeDiff = currentTime - this.lastFrameTime;
    if (timeDiff >= 1000) {
      // Update every second
      const fps = (this.frameCount / timeDiff) * 1000;
      this.fpsHistory.push(fps);
      if (this.fpsHistory.length > this.HISTORY_SIZE) {
        this.fpsHistory.shift();
      }

      // Reset counters
      this.frameCount = 0;
      this.lastFrameTime = currentTime;
    }

    // Calculate frame time
    const frameTime = timeDiff / Math.max(this.frameCount, 1);
    this.frameTimeHistory.push(frameTime);
    if (this.frameTimeHistory.length > this.HISTORY_SIZE) {
      this.frameTimeHistory.shift();
    }

    // Get memory usage if available
    const memoryInfo = this.getMemoryInfo();
    if (memoryInfo.usedJSHeapSize) {
      this.memoryHistory.push(memoryInfo.usedJSHeapSize);
      if (this.memoryHistory.length > this.HISTORY_SIZE) {
        this.memoryHistory.shift();
      }
    }

    const avgFps =
      this.fpsHistory.length > 0
        ? this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length
        : this.TARGET_FPS;

    const avgFrameTime =
      this.frameTimeHistory.length > 0
        ? this.frameTimeHistory.reduce((a, b) => a + b, 0) /
          this.frameTimeHistory.length
        : this.MAX_FRAME_TIME;

    return {
      fps: Math.round(avgFps),
      frameTime: Math.round(avgFrameTime * 100) / 100,
      activeInstances: 0, // This will be set by the hook
    };
  }

  /**
   * Get current FPS
   */
  getCurrentFPS(): number {
    return this.fpsHistory.length > 0
      ? this.fpsHistory[this.fpsHistory.length - 1]
      : this.TARGET_FPS;
  }

  /**
   * Get average frame time over the last second
   */
  getAverageFrameTime(): number {
    if (this.frameTimeHistory.length === 0) return this.MAX_FRAME_TIME;
    return (
      this.frameTimeHistory.reduce((a, b) => a + b, 0) /
      this.frameTimeHistory.length
    );
  }

  /**
   * Get memory usage information
   */
  getMemoryUsage(): MemoryInfo {
    return this.getMemoryInfo();
  }

  /**
   * Check if performance is below acceptable thresholds
   */
  isPerformanceDegraded(): boolean {
    const currentFps = this.getCurrentFPS();
    const avgFrameTime = this.getAverageFrameTime();

    return currentFps < this.MIN_FPS || avgFrameTime > this.MAX_FRAME_TIME * 2;
  }

  /**
   * Get performance optimization suggestions
   */
  getOptimizationSuggestions(): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    const currentFps = this.getCurrentFPS();
    const memoryUsage = this.getMemoryUsage();

    if (currentFps < this.MIN_FPS) {
      suggestions.push({
        type: "reduce_instances",
        severity: currentFps < 20 ? "high" : "medium",
        description: `FPS is ${currentFps}, below minimum threshold of ${this.MIN_FPS}`,
        impact: "Reduce the number of concurrent starship instances",
        implementation: () => {
          // This would be implemented in the main component
          console.log("Reduce maxConcurrent prop");
        },
      });
    }

    if (
      memoryUsage.usedJSHeapSize &&
      memoryUsage.usedJSHeapSize > 50 * 1024 * 1024
    ) {
      // 50MB
      suggestions.push({
        type: "memory_cleanup",
        severity: "medium",
        description: `Memory usage is high: ${(
          memoryUsage.usedJSHeapSize /
          1024 /
          1024
        ).toFixed(1)}MB`,
        impact: "Force garbage collection and reduce model complexity",
        implementation: () => {
          if (window.gc) window.gc(); // Manual GC if available
        },
      });
    }

    return suggestions;
  }

  /**
   * Reset performance monitoring data
   */
  reset(): void {
    this.fpsHistory = [];
    this.frameTimeHistory = [];
    this.memoryHistory = [];
    this.frameCount = 0;
    this.lastFrameTime = performance.now();
  }

  /**
   * Get browser memory information
   */
  private getMemoryInfo(): MemoryInfo {
    // TypeScript doesn't have built-in memory info types
    const memInfo = (
      performance as {
        memory?: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      }
    ).memory;
    if (memInfo) {
      return {
        usedJSHeapSize: memInfo.usedJSHeapSize,
        totalJSHeapSize: memInfo.totalJSHeapSize,
        jsHeapSizeLimit: memInfo.jsHeapSizeLimit,
      };
    }

    return {
      usedJSHeapSize: 0,
      totalJSHeapSize: 0,
      jsHeapSizeLimit: 0,
    };
  }
}

/**
 * Memory information interface
 */
export interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  textureMemory?: number;
  geometryMemory?: number;
}

/**
 * Optimization suggestion interface
 */
export interface OptimizationSuggestion {
  type:
    | "reduce_instances"
    | "lower_quality"
    | "memory_cleanup"
    | "adjust_spawn_rate";
  severity: "low" | "medium" | "high";
  description: string;
  impact: string;
  implementation?: () => void;
}

/**
 * Performance error detection
 */
export function detectPerformanceError(
  stats: PerformanceStats
): PerformanceError | null {
  if (stats.fps < 20) {
    return {
      type: "performance_error",
      metric: "fps",
      value: stats.fps,
      threshold: 20,
      message: `FPS dropped to ${stats.fps}, below critical threshold`,
    };
  }

  if (stats.frameTime > 50) {
    // 20fps equivalent
    return {
      type: "performance_error",
      metric: "frameTime",
      value: stats.frameTime,
      threshold: 50,
      message: `Frame time is ${stats.frameTime}ms, causing poor performance`,
    };
  }

  return null;
}

/**
 * Adaptive quality adjustment based on performance
 */
export function calculateAdaptiveQuality(
  currentStats: PerformanceStats,
  currentMaxConcurrent: number
): number {
  const targetFps = 50;
  const minConcurrent = 2;

  if (currentStats.fps > targetFps && currentMaxConcurrent < 6) {
    // Performance is good, can increase
    return Math.min(6, currentMaxConcurrent + 1);
  } else if (currentStats.fps < 30 && currentMaxConcurrent > minConcurrent) {
    // Performance is poor, reduce
    return Math.max(minConcurrent, currentMaxConcurrent - 1);
  }

  return currentMaxConcurrent;
}

/**
 * Singleton performance monitor instance
 */
export const performanceMonitor = new PerformanceMonitor();
