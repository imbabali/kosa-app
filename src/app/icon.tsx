import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1F4E2D",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: 44,
          letterSpacing: -2,
          position: "relative",
        }}
      >
        K
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 14,
            right: 14,
            height: 4,
            background: "#F2C94C",
            display: "flex",
            borderRadius: 2,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
