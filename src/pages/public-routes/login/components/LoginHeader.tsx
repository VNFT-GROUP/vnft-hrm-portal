import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import "./LoginHeader.css";

export default function LoginHeader() {
  const { i18n } = useTranslation();

  return (
    <header className="page-header">
      <div className="header-brand-container">
        <img
          src="/logo/Logo-VNFT-1024x1024.webp"
          alt="VNFT Group"
          className="header-mini-logo"
        />
        <span className="header-brand-name">VNFT GROUP</span>
      </div>

      <nav className="header-nav">
        <button 
          onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'vi' : 'en')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 hover:bg-white/80 backdrop-blur-md shadow-sm border border-slate-200 transition-all font-semibold text-slate-700 text-xs"
        >
          <Globe size={14} className="text-[#2E3192]" />
          <span className="uppercase">{i18n.language === 'en' ? 'EN' : 'VN'}</span>
          <img 
            src={i18n.language === 'en' ? 'https://flagcdn.com/w20/gb.png' : 'https://flagcdn.com/w20/vn.png'} 
            width="16" 
            alt="flag" 
            className="shadow-sm rounded-[2px]" 
          />
        </button>
      </nav>
    </header>
  );
}
