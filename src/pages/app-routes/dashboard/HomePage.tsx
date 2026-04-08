import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, Minus, CheckCircle2, Clock, ChevronDown, CalendarDays, FileText } from "lucide-react";

const TaskCard = ({ title, emptyText, delay = 0 }: { title: string, emptyText: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="bg-white rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden w-full border border-gray-100"
  >
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-white">
      <h2 className="text-[15px] font-semibold text-[#334155]">{title}</h2>
      <div className="flex items-center gap-4">
        <button className="flex items-center justify-between gap-3 border border-gray-200 px-3 py-1.5 rounded text-[13px] font-medium text-gray-500 bg-white hover:bg-gray-50 transition-colors shadow-sm min-w-[80px]">
          <span>Tất cả</span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <Minus size={18} strokeWidth={1.5} />
        </button>
      </div>
    </div>
    <div className="py-10 px-5 flex flex-col items-center justify-center bg-[#f8fafc] w-full min-h-[120px]">
      <div className="flex items-center justify-center gap-4">
        <div className="relative text-gray-300 flex items-center justify-center">
          {/* Minimal line details for empty state icon */}
          <div className="absolute w-[40px] h-[3px] bg-gray-200 rounded-full top-[30%] -left-[10px]"></div>
          <div className="absolute w-[20px] h-[3px] bg-gray-200 rounded-full bottom-[30%] -left-[5px]"></div>

          <FileText size={38} strokeWidth={1.2} className="relative z-10" />
          <div className="absolute right-[-2px] bottom-[2px] bg-[#f8fafc] rounded-full p-0.5 z-20">
            <CheckCircle2 size={12} strokeWidth={2} className="text-gray-400" />
          </div>
        </div>
        <p className="text-[14px] text-gray-500 font-medium">{emptyText}</p>
      </div>
    </div>
  </motion.div>
);

export default function HomePage() {
  return (
    <div className="p-4 md:p-6 w-full h-full min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto w-full">
        {/* Main Grid container */}
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column (Task Lists) - Takes 7/12 on large */}
          <div className="md:col-span-7 xl:col-span-8 flex flex-col gap-5">
            <TaskCard title="Việc cần thực hiện" emptyText="Thật tuyệt. Bạn đã xử lý hết công việc!" delay={0} />
            <TaskCard title="Đề xuất của bạn" emptyText="Đề xuất của bạn đã được xử lý hết." delay={0.1} />
            <TaskCard title="Việc bạn giao, theo dõi" emptyText="Công việc bạn theo dõi đã được xử lý hết." delay={0.2} />
          </div>

          {/* Right Column - Takes 5/12 on large */}
          <div className="md:col-span-5 xl:col-span-4 flex flex-col gap-6">

            {/* Attendance Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="text-xl font-medium text-foreground">Thứ 4, 08/04/2026</h2>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <button className="hover:text-foreground transition-colors"><ChevronLeft size={20} strokeWidth={1.5} /></button>
                  <button className="hover:text-foreground transition-colors"><ChevronRight size={20} strokeWidth={1.5} /></button>
                  <button className="hover:text-foreground transition-colors"><CalendarDays size={20} strokeWidth={1.5} /></button>
                  <button className="hover:text-foreground transition-colors"><Minus size={20} strokeWidth={1.5} /></button>
                </div>
              </div>

              {/* Content (3 blocks) */}
              <div className="p-3 sm:p-4 flex flex-col gap-3 w-full">

                {/* Check in */}
                <div className="bg-[#eaf8f1] rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
                  <div className="flex flex-col">
                    <span className="text-[#1f2937] font-medium text-[13px]">Giờ vào</span>
                    <div className="text-[24px] font-bold text-[#22c55e] tracking-tight mt-1 flex items-baseline gap-1">
                      07:47<span className="text-[12px] ml-0.5">AM</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-[#22c55e] text-white rounded-full p-1 shrink-0">
                      <CheckCircle2 size={16} strokeWidth={2.5} />
                    </div>
                    <div className="flex items-center gap-1 text-[#22c55e] text-[12px] font-medium">
                      <Clock size={12} strokeWidth={2.5} />
                      <span>Đến đúng giờ</span>
                    </div>
                  </div>
                </div>

                {/* Check out */}
                <div className="bg-[#fff7ed] rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
                  <div className="flex flex-col">
                    <span className="text-[#1f2937] font-medium text-[13px]">Giờ ra</span>
                    <div className="text-[24px] font-bold text-[#f59e0b] tracking-tight mt-1 flex items-baseline gap-1">
                      --
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-[#f59e0b] text-white rounded-full p-1 flex items-center justify-center shrink-0">
                      <Clock size={16} strokeWidth={2.5} className="p-0.5" />
                    </div>
                    <div className="flex items-center gap-1 text-[#f59e0b] text-[12px] font-medium">
                      <Clock size={12} strokeWidth={2.5} />
                      <span>Chưa đến giờ</span>
                    </div>
                  </div>
                </div>

                {/* Work count */}
                <div className="bg-[#eff6ff] rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
                  <div className="flex flex-col">
                    <span className="text-[#1f2937] font-medium text-[13px]">Công</span>
                    <div className="text-[28px] font-bold text-[#3b82f6] tracking-tight mt-1">
                      0
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-center">
                    <div className="text-[#3b82f6] text-[14px] font-semibold bg-[#3b82f6]/10 px-3 py-1.5 rounded-lg border border-[#3b82f6]/20">
                      00:00p
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-border flex items-center justify-between group cursor-pointer hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2 text-muted-foreground text-sm italic">
                  <Clock size={14} />
                  <span>Gần nhất lúc: 07:47 08/04/2026</span>
                </div>
                <ChevronDown size={18} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </motion.div>



            {/* Events/Calendar Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="text-[17px] font-medium text-foreground">Lịch và sự kiện</h2>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Minus size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Event List */}
              <div className="flex flex-col">

                {/* Event 1 */}
                <div className="flex items-center p-5 border-b border-border bg-card hover:bg-muted/20 transition-colors cursor-pointer group">
                  {/* Date Left */}
                  <div className="flex flex-col w-[80px] shrink-0">
                    <span className="font-medium text-[15px] text-foreground">Thứ 2</span>
                    <span className="text-sm text-muted-foreground">Ngày 13/04</span>
                  </div>

                  {/* Divider */}
                  <div className="w-[3px] h-[40px] bg-[#dc2626] rounded-full mx-4 shrink-0"></div>

                  {/* Event Details */}
                  <div className="flex flex-col flex-grow">
                    <span className="font-medium text-[15px] text-foreground group-hover:text-[#F7941D] transition-colors line-clamp-1">Sinh nhật Bùi Thị Huyền</span>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <Calendar size={12} />
                      <span>Cả ngày</span>
                    </div>
                  </div>

                  {/* Avatar */}
                  <div className="w-[42px] h-[42px] rounded-full bg-[#a3e635] flex items-center justify-center text-white font-semibold text-lg shrink-0 ml-2 shadow-sm border border-white">
                    H
                  </div>
                </div>

                {/* Event 2 */}
                <div className="flex items-center p-5 border-b border-border bg-card hover:bg-muted/20 transition-colors cursor-pointer group">
                  {/* Date Left */}
                  <div className="flex flex-col w-[80px] shrink-0">
                    <span className="font-medium text-[15px] text-foreground">Thứ 3</span>
                    <span className="text-sm text-muted-foreground">Ngày 14/04</span>
                  </div>

                  {/* Divider */}
                  <div className="w-[3px] h-[40px] bg-[#dc2626] rounded-full mx-4 shrink-0"></div>

                  {/* Event Details */}
                  <div className="flex flex-col flex-grow">
                    <span className="font-medium text-[15px] text-foreground group-hover:text-[#F7941D] transition-colors line-clamp-1">Sinh nhật Võ Thị Trúc Mai</span>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <Calendar size={12} />
                      <span>Cả ngày</span>
                    </div>
                  </div>

                  {/* Avatar */}
                  <div className="w-[42px] h-[42px] rounded-full overflow-hidden shrink-0 ml-2 shadow-sm border border-border bg-muted">
                    <img src="https://i.pravatar.cc/150?img=47" alt="Mai" className="w-full h-full object-cover" />
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
