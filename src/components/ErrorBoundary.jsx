// import { Component } from "react";

// export default class ErrorBoundary extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, info) {
//     console.error("F2 App Error:", error, info);
//   }

//   render() {
//     if (!this.state.hasError) return this.props.children;

//     return (
//       <div style={{
//         minHeight: "60vh",
//         display: "flex", flexDirection: "column",
//         alignItems: "center", justifyContent: "center",
//         padding: "40px 24px", textAlign: "center",
//         fontFamily: "var(--font-body)",
//       }}>
//         <div style={{ fontSize: 44, marginBottom: 16 }}>⚠️</div>
//         <div style={{
//           fontFamily: "var(--font-display)", fontSize: 16,
//           letterSpacing: 2, color: "var(--gold)", marginBottom: 10,
//         }}>
//           SOMETHING WENT WRONG
//         </div>
//         <div style={{ fontSize: 13, color: "var(--muted2)", maxWidth: 320, lineHeight: 1.7, marginBottom: 24 }}>
//           {this.state.error?.message || "An unexpected error occurred. Please try again."}
//         </div>
//         <button
//           className="btn btn-primary"
//           onClick={() => this.setState({ hasError: false, error: null })}
//         >
//           Try Again
//         </button>
//         <button
//           className="btn btn-outline"
//           style={{ marginTop: 10 }}
//           onClick={() => window.location.href = "/dashboard"}
//         >
//           Go to Dashboard
//         </button>
//       </div>
//     );
//   }
// }
import { Component } from "react";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────
   CLASS ERROR BOUNDARY
───────────────────────────────────────────── */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("F2 App Error:", error, info);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <ErrorFallback
        error={this.state.error}
        resetError={this.resetError}
      />
    );
  }
}

/* ─────────────────────────────────────────────
   FUNCTIONAL FALLBACK UI (for hooks support)
───────────────────────────────────────────── */
function ErrorFallback({ error, resetError }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        textAlign: "center",
        fontFamily: "var(--font-body)",
      }}
    >
      <div style={{ fontSize: 44, marginBottom: 16 }}>⚠️</div>

      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 16,
          letterSpacing: 2,
          color: "var(--gold)",
          marginBottom: 10,
        }}
      >
        SOMETHING WENT WRONG
      </div>

      <div
        style={{
          fontSize: 13,
          color: "var(--muted2)",
          maxWidth: 320,
          lineHeight: 1.7,
          marginBottom: 24,
        }}
      >
        {error?.message || "An unexpected error occurred. Please try again."}
      </div>

      <button
        className="btn btn-primary"
        onClick={resetError}
      >
        Try Again
      </button>

      <button
        className="btn btn-outline"
        style={{ marginTop: 10 }}
        onClick={() => navigate("/dashboard")}
      >
        Go to Dashboard
      </button>
    </div>
  );
}