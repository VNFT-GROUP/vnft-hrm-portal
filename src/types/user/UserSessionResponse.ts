import type { GroupPermissionResponse } from '../group/GroupPermissionResponse';
import type { AttendanceDailySummaryResponse } from '../attendance/AttendanceDailySummaryResponse';
import type { AttendanceMonthlySummaryResponse } from '../attendance/AttendanceMonthlySummaryResponse';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface UserSessionResponse {
  id: string;
  username: string;
  passwordChangedAt?: string;
  fullName?: string;
  englishName?: string;
  gender?: Gender;
  avatarKey?: string;
  avatarUrl?: string;
  remainingLeaveDays?: number;
  maxLeaveDays?: number;
  remainingWfhDays?: number;
  maxWfhDays?: number;
  groupId?: string;
  groupName?: string;
  departmentId?: string;
  departmentName?: string;
  positionId?: string;
  positionName?: string;
  jobTitleId?: string;
  jobTitleName?: string;
  groupPermissions?: GroupPermissionResponse[];
  isManager?: boolean;
  requiredProfileCompleted?: boolean;
  todayAttendance?: AttendanceDailySummaryResponse;
  currentMonthAttendance?: AttendanceMonthlySummaryResponse;
}
