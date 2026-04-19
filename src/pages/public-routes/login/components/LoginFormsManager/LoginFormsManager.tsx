import React, { useReducer } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore";
import OtpInput from "../../components/OtpInput/OtpInput";

type LoginFormsProps = {
  formState: 'login' | 'forgot_email' | 'forgot_otp' | 'forgot_reset';
  setFormState: (state: 'login' | 'forgot_email' | 'forgot_otp' | 'forgot_reset') => void;
};

type State = {
  loading: boolean;
  email: string;
  password: string;
  showPassword: boolean;
  forgotEmail: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
  showNewPassword: boolean;
};

const initialState: State = {
  loading: false,
  email: "",
  password: "",
  showPassword: false,
  forgotEmail: "",
  otp: "",
  newPassword: "",
  confirmPassword: "",
  showNewPassword: false,
};

type Action = 
  | { type: 'SET_FIELD'; field: keyof State; value: State[keyof State] }
  | { type: 'RESET_FORGOT' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET_FORGOT':
      return { ...state, loading: false, newPassword: '', confirmPassword: '', forgotEmail: '', otp: '' };
    default:
      return state;
  }
}

export default function LoginFormsManager({ formState, setFormState }: LoginFormsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const loginAction = useAuthStore((state) => state.login);

  const [state, dispatch] = useReducer(reducer, initialState);

  const setField = <K extends keyof State>(field: K, value: State[K]) => dispatch({ type: 'SET_FIELD', field, value } as Action);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setField('loading', true);
    let authData = null;
    try {
      const response = await authService.login({ username: state.email, password: state.password });
      authData = response.data;
    } catch (error: unknown) {
      console.error("Lỗi xảy ra lúc login:", error);
      setField('loading', false);
    }
    setField('loading', false);

    if (authData && authData.accessToken && authData.user) {
      loginAction(authData.user, authData.accessToken);
      toast.success("Đăng nhập thành công!");
      navigate("/app");
    }
  };

  const handleForgotEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setField('loading', true);
    setTimeout(() => {
      setField('loading', false);
      setFormState('forgot_otp');
    }, 1000);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.otp.length < 6) return;
    setField('loading', true);
    setTimeout(() => {
      setField('loading', false);
      setFormState('forgot_reset');
    }, 1000);
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.newPassword !== state.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    setField('loading', true);
    setTimeout(() => {
      alert("Cập nhật mật khẩu thành công!");
      dispatch({ type: 'RESET_FORGOT' });
      setFormState('login');
    }, 1000);
  };

  return (
    <>
      {formState === 'login' && (
        <form onSubmit={handleLoginSubmit} className="login-form fade-in" autoComplete="off">
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
                value={state.email}
                onChange={(e) => setField('email', e.target.value)}
                required
              />
            </div>
          </div>

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
                type={state.showPassword ? "text" : "password"}
                id="login-password"
                placeholder="••••••••"
                value={state.password}
                onChange={(e) => setField('password', e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setField('showPassword', !state.showPassword)}
                aria-label={state.showPassword ? "Hide password" : "Show password"}
              >
                {state.showPassword ? (
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

          <button
            type="submit"
            className={`submit-btn${state.loading ? " submit-btn--loading" : ""}`}
            disabled={state.loading}
          >
            {state.loading ? (
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
                value={state.forgotEmail}
                onChange={(e) => setField('forgotEmail', e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`submit-btn${state.loading ? " submit-btn--loading" : ""}`}
            disabled={state.loading}
          >
            {state.loading ? (
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
          <button type="button" className="btn-back" onClick={() => setFormState('login')} disabled={state.loading}>
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
              <OtpInput length={6} value={state.otp} onChange={(v) => setField('otp', v)} />
            </div>
          </div>

          <button
            type="submit"
            className={`submit-btn${state.loading ? " submit-btn--loading" : ""}`}
            disabled={state.loading}
          >
            {state.loading ? (
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
          <button type="button" className="btn-back" onClick={() => setFormState('login')} disabled={state.loading}>
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
                type={state.showNewPassword ? "text" : "password"}
                id="new-password"
                placeholder={t('login.newPasswordPlaceholder', "••••••••")}
                value={state.newPassword}
                onChange={(e) => setField('newPassword', e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setField('showNewPassword', !state.showNewPassword)}
              >
                {state.showNewPassword ? (
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
                type={state.showNewPassword ? "text" : "password"}
                id="confirm-password"
                placeholder={t('login.confirmPasswordPlaceholder', "••••••••")}
                value={state.confirmPassword}
                onChange={(e) => setField('confirmPassword', e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`submit-btn${state.loading ? " submit-btn--loading" : ""}`}
            disabled={state.loading}
          >
            {state.loading ? (
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
          <button type="button" className="btn-back" onClick={() => setFormState('login')} disabled={state.loading}>
            {t('login.backToLogin', "QUAY LẠI ĐĂNG NHẬP")}
          </button>
        </form>
      )}
    </>
  );
}
