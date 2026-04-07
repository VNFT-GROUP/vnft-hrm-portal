import { Book } from "lucide-react";

export default function UserGuidePage() {
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
    </div>
  );
}
