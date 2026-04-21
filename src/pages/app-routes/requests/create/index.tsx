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
  ChevronLeft,
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

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { useNavigate } from "react-router-dom";
import { RichTextEditor } from "@/components/custom/RichTextEditor";
import { getErrorMessage } from "@/lib/utils";

type RequestType =
  | "leave"
  | "absent"
  | "checkInOut"
  | "business"
  | "resign"
  | "wfh";

const typeLabels: Record<RequestType, string> = {
  leave: "Đơn xin nghỉ phép",
  absent: "Đơn vắng mặt",
  checkInOut: "Đơn checkin/out",
  business: "Đơn công tác",
  resign: "Đơn thôi việc",
  wfh: "Đơn WFH",
};

const requestCards = [
  {
    id: "leave",
    label: "Đơn xin nghỉ phép",
    description:
      "Sử dụng để xin nghỉ phép, nghỉ ốm hoặc công việc cá nhân. Thời gian nghỉ sẽ được đối trừ trực tiếp vào quỹ phép hiện tại của bạn.",
    icon: Umbrella,
    color: "text-indigo-500",
    bg: "bg-indigo-50 ring-1 ring-indigo-100",
    isPaid: true,
  },
  {
    id: "wfh",
    label: "Đơn WFH",
    description:
      "Đăng ký hình thức làm việc từ xa. Phù hợp khi bạn không có mặt tại văn phòng nhưng vẫn đảm bảo được hiệu suất và công việc trong ngày.",
    icon: Home,
    color: "text-purple-500",
    bg: "bg-purple-50 ring-1 ring-purple-100",
    isPaid: true,
  },
  {
    id: "checkInOut",
    label: "Đơn checkin/out",
    description:
      "Điều chỉnh bổ sung dữ liệu chấm công khi bạn quên quẹt thẻ, hệ thống lỗi, hoặc có lịch trình đột xuất không thể check-in/out đúng giờ.",
    icon: CheckCircle2,
    color: "text-rose-500",
    bg: "bg-rose-50 ring-1 ring-rose-100",
    isPaid: true,
  },
  {
    id: "absent",
    label: "Đơn vắng mặt",
    description:
      "Đăng ký vắng mặt tạm thời trong ca làm (ra ngoài gặp khách, sự vụ cá nhân). Khung giờ này vẫn sẽ được tính là khung giờ làm việc hợp lệ.",
    icon: User,
    color: "text-cyan-500",
    bg: "bg-cyan-50 ring-1 ring-cyan-100",
    isPaid: true,
  },
  {
    id: "business",
    label: "Đơn công tác",
    description:
      "Cập nhật hình thức đi công tác. Toàn bộ thời gian xử lý công việc ngoài văn phòng sẽ được hệ thống tính công đầy đủ.",
    icon: Truck,
    color: "text-lime-600",
    bg: "bg-lime-50 ring-1 ring-lime-100",
    isPaid: true,
  },
  {
    id: "resign",
    label: "Đơn thôi việc",
    description: "Đề xuất xin nghỉ việc chính thức. Phân vùng chấm công và xử lý lương sẽ được đóng sau 'Ngày làm việc cuối' của bạn.",
    icon: UserMinus,
    color: "text-red-500",
    bg: "bg-red-50 ring-1 ring-red-100",
    isPaid: false,
  },
] as const;




