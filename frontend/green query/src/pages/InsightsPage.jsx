import React, { useState } from "react";
import Logo from "../components/Logo.jsx";
import { FooterDark } from "../components/Footer.jsx";

export default function InsightsPage({ user, onLogout, onNav, results, query, mode }) {
  const [showMenu, setShowMenu] = useState(false);

  const aiSummary = results?.ai_summary || "AI summary will appear after search.";
  const aiEvaluation = results?.ai_evaluation || "AI evaluation will appear after search.";
  const speedup = results?.speedup || 1;
  const carbonCost = results?.carbon_cost || 0;
  const carbonSaved = results?.carbon_saved_percent || 0;
  const zoneCounts = results?.zone_counts || { solar: 0, wind: 0, nuclear: 0 };
  const zoneDistribution = results?.zone_distribution || { solar: 0.34, wind: 0.33, nuclear: 0.33 };
  const sequentialTime = results?.sequential_time || 0;
  const parallelTime = results?.parallel_time || 0;

  const modeLabel = { "run-now": "Run Now", "run-green": "Run Green", "balanced": "Balanced" };
  const currentModeLabel = modeLabel[mode] || "Balanced";

  const getModeColor = () => {
    if (mode === "run-green") return "var(--green)";
    if (mode === "run-now") return "#ef4444";
    return "#3b82f6";
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--pink-bg)", display: "flex", flexDirection: "column" }}>
      <div className="nav">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => onNav("results")}
            style={{ background: "var(--green)", border: "none", cursor: "pointer", fontSize: 14, color: "#fff", padding: "8px 14px", borderRadius: 50, fontWeight: 700 }}
          >
            ← Back to Results
          </button>
          <span style={{ fontSize: 14, fontWeight: 600 }}>🍀 "{query}"</span>
        </div>
        <div style={{ position: "relative" }}>
          <div className="avatar" onClick={() => setShowMenu((p) => !p)}>
            {user.name[0].toUpperCase()}
          </div>
          {showMenu && (
            <div className="avatar-menu">
              <div style={{ padding: "8px 14px", fontSize: 13, color: "var(--muted)", borderBottom: "1px solid var(--border)", marginBottom: 4 }}>
                {user.name}
              </div>
              <button onClick={() => { setShowMenu(false); onLogout(); }}>🔪 Logout</button>
            </div>
          )}
        </div>
      </div>

      <div className="page-enter" style={{ flex: 1, maxWidth: 900, margin: "0 auto", padding: "28px 16px", width: "100%" }}>
        
        {/* Mode Badge */}
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <span style={{ background: getModeColor() + "20", color: getModeColor(), padding: "6px 16px", borderRadius: 50, fontSize: 13, fontWeight: 600 }}>
            {currentModeLabel} Mode
          </span>
        </div>

        {/* AI ROUTING ADVISOR */}
        <div className="card" style={{ padding: "24px", marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--green)", letterSpacing: ".07em", marginBottom: 12 }}>
            🕯️ AI ROUTING ADVISOR
          </div>
          <div style={{ fontSize: 15, color: "var(--text-primary)", lineHeight: 1.6, marginBottom: 8 }}>
            {aiEvaluation}
          </div>
        </div>

        {/* AI SUMMARY */}
        <div className="card" style={{ padding: "24px", marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", letterSpacing: ".07em", marginBottom: 12 }}>
            📚 AI RESEARCH SYNTHESIS
          </div>
          <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
            {aiSummary}
          </div>
        </div>

        {/* CARBON DEEP DIVE */}
        <div className="card" style={{ padding: "24px", marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", letterSpacing: ".07em", marginBottom: 16 }}>
            📊 CARBON & PERFORMANCE DEEP DIVE
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Your search carbon</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{carbonCost}<span style={{ fontSize: 16 }}>g CO₂</span></div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Speedup vs sequential</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{speedup.toFixed(1)}<span style={{ fontSize: 16 }}>x faster</span></div>
            </div>
          </div>

          <div style={{ background: "var(--green-light)", borderRadius: 8, padding: "12px", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--green-dark)" }}>
              {mode === "run-now" 
                ? "⚡ You prioritized speed over carbon" 
                : `🌱 You saved ${carbonSaved}% carbon compared to Run Now`}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
              Sequential: {sequentialTime.toFixed(1)}s | Parallel: {parallelTime.toFixed(1)}s
            </div>
          </div>

          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 8 }}>Zone Distribution</div>
          {[
            { label: "SOLAR", pct: Math.round(zoneDistribution.solar * 100), count: zoneCounts.solar, color: "#22c55e" },
            { label: "WIND", pct: Math.round(zoneDistribution.wind * 100), count: zoneCounts.wind, color: "#3b82f6" },
            { label: "NUCLEAR", pct: Math.round(zoneDistribution.nuclear * 100), count: zoneCounts.nuclear, color: "#8b5cf6" },
          ].map((w) => (
            <div key={w.label} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{w.label}</span>
                <span>{w.pct}% ({w.count} papers)</span>
              </div>
              <div className="prog-track" style={{ height: 6 }}>
                <div className="prog-fill" style={{ width: w.pct + "%", background: w.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* RECOMMENDATIONS */}
        <div className="card" style={{ padding: "24px", background: "#f0fdf4", borderColor: "#dcfce7" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--green)", letterSpacing: ".07em", marginBottom: 12 }}>
            🎯 SMART RECOMMENDATIONS
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
            {mode === "run-now" ? (
              <>
                <li>⚡ You prioritized speed — your {speedup.toFixed(1)}x speedup shows parallel processing worked</li>
                <li>🌱 Next time, try <strong>Run Green</strong> mode to save up to 80% carbon</li>
                <li>⚖️ Or use <strong>Balanced</strong> mode with a 15-second deadline for middle ground</li>
              </>
            ) : mode === "run-green" ? (
              <>
                <li>🌱 Great choice for carbon savings — you saved {carbonSaved}% carbon</li>
                <li>⏱️ If you're in a hurry, try <strong>Balanced</strong> mode with a shorter deadline</li>
                <li>☀️ Run at solar peak (check Dashboard) for even lower carbon</li>
              </>
            ) : (
              <>
                <li>⚖️ Balanced mode gave you {speedup.toFixed(1)}x speedup with {carbonSaved}% carbon savings</li>
                <li>🌱 For max carbon savings, use <strong>Run Green</strong> mode</li>
                <li>⚡ For fastest results, use <strong>Run Now</strong> mode</li>
              </>
            )}
          </ul>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
          <button className="btn-outline" onClick={() => onNav("results")}>← Back to Results</button>
          <button className="btn-green" onClick={() => onNav("query")}>+ New Search</button>
        </div>
      </div>

      <FooterDark />
    </div>
  );
}
