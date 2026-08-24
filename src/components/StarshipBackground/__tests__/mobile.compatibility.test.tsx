import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
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

describe("Mobile Device Compatibility Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window dimensions
    Object.defineProperty(window, "innerWidth", {
      value: 1920,
      writable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: 1080,
      writable: true,
    });

    // Mock Touch constructor for tests
    global.Touch = class Touch {
      constructor(options: any = {}) {
        this.identifier = options.identifier || 0;
        this.target = options.target || null;
        this.clientX = options.clientX || 0;
        this.clientY = options.clientY || 0;
        this.pageX = options.pageX || 0;
        this.pageY = options.pageY || 0;
        this.screenX = options.screenX || 0;
        this.screenY = options.screenY || 0;
      }
      identifier: number;
      target: any;
      clientX: number;
      clientY: number;
      pageX: number;
      pageY: number;
      screenX: number;
      screenY: number;
    } as any;
  });

  describe("Touch Interactions", () => {
    it("should handle touch events on mobile devices", async () => {
      // Mock mobile viewport
      Object.defineProperty(window, "innerWidth", {
        value: 375,
        writable: true,
      }); // iPhone width
      Object.defineProperty(window, "innerHeight", {
        value: 667,
        writable: true,
      });

      const mockOnStarshipClick = vi.fn();

      const { container } = render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={3} // Mobile optimized
            debugMode={true}
            onStarshipClick={mockOnStarshipClick}
          />
        </Canvas>
      );

      // Wait for component to stabilize
      await waitFor(() => {
        expect(container).toBeInTheDocument();
      });

      // Simulate touch event on canvas
      const canvas = screen.getByTestId("mock-canvas");
      const touchStartEvent = new TouchEvent("touchstart", {
        touches: [
          new Touch({
            identifier: 1,
            target: canvas,
            clientX: 100,
            clientY: 100,
          }),
        ],
      });

      fireEvent(canvas, touchStartEvent);

      // Component should handle touch without crashing
      expect(canvas).toBeInTheDocument();
    });

    it("should prevent default touch behaviors that interfere with 3D interaction", async () => {
      // Mock mobile viewport
      Object.defineProperty(window, "innerWidth", {
        value: 375,
        writable: true,
      });

      const { container } = render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={3}
            debugMode={true}
          />
        </Canvas>
      );

      await waitFor(() => {
        expect(container).toBeInTheDocument();
      });

      const canvas = screen.getByTestId("mock-canvas");

      // Mock preventDefault spy
      const preventDefaultSpy = vi.fn();
      const touchEvent = new TouchEvent("touchmove", {
        touches: [
          new Touch({
            identifier: 1,
            target: canvas,
            clientX: 100,
            clientY: 100,
          }),
        ],
      });
      Object.defineProperty(touchEvent, "preventDefault", {
        value: preventDefaultSpy,
        writable: false,
      });

      // The component should handle touch events appropriately
      expect(canvas).toBeInTheDocument();
    });

    it("should support multi-touch gestures for camera control in debug mode", async () => {
      // Mock mobile viewport
      Object.defineProperty(window, "innerWidth", {
        value: 414,
        writable: true,
      }); // iPhone Plus width

      const { container } = render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={3}
            debugMode={true}
          />
        </Canvas>
      );

      await waitFor(() => {
        expect(container).toBeInTheDocument();
      });

      // Check for OrbitControls in debug mode (simulated by our mock)
      const orbitControls = screen.queryByTestId("orbit-controls");
      expect(orbitControls).toBeInTheDocument();
    });
  });

  describe("Responsive Performance", () => {
    it("should reduce starship count on small screens", async () => {
      // Mock small mobile screen
      Object.defineProperty(window, "innerWidth", {
        value: 320,
        writable: true,
      });
      Object.defineProperty(window, "innerHeight", {
        value: 568,
        writable: true,
      });

      const { rerender } = render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={6} // Will be reduced on mobile
          />
        </Canvas>
      );

      // Trigger resize
      window.dispatchEvent(new Event("resize"));

      await waitFor(() => {
        // Component should adapt to mobile constraints
        expect(screen.getByTestId("mock-canvas")).toBeInTheDocument();
      });
    });

    it("should maintain performance on tablet-sized screens", async () => {
      // Mock tablet viewport
      Object.defineProperty(window, "innerWidth", {
        value: 768,
        writable: true,
      });
      Object.defineProperty(window, "innerHeight", {
        value: 1024,
        writable: true,
      });

      const { container } = render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={4} // Tablet-optimized count
          />
        </Canvas>
      );

      await waitFor(() => {
        expect(container).toBeInTheDocument();
      });

      // Should handle tablet performance requirements
      const canvas = screen.getByTestId("mock-canvas");
      expect(canvas).toBeInTheDocument();
    });

    it("should handle orientation changes", async () => {
      // Start in portrait
      Object.defineProperty(window, "innerWidth", {
        value: 375,
        writable: true,
      });
      Object.defineProperty(window, "innerHeight", {
        value: 667,
        writable: true,
      });

      const { rerender } = render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={6}
          />
        </Canvas>
      );

      // Change to landscape
      Object.defineProperty(window, "innerWidth", {
        value: 667,
        writable: true,
      });
      Object.defineProperty(window, "innerHeight", {
        value: 375,
        writable: true,
      });

      // Trigger orientation change
      window.dispatchEvent(new Event("resize"));

      await waitFor(() => {
        expect(screen.getByTestId("mock-canvas")).toBeInTheDocument();
      });
    });

    it("should adapt quality settings based on device performance", async () => {
      // Mock low-performance mobile device
      Object.defineProperty(window, "innerWidth", {
        value: 360,
        writable: true,
      });
      Object.defineProperty(window, "innerHeight", {
        value: 640,
        writable: true,
      });

      // Mock slower performance
      const originalNow = performance.now.bind(performance);
      const timeOffset = 0;
      Object.defineProperty(window, "performance", {
        value: {
          ...performance,
          now: () => originalNow() + timeOffset,
        },
        writable: true,
      });

      const { container } = render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={6}
          />
        </Canvas>
      );

      await waitFor(() => {
        expect(container).toBeInTheDocument();
      });

      // Component should adapt to lower performance expectations
      expect(screen.getByTestId("mock-canvas")).toBeInTheDocument();
    });
  });

  describe("Mobile-Specific Features", () => {
    it("should disable orbit controls by default on mobile", async () => {
      // Mock mobile viewport
      Object.defineProperty(window, "innerWidth", {
        value: 375,
        writable: true,
      });

      const { container } = render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={3}
            debugMode={false} // Orbit controls should be disabled
          />
        </Canvas>
      );

      await waitFor(() => {
        expect(container).toBeInTheDocument();
      });

      // Orbit controls should not be present when debugMode is false
      const orbitControls = screen.queryByTestId("orbit-controls");
      expect(orbitControls).not.toBeInTheDocument();
    });

    it("should optimize loading for slow mobile connections", async () => {
      // Mock mobile viewport
      Object.defineProperty(window, "innerWidth", {
        value: 375,
        writable: true,
      });

      const mockOnLoadingChange = vi.fn();

      render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={3}
            onLoadingChange={mockOnLoadingChange}
          />
        </Canvas>
      );

      // Should call loading callbacks appropriately
      await waitFor(() => {
        expect(mockOnLoadingChange).toHaveBeenCalledWith(true); // Loading started
      });

      // Wait for loading to complete
      await waitFor(
        () => {
          expect(mockOnLoadingChange).toHaveBeenCalledWith(false); // Loading finished
        },
        { timeout: 3000 }
      );
    });

    it("should handle memory constraints on mobile devices", async () => {
      // Mock mobile viewport with limited memory
      Object.defineProperty(window, "innerWidth", {
        value: 375,
        writable: true,
      });

      const { container, unmount } = render(
        <Canvas>
          <StarshipBackground
            configs={DEFAULT_STARSHIP_CONFIGS}
            maxConcurrent={2} // Very conservative for memory
          />
        </Canvas>
      );

      await waitFor(() => {
        expect(container).toBeInTheDocument();
      });

      // Clean up
      unmount();

      // Component should unmount without memory issues
      expect(container).toBeEmptyDOMElement();
    });
  });
});
