import { AlertCircle, ChevronDown, BarChart3 } from "lucide-react";
import { useContext, useState } from "react";
import { ProfileContext } from "../contexts/ProfileContext";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/lib/utils";

export default function SalaryTab() {
  const { t } = useTranslation();
  const { profile } = useContext(ProfileContext);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const allConfigs = profile?.compensations || [];
  // Sort directly by createdAt descending
  const sortedConfigs = [...allConfigs].sort((a,b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentConfig = sortedConfigs.length > 0 ? sortedConfigs[selectedIndex] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      
      {/* Cột trái: Bảng tổng hợp năm */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border hover:border-border hover:shadow-md transition-all duration-300 group">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#1E2062]/10 text-[#1E2062] rounded">
                <BarChart3 size={18} />
              </div>
              <h3 className="text-lg font-bold text-[#1E2062]">{t('profile.salaryTab.netSalaryYear', { year: '2026' })}</h3>
            </div>
            
            <div className="relative w-full md:w-32 hover:scale-[1.02] transition-transform">
              <select className="w-full appearance-none bg-muted border border-border text-foreground text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#2E3192]/50 hover:border-[#2E3192]/30 transition-colors font-medium cursor-pointer">
                <option>2026</option>
                <option>2025</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {months.map(month => {
              const isFuture = month > 4; // Mock logic
              return (
                <div 
                  key={month} 
                  className={`relative flex flex-col justify-between p-4 rounded-2xl border transition-all duration-300 ${
                    !isFuture 
                      ? "bg-card border-border hover:border-[#2E3192]/30 hover:shadow-md cursor-pointer group" 
                      : "bg-muted/30 border-dashed border-border/60 opacity-60 grayscale"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold uppercase tracking-wider ${!isFuture ? "text-muted-foreground group-hover:text-[#2E3192] transition-colors" : "text-muted-foreground/50"}`}>
                      {t('profile.salaryTab.month')} {month}
                    </span>
                  </div>
                  <div className="text-right">
                    {!isFuture ? (
                      <span className="text-lg font-bold font-mono text-foreground">0<span className="text-xs font-sans text-muted-foreground ml-1">đ</span></span>
                    ) : (
                      <span className="text-lg font-bold text-muted-foreground/30">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-5 bg-linear-to-r from-muted/50 to-muted/20 rounded-2xl flex flex-col sm:flex-row justify-between items-center border border-border/80 gap-3">
            <span className="font-semibold text-muted-foreground uppercase tracking-wider text-sm">{t('profile.salaryTab.totalNetYear', { year: '2026' })}</span>
            <span className="text-2xl font-mono font-bold text-[#1E2062]">0 <span className="text-sm font-sans text-muted-foreground">VNĐ</span></span>
          </div>
        </div>
      </div>

      {/* Cột phải: Chi tiết mốc lương hiện tại / lịch sử */}
      <div className="lg:col-span-1">
        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border sticky top-6">
          <h3 className="text-lg font-bold text-[#1E2062] mb-6 pb-4 border-b border-border/80">{t('profile.salaryTab.salaryHistory')}</h3>
        
        {!currentConfig ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <AlertCircle size={32} className="mb-3 opacity-30" />
            <p className="text-sm">{t('profile.salaryTab.emptyConfig')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative hover:scale-[1.01] transition-transform">
              <select 
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(Number(e.target.value))}
                className="w-full appearance-none bg-slate-50 border-0 text-[#1E2062] font-bold text-lg rounded-xl px-5 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500/20 hover:bg-slate-100 transition-colors cursor-pointer shadow-sm"
              >
                {sortedConfigs.map((config, idx) => (
                  <option key={config.effectiveFrom || idx} value={idx}>
                    {config.effectiveFrom}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-400">
                <ChevronDown size={20} strokeWidth={3} />
              </div>
            </div>

            {currentConfig.note && (
              <div className="bg-amber-50/50 text-amber-700 px-4 py-3 rounded-xl text-sm italic border border-amber-100/50">
                <span className="font-semibold mr-2">{t('profile.salaryTab.configNote')}</span> 
                {currentConfig.note}
              </div>
            )}

            <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
              <table className="w-full text-left text-sm text-muted-foreground min-w-[400px]">
                <thead className="text-xs uppercase bg-muted/40 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3.5 font-semibold">{t('profile.salaryTab.item')}</th>
                    <th className="px-4 py-3.5 font-semibold text-right w-[160px]">{t('profile.salaryTab.amount')}</th>
                    <th className="px-4 py-3.5 font-semibold max-w-[200px]">{t('profile.salaryTab.note')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {currentConfig.compensationItems.map((item) => (
                    <tr key={`${item.name}-${item.amount}`} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                      <td className="px-4 py-3 text-right font-medium text-foreground">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-4 py-3 italic text-xs text-muted-foreground truncate max-w-[150px]" title={item.note || ""}>
                        {item.note || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
   </div>
  );
}
