import React from "react";

export default function Logo({ size = 18 }) {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontWeight: 700,
        fontSize: size,
      }}
    >
      <span
        style={{
          width: size + 10,
          height: size + 10,
          background: "#22c55e",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: size - 4,
        }}
      >
        🌿
      </span>
      GreenQuery
    </span>
  );
}

