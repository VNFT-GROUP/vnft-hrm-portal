import { m  } from 'framer-motion';
import { Globe, Palette, Type, Clock, MousePointer2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLayoutStore } from "@/store/useLayoutStore";
import { Label } from "@/components/ui/label";
import { ServerSalarySettingsBlock } from "./components/ServerSalarySettingsBlock";

export default function SettingsPage() {
  const sidebarTheme = useLayoutStore((state) => state.sidebarTheme);
  const setSidebarTheme = useLayoutStore((state) => state.setSidebarTheme);
  const appFont = useLayoutStore((state) => state.appFont);
  const setAppFont = useLayoutStore((state) => state.setAppFont);
  const timezone = useLayoutStore((state) => state.timezone);
  const setTimezone = useLayoutStore((state) => state.setTimezone);
  const cursorStyle = useLayoutStore((state) => state.cursorStyle);
  const setCursorStyle = useLayoutStore((state) => state.setCursorStyle);

  const { t, i18n } = useTranslation();
  const [now, setNow] = useState(new Date());

  const fullTimezones = [
    "Asia/Ho_Chi_Minh",      // Vietnam & Cambodia
    "Asia/Shanghai",         // Shenzhen, China
    "America/New_York",      // New York, NY (EST)
    "America/Chicago",       // Houston, TX (CST)
    "America/Edmonton",      // Calgary, AB (MST)
    "America/Vancouver",     // Vancouver, BC & California (PST)
  ];

  useEffect(() => {
    // Update time every 10 seconds to keep dropdown time current
    const interval = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  const timezoneOptions = fullTimezones.map(tz => {
    try {
      const timeString = now.toLocaleTimeString('vi-VN', { timeZone: tz, hour: '2-digit', minute: '2-digit' });
      const formatParts = new Intl.DateTimeFormat('en', { timeZone: tz, timeZoneName: 'shortOffset' }).formatToParts(now);
      const tzNamePart = formatParts.find(p => p.type === 'timeZoneName');
      const offsetPart = tzNamePart ? tzNamePart.value : '';
      
      const popPart = tz.split('/').pop();
      let city = popPart ? popPart.replace(/_/g, ' ') : tz;
      
      // Custom display names based on VNFT office locations
      if (tz === 'Asia/Ho_Chi_Minh') city = t('settings.tzSection.hcm');
      if (tz === 'Asia/Shanghai') city = t('settings.tzSection.shanghai');
      if (tz === 'America/New_York') city = t('settings.tzSection.ny');
      if (tz === 'America/Chicago') city = t('settings.tzSection.chicago');
      if (tz === 'America/Edmonton') city = t('settings.tzSection.edmonton');
      if (tz === 'America/Vancouver') city = t('settings.tzSection.vancouver');

      return {
        value: tz,
        city,
        offsetPart,
        timeString
      };
    } catch {
      return { value: tz, city: tz, offsetPart: '', timeString: '' };
    }
  });

  const themePresets = [
    { id: 'theme-midnight', name: 'Midnight', color1: '#161845', color2: '#2E3192' },
    { id: 'theme-ocean', name: 'Ocean Depth', color1: '#0c4a6e', color2: '#0284c7' },
    { id: 'theme-emerald', name: 'Emerald', color1: '#064E3B', color2: '#059669' },
    { id: 'theme-ruby', name: 'Ruby', color1: '#4c0519', color2: '#be123c' },
    { id: 'theme-obsidian', name: 'Obsidian', color1: '#09090b', color2: '#27272a' },
  ];

  const fontPresets = [
    { id: 'font-roboto', name: 'Roboto', desc: t('settings.fontSection.robotoDesc') },
    { id: 'font-inter', name: 'Inter', desc: t('settings.fontSection.interDesc') },
    { id: 'font-be-vietnam-pro', name: 'Be Vietnam Pro', desc: t('settings.fontSection.beVietnamDesc') },
    { id: 'font-montserrat', name: 'Montserrat', desc: t('settings.fontSection.montserratDesc') },
    { id: 'font-nunito', name: 'Nunito', desc: t('settings.fontSection.nunitoDesc') },
  ];

  const cursorPresets = [
    { id: 'cursor-default', name: t('settings.cursorSection.default'), icon: <MousePointer2 size={24} className="text-muted-foreground" /> },
    { id: 'cursor-vnft', name: t('settings.cursorSection.vnft'), icon: <MousePointer2 fill="#F7941D" stroke="#2E3192" size={24} className="text-[#2E3192]" /> },
    { id: 'cursor-dark', name: t('settings.cursorSection.dark'), icon: <MousePointer2 fill="#1E2062" stroke="white" size={24} className="text-[#1E2062]" /> },
    { id: 'cursor-neon', name: t('settings.cursorSection.neon'), icon: <MousePointer2 fill="#0ea5e9" stroke="white" size={24} className="text-[#0ea5e9] drop-shadow-[0_0_5px_rgba(14,165,233,0.8)]" /> },
    { id: 'cursor-rose', name: t('settings.cursorSection.rose'), icon: <MousePointer2 fill="#f43f5e" stroke="white" size={24} className="text-[#f43f5e]" /> },
  ];





  return (
    <div className="p-4 md:p-8 w-full min-h-full flex flex-col gap-8">
      {/* Header */}
      <m.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="text-2xl md:text-4xl font-bold text-[#1E2062] uppercase tracking-wide">
          {t("settings.title")}
        </h1>
        <p className="text-muted-foreground mt-2 text-base md:text-lg">
          {t("settings.subtitle")}
        </p>
      </m.div>

      {/* Settings Sections */}
      <div className="flex flex-col gap-6">

        {/* Section 1: Language Settings */}
        <m.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="p-2.5 bg-[#F7941D]/10 text-[#F7941D] rounded-xl">
              <Globe size={24} />
            </div>
            <h2 className="text-xl font-bold text-[#1E2062]">{t("settings.langSection.title")}</h2>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-base font-semibold">
                  {t("settings.langSection.label")}
                </Label>
                <p className="text-sm text-muted-foreground max-w-xl">
                  {t("settings.langSection.desc")}
                </p>
              </div>
              <div className="flex bg-muted p-1 rounded-lg border border-border">
                <button 
                  onClick={() => i18n.changeLanguage('vi')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all ${(i18n.language === 'vi' || i18n.language === 'vi-VN') ? 'bg-background shadow-sm text-[#2E3192]' : 'text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10'}`}
                >
                  <img src="https://flagcdn.com/w20/vn.png" width="20" alt="VN" className="rounded-sm shadow-sm" /> Tiếng Việt
                </button>
                <button 
                  onClick={() => i18n.changeLanguage('en')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all ${(i18n.language && i18n.language.startsWith('en')) ? 'bg-background shadow-sm text-[#2E3192]' : 'text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10'}`}
                >
                  <img src="https://flagcdn.com/w20/gb.png" width="20" alt="EN" className="rounded-sm shadow-sm" /> English
                </button>
                <button 
                  onClick={() => i18n.changeLanguage('zh')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all ${(i18n.language && i18n.language.startsWith('zh')) ? 'bg-background shadow-sm text-[#2E3192]' : 'text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10'}`}
                >
                  <img src="https://flagcdn.com/w20/cn.png" width="20" alt="CN" className="rounded-sm shadow-sm" /> 中文
                </button>
              </div>
            </div>
          </div>
        </m.section>

        {/* Section 1.5: Timezone Settings */}
        <m.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="p-2.5 bg-[#8b5cf6]/10 text-[#8b5cf6] rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h2 className="text-xl font-bold text-[#1E2062]">{t("settings.tzSection.title")}</h2>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-base font-semibold">
                  {t("settings.tzSection.label")}
                </Label>
                <p className="text-sm text-muted-foreground max-w-xl">
                  {t("settings.tzSection.desc")}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2 w-full">
                {timezoneOptions.map(tz => (
                  <button
                    key={tz.value}
                    onClick={() => setTimezone(tz.value)}
                    className={`relative p-4 rounded-xl border flex flex-col items-start transition-all duration-200 text-left w-full ${
                      timezone === tz.value 
                        ? 'border-[#8b5cf6] bg-[#8b5cf6]/5 shadow-sm' 
                        : 'border-border bg-card hover:bg-muted/50 hover:border-muted-foreground/30'
                    }`}
                  >
                    <div className="flex w-full items-start justify-between gap-3">
                      <span 
                        className={`text-[15px] font-semibold leading-relaxed pr-2 ${
                          timezone === tz.value ? 'text-[#8b5cf6]' : 'text-[#1E2062]'
                        }`} 
                      >
                        {tz.city}
                      </span>
                      
                      <div className="flex items-center gap-1.5 shrink-0 bg-muted/50 px-2.5 py-1 rounded-md border border-border/40 text-foreground tabular-nums shadow-sm">
                        <Clock size={16} className="text-muted-foreground opacity-80" strokeWidth={2.5} />
                        <span className="font-bold text-lg tracking-tight mt-px">{tz.timeString}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between w-full mt-3">
                      <span className="text-sm font-medium text-muted-foreground font-mono bg-muted/60 px-2 py-0.5 rounded border border-border/50 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                        {tz.offsetPart}
                      </span>
                      
                      {timezone === tz.value && (
                         <div className="flex items-center justify-center w-[22px] h-[22px] bg-[#8b5cf6] text-white rounded-full shadow-sm ml-auto transition-all animate-in fade-in zoom-in duration-200">
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                         </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </m.section>

        {/* Section 2: Sidebar Theme Settings */}
        <m.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="p-2.5 bg-[#db2777]/10 text-[#db2777] rounded-xl">
              <Palette size={24} />
            </div>
            <h2 className="text-xl font-bold text-[#1E2062]">{t("settings.themeSection.title")}</h2>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-base font-semibold">
                  {t("settings.themeSection.label")}
                </Label>
                <p className="text-sm text-muted-foreground max-w-xl">
                  {t("settings.themeSection.desc")}
                </p>
              </div>
              <div className="flex flex-wrap gap-4 mt-2">
                {themePresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSidebarTheme(preset.id)}
                    className={`relative w-28 h-24 rounded-2xl flex flex-col items-center justify-end pb-3 transition-all duration-300 border-2 overflow-hidden ${
                      sidebarTheme === preset.id 
                        ? 'border-[#F7941D] scale-105 shadow-lg' 
                        : 'border-transparent shadow-sm hover:scale-105 hover:shadow-md'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${preset.color1}, ${preset.color2})`
                    }}
                  >
                    <span className="text-xs font-semibold text-white tracking-wide text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] z-10 w-full truncate px-2">
                      {preset.name}
                    </span>
                    {sidebarTheme === preset.id && (
                       <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 bg-[#F7941D] text-white rounded-full z-10 shadow-sm">
                         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                       </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </m.section>

        {/* Section 3: Font Settings */}
        <m.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="p-2.5 bg-[#059669]/10 text-[#059669] rounded-xl">
              <Type size={24} />
            </div>
            <h2 className="text-xl font-bold text-[#1E2062]">{t("settings.fontSection.title")}</h2>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
               <Label className="text-base font-semibold">
                 {t("settings.fontSection.label")}
               </Label>
               <p className="text-sm text-muted-foreground max-w-xl">
                 {t("settings.fontSection.desc")}
               </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {fontPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setAppFont(preset.id)}
                    className={`relative p-4 rounded-xl border flex flex-col items-start gap-1 transition-all duration-200 text-left ${
                      appFont === preset.id 
                        ? 'border-[#2E3192] bg-[#2E3192]/5 shadow-sm' 
                        : 'border-border bg-card hover:bg-muted/50 hover:border-muted-foreground/30'
                    }`}
                  >
                    <span 
                      className={`text-lg font-semibold ${preset.id} text-[#1E2062]`} 
                    >
                      {preset.name}
                    </span>
                    <span className={`text-xs text-muted-foreground ${preset.id}`}>
                      {preset.desc}
                    </span>
                    {appFont === preset.id && (
                       <div className="absolute top-4 right-4 flex items-center justify-center w-5 h-5 bg-[#2E3192] text-white rounded-full">
                         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                       </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </m.section>

        {/* Section 3.5: Cursor Settings */}
        <m.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
          className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="p-2.5 bg-[#f43f5e]/10 text-[#f43f5e] rounded-xl">
              <MousePointer2 size={24} />
            </div>
            <h2 className="text-xl font-bold text-[#1E2062]">{t("settings.cursorSection.title")}</h2>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
               <Label className="text-base font-semibold">
                 {t("settings.cursorSection.label")}
               </Label>
               <p className="text-sm text-muted-foreground max-w-xl">
                 {t("settings.cursorSection.desc")}
               </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-2">
                {cursorPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setCursorStyle(preset.id)}
                    className={`relative p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all duration-200 text-center ${
                      cursorStyle === preset.id 
                        ? 'border-[#f43f5e] bg-[#f43f5e]/5 shadow-sm' 
                        : 'border-border bg-card hover:bg-muted/50 hover:border-muted-foreground/30'
                    }`}
                  >
                    <div className="h-8 flex items-center justify-center text-muted-foreground">
                      {preset.icon}
                    </div>
                    <span 
                      className={`text-sm font-semibold ${cursorStyle === preset.id ? 'text-[#1E2062]' : 'text-muted-foreground'}`} 
                    >
                      {preset.name}
                    </span>
                    {cursorStyle === preset.id && (
                       <div className="absolute top-2 right-2 flex items-center justify-center w-4 h-4 bg-[#f43f5e] text-white rounded-full">
                         <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                       </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </m.section>

        {/* Section 4: Server Salary Settings */}
        <ServerSalarySettingsBlock />

        
      </div>
    </div>
  );
}
