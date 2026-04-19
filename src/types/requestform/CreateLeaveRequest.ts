import type { LeaveSessionType } from "./RequestFormEnums";

export interface CreateLeaveRequest {
  description: string;
  startDate: string;
  startSession: LeaveSessionType;
  endDate: string;
  endSession: LeaveSessionType;
}
