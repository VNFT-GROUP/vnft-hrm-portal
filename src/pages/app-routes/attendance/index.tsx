import { useState } from "react";
import { format, eachDayOfInterval, getDay } from "date-fns";
import { vi } from "date-fns/locale";

import { attendanceService } from "@/services/attendance";
import type { AttendanceDailySummaryResponse } from "@/types/attendance/AttendanceDailySummaryResponse";
import type { RequestFormResponse } from "@/types/requestform/RequestFormResponse";
import { Loader2, Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, CalendarCheck, Target, TrendingDown, Medal, AlertOctagon, FileText } from "lucide-react";
import { m  } from 'framer-motion';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { RichTextViewer } from "@/components/custom/RichTextViewer";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

export default function MyAttendancePage() {
  const { t } = useTranslation();
  const [year, setYear] = useState<number>(() => new Date().getFullYear());
  const [month, setMonth] = useState<number>(() => new Date().getMonth() + 1);
  const [selectedRecord, setSelectedRecord] = useState<(AttendanceDailySummaryResponse & { dateObj: Date }) | null>(null);

  const { data: responseData, isLoading: loading } = useQuery({
    queryKey: ["my-attendance", year, month],
    queryFn: () => attendanceService.getCurrentUserMonthlyAttendance(year, month)
  });

  const data = responseData?.data;

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded text-[10px] font-semibold uppercase">Chờ duyệt</span>;
      case "APPROVED": return <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded text-[10px] font-semibold uppercase">Đã duyệt</span>;
      case "REJECTED": return <span className="px-2 py-0.5 bg-red-500/10 text-red-600 border border-red-500/20 rounded text-[10px] font-semibold uppercase">Từ chối</span>;
      case "CANCELED": return <span className="px-2 py-0.5 bg-slate-500/10 text-slate-600 border border-slate-500/20 rounded text-[10px] font-semibold uppercase">Đã hủy</span>;
      default: return <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] font-semibold uppercase">{status}</span>;
    }
  };

  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case "LEAVE": return "Nghỉ phép";
      case "ABSENCE": return "Vắng mặt";
      case "ATTENDANCE_ADJUSTMENT": return "Điều chỉnh chấm công";
      case "BUSINESS_TRIP": return "Công tác";
      case "WFH": return "Làm việc tại nhà";
      case "RESIGNATION": return "Nghỉ việc";
      default: return type;
    }
  };

  const formatRequestApplyDate = (req: RequestFormResponse) => {
    try {
      if (req.type === "ATTENDANCE_ADJUSTMENT") {
        const tType = req.timeType === "CHECK_IN" ? "check-in" : "check-out";
        return `Điều chỉnh ${tType} ngày ${format(new Date(req.attendanceDate), "dd/MM/yyyy")} thành ${req.requestedTime?.substring(0, 5)}`;
      } else if (req.type === "ABSENCE") {
        return `Vắng mặt ngày ${format(new Date(req.absenceDate), "dd/MM/yyyy")}, từ ${req.fromTime?.substring(0, 5)} đến ${req.toTime?.substring(0, 5)}`;
      } else if (req.type === "LEAVE") {
        const s1 = req.startSession === "FULL_DAY" ? "Cả ngày" : req.startSession === "MORNING" ? "Sáng" : "Chiều";
        const s2 = req.endSession === "FULL_DAY" ? "Cả ngày" : req.endSession === "MORNING" ? "Sáng" : "Chiều";
        const d1 = format(new Date(req.startDate), "dd/MM/yyyy");
        const d2 = format(new Date(req.endDate), "dd/MM/yyyy");
        if (d1 === d2) {
          return `Nghỉ phép ngày ${d1} ${s1 === s2 ? `(${s1})` : `(${s1} - ${s2})`}`;
        }
        return `Nghỉ phép từ ${d1} (${s1}) đến ${d2} (${s2})`;
      } else if (req.type === "WFH") {
        const d1 = format(new Date(req.startDate), "dd/MM/yyyy");
        const d2 = format(new Date(req.endDate), "dd/MM/yyyy");
        return d1 === d2 ? `WFH ngày ${d1}` : `WFH từ ${d1} đến ${d2}`;
      } else if (req.type === "BUSINESS_TRIP") {
        const d1 = format(new Date(req.startDate), "dd/MM/yyyy");
        const d2 = format(new Date(req.endDate), "dd/MM/yyyy");
        return d1 === d2 ? `Công tác ngày ${d1}` : `Công tác từ ${d1} đến ${d2}`;
      }
    } catch {
      return "Không xác định";
    }
    return "Không xác định";
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
          <div className="flex flex-col gap-4">
            {/* TOP HIGHLIGHTS */}
            <m.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* WORK UNITS */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Target size={18} strokeWidth={2} />
                    <span className="text-[11px] font-semibold uppercase tracking-wider">{t("myAttendance.summary.workUnits")}</span>
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-800">{data.summary?.workUnits ?? 0}</div>
                </div>
              </div>

              {/* DISCIPLINE SCORE */}
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
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Medal size={18} strokeWidth={2} />
                        <span className="text-[11px] font-semibold uppercase tracking-wider">{t("myAttendance.summary.disciplineScore", { defaultValue: "Điểm kỷ luật" })}</span>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <div className={`text-3xl font-bold ${textColor}`}>{score}</div>
                      <div className="text-sm font-semibold text-slate-400">/5</div>
                    </div>
                  </div>
                );
              })()}

              {/* ALLOWANCE */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-slate-500">
                    <TrendingDown size={18} strokeWidth={2} className="rotate-180" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider">{t("myAttendance.summary.allowance", { defaultValue: "Phụ cấp" })}</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  {(data.summary?.punctualityDisciplineAllowance ?? 0) > 0 && <span className="text-xl font-medium text-emerald-600">+</span>}
                  <div className="text-3xl font-bold text-slate-800 shrink-0">{(data.summary?.punctualityDisciplineAllowance ?? 0).toLocaleString('en-US')}</div>
                  <div className="text-xs font-semibold text-slate-400 ml-1">VNĐ</div>
                </div>
              </div>
            </m.div>

            {/* LOWER GRIDS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* NORMAL ATTENDANCE */}
              <m.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col"
              >
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                  <CalendarCheck size={16} className="text-slate-400" />
                  <h3 className="font-semibold text-slate-700 text-sm">{t("myAttendance.section.attendance", { defaultValue: "Chi tiết đi làm" })}</h3>
                </div>
                <div className="p-5 grid grid-cols-2 gap-y-5 gap-x-6 flex-1">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-500">{t("myAttendance.summary.workingDays")}</span>
                    <span className="text-xl font-bold text-slate-800">{data.summary?.workingDays ?? 0}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-500">{t("myAttendance.summary.approvedWfh", { defaultValue: "WFH đã duyệt" })}</span>
                    <span className="text-xl font-bold text-slate-700">{data.summary?.approvedWfhDays ?? 0}</span>
                  </div>
                  <div className="flex flex-col gap-1 border-t border-slate-100 pt-3">
                    <span className="text-[11px] font-medium text-slate-500">{t("myAttendance.summary.lateDays")}</span>
                    <span className="text-xl font-bold text-slate-700">{data.summary?.lateDays ?? 0}</span>
                  </div>
                  <div className="flex flex-col gap-1 border-t border-slate-100 pt-3">
                    <span className="text-[11px] font-medium text-slate-500">{t("myAttendance.summary.absentDays")}</span>
                    <span className="text-xl font-bold text-slate-700">{data.summary?.absentDays ?? 0}</span>
                  </div>
                </div>
              </m.div>

              {/* VIOLATIONS AND DEDUCTIONS */}
              <m.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col"
              >
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                  <AlertOctagon size={16} className="text-slate-400" />
                  <h3 className="font-semibold text-slate-700 text-sm">{t("myAttendance.section.violations", { defaultValue: "Vi phạm & Phạt" })}</h3>
                </div>
                <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-4 flex-1">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-500" title={t("myAttendance.summary.majorViolations", { defaultValue: "Số lần vi phạm lớn" })}>{t("myAttendance.summary.majorViolations", { defaultValue: "Số lần vi phạm lớn" })}</span>
                    <span className="text-xl font-bold text-slate-800">{data.summary?.majorLateEarlyViolationTimes ?? 0}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-500">{t("myAttendance.summary.wfhOverLimit", { defaultValue: "WFH vượt quota" })}</span>
                    <span className="text-xl font-bold text-slate-800">{data.summary?.wfhOverLimitDays ?? 0}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-500">{t("myAttendance.summary.deductedViolations", { defaultValue: "Số lần bị trừ" })}</span>
                    <span className="text-xl font-bold text-slate-800">{data.summary?.leaveDeductionViolationTimes ?? 0}</span>
                  </div>
                  
                  <div className="flex flex-col gap-1 border-t border-slate-100 pt-3">
                    <span className="text-[11px] font-medium text-slate-500">{t("myAttendance.summary.deductedDays", { defaultValue: "Số ngày bị trừ" })}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xl font-bold text-rose-500">-{data.summary?.leaveDeductionDays ?? 0}</span>
                      {(data.summary?.leaveDeductionDays ?? 0) > 0 && <span className="text-[10px] text-slate-400 uppercase">Ngày</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 border-t border-slate-100 pt-3 md:col-span-2">
                    <span className="text-[11px] font-medium text-slate-500">{t("myAttendance.summary.wfhLeaveDeduction", { defaultValue: "Bị trừ do WFH vượt" })}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xl font-bold text-rose-500">-{data.summary?.wfhLeaveDeductionDays ?? 0}</span>
                      {(data.summary?.wfhLeaveDeductionDays ?? 0) > 0 && <span className="text-[10px] text-slate-400 uppercase">Ngày</span>}
                    </div>
                  </div>
                </div>
              </m.div>

            </div>
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
              <div className="grid grid-cols-7 gap-px border-b border-slate-200">
                {[
                  t("myAttendance.days.mon"), 
                  t("myAttendance.days.tue"), 
                  t("myAttendance.days.wed"), 
                  t("myAttendance.days.thu"), 
                  t("myAttendance.days.fri"), 
                  t("myAttendance.days.sat"), 
                  t("myAttendance.days.sun")
                ].map(d => (
                  <div key={d} className="bg-slate-50/80 py-3 text-center text-[13px] font-semibold text-slate-600 uppercase tracking-widest">
                    {d}
                  </div>
                ))}
              </div>
              
              {/* Grid content */}
              <div className="grid grid-cols-7 gap-px">
                {(() => {
                  const startInterval = new Date(year, month - 2, 25);
                  const endInterval = new Date(year, month - 1, 24);
                  const days = eachDayOfInterval({ start: startInterval, end: endInterval });
                  // Calculate padding for Monday-first calendar (Mon = 0, Sun = 6)
                  let startDayOfWeek = getDay(startInterval) - 1;
                  if (startDayOfWeek === -1) startDayOfWeek = 6; 

                  return (
                    <>
                      {/* Padding cells */}
                      {Array.from({ length: startDayOfWeek }).map((_, i) => (
                        <div key={`empty-${i}`} className="bg-slate-50/30 min-h-[130px] p-2" />
                      ))}

                      {/* Day cells */}
                      {days.map((dateObj, index) => {
                        const dateStr = format(dateObj, "yyyy-MM-dd");
                        const record = data?.records?.find(r => r.attendanceDate === dateStr);
                        const hasData = record?.actualCheckIn || record?.actualCheckOut;
                        const isSunday = getDay(dateObj) === 0;
                        const isSaturday = getDay(dateObj) === 6;

                        return (
                          <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2, delay: index * 0.015 }}
                            key={dateStr}
                            onClick={() => {
                              if (hasData) setSelectedRecord({ ...record, dateObj });
                            }}
                            className={`min-h-[130px] p-2 md:p-3 flex flex-col gap-1.5 transition-colors group relative ${
                              isSunday ? 'bg-rose-50/40' : isSaturday ? 'bg-slate-100/60' : 'bg-white'
                            } ${hasData ? 'cursor-pointer hover:shadow-inner hover:bg-slate-50/80 hover:z-10 ring-1 ring-transparent hover:ring-indigo-100' : ''}`}
                          >
                            <div className="flex justify-between items-start w-full">
                              {hasData && record?.workUnit !== undefined && record.workUnit > 0 ? (
                                <span className="bg-amber-100/80 text-amber-700 font-bold text-[11px] px-1.5 py-0.5 rounded border border-amber-200">
                                  {Number(record.workUnit.toFixed(2))} {t("myAttendance.workUnitSign")}
                                </span>
                              ) : <span />}
                              <span className={`text-[13px] font-bold w-auto min-w-[28px] h-7 px-2 flex items-center justify-center rounded-md transition-colors ${
                                isSunday ? 'text-rose-500' : isSaturday ? 'text-slate-500 hover:bg-slate-200/50' : 'text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                              }`}>
                                {format(dateObj, "d/M")}
                              </span>
                            </div>
                            
                            <div className="flex flex-col gap-1.5 mt-1 grow">
                              {hasData ? (
                                <>
                                  {record?.actualCheckIn && (
                                    <div className={`flex items-center justify-between rounded px-2 py-1 border ${
                                      record.checkInValid === false ? 'bg-rose-50/80 border-rose-200' : 'bg-emerald-50/80 border-emerald-100'
                                    }`}>
                                      <span className={`text-[11px] font-medium ${record.checkInValid === false ? 'text-rose-500' : 'text-slate-500'}`}>{t("myAttendance.checkIn")}</span>
                                      <span className={`text-[12px] font-bold ${record.checkInValid === false ? 'text-rose-600' : 'text-emerald-700'}`}>
                                        {record.actualCheckIn.substring(0, 5)}
                                      </span>
                                    </div>
                                  )}
                                  {record?.actualCheckOut && (
                                    <div className={`flex items-center justify-between rounded px-2 py-1 border ${
                                      record.checkOutValid === false ? 'bg-rose-50/80 border-rose-200' : 'bg-emerald-50/80 border-emerald-100'
                                    }`}>
                                      <span className={`text-[11px] font-medium ${record.checkOutValid === false ? 'text-rose-500' : 'text-slate-500'}`}>{t("myAttendance.checkOut")}</span>
                                      <span className={`text-[12px] font-bold ${record.checkOutValid === false ? 'text-rose-600' : 'text-emerald-700'}`}>
                                        {record.actualCheckOut.substring(0, 5)}
                                      </span>
                                    </div>
                                  )}
                                </>
                              ) : record?.absent ? (
                                <div className="flex items-center justify-center grow pb-4">
                                  <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-100">{t("myAttendance.absent")}</span>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center grow pb-4">
                                  <span className="text-[11px] font-medium text-slate-300 italic">--</span>
                                </div>
                              )}
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

      <Sheet open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <SheetContent side="left" showCloseButton={false} className="border-0 shadow-2xl p-0 overflow-hidden bg-transparent flex flex-col h-full !max-w-[75vw] w-[75vw]">
          {selectedRecord && (
            <div className="bg-white flex flex-col relative w-full h-full">
              {/* Header section with gradient */}
              <div className="bg-linear-to-b from-indigo-500 to-indigo-600 p-6 pb-20 text-white relative shrink-0">
                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="absolute top-4 right-4 p-1.5 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white"
                >
                  <X size={20} />
                </button>
                <SheetHeader className="space-y-1">
                  <SheetTitle className="text-xl font-bold flex flex-col text-white">
                    {t("myAttendance.modalTitle")}
                  </SheetTitle>
                  <SheetDescription className="text-indigo-100 font-medium opacity-90">
                    {format(selectedRecord.dateObj, "EEEE, dd/MM/yyyy", { locale: vi })}
                  </SheetDescription>
                </SheetHeader>
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
                      {selectedRecord.requestForms.map((req, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-800 text-sm flex items-center gap-1.5"><FileText className="w-4 h-4 text-slate-400"/> {getRequestTypeLabel(req.type)}</span>
                              {getRequestStatusBadge(req.status)}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-1.5 text-[13px]">
                            <div className="flex items-start gap-2">
                              <span className="text-slate-500 shrink-0 w-20">Áp dụng:</span>
                              <span className="text-slate-700 font-medium">{formatRequestApplyDate(req)}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-slate-500 shrink-0 w-20">Người tạo:</span>
                              <span className="text-slate-700 font-medium">{req.requesterName}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-slate-500 shrink-0 w-20">Thời điểm gửi:</span>
                              <span className="text-slate-700">{req.submittedAt ? format(new Date(req.submittedAt), "dd/MM/yyyy HH:mm") : "--"}</span>
                            </div>
                            {(req.approvedAt || req.rejectedAt || req.canceledAt) && (
                              <div className="flex items-start gap-2">
                                <span className="text-slate-500 shrink-0 w-20">Xử lý lúc:</span>
                                <span className="text-slate-700">
                                  {(req.approvedAt || req.rejectedAt || req.canceledAt) ? format(new Date((req.approvedAt || req.rejectedAt || req.canceledAt)!), "dd/MM/yyyy HH:mm") : "--"}
                                </span>
                              </div>
                            )}
                            
                            <div className="flex flex-col gap-1 mt-1">
                              <span className="text-slate-500 shrink-0">Lý do/Mô tả:</span>
                              <div className="bg-white p-2 border border-slate-100 rounded text-slate-600">
                                {req.description ? (
                                  <RichTextViewer htmlContent={req.description} />
                                ) : (
                                  <span className="italic">Không có mô tả</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
