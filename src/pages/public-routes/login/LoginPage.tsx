import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./LoginPage.css";
import LoginHeader from "./components/LoginHeader/LoginHeader";
import LoginFooter from "./components/LoginFooter/LoginFooter";
import LoginSocialSidebar from "./components/LoginSocialSidebar/LoginSocialSidebar";
import AnimatedLogisticsBackground from "./components/AnimatedLogisticsBackground/AnimatedLogisticsBackground";

export default function LoginPage() {
  const { t } = useTranslation();
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
          <p className="login-tagline">{t('login.tagline')}</p>
          <div className="heading-rule" />
        </div>

      {/* Form card */}
      <div className="login-card">
        <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
          {/* Employee ID */}
          <div className="field">
            <label htmlFor="login-email" className="field-label">
              {t('login.emailLabel')}
            </label>
            <div className="field-input-wrap">
              <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="text"
                id="login-email"
                placeholder={t('login.emailPlaceholder')}
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
                {t('login.passwordLabel')}
              </label>
              <a href="#" className="forgot-link">{t('login.forgot')}</a>
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
                aria-label={showPassword ? "Hide password" : "Show password"}
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
                {t('login.submit')}
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

      {/* Floating Arrow to Network Page */}
      <button 
        className="login-to-network-btn"
        onClick={() => navigate('/network')}
        title="View Global Network"
      >
        <span className="arrow-text">GLOBAL NETWORK</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>
    </div>
  );
}
