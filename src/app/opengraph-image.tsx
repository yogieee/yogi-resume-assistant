import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Yoganand Govind — Senior Software Developer & Cloud Architect";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0f 0%, #111118 50%, #0a0a0f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          fontFamily: "monospace",
          color: "#e2e8f0",
        }}
      >
        {/* Terminal chrome */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "32px",
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#ff5f57" }} />
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#febc2e" }} />
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#28c840" }} />
          <span style={{ marginLeft: 16, color: "#64748b", fontSize: 16 }}>
            yogi@portfolio — terminal
          </span>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#4ade80",
            marginBottom: 12,
            textShadow: "0 0 20px rgba(74, 222, 128, 0.3)",
          }}
        >
          Yoganand Govind
        </div>

        {/* Role */}
        <div
          style={{
            fontSize: 28,
            color: "#22d3ee",
            marginBottom: 32,
            textShadow: "0 0 15px rgba(34, 211, 238, 0.3)",
          }}
        >
          Senior Software Developer | Cloud & AI Platform Engineer
        </div>

        {/* Terminal prompt */}
        <div style={{ display: "flex", fontSize: 20, gap: 8, marginBottom: 8 }}>
          <span style={{ color: "#4ade80" }}>{">"}</span>
          <span style={{ color: "#94a3b8" }}>12+ years enterprise</span>
          <span style={{ color: "#334155" }}>|</span>
          <span style={{ color: "#94a3b8" }}>AWS certified</span>
          <span style={{ color: "#334155" }}>|</span>
          <span style={{ color: "#94a3b8" }}>Creator of Autowired.ai</span>
        </div>

        <div style={{ display: "flex", fontSize: 20, gap: 8 }}>
          <span style={{ color: "#4ade80" }}>{">"}</span>
          <span style={{ color: "#94a3b8" }}>Serverless • AI Platforms • Enterprise Systems</span>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 80,
            fontSize: 18,
            color: "#475569",
          }}
        >
          yoganandgovind.dev
        </div>
      </div>
    ),
    { ...size }
  );
}
