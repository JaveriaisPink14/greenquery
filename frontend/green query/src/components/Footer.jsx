import React from "react";

export function Footer() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px 16px",
        fontSize: 11,
        color: "var(--muted)",
        display: "flex",
        justifyContent: "center",
        gap: 24,
      }}
    >
      <span style={{ cursor: "pointer" }}>PRIVACY POLICY</span>
      <span>|</span>
      <span style={{ cursor: "pointer" }}>SITE METADATA</span>
      <span>|</span>
      <span style={{ cursor: "pointer" }}>API DOCS</span>
    </div>
  );
}

export function FooterDark() {
  return (
    <div
      style={{
        background: "#1a1a2e",
        color: "#9ca3af",
        padding: "14px 32px",
        display: "flex",
        justifyContent: "space-between",
        fontSize: 11,
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: 16 }}>
        <span>🌐 GLOBAL: EU1000XENU1</span>
        <span>|</span>
        <span>🔒 SECURA ANALYTICS</span>
      </div>
      <span>© 2024 GreenQuery Subsidiaries. All rights reserved.</span>
    </div>
  );
}

