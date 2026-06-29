import React, { useState } from "react";
import Logo from "../components/Logo.jsx";
import { signup } from "../services/api";

export default function SignUpPage({ onNav, push }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = (password) => {
    if (!password) return "";
    if (password.length < 6) return { text: "Weak", color: "#ef4444" };
    if (password.length < 10) return { text: "Good", color: "#f59e0b" };
    return { text: "Strong", color: "#22c55e" };
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword;
  const isFormValid = formData.fullName && formData.email && formData.password && passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      push("Please fill all fields correctly", "error");
      return;
    }
    
    try {
      const response = await signup(formData.fullName, formData.email, formData.password);
      
      if (response.success) {
        push("Account created successfully! Please login.", "success");
        onNav("login");
      } else {
        push(response.message || "Signup failed. Email may already exist.", "error");
      }
    } catch (error) {
      console.error("Signup error:", error);
      push("Failed to connect to server. Make sure backend is running.", "error");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div className="card" style={{ maxWidth: 480, width: "100%", padding: "40px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Logo size={28} />
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--green)", letterSpacing: ".1em", marginTop: 12 }}>
            JOIN THE GREEN GRID
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8 }}>
            Sign up to start carbon-aware research
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Dr. Carbon Researcher"
              style={{ width: "100%", padding: "12px 14px", fontSize: 14, borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-main)", outline: "none" }}
              required
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jaweriashabbir51@gmail.com"
              style={{ width: "100%", padding: "12px 14px", fontSize: 14, borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-main)", outline: "none" }}
              required
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
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
            {formData.password && (
              <div style={{ marginTop: 6, fontSize: 11, color: passwordStrength.color }}>
                Password strength: {passwordStrength.text}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
              Confirm Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="********"
                style={{ width: "100%", padding: "12px 14px", fontSize: 14, borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-main)", outline: "none", paddingRight: "50px" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 12 }}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {formData.confirmPassword && (
              <div style={{ marginTop: 6, fontSize: 11, color: passwordsMatch ? "#22c55e" : "#ef4444" }}>
                {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
              </div>
            )}
          </div>

          <button type="submit" className="btn-green" style={{ width: "100%", padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer" }} disabled={!isFormValid}>
            Create Account →
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Already have an account? </span>
          <button onClick={() => onNav("login")} style={{ background: "none", border: "none", color: "var(--green)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            Login
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border-light)" }}>
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Privacy Policy · Terms of Service</span>
        </div>
      </div>
    </div>
  );
}