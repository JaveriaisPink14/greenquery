import React, { useState } from "react";
import Logo from "../components/Logo.jsx";
import { FooterDark } from "../components/Footer.jsx";
import { Footer } from "../components/Footer.jsx";

export default function QueryPage({ user, onLogout, onNav, push }) {
  const [showMenu, setShowMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("balanced");
  const [deadline, setDeadline] = useState(15);

  const modes = [
    { id: "run-now", icon: "🦴", label: "Run Now", desc: "Parallelize search across all available zones for immediate results regardless of grid load.", speed: "FASTEST • HIGH CARBON" },
    { id: "run-green", icon: "🌿", label: "Run Green", desc: "Automatically delay query until the local or remote solar/wind grid peaks for 100% clean compute.", speed: "SLOWER • ZERO CARBON", extra: "⬇ 0.0g CO₂ PER QUERY" },
    { id: "balanced", icon: "⛏️", label: "Balanced", desc: "Define a hard deadline. We'll find the greenest window within your specified timeframe.", speed: "OPTIMIZED • LOW CARBON ✓", selected: true },
  ];

  const co2 = (deadline * 0.03).toFixed(2);

  return (
    <div style={{ minHeight: "100vh", background: "var(--pink-bg)" }}>
      <div className="nav">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => onNav("dashboard")}
            style={{ background: "var(--green)", border: "none", cursor: "pointer", fontSize: 14, color: "#fff", padding: "8px 14px", borderRadius: 50, fontWeight: 700 }}
          >
            ← Back
          </button>
          <Logo size={17} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>

          <div style={{ position: "relative" }}>
            <div className="avatar" onClick={() => setShowMenu((p) => !p)}>
              {user.name[0].toUpperCase()}
            </div>
            {showMenu && (
              <div className="avatar-menu">
                <div style={{ padding: "8px 14px", fontSize: 13, color: "var(--muted)", borderBottom: "1px solid var(--border)", marginBottom: 4 }}>{user.name}</div>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onLogout();
                  }}
                >
                  🔪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="page-enter" style={{ maxWidth: 720, margin: "0 auto", padding: "36px 16px" }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Configure Your Query</h2>

          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>Define how GreenQuery should prioritize carbon efficiency for your research.</p>
        </div>

        <div style={{ position: "relative", marginBottom: 28 }}>
          <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
          <input
            placeholder='Search research papers… e.g., "transformer attention mechanisms"'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              border: "1.5px solid var(--border)",
              borderRadius: 12,
              padding: "13px 16px 13px 44px",
              fontFamily: "var(--font)",
              fontSize: 14,
              outline: "none",
              background: "#fff",
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--muted)" }}>Execution Mode</span>
          <a 
            href="https://arxiv.org/abs/2106.11750" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ fontSize: 12, color: "var(--green)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
          >
          📖 Read Google's paper on Carbon-Aware Computing <span style={{ fontSize: 10 }}>↗</span>
          </a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 24 }}>
          {modes.map((m) => (
            <div key={m.id} className={`mode-card ${mode === m.id ? "selected" : ""}`} onClick={() => setMode(m.id)}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{m.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{m.label}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, marginBottom: 10 }}>{m.desc}</div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".06em", color: mode === m.id ? "var(--green)" : "var(--muted)" }}>{m.speed}</div>
              {m.extra && <div style={{ fontSize: 10, color: "var(--green)", marginTop: 2 }}>{m.extra}</div>}
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: "20px 24px", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Time-to-Result Deadline</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Adjust the slider to balance speed and environmental impact.</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--green)" }}>{deadline}s</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>PREDICTED: {co2} CO₂</div>
            </div>
          </div>
          <input type="range" min={2} max={50} value={deadline} onChange={(e) => setDeadline(+e.target.value)} style={{ width: "100%", accentColor: "var(--green)", height: 4 }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", marginTop: 8 }}>
            <span>FASTEST (2S)</span>
            <span style={{ color: "var(--green)", fontWeight: 600 }}>CURRENT SETUP</span>
            <span>GREENEST (50S)</span>
          </div>
        </div>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <button
            className="btn-green"
            onClick={() => {
              if (!query.trim()) {
                push("Please enter a search query", "error");
                return;
              }
              onNav("results", { query, mode, deadline });
            }}
          >
            Search Papers →
          </button>
        </div>

        <div style={{ background: "#fff", border: "1.5px dashed var(--border)", borderRadius: 14, padding: "48px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📄</div>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Your search results will appear here</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>Choose an execution mode above and click the green search button to initiate your carbon-aware query.</div>
        </div>
      </div>

      <FooterDark />
    </div>
  );
}

