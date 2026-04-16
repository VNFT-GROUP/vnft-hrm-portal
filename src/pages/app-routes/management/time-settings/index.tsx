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
    
    if (h > 0 && m > 0) return `${h} giá» ${m} phÃºt`;
    if (h > 0) return `${h} giá»`;
    return `${m} phÃºt`;
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("ÄÃ£ lÆ°u thiáº¿t láº­p giá» giáº¥c thÃ nh cÃ´ng!");
    }, 600);
  };

  const timeOptions = Array.from({ length: 17 }, (_, i) => {
    const totalMinutes = 10 * 60 + 30 + i * 15; // From 10:30 to 14:30
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  });

  return (
    <div className="w-full p-4 md:p-8 flex flex-col gap-6 md:gap-8">
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
              CÃ i Ä‘áº·t Giá» giáº¥c
            </h1>
            <p className="text-muted-foreground text-sm md:text-base ml-1">
              Cáº¥u hÃ¬nh thá»i gian lÃ m viá»‡c, má»©c Ä‘á»™ sai lá»‡ch cho phÃ©p vÃ  cÃ¡c khung giá» nghá»‰.
            </p>
          </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                Sai sá»‘ thá»i gian
              </CardTitle>
              <CardDescription>
                Cáº¥u hÃ¬nh khoáº£ng thá»i gian trá»… vÃ  vá» sá»›m Ä‘Æ°á»£c há»‡ thá»‘ng cháº¥p nháº­n (khÃ´ng ghi nháº­n vi pháº¡m).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Äá»™ trá»… cho phÃ©p</Label>
                <Select value={lateness} onValueChange={(val) => setLateness(val || "0")}>
                  <SelectTrigger className="bg-slate-50/50 h-10 transition-shadow focus:ring-indigo-500/20">
                    <SelectValue placeholder="Chá»n sá»‘ phÃºt" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">KhÃ´ng cho phÃ©p (0 phÃºt)</SelectItem>
                    <SelectItem value="5">5 phÃºt</SelectItem>
                    <SelectItem value="10">10 phÃºt</SelectItem>
                    <SelectItem value="15">15 phÃºt</SelectItem>
                    <SelectItem value="20">20 phÃºt</SelectItem>
                    <SelectItem value="30">30 phÃºt</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex flex-col gap-1 mt-3 bg-indigo-50/60 p-3 rounded-lg border border-indigo-100/60 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-400 group-hover:bg-indigo-500 transition-colors" />
                  <div className="flex gap-2">
                    <Info className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    <span className="text-[13px] text-slate-700 leading-relaxed font-medium">
                      VÃ­ dá»¥ minh há»a (Ca sÃ¡ng: 08:00)
                    </span>
                  </div>
                  <span className="text-[13px] text-slate-600 leading-relaxed pl-6">
                    Äiá»ƒm danh lÃºc <strong className="text-indigo-700 bg-indigo-100/50 px-1 py-0.5 rounded">08:{lateness.padStart(2, '0')}</strong> váº«n sáº½ Ä‘Æ°á»£c há»‡ thá»‘ng tÃ­nh lÃ  <strong>Ä‘Ãºng giá»</strong>.
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <Label className="text-sm font-semibold text-slate-700">Äá»™ sá»›m cho phÃ©p</Label>
                <Select value={earlyLeave} onValueChange={(val) => setEarlyLeave(val || "0")}>
                  <SelectTrigger className="bg-slate-50/50 h-10 transition-shadow focus:ring-indigo-500/20">
                    <SelectValue placeholder="Chá»n sá»‘ phÃºt" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">KhÃ´ng cho phÃ©p (0 phÃºt)</SelectItem>
                    <SelectItem value="5">5 phÃºt</SelectItem>
                    <SelectItem value="10">10 phÃºt</SelectItem>
                    <SelectItem value="15">15 phÃºt</SelectItem>
                    <SelectItem value="20">20 phÃºt</SelectItem>
                    <SelectItem value="30">30 phÃºt</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex flex-col gap-1 mt-3 bg-rose-50/60 p-3 rounded-lg border border-rose-100/60 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-rose-400 group-hover:bg-rose-500 transition-colors" />
                  <div className="flex gap-2">
                    <Info className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                    <span className="text-[13px] text-slate-700 leading-relaxed font-medium">
                      VÃ­ dá»¥ minh há»a (Ca chiá»u: 17:30)
                    </span>
                  </div>
                  <span className="text-[13px] text-slate-600 leading-relaxed pl-6">
                    Äiá»ƒm danh vá» lÃºc <strong className="text-rose-700 bg-rose-100/50 px-1 py-0.5 rounded">{
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
                    }</strong> váº«n sáº½ Ä‘Æ°á»£c tÃ­nh lÃ  <strong>Ä‘á»§ cÃ´ng</strong>.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200 h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                Thá»i gian nghá»‰ trÆ°a
              </CardTitle>
              <CardDescription>
                Thiáº¿t láº­p khung giá» nghá»‰ trÆ°a tiÃªu chuáº©n vÃ  cá»‘ Ä‘á»‹nh. Khoáº£ng thá»i gian nÃ y sáº½ tá»± Ä‘á»™ng bá»‹ loáº¡i trá»« khá»i tá»•ng giá» lÃ m.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Báº¯t Ä‘áº§u tá»«</Label>
                  <Select value={lunchFrom} onValueChange={(val) => setLunchFrom(val || "12:00")}>
                    <SelectTrigger className={`bg-slate-50/50 h-10 ${isLunchTimeInvalid ? 'border-rose-300 ring-rose-200' : ''}`}>
                      <SelectValue placeholder="Chá»n giá»" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((t) => (
                        <SelectItem key={`from-${t}`} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Äáº¿n lÃºc</Label>
                  <Select value={lunchTo} onValueChange={(val) => setLunchTo(val || "13:30")}>
                    <SelectTrigger className={`bg-slate-50/50 h-10 ${isLunchTimeInvalid ? 'border-rose-300 ring-rose-200' : ''}`}>
                      <SelectValue placeholder="Chá»n giá»" />
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
                  <span className="text-[13px] text-rose-700 font-medium">Lá»—i: Thá»i gian "Äáº¿n lÃºc" pháº£i muá»™n hÆ¡n "Báº¯t Ä‘áº§u tá»«". Vui lÃ²ng chá»n láº¡i.</span>
                </div>
              )}

              <div className={`rounded-xl p-5 border flex flex-col justify-center items-center gap-2 shadow-sm transition-colors ${isLunchTimeInvalid ? 'bg-slate-50 border-slate-200' : 'bg-linear-to-r from-emerald-50 to-teal-50 border-emerald-100'}`}>
                 <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">Tá»•ng Thá»i Gian Nghá»‰</span>
                 <span className={`text-3xl font-extrabold tracking-tight ${isLunchTimeInvalid ? 'text-slate-300' : 'text-emerald-600'}`}>
                   {calculateDuration(lunchFrom, lunchTo)}
                 </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Global Save Button */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-slate-500 font-medium">CÃ¡c thay Ä‘á»•i sáº½ Ä‘Æ°á»£c Ã¡p dá»¥ng cho toÃ n bá»™ nhÃ¢n sá»±.</p>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || isLunchTimeInvalid}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 shadow-md hover:shadow-lg transition-all active:scale-[0.98] h-11 rounded-lg"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Äang lÆ°u...
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[15px]">
                <Check className="w-5 h-5" />
                LÆ°u CÃ i Äáº·t
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
