import { useState, useEffect } from "react";
import { format, eachDayOfInterval, getDay } from "date-fns";
import { vi } from "date-fns/locale";

import { attendanceService } from "@/services/attendance";
import type { MonthlyAttendanceResponse } from "@/types/attendance/MonthlyAttendanceResponse";
import type { AttendanceDailySummaryResponse } from "@/types/attendance/AttendanceDailySummaryResponse";
import { Loader2, Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, CalendarCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

export default function MyAttendancePage() {
  const { t } = useTranslation();
  const currentDate = new Date();
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [data, setData] = useState<MonthlyAttendanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<(AttendanceDailySummaryResponse & { dateObj: Date }) | null>(null);

  const fetchData = async (y: number, m: number) => {
    setLoading(true);
    try {
      const res = await attendanceService.getCurrentUserMonthlyAttendance(y, m);
      if (res.data) {
        setData(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(year, month);
  }, [year, month]);

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
          <motion.div
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
          </motion.div>

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
                          <motion.div
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
                              {hasData && (
                                <div className="mt-auto pt-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 text-[11px] font-bold py-1.5 rounded-md w-full flex flex-col items-center justify-center border border-indigo-100 shadow-sm cursor-pointer">
                                  {t("myAttendance.viewDetails")}
                                </div>
                              )}
                            </div>
                          </motion.div>
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

      <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent showCloseButton={false} className="sm:max-w-md border-0 shadow-2xl p-0 overflow-hidden bg-transparent">
          {selectedRecord && (
            <div className="bg-white flex flex-col relative w-full">
              {/* Header section with gradient */}
              <div className="bg-linear-to-r from-indigo-500 to-indigo-600 p-6 pb-8 text-white relative">
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
              <div className="px-6 py-8 flex flex-col gap-6 -mt-4 bg-white rounded-t-3xl relative z-10 mx-1 border-t-4 border-indigo-400">
                
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

                <div className="flex flex-col gap-1 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
