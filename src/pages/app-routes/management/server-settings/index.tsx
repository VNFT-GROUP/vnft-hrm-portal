import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Clock, ShieldAlert, Settings, Code, FileJson, Loader2 } from "lucide-react";
import { m  } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { settingsService } from "@/services/settings";
import { useTranslation } from "react-i18next";

export default function ServerSettingsPage() {
  const { t } = useTranslation();
  
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
                        <Label className="text-[14px] font-semibold text-slate-700">{t("serverSettings.lateGrace")}</Label>
                        <span className="text-[12px] text-slate-500 leading-snug">{t("serverSettings.lateGraceNote")}</span>
                      </div>
                      <span className="font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-lg text-sm shrink-0">
                        {settings.attendanceLateGraceMinutes} {t("serverSettings.unitMinutes")}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <div className="flex flex-col gap-1 max-w-[70%]">
                        <Label className="text-[14px] font-semibold text-slate-700">{t("serverSettings.earlyLeave")}</Label>
                        <span className="text-[12px] text-slate-500 leading-snug">{t("serverSettings.earlyLeaveNote")}</span>
                      </div>
                      <span className="font-bold text-rose-700 bg-rose-50 border border-rose-100 px-3.5 py-1.5 rounded-lg text-sm shrink-0">
                        {settings.attendanceEarlyLeaveGraceMinutes} {t("serverSettings.unitMinutes")}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                       <div className="flex flex-col gap-1 max-w-[70%]">
                         <Label className="text-[14px] font-semibold text-slate-700">{t("serverSettings.halfWorkThreshold")}</Label>
                         <span className="text-[12px] text-slate-500 leading-snug">{t("serverSettings.halfWorkNote", { hours: settings.attendanceHalfWorkUnitHours })}</span>
                       </div>
                       <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-lg text-sm shrink-0">
                         {settings.attendanceHalfWorkUnitHours} {t("serverSettings.unitHours")}
                       </span>
                    </div>

                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                       <div className="flex flex-col gap-1 max-w-[70%]">
                         <Label className="text-[14px] font-semibold text-slate-700">{t("serverSettings.fullWorkThreshold")}</Label>
                         <span className="text-[12px] text-slate-500 leading-snug">{t("serverSettings.fullWorkNote", { hours: settings.attendanceFullWorkUnitHours })}</span>
                       </div>
                       <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-lg text-sm shrink-0">
                         {settings.attendanceFullWorkUnitHours} {t("serverSettings.unitHours")}
                       </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200/80 overflow-hidden h-fit">
                  <CardHeader className="pb-4 bg-white border-b border-slate-100">
                    <CardTitle className="text-[17px] flex items-center gap-2 text-slate-800">
                      <div className="p-1.5 bg-sky-50 rounded-md">
                        <Clock className="w-4 h-4 text-sky-600" />
                      </div>
                      {t("serverSettings.timezoneTitle")}
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                      {t("serverSettings.timezoneDesc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-5 bg-slate-50/50">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
                        <Label className="text-[14px] font-semibold text-slate-700">{t("serverSettings.serverTimezone")}</Label>
                        <p className="font-bold text-slate-800 font-mono bg-slate-100 px-3.5 py-1.5 rounded-lg text-sm tracking-tight">{settings.timeZone}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-1.5">
                        <Label className="text-[12px] font-semibold text-slate-500 uppercase tracking-widest">{t("serverSettings.lunchStart")}</Label>
                        <p className="font-extrabold text-[15px] text-slate-800">{settings.attendanceLunchBreakStart}</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-1.5">
                        <Label className="text-[12px] font-semibold text-slate-500 uppercase tracking-widest">{t("serverSettings.lunchEnd")}</Label>
                        <p className="font-extrabold text-[15px] text-slate-800">{settings.attendanceLunchBreakEnd}</p>
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
                        __html: JSON.stringify(settings, null, 2)
                          .replace(/"(.*?)":/g, '<span style="color: #82AAFF">"$1"</span>:')
                          .replace(/: "(.*?)"/g, ': <span style="color: #C3E88D">"$1"</span>')
                          .replace(/: (\d+)/g, ': <span style="color: #F78C6C">$1</span>')
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
