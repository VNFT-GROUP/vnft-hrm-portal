import React, { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { authService } from "@/lib/apiClient";
import { useGatewayAuthStore } from "@/store/useGatewayAuthStore";
import { Loader2 } from "lucide-react";

/* ── Icon helpers — defined at module scope to satisfy React Compiler ── */
function EyeOpen() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={`w-[18px] h-[18px] transition-transform duration-200 group-hover:translate-x-1 ${className || ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

type FormState = 'login' | 'forgot_email' | 'forgot_otp' | 'forgot_reset';

type LoginFormsProps = {
  formState: FormState;
  setFormState: (state: FormState) => void;
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
  loading: false, email: "", password: "", showPassword: false,
  forgotEmail: "", otp: "", newPassword: "", confirmPassword: "", showNewPassword: false,
};

type Action =
  | { type: 'SET_FIELD'; field: keyof State; value: State[keyof State] }
  | { type: 'RESET_FORGOT' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_FIELD': return { ...state, [action.field]: action.value };
    case 'RESET_FORGOT': return { ...state, loading: false, newPassword: '', confirmPassword: '', forgotEmail: '', otp: '' };
    default: return state;
  }
}

export default function LoginFormsManager({ formState, setFormState }: LoginFormsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const loginAction = useGatewayAuthStore((state) => state.login);

  const [state, dispatch] = useReducer(reducer, initialState);
  const setField = <K extends keyof State>(field: K, value: State[K]) =>
    dispatch({ type: 'SET_FIELD', field, value } as Action);

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
      navigate("/");
    }
  };

  const handleForgotEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setField('loading', true);
    setTimeout(() => { setField('loading', false); setFormState('forgot_otp'); }, 1000);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.otp.length < 6) return;
    setField('loading', true);
    setTimeout(() => { setField('loading', false); setFormState('forgot_reset'); }, 1000);
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
      {/* ── LOGIN FORM ── */}
      {formState === 'login' && (
        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5 flex-1 justify-center animate-in fade-in slide-in-from-bottom-2 duration-300" autoComplete="off">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-email" className="text-[0.7rem] font-bold text-slate-700 tracking-wider uppercase">{t('login.emailLabel', "Email / Tên đăng nhập")}</label>
            <div className="relative flex items-center group/input">
              <svg className="absolute left-3.5 w-4.5 h-4.5 text-slate-400 pointer-events-none transition-colors group-focus-within/input:text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              <input type="text" id="login-email" placeholder={t('login.emailPlaceholder', "vd: user@vnft.vn")}
                className="w-full px-4 py-3 pl-10 bg-slate-50 border-[1.5px] border-indigo-50 rounded-xl text-[0.9rem] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                value={state.email} onChange={(e) => setField('email', e.target.value)} required />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="text-[0.7rem] font-bold text-slate-700 tracking-wider uppercase">{t('login.passwordLabel', "Mật khẩu")}</label>
              <button type="button" className="text-[0.7rem] font-bold text-indigo-500 tracking-wide hover:text-indigo-700 transition-colors focus:outline-none" onClick={() => setFormState('forgot_email')}>
                {t('login.forgot', "Quên mật khẩu?")}
              </button>
            </div>
            <div className="relative flex items-center group/input">
              <svg className="absolute left-3.5 w-4.5 h-4.5 text-slate-400 pointer-events-none transition-colors group-focus-within/input:text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input type={state.showPassword ? "text" : "password"} id="login-password" placeholder="••••••••"
                className="w-full px-4 py-3 pl-10 pr-10 bg-slate-50 border-[1.5px] border-indigo-50 rounded-xl text-[0.9rem] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                value={state.password} onChange={(e) => setField('password', e.target.value)} required />
              <button type="button" className="absolute right-2 w-8 h-8 flex items-center justify-center bg-transparent border-none cursor-pointer text-slate-400 rounded-lg transition-all hover:text-indigo-500 hover:bg-indigo-500/5" onClick={() => setField('showPassword', !state.showPassword)}>
                {state.showPassword ? <EyeOff /> : <EyeOpen />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full group mt-2 p-3.5 bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white border-none rounded-xl text-[0.85rem] font-bold tracking-widest uppercase cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_12px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed" disabled={state.loading}>
            {state.loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>{t('login.submit', "Đăng Nhập")}</span><ArrowRight /></>}
          </button>
        </form>
      )}

      {/* ── FORGOT EMAIL ── */}
      {formState === 'forgot_email' && (
        <form onSubmit={handleForgotEmailSubmit} className="flex flex-col gap-5 flex-1 justify-center animate-in fade-in slide-in-from-bottom-2 duration-300" autoComplete="off">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="forgot-email" className="text-[0.7rem] font-bold text-slate-700 tracking-wider uppercase">{t('login.emailLabel', "Email Nhân Viên")}</label>
            <div className="relative flex items-center group/input">
              <svg className="absolute left-3.5 w-4.5 h-4.5 text-slate-400 pointer-events-none transition-colors group-focus-within/input:text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input type="email" id="forgot-email" placeholder={t('login.emailPlaceholder', "vd: user@vnft.vn")}
                className="w-full px-4 py-3 pl-10 bg-slate-50 border-[1.5px] border-indigo-50 rounded-xl text-[0.9rem] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                value={state.forgotEmail} onChange={(e) => setField('forgotEmail', e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="w-full group mt-2 p-3.5 bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white border-none rounded-xl text-[0.85rem] font-bold tracking-widest uppercase cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_12px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed" disabled={state.loading}>
            {state.loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>{t('login.sendOtp', "Gửi OTP")}</span><ArrowRight /></>}
          </button>
          <button type="button" className="mx-auto bg-transparent border-none text-slate-400 text-xs font-bold tracking-widest uppercase cursor-pointer py-2 hover:text-indigo-500 hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setFormState('login')} disabled={state.loading}>
            {t('login.backToLogin', "Quay lại đăng nhập")}
          </button>
        </form>
      )}

      {/* ── OTP ── */}
      {formState === 'forgot_otp' && (
        <form onSubmit={handleOtpSubmit} className="flex flex-col gap-5 flex-1 justify-center animate-in fade-in slide-in-from-bottom-2 duration-300" autoComplete="off">
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.7rem] font-bold text-slate-700 tracking-wider uppercase text-center">{t('login.otpLabel', "Mã OTP")}</label>
            <div className="flex justify-center items-center py-2">
              <div className="flex gap-2 justify-between w-full max-w-[300px]">
                {Array.from({ length: 6 }).map((_, i) => (
                  <input key={i} type="text" maxLength={1} className="w-11 h-12 bg-slate-50 border-[1.5px] border-indigo-50 rounded-xl text-lg font-bold text-slate-800 text-center outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    value={state.otp[i] || ''}
                    onChange={(e) => {
                      const arr = state.otp.split('');
                      arr[i] = e.target.value.slice(-1);
                      setField('otp', arr.join(''));
                      if (e.target.value && e.target.nextElementSibling) {
                        (e.target.nextElementSibling as HTMLInputElement).focus();
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <button type="submit" className="w-full group mt-2 p-3.5 bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white border-none rounded-xl text-[0.85rem] font-bold tracking-widest uppercase cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_12px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed" disabled={state.loading}>
            {state.loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>{t('login.verifyOtp', "Xác nhận OTP")}</span><ArrowRight /></>}
          </button>
          <button type="button" className="mx-auto bg-transparent border-none text-slate-400 text-xs font-bold tracking-widest uppercase cursor-pointer py-2 hover:text-indigo-500 hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setFormState('login')} disabled={state.loading}>
            {t('login.backToLogin', "Quay lại đăng nhập")}
          </button>
        </form>
      )}

      {/* ── RESET PASSWORD ── */}
      {formState === 'forgot_reset' && (
        <form onSubmit={handleResetPasswordSubmit} className="flex flex-col gap-5 flex-1 justify-center animate-in fade-in slide-in-from-bottom-2 duration-300" autoComplete="off">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="new-password" className="text-[0.7rem] font-bold text-slate-700 tracking-wider uppercase">{t('login.newPasswordLabel', "Mật khẩu mới")}</label>
            <div className="relative flex items-center group/input">
              <svg className="absolute left-3.5 w-4.5 h-4.5 text-slate-400 pointer-events-none transition-colors group-focus-within/input:text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input type={state.showNewPassword ? "text" : "password"} id="new-password" placeholder={t('login.newPasswordPlaceholder', "••••••••")}
                className="w-full px-4 py-3 pl-10 pr-10 bg-slate-50 border-[1.5px] border-indigo-50 rounded-xl text-[0.9rem] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                value={state.newPassword} onChange={(e) => setField('newPassword', e.target.value)} required />
              <button type="button" className="absolute right-2 w-8 h-8 flex items-center justify-center bg-transparent border-none cursor-pointer text-slate-400 rounded-lg transition-all hover:text-indigo-500 hover:bg-indigo-500/5" onClick={() => setField('showNewPassword', !state.showNewPassword)}>
                {state.showNewPassword ? <EyeOff /> : <EyeOpen />}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm-password" className="text-[0.7rem] font-bold text-slate-700 tracking-wider uppercase">{t('login.confirmPasswordLabel', "Xác nhận mật khẩu")}</label>
            <div className="relative flex items-center group/input">
              <svg className="absolute left-3.5 w-4.5 h-4.5 text-slate-400 pointer-events-none transition-colors group-focus-within/input:text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <input type={state.showNewPassword ? "text" : "password"} id="confirm-password" placeholder={t('login.confirmPasswordPlaceholder', "••••••••")}
                className="w-full px-4 py-3 pl-10 bg-slate-50 border-[1.5px] border-indigo-50 rounded-xl text-[0.9rem] text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                value={state.confirmPassword} onChange={(e) => setField('confirmPassword', e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="w-full group mt-2 p-3.5 bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white border-none rounded-xl text-[0.85rem] font-bold tracking-widest uppercase cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_12px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed" disabled={state.loading}>
            {state.loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>{t('login.updatePassword', "Cập nhật mật khẩu")}</span><ArrowRight /></>}
          </button>
          <button type="button" className="mx-auto bg-transparent border-none text-slate-400 text-xs font-bold tracking-widest uppercase cursor-pointer py-2 hover:text-indigo-500 hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setFormState('login')} disabled={state.loading}>
            {t('login.backToLogin', "Quay lại đăng nhập")}
          </button>
        </form>
      )}
    </>
  );
}
