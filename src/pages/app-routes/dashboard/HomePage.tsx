import { useState, useEffect } from "react";
import { m  } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, CalendarDays, FileText, Umbrella, Home, Activity } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { format, parseISO, addDays } from "date-fns";
import { vi } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { attendanceService } from "@/services/attendance";
import type { AttendanceDailySummaryResponse } from "@/types/attendance/AttendanceDailySummaryResponse";
import { useTranslation } from "react-i18next";

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
    <m.div
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
              <m.div
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
                  <m.div whileHover={{ scale: 1.1, rotate: 5 }} className="relative shrink-0">
                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" />
                    {isTop1 && (
                      <div className="absolute -top-1.5 -right-1.5 bg-amber-400 rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                        <Trophy size={8} fill="white" className="text-white" />
                      </div>
                    )}
                  </m.div>
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
              </m.div>
            );
          })}
        </div>
      </div>
    </m.div>
  );
};
*/

const IntegratedTaskCard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'requests' | 'assets' | 'reminders'>('requests');

  const emptyText = activeTab === 'requests'
    ? t("dashboard.emptyStates.requests")
    : activeTab === 'assets'
      ? t("dashboard.emptyStates.assets")
      : t("dashboard.emptyStates.reminders");

  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden w-full grow flex flex-col"
    >
      <div className="flex items-center justify-between px-2 pt-2 border-b border-border bg-transparent">
        {/* Tabs */}
        <div className="flex items-center gap-1 sm:gap-6 px-3">
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-3 pt-2 text-[13px] sm:text-[14px] transition-colors whitespace-nowrap ${activeTab === 'requests' ? 'font-semibold text-primary border-b-2 border-primary' : 'font-medium text-muted-foreground hover:text-foreground'}`}
          >
            {t("dashboard.tasks.requests")}
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`pb-3 pt-2 text-[13px] sm:text-[14px] transition-colors whitespace-nowrap ${activeTab === 'assets' ? 'font-semibold text-primary border-b-2 border-primary' : 'font-medium text-muted-foreground hover:text-foreground'}`}
          >
            {t("dashboard.tasks.assets")}
          </button>
          <button
            onClick={() => setActiveTab('reminders')}
            className={`pb-3 pt-2 text-[13px] sm:text-[14px] transition-colors whitespace-nowrap ${activeTab === 'reminders' ? 'font-semibold text-primary border-b-2 border-primary' : 'font-medium text-muted-foreground hover:text-foreground'}`}
          >
            {t("dashboard.tasks.reminders")}
          </button>
        </div>
      </div>

      {/* Empty State */}
      <div className="py-20 px-5 flex flex-col items-center justify-center bg-transparent w-full grow min-h-[300px]">
        <div className="flex items-center justify-center gap-4">
          <div className="relative text-muted-foreground flex items-center justify-center">
            <div className="absolute w-[40px] h-[3px] bg-border rounded-full top-[30%] -left-[10px]"></div>
            <div className="absolute w-[20px] h-[3px] bg-border rounded-full bottom-[30%] -left-[5px]"></div>
            <FileText size={38} strokeWidth={1.2} className="relative z-10 text-muted-foreground/60" />
            <div className="absolute right-[-2px] bottom-[2px] bg-card rounded-full p-0.5 z-20">
              <CheckCircle2 size={12} strokeWidth={2} className="text-muted-foreground/60" />
            </div>
          </div>
          <p className="text-[14px] text-muted-foreground font-medium">{emptyText}</p>
        </div>
      </div>
    </m.div>
  );
};

export default function HomePage() {
  const { t } = useTranslation();
  const session = useAuthStore(state => state.session);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendanceData, setAttendanceData] = useState<AttendanceDailySummaryResponse | undefined>(session?.todayAttendance);
  useEffect(() => {
    let active = true;
    const fetchAttendance = async () => {
      try {
        const dateString = format(selectedDate, "yyyy-MM-dd");
        const res = await attendanceService.getCurrentUserAttendanceByDate(dateString);
        if (active) {
          setAttendanceData(res.data);
        }
      } catch (err) {
        console.error(err);
        if (active) {
          setAttendanceData(undefined);
        }
      }
    };
    fetchAttendance();
    return () => { active = false; };
  }, [selectedDate]);

  const todayAttendance = attendanceData;
  
  // Format current date
  const dateStr = todayAttendance?.attendanceDate 
    ? format(parseISO(todayAttendance.attendanceDate), "EEEE, dd/MM/yyyy", { locale: vi })
    : format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi });
  const displayDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  
  // Format Check-in time
  const checkInVal = todayAttendance?.checkInTime || todayAttendance?.actualCheckIn;
  const checkInDisplay = checkInVal 
    ? checkInVal.substring(0, 5) 
    : "--";
  const checkInAmPm = "";

  // Format Check-out time
  const checkOutVal = todayAttendance?.checkOutTime || todayAttendance?.actualCheckOut;
  const checkOutDisplay = checkOutVal 
    ? checkOutVal.substring(0, 5) 
    : "--";
  const checkOutAmPm = "";

  const hasCheckIn = !!checkInVal;
  const hasCheckOut = !!checkOutVal;

  const getCheckInStatus = () => {
    if (!hasCheckIn) return { text: t("dashboard.attendanceCard.unrecorded"), color: "text-[#64748b]", bg: "bg-[#cbd5e1]", cardBg: "bg-[#f1f5f9]" };
    if (todayAttendance?.checkInValid) return { text: t("dashboard.attendanceCard.onTime"), color: "text-[#22c55e]", bg: "bg-[#22c55e]", cardBg: "bg-[#eaf8f1]" };
    return { text: t("dashboard.attendanceCard.late", { mins: todayAttendance?.lateMinutes || 0 }), color: "text-[#ef4444]", bg: "bg-[#ef4444]", cardBg: "bg-[#fef2f2]" };
  };

  const getCheckOutStatus = () => {
    if (!hasCheckOut) {
      if (hasCheckIn) return { text: t("dashboard.attendanceCard.unrecorded"), color: "text-[#f59e0b]", bg: "bg-[#f59e0b]", cardBg: "bg-[#fff7ed]" };
      return { text: t("dashboard.attendanceCard.empty"), color: "text-[#64748b]", bg: "bg-[#cbd5e1]", cardBg: "bg-[#f1f5f9]" };
    }
    if (todayAttendance?.checkOutValid) return { text: t("dashboard.attendanceCard.onTime"), color: "text-[#22c55e]", bg: "bg-[#22c55e]", cardBg: "bg-[#eaf8f1]" };
    return { text: t("dashboard.attendanceCard.early", { mins: todayAttendance?.earlyLeaveMinutes || 0 }), color: "text-[#ef4444]", bg: "bg-[#ef4444]", cardBg: "bg-[#fef2f2]" };
  };

  const inStatus = getCheckInStatus();
  const outStatus = getCheckOutStatus();

  const workTimeHours = Math.floor((todayAttendance?.workMinutes || 0) / 60);
  const workTimeMins = (todayAttendance?.workMinutes || 0) % 60;
  const workTimeStr = `${workTimeHours.toString().padStart(2, '0')}h ${workTimeMins.toString().padStart(2, '0')}p`;

  return (
    <div className="p-4 md:p-6 w-full h-full min-h-screen bg-transparent">
      <div className="w-full">
        {/* Main Grid container */}
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column - Takes 7/12 on large */}
          <div className="md:col-span-7 xl:col-span-8 flex flex-col gap-6 h-full">
            
            {/* Unified Stats Card */}
            <m.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-card w-full rounded-2xl border border-border shadow-sm flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              <div className="px-5 py-4 bg-[#2E3192] flex items-center gap-2 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10">
                  <Activity className="w-32 h-32 -mt-10 -mr-10 text-white" />
                </div>
                <Activity className="w-5 h-5 text-white relative z-10" />
                <h3 className="text-[15px] font-semibold text-white relative z-10 tracking-wide">{t("dashboard.personalOverview")}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                {/* Left Panel: Quotas */}
                <div className="p-5 flex flex-col bg-white/40 dark:bg-card">
                  <h4 className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
                    {t("dashboard.annualLimits")}
                  </h4>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between py-3 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        <Umbrella className="w-4 h-4 text-indigo-500" />
                        <span className="text-[13px] font-medium text-slate-700">{t("dashboard.leaveDays")}</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[15px] font-semibold text-foreground">{session?.remainingLeaveDays ?? 0}</span>
                        <span className="text-[12px] text-muted-foreground">/ {session?.maxLeaveDays ?? 0} {t("dashboard.days")}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <Home className="w-4 h-4 text-purple-500" />
                        <span className="text-[13px] font-medium text-slate-700">{t("dashboard.wfhDays")}</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[15px] font-semibold text-foreground">{session?.remainingWfhDays ?? 0}</span>
                        <span className="text-[12px] text-muted-foreground">/ {session?.maxWfhDays ?? 0} {t("dashboard.days")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Monthly Attendance Stats */}
                <div className="p-5 flex flex-col bg-white/40 dark:bg-card">
                  <h4 className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>
                      {t("dashboard.monthStats", {
                        month: session?.currentMonthAttendance?.summaryMonth || new Date().getMonth() + 1,
                        year: session?.currentMonthAttendance?.summaryYear || new Date().getFullYear()
                      })}
                    </span>
                  </h4>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-[13px] font-medium text-slate-600">{t("dashboard.workUnits")}</span>
                      <span className="text-[15px] font-semibold text-emerald-600">{session?.currentMonthAttendance?.workUnits ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-[13px] font-medium text-slate-600">{t("dashboard.absentDays")}</span>
                      <span className="text-[15px] font-semibold text-sky-600">{session?.currentMonthAttendance?.absentDays ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-[13px] font-medium text-slate-600 cursor-help" title={t("dashboard.lateEarlyTooltip")}>{t("dashboard.lateEarlyDays")}</span>
                      <span className="text-[15px] font-semibold text-amber-600">{session?.currentMonthAttendance?.lateDays ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-[13px] font-medium text-slate-600">{t("dashboard.workingDays")}</span>
                      <span className="text-[15px] font-semibold text-slate-700">{session?.currentMonthAttendance?.workingDays ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-[13px] font-medium text-slate-600 cursor-help" title={t("dashboard.majorLateEarlyViolationTooltip")}>{t("dashboard.majorLateEarlyViolationTimes", { defaultValue: "Số lần đi trễ/về sớm từ 120 phút trở lên" })}</span>
                      <span className="text-[15px] font-semibold text-rose-500">{session?.currentMonthAttendance?.majorLateEarlyViolationTimes ?? 0} <span className="text-[11px] font-normal text-muted-foreground">{t("dashboard.times", { defaultValue: "lần" })}</span></span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-[13px] font-medium text-slate-600">{t("dashboard.leaveDeductionViolationTimes", { defaultValue: "Số lần bị trừ do trễ/về sớm" })}</span>
                      <span className="text-[15px] font-semibold text-rose-600">{session?.currentMonthAttendance?.leaveDeductionViolationTimes ?? 0} <span className="text-[11px] font-normal text-muted-foreground">{t("dashboard.times", { defaultValue: "lần" })}</span></span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-[13px] font-medium text-rose-600">{t("dashboard.leaveDeductionDays", { defaultValue: "Số ngày phép/công bị trừ do trễ/về sớm" })}</span>
                      <span className="text-[15px] font-bold text-rose-600">-{session?.currentMonthAttendance?.leaveDeductionDays ?? 0} <span className="text-[11px] font-normal text-rose-500/80">{t("dashboard.days")}</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </m.div>

            {/* Task Lists */}
            <IntegratedTaskCard />
          </div>

          {/* Right Column - Takes 5/12 on large */}
          <div className="md:col-span-5 xl:col-span-4 flex flex-col gap-6">

            {/* Attendance Card */}
            <m.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden h-full flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-medium text-foreground">{displayDate}</h2>
                  </div>
                  <div className="text-[13px] text-muted-foreground font-medium flex items-center gap-1.5">
                    {todayAttendance?.scheduledCheckIn && todayAttendance?.scheduledCheckOut && (
                      <span className="text-gray-500 font-normal flex items-center gap-1">
                        <Clock size={12} />
                        {todayAttendance.scheduledCheckIn.substring(0, 5)} - {todayAttendance.scheduledCheckOut.substring(0, 5)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <button onClick={() => setSelectedDate(prev => addDays(prev, -1))} className="hover:text-foreground transition-colors p-1 flex items-center justify-center">
                    <ChevronLeft size={20} strokeWidth={1.5} />
                  </button>
                  <button onClick={() => setSelectedDate(prev => addDays(prev, 1))} className="hover:text-foreground transition-colors p-1 flex items-center justify-center">
                    <ChevronRight size={20} strokeWidth={1.5} />
                  </button>
                  <Popover>
                    <PopoverTrigger className="hover:text-foreground transition-colors p-1 flex items-center justify-center">
                      <CalendarDays size={20} strokeWidth={1.5} />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          if (date) setSelectedDate(date);
                        }}
                        initialFocus
                        locale={vi}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Content (3 blocks) */}
              <div className="p-3 sm:p-4 flex flex-col justify-center gap-4 w-full grow">

                {/* Check in */}
                <div className={`rounded-xl p-4 flex items-center justify-between relative overflow-hidden ${inStatus.cardBg}`}>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-[#1f2937] font-medium text-[13px]">{t("dashboard.attendanceCard.checkInTime")}</span>
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
                      <span className="text-[#1f2937] font-medium text-[13px]">{t("dashboard.attendanceCard.checkOutTime")}</span>
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

                {/* Work time & Unit */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#eff6ff] rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-1 text-[#3b82f6]">
                      <Clock size={16} strokeWidth={2} />
                      <span className="text-[#1f2937] font-medium text-[13px]">{t("dashboard.attendanceCard.workingTime")}</span>
                    </div>
                    <div className="text-[24px] font-bold text-[#3b82f6] tracking-tight">
                      {workTimeStr}
                    </div>
                  </div>
                  
                  <div className="bg-emerald-50 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-1 text-emerald-600">
                      <CheckCircle2 size={16} strokeWidth={2} />
                      <span className="text-[#1f2937] font-medium text-[13px]">{t("dashboard.attendanceCard.workUnit")}</span>
                    </div>
                    <div className="text-[24px] font-bold text-emerald-600 tracking-tight flex items-baseline gap-1">
                      {todayAttendance?.workUnit || 0} <span className="text-[14px] font-medium text-emerald-600/70">{t("dashboard.attendanceCard.workUnitSuffix")}</span>
                    </div>
                  </div>
                </div>
              </div>

            </m.div>



            {/* Events/Calendar Card */}
            {/*
            <m.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
            >
              // ...
            </m.div>
            */}

          </div>
        </div>
      </div>
    </div>
  );
}
