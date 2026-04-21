import { useState, useRef, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestFormMeService } from "@/services/requestform/me";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { TimeSelect } from "@/components/ui/time-select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  Umbrella,
  User,
  CheckCircle2,
  Truck,
  UserMinus,
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
import { useAuthStore } from "@/store/useAuthStore";

type RequestType =
  | "leave"
  | "absent"
  | "checkInOut"
  | "business"
  | "resign"
  | "wfh";

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
    description:
      "Đơn xin nghỉ phát sinh khi bạn muốn nghỉ nhiều ngày làm việc.",
    icon: Umbrella,
    color: "text-indigo-500",
    bg: "bg-indigo-50 ring-1 ring-indigo-100",
  },
  {
    id: "wfh",
    label: "Đơn WFH",
    description:
      "Đơn WFH phát sinh khi bạn được công ty cho phép làm việc tại nhà.",
    icon: Home,
    color: "text-purple-500",
    bg: "bg-purple-50 ring-1 ring-purple-100",
  },
  {
    id: "checkInOut",
    label: "Đơn checkin/out",
    description:
      "Đơn checkin/out phát sinh khi bạn quên chấm công lúc đến hoặc lúc về.",
    icon: CheckCircle2,
    color: "text-rose-500",
    bg: "bg-rose-50 ring-1 ring-rose-100",
  },
  {
    id: "absent",
    label: "Đơn vắng mặt",
    description:
      "Đơn vắng mặt phát sinh khi bạn có nhu cầu vắng mặt 1 khoảng thời gian trong ca làm việc. Đơn làm bằng chứng vắng mặt, phải về công ty checkout mới được công nhận.",
    icon: User,
    color: "text-cyan-500",
    bg: "bg-cyan-50 ring-1 ring-cyan-100",
  },
  {
    id: "business",
    label: "Đơn công tác",
    description:
      "Đơn công tác phát sinh khi bạn được yêu cầu đi công tác và không thể chấm công trên công ty.",
    icon: Truck,
    color: "text-lime-600",
    bg: "bg-lime-50 ring-1 ring-lime-100",
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




import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { RequestFormResponse } from "@/types/requestform/RequestFormResponse";
import { useEffect } from "react";

interface RequestFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: RequestFormResponse | null;
}

