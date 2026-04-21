import { useState } from "react";
import { format, eachDayOfInterval, getDay } from "date-fns";
import { vi } from "date-fns/locale";

import { attendanceService } from "@/services/attendance";

import type { AttendanceDailySummaryResponse } from "@/types/attendance/AttendanceDailySummaryResponse";
import type { RequestFormResponse } from "@/types/requestform/RequestFormResponse";
import { Loader2, Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, CalendarCheck, Target, Medal, AlertOctagon, FileText, AlertTriangle, Clock } from "lucide-react";
import { m  } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RichTextViewer } from "@/components/custom/RichTextViewer";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getWorkingDaysInMonth } from "@/lib/utils";

export default function MyAttendancePage() {
  const { t } = useTranslation();
  const [year, setYear] = useState<number>(() => new Date().getFullYear());
  const [month, setMonth] = useState<number>(() => new Date().getMonth() + 1);
  const [selectedRecord, setSelectedRecord] = useState<(AttendanceDailySummaryResponse & { dateObj: Date }) | null>(null);
  const [showDisciplineRules, setShowDisciplineRules] = useState(false);
  const [showStatsRules, setShowStatsRules] = useState(false);
  const [expandedRequests, setExpandedRequests] = useState<Set<string>>(new Set());

  const { data: responseData, isLoading: loading } = useQuery({
    queryKey: ["my-attendance", year, month],
    queryFn: () => attendanceService.getCurrentUserMonthlyAttendance(year, month)
  });


  const data = responseData?.data;

  const displayNumber = (value?: number | null): number => {
    return Math.abs(value ?? 0) < 0.000001 ? 0 : (value ?? 0);
  };

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded text-[10px] font-semibold uppercase">Chờ duyệt</span>;
      case "APPROVED": return <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded text-[10px] font-semibold uppercase">Đã duyệt</span>;
      case "REJECTED": return <span className="px-2 py-0.5 bg-red-500/10 text-red-600 border border-red-500/20 rounded text-[10px] font-semibold uppercase">Từ chối</span>;
      case "CANCELED": return <span className="px-2 py-0.5 bg-slate-500/10 text-slate-600 border border-slate-500/20 rounded text-[10px] font-semibold uppercase">Đã hủy</span>;
      default: return <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] font-semibold uppercase">{status}</span>;
    }
  };

  const getRequestFormDisplay = (form: RequestFormResponse) => {
    const formatDate = (val?: string) => {
      if (!val) return "";
      try { return format(new Date(val), "dd/MM/yyyy"); } catch { return val; }
    };
    const formatTime = (val?: string) => { return val ? val.substring(0, 5) : ""; };
    const sessionStr = (val?: string) => {
      if (val === "MORNING") return "(Sáng)";
      if (val === "AFTERNOON") return "(Chiều)";
      if (val === "FULL_DAY") return "(Cả ngày)";
      return "";
    };

    let calculatedDays = 0;
    if (form.startDate && form.endDate) {
       try {
          const start = new Date(form.startDate);
          start.setHours(0,0,0,0);
          const end = new Date(form.endDate);
          end.setHours(0,0,0,0);
          calculatedDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;
          if (form.startSession === "AFTERNOON") calculatedDays -= 0.5;
          if (form.endSession === "MORNING") calculatedDays -= 0.5;
          calculatedDays = Math.max(0, calculatedDays);
       } catch (e) {
          console.debug("Date parsing error:", e);
       }
    }

    switch (form.type) {
      case "LEAVE": return { title: "Đơn nghỉ phép", lines: [`Thời gian nghỉ: ${formatDate(form.startDate)} ${sessionStr(form.startSession)} → ${formatDate(form.endDate)} ${sessionStr(form.endSession)}`, `Số ngày công: ${calculatedDays} ngày`] };
      case "WFH": return { title: "Đơn làm việc tại nhà", lines: [`Thời gian WFH: ${formatDate(form.startDate)} → ${formatDate(form.endDate)}`, `Số ngày công: ${calculatedDays || 1} ngày`] };
      case "ABSENCE": return { title: "Đơn vắng mặt", reasonTypeStr: form.absenceReasonType === "PERSONAL" ? "Việc cá nhân" : form.absenceReasonType === "COMPANY" ? "Việc công ty" : null, reasonTypeKind: form.absenceReasonType, lines: [`Ngày vắng: ${formatDate(form.absenceDate)}`, `Khung giờ: ${formatTime(form.fromTime)} → ${formatTime(form.toTime)}`] };
      case "ATTENDANCE_ADJUSTMENT": return { title: "Đơn điều chỉnh chấm công", lines: [`Ngày chấm công: ${formatDate(form.attendanceDate)}`, `Loại điều chỉnh: ${form.timeType === "CHECK_IN" ? "Giờ vào" : "Giờ ra"}`, `Giờ đề xuất: ${formatTime(form.requestedTime)}`] };
      case "BUSINESS_TRIP": return { title: "Đơn công tác", lines: [`Thời gian công tác: ${formatDate(form.startDate)} → ${formatDate(form.endDate)}`, `Số ngày công: ${calculatedDays || 1} ngày`] };
      case "RESIGNATION": return { title: "Đơn nghỉ việc", lines: [`Ngày nộp đơn: ${formatDate(form.submissionDate)}`, `Ngày làm việc cuối: ${formatDate(form.lastWorkingDate)}`, `Ngày nghỉ việc: ${formatDate(form.resignationDate)}`] };
      default: return { title: "Đơn yêu cầu", lines: [] };
    }
  };


  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const maxWorkingDays = getWorkingDaysInMonth(month, year);

  return (
    <div className="w-full p-4 md:p-8 flex flex-col gap-6 md:gap-8">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <m.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col gap-2"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-[#1E2062] flex items-center gap-3">
              <span className="p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl flex items-center justify-center">
                <CalendarCheck size={26} strokeWidth={2.5} />
              </span>
              {t("myAttendance.title")}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base ml-1">
              {t("myAttendance.subtitle")}
            </p>
          </m.div>

          <div className="flex items-center gap-4 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 focus:outline-none"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2 font-medium text-slate-700 min-w-[120px] justify-center text-[15px]">
              <CalendarIcon size={18} className="text-indigo-600" />
              {t("myAttendance.monthPrefix")} {month}/{year}
            </div>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 focus:outline-none"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {!loading && data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* LEFT COLUMN: WORK UNITS & NORMAL ATTENDANCE (COMBINED) */}
            <m.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden h-full"
            >
              {/* UPPER SECTION: WORK UNITS */}
              <div className="p-5 flex flex-col border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 mt-1">
                    <Target size={18} strokeWidth={2} className="text-indigo-600" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-700">{t("myAttendance.summary.workUnits", { defaultValue: "Công ghi nhận" })}</span>
                  </div>
                  <button 
                    onClick={() => setShowStatsRules(true)}
                    className="flex items-center gap-1.5 text-[11px] uppercase font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 bg-white border border-indigo-200 px-2.5 py-1.5 rounded-lg transition-all shadow-sm"
                  >
                    <FileText size={14} />
                    Giải thích chỉ số
                  </button>
                </div>
                <div className="flex items-center mt-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-medium text-slate-400 uppercase mb-0.5">Tổng số công</span>
                    <div className="flex items-baseline gap-1">
                      <div className="text-3xl font-bold text-slate-800">{data.summary?.workUnits ?? 0}</div>
                      <div className="text-sm font-semibold text-slate-400">/ {maxWorkingDays} ngày</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* LOWER SECTION: NORMAL ATTENDANCE */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarCheck size={16} className="text-indigo-500" />
                  <h3 className="font-semibold text-slate-700 text-sm">{t("myAttendance.section.attendance", { defaultValue: "Chi tiết đi làm" })}</h3>
                </div>
                <div className="grid grid-cols-2 gap-y-5 gap-x-6 flex-1">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-500">{t("myAttendance.summary.workingDays")}</span>
                    <span className="text-xl font-bold text-slate-800">{data.summary?.workingDays ?? 0}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-500">{t("myAttendance.summary.approvedWfh", { defaultValue: "Ngày WFH đã duyệt" })}</span>
                    <span className="text-xl font-bold text-slate-700">{data.summary?.approvedWfhDays ?? 0}</span>
                  </div>
                  <div className="flex flex-col gap-1 border-t border-slate-100 pt-3">
                    <span className="text-[11px] font-medium text-slate-500">{t("myAttendance.summary.lateDays", { defaultValue: "Số ngày đi muộn" })}</span>
                    <span className="text-xl font-bold text-slate-700">{data.summary?.lateDays ?? 0}</span>
                  </div>
                  <div className="flex flex-col gap-1 border-t border-slate-100 pt-3">
                    <span className="text-[11px] font-medium text-slate-500">{t("myAttendance.summary.absentDays", { defaultValue: "Số ngày vắng" })}</span>
                    <span className="text-xl font-bold text-slate-700">{data.summary?.absentDays ?? 0}</span>
                  </div>
                </div>
              </div>
            </m.div>

            {/* RIGHT COLUMN: KỶ LUẬT & VI PHẠM (COMBINED) */}
            <m.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden"
            >
              {/* UPPER SECTION: DISCIPLINE SCORE */}
              <div className="p-5 flex flex-col border-b border-slate-100 bg-slate-50/50">
                {(() => {
                  const score = data.summary?.disciplineScore ?? 0;
                  let textColor = "text-slate-800";
                  
                  if (score >= 4) {
                    textColor = "text-emerald-600";
                  } else if (score === 3) {
                    textColor = "text-amber-500";
                  } else if (score > 0 && score <= 2) {
                    textColor = "text-rose-500";
                  }

                  return (
                    <div className="flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 mt-1">
                          <Medal size={18} strokeWidth={2} className="text-indigo-600" />
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-700">Kỷ luật giờ giấc</span>
                        </div>
                        <button 
                          onClick={() => setShowDisciplineRules(true)}
                          className="flex items-center gap-1.5 text-[11px] uppercase font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 bg-white border border-indigo-200 px-2.5 py-1.5 rounded-lg transition-all shadow-sm"
                        >
                          <FileText size={14} />
                          Quy tắc & Cách tính
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-6 mt-1">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-medium text-slate-400 mb-0.5">ĐIỂM SỐ</span>
                          <div className="flex items-baseline gap-1">
                            <div className={`text-3xl font-bold ${textColor}`}>{score}</div>
                            <div className="text-sm font-semibold text-slate-400">/5</div>
                          </div>
                        </div>
                        <div className="w-px h-10 bg-slate-200"></div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-medium text-slate-400 mb-0.5">PHỤ CẤP / THƯỞNG</span>
                          <div className="flex items-baseline gap-1">
                            {(data.summary?.punctualityDisciplineAllowance ?? 0) > 0 && <span className="text-xl font-medium text-emerald-600">+</span>}
                            <div className="text-2xl font-bold text-slate-800 shrink-0">{(data.summary?.punctualityDisciplineAllowance ?? 0).toLocaleString('en-US')}</div>
                            <div className="text-xs font-semibold text-slate-400 ml-1">VNĐ</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* LOWER SECTION: VIOLATIONS */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <AlertOctagon size={16} className="text-rose-500" />
                  <h3 className="font-semibold text-slate-700 text-sm">{t("myAttendance.section.violations", { defaultValue: "Vi phạm & Phạt" })}</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-4 flex-1">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-500" title="Số lần đi trễ/về sớm từ 120 phút trở lên">{t("myAttendance.summary.majorViolations", { defaultValue: "Trễ/về sớm ≥120 phút" })}</span>
                    <span className="text-xl font-bold text-slate-800">{displayNumber(data?.summary?.majorLateEarlyViolationTimes)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-500">{t("myAttendance.summary.wfhOverLimit", { defaultValue: "Số ngày WFH vượt quota" })}</span>
                    <span className="text-xl font-bold text-slate-800">{displayNumber(data?.summary?.wfhOverLimitDays)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-500">{t("myAttendance.summary.deductedViolations", { defaultValue: "Số lần bị trừ do trễ/về sớm" })}</span>
                    <span className="text-xl font-bold text-slate-800">{displayNumber(data?.summary?.leaveDeductionViolationTimes)}</span>
                  </div>
                  
                  <div className="flex flex-col gap-1 border-t border-slate-100 pt-3">
                    <span className="text-[11px] font-medium text-slate-500">{t("myAttendance.summary.deductedDays", { defaultValue: "Phép/công trừ do trễ/về sớm" })}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xl font-bold text-rose-500">{displayNumber(data?.summary?.leaveDeductionDays) > 0 ? `-${displayNumber(data?.summary?.leaveDeductionDays)}` : displayNumber(data?.summary?.leaveDeductionDays)}</span>
                      {displayNumber(data?.summary?.leaveDeductionDays) > 0 && <span className="text-[10px] text-slate-400 uppercase">Ngày</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 border-t border-slate-100 pt-3 md:col-span-2">
                    <span className="text-[11px] font-medium text-slate-500">{t("myAttendance.summary.wfhLeaveDeduction", { defaultValue: "Phép/công trừ do WFH vượt" })}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xl font-bold text-rose-500">{displayNumber(data?.summary?.wfhLeaveDeductionDays) > 0 ? `-${displayNumber(data?.summary?.wfhLeaveDeductionDays)}` : displayNumber(data?.summary?.wfhLeaveDeductionDays)}</span>
                      {displayNumber(data?.summary?.wfhLeaveDeductionDays) > 0 && <span className="text-[10px] text-slate-400 uppercase">Ngày</span>}
                    </div>
                  </div>
                </div>
              </div>
            </m.div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
              <p>{t("myAttendance.loading")}</p>
            </div>
          ) : (
            <div className="bg-slate-200 border-x border-b border-slate-200">
              {/* Header Days */}
              <div className="grid grid-cols-5 gap-px border-b border-slate-200">
                {[
                  t("myAttendance.days.mon"), 
                  t("myAttendance.days.tue"), 
                  t("myAttendance.days.wed"), 
                  t("myAttendance.days.thu"), 
                  t("myAttendance.days.fri")
                ].map(d => (
                  <div key={d} className="bg-slate-50/80 py-3 text-center text-[13px] font-semibold text-slate-600 uppercase tracking-widest">
                    {d}
                  </div>
                ))}
              </div>
              
              {/* Grid content */}
              <div className="grid grid-cols-5 gap-px">
                {(() => {
                  const startInterval = new Date(year, month - 2, 25);
                  const endInterval = new Date(year, month - 1, 24);
                  const allDays = eachDayOfInterval({ start: startInterval, end: endInterval });
                  
                  // Lọc bỏ Thứ 7 và Chủ Nhật khỏi mảng render
                  const workingDaysList = allDays.filter(d => {
                    const dayOfWeek = getDay(d);
                    return dayOfWeek !== 0 && dayOfWeek !== 6;
                  });

                  // Tính padding dựa trên ngày làm việc đầu tiên của kỳ
                  let paddingLength = 0;
                  if (workingDaysList.length > 0) {
                     paddingLength = getDay(workingDaysList[0]) - 1;
                     if (paddingLength < 0) paddingLength = 0;
                  }

                  return (
                    <>
                      {/* Padding cells */}
                      {Array.from({ length: paddingLength }).map((_, i) => (
                        <div key={`empty-${i}`} className="bg-slate-50/30 min-h-[130px] p-2" />
                      ))}

                      {/* Day cells */}
                      {workingDaysList.map((dateObj, index) => {
                        const dateStr = format(dateObj, "yyyy-MM-dd");
                        const record = data?.records?.find(r => r.attendanceDate === dateStr);
                        const hasData = !!(record?.actualCheckIn || record?.actualCheckOut);
                        const approvedLeaves = record?.requestForms?.filter(f => f.type === "LEAVE" && f.status === "APPROVED") || [];
                        const approvedWfhs = record?.requestForms?.filter(f => f.type === "WFH" && f.status === "APPROVED") || [];
                        const approvedTrips = record?.requestForms?.filter(f => f.type === "BUSINESS_TRIP" && f.status === "APPROVED") || [];
                        const approvedAbsences = record?.requestForms?.filter(f => f.type === "ABSENCE" && f.status === "APPROVED") || [];
                        
                        const hasLeave = approvedLeaves.length > 0;
                        const hasWfh = approvedWfhs.length > 0;
                        const hasTrip = approvedTrips.length > 0;
                        const hasAbsence = approvedAbsences.length > 0;
                        const isInteractive = hasData || hasLeave || hasWfh || hasTrip || hasAbsence || (record?.requestForms && record.requestForms.length > 0);

                        return (
                          <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2, delay: index * 0.015 }}
                            key={dateStr}
                            onClick={() => {
                              if (isInteractive) setSelectedRecord({ ...record!, dateObj });
                            }}
                            className={`min-h-[140px] p-2 md:p-3 flex flex-col gap-1.5 transition-colors group relative bg-white ${
                              isInteractive ? "cursor-pointer hover:shadow-inner hover:bg-slate-50/80 hover:z-10 ring-1 ring-transparent hover:ring-indigo-100" : ""
                            }`}
                          >
                            <div className="absolute top-2 right-2 z-10 w-full flex justify-end px-2 pointer-events-none">
                              <span className="text-[13px] font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">
                                {format(dateObj, "d/M")}
                              </span>
                            </div>

                            {(() => {
                              let bigNumberContent: React.ReactNode = null;
                              let bigNumberColor = "text-emerald-500";

                              if (hasData && record?.workUnit !== undefined && record.workUnit > 0) {
                                  const wu = Number(record.workUnit.toFixed(2));
                                  bigNumberContent = wu;
                                  bigNumberColor = wu >= 1 ? "text-emerald-500" : "text-amber-500";
                              } else if (hasLeave || hasWfh || hasTrip) {
                                  // Fallback display if they have paid forms
                                  bigNumberContent = "1";
                                  bigNumberColor = "text-emerald-500";
                              }

                              if (!bigNumberContent) return null;

                              return (
                                <div className="absolute top-[40%] w-full left-0 flex flex-col items-center justify-center select-none pointer-events-none -translate-y-[50%]">
                                  <span className={`text-[46px] leading-none font-bold tracking-tighter ${bigNumberColor}`}>
                                    {bigNumberContent}
                                  </span>
                                </div>
                              );
                            })()}
                            
                            <div className="absolute bottom-2 left-0 w-full px-2 flex flex-col gap-1 z-10 pointer-events-none">
                              {hasData && (record?.actualCheckIn || record?.actualCheckOut) && (
                                <div className="flex justify-center items-center gap-1.5 text-[11px] font-bold tracking-tight bg-white/70 backdrop-blur-xs py-0.5 rounded">
                                  {record?.actualCheckIn && <span className={record.checkInValid === false ? 'text-rose-500' : 'text-slate-400'}>{record.actualCheckIn.substring(0, 5)}</span>}
                                  {(record?.actualCheckIn || record?.actualCheckOut) && <span className="text-slate-300 font-medium">-</span>}
                                  {record?.actualCheckOut && <span className={record.checkOutValid === false ? 'text-rose-500' : 'text-slate-400'}>{record.actualCheckOut.substring(0, 5)}</span>}
                                </div>
                              )}

                              {(() => {
                                const activeBadges: { label: string, type: 'indigo' | 'slate' | 'rose' }[] = [];
                                if (hasLeave) activeBadges.push({ label: "NGHỈ PHÉP", type: 'indigo' });
                                if (hasWfh) activeBadges.push({ label: "WFH", type: 'indigo' });
                                if (hasTrip) activeBadges.push({ label: "CÔNG TÁC", type: 'indigo' });
                                if (hasAbsence) activeBadges.push({ label: "VẮNG", type: 'slate' });
                                if (!hasData && !hasLeave && !hasWfh && !hasTrip && !hasAbsence && record?.absent) {
                                  activeBadges.push({ label: "VẮNG MẶT", type: 'rose' });
                                }

                                const primaryBadge = activeBadges.length > 0 ? activeBadges[0] : null;
                                const extraCount = activeBadges.length > 1 ? activeBadges.length - 1 : 0;

                                if (!primaryBadge) return null;

                                return (
                                  <div className="flex items-center justify-center gap-1 w-full mt-1">
                                    <span className={`text-[10px] uppercase font-bold px-1.5 py-1 rounded text-center truncate min-w-0 shadow-sm ${
                                      primaryBadge.type === 'indigo' ? 'text-indigo-600 bg-indigo-50 border border-indigo-100/50' :
                                      primaryBadge.type === 'rose' ? 'text-rose-500 bg-rose-50 border border-rose-100/50' :
                                      'text-slate-500 bg-slate-50 border border-slate-200'
                                    } ${extraCount > 0 ? 'flex-1' : 'w-full'}`}>
                                      {primaryBadge.label}
                                    </span>
                                    {extraCount > 0 && (
                                      <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-1 rounded shrink-0 shadow-sm">
                                        +{extraCount}
                                      </span>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          </m.div>
                        );
                      })}
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selectedRecord} onOpenChange={(open) => {
        if (!open) {
          setSelectedRecord(null);
          setExpandedRequests(new Set());
        }
      }}>
        <DialogContent showCloseButton={false} className="border-0 shadow-2xl p-0 overflow-hidden bg-transparent flex flex-col h-[90vh] max-w-[85vw]! md:max-w-[75vw]! w-full mx-auto my-auto">
          {selectedRecord && (
            <div className="bg-white flex flex-col relative w-full h-full rounded-2xl overflow-hidden">
              {/* Header section with gradient */}
              <div className="bg-linear-to-b from-indigo-500 to-indigo-600 p-6 pb-20 text-white relative shrink-0">
                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="absolute top-4 right-4 p-1.5 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white"
                >
                  <X size={20} />
                </button>
                <DialogHeader className="space-y-1">
                  <DialogTitle className="text-xl font-bold flex flex-col text-white">
                    {t("myAttendance.modalTitle")}
                  </DialogTitle>
                  <DialogDescription className="text-indigo-100 font-medium opacity-90">
                    {format(selectedRecord.dateObj, "EEEE, dd/MM/yyyy", { locale: vi })}
                  </DialogDescription>
                </DialogHeader>
              </div>

              {/* Body */}
              <div className="px-6 py-8 flex gap-8 -mt-10 bg-white rounded-t-3xl relative z-10 border-t-4 border-indigo-400 flex-1 overflow-y-auto w-full custom-scrollbar">
                
                {/* Left Column: Metrics & Info */}
                <div className="flex-1 flex flex-col gap-6 pr-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 p-4 rounded-xl bg-slate-50 border border-slate-100 items-center justify-center">
                      <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-full mb-1">{t("myAttendance.checkIn")}</span>
                      {selectedRecord.actualCheckIn ? (
                        <span className={`text-2xl font-bold ${selectedRecord.checkInValid === false ? 'text-rose-500' : 'text-emerald-600'}`}>
                          {selectedRecord.actualCheckIn.substring(0, 5)}
                        </span>
                      ) : (
                        <span className="text-2xl font-bold text-slate-300">--:--</span>
                      )}
                      {selectedRecord.actualCheckIn && (
                        selectedRecord.checkInValid === true ? (
                          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded mt-1">{t("myAttendance.onTime", { defaultValue: "Đúng giờ" })}</span>
                        ) : (
                          <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded mt-1">
                            {t("myAttendance.late")} {selectedRecord.lateMinutes ? `${selectedRecord.lateMinutes}${t("myAttendance.unitMinute")}` : ''}
                          </span>
                        )
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-1 p-4 rounded-xl bg-slate-50 border border-slate-100 items-center justify-center">
                      <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-full mb-1">{t("myAttendance.checkOut")}</span>
                      {selectedRecord.actualCheckOut ? (
                        <span className={`text-2xl font-bold ${selectedRecord.checkOutValid === false ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {selectedRecord.actualCheckOut.substring(0, 5)}
                        </span>
                      ) : (
                        <span className="text-2xl font-bold text-slate-300">--:--</span>
                      )}
                      {selectedRecord.actualCheckOut && (
                        selectedRecord.checkOutValid === true ? (
                           <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded mt-1">{t("myAttendance.onTime", { defaultValue: "Đúng giờ" })}</span>
                        ) : (
                           <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded mt-1">
                             {t("myAttendance.earlyLeave")} {selectedRecord.earlyLeaveMinutes ? `${selectedRecord.earlyLeaveMinutes}${t("myAttendance.unitMinute")}` : ''}
                           </span>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1 border-b border-slate-100 pb-2">{t("myAttendance.metricsSection")}</div>
                    <div className="grid grid-cols-2 gap-4 my-2">
                      <div className="flex flex-col items-center justify-center bg-indigo-50/50 rounded-lg p-3 border border-indigo-100/50">
                         <span className="text-[11px] font-semibold text-slate-500 uppercase">{t("myAttendance.workCoefficient")}</span>
                         <span className="text-lg font-bold text-indigo-700">{selectedRecord.workUnit !== undefined ? Number(selectedRecord.workUnit.toFixed(2)) : 0}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center bg-indigo-50/50 rounded-lg p-3 border border-indigo-100/50">
                         <span className="text-[11px] font-semibold text-slate-500 uppercase">{t("myAttendance.workTime")}</span>
                         <span className="text-lg font-bold text-indigo-700">{selectedRecord.workMinutes ? `${Math.floor(selectedRecord.workMinutes / 60)}${t("myAttendance.unitHour")}${selectedRecord.workMinutes % 60}${t("myAttendance.unitMinute")}` : `0${t("myAttendance.unitMinute")}`}</span>
                      </div>
                    </div>

                    <div className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1 mt-4">{t("myAttendance.personnelSection")}</div>
                    <div className="flex items-center justify-between text-sm py-2.5 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">{t("myAttendance.fullName")}</span>
                      <span className="text-slate-900 font-medium">{selectedRecord.employeeName || '--'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-2.5 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">{t("myAttendance.empCode")}</span>
                      <span className="text-slate-900 font-bold bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">{selectedRecord.employeeCode || '--'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-2.5">
                      <span className="text-slate-500 font-medium">{t("myAttendance.shiftSchedule")}</span>
                      <span className="text-slate-700 font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-xs">{selectedRecord.scheduledCheckIn?.substring(0,5) || '--'} - {selectedRecord.scheduledCheckOut?.substring(0,5) || '--'}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Request Forms List */}
                <div className="flex-1 flex flex-col border-l border-slate-200 pl-8">
                  <div className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1 border-b border-slate-100 pb-2">Đơn liên quan trong ngày</div>
                  {(!selectedRecord.requestForms || selectedRecord.requestForms.length === 0) ? (
                    <div className="text-sm text-slate-500 italic py-2">Không có đơn liên quan trong ngày này.</div>
                  ) : (
                    <div className="flex flex-col gap-3 mt-2 pr-2 overflow-y-auto w-full custom-scrollbar">
                      {selectedRecord.requestForms.map((req, idx) => {
                        const display = getRequestFormDisplay(req);
                        return (
                          <div key={idx} className="flex flex-col bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative">
                            <div className="flex items-start justify-between mb-1">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800 text-[15px] flex flex-wrap items-center gap-2">
                                  <FileText className="w-4 h-4 text-slate-400"/> {display.title}
                                  {display.reasonTypeStr && (
                                     <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 w-fit ${display.reasonTypeKind === 'PERSONAL' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                       {display.reasonTypeStr}
                                     </span>
                                  )}
                                </span>
                                {req.status === "APPROVED" && (
                                  <span className="text-[13px] text-emerald-600 font-medium mt-1">
                                    {req.type === "LEAVE" && ((selectedRecord.actualCheckIn || selectedRecord.actualCheckOut) ? "Đã tính công bổ sung theo Summary" : "Được tính công theo phép")}
                                    {req.type === "WFH" && "Được tính công theo hình thức làm từ xa"}
                                    {req.type === "BUSINESS_TRIP" && "Được tính công theo chuyến công tác"}
                                    {req.type === "ABSENCE" && "Thời gian vắng hợp lệ được cộng trực tiếp vào công ngày"}
                                    {req.type === "ATTENDANCE_ADJUSTMENT" && "Đã cộng và đồng bộ vào báo cáo chấm công"}
                                  </span>
                                )}
                              </div>
                              {getRequestStatusBadge(req.status)}
                            </div>

                            <div className="flex flex-col mt-4">
                              {display.lines.map((l, i) => {
                                const splitIdx = l.indexOf(": ");
                                const label = splitIdx !== -1 ? l.substring(0, splitIdx) : "";
                                const value = splitIdx !== -1 ? l.substring(splitIdx + 2) : l;
                                return (
                                  <div key={i} className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] items-center gap-4 py-2.5 border-b border-slate-100 border-dashed last:border-0 hover:bg-slate-50/50 transition-colors -mx-4 px-4">
                                    {label && <span className="text-[13px] font-medium text-slate-400">{label}</span>}
                                    <span className="text-[14px] font-bold text-slate-800 tracking-tight">{value}</span>
                                  </div>
                                );
                              })}
                            </div>

                            {expandedRequests.has(req.id) && req.description && (
                              <div className="flex flex-col gap-2 pt-4 pb-2 border-t border-slate-100 border-dashed mt-2">
                                <span className="text-slate-400 text-[12px] uppercase font-bold tracking-widest">Lý do / Mô tả</span>
                                <div className="text-[13.5px] text-slate-700 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                                  <RichTextViewer htmlContent={req.description} />
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between text-[12.5px] font-medium text-slate-500 mt-5 pt-4 border-t border-slate-100">
                                <span>Ngày tạo: {req.submittedAt ? format(new Date(req.submittedAt), "dd/MM/yyyy HH:mm") : "--"}</span>
                                {req.description && (
                                  <button 
                                    onClick={() => setExpandedRequests(prev => {
                                      const next = new Set(prev);
                                      if (next.has(req.id)) next.delete(req.id);
                                      else next.add(req.id);
                                      return next;
                                    })}
                                    className="text-indigo-600 hover:text-indigo-700 font-bold px-3 py-1.5 rounded-lg bg-indigo-50/50 hover:bg-indigo-100 transition-colors"
                                  >
                                    {expandedRequests.has(req.id) ? "Ẩn chi tiết" : "Xem chi tiết"}
                                  </button>
                                )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showDisciplineRules} onOpenChange={setShowDisciplineRules}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="p-5 border-b border-slate-100 shrink-0">
            <DialogTitle className="text-[17px] flex items-center gap-2 text-indigo-800">
              <div className="p-1.5 bg-indigo-50 rounded-md">
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              Quy tắc chấm công & Kỷ luật giờ giấc
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto w-full p-6 flex flex-col gap-8 custom-scrollbar bg-slate-50/50">
            {/* 1. THỜI GIAN LÀM VIỆC */}
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-slate-800 text-[15px] flex items-center gap-2 border-b border-slate-200 pb-2">
                <Clock size={16} className="text-indigo-500" />
                Thời gian làm việc
              </h4>
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="font-semibold text-slate-800 text-[13px]">Giờ làm việc:</span>
                  <ul className="list-none text-[13px] text-slate-600 space-y-1">
                    <li className="flex gap-2 items-start"><span className="text-indigo-400 mt-0.5">•</span> <span>Ca sáng: 08:00 - 12:00</span></li>
                    <li className="flex gap-2 items-start"><span className="text-indigo-400 mt-0.5">•</span> <span>Ca chiều: 13:30 - 17:30</span></li>
                  </ul>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="font-semibold text-slate-800 text-[13px]">Thời gian ân hạn:</span>
                  <ul className="list-none text-[13px] text-slate-600 space-y-1">
                    <li className="flex gap-2 items-start"><span className="text-indigo-400 mt-0.5">•</span> <span>Nhân viên có thể check-in muộn nhất lúc <strong className="font-semibold text-indigo-600">08:15</strong> mà không bị tính là trễ sau thời gian ân hạn.</span></li>
                    <li className="flex gap-2 items-start"><span className="text-indigo-400 mt-0.5">•</span> <span>Check-in sau 08:15 sẽ được tính là trễ.</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 2. QUY ĐỊNH PHẠT & TRỪ PHÉP */}
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-slate-800 text-[15px] flex items-center gap-2 border-b border-slate-200 pb-2">
                <AlertOctagon size={16} className="text-rose-500" />
                Quy định phạt & Trừ phép/công
              </h4>
              <div className="bg-rose-50/50 rounded-xl border border-rose-100 p-4 flex flex-col gap-4 shadow-sm">
                
                <div className="flex flex-col gap-2 mt-1">
                  <span className="font-bold text-rose-800 text-[13px] flex items-center gap-1.5"><AlertTriangle size={14}/> 1. Trễ/về sớm từ 120 phút trở lên</span>
                  <ul className="list-none text-[12.5px] text-slate-700 pl-5 space-y-1.5">
                    <li className="flex gap-2.5 items-start"><span className="text-rose-400 mt-0.5 font-bold">-</span> <span className="leading-relaxed">Mỗi ngày nếu nhân viên đi trễ từ 120 phút trở lên hoặc về sớm từ 120 phút trở lên thì được tính là 1 lần trễ/về sớm nghiêm trọng.</span></li>
                    <li className="flex gap-2.5 items-start"><span className="text-rose-400 mt-0.5 font-bold">-</span> <span className="leading-relaxed">Cứ mỗi <strong className="text-rose-600">2 lần</strong> trễ/về sớm nghiêm trọng sẽ bị <strong className="text-rose-600 bg-rose-100 px-1 rounded">trừ 0.5 ngày phép/công</strong>.</span></li>
                    <li className="flex gap-2.5 items-start"><span className="text-rose-400 mt-0.5 font-bold">-</span> <span className="leading-relaxed">Sau mỗi lần bị trừ, bộ đếm bắt đầu lại theo chu kỳ mới.</span></li>
                  </ul>
                  <div className="bg-white/70 p-3 rounded-lg border border-rose-100 mt-1 ml-5 flex flex-col gap-1.5">
                    <span className="font-semibold text-[12px] text-slate-800">Ví dụ:</span>
                    <ul className="list-none text-[12px] text-slate-600 space-y-1">
                      <li>• 1 lần trễ/về sớm từ 120 phút trở lên: chưa trừ.</li>
                      <li>• 2 lần: trừ 0.5 ngày phép/công.</li>
                      <li>• 3 lần: vẫn trừ 0.5 ngày phép/công.</li>
                      <li>• 4 lần: trừ tổng 1.0 ngày phép/công.</li>
                    </ul>
                  </div>

                </div>

                <div className="w-full h-px bg-rose-100/50"></div>

                <div className="flex flex-col gap-2">
                  <span className="font-bold text-rose-800 text-[13px] flex items-center gap-1.5"><AlertTriangle size={14}/> 2. Làm việc tại nhà (WFH) vượt hạn mức</span>
                  <ul className="list-none text-[12.5px] text-slate-700 pl-5 space-y-1.5">
                    <li className="flex gap-2.5 items-start"><span className="text-rose-400 mt-0.5 font-bold">-</span> <span className="leading-relaxed">Nhân viên có hạn mức WFH theo hồ sơ.</span></li>
                    <li className="flex gap-2.5 items-start"><span className="text-rose-400 mt-0.5 font-bold">-</span> <span className="leading-relaxed">Nếu số ngày WFH đã được duyệt vượt quá hạn mức, phần vượt sẽ bị trừ phép/công.</span></li>
                    <li className="flex gap-2.5 items-start"><span className="text-rose-400 mt-0.5 font-bold">-</span> <span className="leading-relaxed">Mỗi ngày WFH vượt hạn mức bị <strong className="text-rose-600 bg-rose-100 px-1 rounded">trừ 0.5 ngày phép/công</strong>.</span></li>
                  </ul>
                  <div className="bg-white/70 p-3 rounded-lg border border-rose-100 mt-1 ml-5 flex flex-col gap-1.5">
                    <span className="font-semibold text-[12px] text-slate-800">Ví dụ (Hạn mức WFH = 6 ngày):</span>
                    <ul className="list-none text-[12px] text-slate-600 space-y-1">
                      <li>• Được duyệt 6 ngày WFH: không vượt, không trừ.</li>
                      <li>• Được duyệt 7 ngày WFH: vượt 1 ngày, trừ 0.5 ngày phép/công.</li>
                      <li>• Được duyệt 8 ngày WFH: vượt 2 ngày, trừ 1.0 ngày phép/công.</li>
                    </ul>
                  </div>

                </div>

                <div className="w-full h-px bg-rose-100/50"></div>

                <div className="flex flex-col gap-2">
                  <span className="font-bold text-rose-800 text-[13px] flex items-center gap-1.5"><AlertTriangle size={14}/> 3. Vắng mặt / không đủ công</span>
                  <ul className="list-none text-[12.5px] text-slate-700 pl-5 space-y-1.5">
                    <li className="flex gap-2.5 items-start"><span className="text-rose-400 mt-0.5 font-bold">-</span> <span className="leading-relaxed">Nếu ngày công bị thiếu và không có dữ liệu chấm công hợp lệ, ngày đó được tính là vắng.</span></li>
                    <li className="flex gap-2.5 items-start"><span className="text-rose-400 mt-0.5 font-bold">-</span> <span className="leading-relaxed">Nếu trong tháng có ngày vắng hoặc ngày không đủ công, điểm kỷ luật tháng là <strong className="text-rose-600">1 điểm</strong>.</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. BẢNG ĐIỂM */}
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-slate-800 text-[15px] flex items-center gap-2 border-b border-slate-200 pb-2">
                <Medal size={16} className="text-emerald-500" />
                Bảng điểm kỷ luật & Phụ cấp
              </h4>
              <div className="flex flex-col gap-4">
                
                {/* 5 Points */}
                <div className="flex items-start gap-4 bg-white p-4 rounded-xl border border-emerald-200 shadow-xs relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 p-3 opacity-[0.03]"><Medal className="w-24 h-24 text-emerald-600" /></div>
                  <div className="bg-emerald-50 p-2 rounded-xl shrink-0 border border-emerald-100/50">
                    <div className="font-black text-emerald-600 text-xl w-8 text-center flex items-center justify-center">5đ</div>
                  </div>
                  <div className="flex flex-col gap-2.5 w-full z-10">
                    <div className="flex flex-wrap md:flex-nowrap justify-between items-start md:items-center gap-2 border-b border-slate-50 pb-2">
                       <span className="font-bold text-emerald-800 text-[15px]">Xuất sắc</span>
                       <span className="font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg text-[13px] shrink-0 shadow-sm">
                         Phụ cấp: 200,000 VNĐ
                       </span>
                    </div>
                    <ul className="list-none text-[13px] text-slate-600 space-y-1.5">
                       <li className="flex gap-2 items-start"><span className="text-emerald-400 mt-0.5">•</span> <span>Check-in trước hoặc đúng 08:00.</span></li>
                       <li className="flex gap-2 items-start"><span className="text-emerald-400 mt-0.5">•</span> <span>Đảm bảo đủ công mỗi ngày.</span></li>
                       <li className="flex gap-2 items-start"><span className="text-emerald-400 mt-0.5">•</span> <span>Không có ngày vắng hoặc thiếu công.</span></li>
                    </ul>
                  </div>
                </div>

                {/* 4 Points */}
                <div className="flex items-start gap-4 bg-white p-4 rounded-xl border border-blue-200 shadow-xs relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 p-3 opacity-[0.03]"><Medal className="w-24 h-24 text-blue-600" /></div>
                  <div className="bg-blue-50 p-2 rounded-xl shrink-0 border border-blue-100/50">
                    <div className="font-black text-blue-600 text-xl w-8 text-center flex items-center justify-center">4đ</div>
                  </div>
                  <div className="flex flex-col gap-2.5 w-full z-10">
                    <div className="flex flex-wrap md:flex-nowrap justify-between items-start md:items-center gap-2 border-b border-slate-50 pb-2">
                       <span className="font-bold text-blue-800 text-[15px]">Tốt</span>
                       <span className="font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-lg text-[13px] shrink-0 shadow-sm">
                         Phụ cấp: 150,000 VNĐ
                       </span>
                    </div>
                    <ul className="list-none text-[13px] text-slate-600 space-y-1.5">
                       <li className="flex gap-2 items-start"><span className="text-blue-400 mt-0.5">•</span> <span>Không có ngày trễ sau thời gian ân hạn.</span></li>
                       <li className="flex gap-2 items-start"><span className="text-blue-400 mt-0.5">•</span> <span>Có thể check-in trong khoảng 08:00 - 08:15.</span></li>
                       <li className="flex gap-2 items-start"><span className="text-blue-400 mt-0.5">•</span> <span>Đảm bảo đủ công mỗi ngày.</span></li>
                       <li className="flex gap-2 items-start"><span className="text-blue-400 mt-0.5">•</span> <span>Không có ngày vắng hoặc thiếu công.</span></li>
                    </ul>
                  </div>
                </div>

                {/* 3 Points */}
                <div className="flex items-start gap-4 bg-white p-4 rounded-xl border border-indigo-200 shadow-xs relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 p-3 opacity-[0.03]"><Medal className="w-24 h-24 text-indigo-600" /></div>
                  <div className="bg-indigo-50 p-2 rounded-xl shrink-0 border border-indigo-100/50">
                    <div className="font-black text-indigo-600 text-xl w-8 text-center flex items-center justify-center">3đ</div>
                  </div>
                  <div className="flex flex-col gap-2.5 w-full z-10">
                    <div className="flex flex-wrap md:flex-nowrap justify-between items-start md:items-center gap-2 border-b border-slate-50 pb-2">
                       <span className="font-bold text-indigo-800 text-[15px]">Đạt yêu cầu</span>
                       <span className="font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-lg text-[13px] shrink-0 shadow-sm">
                         Phụ cấp: 100,000 VNĐ
                       </span>
                    </div>
                    <ul className="list-none text-[13px] text-slate-600 space-y-1.5">
                       <li className="flex gap-2 items-start"><span className="text-indigo-400 mt-0.5">•</span> <span>Số ngày trễ sau thời gian ân hạn từ 1 đến 3 lần/tháng.</span></li>
                       <li className="flex gap-2 items-start"><span className="text-indigo-400 mt-0.5">•</span> <span>Đảm bảo đủ công mỗi ngày.</span></li>
                       <li className="flex gap-2 items-start"><span className="text-indigo-400 mt-0.5">•</span> <span>Không có ngày vắng hoặc thiếu công.</span></li>
                    </ul>
                  </div>
                </div>

                {/* 2 Points */}
                <div className="flex items-start gap-4 bg-white p-4 rounded-xl border border-amber-200 shadow-xs relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 p-3 opacity-[0.03]"><AlertTriangle className="w-24 h-24 text-amber-600" /></div>
                  <div className="bg-amber-50 p-2 rounded-xl shrink-0 border border-amber-100/50">
                    <div className="font-black text-amber-600 text-xl w-8 text-center flex items-center justify-center">2đ</div>
                  </div>
                  <div className="flex flex-col gap-2.5 w-full z-10">
                    <div className="flex flex-wrap md:flex-nowrap justify-between items-start md:items-center gap-2 border-b border-slate-50 pb-2">
                       <span className="font-bold text-amber-800 text-[15px]">Vi phạm nhẹ</span>
                       <span className="font-medium text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg text-[13px] shrink-0">
                         Phụ cấp: 0 VNĐ
                       </span>
                    </div>
                    <ul className="list-none text-[13px] text-slate-600 space-y-1.5">
                       <li className="flex gap-2 items-start"><span className="text-amber-400 mt-0.5">•</span> <span>Số ngày trễ sau thời gian ân hạn từ 4 đến 7 lần/tháng.</span></li>
                       <li className="flex gap-2 items-start"><span className="text-amber-400 mt-0.5">•</span> <span>Đảm bảo đủ công mỗi ngày.</span></li>
                       <li className="flex gap-2 items-start"><span className="text-amber-400 mt-0.5">•</span> <span>Không có ngày vắng hoặc thiếu công.</span></li>
                    </ul>
                  </div>
                </div>

                {/* 1 Point */}
                <div className="flex items-start gap-4 bg-rose-50/50 p-4 rounded-xl border border-rose-200 shadow-xs relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 p-3 opacity-[0.03]"><AlertTriangle className="w-24 h-24 text-rose-600" /></div>
                  <div className="bg-rose-100/50 p-2 rounded-xl shrink-0 border border-rose-200/50">
                    <div className="font-black text-rose-600 text-xl w-8 text-center flex items-center justify-center">1đ</div>
                  </div>
                  <div className="flex flex-col gap-2.5 w-full z-10">
                    <div className="flex flex-wrap md:flex-nowrap justify-between items-start md:items-center gap-2 border-b border-rose-100/50 pb-2">
                       <span className="font-bold text-rose-800 text-[15px]">Vi phạm nặng</span>
                       <span className="font-medium text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg text-[13px] shrink-0">
                         Phụ cấp: 0 VNĐ
                       </span>
                    </div>
                    <div className="text-[13px] font-semibold text-rose-800/80 mb-1 mt-1">Rơi vào một trong các trường hợp:</div>
                    <ul className="list-none text-[13px] text-rose-900/80 space-y-1.5">
                       <li className="flex gap-2 items-start"><span className="text-rose-400 mt-0.5">•</span> <span>Số ngày trễ sau thời gian ân hạn trên 7 lần/tháng.</span></li>
                       <li className="flex gap-2 items-start"><span className="text-rose-400 mt-0.5">•</span> <span>Có ngày không đủ công.</span></li>
                       <li className="flex gap-2 items-start"><span className="text-rose-400 mt-0.5">•</span> <span>Có ngày vắng.</span></li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showStatsRules} onOpenChange={setShowStatsRules}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-6 gap-6">
          <DialogHeader>
            <DialogTitle className="text-[17px] flex items-center gap-2 text-indigo-800 border-b border-slate-200 pb-4">
              <div className="p-1.5 bg-indigo-50 rounded-md">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              Giải thích các chỉ số báo cáo
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto custom-scrollbar flex flex-col pr-2 pb-2">
            <div className="bg-white rounded-xl flex flex-col gap-6">

                <div className="flex flex-col gap-2">
                  <span className="font-bold text-slate-800 text-[14px] flex items-center gap-1.5">Công ghi nhận</span>
                  <ul className="list-none text-[13px] text-slate-600 pl-2 space-y-1.5">
                    <li className="flex gap-2.5 items-start"><span className="text-blue-400 mt-0.5">•</span> <span>Tổng công được ghi nhận trong tháng (tổng hợp từ công tính theo từng ngày).</span></li>
                    <li className="flex gap-2.5 items-start"><span className="text-blue-400 mt-0.5">•</span> <span>1 ngày đủ công = 1.0; Nửa ngày công = 0.5.</span></li>
                    <li className="flex gap-2.5 items-start"><span className="text-blue-400 mt-0.5">•</span> <span>Vắng/không đủ điều kiện = 0 hoặc theo tính toán thực tế.</span></li>
                  </ul>
                </div>
                <div className="w-full h-px bg-slate-100"></div>
                
                <div className="flex flex-col gap-2">
                  <span className="font-bold text-slate-800 text-[14px] flex items-center gap-1.5">Ngày đi làm</span>
                  <ul className="list-none text-[13px] text-slate-600 pl-2 space-y-1.5">
                    <li className="flex gap-2.5 items-start"><span className="text-blue-400 mt-0.5">•</span> <span>Số ngày có lịch làm việc trong tháng được hệ thống xét tổng kết.</span></li>
                    <li className="flex gap-2.5 items-start"><span className="text-blue-400 mt-0.5">•</span> <span>Thường là Thứ 2 - Thứ 6, không phải số công thực tế đạt được.</span></li>
                  </ul>
                </div>
                <div className="w-full h-px bg-slate-100"></div>

                <div className="flex flex-col gap-2">
                  <span className="font-bold text-slate-800 text-[14px] flex items-center gap-1.5">Ngày WFH đã duyệt</span>
                  <ul className="list-none text-[13px] text-slate-600 pl-2 space-y-1.5">
                    <li className="flex gap-2.5 items-start"><span className="text-blue-400 mt-0.5">•</span> <span>Tổng số ngày WFH đã được phê duyệt trong tháng.</span></li>
                    <li className="flex gap-2.5 items-start"><span className="text-blue-400 mt-0.5">•</span> <span>Dùng để đối chiếu với hạn mức (quota) WFH quy định của nhân viên.</span></li>
                  </ul>
                </div>
                <div className="w-full h-px bg-slate-100"></div>

                <div className="flex flex-col gap-2">
                  <span className="font-bold text-slate-800 text-[14px] flex items-center gap-1.5">Số ngày đi muộn</span>
                  <ul className="list-none text-[13px] text-slate-600 pl-2 space-y-1.5">
                    <li className="flex gap-2.5 items-start"><span className="text-blue-400 mt-0.5">•</span> <span>Số ngày có check-in trễ sau thời gian ân hạn.</span></li>
                    <li className="flex gap-2.5 items-start"><span className="text-blue-400 mt-0.5">•</span> <span>Check-in sau 08:15 thì tính 1 ngày đi muộn. Chỉ đếm theo ngày, không cộng dồn số phút.</span></li>
                  </ul>
                </div>
                <div className="w-full h-px bg-slate-100"></div>

                <div className="flex flex-col gap-2">
                  <span className="font-bold text-slate-800 text-[14px] flex items-center gap-1.5">Số ngày vắng</span>
                  <ul className="list-none text-[13px] text-slate-600 pl-2 space-y-1.5">
                    <li className="flex gap-2.5 items-start"><span className="text-blue-400 mt-0.5">•</span> <span>Số ngày làm việc bị đánh dấu vắng.</span></li>
                    <li className="flex gap-2.5 items-start"><span className="text-blue-400 mt-0.5">•</span> <span>Thường xảy ra khi ngày đó không có dữ liệu chấm công hợp lệ hoặc không đủ thông tin xử lý.</span></li>
                  </ul>
                </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
