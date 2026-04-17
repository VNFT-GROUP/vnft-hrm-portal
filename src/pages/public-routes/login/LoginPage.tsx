import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore";
import "./LoginPage.css";
import LoginHeader from "./components/LoginHeader/LoginHeader";
import LoginFooter from "./components/LoginFooter/LoginFooter";
import LoginSocialSidebar from "./components/LoginSocialSidebar/LoginSocialSidebar";
import AnimatedLogisticsBackground from "./components/AnimatedLogisticsBackground/AnimatedLogisticsBackground";

function OtpInput({ length = 6, value, onChange }: { length?: number; value: string; onChange: (v: string) => void }) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otpArray = Array(length).fill("");
  value.split('').slice(0, length).forEach((d, i) => {
    otpArray[i] = d;
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (!val) return;

    const newOtp = [...otpArray];
    newOtp[index] = val.slice(-1);
    onChange(newOtp.join(''));

    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otpArray];
      newOtp[index] = "";
      onChange(newOtp.join(''));
      if (index > 0 && !otpArray[index]) {
        // move back if current is empty
        inputRefs.current[index - 1]?.focus();
      } else if (index > 0 && otpArray[index]) {
        // delete current and stay
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").replace(/[^0-9]/g, '').slice(0, length);
    if (!pastedData) return;

    const newOtp = Array(length).fill("");
    pastedData.split('').forEach((d, i) => {
      newOtp[i] = d;
    });
    onChange(newOtp.join(''));

    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="otp-input-group">
      {otpArray.map((d, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          className="otp-box"
          required={i === 0}
        />
      ))}
    </div>
  );
}

