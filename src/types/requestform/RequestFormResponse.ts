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
  requesterName?: string | null;
  requesterEmployeeCode?: string | null;
  requesterDepartmentId?: string | null;
  requesterDepartmentName?: string | null;
  type: RequestFormType;
  status: RequestFormStatus;
  description: string;
  startDate?: string | null;
  startSession?: LeaveSessionType | null;
  endDate?: string | null;
  endSession?: LeaveSessionType | null;
  absenceDate?: string | null;
  fromTime?: string | null;
  toTime?: string | null;
  absenceReasonType?: AbsenceReasonType | null;
  timeType?: AttendanceAdjustmentTimeType | null;
  attendanceDate?: string | null;
  requestedTime?: string | null;
  submissionDate?: string | null;
  lastWorkingDate?: string | null;
  resignationDate?: string | null;
  submittedAt?: string | null;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  canceledAt?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
