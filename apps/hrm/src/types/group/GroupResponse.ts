import type { GroupPermissionResponse } from "./GroupPermissionResponse";

export interface GroupResponse {
  id: string;
  name: string;
  description: string;
  groupPermissions: GroupPermissionResponse[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
