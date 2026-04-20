import { AlertCircle, ChevronDown, BarChart3 } from "lucide-react";
import { useContext, useState } from "react";
import { ProfileContext } from "../contexts/ProfileContext";

export default function SalaryTab() {
  const { profile } = useContext(ProfileContext);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const allConfigs = profile?.compensations || [];
  // Sort directly by createdAt descending
  const sortedConfigs = [...allConfigs].sort((a,b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentConfig = sortedConfigs.length > 0 ? sortedConfigs[selectedIndex] : null;

  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount);

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
              <h3 className="text-lg font-bold text-[#1E2062]">Lương thực nhận năm 2026</h3>
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
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="text-xs uppercase bg-muted text-muted-foreground rounded-t-lg">
                <tr>
                  <th className="px-4 py-3 font-semibold rounded-tl-lg">Tháng</th>
                  <th className="px-4 py-3 font-semibold text-right rounded-tr-lg">Lương thực nhận (VNĐ)</th>
                </tr>
              </thead>
              <tbody>
                {months.map(month => (
                  <tr key={month} className="border-b border-slate-50 hover:bg-[#1E2062]/5 transition-colors duration-200 cursor-default">
                    <td className="px-4 py-3 font-medium text-foreground">Tháng {month}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">
                      {month <= 4 ? "0" : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[#2E3192]/5 font-bold text-[#1E2062] rounded-b-lg">
                  <td className="px-4 py-4 rounded-bl-lg">Tổng thu nhập năm</td>
                  <td className="px-4 py-4 text-right font-mono text-base rounded-br-lg">0</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Cột phải: Chi tiết mốc lương hiện tại / lịch sử */}
      <div className="lg:col-span-1">
        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border sticky top-6">
          <h3 className="text-lg font-bold text-[#1E2062] mb-6 pb-4 border-b border-border/80">Lịch sử cấu hình lương</h3>
        
        {!currentConfig ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <AlertCircle size={32} className="mb-3 opacity-30" />
            <p className="text-sm">Chưa có cấu hình lương nào được thiết lập.</p>
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
                  <option key={idx} value={idx}>
                    {config.effectiveFrom}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-400">
                <ChevronDown size={20} strokeWidth={3} />
              </div>
            </div>

            <div className="space-y-0 text-left">
              {currentConfig.compensationItems.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between py-5 border-b border-border/60 last:border-0 gap-3">
                  <div className="space-y-1">
                    <p className="text-base text-foreground font-medium">{item.name}</p>
                    {(item.note || currentConfig.note) && (
                      <p className="text-sm text-slate-500 italic uppercase">
                        {item.note || currentConfig.note}
                      </p>
                    )}
                  </div>
                  <div className="px-5 py-2.5 bg-purple-50 text-purple-600 font-semibold font-mono rounded-xl shrink-0 sm:text-right shadow-sm border border-purple-100/50 min-w-[140px] text-center">
                    {formatCurrency(item.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
   </div>
  );
}
