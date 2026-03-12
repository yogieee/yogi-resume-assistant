"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          background: "#0a0a0f",
          color: "#e2e8f0",
          fontFamily: "monospace",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100dvh",
          margin: 0,
        }}
      >
        <div style={{ maxWidth: 400, textAlign: "center", padding: 32 }}>
          <h1 style={{ color: "#f87171", fontSize: 24, marginBottom: 12 }}>
            Critical Error
          </h1>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>
            The application encountered a critical error. {error.message}
          </p>
          <button
            onClick={reset}
            style={{
              padding: "8px 16px",
              fontSize: 14,
              border: "1px solid rgba(74, 222, 128, 0.4)",
              color: "#4ade80",
              background: "transparent",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
