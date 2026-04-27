import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestFormMeService } from "@/services/requestform/me";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { TimeSelect } from "@/components/ui/time-select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CalendarIcon,
  Umbrella,
  User,
  CheckCircle2,
  Truck,
  Home,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn, getErrorMessage } from "@/lib/utils";

import { RichTextEditor } from "@/components/custom/RichTextEditor";


import type { 
  RequestFormType, 
  LeaveReasonType, 
  LeaveSessionType, 
  AbsenceReasonType, 
  AttendanceAdjustmentReasonType, 
  AttendanceAdjustmentTimeType,
  BusinessTripReasonType 
} from "@/types/requestform/RequestFormEnums";
import { 
  LEAVE_REASON_LABELS, 
  LEAVE_COUNTED_WORK, 
  ABSENCE_REASON_LABELS, 
  ABSENCE_COUNTED_WORK, 
  ATTENDANCE_ADJUSTMENT_REASON_LABELS, 
  BUSINESS_TRIP_REASON_LABELS, 
  REQUEST_FORM_TYPE_LABELS,
  countedWorkLabel
} from "@/constants/request-form";

const requestCards = [
  {
    id: "LEAVE",
    label: "Đơn nghỉ phép",
    description: "Nghỉ phép năm, nghỉ ốm, thai sản, hội nghị...",
    icon: Umbrella,
    color: "text-indigo-500",
    bg: "bg-indigo-50 ring-1 ring-indigo-100",
  },
  {
    id: "ABSENCE",
    label: "Đơn vắng mặt",
    description: "Gặp khách hàng, việc cá nhân, đi trễ/về sớm...",
    icon: User,
    color: "text-cyan-500",
    bg: "bg-cyan-50 ring-1 ring-cyan-100",
  },
  {
    id: "ATTENDANCE_ADJUSTMENT",
    label: "Đơn điều chỉnh chấm công",
    description: "Quên vân tay, máy chấm công hỏng...",
    icon: CheckCircle2,
    color: "text-rose-500",
    bg: "bg-rose-50 ring-1 ring-rose-100",
  },
  {
    id: "BUSINESS_TRIP",
    label: "Đơn công tác",
    description: "Công tác, gặp gỡ khách hàng, tham quan nhà máy...",
    icon: Truck,
    color: "text-lime-600",
    bg: "bg-lime-50 ring-1 ring-lime-100",
  },
  {
    id: "WFH",
    label: "Đơn làm việc tại nhà",
    description: "Làm việc tại nhà theo quy định.",
    icon: Home,
    color: "text-purple-500",
    bg: "bg-purple-50 ring-1 ring-purple-100",
  },
] as const;



