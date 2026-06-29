import React, { useState, useEffect } from "react";
import Logo from "../components/Logo.jsx";
import { FooterDark } from "../components/Footer.jsx";
import { searchPapers } from "../services/api";

export default function ResultsPage({ user, onLogout, onNav, push, searchParams }) {
  const { query = "transformer attention mechanisms", mode = "balanced", deadline = 15 } = searchParams || {};
  const [activeTab, setActiveTab] = useState("all");
  const [showMenu, setShowMenu] = useState(false);
  const [paperSearch, setPaperSearch] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real results from backend
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchPapers(query, mode, deadline);
        setResults(data);
      } catch (err) {
        console.error("Search failed:", err);
        setError("Failed to connect to backend. Make sure the server is running on port 8000.");
        push("Search failed. Backend not responding.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query, mode, deadline, push]);

  // Get papers from results
  const allPapers = results?.papers || [];
  const speedup = results?.speedup || 1;
  const sequentialTime = results?.sequential_time || 0;
  const parallelTime = results?.parallel_time || 0;
  const zoneCounts = results?.zone_counts || { solar: 0, wind: 0, nuclear: 0 };
  const zoneDistribution = results?.zone_distribution || { solar: 0.34, wind: 0.33, nuclear: 0.33 };

  // Filter papers by zone
  const tabMap = { all: null, solar: "solar", wind: "wind", nuclear: "nuclear" };
  const filtered = allPapers.filter((p) => {
    const tagMatch = tabMap[activeTab] === null || p.zone === tabMap[activeTab];
    const textMatch =
      !paperSearch ||
      p.title.toLowerCase().includes(paperSearch.toLowerCase()) ||
      (p.abstract || "").toLowerCase().includes(paperSearch.toLowerCase());
    return tagMatch && textMatch;
  });

  const modeLabel = { "run-now": "Run Now", "run-green": "Run Green", "balanced": "Balanced" };
  const currentModeLabel = modeLabel[mode] || "Balanced";
 
  const getModeColor = () => {
    if (mode === "run-green") return "var(--green)";
    if (mode === "run-now") return "#ef4444";
    return "#3b82f6";
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--pink-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>🔍</div>
          <div style={{ fontWeight: 600 }}>Searching papers...</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 8 }}>Parallel search across 3 zones</div>
        </div>
      </div>
    );
  }

  if (error && !results) {
    return (
      <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
        <div className="nav">
          <button onClick={() => onNav("query")} style={{ background: "var(--green)", border: "none", cursor: "pointer", fontSize: 14, color: "#fff", padding: "8px 14px", borderRadius: 50, fontWeight: 700 }}>← Back</button>
          <Logo size={17} />
        </div>
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Connection Error</div>
          <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 24 }}>{error}</div>
          <button className="btn-green" onClick={() => onNav("query")}>Try Again</button>
        </div>
        <FooterDark />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", flexDirection: "column" }}>
      <div className="nav">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => onNav("query")} style={{ background: "var(--green)", border: "none", cursor: "pointer", fontSize: 14, color: "#fff", padding: "8px 14px", borderRadius: 50, fontWeight: 700 }}>←</button>
          <span style={{ fontSize: 14, fontWeight: 600 }}>🍀 "{query}"</span>
        </div>
        <div style={{ position: "relative" }}>
          <div className="avatar" onClick={() => setShowMenu((p) => !p)}>
            {user.name[0].toUpperCase()}
          </div>
          {showMenu && (
            <div className="avatar-menu">
              <div style={{ padding: "8px 14px", fontSize: 13, color: "var(--muted)", borderBottom: "1px solid var(--border)", marginBottom: 4 }}>{user.name}</div>
              <button onClick={() => { setShowMenu(false); onLogout(); }}>🔪 Logout</button>
            </div>
          )}
        </div>
      </div>

      <div className="page-enter" style={{ flex: 1, maxWidth: 1200, margin: "0 auto", padding: "28px 16px", width: "100%" }}>
        {/* Mode Indicator */}
        <div style={{ marginBottom: 20, textAlign: "center" }}>
          <span style={{ background: getModeColor() + "20", color: getModeColor(), padding: "6px 16px", borderRadius: 50, fontSize: 13, fontWeight: 600 }}>
            {currentModeLabel} Mode
          </span>
        </div>

        {/* Speedup Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div className="card" style={{ padding: "20px 24px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", letterSpacing: ".07em", marginBottom: 4 }}>SEQUENTIAL (BASELINE)</div>
            <div style={{ fontSize: 36, fontWeight: 700 }}>{sequentialTime.toFixed(1)}<span style={{ fontSize: 20 }}>s</span></div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>One computer, no parallelism</div>
          </div>
          <div className="card" style={{ padding: "20px 24px", border: `2px solid ${getModeColor()}`, position: "relative" }}>
            <span style={{ position: "absolute", top: 14, right: 14, background: getModeColor(), color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 50 }}>{speedup.toFixed(1)}x FASTER</span>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", letterSpacing: ".07em", marginBottom: 4 }}>PARALLEL (YOUR SEARCH)</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: getModeColor() }}>{parallelTime.toFixed(1)}<span style={{ fontSize: 20 }}>s</span></div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>3 zones working simultaneously</div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
          {/* Left Column - Papers */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Papers</span>
              <span style={{ fontSize: 11, background: "#e5e7eb", color: "var(--muted)", borderRadius: 50, padding: "2px 10px" }}>{filtered.length}</span>
              <div style={{ display: "flex", gap: 4 }}>
                {["all", "solar", "wind", "nuclear"].map((t) => (
                  <button key={t} className={`tab-pill ${activeTab === t ? "active" : ""}`} onClick={() => { setActiveTab(t); setPaperSearch(""); }}>
                    {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "all" && (
              <div style={{ position: "relative", marginBottom: 14 }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>🔍</span>
                <input placeholder="Search papers…" value={paperSearch} onChange={(e) => setPaperSearch(e.target.value)} style={{ width: "100%", border: "1.5px solid var(--border)", borderRadius: 10, padding: "10px 14px 10px 36px", fontFamily: "var(--font)", fontSize: 13, outline: "none", background: "#fff" }} />
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map((p, idx) => (
                <div key={idx} className="paper-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, flex: 1, paddingRight: 12 }}>{p.title}</h3>
                    <span className="score-badge">{Math.round(p.score * 100)}%</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>{p.authors || "Unknown"}</div>
                  <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.6, marginBottom: 10 }}>{p.abstract || "Abstract not available"}</p>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 11, background: p.zone === "solar" ? "#22c55e20" : p.zone === "wind" ? "#3b82f620" : "#8b5cf620", color: p.zone === "solar" ? "#22c55e" : p.zone === "wind" ? "#3b82f6" : "#8b5cf6", padding: "2px 8px", borderRadius: 4 }}>
                      {p.zone?.toUpperCase()} zone
                    </span>
                    {p.doi && (
                      <a href={p.doi} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#3b82f6", textDecoration: "none" }}>DOI ↗</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
                No papers found in this zone.
              </div>
            )}
          </div>

          {/* Right Column - Stats (simplified, AI moved to Insights page) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="card" style={{ padding: "18px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", letterSpacing: ".07em", marginBottom: 10 }}>CARBON REPORT</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Your search carbon:</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{results?.carbon_cost || "0.00"}<span style={{ fontSize: 16 }}>g CO₂</span></div>
              <div style={{ background: "var(--green-light)", borderRadius: 8, padding: "10px 12px", marginTop: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--green-dark)" }}>
                  {mode === "run-now" 
                    ? "⚡ Speed priority (baseline measurement)" 
                    : `🌱 ${results?.carbon_saved_percent || 0}% less carbon than Run Now`}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                  {speedup.toFixed(1)}x speedup via parallel processing across 3 zones
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: "18px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", letterSpacing: ".07em", marginBottom: 12 }}>WORK DISTRIBUTION</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 10 }}>Carbon-weighted allocation</div>
              {[
                { label: "SOLAR", pct: Math.round(zoneDistribution.solar * 100), count: zoneCounts.solar || 0, color: "#22c55e" },
                { label: "WIND", pct: Math.round(zoneDistribution.wind * 100), count: zoneCounts.wind || 0, color: "#3b82f6" },
                { label: "NUCLEAR", pct: Math.round(zoneDistribution.nuclear * 100), count: zoneCounts.nuclear || 0, color: "#8b5cf6" },
              ].map((w) => (
                <div key={w.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: "var(--muted)" }}>{w.label}</span>
                    <span style={{ color: "var(--muted)" }}>{w.pct}% ({w.count} papers)</span>
                  </div>
                  <div className="prog-track" style={{ height: 8 }}>
                    <div className="prog-fill" style={{ width: w.pct + "%", background: w.color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* View AI Insights Button */}
            <button 
              className="btn-green" 
              style={{ width: "100%", padding: "14px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
              onClick={() => onNav("insights", { results, query, mode })}
            >
              ✏️ View AI Insights →
            </button>
          </div>
        </div>
      </div>

      <div style={{ background: "#1a1a2e", color: "#fff", padding: "12px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 24, fontSize: 11 }}>
          <span>🌿 GreenScholar</span>
          <span>⚡ {speedup.toFixed(1)}x Speedup</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-outline" style={{ fontSize: 12, color: "#fff", borderColor: "#ffffff40", background: "transparent", padding: "8px 16px", borderRadius: 50, cursor: "pointer" }} onClick={() => push("Carbon report saved!", "success")}>📤 Share Report</button>
          <button className="btn-green" style={{ fontSize: 12, padding: "8px 16px", borderRadius: 50, cursor: "pointer" }} onClick={() => onNav("query")}>+ New Search</button>
        </div>
      </div>

      <FooterDark />
    </div>
  );
}