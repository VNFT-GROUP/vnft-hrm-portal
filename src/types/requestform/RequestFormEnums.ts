export type AttendanceAdjustmentTimeType = "CHECK_IN" | "CHECK_OUT";

export type AbsenceReasonType = "PERSONAL" | "COMPANY";

export type LeaveSessionType = 
  | "MORNING"
  | "AFTERNOON"
  | "FULL_DAY";


export type RequestFormStatus = 
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELED";

export type RequestFormType = 
  | "LEAVE"
  | "ABSENCE"
  | "ATTENDANCE_ADJUSTMENT"
  | "BUSINESS_TRIP"
  | "WFH"
  | "RESIGNATION";

export type RequestFormStatisticPeriod =
  | "THIS_MONTH"
  | "ALL"
  | "RANGE";
