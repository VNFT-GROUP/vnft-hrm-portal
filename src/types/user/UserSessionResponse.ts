import type { GroupPermissionResponse } from '../group/GroupPermissionResponse';
import type { TodayAttendanceResponse } from '../attendance/TodayAttendanceResponse';

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
  todayAttendance?: TodayAttendanceResponse;
}
