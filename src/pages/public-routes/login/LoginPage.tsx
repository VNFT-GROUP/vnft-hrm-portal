import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./LoginPage.css";
import LoginHeader from "./components/LoginHeader/LoginHeader";
import LoginFooter from "./components/LoginFooter/LoginFooter";
import LoginSocialSidebar from "./components/LoginSocialSidebar/LoginSocialSidebar";
import AnimatedLogisticsBackground from "./components/AnimatedLogisticsBackground/AnimatedLogisticsBackground";
import LoginFormsManager from "./components/LoginFormsManager/LoginFormsManager";

export default function LoginPage() {
  const { t } = useTranslation();
  const [formState, setFormState] = useState<'login' | 'forgot_email' | 'forgot_otp' | 'forgot_reset'>('login');
  
  const navigate = useNavigate();

  const currentTitle =
    formState === 'login' ? t('login.title', "VNFT HRM") :
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

          <LoginFormsManager formState={formState} setFormState={setFormState} />
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
