import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontWeight: 800,
          letterSpacing: -3,
          position: "relative",
        }}
      >
        <div style={{ fontSize: 86, display: "flex", lineHeight: 1 }}>KOSA</div>
        <div
          style={{
            marginTop: 10,
            width: 120,
            height: 6,
            background: "#F2C94C",
            display: "flex",
            borderRadius: 3,
          }}
        />
        <div
          style={{
            marginTop: 14,
            fontSize: 14,
            letterSpacing: 4,
            fontWeight: 600,
            color: "#F2C94C",
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          Since 1945
        </div>
      </div>
    ),
    { ...size },
  );
}