export default function CreateRequestPage() {
  const navigate = useNavigate();
  const [type, setType] = useState<RequestFormType | "">("");
  const [description, setDescription] = useState("");

  const [date1, setDate1] = useState<Date>();
  const [date2, setDate2] = useState<Date>();
  const [time1, setTime1] = useState("");
  const [time2, setTime2] = useState("");

  const [leaveReasonType, setLeaveReasonType] = useState<LeaveReasonType | "">("");
  const [startSession, setStartSession] = useState<LeaveSessionType | "">("");
  const [endSession, setEndSession] = useState<LeaveSessionType | "">("");

  const [absenceReasonType, setAbsenceReasonType] = useState<AbsenceReasonType | "">("");

  const [attendanceAdjustmentReasonType, setAttendanceAdjustmentReasonType] = useState<AttendanceAdjustmentReasonType | "">("");
  const [timeType, setTimeType] = useState<AttendanceAdjustmentTimeType | "">("");

  const [businessTripReasonType, setBusinessTripReasonType] = useState<BusinessTripReasonType | "">("");
  const [tripMode, setTripMode] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");



  const formRef = useRef<HTMLDivElement>(null);

  const handleTypeChange = (val: string) => {
    const isFirstTimeSelection = type === "";
    setType(val as RequestFormType);

    if (isFirstTimeSelection && val) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 150);
    }
  };

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async () => {

      switch (type) {
        case "LEAVE": {
          const payload = {
            reasonType: leaveReasonType as LeaveReasonType,
            startDate: format(date1!, "yyyy-MM-dd"),
            startSession: startSession as LeaveSessionType,
            endDate: format(date2!, "yyyy-MM-dd"),
            endSession: endSession as LeaveSessionType,
            description,
          };
          return requestFormMeService.createLeave(payload);
        }
        case "ABSENCE": {
          const payload = {
            absenceDate: format(date1!, "yyyy-MM-dd"),
            fromTime: time1,
            toTime: time2,
            reasonType: absenceReasonType as AbsenceReasonType,
            description,
          };
          return requestFormMeService.createAbsence(payload);
        }
        case "ATTENDANCE_ADJUSTMENT": {
          const payload = {
            timeType: timeType as AttendanceAdjustmentTimeType,
            attendanceDate: format(date1!, "yyyy-MM-dd"),
            requestedTime: time1,
            reasonType: attendanceAdjustmentReasonType as AttendanceAdjustmentReasonType,
            description,
          };
          return requestFormMeService.createAttendanceAdjustment(payload);
        }
        case "BUSINESS_TRIP": {
          const payload = {
            startDate: format(date1!, "yyyy-MM-dd"),
            endDate: format(date2!, "yyyy-MM-dd"),
            tripMode: tripMode,
            location: location || null,
            address: address || null,
            reasonType: businessTripReasonType as BusinessTripReasonType,
            description,
          };
          return requestFormMeService.createBusinessTrip(payload);
        }
        case "WFH": {
          const payload = {
            startDate: format(date1!, "yyyy-MM-dd"),
            endDate: format(date2!, "yyyy-MM-dd"),
            description,
          };
          return requestFormMeService.createWfh(payload);
        }
        default:
          throw new Error("Invalid request type");
      }
    },
    onSuccess: () => {
      toast.success("Đã tạo đơn thành công!");
      queryClient.invalidateQueries({ queryKey: ["my-request-forms"] });
      navigate("/app/requests");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Có lỗi xảy ra khi tạo đơn."));
    },
  });

  const onSubmit = () => {
    let isValid = true;
    switch (type) {
      case "LEAVE":
        if (!leaveReasonType || !date1 || !startSession || !date2 || !endSession) isValid = false;
        if (date1 && date2 && date2 < date1) { toast.error("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu."); return; }
        if (date1 && date2 && date1.getTime() === date2.getTime() && startSession === "AFTERNOON" && endSession === "MORNING") {
          toast.error("Khoảng thời gian nghỉ không hợp lệ."); return;
        }
        break;
      case "ABSENCE":
        if (!date1 || !time1 || !time2 || !absenceReasonType) isValid = false;
        if (time1 && time2 && time1 >= time2) { toast.error("Giờ kết thúc vắng mặt phải lớn hơn giờ bắt đầu."); return; }
        if (absenceReasonType === "LATE_EARLY_UNDER_NINETY") {
           const from = parseInt(time1.split(':')[0]) * 60 + parseInt(time1.split(':')[1]);
           const to = parseInt(time2.split(':')[0]) * 60 + parseInt(time2.split(':')[1]);
           if (to - from > 90) { toast.error("Đi xin muộn/về sớm thời gian vắng mặt tối đa là 90 phút."); return; }
        }
        break;
      case "ATTENDANCE_ADJUSTMENT":
        if (!date1 || !timeType || !time1 || !attendanceAdjustmentReasonType) isValid = false;
        break;
      case "BUSINESS_TRIP":
        if (!date1 || !date2 || !tripMode || !businessTripReasonType) isValid = false;
        if (date1 && date2 && date2 < date1) { toast.error("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu."); return; }
        break;
      case "WFH":
        if (!date1 || !date2) isValid = false;
        if (date1 && date2 && date2 < date1) { toast.error("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu."); return; }
        if (!description || description.trim() === "" || description === "<p><br></p>") isValid = false;
        break;
    }

    if (!isValid) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }
    
    if (type !== "WFH" && description.length > 1000) {
       toast.error("Mô tả không được vượt quá 1000 ký tự."); return;
    }

    createMutation.mutate();
  };

  return (
    
    <div className="w-full p-4 md:p-6 mx-auto">
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
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white",
                      )}
                    >
                      <div className={cn("p-2.5 rounded-full shrink-0 flex items-center justify-center", card.bg)}>
                        <Icon className={cn("w-6 h-6", card.color)} strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col gap-1.5 pr-6 items-start">
                        <span className="text-[14px] md:text-[15px] font-semibold text-slate-800 tracking-tight">{card.label}</span>
                        <span className="text-[12.5px] text-slate-500 leading-snug">{card.description}</span>
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

        {type !== "" && (
          <div ref={formRef} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-5 md:p-6 flex flex-col gap-5 border-b border-slate-100">
              <h3 className="text-[15px] font-semibold text-slate-800 border-b border-slate-100 pb-3">2. Chi tiết yêu cầu</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label className="text-[13px] font-semibold text-slate-700">Loại đơn đăng ký</Label>
                  <div className="w-full flex items-center justify-start text-left h-10 bg-slate-100/80 border-slate-200 border rounded-md px-4 text-sm text-slate-700 cursor-not-allowed font-medium">
                    {REQUEST_FORM_TYPE_LABELS[type as RequestFormType]}
                  </div>
                </div>

                {type === "LEAVE" && (
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-slate-700">Lý do nghỉ <span className="text-rose-500">*</span></Label>
                    <Select value={leaveReasonType} onValueChange={(val) => setLeaveReasonType(val as LeaveReasonType)}>
                      <SelectTrigger className="w-full h-10 border-slate-200">
                        <SelectValue placeholder="-- Chọn lý do --">{leaveReasonType ? LEAVE_REASON_LABELS[leaveReasonType as LeaveReasonType] : undefined}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(LEAVE_REASON_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {type === "ABSENCE" && (
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-slate-700">Lý do vắng mặt <span className="text-rose-500">*</span></Label>
                    <Select value={absenceReasonType} onValueChange={(val) => setAbsenceReasonType(val as AbsenceReasonType)}>
                      <SelectTrigger className="w-full h-10 border-slate-200">
                        <SelectValue placeholder="-- Chọn lý do --">{absenceReasonType ? ABSENCE_REASON_LABELS[absenceReasonType as AbsenceReasonType] : undefined}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ABSENCE_REASON_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {type === "ATTENDANCE_ADJUSTMENT" && (
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-slate-700">Lý do điều chỉnh <span className="text-rose-500">*</span></Label>
                    <Select value={attendanceAdjustmentReasonType} onValueChange={(val) => setAttendanceAdjustmentReasonType(val as AttendanceAdjustmentReasonType)}>
                      <SelectTrigger className="w-full h-10 border-slate-200">
                        <SelectValue placeholder="-- Chọn lý do --">{attendanceAdjustmentReasonType ? ATTENDANCE_ADJUSTMENT_REASON_LABELS[attendanceAdjustmentReasonType as AttendanceAdjustmentReasonType] : undefined}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ATTENDANCE_ADJUSTMENT_REASON_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {type === "BUSINESS_TRIP" && (
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-slate-700">Lý do công tác <span className="text-rose-500">*</span></Label>
                    <Select value={businessTripReasonType} onValueChange={(val) => setBusinessTripReasonType(val as BusinessTripReasonType)}>
                      <SelectTrigger className="w-full h-10 border-slate-200">
                        <SelectValue placeholder="-- Chọn lý do --">{businessTripReasonType ? BUSINESS_TRIP_REASON_LABELS[businessTripReasonType as BusinessTripReasonType] : undefined}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(BUSINESS_TRIP_REASON_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {type === "WFH" && (
                  <div className="hidden sm:block"></div>
                )}
                {(type === "LEAVE" || type === "ABSENCE" || type === "BUSINESS_TRIP" || type === "WFH") && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-[13px] font-semibold text-slate-700">Tính công</Label>
                    <div className="w-full flex items-center h-10 bg-indigo-50/50 border-indigo-200 border rounded-md px-4 text-sm font-semibold text-indigo-700 shadow-sm">
                      {type === "LEAVE" ? (leaveReasonType ? countedWorkLabel(LEAVE_COUNTED_WORK[leaveReasonType as LeaveReasonType]) : "—")
                      : type === "ABSENCE" ? (absenceReasonType ? countedWorkLabel(ABSENCE_COUNTED_WORK[absenceReasonType as AbsenceReasonType]) : "—")
                      : type === "BUSINESS_TRIP" ? "Có tính công"
                      : type === "WFH" ? "Có tính công" : "—"}
                    </div>
                  </div>
                )}
              </div>

              {type === "LEAVE" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-slate-700">Từ ngày <span className="text-rose-500">*</span></Label>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger className={cn("flex-2 flex items-center justify-start text-left font-normal h-10 border rounded-md px-3 text-sm", !date1 && "text-slate-400")}>
                          <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                          {date1 ? format(date1, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={date1} onSelect={setDate1} initialFocus locale={vi} />
                        </PopoverContent>
                      </Popover>
                      <Select value={startSession} onValueChange={(val) => setStartSession(val as LeaveSessionType)}>
                        <SelectTrigger className="flex-1 h-10 border-slate-200"><SelectValue placeholder="Ca nghỉ">{startSession === "FULL_DAY" ? "Cả ngày" : startSession === "MORNING" ? "Ca sáng" : startSession === "AFTERNOON" ? "Ca chiều" : undefined}</SelectValue></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FULL_DAY">Cả ngày</SelectItem>
                          <SelectItem value="MORNING">Ca sáng</SelectItem>
                          <SelectItem value="AFTERNOON">Ca chiều</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-slate-700">Đến ngày <span className="text-rose-500">*</span></Label>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger className={cn("flex-2 flex items-center justify-start text-left font-normal h-10 border rounded-md px-3 text-sm", !date2 && "text-slate-400")}>
                          <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                          {date2 ? format(date2, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={date2} onSelect={setDate2} initialFocus locale={vi} />
                        </PopoverContent>
                      </Popover>
                      <Select value={endSession} onValueChange={(val) => setEndSession(val as LeaveSessionType)}>
                        <SelectTrigger className="flex-1 h-10 border-slate-200"><SelectValue placeholder="Ca nghỉ">{endSession === "FULL_DAY" ? "Cả ngày" : endSession === "MORNING" ? "Ca sáng" : endSession === "AFTERNOON" ? "Ca chiều" : undefined}</SelectValue></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FULL_DAY">Cả ngày</SelectItem>
                          <SelectItem value="MORNING">Ca sáng</SelectItem>
                          <SelectItem value="AFTERNOON">Ca chiều</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {type === "ABSENCE" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-[13px] font-semibold text-slate-700">Ngày vắng mặt <span className="text-rose-500">*</span></Label>
                    <Popover>
                      <PopoverTrigger className={cn("w-full flex items-center justify-start text-left font-normal h-10 border rounded-md px-4 text-sm", !date1 && "text-slate-400")}>
                        <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                        {date1 ? format(date1, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date1} onSelect={setDate1} initialFocus locale={vi} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-slate-700">Thời gian vắng từ <span className="text-rose-500">*</span></Label>
                    <TimeSelect value={time1} onChange={setTime1} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-slate-700">Thời gian vắng đến <span className="text-rose-500">*</span></Label>
                    <TimeSelect value={time2} onChange={setTime2} />
                  </div>
                </div>
              )}

              {type === "ATTENDANCE_ADJUSTMENT" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-[13px] font-semibold text-slate-700">Ngày điều chỉnh <span className="text-rose-500">*</span></Label>
                    <Popover>
                      <PopoverTrigger className={cn("w-full flex items-center justify-start text-left font-normal h-10 border rounded-md px-4 text-sm", !date1 && "text-slate-400")}>
                        <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                        {date1 ? format(date1, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date1} onSelect={setDate1} initialFocus locale={vi} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-slate-700">Loại Check-in / Check-out <span className="text-rose-500">*</span></Label>
                    <Select value={timeType} onValueChange={(val) => setTimeType(val as AttendanceAdjustmentTimeType)}>
                      <SelectTrigger className="w-full h-10 border-slate-200">
                        <SelectValue placeholder="-- Chọn loại --">{timeType === "CHECK_IN" ? "Check-in" : timeType === "CHECK_OUT" ? "Check-out" : undefined}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CHECK_IN">Check-in</SelectItem>
                        <SelectItem value="CHECK_OUT">Check-out</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-slate-700">Giờ đề nghị <span className="text-rose-500">*</span></Label>
                    <TimeSelect value={time1} onChange={setTime1} />
                  </div>
                </div>
              )}

              {type === "BUSINESS_TRIP" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-slate-700">Từ ngày <span className="text-rose-500">*</span></Label>
                    <Popover>
                      <PopoverTrigger className={cn("w-full flex items-center justify-start text-left font-normal h-10 border rounded-md px-4 text-sm", !date1 && "text-slate-400")}>
                        <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                        {date1 ? format(date1, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date1} onSelect={setDate1} initialFocus locale={vi} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-slate-700">Đến ngày <span className="text-rose-500">*</span></Label>
                    <Popover>
                      <PopoverTrigger className={cn("w-full flex items-center justify-start text-left font-normal h-10 border rounded-md px-4 text-sm", !date2 && "text-slate-400")}>
                        <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                        {date2 ? format(date2, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date2} onSelect={setDate2} initialFocus locale={vi} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-slate-700">Hình thức công tác <span className="text-rose-500">*</span></Label>
                    <Input className="h-10 text-sm border-slate-200" placeholder="Máy bay, tàu hỏa..." value={tripMode} onChange={(e) => setTripMode(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-slate-700">Địa điểm</Label>
                    <Input className="h-10 text-sm border-slate-200" placeholder="Tên địa điểm..." value={location} onChange={(e) => setLocation(e.target.value)} />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-[13px] font-semibold text-slate-700">Địa chỉ</Label>
                    <Input className="h-10 text-sm border-slate-200" placeholder="Địa chỉ chi tiết..." value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                </div>
              )}

              {type === "WFH" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-slate-700">Từ ngày <span className="text-rose-500">*</span></Label>
                    <Popover>
                      <PopoverTrigger className={cn("w-full flex items-center justify-start text-left font-normal h-10 border rounded-md px-4 text-sm", !date1 && "text-slate-400")}>
                        <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                        {date1 ? format(date1, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date1} onSelect={setDate1} initialFocus locale={vi} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[13px] font-semibold text-slate-700">Đến ngày <span className="text-rose-500">*</span></Label>
                    <Popover>
                      <PopoverTrigger className={cn("w-full flex items-center justify-start text-left font-normal h-10 border rounded-md px-4 text-sm", !date2 && "text-slate-400")}>
                        <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                        {date2 ? format(date2, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date2} onSelect={setDate2} initialFocus locale={vi} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}

              <div className="space-y-1.5 mt-2">
                <Label className="text-[13px] font-semibold text-slate-700 flex items-center justify-between">
                  <span>Mô tả {type === "WFH" ? <span className="text-rose-500">*</span> : "(Tùy chọn)"}</span>
                </Label>
                <RichTextEditor 
                  value={description} 
                  onChange={setDescription} 
                  placeholder={type === "WFH" ? "Nhập mô tả bắt buộc..." : "Nhập mô tả bổ sung (tối đa 1000 ký tự)..."} 
                />
              </div>

            </div>

            <div className="p-5 px-6 md:px-8 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <Button
                variant="outline"
                onClick={() => navigate("/app/requests")}
                className="h-11 px-6 font-medium text-slate-600 bg-white shadow-sm hover:bg-slate-50 border-slate-200"
              >
                Hủy
              </Button>
              <Button
                onClick={onSubmit}
                disabled={createMutation.isPending}
                className="h-11 font-medium bg-[#2E3192] hover:bg-[#1E2062] text-white shadow-sm border-none gap-2 px-8"
              >
                {createMutation.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                "Tạo yêu cầu"
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
