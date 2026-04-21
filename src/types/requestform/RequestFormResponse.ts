import type {
  AbsenceReasonType,
  AttendanceAdjustmentTimeType,
  LeaveSessionType,
  RequestFormStatus,
  RequestFormType,
} from "./RequestFormEnums";

export interface RequestFormResponse {
  id: string;
  detailId: string;
  requesterId: string;
  requesterName: string;
  requesterEmployeeCode: string;
  type: RequestFormType;
  status: RequestFormStatus;
  description: string;
  startDate: string;
  startSession: LeaveSessionType;
  endDate: string;
  endSession: LeaveSessionType;
  absenceDate: string;
  fromTime: string;
  toTime: string;
  absenceReasonType?: AbsenceReasonType;
  timeType: AttendanceAdjustmentTimeType;
  attendanceDate: string;
  requestedTime: string;
  submissionDate: string;
  lastWorkingDate: string;
  resignationDate: string;
  submittedAt: string;
  approvedAt: string;
  rejectedAt: string;
  canceledAt: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
