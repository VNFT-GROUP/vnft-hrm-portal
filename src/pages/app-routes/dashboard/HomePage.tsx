import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, Minus, CheckCircle2, Clock, ChevronDown, CalendarDays, FileText, Trophy, Medal, TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockTopSales = [
  { id: 1, name: "Nguyễn Văn Tuấn", score: "9,850", trend: "+12%", avatar: "https://i.pravatar.cc/150?img=11" },
  { id: 2, name: "Trần Thị Lan Anh", score: "8,720", trend: "+8%", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: 3, name: "Lê Hoàng Hải", score: "8,200", trend: "+5%", avatar: "https://i.pravatar.cc/150?img=8" },
  { id: 4, name: "Phạm Minh Tâm", score: "7,900", trend: "-2%", avatar: "https://i.pravatar.cc/150?img=12" },
  { id: 5, name: "Bùi Thị Yến", score: "7,450", trend: "+15%", avatar: "https://i.pravatar.cc/150?img=9" },
  { id: 6, name: "Hoàng Đức Nam", score: "7,100", trend: "+4%", avatar: "https://i.pravatar.cc/150?img=15" },
  { id: 7, name: "Vũ Khánh My", score: "6,800", trend: "-1%", avatar: "https://i.pravatar.cc/150?img=20" },
  { id: 8, name: "Đặng Quốc Bảo", score: "6,500", trend: "+7%", avatar: "https://i.pravatar.cc/150?img=32" },
  { id: 9, name: "Ngô Nhật Linh", score: "6,200", trend: "+3%", avatar: "https://i.pravatar.cc/150?img=25" },
  { id: 10, name: "Lý Gia Hân", score: "5,900", trend: "-5%", avatar: "https://i.pravatar.cc/150?img=33" },
];

