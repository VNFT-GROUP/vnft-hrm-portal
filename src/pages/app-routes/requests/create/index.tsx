import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeft, Paperclip, UploadCloud, X, Fingerprint, Briefcase, Home, CalendarOff, LogOut, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

type RequestType = "checkInOut" | "business" | "wfh" | "leave" | "absent";

const typeLabels: Record<RequestType, string> = {
  checkInOut: "Đơn xin Check-in / Check-out",
  business: "Đơn xin đi công tác",
  wfh: "Đơn xin làm việc tại nhà (WFH)",
  leave: "Đơn xin nghỉ phép",
  absent: "Đơn xin vắng mặt",
};

const requestCards = [
  { id: "checkInOut", label: "Check-in / out", icon: Fingerprint, color: "text-blue-600", bg: "bg-blue-100", activeClass: "border-blue-600 ring-1 ring-blue-600 bg-blue-50", check: "text-blue-600" },
  { id: "business", label: "Công tác", icon: Briefcase, color: "text-amber-600", bg: "bg-amber-100", activeClass: "border-amber-500 ring-1 ring-amber-500 bg-amber-50", check: "text-amber-500" },
  { id: "wfh", label: "Làm tại nhà", icon: Home, color: "text-emerald-600", bg: "bg-emerald-100", activeClass: "border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50", check: "text-emerald-500" },
  { id: "leave", label: "Nghỉ phép", icon: CalendarOff, color: "text-rose-600", bg: "bg-rose-100", activeClass: "border-rose-500 ring-1 ring-rose-500 bg-rose-50", check: "text-rose-500" },
  { id: "absent", label: "Vắng mặt", icon: LogOut, color: "text-indigo-600", bg: "bg-indigo-100", activeClass: "border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50", check: "text-indigo-500" },
] as const;

const reasonsMap: Record<RequestType, string[]> = {
  checkInOut: ["Quên chốt vân tay", "Thiết bị lỗi", "Lý do cá nhân", "Khác"],
  business: ["Gặp gỡ Khách hàng/Đối tác", "Khảo sát thị trường", "Họp/Công việc chuyên môn", "Khác"],
  wfh: ["Giải quyết việc gia đình", "Vấn đề sức khỏe cá nhân", "Thời tiết/Điều kiện di chuyển", "Khác"],
  leave: ["Nghỉ phép phép năm", "Nghỉ bù", "Nghỉ không lương", "Nghỉ ốm đau"],
  absent: ["Giải quyết việc công ty", "Có việc đột xuất gia đình", "Khám bệnh", "Khác"],
};

const getQuotaText = (type: RequestType) => {
  if (type === "checkInOut") return "Còn lại: 2/2 lần tháng này";
  if (type === "absent") return "Còn lại: 5/5 lần tuần này";
  return null;
};

