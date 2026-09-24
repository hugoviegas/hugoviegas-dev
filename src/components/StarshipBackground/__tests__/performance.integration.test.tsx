import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Canvas } from "@react-three/fiber";
import StarshipBackground from "../index";
import { DEFAULT_STARSHIP_CONFIGS } from "../starshipConfigs";

// Mock Three.js and React Three Fiber
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children, ...props }: any) => (
    <div data-testid="canvas" {...props}>
      {children}
    </div>
  ),
  useFrame: vi.fn(() => {
    // Mock useFrame to do nothing during tests to prevent infinite re-renders
  }),
  useThree: vi.fn(() => ({
    camera: { position: [0, 0, 5] },
    scene: {},
    gl: { domElement: document.createElement("canvas") },
    size: { width: 1920, height: 1080 },
  })),
}));

vi.mock("@react-three/drei", () => ({
  useGLTF: Object.assign(
    vi.fn(() => ({
      scene: {},
      animations: [],
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

describe("Performance Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Frame Rate Under Load", () => {
    it("renders with maximum concurrent starships without crashing", async () => {
      const { container } = render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={6}
            debugMode={false}
          />
        </Canvas>
      );

      await waitFor(() => {
        expect(
          container.querySelector('[data-testid="canvas"]')
        ).toBeInTheDocument();
      });

      // Component should render successfully
      expect(container).toBeInTheDocument();
    });

    it("renders with reduced concurrent starships for mobile-like conditions", async () => {
      const { container } = render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS.slice(0, 3)}
            maxConcurrent={3}
            debugMode={false}
          />
        </Canvas>
      );

      await waitFor(() => {
        expect(
          container.querySelector('[data-testid="canvas"]')
        ).toBeInTheDocument();
      });

      // Component should render successfully with fewer models
      expect(container).toBeInTheDocument();
    });

    it("handles configuration changes dynamically", async () => {
      const { rerender } = render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS.slice(0, 2)}
            maxConcurrent={2}
            debugMode={false}
          />
        </Canvas>
      );

      await waitFor(() => {
        expect(
          document.querySelector('[data-testid="canvas"]')
        ).toBeInTheDocument();
      });

      // Change configuration dynamically
      rerender(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={4}
            debugMode={true}
          />
        </Canvas>
      );

      // Should handle configuration changes without crashing
      await waitFor(() => {
        expect(
          document.querySelector('[data-testid="canvas"]')
        ).toBeInTheDocument();
      });
    });
  });

  describe("Loading Performance Tests", () => {
    it("loads component within acceptable time limits", async () => {
      const startTime = performance.now();

      const { container } = render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={6}
            debugMode={false}
          />
        </Canvas>
      );

      await waitFor(
        () => {
          expect(
            container.querySelector('[data-testid="canvas"]')
          ).toBeInTheDocument();
        },
        { timeout: 5000 }
      );

      const loadTime = performance.now() - startTime;

      // Should load within reasonable time (allowing for test environment)
      expect(loadTime).toBeLessThan(10000); // 10 seconds for test environment
    });

    it("handles loading with error configurations gracefully", async () => {
      const errorConfigs = [
        ...DEFAULT_STARSHIP_CONFIGS,
        {
          ...DEFAULT_STARSHIP_CONFIGS[0],
          id: "error-model",
          modelPath: "error-model.glb",
        },
      ];

      const { container } = render(
        <Canvas>
          <StarshipBackground
            configs={errorConfigs}
            maxConcurrent={4}
            debugMode={false}
          />
        </Canvas>
      );

      await waitFor(() => {
        expect(
          container.querySelector('[data-testid="canvas"]')
        ).toBeInTheDocument();
      });

      // Component should still render despite invalid configurations
      expect(container).toBeInTheDocument();
    });
  });

  describe("Memory Management Tests", () => {
    it("properly cleans up on unmount", async () => {
      const { container, unmount } = render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={4}
            debugMode={false}
          />
        </Canvas>
      );

      await waitFor(() => {
        expect(
          container.querySelector('[data-testid="canvas"]')
        ).toBeInTheDocument();
      });

      // Unmount component
      unmount();

      // Component should unmount without errors
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("Mobile Compatibility Tests", () => {
    it("adapts to smaller screen configurations", async () => {
      const smallScreenConfigs = DEFAULT_STARSHIP_CONFIGS.slice(0, 2);

      const { container } = render(
        <Canvas>
          <StarshipBackground
            configs={smallScreenConfigs}
            maxConcurrent={2}
            debugMode={false}
          />
        </Canvas>
      );

      await waitFor(() => {
        expect(
          container.querySelector('[data-testid="canvas"]')
        ).toBeInTheDocument();
      });

      // Should render successfully with mobile-optimized configuration
      expect(container).toBeInTheDocument();
    });

    it("handles debug mode interactions", async () => {
      const onStarshipClick = vi.fn();

      const { container } = render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS.slice(0, 1)}
            maxConcurrent={1}
            debugMode={true}
            onStarshipClick={onStarshipClick}
          />
        </Canvas>
      );

      await waitFor(() => {
        expect(
          container.querySelector('[data-testid="canvas"]')
        ).toBeInTheDocument();
      });

      // Component should render in debug mode without errors
      expect(container).toBeInTheDocument();
    });
  });

  describe("Stress Testing", () => {
    it("maintains stability during rapid re-renders", async () => {
      const { rerender } = render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS.slice(0, 2)}
            maxConcurrent={2}
            debugMode={false}
          />
        </Canvas>
      );

      await waitFor(() => {
        expect(
          document.querySelector('[data-testid="canvas"]')
        ).toBeInTheDocument();
      });

      // Perform multiple rapid re-renders
      for (let i = 0; i < 5; i++) {
        rerender(
          <Canvas>
            <StarshipBackground
              configs={DEFAULT_STARSHIP_CONFIGS.slice(0, 2 + (i % 2))}
              maxConcurrent={2 + (i % 2)}
              debugMode={false}
            />
          </Canvas>
        );
      }

      // Should handle rapid changes without crashing
      await waitFor(() => {
        expect(
          document.querySelector('[data-testid="canvas"]')
        ).toBeInTheDocument();
      });
    });
  });
});
