export type AttendanceAdjustmentTimeType = "CHECK_IN" | "CHECK_OUT";

export type LeaveSessionType = 
  | "MORNING"
  | "AFTERNOON"
  | "FULL_DAY";

export type RequestFormAction = 
  | "SUBMIT"
  | "APPROVE"
  | "REJECT"
  | "CANCEL"
  | "COMMENT"
  | "REASSIGN";

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
