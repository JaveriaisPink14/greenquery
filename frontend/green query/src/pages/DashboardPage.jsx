import React, { useEffect, useState } from "react";
import Logo from "../components/Logo.jsx";
import { Footer } from "../components/Footer.jsx";
import { getForecast, createScoreStream } from "../services/api";

export default function DashboardPage({ user, onLogout, onNav, push }) {
  const [showMenu, setShowMenu] = useState(false);
  const [gridScores, setGridScores] = useState({
    solar: { pct: 50, tag: "Loading...", tagColor: "#888", peakIn: "---" },
    wind: { pct: 50, tag: "Loading...", tagColor: "#888", peakIn: "---" },
    nuclear: { pct: 50, tag: "Loading...", tagColor: "#888", peakIn: "---" }
  });
  const [connectionError, setConnectionError] = useState(false);

  const getTagFromScore = (carbon) => {
    // Lower carbon intensity = greener
    if (carbon <= 15) return "Very Clean";
    if (carbon <= 30) return "Clean";
    if (carbon <= 60) return "Moderate";
    return "High Carbon";
  };
  
  const getColorFromScore = (carbon) => {
    // Lower carbon = greener color
    if (carbon <= 15) return "#22c55e";
    if (carbon <= 30) return "#a3e635";
    if (carbon <= 60) return "#f59e0b";
    return "#ef4444";
  };

  const formatSeconds = (seconds) => {
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${minutes}m ${secs}s` : `${minutes} minutes`;
  };

  const updateGridFromForecast = (forecast) => {
    if (!forecast || !forecast.solar) return;
    setGridScores(prev => ({
      solar: { 
        ...prev.solar, 
        peakIn: formatSeconds(forecast.solar.seconds_to_peak), 
        pct: forecast.solar.current_score, 
        tag: getTagFromScore(forecast.solar.current_score), 
        tagColor: getColorFromScore(forecast.solar.current_score) 
      },
      wind: { 
        ...prev.wind, 
        peakIn: formatSeconds(forecast.wind.seconds_to_peak), 
        pct: forecast.wind.current_score, 
        tag: getTagFromScore(forecast.wind.current_score), 
        tagColor: getColorFromScore(forecast.wind.current_score) 
      },
      nuclear: { 
        ...prev.nuclear, 
        peakIn: formatSeconds(forecast.nuclear.seconds_to_peak), 
        pct: forecast.nuclear.current_score, 
        tag: getTagFromScore(forecast.nuclear.current_score), 
        tagColor: getColorFromScore(forecast.nuclear.current_score) 
      }
    }));
    setConnectionError(false);
  };

  // Fetch forecast and setup SSE stream
  useEffect(() => {
    // Get initial forecast
    getForecast()
      .then(forecast => {
        console.log("✅ Forecast received:", forecast);
        updateGridFromForecast(forecast);
      })
      .catch(err => {
        console.error("❌ Failed to get forecast:", err);
        setConnectionError(true);
        push("Cannot connect to backend. Make sure server is running on port 8000.", "error");
      });

    // Setup SSE stream for live scores
    let eventSource = null;
    try {
      eventSource = createScoreStream((scores) => {
        console.log("📡 Scores received:", scores);
        setGridScores(prev => ({
          ...prev,
          solar: { ...prev.solar, pct: scores.solar, tag: getTagFromScore(scores.solar), tagColor: getColorFromScore(scores.solar) },
          wind: { ...prev.wind, pct: scores.wind, tag: getTagFromScore(scores.wind), tagColor: getColorFromScore(scores.wind) },
          nuclear: { ...prev.nuclear, pct: scores.nuclear, tag: getTagFromScore(scores.nuclear), tagColor: getColorFromScore(scores.nuclear) }
        }));
        setConnectionError(false);
      });
    } catch (err) {
      console.error("❌ Failed to create SSE stream:", err);
      setConnectionError(true);
    }

    // Update forecast periodically
    const interval = setInterval(() => {
      getForecast()
        .then(updateGridFromForecast)
        .catch(err => console.error("Periodic forecast failed:", err));
    }, 10000);

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      clearInterval(interval);
    };
  }, [push]);

  const grids = [
    { icon: "☀️", label: "SOLAR GRID", key: "solar", eff: gridScores.solar.pct },
    { icon: "💨", label: "WIND FARM", key: "wind", eff: gridScores.wind.pct },
    { icon: "⚛️", label: "NUCLEAR CORE", key: "nuclear", eff: gridScores.nuclear.pct },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--pink-bg)" }}>
      <div className="nav">
        <Logo size={17} />
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

      <div className="page-enter" style={{ maxWidth: 600, margin: "0 auto", padding: "40px 16px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <Logo size={22} />
          </div>
          <div style={{ maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
              <span>Real-time carbon-aware research platform. Optimizing computational workloads based on renewable grid availability.</span>
            </div>
          </div>
        </div>

        {connectionError && (
          <div style={{ background: "#fee2e2", border: "1px solid #ef4444", borderRadius: 12, padding: "16px", marginBottom: 24, textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#ef4444", marginBottom: 8 }}>⚠️ Connection Error</div>
            <div style={{ fontSize: 12, color: "#b91c1c" }}>Cannot connect to backend. Please make sure the server is running on port 8000.</div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
          {grids.map((g) => (
            <div key={g.label} className="grid-card" style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ fontSize: 28 }}>{g.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", color: "var(--muted)", marginBottom: 2 }}>{g.label}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 32, fontWeight: 700 }}>{Math.round(gridScores[g.key].pct)}%</span>
                  <span style={{ fontSize: 11, fontWeight: 600, background: gridScores[g.key].tagColor + "20", color: gridScores[g.key].tagColor, padding: "2px 10px", borderRadius: 50 }}>{gridScores[g.key].tag}</span>
                </div>
              </div>
              <div style={{ width: 220 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>
                  <span>CARBON INTENSITY</span>
                  <span>{Math.round(gridScores[g.key].pct)} gCO₂/kWh</span>
                </div>
                <div className="prog-track">
                  <div className="prog-fill" style={{ width: gridScores[g.key].pct + "%" }} />
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>↱ Peaks in {gridScores[g.key].peakIn}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "var(--green)", marginBottom: 16 }}>● LIVE GRID FEED</div>
          <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 20, fontStyle: "italic" }}>
            "Scores update every 10 seconds. Lower CI = Greener."
          </p>
          <button className="btn-green" onClick={() => onNav("query")}>
            🔍 Start New Search →
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}