export default function LoginPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<'login' | 'forgot_email' | 'forgot_otp' | 'forgot_reset'>('login');

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const navigate = useNavigate();
  const loginAction = useAuthStore((state) => state.login);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let authData = null;
    try {
      const response = await authService.login({ username: email, password });
      authData = response.data;
    } catch (error: unknown) {
      // Phía apiClient (Interceptor) đã lo việc bắn ra Toast Error thông báo rồi, ta chỉ console log
      console.error("Lỗi xảy ra lúc login:", error);
    } finally {
      setLoading(false);
    }

    if (authData && authData.accessToken && authData.user) {
      loginAction(authData.user, authData.accessToken);
      toast.success("Đăng nhập thành công!");
      navigate("/app");
    }
  };

  const handleForgotEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFormState('forgot_otp');
    }, 1000);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFormState('forgot_reset');
    }, 1000);
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Cập nhật mật khẩu thành công!");
      setFormState('login');
      setNewPassword('');
      setConfirmPassword('');
      setForgotEmail('');
      setOtp('');
    }, 1000);
  };

  const currentTitle =
    formState === 'login' ? "VNFT Logistics" :
      formState === 'forgot_email' ? t('login.forgotTitle', "QUÊN MẬT KHẨU") :
        formState === 'forgot_otp' ? t('login.otpTitle', "XÁC NHẬN OTP") :
          t('login.resetTitle', "MẬT KHẨU MỚI");

  const currentTagline =
    formState === 'login' ? t('login.tagline') :
      formState === 'forgot_email' ? t('login.forgotTagline', "KHÔI PHỤC TÀI KHOẢN") :
        formState === 'forgot_otp' ? t('login.otpTagline', "XÁC NHẬN MÃ ĐƯỢC GỬI VỀ EMAIL") :
          t('login.resetTagline', "TẠO MẬT KHẨU BẢO MẬT");

  const isForgotFlow = formState.startsWith('forgot_');
  const currentStep = formState === 'forgot_email' ? 1 : formState === 'forgot_otp' ? 2 : formState === 'forgot_reset' ? 3 : 0;

  useEffect(() => {
    setTimeout(() => {
      document.getElementById('login-form-target')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  }, []);

  return (
    <div className="login-page">
      <AnimatedLogisticsBackground />
      {/* Global Page Header */}
      <LoginHeader />

      {/* Floating Social Sidebar */}
      <LoginSocialSidebar />

      {/* 2. Login Form Wrapper */}
      <div className="login-wrapper" id="login-form-target" style={{ marginTop: '5vh' }}>
        {/* Title area */}
        <div className="login-heading">
          <h1 className="login-title">{currentTitle}</h1>
          <p className="login-tagline">{currentTagline}</p>
          <div className="heading-rule" />
        </div>

        {/* Form card */}
        <div className="login-card">
          {isForgotFlow && (
            <div className="forgot-progress-container fade-in">
              <div className="forgot-progress-bar">
                <div className="forgot-progress-fill" style={{ width: `${(currentStep / 3) * 100}%` }} />
              </div>
              <div className="forgot-progress-steps">
                <span className={currentStep >= 1 ? "active" : ""}>Email</span>
                <span className={currentStep >= 2 ? "active" : ""}>OTP</span>
                <span className={currentStep >= 3 ? "active" : ""}>Mật khẩu</span>
              </div>
            </div>
          )}

          {formState === 'login' && (
            <form onSubmit={handleLoginSubmit} className="login-form fade-in" autoComplete="off">
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
                  <button type="button" className="forgot-link" onClick={() => setFormState('forgot_email')}>
                    {t('login.forgot')}
                  </button>
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
          )}

          {formState === 'forgot_email' && (
            <form onSubmit={handleForgotEmailSubmit} className="login-form fade-in" autoComplete="off">
              <div className="field">
                <label htmlFor="forgot-email" className="field-label">
                  {t('login.emailLabel', "EMAIL NHÂN VIÊN")}
                </label>
                <div className="field-input-wrap">
                  <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    type="email"
                    id="forgot-email"
                    placeholder={t('login.emailPlaceholder', "vd: employee@vnft.vn")}
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`submit-btn${loading ? " submit-btn--loading" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-spinner" />
                ) : (
                  <>
                    {t('login.sendOtp', "GỬI MÃ OTP")}
                    <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
              <button type="button" className="btn-back" onClick={() => setFormState('login')} disabled={loading}>
                {t('login.backToLogin', "QUAY LẠI ĐĂNG NHẬP")}
              </button>
            </form>
          )}

          {formState === 'forgot_otp' && (
            <form onSubmit={handleOtpSubmit} className="login-form fade-in" autoComplete="off">
              <div className="field">
                <label htmlFor="forgot-otp" className="field-label">
                  {t('login.otpLabel', "MÃ OTP")}
                </label>
                <div className="otp-container">
                  <OtpInput length={6} value={otp} onChange={setOtp} />
                </div>
              </div>

              <button
                type="submit"
                className={`submit-btn${loading ? " submit-btn--loading" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-spinner" />
                ) : (
                  <>
                    {t('login.verifyOtp', "XÁC NHẬN MÃ")}
                    <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </>
                )}
              </button>
              <button type="button" className="btn-back" onClick={() => setFormState('login')} disabled={loading}>
                {t('login.backToLogin', "QUAY LẠI ĐĂNG NHẬP")}
              </button>
            </form>
          )}

          {formState === 'forgot_reset' && (
            <form onSubmit={handleResetPasswordSubmit} className="login-form fade-in" autoComplete="off">
              <div className="field">
                <label htmlFor="new-password" className="field-label">
                  {t('login.newPasswordLabel', "MẬT KHẨU MỚI")}
                </label>
                <div className="field-input-wrap">
                  <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="new-password"
                    placeholder={t('login.newPasswordPlaceholder', "••••••••")}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
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

              <div className="field">
                <label htmlFor="confirm-password" className="field-label">
                  {t('login.confirmPasswordLabel', "XÁC NHẬN MẬT KHẨU")}
                </label>
                <div className="field-input-wrap">
                  <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="confirm-password"
                    placeholder={t('login.confirmPasswordPlaceholder', "••••••••")}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`submit-btn${loading ? " submit-btn--loading" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-spinner" />
                ) : (
                  <>
                    {t('login.updatePassword', "CẬP NHẬT MẬT KHẨU")}
                    <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </>
                )}
              </button>
              <button type="button" className="btn-back" onClick={() => setFormState('login')} disabled={loading}>
                {t('login.backToLogin', "QUAY LẠI ĐĂNG NHẬP")}
              </button>
            </form>
          )}
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
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
    </div>
  );
}
