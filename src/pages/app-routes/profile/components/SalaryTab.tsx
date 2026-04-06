import { Wallet, BarChart3 } from "lucide-react";

export default function SalaryTab() {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      
      {/* Cột trái: Bảng tổng hợp năm */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 group">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#1E2062]/10 text-[#1E2062] rounded">
                <BarChart3 size={18} />
              </div>
              <h3 className="text-lg font-bold text-[#1E2062]">Lương thực nhận năm 2026</h3>
            </div>
            
            <div className="relative w-full md:w-32 hover:scale-[1.02] transition-transform">
              <select className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#2E3192]/50 hover:border-[#2E3192]/30 transition-colors font-medium cursor-pointer">
                <option>2026</option>
                <option>2025</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs uppercase bg-slate-50 text-slate-500 rounded-t-lg">
                <tr>
                  <th className="px-4 py-3 font-semibold rounded-tl-lg">Tháng</th>
                  <th className="px-4 py-3 font-semibold text-right rounded-tr-lg">Lương thực nhận (VNĐ)</th>
                </tr>
              </thead>
              <tbody>
                {months.map(month => (
                  <tr key={month} className="border-b border-slate-50 hover:bg-[#1E2062]/5 transition-colors duration-200 cursor-default">
                    <td className="px-4 py-3 font-medium text-slate-700">Tháng {month}</td>
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

      {/* Cột phải: Chi tiết từng tháng */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 group sticky top-6">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <div className="p-1.5 bg-[#F7941D]/10 text-[#F7941D] rounded">
              <Wallet size={18} />
            </div>
            <h3 className="text-lg font-bold text-[#1E2062]">Chi tiết lương Tháng 4 2026</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-200">
              <span className="text-sm font-medium text-slate-500">Phòng ban</span>
              <span className="text-sm font-bold text-slate-800">HR & ADM</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-200">
              <span className="text-sm font-medium text-slate-500">Lương cơ bản</span>
              <span className="text-sm font-semibold font-mono text-slate-700">0</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-200">
              <span className="text-sm font-medium text-slate-500">Lương vị trí</span>
              <span className="text-sm font-semibold font-mono text-slate-700">0</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-200">
              <span className="text-sm font-medium text-slate-500">Target</span>
              <span className="text-sm font-semibold font-mono text-slate-700">0</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-200">
              <span className="text-sm font-medium text-slate-500">Lương kinh doanh</span>
              <span className="text-sm font-semibold font-mono text-slate-700">0</span>
            </div>
            {/* Phụ cấp */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Phụ cấp</span>
              <div className="pl-3 border-l-2 border-slate-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Gửi xe</span>
                  <span className="text-sm font-mono text-slate-500">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Xăng xe</span>
                  <span className="text-sm font-mono text-slate-500">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Điện thoại</span>
                  <span className="text-sm font-mono text-slate-500">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Quản lý</span>
                  <span className="text-sm font-mono text-slate-500">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Công việc</span>
                  <span className="text-sm font-mono text-slate-500">0</span>
                </div>
              </div>
            </div>
            {/* Thưởng / Phạt */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-200">
                <span className="text-sm font-medium text-slate-500">Phí ADMIN</span>
                <span className="text-sm font-semibold font-mono text-slate-700">0</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-200">
                <span className="text-sm font-medium text-slate-500">Balance bảo hiểm</span>
                <span className="text-sm font-semibold font-mono text-slate-700">0</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-200 bg-slate-50 px-2 rounded -mx-2">
                <span className="text-sm font-bold text-[#1E2062]">Lương BHXH</span>
                <span className="text-sm font-bold font-mono text-[#1E2062]">8.000.000</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t-2 border-slate-100">
            <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-r from-[#2E3192] to-[#1E2062] rounded-xl text-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <span className="text-xs uppercase tracking-wider font-semibold opacity-80 mb-1">Thực nhận cuối</span>
              <span className="text-3xl font-bold font-mono tracking-tight text-[#F7941D]">0 <span className="text-sm opacity-80">VNĐ</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
