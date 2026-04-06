import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import LoginHeader from "./components/LoginHeader";
import LoginFooter from "./components/LoginFooter";
import LoginSocialSidebar from "./components/LoginSocialSidebar";

import AnimatedLogisticsBackground from "./components/AnimatedLogisticsBackground";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/app");
    }, 1500);
  };

  return (
    <div className="login-page">
      <AnimatedLogisticsBackground />
      {/* Global Page Header */}
      <LoginHeader />

      {/* Floating Social Sidebar */}
      <LoginSocialSidebar />

      {/* 2. Login Form Wrapper */}
      <div className="login-wrapper">
        {/* Title area */}
        <div className="login-heading">
          <h1 className="login-title">VNFT Logistics</h1>
          <p className="login-tagline">AUTHENTICATION REQUIRED</p>
          <div className="heading-rule" />
        </div>

      {/* Form card */}
      <div className="login-card">
        <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
          {/* Employee ID */}
          <div className="field">
            <label htmlFor="login-email" className="field-label">
              EMPLOYEE ID / EMAIL
            </label>
            <div className="field-input-wrap">
              <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="text"
                id="login-email"
                placeholder="e.g. VNFT-8829"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Security Key */}
          <div className="field">
            <div className="field-label-row">
              <label htmlFor="login-password" className="field-label">
                SECURITY KEY
              </label>
              <a href="#" className="forgot-link">FORGOT?</a>
            </div>
            <div className="field-input-wrap">
              <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                id="login-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`submit-btn${loading ? " submit-btn--loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <span className="btn-spinner" />
            ) : (
              <>
                ACCESS PORTAL
                <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>

    </div> {/* end of login-wrapper */}

      <LoginFooter />
    </div>
  );
}
