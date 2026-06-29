import React, { useState } from "react";
import Logo from "../components/Logo.jsx";
import { login } from "../services/api";

export default function LoginPage({ onNav, push, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      push("Please enter email and password", "error");
      return;
    }
    
    try {
      const response = await login(email, password);
      
      if (response.success) {
        onLogin({ name: response.user.name, email: response.user.email });
        push(`Welcome back, ${response.user.name}!`, "success");
      } else {
        push(response.message || "Invalid email or password", "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      push("Failed to connect to server. Make sure backend is running.", "error");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div className="card" style={{ maxWidth: 440, width: "100%", padding: "40px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Logo size={28} />
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--green)", letterSpacing: ".1em", marginTop: 12 }}>
            CARBON-AWARE RESEARCH
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jaweriashabbir51@gmail.com"
              style={{ width: "100%", padding: "12px 14px", fontSize: 14, borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-main)", outline: "none" }}
              required
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                style={{ width: "100%", padding: "12px 14px", fontSize: 14, borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-main)", outline: "none", paddingRight: "50px" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 12 }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-muted)", cursor: "pointer" }}>
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} style={{ margin: 0 }} />
              Remember me
            </label>
            <button type="button" style={{ background: "none", border: "none", color: "var(--green)", fontSize: 12, cursor: "pointer" }}>
              Forgot password?
            </button>
          </div>

          <button type="submit" className="btn-green" style={{ width: "100%", padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            LOG IN →
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Don't have an account? </span>
          <button onClick={() => onNav("signup")} style={{ background: "none", border: "none", color: "var(--green)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
}