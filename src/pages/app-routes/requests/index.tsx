import { FileEdit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function RequestsPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full p-4 md:p-6 lg:p-8">
      <div className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 border-l-4 border-indigo-600 pl-3">
              Quản lý Đơn từ
            </h1>
            <p className="text-sm text-slate-500 mt-1.5 ml-4">
              Tạo mới và theo dõi trạng thái các yêu cầu, đơn từ của bạn.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
            <Button 
               onClick={() => navigate("/app/requests/create")}
               className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 h-10 px-4 rounded-lg shadow-sm"
            >
              <Plus className="w-4 h-4" /> Tạo đơn mới
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-slate-400 p-12">
          <FileEdit className="w-12 h-12 mb-4 text-slate-300" />
          <h3 className="text-lg font-medium text-slate-600 mb-1">Chưa có đơn từ nào</h3>
          <p className="text-sm">Bạn chưa tạo đơn từ nào hoặc lưới dữ liệu đang được cập nhật.</p>
        </div>
      </div>
    </div>
  );
}
