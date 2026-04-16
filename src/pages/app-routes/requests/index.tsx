import { FileEdit, Plus, FileText, Umbrella, Home, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function RequestsPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full p-4 md:p-8 flex flex-col gap-6 md:gap-8">
      <div className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col gap-2"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-[#1E2062] flex items-center gap-3">
              <span className="p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl flex items-center justify-center">
                <FileText size={26} strokeWidth={2.5} />
              </span>
              Quản lý Đơn từ
            </h1>
            <p className="text-muted-foreground text-sm md:text-base ml-1">
              Tạo mới và theo dõi trạng thái các yêu cầu, đơn từ của bạn.
            </p>
          </motion.div>

          <div className="flex items-center gap-4 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
            <Button 
               onClick={() => navigate("/app/requests/create")}
               className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 h-10 px-4 rounded-lg shadow-sm"
            >
              <Plus className="w-4 h-4" /> Tạo đơn mới
            </Button>
          </div>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="bg-white border text-card-foreground shadow-sm rounded-xl p-5 flex flex-col gap-1.5 transition-all duration-200 hover:shadow-md border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 flex items-center justify-center rounded-lg bg-indigo-50/80 text-indigo-600 border border-indigo-100">
                <Umbrella className="w-5 h-5" strokeWidth={2} />
              </span>
              <h3 className="text-sm font-semibold text-slate-700 leading-tight">Ngày nghỉ phép</h3>
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-[28px] font-extrabold tracking-tight text-[#2E3192]">12</span>
              <span className="text-[22px] font-bold text-slate-300">/</span>
              <span className="text-[22px] font-bold text-slate-400">12</span>
              <span className="text-sm text-slate-500 font-medium ml-1">ngày / năm</span>
            </div>
          </div>

          <div className="bg-white border text-card-foreground shadow-sm rounded-xl p-5 flex flex-col gap-1.5 transition-all duration-200 hover:shadow-md border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 flex items-center justify-center rounded-lg bg-purple-50/80 text-purple-600 border border-purple-100">
                <Home className="w-5 h-5" strokeWidth={2} />
              </span>
              <h3 className="text-sm font-semibold text-slate-700 leading-tight">Ngày WFH</h3>
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-[28px] font-extrabold tracking-tight text-purple-700">6</span>
              <span className="text-[22px] font-bold text-slate-300">/</span>
              <span className="text-[22px] font-bold text-slate-400">6</span>
              <span className="text-sm text-slate-500 font-medium ml-1">ngày / năm</span>
            </div>
          </div>

          <div className="bg-white border text-card-foreground shadow-sm rounded-xl p-5 flex flex-col gap-1.5 transition-all duration-200 hover:shadow-md border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 flex items-center justify-center rounded-lg bg-rose-50/80 text-rose-600 border border-rose-100">
                <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
              </span>
              <h3 className="text-sm font-semibold text-slate-700 leading-tight">Quên Check-in/out</h3>
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-[28px] font-extrabold tracking-tight text-rose-700">2</span>
              <span className="text-[22px] font-bold text-slate-300">/</span>
              <span className="text-[22px] font-bold text-slate-400">2</span>
              <span className="text-sm text-slate-500 font-medium ml-1">lần / tuần</span>
            </div>
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
