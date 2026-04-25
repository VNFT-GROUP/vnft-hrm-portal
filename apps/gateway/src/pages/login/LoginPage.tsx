import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LoginHeader from "./components/LoginHeader/LoginHeader";
import LoginFooter from "./components/LoginFooter/LoginFooter";
import LoginSocialSidebar from "./components/LoginSocialSidebar/LoginSocialSidebar";
import AnimatedLogisticsBackground from "./components/AnimatedLogisticsBackground/AnimatedLogisticsBackground";
import AnimatedCRMBackground from "./components/AnimatedCRMBackground/AnimatedCRMBackground";
import LoginFormsManager from "./components/LoginFormsManager/LoginFormsManager";

export default function LoginPage() {
  const { t } = useTranslation();
  const [formState, setFormState] = useState<'login' | 'forgot_email' | 'forgot_otp' | 'forgot_reset'>('login');
  
  // Randomly select background on mount
  const [BackgroundComponent] = useState(() => Math.random() > 0.5 ? AnimatedLogisticsBackground : AnimatedCRMBackground);

  const currentTitle =
    formState === 'login' ? t('login.title', "VNFT Portal") :
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
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 via-blue-100 to-blue-200 font-sans px-4 sm:px-6 overflow-y-hidden">
      <BackgroundComponent />
      <LoginHeader />
      <LoginSocialSidebar />

      <div className="relative z-10 flex flex-col items-center w-full max-w-md" id="login-form-target">
        <div className="text-center mb-5 w-full">
          <h1 className="text-2xl md:text-[1.5rem] font-extrabold text-[#1e3a8a] mb-1.5 tracking-wide leading-snug">{currentTitle}</h1>
          <p className="text-[0.72rem] font-bold text-[#4f46e5] tracking-[0.2em] uppercase mb-3">{currentTagline}</p>
          <div className="w-full max-w-[400px] h-[3px] mx-auto rounded-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />
        </div>

        <div className="w-full bg-white/20 backdrop-blur-xl border border-white/40 p-7 sm:p-9 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-3xl animate-in fade-in zoom-in-95 duration-500 flex flex-col">
          {isForgotFlow && (
            <div className="w-full mb-5 px-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="w-full h-1.5 bg-indigo-500/10 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-in-out" style={{ width: `${(currentStep / 3) * 100}%` }} />
              </div>
              <div className="flex justify-between text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider">
                <span className={currentStep >= 1 ? "text-indigo-500 transition-colors" : "transition-colors"}>Email</span>
                <span className={currentStep >= 2 ? "text-indigo-500 transition-colors" : "transition-colors"}>OTP</span>
                <span className={currentStep >= 3 ? "text-indigo-500 transition-colors" : "transition-colors"}>Mật khẩu</span>
              </div>
            </div>
          )}
          <LoginFormsManager formState={formState} setFormState={setFormState} />
        </div>
      </div>
      <LoginFooter />
    </div>
  );
}
