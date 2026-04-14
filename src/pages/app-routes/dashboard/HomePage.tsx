import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Minus, CheckCircle2, Clock, CalendarDays, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/useAuthStore";
import { format, parse, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

/*
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
        {/* Header *\/}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 text-[12px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-6 md:col-span-7">Nhân sự</div>
          <div className="col-span-5 md:col-span-4 text-right">Thành tích</div>
        </div>

        {/* Rows *\/}
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
                className={`grid grid-cols-12 gap-4 px-4 py-3.5 items-center rounded-xl cursor-default transition-all duration-200 ${isTop1 ? 'bg-linear-to-r from-amber-50/50 to-transparent border border-amber-100/50 shadow-[0_2px_10px_rgba(245,158,11,0.05)]' : ''}`}
              >
                {/* Ranking *\/}
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

                {/* Profile *\/}
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

                {/* Score *\/}
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
*/

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
      className="bg-white rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden w-full border border-gray-100 grow"
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
        <div className="hidden items-center gap-2 px-3 pb-2 lg:flex">
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
      <div className="py-20 px-5 flex flex-col items-center justify-center bg-[#f8fafc] w-full grow min-h-[300px]">
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
  const session = useAuthStore(state => state.session);
  const todayAttendance = session?.todayAttendance;
  
  // Format current date
  const currentDate = new Date();
  const dateStr = todayAttendance?.attendanceDate 
    ? format(parseISO(todayAttendance.attendanceDate), "EEEE, dd/MM/yyyy", { locale: vi })
    : format(currentDate, "EEEE, dd/MM/yyyy", { locale: vi });
  const displayDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  
  // Format Check-in time
  let checkInDisplay = "--";
  let checkInAmPm = "";
  if (todayAttendance?.checkInTime) {
    try {
      const parsed = parse(todayAttendance.checkInTime.substring(0, 5), 'HH:mm', new Date());
      checkInDisplay = format(parsed, 'hh:mm');
      checkInAmPm = format(parsed, 'a');
    } catch {
      checkInDisplay = todayAttendance.checkInTime.substring(0, 5);
    }
  }

  // Format Check-out time
  let checkOutDisplay = "--";
  let checkOutAmPm = "";
  if (todayAttendance?.checkOutTime) {
    try {
      const parsed = parse(todayAttendance.checkOutTime.substring(0, 5), 'HH:mm', new Date());
      checkOutDisplay = format(parsed, 'hh:mm');
      checkOutAmPm = format(parsed, 'a');
    } catch {
      checkOutDisplay = todayAttendance.checkOutTime.substring(0, 5);
    }
  }

  const hasCheckIn = !!todayAttendance?.checkInTime;
  const hasCheckOut = !!todayAttendance?.checkOutTime;

  const getCheckInStatus = () => {
    if (!hasCheckIn) return { text: "Chưa ghi nhận", color: "text-[#64748b]", bg: "bg-[#cbd5e1]", cardBg: "bg-[#f1f5f9]" };
    if (todayAttendance?.checkInValid) return { text: "Đến đúng giờ", color: "text-[#22c55e]", bg: "bg-[#22c55e]", cardBg: "bg-[#eaf8f1]" };
    return { text: `Đi muộn ${todayAttendance?.lateMinutes || 0}p`, color: "text-[#ef4444]", bg: "bg-[#ef4444]", cardBg: "bg-[#fef2f2]" };
  };

  const getCheckOutStatus = () => {
    if (!hasCheckOut) {
      if (hasCheckIn) return { text: "Chưa ghi nhận", color: "text-[#f59e0b]", bg: "bg-[#f59e0b]", cardBg: "bg-[#fff7ed]" };
      return { text: "—", color: "text-[#64748b]", bg: "bg-[#cbd5e1]", cardBg: "bg-[#f1f5f9]" };
    }
    if (todayAttendance?.checkOutValid) return { text: "Về đúng giờ", color: "text-[#22c55e]", bg: "bg-[#22c55e]", cardBg: "bg-[#eaf8f1]" };
    return { text: `Về sớm ${todayAttendance?.earlyLeaveMinutes || 0}p`, color: "text-[#ef4444]", bg: "bg-[#ef4444]", cardBg: "bg-[#fef2f2]" };
  };

  const inStatus = getCheckInStatus();
  const outStatus = getCheckOutStatus();

  const workTimeHours = Math.floor((todayAttendance?.workMinutes || 0) / 60);
  const workTimeMins = (todayAttendance?.workMinutes || 0) % 60;
  const workTimeStr = `${workTimeHours.toString().padStart(2, '0')}h ${workTimeMins.toString().padStart(2, '0')}p`;

  return (
    <div className="p-4 md:p-6 w-full h-full min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto w-full">
        {/* Main Grid container */}
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column (Task Lists) - Takes 7/12 on large */}
          <div className="md:col-span-7 xl:col-span-8 flex flex-col gap-5 h-full">
            <IntegratedTaskCard />
            {/* <TopSalesTable /> */}
          </div>

          {/* Right Column - Takes 5/12 on large */}
          <div className="md:col-span-5 xl:col-span-4 flex flex-col gap-6">

            {/* Attendance Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden h-full flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-medium text-foreground">{displayDate}</h2>
                  </div>
                  <span className="text-[13px] text-muted-foreground font-medium">
                    Mã ca làm việc: <span className="text-indigo-600 font-semibold">{todayAttendance?.attendanceCode || 'Chưa xếp ca'}</span>
                  </span>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <button className="hover:text-foreground transition-colors"><ChevronLeft size={20} strokeWidth={1.5} /></button>
                  <button className="hover:text-foreground transition-colors"><ChevronRight size={20} strokeWidth={1.5} /></button>
                  <button className="hover:text-foreground transition-colors"><CalendarDays size={20} strokeWidth={1.5} /></button>
                </div>
              </div>

              {/* Content (3 blocks) */}
              <div className="p-3 sm:p-4 flex flex-col justify-center gap-4 w-full grow">

                {/* Check in */}
                <div className={`rounded-xl p-4 flex items-center justify-between relative overflow-hidden ${inStatus.cardBg}`}>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-[#1f2937] font-medium text-[13px]">Giờ vào</span>
                      {todayAttendance?.scheduledCheckIn && (
                        <span className="text-[11px] text-muted-foreground font-medium bg-black/5 px-1.5 rounded border border-black/5">Lịch: {todayAttendance.scheduledCheckIn.substring(0, 5)}</span>
                      )}
                    </div>
                    <div className={`text-[24px] font-bold tracking-tight mt-1 flex items-baseline gap-1 ${hasCheckIn ? inStatus.color : 'text-[#94a3b8]'}`}>
                      {checkInDisplay}<span className="text-[12px] ml-0.5">{checkInAmPm}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`${inStatus.bg} text-white rounded-full p-1 shrink-0`}>
                      <CheckCircle2 size={16} strokeWidth={2.5} />
                    </div>
                    <div className={`flex items-center gap-1 text-[12px] font-medium ${inStatus.color}`}>
                      <Clock size={12} strokeWidth={2.5} />
                      <span>{inStatus.text}</span>
                    </div>
                  </div>
                </div>

                {/* Check out */}
                <div className={`rounded-xl p-4 flex items-center justify-between relative overflow-hidden ${outStatus.cardBg}`}>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-[#1f2937] font-medium text-[13px]">Giờ ra</span>
                      {todayAttendance?.scheduledCheckOut && (
                        <span className="text-[11px] text-muted-foreground font-medium bg-black/5 px-1.5 rounded border border-black/5">Lịch: {todayAttendance.scheduledCheckOut.substring(0, 5)}</span>
                      )}
                    </div>
                    <div className={`text-[24px] font-bold tracking-tight mt-1 flex items-baseline gap-1 ${hasCheckOut ? outStatus.color : hasCheckIn ? 'text-[#f59e0b]' : 'text-[#94a3b8]'}`}>
                      {checkOutDisplay}<span className="text-[12px] ml-0.5">{checkOutAmPm}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`${outStatus.bg} text-white rounded-full p-1 flex items-center justify-center shrink-0`}>
                      <Clock size={16} strokeWidth={2.5} className="p-0.5" />
                    </div>
                    <div className={`flex items-center gap-1 text-[12px] font-medium ${outStatus.color}`}>
                      <Clock size={12} strokeWidth={2.5} />
                      <span>{outStatus.text}</span>
                    </div>
                  </div>
                </div>

                {/* Work time */}
                <div className="bg-[#eff6ff] rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
                  <div className="flex flex-col">
                    <span className="text-[#1f2937] font-medium text-[13px]">Thời gian làm việc</span>
                    <div className="text-[28px] font-bold text-[#3b82f6] tracking-tight mt-1">
                      {workTimeStr}
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-center">
                    <div className="bg-[#3b82f6]/10 text-[#3b82f6] rounded-full p-2.5 shrink-0 border border-[#3b82f6]/20">
                      <Clock size={22} strokeWidth={2} />
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>



            {/* Events/Calendar Card */}
            {/*
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
            >
              // ...
            </motion.div>
            */}

          </div>
        </div>
      </div>
    </div>
  );
}
