import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export default function LoginHeader() {
  const { i18n } = useTranslation();

  return (
    <header className="fixed top-0 left-0 w-full h-[72px] flex items-center justify-between px-6 md:px-10 z-50 bg-[#2E3192] shadow-md border-b border-[#1E2062]">
      <div className="flex items-center gap-3">
        <img
          src="/logo/Logo-VNFT-1024x1024.webp"
          alt="VNFT Group"
          className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-md bg-white p-0.5"
        />
        <span className="text-sm md:text-lg font-bold text-white tracking-widest uppercase">
          VNFT GROUP
        </span>
      </div>

      <nav className="flex items-center gap-4">
        <button 
          onClick={() => {
            const nextLang = i18n.language === 'en' ? 'zh' : (i18n.language === 'zh' ? 'vi' : 'en');
            i18n.changeLanguage(nextLang);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all font-medium text-sm border border-white/10"
        >
          <Globe size={16} />
          <span className="uppercase tracking-wider text-xs">{i18n.language === 'zh' ? 'CN' : (i18n.language === 'en' ? 'EN' : 'VN')}</span>
          <img 
            src={i18n.language === 'zh' ? 'https://flagcdn.com/w20/cn.png' : (i18n.language === 'en' ? 'https://flagcdn.com/w20/gb.png' : 'https://flagcdn.com/w20/vn.png')} 
            width="18" 
            alt="flag" 
            className="shadow-sm rounded-[2px]" 
          />
        </button>
      </nav>
    </header>
  );
}
