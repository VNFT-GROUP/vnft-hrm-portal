import { Keyboard } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function UserGuidePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#shortcuts') {
      const el = document.getElementById('shortcuts');
      if (el) {
        setTimeout(() => {
          // Attempt to find the specific scroll viewport
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
  }, [location.hash, location.key]);

  return (
    <div className="p-6">
      <div id="shortcuts" className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Keyboard className="text-indigo-600" /> Các phím tắt hệ thống
        </h2>
        <p className="text-slate-500 mt-1">Sử dụng bàn phím để thao tác nhanh hơn</p>
      </div>

      <div className="bg-white text-slate-700 shadow-sm border border-slate-200 rounded-xl overflow-hidden p-6">
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
                <kbd className="px-2 py-1.5 bg-slate-100 border border-slate-200 rounded-md text-slate-700 font-mono text-xs font-semibold shadow-sm mr-1">Ctrl</kbd> + 
                <kbd className="px-2 py-1.5 bg-slate-100 border border-slate-200 rounded-md text-slate-700 font-mono text-xs font-semibold shadow-sm ml-1">B</kbd>
                <span className="text-slate-400 text-xs ml-2">(hoặc Cmd + B)</span>
              </td>
              <td className="py-4 text-slate-700">Đóng / Mở nhanh thanh Menu nằm ở cạnh trái (Sidebar)</td>
            </tr>
            <tr className="border-t border-slate-200">
              <td className="py-4">
                <kbd className="px-2 py-1.5 bg-slate-100 border border-slate-200 rounded-md text-slate-700 font-mono text-xs font-semibold shadow-sm mr-1">Ctrl</kbd> + 
                <kbd className="px-2 py-1.5 bg-slate-100 border border-slate-200 rounded-md text-slate-700 font-mono text-xs font-semibold shadow-sm ml-1">I</kbd>
                <span className="text-slate-400 text-xs ml-2">(hoặc Cmd + I)</span>
              </td>
              <td className="py-4 text-slate-700">Đóng / Mở Menu thông tin tài khoản (Góc trên bên phải)</td>
            </tr>
            <tr className="border-t border-slate-200">
              <td className="py-4">
                <kbd className="px-2 py-1.5 bg-slate-100 border border-slate-200 rounded-md text-slate-700 font-mono text-xs font-semibold shadow-sm mr-1">Alt</kbd> + 
                <kbd className="px-2 py-1.5 bg-slate-100 border border-slate-200 rounded-md text-slate-700 font-mono text-xs font-semibold shadow-sm ml-1">I</kbd>
              </td>
              <td className="py-4 text-slate-700">Truy cập nhanh trang thông tin "Hồ sơ cá nhân"</td>
            </tr>
            <tr className="border-t border-slate-200">
              <td className="py-4">
                <kbd className="px-2 py-1.5 bg-slate-100 border border-slate-200 rounded-md text-slate-700 font-mono text-xs font-semibold shadow-sm mr-1">Shift</kbd> + 
                <kbd className="px-2 py-1.5 bg-slate-100 border border-slate-200 rounded-md text-slate-700 font-mono text-xs font-semibold shadow-sm ml-1">K</kbd>
              </td>
              <td className="py-4 text-slate-700">Truy cập Trang Hướng dẫn & tính năng "Các phím tắt"</td>
            </tr>
            <tr className="border-t border-slate-200">
              <td className="py-4">
                <kbd className="px-2 py-1.5 bg-slate-100 border border-slate-200 rounded-md text-slate-700 font-mono text-xs font-semibold shadow-sm">Esc</kbd>
              </td>
              <td className="py-4 text-slate-700">Đóng Pop-up Menu người dùng (Đã có sẵn trên web mặc định)</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
