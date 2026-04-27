import type {
  LeaveReasonType,
  AbsenceReasonType,
  AttendanceAdjustmentReasonType,
  BusinessTripReasonType,
  RequestFormType,
  RequestFormStatus,
} from "@/types/requestform/RequestFormEnums";
import type { RequestFormResponse } from "@/types/requestform/RequestFormResponse";

// ===== Leave reason labels =====

export const LEAVE_REASON_LABELS: Record<LeaveReasonType, string> = {
  ANNUAL_LEAVE: "Nghỉ phép năm",
  OTHER_LEAVE: "Nghỉ khác",
  SICK_RECUPERATION: "Nghỉ dưỡng sức ốm đau",
  CONFERENCE_STUDY: "Nghỉ hội nghị, học tập",
  MATERNITY_RECUPERATION: "Nghỉ dưỡng sức sau thai sản",
  INJURY_ACCIDENT_RECUPERATION: "Nghỉ dưỡng sức sau điều trị thương tật, tai nạn",
  ACCIDENT_LEAVE: "Nghỉ tai nạn",
  BEREAVEMENT_LEAVE: "Nghỉ tang chế",
  WEDDING_LEAVE: "Nghỉ đám cưới",
};

/** reasonType → có tính công hay không (FE display only, backend is source of truth) */
export const LEAVE_COUNTED_WORK: Record<LeaveReasonType, boolean> = {
  ANNUAL_LEAVE: true,
  OTHER_LEAVE: false,
  SICK_RECUPERATION: false,
  CONFERENCE_STUDY: false,
  MATERNITY_RECUPERATION: false,
  INJURY_ACCIDENT_RECUPERATION: false,
  ACCIDENT_LEAVE: false,
  BEREAVEMENT_LEAVE: true,
  WEDDING_LEAVE: true,
};

// ===== Absence reason labels =====

export const ABSENCE_REASON_LABELS: Record<AbsenceReasonType, string> = {
  CUSTOMER_MEETING: "Gặp khách hàng",
  PERSONAL_BUSINESS: "Việc cá nhân",
  OTHER: "Lý do khác",
  LATE_EARLY_UNDER_NINETY: "Đi xin muộn/về sớm (dưới 1 tiếng rưỡi)",
  BANK_OR_TAX: "Đi ngân hàng/Đi thuế",
  OFFICE_POWER_OUTAGE: "Văn phòng cúp điện",
  HEALTH_CHECKUP: "Đi khám sức khỏe tổng quát",
  EXHIBITION: "Đi triển lãm",
};

export const ABSENCE_COUNTED_WORK: Record<AbsenceReasonType, boolean> = {
  CUSTOMER_MEETING: true,
  PERSONAL_BUSINESS: false,
  OTHER: false,
  LATE_EARLY_UNDER_NINETY: true,
  BANK_OR_TAX: true,
  OFFICE_POWER_OUTAGE: true,
  HEALTH_CHECKUP: true,
  EXHIBITION: true,
};

// ===== Attendance adjustment reason labels =====

export const ATTENDANCE_ADJUSTMENT_REASON_LABELS: Record<AttendanceAdjustmentReasonType, string> = {
  FORGOT_FINGERPRINT: "Quên chốt vân tay",
  ATTENDANCE_MACHINE_BROKEN: "Máy chấm công hỏng",
  ACCOUNT_NOT_GRANTED_YET: "Chưa được cấp tài khoản",
};

// ===== Business trip reason labels =====

export const BUSINESS_TRIP_REASON_LABELS: Record<BusinessTripReasonType, string> = {
  CUSTOMER_MEETING: "Gặp gỡ khách hàng",
  CUSTOMER_CONFERENCE: "Hội nghị khách hàng",
  OTHER: "Khác",
  FACTORY_VISIT: "Tham quan nhà máy",
};

// ===== Form type labels =====

export const REQUEST_FORM_TYPE_LABELS: Record<RequestFormType, string> = {
  LEAVE: "Đơn nghỉ phép",
  ABSENCE: "Đơn vắng mặt",
  ATTENDANCE_ADJUSTMENT: "Đơn điều chỉnh chấm công",
  BUSINESS_TRIP: "Đơn công tác",
  WFH: "Đơn làm việc tại nhà",
  RESIGNATION: "Đơn thôi việc",
};

// ===== Status labels =====

export const REQUEST_FORM_STATUS_LABELS: Record<RequestFormStatus, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  CANCELED: "Đã hủy",
};

// ===== Helper functions =====

export function countedWorkLabel(value: boolean | null): string {
  if (value === true) return "Có tính công";
  if (value === false) return "Không tính công";
  return "—";
}

// ===== Type guards =====

export function isLeave(form: RequestFormResponse): boolean {
  return form.type === "LEAVE";
}

export function isAbsence(form: RequestFormResponse): boolean {
  return form.type === "ABSENCE";
}

export function isAttendanceAdjustment(form: RequestFormResponse): boolean {
  return form.type === "ATTENDANCE_ADJUSTMENT";
}

export function isBusinessTrip(form: RequestFormResponse): boolean {
  return form.type === "BUSINESS_TRIP";
}

export function isWfh(form: RequestFormResponse): boolean {
  return form.type === "WFH";
}

/** Active form types that FE allows creation of (no RESIGNATION) */
export const CREATABLE_FORM_TYPES: Exclude<RequestFormType, "RESIGNATION">[] = [
  "LEAVE",
  "ABSENCE",
  "ATTENDANCE_ADJUSTMENT",
  "BUSINESS_TRIP",
  "WFH",
];