const TopSalesTable = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden w-full border border-gray-100 mt-2"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <div className="bg-amber-100 p-1.5 rounded-lg">
            <Trophy size={18} className="text-amber-600" strokeWidth={2.5} />
          </div>
          <h2 className="text-[16px] font-bold text-[#1f2937] tracking-tight">Top 10 Vouchers / Sales</h2>
        </div>
        <button className="flex items-center gap-2 border border-gray-200 px-3 py-1.5 rounded text-[13px] font-medium text-gray-500 bg-white hover:bg-gray-50 transition-colors shadow-sm">
          <span>Tháng này</span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>
      </div>

      <div className="flex flex-col p-2">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 text-[12px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-6 md:col-span-7">Nhân sự</div>
          <div className="col-span-5 md:col-span-4 text-right">Thành tích</div>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-1">
          {mockTopSales.map((user, index) => {
            const isTop1 = index === 0;
            const isTop2 = index === 1;
            const isTop3 = index === 2;
            const isTop3Any = index < 3;

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                whileHover={{ scale: 1.01, backgroundColor: '#f8fafc' }}
                className={`grid grid-cols-12 gap-4 px-4 py-3.5 items-center rounded-xl cursor-default transition-all duration-200 ${isTop1 ? 'bg-gradient-to-r from-amber-50/50 to-transparent border border-amber-100/50 shadow-[0_2px_10px_rgba(245,158,11,0.05)]' : ''}`}
              >
                {/* Ranking */}
                <div className="col-span-1 flex justify-center">
                  {isTop1 ? (
                    <div className="bg-amber-400 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-sm shadow-amber-200">
                      <Medal size={14} strokeWidth={2.5} />
                    </div>
                  ) : isTop2 ? (
                    <div className="bg-slate-300 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-sm">
                      <Medal size={14} strokeWidth={2.5} />
                    </div>
                  ) : isTop3 ? (
                    <div className="bg-orange-300 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-sm">
                      <Medal size={14} strokeWidth={2.5} />
                    </div>
                  ) : (
                    <span className="text-[14px] font-bold text-gray-400">{index + 1}</span>
                  )}
                </div>

                {/* Profile */}
                <div className="col-span-6 md:col-span-7 flex items-center gap-3">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="relative shrink-0">
                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" />
                    {isTop1 && (
                      <div className="absolute -top-1.5 -right-1.5 bg-amber-400 rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                        <Trophy size={8} fill="white" className="text-white" />
                      </div>
                    )}
                  </motion.div>
                  <div className="flex flex-col">
                    <span className={`text-[14px] ${isTop3Any ? 'font-bold text-gray-800' : 'font-medium text-gray-600'}`}>
                      {user.name}
                    </span>
                    <span className="text-[11px] text-gray-400">Sale Executive</span>
                  </div>
                </div>

                {/* Score */}
                <div className="col-span-5 md:col-span-4 flex flex-col items-end justify-center">
                  <div className={`text-[15px] font-bold ${isTop1 ? 'text-amber-600' : isTop2 ? 'text-slate-600' : isTop3 ? 'text-orange-600' : 'text-[#3b82f6]'}`}>
                    {user.score} <span className="text-[10px] font-medium text-gray-400">Pts</span>
                  </div>
                  <div className={`flex items-center gap-0.5 text-[10px] font-semibold mt-0.5 ${user.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-400'}`}>
                    {user.trend.startsWith('+') ? <TrendingUp size={10} strokeWidth={3} /> : null}
                    {user.trend}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

const IntegratedTaskCard = () => {
  const [activeTab, setActiveTab] = useState<'todo' | 'proposed' | 'following'>('todo');

  const emptyText = activeTab === 'todo'
    ? 'Thật tuyệt. Bạn đã xử lý hết công việc!'
    : activeTab === 'proposed'
      ? 'Đề xuất của bạn đã được xử lý hết.'
      : 'Công việc bạn theo dõi đã được xử lý hết.';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden w-full border border-gray-100 flex-grow"
    >
      <div className="flex items-center justify-between px-2 pt-2 border-b border-gray-100 bg-white">
        {/* Tabs */}
        <div className="flex items-center gap-1 sm:gap-6 px-3">
          <button
            onClick={() => setActiveTab('todo')}
            className={`pb-3 pt-2 text-[13px] sm:text-[14px] transition-colors whitespace-nowrap ${activeTab === 'todo' ? 'font-semibold text-primary border-b-2 border-primary' : 'font-medium text-gray-500 hover:text-gray-700'}`}
          >
            Việc cần thực hiện
          </button>
          <button
            onClick={() => setActiveTab('proposed')}
            className={`pb-3 pt-2 text-[13px] sm:text-[14px] transition-colors whitespace-nowrap ${activeTab === 'proposed' ? 'font-semibold text-primary border-b-2 border-primary' : 'font-medium text-gray-500 hover:text-gray-700'}`}
          >
            Đề xuất của bạn
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`pb-3 pt-2 text-[13px] sm:text-[14px] transition-colors whitespace-nowrap ${activeTab === 'following' ? 'font-semibold text-primary border-b-2 border-primary' : 'font-medium text-gray-500 hover:text-gray-700'}`}
          >
            Việc bạn giao, theo dõi
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 px-3 pb-2 hidden lg:flex">
          <Select defaultValue="Cần thực hiện">
            <SelectTrigger className="h-[30px] border-gray-200 text-[13px] font-medium text-gray-500 bg-white hover:bg-gray-50 shadow-sm focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end" alignItemWithTrigger={false} sideOffset={4} className="text-[13px] min-w-[140px]">
              <SelectItem value="Cần thực hiện" className="text-[13px] cursor-pointer">Cần thực hiện</SelectItem>
              <SelectItem value="Đang làm" className="text-[13px] cursor-pointer">Đang làm</SelectItem>
              <SelectItem value="Hoàn thành" className="text-[13px] cursor-pointer">Hoàn thành</SelectItem>
            </SelectContent>
          </Select>
          <button className="text-gray-400 hover:text-gray-600 transition-colors ml-2">
            <Minus size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Empty State */}
      <div className="py-20 px-5 flex flex-col items-center justify-center bg-[#f8fafc] w-full flex-grow min-h-[300px]">
        <div className="flex items-center justify-center gap-4">
          <div className="relative text-gray-300 flex items-center justify-center">
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
};

export default function HomePage() {
  return (
    <div className="p-4 md:p-6 w-full h-full min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto w-full">
        {/* Main Grid container */}
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column (Task Lists) - Takes 7/12 on large */}
          <div className="md:col-span-7 xl:col-span-8 flex flex-col gap-5 h-full">
            <IntegratedTaskCard />
            <TopSalesTable />
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
