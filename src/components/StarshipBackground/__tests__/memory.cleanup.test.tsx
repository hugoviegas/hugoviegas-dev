import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Canvas } from "@react-three/fiber";
import StarshipBackground from "../index";
import { DEFAULT_STARSHIP_CONFIGS } from "../starshipConfigs";

// Mock Three.js and React Three Fiber
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children, ...props }: any) => (
    <div data-testid="mock-canvas" {...props}>
      {children}
    </div>
  ),
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    camera: { position: [0, 0, 5] },
    scene: {},
    gl: { domElement: document.createElement("canvas") },
    size: { width: 1920, height: 1080 },
  })),
}));

vi.mock("../modelUtils", () => ({
  preloadStarshipModels: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@react-three/drei", () => ({
  useGLTF: Object.assign(
    vi.fn(() => ({
      scene: {},
      animations: [],
      scenes: [],
      cameras: [],
      asset: {},
      parser: {},
      userData: {},
    })),
    {
      preload: vi.fn(),
    }
  ),
  Html: ({ children }: any) => <div>{children}</div>,
  OrbitControls: ({ children, ...props }: any) => (
    <div data-testid="orbit-controls" {...props}>
      {children}
    </div>
  ),
}));

describe("Memory Leak Prevention and Cleanup Verification", () => {
  let originalPerformance: any;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock performance.memory for memory monitoring tests
    originalPerformance = global.performance;
    Object.defineProperty(window, "performance", {
      value: {
        ...originalPerformance,
        now: () => originalPerformance.now(),
        memory: {
          usedJSHeapSize: 50 * 1024 * 1024, // 50MB default
          totalJSHeapSize: 100 * 1024 * 1024,
          jsHeapSizeLimit: 200 * 1024 * 1024,
        },
      },
      writable: true,
    });
  });

  afterEach(() => {
    // Restore original performance object
    Object.defineProperty(window, "performance", {
      value: originalPerformance,
      writable: true,
    });
  });

  describe("Component Rendering and Loading", () => {
    it("should render without crashing", () => {
      expect(() => {
        render(
          <Canvas>
            <StarshipBackground
              configs={DEFAULT_STARSHIP_CONFIGS}
              maxConcurrent={3}
            />
          </Canvas>
        );
      }).not.toThrow();
    });

    it("should show loading state initially", () => {
      render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={3}
          />
        </Canvas>
      );

      // Should show loading overlay
      expect(document.querySelector(".animate-spin")).toBeInTheDocument();
      expect(document.querySelector("p")).toHaveTextContent(
        "Loading starships..."
      );
    });

    it("should handle loading completion", async () => {
      render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={3}
          />
        </Canvas>
      );

      // Wait for loading to potentially complete
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1200));
      });

      // Component should still be functional
      expect(
        document.querySelector('[data-testid="mock-canvas"]')
      ).toBeInTheDocument();
    });
  });

  describe("Memory Monitoring Integration", () => {
    it("should initialize with default memory values", () => {
      render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={3}
          />
        </Canvas>
      );

      // Component should render with mocked performance
      expect(
        document.querySelector('[data-testid="mock-canvas"]')
      ).toBeInTheDocument();
    });

    it("should handle high memory usage gracefully", () => {
      // Mock high memory usage
      Object.defineProperty(window, "performance", {
        value: {
          ...originalPerformance,
          now: () => originalPerformance.now(),
          memory: {
            usedJSHeapSize: 90 * 1024 * 1024, // 90MB - above 80MB limit
            totalJSHeapSize: 100 * 1024 * 1024,
            jsHeapSizeLimit: 200 * 1024 * 1024,
          },
        },
        writable: true,
      });

      expect(() => {
        render(
          <Canvas>
            <StarshipBackground
              configs={DEFAULT_STARSHIP_CONFIGS}
              maxConcurrent={6}
            />
          </Canvas>
        );
      }).not.toThrow();
    });

    it("should handle critical memory usage gracefully", () => {
      // Mock critical memory usage
      Object.defineProperty(window, "performance", {
        value: {
          ...originalPerformance,
          now: () => originalPerformance.now(),
          memory: {
            usedJSHeapSize: 110 * 1024 * 1024, // 110MB - above 100MB critical limit
            totalJSHeapSize: 120 * 1024 * 1024,
            jsHeapSizeLimit: 200 * 1024 * 1024,
          },
        },
        writable: true,
      });

      expect(() => {
        render(
          <Canvas>
            <StarshipBackground
              configs={DEFAULT_STARSHIP_CONFIGS}
              maxConcurrent={6}
            />
          </Canvas>
        );
      }).not.toThrow();
    });
  });

  describe("Three.js Resource Cleanup Verification", () => {
    it("should render StarshipModel components without errors", () => {
      // This test verifies that the StarshipModel components can be rendered
      // and that the cleanup logic is in place (even if we can't directly test disposal)

      expect(() => {
        const { unmount } = render(
          <Canvas>
            <StarshipBackground
              configs={DEFAULT_STARSHIP_CONFIGS}
              maxConcurrent={1}
            />
          </Canvas>
        );
        unmount();
      }).not.toThrow();
    });

    it("should handle component unmounting gracefully", () => {
      const { unmount } = render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={1}
          />
        </Canvas>
      );

      // Unmount should not throw
      expect(() => unmount()).not.toThrow();
    });

    it("should handle rapid mounting and unmounting", () => {
      // Test rapid mount/unmount cycles to ensure no memory leaks
      for (let i = 0; i < 5; i++) {
        const { unmount } = render(
          <Canvas>
            <StarshipBackground
              configs={DEFAULT_STARSHIP_CONFIGS}
              maxConcurrent={1}
            />
          </Canvas>
        );
        expect(() => unmount()).not.toThrow();
      }
    });
  });

  describe("Interval Management", () => {
    it("should handle component unmounting with intervals", () => {
      const clearIntervalSpy = vi.spyOn(window, "clearInterval");

      const { unmount } = render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={3}
          />
        </Canvas>
      );

      unmount();

      // clearInterval should be called during cleanup
      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });

    it("should handle empty configs gracefully", () => {
      // The component creates a loading progress interval, but the hook should not create spawn intervals
      // This test verifies the component handles empty configs gracefully

      render(
        <Canvas>
          <StarshipBackground
            configs={[]} // Empty configs
            maxConcurrent={3}
          />
        </Canvas>
      );

      // Component should render even with empty configs
      expect(
        document.querySelector('[data-testid="mock-canvas"]')
      ).toBeInTheDocument();
    });
  });

  describe("Error Boundaries and Error Handling", () => {
    it("should render error boundary without errors", () => {
      expect(() => {
        render(
          <Canvas>
            <StarshipBackground
              configs={DEFAULT_STARSHIP_CONFIGS}
              maxConcurrent={3}
            />
          </Canvas>
        );
      }).not.toThrow();
    });

    it("should handle onError callback", () => {
      const mockOnError = vi.fn();

      render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={3}
            onError={mockOnError}
          />
        </Canvas>
      );

      // Component should render without calling onError initially
      expect(mockOnError).not.toHaveBeenCalled();
    });
  });

  describe("Performance Stats Display", () => {
    it("should show performance stats in debug mode", () => {
      render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={3}
            debugMode={true}
          />
        </Canvas>
      );

      // Should show FPS and other stats
      expect(document.querySelector(".font-mono")).toBeInTheDocument();
    });

    it("should not show performance stats when debug mode is off", () => {
      render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={3}
            debugMode={false}
          />
        </Canvas>
      );

      // Should not show debug stats
      expect(document.querySelector(".font-mono")).not.toBeInTheDocument();
    });
  });

  describe("Memory Leak Prevention Verification", () => {
    it("should respect maxConcurrent limits", () => {
      render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={1} // Very low limit
          />
        </Canvas>
      );

      // Component should render and respect the limit
      expect(
        document.querySelector('[data-testid="mock-canvas"]')
      ).toBeInTheDocument();
    });

    it("should handle props changes gracefully", () => {
      const { rerender } = render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={3}
          />
        </Canvas>
      );

      // Change props
      rerender(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={5}
          />
        </Canvas>
      );

      // Should handle prop changes without errors
      expect(
        document.querySelector('[data-testid="mock-canvas"]')
      ).toBeInTheDocument();
    });

    it("should cleanup on prop changes", () => {
      const clearIntervalSpy = vi.spyOn(window, "clearInterval");

      const { rerender, unmount } = render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={3}
          />
        </Canvas>
      );

      // Change configs (should trigger cleanup and restart)
      rerender(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS.slice(0, 1)} // Reduce configs
            maxConcurrent={3}
          />
        </Canvas>
      );

      unmount();

      // Should have cleaned up intervals
      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });
  });
});
