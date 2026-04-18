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
  currentLeaveDays?: number;
  maxLeaveDays?: number;
  currentWfhDays?: number;
  maxWfhDays?: number;
  groupId?: string;
  groupName?: string;
  groupPermissions?: GroupPermissionResponse[];
  requiredProfileCompleted?: boolean;
  todayAttendance?: AttendanceDailySummaryResponse;
  currentMonthAttendance?: AttendanceMonthlySummaryResponse;
}
