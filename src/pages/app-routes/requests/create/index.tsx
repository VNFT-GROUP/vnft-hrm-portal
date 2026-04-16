import { useState, useRef, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { TimeSelect } from "@/components/ui/time-select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeft, Umbrella, User, CheckCircle2, Truck, UserMinus, Check, Home } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

type RequestType = "leave" | "absent" | "checkInOut" | "business" | "resign" | "wfh";

const typeLabels: Record<RequestType, string> = {
  leave: "Đơn xin nghỉ",
  absent: "Đơn vắng mặt",
  checkInOut: "Đơn checkin/out",
  business: "Đơn công tác",
  resign: "Đơn thôi việc",
  wfh: "Đơn WFH",
};

const requestCards = [
  { 
    id: "leave", 
    label: "Đơn xin nghỉ", 
    description: "Đơn xin nghỉ phát sinh khi bạn muốn nghỉ nhiều ngày làm việc.",
    icon: Umbrella, 
    color: "text-indigo-500", 
    bg: "bg-indigo-50 ring-1 ring-indigo-100", 
    quota: "12 ngày / năm",
  },
  { 
    id: "absent", 
    label: "Đơn vắng mặt", 
    description: "Đơn vắng mặt phát sinh khi bạn có nhu cầu vắng mặt 1 khoảng thời gian trong ca làm việc. Đơn làm bằng chứng vắng mặt, phải về công ty checkout mới được công nhận.",
    icon: User, 
    color: "text-cyan-500", 
    bg: "bg-cyan-50 ring-1 ring-cyan-100", 
  },
  { 
    id: "checkInOut", 
    label: "Đơn checkin/out", 
    description: "Đơn checkin/out phát sinh khi bạn quên chấm công lúc đến hoặc lúc về.",
    icon: CheckCircle2, 
    color: "text-rose-500", 
    bg: "bg-rose-50 ring-1 ring-rose-100", 
    quota: "2 lần/tuần",
  },
  { 
    id: "business", 
    label: "Đơn công tác", 
    description: "Đơn công tác phát sinh khi bạn được yêu cầu đi công tác và không thể chấm công trên công ty.",
    icon: Truck, 
    color: "text-lime-600", 
    bg: "bg-lime-50 ring-1 ring-lime-100", 
  },
  { 
    id: "wfh", 
    label: "Đơn WFH", 
    description: "Đơn WFH phát sinh khi bạn được công ty cho phép làm việc tại nhà.",
    icon: Home, 
    color: "text-purple-500", 
    bg: "bg-purple-50 ring-1 ring-purple-100", 
    quota: "6 ngày / năm",
  },
  { 
    id: "resign", 
    label: "Đơn thôi việc", 
    description: "Đơn thôi việc phát sinh khi bạn nghỉ việc.",
    icon: UserMinus, 
    color: "text-red-500", 
    bg: "bg-red-50 ring-1 ring-red-100", 
  },
] as const;

const GLOBAL_REASONS = [
  "Gặp khách hàng",
  "Việc cá nhân",
  "Giải quyết việc Công ty",
  "Lý do khác",
  "Xin đi muộn/về sớm (dưới 1 tiếng rưỡi)",
  "Đi ngân hàng/đi thuế",
  "Văn phòng cúp điện",
  "Đi khám sức khoẻ tổng quát",
  "Đi triển lãm"
];

const CHECKINOUT_REASONS = [
  "Quên chốt vân tay",
  "Máy chấm công hỏng",
  "Chưa được cấp tài khoản"
];


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
  const [checkInOutType, setCheckInOutType] = useState<"checkin" | "checkout" | "">("");
  const [endTime, setEndTime] = useState("");

  const [startSession, setStartSession] = useState<"morning" | "afternoon" | "all">("all");
  const [endSession, setEndSession] = useState<"morning" | "afternoon" | "all">("all");

  const calculatedDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    start.setHours(0,0,0,0);
    const end = new Date(endDate);
    end.setHours(0,0,0,0);
    
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return 0;
    
    let totalDays = (diffTime / (1000 * 3600 * 24)) + 1;
    if (startSession === "afternoon") totalDays -= 0.5;
    if (endSession === "morning") totalDays -= 0.5;
    
    return Math.max(0, totalDays);
  }, [startDate, endDate, startSession, endSession]);

  const formRef = useRef<HTMLDivElement>(null);

  const handleTypeChange = (val: string | null) => {
    const isFirstTimeSelection = type === "";

    setType((val as RequestType) || "");
    setReason(""); 
    
    // Automatically scroll down to the form only if no option was previously selected
    if (isFirstTimeSelection && val) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 150);
    }
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

        {/* Section 1: Types */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 md:p-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-[14px] font-semibold text-slate-800 flex items-center">
                1. Chọn loại đơn <span className="text-rose-500 ml-1">*</span>
              </Label>
              <p className="text-[12.5px] text-slate-500">Bấm vào để chọn loại đơn cần tạo</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requestCards.map((card) => {
                const isSelected = type === card.id;
                const Icon = card.icon;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => handleTypeChange(card.id)}
                    className={cn(
                      "relative flex flex-row items-center text-left p-4 rounded-xl border transition-all duration-200 gap-4 select-none outline-none overflow-hidden hover:shadow-sm",
                      isSelected 
                        ? "border-[#2E3192] ring-1 ring-[#2E3192] bg-[#2E3192]/5"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white"
                    )}
                  >
                    <div className={cn("p-2.5 rounded-full shrink-0 flex items-center justify-center", card.bg)}>
                      <Icon className={cn("w-6 h-6", card.color)} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-1.5 pr-6 items-start">
                      <span className="text-[14px] md:text-[15px] font-semibold text-slate-800 tracking-tight">
                        {card.label}
                      </span>
                      <span className="text-[12.5px] text-slate-500 leading-snug">
                        {card.description}
                      </span>
                      {('quota' in card && typeof card.quota === 'string') && (
                        <div className="mt-0.5">
                          <span className="text-[11.5px] font-medium bg-slate-100/90 text-slate-600 px-2 py-0.5 border border-slate-200 rounded shrink-0 inline-flex items-center">
                            Giới hạn: {card.quota as string}
                          </span>
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <div className="absolute top-4 right-4 bg-[#2E3192] text-white rounded-full flex items-center justify-center w-5 h-5 shadow-sm">
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* Section 2: Form Fields */}
        {type !== "" && (
          <div ref={formRef} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-5 md:p-6 flex flex-col gap-5 border-b border-slate-100">
              <h3 className="text-[15px] font-semibold text-slate-800 border-b border-slate-100 pb-3">2. Chi tiết yêu cầu</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label className="text-[13px] font-semibold text-slate-700">Loại đơn đăng ký</Label>
                  <div className="w-full flex items-center justify-start text-left h-10 bg-slate-100/80 border-slate-200 border rounded-md px-4 text-sm text-slate-700 cursor-not-allowed font-medium">
                    {typeLabels[type as RequestType]}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[13px] font-semibold text-slate-700">Lý do <span className="text-rose-500">*</span></Label>
                  <Select value={reason} onValueChange={(val) => setReason(val || "")}>
                    <SelectTrigger className="w-full text-[14px] bg-white h-10 border-slate-200 focus:ring-indigo-500/20">
                      <span className={reason === "" ? "text-slate-500" : ""}>
                        {reason === "" ? "-- Chọn --" : reason}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {(type === "checkInOut" ? CHECKINOUT_REASONS : GLOBAL_REASONS).map((rs, idx) => (
                        <SelectItem key={idx} value={rs}>{rs}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {type === "checkInOut" ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-[13px] font-semibold text-slate-700">Loại thời gian <span className="text-rose-500">*</span></Label>
                        <Select value={checkInOutType} onValueChange={(val) => setCheckInOutType(val as "checkin" | "checkout" | "")}>
                          <SelectTrigger className="w-full text-[14px] bg-slate-50/50 h-10 border-slate-200 focus:ring-indigo-500/20">
                            <span className={checkInOutType === "" ? "text-slate-500" : ""}>
                              {checkInOutType === "" ? "-- Chọn --" : (checkInOutType === "checkin" ? "Check-in" : "Check-out")}
                            </span>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="checkin">Check-in</SelectItem>
                            <SelectItem value="checkout">Check-out</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

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
                        <Label className="text-[13px] font-semibold text-slate-700">Giờ <span className="text-rose-500">*</span></Label>
                        <TimeSelect value={startTime} onChange={setStartTime} />
                      </div>
                    </div>
                  </>
                ) : type === "absent" ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-[13px] font-semibold text-slate-700">Ngày vắng mặt <span className="text-rose-500">*</span></Label>
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
                        <Label className="text-[13px] font-semibold text-slate-700">Vắng mặt từ <span className="text-rose-500">*</span></Label>
                        <TimeSelect value={startTime} onChange={setStartTime} />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[13px] font-semibold text-slate-700">Vắng mặt đến <span className="text-rose-500">*</span></Label>
                        <TimeSelect value={endTime} onChange={setEndTime} />
                      </div>
                    </div>
                  </>
                ) : type === "resign" ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-[13px] font-semibold text-slate-700">Ngày nộp đơn <span className="text-rose-500">*</span></Label>
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
                        <Label className="text-[13px] font-semibold text-slate-700">Ngày thôi việc <span className="text-rose-500">*</span></Label>
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
                              onSelect={(newDate) => {
                                setStartDate(newDate);
                                if (newDate) {
                                  const prev = new Date(newDate);
                                  prev.setDate(prev.getDate() - 1);
                                  setEndDate(prev);
                                } else {
                                  setEndDate(undefined);
                                }
                              }}
                              initialFocus
                              locale={vi}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[13px] font-semibold text-slate-700">Ngày làm việc cuối <span className="text-rose-500">*</span></Label>
                        <div className="w-full flex items-center justify-start text-left font-normal h-10 bg-slate-100 border-slate-200 border rounded-md px-4 text-sm text-slate-700 cursor-not-allowed">
                          <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                          {endDate ? format(endDate, "dd/MM/yyyy") : <span className="text-slate-400">Tự động chọn</span>}
                        </div>
                      </div>
                    </div>


                  </>
                ) : type === "leave" ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5 flex flex-col">
                        <Label className="text-[13px] font-semibold text-slate-700">Ngày bắt đầu nghỉ <span className="text-rose-500">*</span></Label>
                        <div className="flex gap-2">
                          <Popover>
                            <PopoverTrigger
                              className={cn(
                                "flex-1 flex items-center justify-start text-left font-normal h-10 bg-slate-50/50 border-slate-200 border rounded-md px-4 text-sm hover:bg-slate-100/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20",
                                !startDate && "text-slate-400"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                              {startDate ? format(startDate, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus locale={vi} />
                            </PopoverContent>
                          </Popover>

                          <Select value={startSession} onValueChange={(val: "morning" | "afternoon" | "all" | null) => val && setStartSession(val)}>
                            <SelectTrigger className="w-[140px] text-[13px] h-10 bg-slate-50/50 border-slate-200 focus:ring-indigo-500/20">
                              <span className="truncate">{startSession === "all" ? "Cả ngày" : startSession === "morning" ? "Ca sáng" : "Ca chiều"}</span>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Cả ngày</SelectItem>
                              <SelectItem value="morning">Ca sáng (8h-12h)</SelectItem>
                              <SelectItem value="afternoon">Ca chiều (13h30-17h30)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1.5 flex flex-col">
                        <Label className="text-[13px] font-semibold text-slate-700">Ngày kết thúc nghỉ <span className="text-rose-500">*</span></Label>
                        <div className="flex gap-2">
                          <Popover>
                            <PopoverTrigger
                              className={cn(
                                "flex-1 flex items-center justify-start text-left font-normal h-10 bg-slate-50/50 border-slate-200 border rounded-md px-4 text-sm hover:bg-slate-100/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20",
                                !endDate && "text-slate-400"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                              {endDate ? format(endDate, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus locale={vi} />
                            </PopoverContent>
                          </Popover>

                          <Select value={endSession} onValueChange={(val: "morning" | "afternoon" | "all" | null) => val && setEndSession(val)}>
                            <SelectTrigger className="w-[140px] text-[13px] h-10 bg-slate-50/50 border-slate-200 focus:ring-indigo-500/20">
                              <span className="truncate">{endSession === "all" ? "Cả ngày" : endSession === "morning" ? "Ca sáng" : "Ca chiều"}</span>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Cả ngày</SelectItem>
                              <SelectItem value="morning">Ca sáng (8h-12h)</SelectItem>
                              <SelectItem value="afternoon">Ca chiều (13h30-17h30)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {calculatedDays > 0 ? (
                      <div className="p-3 bg-indigo-50/80 border border-indigo-100 rounded-md text-sm text-indigo-700 flex items-center justify-between">
                        <span className="font-medium">Tổng số ngày nghỉ dự kiến</span>
                        <span className="text-base font-bold">{calculatedDays} ngày</span>
                      </div>
                    ) : (startDate && endDate) ? (
                      <div className="p-3 bg-rose-50 border border-rose-100 rounded-md text-sm text-rose-600 flex items-center justify-between">
                        <span className="font-medium">Khoảng thời gian không hợp lệ</span>
                        <span className="text-base font-bold">0 ngày</span>
                      </div>
                    ) : null}
                  </div>
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
            </div>

            <div className="p-5 px-6 md:px-8 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <Button variant="outline" onClick={() => navigate("/app/requests")} className="h-11 px-6 font-medium text-slate-600 bg-white shadow-sm hover:bg-slate-50 border-slate-200">
                Hủy
              </Button>
              <Button onClick={onSubmit} className="h-11 px-8 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-medium shadow-sm transition-colors">
                Tạo đơn
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
