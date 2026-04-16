import type { GroupPermissionResponse } from '../group/GroupPermissionResponse';
import type { AttendanceDailySummaryResponse } from '../attendance/AttendanceDailySummaryResponse';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface UserSessionResponse {
  id: string;
  username: string;
  passwordChangedAt?: string;
  fullName?: string;
  englishName?: string;
  gender?: Gender;
  groupId?: string;
  groupName?: string;
  groupPermissions?: GroupPermissionResponse[];
  requiredProfileCompleted?: boolean;
  todayAttendance?: AttendanceDailySummaryResponse;
}
