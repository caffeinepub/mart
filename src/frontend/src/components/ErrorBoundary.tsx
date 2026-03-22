import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("App error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "sans-serif",
            textAlign: "center",
            padding: "24px",
            background: "#f9f9f9",
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 16 }}>⚠️</div>
          <h1 style={{ fontSize: 24, color: "#0d6e6e", marginBottom: 8 }}>
            धर्मा Mart
          </h1>
          <p style={{ color: "#666", marginBottom: 24 }}>
            कुछ गड़बड़ी हुई। Page reload करें।
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              background: "#f97316",
              color: "#fff",
              border: "none",
              padding: "10px 28px",
              borderRadius: 6,
              fontSize: 16,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Reload करें
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
