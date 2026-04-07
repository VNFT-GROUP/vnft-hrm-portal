import { Book, Keyboard } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function UserGuidePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#shortcuts') {
      const el = document.getElementById('shortcuts');
      if (el) {
        setTimeout(() => {
          // Attempt to find the specific Base UI scroll viewport
          let viewport = document.querySelector('[data-slot="scroll-area-viewport"]');
          if (!viewport) {
             // Fallback query inside AppLayout's ScrollArea
             const container = document.querySelector('.app-content-scroll');
             viewport = container ? container.querySelector('div[style*="overflow"]') || container.firstChild as Element : null;
          }

          if (viewport) {
            const viewportRect = viewport.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();
            const targetScrollTop = viewport.scrollTop + (elRect.top - viewportRect.top) - 24;
            
            viewport.scrollTo({
              top: targetScrollTop,
              behavior: 'smooth'
            });
          } else {
            // Absolute fallback
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 100);
      }
    }
  }, [location.hash, location.key]); // Listen to key to re-run on subsequent Shift+K presses

  const modules = [
    { title: "Dashboard", description: "Tổng quan các chỉ số nhân sự và hoạt động." },
    { title: "Quản lý nhân sự", description: "Danh sách nhân viên, hồ sơ, và các thông tin liên quan." },
    { title: "Chấm công", description: "Bảng chấm công, quy tắc chấm công và ngày nghỉ." },
    { title: "Đánh giá", description: "Tiêu chí đánh giá, đợt đánh giá và kết quả." },
    { title: "Tài chính", description: "Báo cáo phân quyền tài chính, chi phí nhân sự." },
    { title: "Cài đặt & Phân quyền", description: "Quản lý vai trò, quyền truy cập hệ thống." }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Hướng dẫn sử dụng</h1>
        <p className="text-slate-500 mt-1">Tài liệu hướng dẫn các chức năng trong hệ thống</p>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((moduleItem, index) => (
          <div 
            key={index} 
            className="p-5 bg-white shadow-sm border border-slate-200 rounded-xl hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Book size={20} />
              </div>
              <h3 className="font-semibold text-slate-800">{moduleItem.title}</h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              {moduleItem.description}
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="text-sm text-indigo-600 font-medium group-hover:text-indigo-700">Xem chi tiết &rarr;</span>
            </div>
          </div>
        ))}
      </div>

      <div id="shortcuts" className="mt-12 mb-6">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Keyboard className="text-indigo-600" /> Các phím tắt hệ thống
        </h2>
        <p className="text-slate-500 mt-1">Sử dụng bàn phím để thao tác nhanh hơn</p>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden p-6 max-w-3xl">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="pb-3 text-slate-800 font-semibold w-[40%]">Phím tắt</th>
              <th className="pb-3 text-slate-800 font-semibold">Chức năng</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-4">
                <kbd className="px-2 py-1.5 bg-slate-100 border border-slate-300 rounded-md text-slate-700 font-mono text-xs font-semibold shadow-sm mr-1">Ctrl</kbd> + 
                <kbd className="px-2 py-1.5 bg-slate-100 border border-slate-300 rounded-md text-slate-700 font-mono text-xs font-semibold shadow-sm ml-1">B</kbd>
                <span className="text-slate-400 text-xs ml-2">(hoặc Cmd + B)</span>
              </td>
              <td className="py-4 text-slate-700">Đóng / Mở nhanh thanh Menu nằm ở cạnh trái (Sidebar)</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-4">
                <kbd className="px-2 py-1.5 bg-slate-100 border border-slate-300 rounded-md text-slate-700 font-mono text-xs font-semibold shadow-sm mr-1">Ctrl</kbd> + 
                <kbd className="px-2 py-1.5 bg-slate-100 border border-slate-300 rounded-md text-slate-700 font-mono text-xs font-semibold shadow-sm ml-1">I</kbd>
                <span className="text-slate-400 text-xs ml-2">(hoặc Cmd + I)</span>
              </td>
              <td className="py-4 text-slate-700">Đóng / Mở Menu thông tin tài khoản (Góc trên bên phải)</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-4">
                <kbd className="px-2 py-1.5 bg-slate-100 border border-slate-300 rounded-md text-slate-700 font-mono text-xs font-semibold shadow-sm mr-1">Alt</kbd> + 
                <kbd className="px-2 py-1.5 bg-slate-100 border border-slate-300 rounded-md text-slate-700 font-mono text-xs font-semibold shadow-sm ml-1">I</kbd>
              </td>
              <td className="py-4 text-slate-700">Truy cập nhanh trang thông tin "Hồ sơ cá nhân"</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-4">
                <kbd className="px-2 py-1.5 bg-slate-100 border border-slate-300 rounded-md text-slate-700 font-mono text-xs font-semibold shadow-sm mr-1">Shift</kbd> + 
                <kbd className="px-2 py-1.5 bg-slate-100 border border-slate-300 rounded-md text-slate-700 font-mono text-xs font-semibold shadow-sm ml-1">K</kbd>
              </td>
              <td className="py-4 text-slate-700">Truy cập Trang Hướng dẫn & tính năng "Các phím tắt"</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-4">
                <kbd className="px-2 py-1.5 bg-slate-100 border border-slate-300 rounded-md text-slate-700 font-mono text-xs font-semibold shadow-sm">Esc</kbd>
              </td>
              <td className="py-4 text-slate-700">Đóng Pop-up Menu người dùng (Đã có sẵn trên web mặc định)</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
