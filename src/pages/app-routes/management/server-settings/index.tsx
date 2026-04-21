import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Clock, ShieldAlert, Settings, Code, FileJson, Loader2, CalendarClock, UserPlus, Medal, AlertTriangle, Globe, SlidersHorizontal } from "lucide-react";
import DOMPurify from "dompurify";
import { m  } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { settingsService } from "@/services/settings";
import { useTranslation } from "react-i18next";

export default function ServerSettingsPage() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<string>("flex");

  const sections = [
    { id: "flex", label: "Cấu hình Linh động đi làm", icon: <SlidersHorizontal className="w-4 h-4" /> },
    { id: "timezone", label: "Cấu hình Thời gian & Múi giờ", icon: <Globe className="w-4 h-4" /> },
    { id: "violation", label: "Cấu hình Trừ phép do Vi phạm", icon: <ShieldAlert className="w-4 h-4" /> },
    { id: "discipline", label: "Cấu hình Chấm điểm kỷ luật", icon: <Medal className="w-4 h-4" /> },
    { id: "summary", label: "Cấu hình Tổng hợp Điểm danh", icon: <CalendarClock className="w-4 h-4" /> },
    { id: "defaults", label: "Cấu hình Hồ sơ Mặc định", icon: <UserPlus className="w-4 h-4" /> },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const parseCronToText = (cron: string) => {
    try {
      const parts = cron.trim().split(/\s+/);
      if (parts.length === 6 && parts[3] === "*" && parts[4] === "*" && parts[5] === "*") {
        const sec = parts[0];
        const min = parts[1].padStart(2, "0");
        const hr = parts[2].padStart(2, "0");
        return `Hàng ngày lúc ${hr}:${min}${sec !== "0" ? `:${sec.padStart(2, "0")}` : ''}`;
      }
      return "Lịch tự động theo cấu hình hệ thống";
    } catch {
      return "Lịch tự động theo cấu hình hệ thống";
    }
  };
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["server-settings"],
    queryFn: () => settingsService.getServerSettings()
  });

  const getGraceTimeRange = () => {
    if (!settings?.attendanceMorningStart) return "08:00 - 08:15";
    try {
      const [h, m] = settings.attendanceMorningStart.split(':').map(Number);
      const date = new Date();
      date.setHours(h, m + (settings.attendanceLateGraceMinutes ?? 15), 0);
      return `${settings.attendanceMorningStart.slice(0, 5)} - ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } catch {
      return "08:15";
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4 text-indigo-600">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="font-medium text-slate-600 animate-pulse">{t("serverSettings.loading")}</p>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="w-full p-8 text-center text-rose-500 font-medium bg-rose-50 rounded-lg m-8">
        {t("serverSettings.fetchError")}
      </div>
    );
  }

  const settings = data.data;

  return (
    <div className="w-full p-4 md:p-8 flex flex-col gap-6 md:gap-8">
      <div className="w-full space-y-6">
        <m.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-[#1E2062] flex items-center gap-3">
                <span className="p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl flex items-center justify-center">
                  <Settings size={26} strokeWidth={2.5} />
                </span>
                {t("serverSettings.title")}
              </h1>
              <p className="text-muted-foreground text-sm md:text-base ml-1">
                {t("serverSettings.subtitle")}
              </p>
            </div>

            <div className="flex items-start gap-4 bg-amber-50 p-4 md:p-5 rounded-2xl border border-amber-200/60 shadow-sm">
               <div className="bg-amber-100 p-2 rounded-full shrink-0">
                 <ShieldAlert className="w-6 h-6 text-amber-600" />
               </div>
               <div className="flex flex-col gap-1">
                 <span className="text-[15px] font-bold text-amber-900">{t("serverSettings.restrictionTitle")}</span>
                 <span className="text-[13.5px] text-amber-700/90 leading-relaxed">
                   <strong>{t("serverSettings.restrictionNotice")}</strong> {t("serverSettings.restrictionDesc")}
                 </span>
               </div>
            </div>
          </m.div>

        <Tabs defaultValue="visual" className="w-full">
           <TabsList className="mb-6 bg-slate-100/50 p-1 border border-slate-200">
             <TabsTrigger value="visual" className="flex items-center gap-2 px-6 h-9 transition-all">
               <Settings className="w-4 h-4" />
               {t("serverSettings.tabVisual")}
             </TabsTrigger>
             <TabsTrigger value="json" className="flex items-center gap-2 px-6 h-9 transition-all">
               <FileJson className="w-4 h-4" />
               {t("serverSettings.tabJson")}
             </TabsTrigger>
           </TabsList>
  
           <TabsContent value="visual" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                 {/* Sidebar Navigation */}
                 <div className="w-full md:w-64 flex flex-col gap-1.5 shrink-0 box-border border border-slate-200 bg-white p-2 text-slate-700 shadow-sm rounded-xl sticky top-4">
                   {sections.map(s => (
                     <button
                       key={s.id}
                       onClick={() => scrollToSection(s.id)}
                       className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-semibold transition-all duration-200 text-left ${activeSection === s.id ? "bg-indigo-50/80 text-indigo-700 shadow-xs ring-1 ring-indigo-100" : "hover:bg-slate-50 text-slate-600 border border-transparent"}`}
                     >
                       {s.icon}
                       {s.label}
                     </button>
                   ))}
                 </div>
                 <div className="flex-1 w-full flex flex-col gap-8 pb-32">
                    <Card id="flex" className="shadow-sm border-slate-200/80 overflow-hidden scroll-mt-24">
                  <CardHeader className="pb-4 bg-white border-b border-slate-100">
                    <CardTitle className="text-[17px] flex items-center gap-2 text-slate-800">
                      <div className="p-1.5 bg-indigo-50 rounded-md">
                        <Clock className="w-4 h-4 text-indigo-600" />
                      </div>
                      {t("serverSettings.timeErrorTitle")}
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                      {t("serverSettings.timeErrorDesc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-5 bg-slate-50/50">
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <div className="flex flex-col gap-1 max-w-[70%]">
                        <div className="text-[14px] font-semibold text-slate-700">{t("serverSettings.lateGrace")}</div>
                        <span className="text-[12px] text-slate-500 leading-snug">{t("serverSettings.lateGraceNote")}</span>
                      </div>
                      <span className="font-bold text-[#2E3192] bg-[#2E3192]/10 border border-[#2E3192]/20 px-3.5 py-1.5 rounded-lg text-sm shrink-0">
                        {settings.attendanceLateGraceMinutes} {t("serverSettings.unitMinutes")}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <div className="flex flex-col gap-1 max-w-[70%]">
                        <div className="text-[14px] font-semibold text-slate-700">{t("serverSettings.earlyLeave")}</div>
                        <span className="text-[12px] text-slate-500 leading-snug">{t("serverSettings.earlyLeaveNote")}</span>
                      </div>
                      <span className="font-bold text-[#2E3192] bg-[#2E3192]/10 border border-[#2E3192]/20 px-3.5 py-1.5 rounded-lg text-sm shrink-0">
                        {settings.attendanceEarlyLeaveGraceMinutes} {t("serverSettings.unitMinutes")}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                       <div className="flex flex-col gap-1 max-w-[70%]">
                         <div className="text-[14px] font-semibold text-slate-700">{t("serverSettings.halfWorkThreshold")}</div>
                         <span className="text-[12px] text-slate-500 leading-snug">{t("serverSettings.halfWorkNote", { hours: settings.attendanceHalfWorkUnitHours })}</span>
                       </div>
                       <span className="font-bold text-[#2E3192] bg-[#2E3192]/10 border border-[#2E3192]/20 px-3.5 py-1.5 rounded-lg text-sm shrink-0">
                         {settings.attendanceHalfWorkUnitHours} {t("serverSettings.unitHours")}
                       </span>
                    </div>

                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                       <div className="flex flex-col gap-1 max-w-[70%]">
                         <div className="text-[14px] font-semibold text-slate-700">{t("serverSettings.fullWorkThreshold")}</div>
                         <span className="text-[12px] text-slate-500 leading-snug">{t("serverSettings.fullWorkNote", { hours: settings.attendanceFullWorkUnitHours })}</span>
                       </div>
                       <span className="font-bold text-[#2E3192] bg-[#2E3192]/10 border border-[#2E3192]/20 px-3.5 py-1.5 rounded-lg text-sm shrink-0">
                         {settings.attendanceFullWorkUnitHours} {t("serverSettings.unitHours")}
                       </span>
                    </div>
                  </CardContent>
                </Card>

                <Card id="timezone" className="shadow-sm border-slate-200/80 overflow-hidden h-fit scroll-mt-24">
                  <CardHeader className="pb-4 bg-white border-b border-slate-100">
                    <CardTitle className="text-[17px] flex items-center gap-2 text-slate-800">
                      <div className="p-1.5 bg-[#2E3192]/10 rounded-md">
                        <Clock className="w-4 h-4 text-[#2E3192]" />
                      </div>
                      {t("serverSettings.timezoneTitle")}
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                      {t("serverSettings.timezoneDesc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-5 bg-slate-50/50">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
                        <div className="text-[14px] font-semibold text-slate-700">{t("serverSettings.serverTimezone")}</div>
                        <p className="font-bold text-slate-800 font-mono bg-slate-100 px-3.5 py-1.5 rounded-lg text-sm tracking-tight">{settings.timeZone}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Morning Shift */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-1.5">
                        <div className="text-[12px] font-semibold text-slate-500 uppercase tracking-widest">{t("serverSettings.morningStart")}</div>
                        <p className="font-extrabold text-[15px] text-slate-800">{settings.attendanceMorningStart}</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-1.5">
                        <div className="text-[12px] font-semibold text-slate-500 uppercase tracking-widest">{t("serverSettings.morningEnd")}</div>
                        <p className="font-extrabold text-[15px] text-slate-800">{settings.attendanceMorningEnd}</p>
                      </div>

                      {/* Lunch Break */}
                      <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-200/60 shadow-xs flex flex-col gap-1.5">
                        <div className="text-[12px] font-semibold text-orange-600/80 uppercase tracking-widest">{t("serverSettings.lunchStart")}</div>
                        <p className="font-extrabold text-[15px] text-orange-900">{settings.attendanceLunchBreakStart}</p>
                      </div>
                      <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-200/60 shadow-xs flex flex-col gap-1.5">
                        <div className="text-[12px] font-semibold text-orange-600/80 uppercase tracking-widest">{t("serverSettings.lunchEnd")}</div>
                        <p className="font-extrabold text-[15px] text-orange-900">{settings.attendanceLunchBreakEnd}</p>
                      </div>

                      {/* Afternoon Shift */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-1.5">
                        <div className="text-[12px] font-semibold text-slate-500 uppercase tracking-widest">{t("serverSettings.afternoonStart")}</div>
                        <p className="font-extrabold text-[15px] text-slate-800">{settings.attendanceAfternoonStart}</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-1.5">
                        <div className="text-[12px] font-semibold text-slate-500 uppercase tracking-widest">{t("serverSettings.afternoonEnd")}</div>
                        <p className="font-extrabold text-[15px] text-slate-800">{settings.attendanceAfternoonEnd}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card id="violation" className="shadow-sm border-slate-200/80 overflow-hidden h-fit scroll-mt-24">
                  <CardHeader className="pb-4 bg-white border-b border-slate-100">
                    <CardTitle className="text-[17px] flex items-center gap-2 text-rose-800">
                      <div className="p-1.5 bg-rose-50 rounded-md">
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                      </div>
                      {t("serverSettings.violationTitle", { defaultValue: "Cấu hình Trừ phép do Vi phạm Đi trễ/Về sớm" })}
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                      {t("serverSettings.violationDesc", { defaultValue: "Quy định liên quan đến việc phạt trừ phép nếu vi phạm quá mức thời lượng và số lần cho phép trong kỳ." })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 md:p-5 bg-slate-50/50">
                    <div className="flex flex-col gap-4">
                      {/* Detailed Text Block */}
                      <div className="bg-rose-50/50 border border-rose-100/60 rounded-xl p-4 flex flex-col gap-3">
                        <p className="text-[14px] text-slate-700 leading-relaxed">
                          <strong className="text-rose-700 font-semibold">Trễ hoặc về sớm từ {settings.attendanceMajorLateEarlyViolationMinutes} phút trở lên</strong> được tính là 1 lần vi phạm lớn. 
                          <strong className="font-semibold"> Cứ mỗi {settings.attendanceMajorLateEarlyViolationFreeTimes + 1} lần vi phạm lớn</strong> sẽ bị <strong className="text-rose-600 font-semibold">trừ {settings.attendanceLeaveDeductionPerMajorLateEarlyViolation} ngày phép/công</strong>. 
                          Sau khi bị trừ, bộ đếm bắt đầu lại từ đầu.
                        </p>
                        <div className="bg-white/80 rounded-lg p-3 text-[13px] text-slate-600 border border-rose-100/50 shadow-sm">
                          <div className="font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                            <ShieldAlert className="w-4 h-4 text-slate-400" /> Ví dụ minh họa:
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {[
                              { majorTimes: settings.attendanceMajorLateEarlyViolationFreeTimes, deductionTimes: 0, deductionDays: 0 },
                              { majorTimes: settings.attendanceMajorLateEarlyViolationFreeTimes + 1, deductionTimes: 1, deductionDays: settings.attendanceLeaveDeductionPerMajorLateEarlyViolation },
                              { majorTimes: settings.attendanceMajorLateEarlyViolationFreeTimes + 2, deductionTimes: 1, deductionDays: settings.attendanceLeaveDeductionPerMajorLateEarlyViolation },
                              { majorTimes: (settings.attendanceMajorLateEarlyViolationFreeTimes + 1) * 2, deductionTimes: 2, deductionDays: settings.attendanceLeaveDeductionPerMajorLateEarlyViolation * 2 }
                            ].map((ex, idx) => (
                              <div key={idx} className="bg-slate-50 border border-slate-100/80 rounded-lg p-3 flex flex-col text-[13px] text-slate-600 gap-1.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                                <div className="flex justify-between items-center px-1"><span>Số lần VP lớn:</span><strong className="text-slate-800">{ex.majorTimes}</strong></div>
                                <div className="flex justify-between items-center px-1"><span>Số lần bị trừ:</span><strong className={ex.deductionTimes > 0 ? "text-rose-600" : "text-emerald-600"}>{ex.deductionTimes}</strong></div>
                                <div className="flex justify-between items-center px-1 border-t border-slate-200/60 pt-1 mt-0.5"><span>Số ngày trừ:</span><strong className={ex.deductionDays > 0 ? "text-rose-600 font-bold" : "text-emerald-600"}>{ex.deductionDays.toFixed(1)}</strong></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-2 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                          <span className="text-[13px] font-semibold text-slate-700">{t("serverSettings.majorViolationMinutes", { defaultValue: "Ngưỡng vi phạm lớn" })}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-lg text-lg tracking-tight">
                              &ge; {settings.attendanceMajorLateEarlyViolationMinutes}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">{t("serverSettings.unitMinutes", { defaultValue: "phút" })}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                          <span className="text-[13px] font-semibold text-slate-700">{t("serverSettings.violationCycle", { defaultValue: "Quy tắc trừ phép" })}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#2E3192] bg-[#2E3192]/10 border border-[#2E3192]/20 px-3 py-1.5 rounded-lg text-lg tracking-tight">
                              - {settings.attendanceLeaveDeductionPerMajorLateEarlyViolation}
                            </span>
                            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">ngày / mỗi {settings.attendanceMajorLateEarlyViolationFreeTimes + 1} lần</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                          <span className="text-[13px] font-semibold text-slate-700">{t("serverSettings.wfhLeaveDeduction", { defaultValue: "Trừ phép khi WFH vượt mức" })}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-amber-600 bg-amber-50 border border-amber-200/60 px-3 py-1.5 rounded-lg text-lg tracking-tight">
                              - {settings.attendanceLeaveDeductionPerExcessWfhDay ?? 0}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">{t("serverSettings.unitDaysPerDay", { defaultValue: "ngày / ngày WFH" })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card id="discipline" className="shadow-sm border-slate-200/80 overflow-hidden h-fit scroll-mt-24">
                  <CardHeader className="pb-4 bg-white border-b border-slate-100">
                    <CardTitle className="text-[17px] flex items-center gap-2 text-emerald-800">
                      <div className="p-1.5 bg-emerald-50 rounded-md">
                        <Medal className="w-4 h-4 text-emerald-600" />
                      </div>
                      Cấu hình Chấm điểm kỷ luật giờ giấc
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                      Tiêu chí đánh giá xếp loại chuyên cần và hạn mức phụ cấp tương ứng được áp dụng hàng tháng.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 md:p-5 bg-slate-50/50">
                    <div className="flex flex-col gap-4">
                      {/* 5 Points */}
                      <div className="flex items-start gap-4 bg-white p-4 rounded-xl border border-emerald-200 shadow-xs relative overflow-hidden">
                        <div className="absolute -top-4 -right-4 p-3 opacity-[0.03]">
                          <Medal className="w-24 h-24 text-emerald-600" />
                        </div>
                        <div className="bg-emerald-50 p-2 rounded-xl shrink-0 border border-emerald-100/50">
                          <div className="font-black text-emerald-600 text-xl w-8 text-center">5đ</div>
                        </div>
                        <div className="flex flex-col gap-2.5 w-full z-10">
                          <div className="flex flex-wrap md:flex-nowrap justify-between items-start md:items-center gap-2 border-b border-slate-50 pb-2">
                             <span className="font-bold text-emerald-800 text-[15px]">Xuất sắc</span>
                             <span className="font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg text-sm shrink-0 shadow-sm">
                               + {(settings.attendanceExcellentDisciplineAllowance ?? 0).toLocaleString('en-US')} VNĐ
                             </span>
                          </div>
                          <ul className="list-none text-[13px] text-slate-600 space-y-1.5">
                             <li className="flex gap-2 items-start"><span className="text-emerald-400 mt-0.5">•</span> <span>Check-in trước hoặc <strong className="font-semibold">đúng giờ</strong> bắt đầu làm việc ({settings.attendanceMorningStart?.slice(0, 5) ?? '08:00'}).</span></li>
                             <li className="flex gap-2 items-start"><span className="text-emerald-400 mt-0.5">•</span> <span>Đảm bảo <strong className="font-semibold">đủ công</strong> mỗi ngày.</span></li>
                          </ul>
                        </div>
                      </div>

                      {/* 4 Points */}
                      <div className="flex items-start gap-4 bg-white p-4 rounded-xl border border-blue-200 shadow-xs relative overflow-hidden">
                        <div className="absolute -top-4 -right-4 p-3 opacity-[0.03]">
                          <Medal className="w-24 h-24 text-blue-600" />
                        </div>
                        <div className="bg-blue-50 p-2 rounded-xl shrink-0 border border-blue-100/50">
                          <div className="font-black text-blue-600 text-xl w-8 text-center">4đ</div>
                        </div>
                        <div className="flex flex-col gap-2.5 w-full z-10">
                          <div className="flex flex-wrap md:flex-nowrap justify-between items-start md:items-center gap-2 border-b border-slate-50 pb-2">
                             <span className="font-bold text-blue-800 text-[15px]">Tốt</span>
                             <span className="font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-lg text-sm shrink-0 shadow-sm">
                               + {(settings.attendanceGoodDisciplineAllowance ?? 0).toLocaleString('en-US')} VNĐ
                             </span>
                          </div>
                          <ul className="list-none text-[13px] text-slate-600 space-y-1.5">
                             <li className="flex gap-2 items-start"><span className="text-blue-400 mt-0.5">•</span> <span><strong className="font-semibold">Không có ngày trễ</strong> quá thời gian cho phép.</span></li>
                             <li className="flex gap-2 items-start"><span className="text-blue-400 mt-0.5">•</span> <span>Có check-in trong khoảng thời gian cho phép (<strong className="font-semibold">{getGraceTimeRange()}</strong>).</span></li>
                             <li className="flex gap-2 items-start"><span className="text-blue-400 mt-0.5">•</span> <span>Đảm bảo <strong className="font-semibold">đủ công</strong> mỗi ngày.</span></li>
                          </ul>
                        </div>
                      </div>

                      {/* 3 Points */}
                      <div className="flex items-start gap-4 bg-white p-4 rounded-xl border border-indigo-200 shadow-xs relative overflow-hidden">
                        <div className="absolute -top-4 -right-4 p-3 opacity-[0.03]">
                          <Medal className="w-24 h-24 text-indigo-600" />
                        </div>
                        <div className="bg-indigo-50 p-2 rounded-xl shrink-0 border border-indigo-100/50">
                          <div className="font-black text-indigo-600 text-xl w-8 text-center">3đ</div>
                        </div>
                        <div className="flex flex-col gap-2.5 w-full z-10">
                          <div className="flex flex-wrap md:flex-nowrap justify-between items-start md:items-center gap-2 border-b border-slate-50 pb-2">
                             <span className="font-bold text-indigo-800 text-[15px]">Đạt yêu cầu</span>
                             <span className="font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-lg text-sm shrink-0 shadow-sm">
                               + {(settings.attendanceAcceptableDisciplineAllowance ?? 0).toLocaleString('en-US')} VNĐ
                             </span>
                          </div>
                          <ul className="list-none text-[13px] text-slate-600 space-y-1.5">
                             <li className="flex gap-2 items-start"><span className="text-indigo-400 mt-0.5">•</span> <span>Số lần trễ quá thời gian cho phép <strong className="font-semibold text-rose-500">tối đa {settings.attendanceAcceptableDisciplineLateTimes ?? 3} lần</strong>.</span></li>
                             <li className="flex gap-2 items-start"><span className="text-indigo-400 mt-0.5">•</span> <span>Không có lần trễ nào <strong className="font-semibold">quá {settings.attendanceDisciplineLightLateLimitMinutes ?? 60} phút</strong>.</span></li>
                             <li className="flex gap-2 items-start"><span className="text-indigo-400 mt-0.5">•</span> <span>Đảm bảo <strong className="font-semibold">đủ công</strong> mỗi ngày.</span></li>
                          </ul>
                        </div>
                      </div>

                      {/* 2 Points */}
                      <div className="flex items-start gap-4 bg-white p-4 rounded-xl border border-amber-200 shadow-xs relative overflow-hidden">
                        <div className="absolute -top-4 -right-4 p-3 opacity-[0.03]">
                          <AlertTriangle className="w-24 h-24 text-amber-600" />
                        </div>
                        <div className="bg-amber-50 p-2 rounded-xl shrink-0 border border-amber-100/50">
                          <div className="font-black text-amber-600 text-xl w-8 text-center">2đ</div>
                        </div>
                        <div className="flex flex-col gap-2.5 w-full z-10">
                          <div className="flex flex-wrap md:flex-nowrap justify-between items-start md:items-center gap-2 border-b border-slate-50 pb-2">
                             <span className="font-bold text-amber-800 text-[15px]">Vi phạm nhẹ</span>
                             <span className="font-medium text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg text-sm shrink-0">
                               Không có phụ cấp
                             </span>
                          </div>
                          <ul className="list-none text-[13px] text-slate-600 space-y-1.5">
                             <li className="flex gap-2 items-start"><span className="text-amber-400 mt-0.5">•</span> <span>Số lần trễ quá thời gian cho phép từ <strong className="font-semibold text-rose-500">{(settings.attendanceAcceptableDisciplineLateTimes ?? 3) + 1} đến {settings.attendanceLightViolationDisciplineLateMaxTimes ?? 7} lần</strong>.</span></li>
                             <li className="flex gap-2 items-start"><span className="text-amber-400 mt-0.5">•</span> <span>Không có lần trễ nào <strong className="font-semibold">quá {settings.attendanceDisciplineLightLateLimitMinutes ?? 60} phút</strong>.</span></li>
                          </ul>
                        </div>
                      </div>

                      {/* 1 Point */}
                      <div className="flex items-start gap-4 bg-rose-50/50 p-4 rounded-xl border border-rose-200 shadow-xs relative overflow-hidden">
                        <div className="absolute -top-4 -right-4 p-3 opacity-[0.03]">
                          <AlertTriangle className="w-24 h-24 text-rose-600" />
                        </div>
                        <div className="bg-rose-100/50 p-2 rounded-xl shrink-0 border border-rose-200/50">
                          <div className="font-black text-rose-600 text-xl w-8 text-center">1đ</div>
                        </div>
                        <div className="flex flex-col gap-2.5 w-full z-10">
                          <div className="flex flex-wrap md:flex-nowrap justify-between items-start md:items-center gap-2 border-b border-rose-100/50 pb-2">
                             <span className="font-bold text-rose-800 text-[15px]">Vi phạm nặng</span>
                             <span className="font-medium text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg text-sm shrink-0">
                               Không có phụ cấp
                             </span>
                          </div>
                          <ul className="list-none text-[13px] text-rose-900/80 space-y-1.5">
                             <li className="flex gap-2 items-start"><span className="text-rose-400 mt-0.5">•</span> <span>Số lần trễ quá thời gian cho phép <strong className="font-semibold text-rose-600">trên {settings.attendanceLightViolationDisciplineLateMaxTimes ?? 7} lần</strong>.</span></li>
                             <li className="flex gap-2 items-start"><span className="text-rose-400 mt-0.5">•</span> <span>Hoặc có lần trễ <strong className="font-semibold text-rose-600">quá {settings.attendanceDisciplineLightLateLimitMinutes ?? 60} phút</strong>.</span></li>
                             <li className="flex gap-2 items-start"><span className="text-rose-400 mt-0.5">•</span> <span>Hoặc <strong className="font-semibold text-rose-600">không đủ công</strong>, vắng không phép.</span></li>
                          </ul>
                        </div>
                      </div>

                    </div>
                  </CardContent>
                </Card>

                <Card id="summary" className="shadow-sm border-slate-200/80 overflow-hidden h-fit scroll-mt-24">
                  <CardHeader className="pb-4 bg-white border-b border-slate-100">
                    <CardTitle className="text-[17px] flex items-center gap-2 text-slate-800">
                      <div className="p-1.5 bg-[#2E3192]/10 rounded-md">
                        <CalendarClock className="w-4 h-4 text-[#2E3192]" />
                      </div>
                      {t("serverSettings.summaryTitle")}
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                      {t("serverSettings.summaryDesc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 md:p-5 bg-slate-50/50">
                    <div className="bg-[#2E3192]/5 rounded-xl px-4 py-3 border border-[#2E3192]/10 shadow-sm flex flex-col gap-2">
                      <p className="text-[13.5px] font-semibold text-[#1E2062]">{t("serverSettings.summaryNoteTitle")}</p>
                      <ul className="list-disc list-outside pl-4 space-y-1.5 marker:text-[#2E3192]/60">
                        <li className="text-[13px] text-slate-700 leading-tight">{t("serverSettings.summaryNote1")}</li>
                        <li className="text-[13px] text-slate-700 leading-tight">{t("serverSettings.summaryNote2")}</li>
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
                        <div className="text-[14px] font-semibold text-slate-700">{t("serverSettings.summaryEnabled")}</div>
                        <span className={`font-bold px-3.5 py-1.5 rounded-lg text-sm shrink-0 border ${
                           settings.attendanceDailySummaryEnabled 
                             ? "text-[#2E3192] bg-[#2E3192]/10 border-[#2E3192]/20" 
                             : "text-slate-600 bg-slate-100 border-slate-200"
                        }`}>
                          {settings.attendanceDailySummaryEnabled ? t("serverSettings.summaryEnabledYes") : t("serverSettings.summaryEnabledNo")}
                        </span>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center relative overflow-hidden">
                        <div className="flex flex-col gap-1.5">
                           <div className="text-[14px] font-semibold text-slate-700">{t("serverSettings.summaryCron")}</div>
                           <span className="text-[12.5px] font-medium text-slate-500/90">{parseCronToText(settings.attendanceDailySummaryCron)}</span>
                        </div>
                        <p className="font-bold text-[#2E3192] font-mono bg-[#2E3192]/10 border border-[#2E3192]/20 px-3.5 py-1.5 rounded-lg text-sm tracking-tight">{settings.attendanceDailySummaryCron}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card id="defaults" className="shadow-sm border-slate-200/80 overflow-hidden h-fit scroll-mt-24">
                  <CardHeader className="pb-4 bg-white border-b border-slate-100">
                    <CardTitle className="text-[17px] flex items-center gap-2 text-slate-800">
                      <div className="p-1.5 bg-indigo-50 rounded-md">
                        <UserPlus className="w-4 h-4 text-indigo-600" />
                      </div>
                      {t("serverSettings.userProfileDefaultsTitle")}
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                      {t("serverSettings.userProfileDefaultsDesc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 md:p-5 bg-slate-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                        <div className="text-[14px] font-semibold text-slate-700">{t("serverSettings.defaultCurrentLeave", { defaultValue: "Ngày phép còn lại mặc định" })}</div>
                        <span className="font-bold text-[#2E3192] bg-[#2E3192]/10 border border-[#2E3192]/20 px-3.5 py-1.5 rounded-lg text-sm shrink-0">
                          {settings.userProfileDefaultRemainingLeaveDays}
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                        <div className="text-[14px] font-semibold text-slate-700">{t("serverSettings.defaultMaxLeave", { defaultValue: "Tổng ngày phép chuẩn mặc định" })}</div>
                        <span className="font-bold text-[#2E3192] bg-[#2E3192]/10 border border-[#2E3192]/20 px-3.5 py-1.5 rounded-lg text-sm shrink-0">
                          {settings.userProfileDefaultMaxLeaveDays}
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                         <div className="text-[14px] font-semibold text-slate-700">{t("serverSettings.defaultCurrentWfh", { defaultValue: "Ngày WFH còn lại mặc định" })}</div>
                         <span className="font-bold text-[#2E3192] bg-[#2E3192]/10 border border-[#2E3192]/20 px-3.5 py-1.5 rounded-lg text-sm shrink-0">
                           {settings.userProfileDefaultRemainingWfhDays}
                         </span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                         <div className="text-[14px] font-semibold text-slate-700">{t("serverSettings.defaultMaxWfh")}</div>
                         <span className="font-bold text-[#2E3192] bg-[#2E3192]/10 border border-[#2E3192]/20 px-3.5 py-1.5 rounded-lg text-sm shrink-0">
                           {settings.userProfileDefaultMaxWfhDays}
                         </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                 </div>
              </div>
           </TabsContent>

           <TabsContent value="json" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <Card className="shadow-2xl border-none bg-slate-900 border-slate-800 overflow-hidden">
                <CardHeader className="pb-4 bg-slate-900/50 border-b border-slate-800/80">
                  <CardTitle className="text-[16px] flex items-center gap-2 text-slate-100">
                    <Code className="w-4 h-4 text-indigo-400" />
                    {t("serverSettings.rawPayloadTitle")}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {t("serverSettings.rawPayloadDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="bg-[#0D1117] p-6 overflow-x-auto">
                    <pre className="text-[13.5px] font-mono leading-loose tracking-wide">
                      <code dangerouslySetInnerHTML={{ 
                        __html: DOMPurify.sanitize(
                          JSON.stringify(settings, null, 2)
                            .replace(/"(.*?)":/g, '<span style="color: #82AAFF">"$1"</span>:')
                            .replace(/: "(.*?)"/g, ': <span style="color: #C3E88D">"$1"</span>')
                            .replace(/: (\d+)/g, ': <span style="color: #F78C6C">$1</span>')
                        )
                      }} />
                    </pre>
                  </div>
                </CardContent>
             </Card>
           </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
