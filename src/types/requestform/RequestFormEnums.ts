// ===== Form type & status =====

export type RequestFormType =
  | "LEAVE"
  | "ABSENCE"
  | "ATTENDANCE_ADJUSTMENT"
  | "BUSINESS_TRIP"
  | "WFH"
  | "RESIGNATION"; // legacy, FE không render form tạo mới

export type RequestFormStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELED";

// ===== Leave =====

export type LeaveReasonType =
  | "ANNUAL_LEAVE"
  | "OTHER_LEAVE"
  | "SICK_RECUPERATION"
  | "CONFERENCE_STUDY"
  | "MATERNITY_RECUPERATION"
  | "INJURY_ACCIDENT_RECUPERATION"
  | "ACCIDENT_LEAVE"
  | "BEREAVEMENT_LEAVE"
  | "WEDDING_LEAVE";

export type LeaveSessionType = "FULL_DAY" | "MORNING" | "AFTERNOON";

// ===== Absence =====

export type AbsenceReasonType =
  | "CUSTOMER_MEETING"
  | "PERSONAL_BUSINESS"
  | "OTHER"
  | "LATE_EARLY_UNDER_NINETY"
  | "BANK_OR_TAX"
  | "OFFICE_POWER_OUTAGE"
  | "HEALTH_CHECKUP"
  | "EXHIBITION";

// ===== Attendance Adjustment =====

export type AttendanceAdjustmentTimeType = "CHECK_IN" | "CHECK_OUT";

export type AttendanceAdjustmentReasonType =
  | "FORGOT_FINGERPRINT"
  | "ATTENDANCE_MACHINE_BROKEN"
  | "ACCOUNT_NOT_GRANTED_YET";

// ===== Business Trip =====

export type BusinessTripReasonType =
  | "CUSTOMER_MEETING"
  | "CUSTOMER_CONFERENCE"
  | "OTHER"
  | "FACTORY_VISIT";

// ===== Statistics =====

export type RequestFormStatisticPeriod =
  | "THIS_MONTH"
  | "ALL"
  | "RANGE";
