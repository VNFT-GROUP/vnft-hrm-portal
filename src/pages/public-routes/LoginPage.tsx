import React, { useState } from "react";
import "./LoginPage.css";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="login-container">
      {/* Decorative scattered geometric shapes in the background */}
      <div className="login-bg-shape login-bg-shape--1"></div>
      <div className="login-bg-shape login-bg-shape--2"></div>

      <div className="login-card">
        {/* Left Side: Brand & Visuals */}
        <div className="login-visuals">
          <div className="login-visuals-overlay"></div>
          <div className="visuals-content">
            <div className="visuals-logo-wrapper">
              <img
                src="/logo/Logo-VNFT-1024x1024.webp"
                alt="VNFT Logo"
                className="visuals-logo"
              />
            </div>
            <h2 className="visuals-title">VNFT Group</h2>
            <p className="visuals-subtitle">HRM Portal System</p>
            <div className="visuals-description">
              <p>Quản lý nhân sự và lộ trình vận tải hiệu quả, thông minh.</p>
            </div>
          </div>
          {/* Subtle animated dots in the visual area */}
          <div className="visuals-dots"></div>
        </div>

        {/* Right Side: Form */}
        <div className="login-form-section">
          <div className="form-header">
            <h2>Đăng Nhập</h2>
            <p>Vui lòng nhập thông tin để truy cập hệ thống</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="email">Email / Tên đăng nhập</label>
              <div className="input-field-wrapper">
                <svg
                  className="input-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input
                  type="text"
                  id="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Mật khẩu</label>
              <div className="input-field-wrapper">
                <svg
                  className="input-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  type="password"
                  id="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                <span className="checkbox-label">Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="forgot-password">
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              className={`submit-btn ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <span className="spinner"></span>
              ) : (
                "Đăng Nhập"
              )}
            </button>
          </form>
          
          <div className="form-footer">
            <p>
              Bạn chưa có tài khoản? <a href="#">Liên hệ quản trị viên</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
