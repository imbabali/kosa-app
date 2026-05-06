import { ImageResponse } from "next/og";

export const alt = "KOSA — Kibuli SS Old Students Association";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1F4E2D",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
          position: "relative",
        }}
      >
        {/* Heritage chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: "1px solid rgba(242,201,76,0.5)",
            padding: "10px 22px",
            borderRadius: 999,
            color: "#F2C94C",
            fontSize: 18,
            letterSpacing: 6,
            fontWeight: 600,
            textTransform: "uppercase",
            marginBottom: 56,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              background: "#F2C94C",
              borderRadius: 999,
              display: "flex",
            }}
          />
          Kibuli SS Old Students · Since 1945
        </div>

        {/* Wordmark */}
        <div style={{ position: "relative", display: "flex" }}>
          <div
            style={{
              fontSize: 280,
              fontWeight: 800,
              letterSpacing: -10,
              lineHeight: 1,
              display: "flex",
            }}
          >
            KOSA
          </div>
          <div
            style={{
              position: "absolute",
              bottom: -10,
              left: 8,
              right: 8,
              height: 14,
              background: "#F2C94C",
              borderRadius: 7,
              display: "flex",
            }}
          />
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: 80,
            fontSize: 38,
            fontStyle: "italic",
            color: "rgba(255,255,255,0.9)",
            display: "flex",
          }}
        >
          Proud Past. Stronger Together. Brighter Future.
        </div>
      </div>
    ),
    { ...size },
  );
}
