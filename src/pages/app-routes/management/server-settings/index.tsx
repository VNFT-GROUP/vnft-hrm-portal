import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Clock, ShieldAlert, Settings, Code, FileJson, Loader2, CalendarClock, UserPlus, Medal } from "lucide-react";
import DOMPurify from "dompurify";
import { m  } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { settingsService } from "@/services/settings";
import { useTranslation } from "react-i18next";

export default function ServerSettingsPage() {
  const { t } = useTranslation();

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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-sm border-slate-200/80 overflow-hidden">
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

                <Card className="shadow-sm border-slate-200/80 overflow-hidden h-fit">
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

                <Card className="shadow-sm border-slate-200/80 overflow-hidden h-fit lg:col-span-2">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex flex-col gap-2 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                        <span className="text-[13px] font-semibold text-slate-700">{t("serverSettings.majorViolationMinutes", { defaultValue: "Ngưỡng tính vi phạm nặng" })}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-lg text-lg tracking-tight">
                            &gt; {settings.attendanceMajorLateEarlyViolationMinutes}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">{t("serverSettings.unitMinutes", { defaultValue: "phút" })}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                        <span className="text-[13px] font-semibold text-slate-700">{t("serverSettings.violationFreeTimes", { defaultValue: "Số lần miễn trừ thứ tự/tháng" })}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#2E3192] bg-[#2E3192]/10 border border-[#2E3192]/20 px-3 py-1.5 rounded-lg text-lg tracking-tight">
                            {settings.attendanceMajorLateEarlyViolationFreeTimes}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">{t("serverSettings.unitTimes", { defaultValue: "lần đầu tiên" })}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                        <span className="text-[13px] font-semibold text-slate-700">{t("serverSettings.leaveDeduction", { defaultValue: "Phạt áp dụng những lần sau đó" })}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-600 bg-amber-50 border border-amber-200/60 px-3 py-1.5 rounded-lg text-lg tracking-tight">
                            - {settings.attendanceLeaveDeductionPerMajorLateEarlyViolation}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">{t("serverSettings.unitDays", { defaultValue: "ngày phép / lần vi phạm" })}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                        <span className="text-[13px] font-semibold text-slate-700">{t("serverSettings.wfhLeaveDeduction", { defaultValue: "Trừ phép khi WFH vượt mức" })}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-600 bg-amber-50 border border-amber-200/60 px-3 py-1.5 rounded-lg text-lg tracking-tight">
                            - {settings.attendanceLeaveDeductionPerExcessWfhDay ?? 0}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">{t("serverSettings.unitDaysPerDay", { defaultValue: "ngày phép / ngày WFH" })}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200/80 overflow-hidden h-fit lg:col-span-2">
                  <CardHeader className="pb-4 bg-white border-b border-slate-100">
                    <CardTitle className="text-[17px] flex items-center gap-2 text-emerald-800">
                      <div className="p-1.5 bg-emerald-50 rounded-md">
                        <Medal className="w-4 h-4 text-emerald-600" />
                      </div>
                      {t("serverSettings.disciplineAllowanceTitle", { defaultValue: "Phụ cấp Kỷ luật Giờ giấc" })}
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                      {t("serverSettings.disciplineAllowanceDesc", { defaultValue: "Hạn mức phụ cấp được cộng vào lương dựa trên điểm kỷ luật chuyên cần." })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 md:p-5 bg-slate-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-2 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                        <span className="text-[13px] font-semibold text-slate-700">{t("serverSettings.excellentAllowance", { defaultValue: "Điểm tuyệt đối (5đ)" })}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg text-lg tracking-tight">
                            + {(settings.attendanceExcellentDisciplineAllowance ?? 0).toLocaleString('en-US')}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">VNĐ</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                        <span className="text-[13px] font-semibold text-slate-700">{t("serverSettings.goodAllowance", { defaultValue: "Điểm tốt (4đ)" })}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg text-lg tracking-tight">
                            + {(settings.attendanceGoodDisciplineAllowance ?? 0).toLocaleString('en-US')}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">VNĐ</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                        <span className="text-[13px] font-semibold text-slate-700">{t("serverSettings.acceptableAllowance", { defaultValue: "Điểm khá (3đ)" })}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg text-lg tracking-tight">
                            + {(settings.attendanceAcceptableDisciplineAllowance ?? 0).toLocaleString('en-US')}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">VNĐ</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200/80 overflow-hidden h-fit lg:col-span-2">
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

                <Card className="shadow-sm border-slate-200/80 overflow-hidden h-fit lg:col-span-2">
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
