import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class StarshipErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("StarshipBackground 3D rendering error:", error, errorInfo);

    // Call optional error callback
    this.props.onError?.(error, errorInfo);

    // Log additional context for debugging
    console.error("Error boundary caught error in StarshipBackground:", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI or default error message
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#ff6b6b",
            fontFamily: "monospace",
            fontSize: "14px",
            textAlign: "center",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #ff6b6b",
            maxWidth: "400px",
          }}
        >
          <div
            style={{
              marginBottom: "10px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            🚀 Starship Rendering Error
          </div>
          <div style={{ marginBottom: "15px", opacity: 0.8 }}>
            The starship background encountered a rendering error. The
            background will continue without 3D elements.
          </div>
          <div style={{ fontSize: "12px", opacity: 0.6 }}>
            {this.state.error?.message || "Unknown error occurred"}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default StarshipErrorBoundary;
