import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Clock, Info, Check } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function TimeSettingsPage() {
  const [lateness, setLateness] = useState("15");
  const [earlyLeave, setEarlyLeave] = useState("15");
  const [lunchFrom, setLunchFrom] = useState("12:00");
  const [lunchTo, setLunchTo] = useState("13:30");
  const [isSaving, setIsSaving] = useState(false);

  const getMins = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const isLunchTimeInvalid = getMins(lunchTo) <= getMins(lunchFrom);

  const calculateDuration = (from: string, to: string) => {
    if (isLunchTimeInvalid) return "--";
    const diffMins = getMins(to) - getMins(from);
    
    const h = Math.floor(diffMins / 60);
    const m = diffMins % 60;
    
    if (h > 0 && m > 0) return `${h} giờ ${m} phút`;
    if (h > 0) return `${h} giờ`;
    return `${m} phút`;
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Đã lưu thiết lập giờ giấc thành công!");
    }, 600);
  };

  const timeOptions = Array.from({ length: 17 }, (_, i) => {
    const totalMinutes = 10 * 60 + 30 + i * 15; // From 10:30 to 14:30
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  });

  return (
    <div className="w-full p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
      <div className="w-full space-y-6">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col gap-2"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-[#1E2062] flex items-center gap-3">
              <span className="p-2.5 bg-[#2E3192]/10 text-[#2E3192] rounded-xl flex items-center justify-center">
                <Clock size={26} strokeWidth={2.5} />
              </span>
              Cài đặt Giờ giấc
            </h1>
            <p className="text-muted-foreground text-sm md:text-base ml-1">
              Cấu hình thời gian làm việc, mức độ sai lệch cho phép và các khung giờ nghỉ.
            </p>
          </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                Sai số thời gian
              </CardTitle>
              <CardDescription>
                Cấu hình khoảng thời gian trễ và về sớm được hệ thống chấp nhận (không ghi nhận vi phạm).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Độ trễ cho phép</Label>
                <Select value={lateness} onValueChange={(val) => setLateness(val || "0")}>
                  <SelectTrigger className="bg-slate-50/50 h-10 transition-shadow focus:ring-indigo-500/20">
                    <SelectValue placeholder="Chọn số phút" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Không cho phép (0 phút)</SelectItem>
                    <SelectItem value="5">5 phút</SelectItem>
                    <SelectItem value="10">10 phút</SelectItem>
                    <SelectItem value="15">15 phút</SelectItem>
                    <SelectItem value="20">20 phút</SelectItem>
                    <SelectItem value="30">30 phút</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex flex-col gap-1 mt-3 bg-indigo-50/60 p-3 rounded-lg border border-indigo-100/60 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-400 group-hover:bg-indigo-500 transition-colors" />
                  <div className="flex gap-2">
                    <Info className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    <span className="text-[13px] text-slate-700 leading-relaxed font-medium">
                      Ví dụ minh họa (Ca sáng: 08:00)
                    </span>
                  </div>
                  <span className="text-[13px] text-slate-600 leading-relaxed pl-6">
                    Điểm danh lúc <strong className="text-indigo-700 bg-indigo-100/50 px-1 py-0.5 rounded">08:{lateness.padStart(2, '0')}</strong> vẫn sẽ được hệ thống tính là <strong>đúng giờ</strong>.
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <Label className="text-sm font-semibold text-slate-700">Độ sớm cho phép</Label>
                <Select value={earlyLeave} onValueChange={(val) => setEarlyLeave(val || "0")}>
                  <SelectTrigger className="bg-slate-50/50 h-10 transition-shadow focus:ring-indigo-500/20">
                    <SelectValue placeholder="Chọn số phút" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Không cho phép (0 phút)</SelectItem>
                    <SelectItem value="5">5 phút</SelectItem>
                    <SelectItem value="10">10 phút</SelectItem>
                    <SelectItem value="15">15 phút</SelectItem>
                    <SelectItem value="20">20 phút</SelectItem>
                    <SelectItem value="30">30 phút</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex flex-col gap-1 mt-3 bg-rose-50/60 p-3 rounded-lg border border-rose-100/60 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-rose-400 group-hover:bg-rose-500 transition-colors" />
                  <div className="flex gap-2">
                    <Info className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                    <span className="text-[13px] text-slate-700 leading-relaxed font-medium">
                      Ví dụ minh họa (Ca chiều: 17:30)
                    </span>
                  </div>
                  <span className="text-[13px] text-slate-600 leading-relaxed pl-6">
                    Điểm danh về lúc <strong className="text-rose-700 bg-rose-100/50 px-1 py-0.5 rounded">{
                      (() => {
                        const leave = parseInt(earlyLeave);
                        const endMin = 30;
                        const endHour = 17;
                        let m = endMin - leave;
                        let h = endHour;
                        if (m < 0) {
                          m += 60;
                          h -= 1;
                        }
                        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                      })()
                    }</strong> vẫn sẽ được tính là <strong>đủ công</strong>.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200 h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                Thời gian nghỉ trưa
              </CardTitle>
              <CardDescription>
                Thiết lập khung giờ nghỉ trưa tiêu chuẩn và cố định. Khoảng thời gian này sẽ tự động bị loại trừ khỏi tổng giờ làm.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Bắt đầu từ</Label>
                  <Select value={lunchFrom} onValueChange={(val) => setLunchFrom(val || "12:00")}>
                    <SelectTrigger className={`bg-slate-50/50 h-10 ${isLunchTimeInvalid ? 'border-rose-300 ring-rose-200' : ''}`}>
                      <SelectValue placeholder="Chọn giờ" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((t) => (
                        <SelectItem key={`from-${t}`} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Đến lúc</Label>
                  <Select value={lunchTo} onValueChange={(val) => setLunchTo(val || "13:30")}>
                    <SelectTrigger className={`bg-slate-50/50 h-10 ${isLunchTimeInvalid ? 'border-rose-300 ring-rose-200' : ''}`}>
                      <SelectValue placeholder="Chọn giờ" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((t) => (
                        <SelectItem key={`to-${t}`} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isLunchTimeInvalid && (
                <div className="flex items-start gap-2 bg-rose-50/60 p-3 rounded-lg border border-rose-100">
                  <Info className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                  <span className="text-[13px] text-rose-700 font-medium">Lỗi: Thời gian "Đến lúc" phải muộn hơn "Bắt đầu từ". Vui lòng chọn lại.</span>
                </div>
              )}

              <div className={`rounded-xl p-5 border flex flex-col justify-center items-center gap-2 shadow-sm transition-colors ${isLunchTimeInvalid ? 'bg-slate-50 border-slate-200' : 'bg-linear-to-r from-emerald-50 to-teal-50 border-emerald-100'}`}>
                 <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">Tổng Thời Gian Nghỉ</span>
                 <span className={`text-3xl font-extrabold tracking-tight ${isLunchTimeInvalid ? 'text-slate-300' : 'text-emerald-600'}`}>
                   {calculateDuration(lunchFrom, lunchTo)}
                 </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Global Save Button */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-slate-500 font-medium">Các thay đổi sẽ được áp dụng cho toàn bộ nhân sự.</p>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || isLunchTimeInvalid}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 shadow-md hover:shadow-lg transition-all active:scale-[0.98] h-11 rounded-lg"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang lưu...
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[15px]">
                <Check className="w-5 h-5" />
                Lưu Cài Đặt
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
