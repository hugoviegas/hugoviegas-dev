import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StarshipErrorBoundary } from "../StarshipErrorBoundary";

// Component that throws an error
const ErrorThrowingComponent = ({
  shouldThrow = true,
}: {
  shouldThrow?: boolean;
}) => {
  if (shouldThrow) {
    throw new Error("Test error in 3D rendering");
  }
  return <div>Normal component</div>;
};

// Component that throws an error in useEffect
const ErrorInEffectComponent = () => {
  React.useEffect(() => {
    throw new Error("Error in useEffect");
  }, []);
  return <div>Component with effect error</div>;
};

describe("StarshipErrorBoundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render children normally when no error occurs", () => {
    render(
      <StarshipErrorBoundary>
        <div data-testid="normal-content">Normal content</div>
      </StarshipErrorBoundary>
    );

    expect(screen.getByTestId("normal-content")).toBeInTheDocument();
    expect(screen.getByText("Normal content")).toBeInTheDocument();
  });

  it("should catch and display error UI when child component throws", () => {
    // Suppress console.error for this test
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <StarshipErrorBoundary>
        <ErrorThrowingComponent shouldThrow={true} />
      </StarshipErrorBoundary>
    );

    // Should show error UI
    expect(screen.getByText("🚀 Starship Rendering Error")).toBeInTheDocument();
    expect(
      screen.getByText(/The starship background encountered a rendering error/)
    ).toBeInTheDocument();
    expect(screen.getByText("Test error in 3D rendering")).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it("should call onError callback when error occurs", () => {
    const onErrorMock = vi.fn();
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <StarshipErrorBoundary onError={onErrorMock}>
        <ErrorThrowingComponent shouldThrow={true} />
      </StarshipErrorBoundary>
    );

    // Wait for error to be caught
    waitFor(() => {
      expect(onErrorMock).toHaveBeenCalledTimes(1);
      expect(onErrorMock).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it("should render custom fallback when provided", () => {
    const customFallback = (
      <div data-testid="custom-fallback">Custom error message</div>
    );
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <StarshipErrorBoundary fallback={customFallback}>
        <ErrorThrowingComponent shouldThrow={true} />
      </StarshipErrorBoundary>
    );

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
    expect(screen.getByText("Custom error message")).toBeInTheDocument();
    expect(
      screen.queryByText("🚀 Starship Rendering Error")
    ).not.toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it("should catch errors thrown in useEffect", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      render(
        <StarshipErrorBoundary>
          <ErrorInEffectComponent />
        </StarshipErrorBoundary>
      );
    }).not.toThrow();

    // Should show error UI
    waitFor(() => {
      expect(
        screen.getByText("🚀 Starship Rendering Error")
      ).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it("should log detailed error information to console", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <StarshipErrorBoundary>
        <ErrorThrowingComponent shouldThrow={true} />
      </StarshipErrorBoundary>
    );

    waitFor(() => {
      // Should have called console.error multiple times with detailed info
      expect(consoleErrorSpy).toHaveBeenCalled();
      const calls = consoleErrorSpy.mock.calls;

      // Check that detailed error logging occurred
      const detailedErrorCall = calls.find(
        (call) =>
          call[0] === "Error boundary caught error in StarshipBackground:"
      );
      expect(detailedErrorCall).toBeDefined();
      expect(detailedErrorCall?.[1]).toHaveProperty("error");
      expect(detailedErrorCall?.[1]).toHaveProperty("stack");
      expect(detailedErrorCall?.[1]).toHaveProperty("componentStack");
      expect(detailedErrorCall?.[1]).toHaveProperty("timestamp");
    });

    consoleErrorSpy.mockRestore();
  });

  it("should create fresh error boundary instance when key changes", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const { rerender } = render(
      <StarshipErrorBoundary>
        <ErrorThrowingComponent shouldThrow={true} />
      </StarshipErrorBoundary>
    );

    // Initially shows error
    expect(screen.getByText("🚀 Starship Rendering Error")).toBeInTheDocument();

    // Rerender with new key (fresh error boundary instance)
    rerender(
      <StarshipErrorBoundary key="new-boundary">
        <ErrorThrowingComponent shouldThrow={false} />
      </StarshipErrorBoundary>
    );

    // Should now show normal content (fresh error boundary)
    expect(screen.getByText("Normal component")).toBeInTheDocument();
    expect(
      screen.queryByText("🚀 Starship Rendering Error")
    ).not.toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it("should handle multiple errors gracefully", () => {
    const onErrorMock = vi.fn();
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { rerender } = render(
      <StarshipErrorBoundary onError={onErrorMock}>
        <ErrorThrowingComponent shouldThrow={true} />
      </StarshipErrorBoundary>
    );

    // First error
    expect(screen.getByText("🚀 Starship Rendering Error")).toBeInTheDocument();

    // Rerender with different error
    rerender(
      <StarshipErrorBoundary onError={onErrorMock}>
        <ErrorThrowingComponent shouldThrow={true} key="different" />
      </StarshipErrorBoundary>
    );

    // Should still show error UI (error boundary doesn't reset automatically)
    expect(screen.getByText("🚀 Starship Rendering Error")).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
