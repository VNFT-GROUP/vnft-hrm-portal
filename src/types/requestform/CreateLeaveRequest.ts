import type { LeaveReasonType, LeaveSessionType } from "./RequestFormEnums";

export interface CreateLeaveRequest {
  reasonType: LeaveReasonType;
  description?: string | null;
  startDate: string;       // YYYY-MM-DD
  startSession: LeaveSessionType;
  endDate: string;         // YYYY-MM-DD
  endSession: LeaveSessionType;
}