export default function RequestFormModal({ isOpen, onOpenChange, initialData }: RequestFormModalProps) {
  const [type, setType] = useState<RequestType | "">("");
  const { session } = useAuthStore();
  const [description, setDescription] = useState("");


  const [date, setDate] = useState<Date>();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const [startTime, setStartTime] = useState("");
  const [checkInOutType, setCheckInOutType] = useState<"checkin" | "checkout" | "">("");
  const [endTime, setEndTime] = useState("");

  const [startSession, setStartSession] = useState<"morning" | "afternoon" | "all">("all");
  const [endSession, setEndSession] = useState<"morning" | "afternoon" | "all">("all");

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (initialData) {
        const typeMap: Record<string, RequestType> = {
          "LEAVE": "leave",
          "WFH": "wfh",
          "ABSENCE": "absent",
          "BUSINESS_TRIP": "business",
          "RESIGNATION": "resign",
          "ATTENDANCE_ADJUSTMENT": "checkInOut",
        };
        setType(typeMap[initialData.type] || "");
        setDescription(initialData.description || "");
        
        if (initialData.startDate) setStartDate(new Date(initialData.startDate));
        if (initialData.endDate) setEndDate(new Date(initialData.endDate));
        if (initialData.absenceDate) { setDate(new Date(initialData.absenceDate)); setStartTime(initialData.fromTime || ""); setEndTime(initialData.toTime || ""); }
        if (initialData.attendanceDate) { setDate(new Date(initialData.attendanceDate)); setStartTime(initialData.requestedTime || ""); setCheckInOutType(initialData.timeType === "CHECK_IN" ? "checkin" : "checkout"); }
        if (initialData.submissionDate) { setDate(new Date(initialData.submissionDate)); setEndDate(new Date(initialData.lastWorkingDate!)); }
        
        if (initialData.startSession) setStartSession(initialData.startSession === "FULL_DAY" ? "all" : initialData.startSession.toLowerCase() as "morning" | "afternoon");
        if (initialData.endSession) setEndSession(initialData.endSession === "FULL_DAY" ? "all" : initialData.endSession.toLowerCase() as "morning" | "afternoon");
      } else {
        setType("");
        setDescription("");
        setDate(undefined);
        setStartDate(undefined);
        setEndDate(undefined);
        setStartTime("");
        setEndTime("");
        setCheckInOutType("");
        setStartSession("all");
        setEndSession("all");
      }
      }, 0);
    }
  }, [isOpen, initialData]);

  const calculatedDays = useMemo(() => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return 0;

    let totalDays = diffTime / (1000 * 3600 * 24) + 1;
    if (startSession === "afternoon") totalDays -= 0.5;
    if (endSession === "morning") totalDays -= 0.5;

    return Math.max(0, totalDays);
  }, [startDate, endDate, startSession, endSession]);

  const formRef = useRef<HTMLDivElement>(null);

  const handleTypeChange = (val: string | null) => {
    const isFirstTimeSelection = type === "";

    setType((val as RequestType) || "");

    // Automatically scroll down to the form only if no option was previously selected
    if (isFirstTimeSelection && val) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 150);
    }
  };

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async () => {
      const isEdit = !!initialData;
      switch (type) {
        case "checkInOut": {
          const checkInOutPayload = {
            timeType: checkInOutType === "checkin" ? "CHECK_IN" : "CHECK_OUT" as "CHECK_IN" | "CHECK_OUT",
            attendanceDate: format(date!, "yyyy-MM-dd"),
            requestedTime: startTime,
            description: description,
          };
          return isEdit ? requestFormMeService.updateCurrentUserAttendanceAdjustmentForm(initialData.id, checkInOutPayload) : requestFormMeService.createCurrentUserAttendanceAdjustmentForm(checkInOutPayload);
        }
        case "absent": {
          const absentPayload = {
            absenceDate: format(date!, "yyyy-MM-dd"),
            fromTime: startTime,
            toTime: endTime,
            description: description,
          };
          return isEdit ? requestFormMeService.updateCurrentUserAbsenceForm(initialData.id, absentPayload) : requestFormMeService.createCurrentUserAbsenceForm(absentPayload);
        }
        case "resign": {
          const resignPayload = {
            submissionDate: format(date!, "yyyy-MM-dd"),
            lastWorkingDate: format(endDate!, "yyyy-MM-dd"),
            description: description,
          };
          return isEdit ? requestFormMeService.updateCurrentUserResignationForm(initialData.id, resignPayload) : requestFormMeService.createCurrentUserResignationForm(resignPayload);
        }
        case "leave": {
          const leavePayload = {
            startDate: format(startDate!, "yyyy-MM-dd"),
            startSession: (startSession === "all" ? "FULL_DAY" : startSession.toUpperCase()) as "MORNING" | "AFTERNOON" | "FULL_DAY",
            endDate: format(endDate!, "yyyy-MM-dd"),
            endSession: (endSession === "all" ? "FULL_DAY" : endSession.toUpperCase()) as "MORNING" | "AFTERNOON" | "FULL_DAY",
            description: description,
          };
          return isEdit ? requestFormMeService.updateCurrentUserLeaveForm(initialData.id, leavePayload) : requestFormMeService.createCurrentUserLeaveForm(leavePayload);
        }
        case "wfh": {
          const wfhPayload = {
            startDate: format(startDate!, "yyyy-MM-dd"),
            endDate: format(endDate!, "yyyy-MM-dd"),
            description: description,
          };
          return isEdit ? requestFormMeService.updateCurrentUserWfhForm(initialData.id, wfhPayload) : requestFormMeService.createCurrentUserWfhForm(wfhPayload);
        }
        case "business": {
          const businessPayload = {
            startDate: format(startDate!, "yyyy-MM-dd"),
            endDate: format(endDate!, "yyyy-MM-dd"),
            description: description,
          };
          return isEdit ? requestFormMeService.updateCurrentUserBusinessTripForm(initialData.id, businessPayload) : requestFormMeService.createCurrentUserBusinessTripForm(businessPayload);
        }
        default:
          throw new Error("Invalid request type");
      }
    },
    onSuccess: () => {
      toast.success(initialData ? "Đã cập nhật đơn thành công!" : "Đã tạo đơn thành công!");
      queryClient.invalidateQueries({ queryKey: ["my-request-forms"] });
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Có lỗi xảy ra khi tạo đơn."));
    },
  });

  const onSubmit = () => {
    if (!description || description.trim() === "" || description === "<p><br></p>") {
      toast.error("Vui lòng nhập mô tả đơn.");
      return;
    }

    let isValid = true;
    switch (type) {
      case "checkInOut":
        if (!checkInOutType || !date || !startTime) isValid = false;
        break;
      case "absent":
        if (!date || !startTime || !endTime) isValid = false;
        break;
      case "resign":
        if (!date || !endDate) isValid = false; // endDate is Ngày làm cuối
        break;
      case "leave":
      case "wfh":
      case "business":
        if (!startDate || !endDate) isValid = false;
        break;
    }

    if (!isValid) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }

    createMutation.mutate();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl lg:max-w-4xl overflow-y-auto p-4 md:p-6 bg-slate-50 border-none rounded-l-3xl shadow-2xl">
        <div className="w-full space-y-6">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-2xl font-bold tracking-tight text-slate-900 flex items-center justify-between">
              {initialData ? "Chỉnh sửa đơn từ" : "Tạo đơn mới"}
            </SheetTitle>
            <p className="text-sm text-slate-500 mt-1">
              Điền đầy đủ các thông tin cần thiết để {initialData ? "cập nhật" : "nộp"} đơn từ.
            </p>
          </SheetHeader>

        {/* Section 1: Types */}
        {!initialData && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 md:p-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-[14px] font-semibold text-slate-800 flex items-center">
                  1. Chọn loại đơn <span className="text-rose-500 ml-1">*</span>
                </Label>
                <p className="text-[12.5px] text-slate-500">
                  Bấm vào để chọn loại đơn cần tạo
                </p>
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
                      <div
                        className={cn(
                          "p-2.5 rounded-full shrink-0 flex items-center justify-center",
                          card.bg,
                        )}
                      >
                        <Icon
                          className={cn("w-6 h-6", card.color)}
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 pr-6 items-start">
                        <span className="text-[14px] md:text-[15px] font-semibold text-slate-800 tracking-tight">
                          {card.label}
                        </span>
                        <span className="text-[12.5px] text-slate-500 leading-snug">
                          {card.description}
                        </span>
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
        )}

        {/* Section 2: Form Fields */}
        {type !== "" && (
          <div
            ref={formRef}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="p-5 md:p-6 flex flex-col gap-5 border-b border-slate-100">
              <h3 className="text-[15px] font-semibold text-slate-800 border-b border-slate-100 pb-3">
                2. Chi tiết yêu cầu
              </h3>

              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-1.5">
                  <Label className="text-[13px] font-semibold text-slate-700">
                    Loại đơn đăng ký
                  </Label>
                  <div className="w-full flex items-center justify-start text-left h-10 bg-slate-100/80 border-slate-200 border rounded-md px-4 text-sm text-slate-700 cursor-not-allowed font-medium">
                    {typeLabels[type as RequestType]}
                  </div>
                </div>
              </div>

              {type === "checkInOut" ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="col-span-1 border-b pb-4 sm:border-0 sm:pb-0 sm:col-span-3 space-y-1.5">
                      {checkInOutType === "checkin" && (
                        <div className="p-3 bg-indigo-50 border border-indigo-100/50 rounded-lg text-[13px] text-indigo-700 leading-relaxed shadow-sm">
                          <span className="font-semibold block mb-1">ℹ️ Lưu ý quan trọng:</span>
                          Đơn này chỉ đề nghị sửa <strong>giờ vào ca</strong>. Sau khi duyệt, hệ thống sẽ tính lại công của ngày này. Nếu dữ liệu máy chấm công được đồng bộ lại sau đó, kết quả cuối cùng có thể tiếp tục thay đổi theo dữ liệu mới.
                        </div>
                      )}
                      {checkInOutType === "checkout" && (
                        <div className="p-3 bg-indigo-50 border border-indigo-100/50 rounded-lg text-[13px] text-indigo-700 leading-relaxed shadow-sm">
                          <span className="font-semibold block mb-1">ℹ️ Lưu ý quan trọng:</span>
                          Đơn này chỉ đề nghị sửa <strong>giờ ra ca</strong>. Sau khi duyệt, hệ thống sẽ tính lại công của ngày này. Nếu dữ liệu máy chấm công được đồng bộ lại sau đó, kết quả cuối cùng có thể tiếp tục thay đổi theo dữ liệu mới.
                        </div>
                      )}
                      {!checkInOutType && (
                        <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-lg text-[13px] text-slate-500 leading-relaxed shadow-sm">
                          Vui lòng chọn loại thời gian để xem các lưu ý tương ứng về đơn điều chỉnh chấm công.
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-semibold text-slate-700">
                        Loại thời gian <span className="text-rose-500">*</span>
                      </Label>
                      <Select
                        value={checkInOutType}
                        onValueChange={(val) =>
                          setCheckInOutType(val as "checkin" | "checkout" | "")
                        }
                      >
                        <SelectTrigger className="w-full text-[14px] bg-slate-50/50 h-10 border-slate-200 focus:ring-indigo-500/20">
                          <span
                            className={
                              checkInOutType === "" ? "text-slate-500" : ""
                            }
                          >
                            {checkInOutType === ""
                              ? "-- Chọn --"
                              : checkInOutType === "checkin"
                                ? "Check-in"
                                : "Check-out"}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checkin">Check-in</SelectItem>
                          <SelectItem value="checkout">Check-out</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-semibold text-slate-700">
                        Ngày <span className="text-rose-500">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger
                          className={cn(
                            "w-full flex items-center justify-start text-left font-normal h-10 bg-slate-50/50 border-slate-200 border rounded-md px-4 text-sm hover:bg-slate-100/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20",
                            !date && "text-slate-400",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                          {date ? (
                            format(date, "dd/MM/yyyy")
                          ) : (
                            <span>Chọn ngày</span>
                          )}
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
                      <Label className="text-[13px] font-semibold text-slate-700">
                        Giờ <span className="text-rose-500">*</span>
                      </Label>
                      <TimeSelect value={startTime} onChange={setStartTime} />
                    </div>
                  </div>
                </>
              ) : type === "absent" ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="col-span-1 sm:col-span-3">
                      <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-lg text-[13px] text-slate-600 leading-relaxed shadow-sm">
                        <span className="font-semibold block mb-1">ℹ️ Lưu ý:</span>
                        Đơn vắng mặt <strong>không tính công</strong>. Đơn này chỉ xác nhận khoảng thời gian vắng mặt có phép.
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-semibold text-slate-700">
                        Ngày vắng mặt <span className="text-rose-500">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger
                          className={cn(
                            "w-full flex items-center justify-start text-left font-normal h-10 bg-slate-50/50 border-slate-200 border rounded-md px-4 text-sm hover:bg-slate-100/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20",
                            !date && "text-slate-400",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                          {date ? (
                            format(date, "dd/MM/yyyy")
                          ) : (
                            <span>Chọn ngày</span>
                          )}
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
                      <Label className="text-[13px] font-semibold text-slate-700">
                        Vắng mặt từ <span className="text-rose-500">*</span>
                      </Label>
                      <TimeSelect value={startTime} onChange={setStartTime} />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-semibold text-slate-700">
                        Vắng mặt đến <span className="text-rose-500">*</span>
                      </Label>
                      <TimeSelect value={endTime} onChange={setEndTime} />
                    </div>
                  </div>
                </>
              ) : type === "resign" ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="col-span-1 sm:col-span-3">
                      <div className="p-3 bg-rose-50 border border-rose-100/50 rounded-lg text-[13px] text-rose-700 leading-relaxed shadow-sm">
                        <span className="font-semibold block mb-1">ℹ️ Lưu ý quan trọng:</span>
                        Nhân sự làm việc đến hết <strong>Ngày làm việc cuối</strong>. Sau ngày này, dữ liệu attendance sẽ bị khóa và ngừng xử lý theo quy định thôi việc.
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-semibold text-slate-700">
                        Ngày nộp đơn <span className="text-rose-500">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger
                          className={cn(
                            "w-full flex items-center justify-start text-left font-normal h-10 bg-slate-50/50 border-slate-200 border rounded-md px-4 text-sm hover:bg-slate-100/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20",
                            !date && "text-slate-400",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                          {date ? (
                            format(date, "dd/MM/yyyy")
                          ) : (
                            <span>Chọn ngày</span>
                          )}
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
                      <Label className="text-[13px] font-semibold text-slate-700">
                        Ngày làm việc cuối <span className="text-rose-500">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger
                          className={cn(
                            "w-full flex items-center justify-start text-left font-normal h-10 bg-slate-50/50 border-slate-200 border rounded-md px-4 text-sm hover:bg-slate-100/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20",
                            !endDate && "text-slate-400",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                          {endDate ? (
                            format(endDate, "dd/MM/yyyy")
                          ) : (
                            <span>Chọn ngày</span>
                          )}
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={(newDate) => {
                              setEndDate(newDate);
                              if (newDate) {
                                const prev = new Date(newDate);
                                prev.setDate(prev.getDate() - 1);
                                setStartDate(prev); // Derived ngày thôi việc = ngày làm cuối - 1
                              } else {
                                setStartDate(undefined);
                              }
                            }}
                            initialFocus
                            locale={vi}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-semibold text-slate-700">
                        Ngày thôi việc{" "}
                        <span className="text-rose-500">*</span>
                      </Label>
                      <div className="w-full flex items-center justify-start text-left font-normal h-10 bg-slate-100 border-slate-200 border rounded-md px-4 text-sm text-slate-700 cursor-not-allowed">
                        <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                        {startDate ? (
                          format(startDate, "dd/MM/yyyy")
                        ) : (
                          <span className="text-slate-400">Tính tự động</span>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : type === "leave" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 flex flex-col">
                      <Label className="text-[13px] font-semibold text-slate-700">
                        Ngày bắt đầu nghỉ{" "}
                        <span className="text-rose-500">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Popover>
                          <PopoverTrigger
                            className={cn(
                              "flex-1 flex items-center justify-start text-left font-normal h-10 bg-slate-50/50 border-slate-200 border rounded-md px-4 text-sm hover:bg-slate-100/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20",
                              !startDate && "text-slate-400",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                            {startDate ? (
                              format(startDate, "dd/MM/yyyy")
                            ) : (
                              <span>Chọn ngày</span>
                            )}
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

                        <Select
                          value={startSession}
                          onValueChange={(
                            val: "morning" | "afternoon" | "all" | null,
                          ) => val && setStartSession(val)}
                        >
                          <SelectTrigger className="flex-1 w-full text-[13px] h-10 bg-slate-50/50 border-slate-200 focus:ring-indigo-500/20">
                            <span className="truncate">
                              {startSession === "all"
                                ? "Cả ngày"
                                : startSession === "morning"
                                  ? "Ca sáng"
                                  : "Ca chiều"}
                            </span>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Cả ngày</SelectItem>
                            <SelectItem value="morning">
                              Ca sáng (8h-12h)
                            </SelectItem>
                            <SelectItem value="afternoon">
                              Ca chiều (13h30-17h30)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5 flex flex-col">
                      <Label className="text-[13px] font-semibold text-slate-700">
                        Ngày kết thúc nghỉ{" "}
                        <span className="text-rose-500">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Popover>
                          <PopoverTrigger
                            className={cn(
                              "flex-1 flex items-center justify-start text-left font-normal h-10 bg-slate-50/50 border-slate-200 border rounded-md px-4 text-sm hover:bg-slate-100/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20",
                              !endDate && "text-slate-400",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                            {endDate ? (
                              format(endDate, "dd/MM/yyyy")
                            ) : (
                              <span>Chọn ngày</span>
                            )}
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

                        <Select
                          value={endSession}
                          onValueChange={(
                            val: "morning" | "afternoon" | "all" | null,
                          ) => val && setEndSession(val)}
                        >
                          <SelectTrigger className="flex-1 w-full text-[13px] h-10 bg-slate-50/50 border-slate-200 focus:ring-indigo-500/20">
                            <span className="truncate">
                              {endSession === "all"
                                ? "Cả ngày"
                                : endSession === "morning"
                                  ? "Ca sáng"
                                  : "Ca chiều"}
                            </span>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Cả ngày</SelectItem>
                            <SelectItem value="morning">
                              Ca sáng (8h-12h)
                            </SelectItem>
                            <SelectItem value="afternoon">
                              Ca chiều (13h30-17h30)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {calculatedDays > 0 ? (
                    <div className="flex flex-col gap-2">
                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700 flex flex-col justify-center items-center gap-1">
                            <span className="font-medium text-[12px] text-slate-500 uppercase tracking-tight">
                              Số phép còn lại
                            </span>
                            <span className="text-base font-bold text-slate-800">
                              {session?.remainingLeaveDays || 0} ngày
                            </span>
                          </div>
                          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-md text-sm text-indigo-700 flex flex-col justify-center items-center gap-1">
                            <span className="font-medium text-[12px] text-indigo-600/70 uppercase tracking-tight">
                              Nghỉ dự kiến
                            </span>
                            <span className="text-base font-bold">
                              {calculatedDays} ngày
                            </span>
                          </div>
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-sm flex flex-col justify-center items-center gap-1">
                            <span className="font-medium text-[12px] text-slate-500 uppercase tracking-tight">
                              Sau khi duyệt còn
                            </span>
                            <span className={cn("text-base font-bold", 
                              ((session?.remainingLeaveDays || 0) - calculatedDays) < 0 ? "text-rose-600" : "text-emerald-600"
                            )}>
                              {((session?.remainingLeaveDays || 0) - calculatedDays)} ngày
                            </span>
                          </div>
                       </div>
                       {((session?.remainingLeaveDays || 0) - calculatedDays) < 0 && (
                          <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-md text-sm flex items-start gap-2">
                            <div className="mt-0.5">⚠️</div>
                            <span className="font-medium">
                              Cảnh báo: Bạn đang yêu cầu số ngày nghỉ nhiều hơn số phép còn lại của bạn. Quản lý có thể sẽ từ chối đơn này trừ khi có lý do đặc biệt.
                            </span>
                          </div>
                       )}
                    </div>
                  ) : startDate && endDate ? (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-md text-sm text-rose-600 flex items-center justify-between">
                      <span className="font-medium">
                        Khoảng thời gian không hợp lệ
                      </span>
                      <span className="text-base font-bold">0 ngày</span>
                    </div>
                  ) : null}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-semibold text-slate-700">
                        Ngày bắt đầu <span className="text-rose-500">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger
                          className={cn(
                            "w-full flex items-center justify-start text-left font-normal h-10 bg-slate-50/50 border-slate-200 border rounded-md px-4 text-sm hover:bg-slate-100/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20",
                            !startDate && "text-slate-400",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                          {startDate ? (
                            format(startDate, "dd/MM/yyyy")
                          ) : (
                            <span>Chọn ngày</span>
                          )}
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
                      <Label className="text-[13px] font-semibold text-slate-700">
                        Ngày kết thúc <span className="text-rose-500">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger
                          className={cn(
                            "w-full flex items-center justify-start text-left font-normal h-10 bg-slate-50/50 border-slate-200 border rounded-md px-4 text-sm hover:bg-slate-100/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20",
                            !endDate && "text-slate-400",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                          {endDate ? (
                            format(endDate, "dd/MM/yyyy")
                          ) : (
                            <span>Chọn ngày</span>
                          )}
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
                  {calculatedDays > 0 ? (
                    <div className="mt-4 flex flex-col gap-2">
                       <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-md text-[13px] text-indigo-700 flex flex-col justify-center gap-1">
                          <span className="font-semibold">
                            {type === "wfh" ? "Số ngày WFH dự kiến" : "Số ngày công tác dự kiến"}: {calculatedDays} ngày
                          </span>
                          <span className="text-[12px] opacity-90 italic">
                            {type === "wfh" ? "Đơn WFH được tính công khi đơn được duyệt." : "Đơn công tác được tính công khi đơn được duyệt."}
                          </span>
                       </div>
                    </div>
                  ) : startDate && endDate ? (
                    <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-md text-sm text-rose-600 flex items-center justify-between">
                      <span className="font-medium">
                        Khoảng thời gian không hợp lệ
                      </span>
                      <span className="text-base font-bold">0 ngày</span>
                    </div>
                  ) : null}
                </>
              )}

              <div className="space-y-1.5">
                <Label className="text-[13px] font-semibold text-slate-700 flex items-center justify-between">
                  <span>Mô tả <span className="text-rose-500">*</span></span>
                </Label>
                <RichTextEditor 
                  value={description} 
                  onChange={setDescription} 
                  placeholder="Nhập mô tả chi tiết (bắt buộc)..." 
                />
              </div>

            </div>

            <div className="p-5 px-6 md:px-8 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
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
                {initialData ? "Lưu thay đổi" : "Tạo yêu cầu"}
              </Button>
            </div>
          </div>
        )}
      </div>
      </SheetContent>
    </Sheet>
  );
}
