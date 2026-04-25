import type {
  AbsenceReasonType,
  AttendanceAdjustmentReasonType,
  AttendanceAdjustmentTimeType,
  BusinessTripReasonType,
  LeaveReasonType,
  LeaveSessionType,
  RequestFormStatus,
  RequestFormType,
} from "./RequestFormEnums";

export interface RequestFormResponse {
  id: string;
  detailId: string;
  requesterId: string;
  requesterName: string | null;
  requesterEmployeeCode: string | null;
  requesterDepartmentId: string | null;
  requesterDepartmentName: string | null;

  type: RequestFormType;
  status: RequestFormStatus;
  description: string | null;

  /** Backend-resolved: có tính công hay không */
  countedWork: boolean | null;

  // ── Leave fields ──
  leaveReasonType: LeaveReasonType | null;
  startDate: string | null;
  startSession: LeaveSessionType | null;
  endDate: string | null;
  endSession: LeaveSessionType | null;

  // ── Absence fields ──
  absenceDate: string | null;
  fromTime: string | null;
  toTime: string | null;
  absenceReasonType: AbsenceReasonType | null;

  // ── Attendance Adjustment fields ──
  attendanceAdjustmentReasonType: AttendanceAdjustmentReasonType | null;
  timeType: AttendanceAdjustmentTimeType | null;
  attendanceDate: string | null;
  requestedTime: string | null;

  // ── Business Trip fields ──
  businessTripMode: string | null;
  businessTripLocation: string | null;
  businessTripAddress: string | null;
  businessTripReasonType: BusinessTripReasonType | null;

  // ── Resignation fields (legacy) ──
  submissionDate: string | null;
  lastWorkingDate: string | null;
  resignationDate: string | null;

  // ── Timestamps ──
  submittedAt: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  canceledAt: string | null;

  // ── Audit ──
  active: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
}

/** Alias for list usage */
export type RequestFormListItem = RequestFormResponse;

/** Alias for detail usage */
export type RequestFormDetail = RequestFormResponse;