// Modun React-Quill được cấu hình để tắt upload ảnh/chặn media nhưng cho phép chọn màu
const quillModules = {
  toolbar: [
    [{ 'color': [] }, { 'background': [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false,
  }
};

export default function CreateRequestPage() {
  const navigate = useNavigate();
  const [type, setType] = useState<RequestType | "">("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const [date, setDate] = useState<Date>();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleTypeChange = (val: string | null) => {
    setType((val as RequestType) || "");
    setReason(""); 
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => {
        const total = prev.length + selectedFiles.length;
        if (total > 5) {
          toast.error("Chỉ được tải lên tối đa 5 file đính kèm.");
          return [...prev, ...selectedFiles].slice(0, 5);
        }
        return [...prev, ...selectedFiles];
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = () => {
    if (!reason) {
      toast.error("Vui lòng chọn lý do tạo đơn.");
      return;
    }
    toast.success("Đã tạo đơn thành công!");
    navigate("/app/requests");
  };

  return (
    <div className="w-full p-4 md:p-6">
      <div className="w-full space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/app/requests")}
              className="p-2 hover:bg-slate-200/50 rounded-full transition-colors text-slate-500 hover:text-slate-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Tạo đơn mới
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Điền đầy đủ các thông tin cần thiết để nộp đơn từ.
              </p>
            </div>
          </div>
        </div>

        {/* Form Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 md:p-6 flex flex-col gap-5">
            
            <div className="space-y-3 pb-3 border-b border-slate-100">
              <Label className="text-[13px] font-semibold text-slate-700">Loại đơn <span className="text-rose-500">*</span></Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {requestCards.map((card) => {
                  const isSelected = type === card.id;
                  const Icon = card.icon;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => handleTypeChange(card.id)}
                      className={cn(
                        "relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 text-center gap-3 select-none outline-none",
                        isSelected 
                          ? card.activeClass
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white"
                      )}
                    >
                      {isSelected && (
                        <div className={cn("absolute top-2 right-2", card.check)}>
                          <CheckCircle2 className="w-4 h-4 fill-current text-white" />
                        </div>
                      )}
                      <div className={cn("p-3 rounded-full transition-colors", isSelected ? card.bg : "bg-slate-100")}>
                        <Icon className={cn("w-6 h-6", isSelected ? card.color : "text-slate-500")} strokeWidth={1.5} />
                      </div>
                      <span className={cn("text-[13px] font-medium tracking-tight", isSelected ? "text-slate-900" : "text-slate-600")}>
                        {card.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="min-h-[24px]">
                {type !== "" && (
                  <p className="text-[13.5px] text-slate-600 font-medium px-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block"></span>
                    Hệ thống sẽ tạo: <span className="text-indigo-700">{typeLabels[type as RequestType]}</span>
                    {getQuotaText(type as RequestType) && (
                      <span className="text-slate-500 font-normal ml-1">({getQuotaText(type as RequestType)})</span>
                    )}
                  </p>
                )}
              </div>
            </div>

            {type !== "" && (
              <>
                {type === "checkInOut" ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-[13px] font-semibold text-slate-700">Ngày <span className="text-rose-500">*</span></Label>
                        <Popover>
                          <PopoverTrigger
                            className={cn(
                              "w-full flex items-center justify-start text-left font-normal h-10 bg-slate-50/50 border-slate-200 border rounded-md px-4 text-sm hover:bg-slate-100/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20",
                              !date && "text-slate-400"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                            {date ? format(date, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                              locale={vi}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[13px] font-semibold text-slate-700">Lý do <span className="text-rose-500">*</span></Label>
                        <Select value={reason} onValueChange={(val) => setReason(val || "")}>
                          <SelectTrigger className="w-full text-[14px] bg-slate-50/50 h-10 border-slate-200 focus:ring-indigo-500/20">
                            <span className={reason === "" ? "text-slate-500" : ""}>
                              {reason === "" ? "-- Chọn --" : reason}
                            </span>
                          </SelectTrigger>
                          <SelectContent>
                            {reasonsMap[type as RequestType].map((rs, idx) => (
                              <SelectItem key={idx} value={rs}>{rs}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-[13px] font-semibold text-slate-700">Giờ bắt đầu <span className="text-rose-500">*</span></Label>
                        <Input 
                          type="time" 
                          className="pl-3 pr-3 text-[14px] h-10 bg-slate-50/50 border-slate-200 focus:ring-indigo-500/20" 
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[13px] font-semibold text-slate-700">Giờ kết thúc <span className="text-rose-500">*</span></Label>
                        <Input 
                          type="time" 
                          className="pl-3 pr-3 text-[14px] h-10 bg-slate-50/50 border-slate-200 focus:ring-indigo-500/20" 
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-[13px] font-semibold text-slate-700">Ngày bắt đầu <span className="text-rose-500">*</span></Label>
                        <Popover>
                          <PopoverTrigger
                            className={cn(
                              "w-full flex items-center justify-start text-left font-normal h-10 bg-slate-50/50 border-slate-200 border rounded-md px-4 text-sm hover:bg-slate-100/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20",
                              !startDate && "text-slate-400"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                            {startDate ? format(startDate, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                              locale={vi}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[13px] font-semibold text-slate-700">Ngày kết thúc <span className="text-rose-500">*</span></Label>
                        <Popover>
                          <PopoverTrigger
                            className={cn(
                              "w-full flex items-center justify-start text-left font-normal h-10 bg-slate-50/50 border-slate-200 border rounded-md px-4 text-sm hover:bg-slate-100/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20",
                              !endDate && "text-slate-400"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                            {endDate ? format(endDate, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                              locale={vi}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-semibold text-slate-700">Lý do <span className="text-rose-500">*</span></Label>
                      <Select value={reason} onValueChange={(val) => setReason(val || "")}>
                        <SelectTrigger className="w-full text-[14px] bg-slate-50/50 h-10 border-slate-200 focus:ring-indigo-500/20">
                          <span className={reason === "" ? "text-slate-500" : ""}>
                            {reason === "" ? "-- Chọn --" : reason}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          {reasonsMap[type as RequestType].map((rs, idx) => (
                            <SelectItem key={idx} value={rs}>{rs}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold text-slate-700 flex items-center justify-between">
                Mô tả
              </Label>
              <div className="bg-white rounded-md border border-slate-300 overflow-hidden [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 [&_.ql-toolbar]:bg-slate-50/50 [&_.ql-container]:border-none [&_.ql-editor]:min-h-[100px] [&_.ql-editor]:text-[14px] [&_.ql-editor.ql-blank::before]:text-slate-400 [&_.ql-editor.ql-blank::before]:font-normal">
                <ReactQuill 
                  theme="snow" 
                  value={description} 
                  onChange={setDescription} 
                  modules={quillModules}
                  placeholder="Mô tả chi tiết (không bắt buộc)..."
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold text-slate-700">Tệp đính kèm (Tối đa 5 file)</Label>
              <div className="mt-1">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="sm:text-sm text-[13px] text-slate-500"><span className="font-semibold text-indigo-600">Nhấn tập tin</span> hoặc kéo thả vào đây</p>
                    <p className="text-xs text-slate-400 mt-1">Hỗ trợ PDF, DOCX, JPG, PNG (Tối đa 5MB/file)</p>
                  </div>
                  <Input 
                    type="file" 
                    className="hidden" 
                    multiple 
                    onChange={handleFileChange} 
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                  />
                </label>
              </div>

              {files.length > 0 && (
                <div className="mt-2.5 space-y-2">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-md shadow-sm">
                      <div className="flex items-center gap-2 truncate mr-3">
                        <Paperclip className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-[13px] text-slate-600 truncate">{file.name}</span>
                        <span className="text-xs text-slate-400 shrink-0">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeFile(idx)} 
                        className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
          )}

          </div>

          {type !== "" && (
            <div className="p-5 px-6 md:px-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <Button variant="outline" onClick={() => navigate("/app/requests")} className="h-11 px-6 font-medium text-slate-600 bg-white shadow-sm hover:bg-slate-50 border-slate-200">
                Hủy
              </Button>
              <Button onClick={onSubmit} className="h-11 px-8 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-medium shadow-sm transition-colors">
                Tạo đơn
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