export default function CreateRequestPage() {
  const navigate = useNavigate();
  const [type, setType] = useState<RequestType | "">("");
  const [description, setDescription] = useState("");


  const [date, setDate] = useState<Date>();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const [startTime, setStartTime] = useState("");
  const [checkInOutType, setCheckInOutType] = useState<
    "checkin" | "checkout" | ""
  >("");
  const [endTime, setEndTime] = useState("");

  const [startSession, setStartSession] = useState<
    "morning" | "afternoon" | "all"
  >("all");
  const [endSession, setEndSession] = useState<"morning" | "afternoon" | "all">(
    "all",
  );

  const [reasonType, setReasonType] = useState<"PERSONAL" | "COMPANY" | "">("");

  const durationPreview = useMemo(() => {
    if (!startTime || !endTime) return 0;
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    return Math.max(0, endMinutes - startMinutes);
  }, [startTime, endTime]);

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
      switch (type) {
        case "checkInOut":
          return requestFormMeService.createCurrentUserAttendanceAdjustmentForm({
            timeType: checkInOutType === "checkin" ? "CHECK_IN" : "CHECK_OUT",
            attendanceDate: format(date!, "yyyy-MM-dd"),
            requestedTime: startTime,
            description: description,
          });
        case "absent":
          return requestFormMeService.createCurrentUserAbsenceForm({
            absenceDate: format(date!, "yyyy-MM-dd"),
            fromTime: startTime,
            toTime: endTime,
            reasonType: reasonType as "PERSONAL" | "COMPANY",
            description: description,
          });
        case "resign":
          return requestFormMeService.createCurrentUserResignationForm({
            submissionDate: format(date!, "yyyy-MM-dd"),
            lastWorkingDate: format(endDate!, "yyyy-MM-dd"),
            description: description,
          });
        case "leave":
          return requestFormMeService.createCurrentUserLeaveForm({
            startDate: format(startDate!, "yyyy-MM-dd"),
            startSession: (startSession === "all" ? "FULL_DAY" : startSession.toUpperCase()) as "MORNING" | "AFTERNOON" | "FULL_DAY",
            endDate: format(endDate!, "yyyy-MM-dd"),
            endSession: (endSession === "all" ? "FULL_DAY" : endSession.toUpperCase()) as "MORNING" | "AFTERNOON" | "FULL_DAY",
            description: description,
          });
        case "wfh":
          return requestFormMeService.createCurrentUserWfhForm({
            startDate: format(startDate!, "yyyy-MM-dd"),
            endDate: format(endDate!, "yyyy-MM-dd"),
            description: description,
          });
        case "business":
          return requestFormMeService.createCurrentUserBusinessTripForm({
            startDate: format(startDate!, "yyyy-MM-dd"),
            endDate: format(endDate!, "yyyy-MM-dd"),
            description: description,
          });
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
        if (!date || !startTime || !endTime || !reasonType) isValid = false;
        if (startTime && endTime && startTime >= endTime) {
           toast.error("Giờ kết thúc vắng mặt phải lớn hơn giờ bắt đầu.");
           return;
        }
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[14px] md:text-[15px] font-semibold text-slate-800 tracking-tight">
                          {card.label}
                        </span>
                        {card.isPaid && (
                          <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">Có tính công</span>
                        )}
                      </div>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="space-y-1.5 flex flex-col justify-start">
                      <Label className="text-[13px] font-semibold text-slate-700">
                         Lý do <span className="text-rose-500">*</span>
                      </Label>
                      <Select value={reasonType} onValueChange={(val) => setReasonType(val as "PERSONAL" | "COMPANY")}>
                        <SelectTrigger className="w-full text-[14px] bg-slate-50/50 h-10 border-slate-200">
                          <span className={reasonType === "" ? "text-slate-500" : ""}>
                            {reasonType === "" ? "-- Chọn loại lý do --" : reasonType === "PERSONAL" ? "Việc cá nhân" : "Việc công ty"}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PERSONAL">Việc cá nhân (Tối đa 90p)</SelectItem>
                          <SelectItem value="COMPANY">Việc công ty (Tối đa 8h)</SelectItem>
                        </SelectContent>
                      </Select>
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

                  {/* Duration Alert */}
                  {durationPreview > 0 && reasonType && (
                    <div className="mt-4 p-3 bg-amber-50/80 border border-amber-200/60 rounded-xl text-sm flex gap-3 text-amber-800 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                       <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-600">
                          <CalendarIcon size={14} />
                       </span>
                       <div className="flex flex-col">
                          <span className="font-semibold text-amber-900">
                             Thời gian vắng: {(durationPreview / 60).toFixed(1).replace(/\.0$/, '')} giờ ({durationPreview} phút)
                          </span>
                          <span className="text-amber-700/80 mt-0.5">
                             {reasonType === "PERSONAL" && durationPreview > 90 && (
                                "Lưu ý: Bạn chọn Việc cá nhân. Chỉ 90 phút được ghi nhận tính công, phần còn lại sẽ coi như vắng mặt không lương."
                             )}
                             {reasonType === "COMPANY" && durationPreview > 480 && (
                                "Lưu ý: Bạn chọn Việc công ty. Thời gian được tính cộng vào công trong ngày thay vì vắng mặt (tối đa 480 phút/ngày)."
                             )}
                          </span>
                       </div>
                    </div>
                  )}
                </>
              ) : type === "resign" ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
                    <div className="p-3 bg-indigo-50/80 border border-indigo-100 rounded-md text-sm text-indigo-700 flex items-center justify-between">
                      <span className="font-medium">
                        Tổng số ngày nghỉ dự kiến
                      </span>
                      <span className="text-base font-bold">
                        {calculatedDays} ngày
                      </span>
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
                </>
              )}
              
              {/* Type-Specific Helper Text */}
              <div className="mt-2 mb-1">
                {type === "checkInOut" && (
                   <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-lg text-indigo-900 relative overflow-hidden mb-2">
                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/80"></div>
                       <div className="pl-1.5">
                          <p className="font-semibold text-[13.5px] uppercase tracking-wide">Lưu ý đồng bộ chấm công</p>
                          <ul className="list-disc list-inside text-[13px] ml-1 space-y-1 opacity-90 mt-1">
                             <li><strong>Check-in:</strong> Chỉ điều chỉnh giờ vào làm. <strong>Check-out:</strong> Chỉ điều chỉnh giờ tan làm.</li>
                             <li>Hệ thống sẽ tự động tính lại công của bạn ngay sau khi đơn được duyệt.</li>
                             <li><strong>Lưu ý:</strong> Nếu máy chấm công tiếp tục ghi nhận dữ liệu mới của bạn sau đó, kết quả tính công cuối cùng có thể sẽ thay đổi dựa theo dữ liệu thực tế nhất.</li>
                          </ul>
                       </div>
                   </div>
                )}
                {type === "absent" && (
                   <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-lg text-indigo-900 relative overflow-hidden mb-2">
                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/80"></div>
                       <div className="pl-1.5">
                          <p className="font-semibold text-[13.5px] uppercase tracking-wide">Lưu ý đới với đơn vắng mặt</p>
                          <p className="text-[13px] opacity-90 leading-relaxed mt-1">Đơn này <strong>được tính công</strong>. Hệ thống sẽ sử dụng khung giờ bạn đăng ký làm dữ liệu check-in/out và tính lại báo cáo Summary sau khi duyệt.</p>
                       </div>
                   </div>
                )}
                {type === "resign" && (
                   <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-lg text-indigo-900 relative overflow-hidden mb-2">
                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/80"></div>
                       <div className="pl-1.5">
                          <p className="font-semibold text-[13.5px] uppercase tracking-wide">Cảnh báo đóng dữ liệu sau nghỉ việc</p>
                          <p className="text-[13px] opacity-90 leading-relaxed mt-1">Vui lòng làm việc đến hết <strong>Ngày làm việc cuối</strong>. Sau mốc thời gian này, phân vùng chấm công của bạn sẽ được đóng lại và không tiếp tục ghi nhận thêm bất kỳ dữ liệu nào.</p>
                       </div>
                   </div>
                )}
                {type === "leave" && (
                   <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-lg text-indigo-900 relative overflow-hidden mb-2">
                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/80"></div>
                       <div className="pl-1.5">
                          <p className="text-[13px] leading-relaxed"><strong>Đơn có trừ phép:</strong> Số ngày xin nghỉ sẽ bị trừ lập tức vào quỹ phép hiện tại khi đơn được phê duyệt. Hệ thống ghi nhận đây là những ngày có chấm công (có tính công).</p>
                       </div>
                   </div>
                )}
                {type === "wfh" && (
                   <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-lg text-indigo-900 relative overflow-hidden mb-2">
                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/80"></div>
                       <div className="pl-1.5">
                          <p className="text-[13px] leading-relaxed"><strong>Đơn có tính công:</strong> Ngày tương ứng sẽ được tự động tính là ngày đi làm hợp lệ trong tháng mà không yêu cầu bạn phải có dữ liệu quẹt thẻ.</p>
                       </div>
                   </div>
                )}
                {type === "business" && (
                   <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-lg text-indigo-900 relative overflow-hidden mb-2">
                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/80"></div>
                       <div className="pl-1.5">
                          <p className="text-[13px] leading-relaxed"><strong>Đơn có tính công:</strong> Thời gian đi công tác sẽ được tự động tính vào tổng số ngày làm việc trong tháng mà không cần dữ liệu điểm danh tại văn phòng.</p>
                       </div>
                   </div>
                )}
              </div>

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
                onClick={() => navigate("/app/requests")}
                className="h-11 px-6 font-medium text-slate-600 bg-white shadow-sm hover:bg-slate-50 border-slate-200"
              >
                Hủy
              </Button>
              <Button
                onClick={onSubmit}
                disabled={createMutation.isPending}
                className="h-11 px-8 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-medium shadow-sm transition-colors"
              >
                {createMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Tạo đơn
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
